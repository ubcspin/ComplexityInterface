'''

Adapted from

http://lethain.com/genetic-algorithms-cool-name-damn-simple/

'''

from operator import add
import random
import numpy as np
import pprint
import entropy as ent
import sampen2 as se2
import time
import math
from multiprocessing import Pool
from functools import partial


def rand_ind(i, min, max):
    return random.uniform(min,max)

def individual(length, min, max, pool):
    '''Create a member of the population.'''
    vec = [1 for x in range(length)]
    out = pool.map(partial(rand_ind, min=min, max=max), vec)
    return out


def population(count, length, min, max, pool):
    """
    Create a number of individuals (i.e. a population).

    count: the number of individuals in the population
    length: the number of values per individual
    min: the min possible value in an individual's list of values
    max: the max possible value in an individual's list of values

    """
    print('Generating population of size %d...' % (count))
    return [ individual(length, min, max, pool) for x in range(count) ]


def fitness(individual, target):
    """
    Determine the fitness of an individual. Lower is better.

    individual: the individual to evaluate
    target: the sum of numbers that individuals are aiming for
    """

    tolerance = 0.2 * np.std(individual)
    se = se2.sampen2(individual, 2, r=tolerance)

    return se[-1]


def fitnesst(i, target):
    return (fitness(i, target), i)

def avg_grade(pop, target, pool):
    '''Find average fitness for a population.'''
    summed = 0
    
    evaluated = pool.map(partial(fitness, target=target), pop)

    for i in evaluated:
        summed += i
    return summed / float(len(pop))


def kill(pop, target, retain, random_select, pool):
    '''
    Take a population, kill off (1 - retain) percent, add back in some
    random people, produce next set of parents.

    pop           : list of (list of int)
    target        : int
    retain        : float, 0 <= retain <= 1
    random_select : float, 0 <= float  <= 1 

    '''

    # assign a fitness to each individual in a population
    # graded = [ (fitness(i, target), i) for i in pop ]

    graded_t = pool.map(partial(fitnesst, target=target), pop)

    # sort by grade...
    sorted_graded_t = sorted(graded_t, key=lambda tup: tup[0])

    pprint.pprint([x[0] for x in sorted_graded_t])
    # then unpack the individual
    graded = [ x[1] for x in sorted_graded_t]

    # kill off the lowest (1 - retain) percent of population
    retain_length = int(len(graded)*retain)
    parents = graded[:retain_length]

    # randomly add other individuals to promote genetic diversity
    for individual in graded[retain_length:]:
        if random_select > random.random():
            parents.append(individual)

    return parents


def mutate(pop, mutate_prob):
    # mutate some individuals
    for individual in pop:
        if mutate_prob > random.random():
            pos_to_mutate = random.randint(0, len(individual)-1)
            # this mutation is not ideal, because it
            # restricts the range of possible values,
            # but the function is unaware of the min/max
            # values used to create the individuals,
            individual[pos_to_mutate] = rand_ind(1, 
                min(individual), max(individual))
    return pop


def evolve(pop, target, pool, retain=0.2, random_select=0.05, mutate_prob=0.01):
    print('Killing off individuals with fitness less than %f of population max...' % (retain))
    parents = kill(pop, target, retain, random_select, pool)
    
    print('Mutating with %f probability...' % (mutate_prob))
    parents = mutate(parents, mutate_prob)

    # crossover parents to create children
    print('Mixing for next generation...')
    parents_length = len(parents)
    desired_length = len(pop) - parents_length
    children = []

    while len(children) < desired_length:
        male = random.randint(0, parents_length-1)
        female = random.randint(0, parents_length-1)

        if male != female:
            male = parents[male]
            female = parents[female]
            half = int(len(male) / 2)
            child = male[:half] + female[half:]
            children.append(child)
            
    parents.extend(children)
    return parents


def main():
    ''' 
    The Appropriate Use of Approximate Entropy and Sample Entropy with Short Data Sets
    DOI: 10.1007/s10439-012-0668-3 
    
    Our results demonstrate that both ApEn and SampEn are extremely sensitive to parameter choices, 
    especially for very short data sets, N ≤ 200. We suggest using:

         N larger than 200, 
         an m of 2 

    and examine several r values before selecting your parameters.
    '''

    target = 1.5 # target utility value, sample entropy right now

    i_min = 0
    i_max = 1.0

    individual_length = 250 # a.k.a N from above
    population_size = 1000
    num_iterations = 5

    pool = Pool(25)
    
    p = population(population_size, individual_length, i_min, i_max, pool)
    
    print("Doing average grade for current population...")
    fitness_history = [(avg_grade(p, target, pool), p)]
    
    # last_run = datetime.g
    print('Starting generation...')
    for i in range(num_iterations):
        print("Running iteration", i)
        p = evolve(p, target, pool)
        fitness_history.append((avg_grade(p, target, pool),p))

    # print history
    # for datum in fitness_history:
    #     print(datum[0])

    print('Writing to file...')
    outfile = open('log_' + str(math.floor(time.time())) + '.txt', 'a+')
    
    for datum in fitness_history:
        pprint.pprint("Average grade: %f" % (datum[0]), stream=outfile)
        pprint.pprint(datum[1], stream=outfile)


if __name__ == '__main__':
    main()