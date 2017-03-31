from multiprocessing import Pool
from functools import partial
import random

def f(x, y, z):
    return x*x + y + z

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

if __name__ == '__main__':
    # p = Pool(5)
    # print(p.map(partial(f, y=2, z=1), [1,2,3]))
    # print(p.map(f, [1, 2, 3], 1))
    pool = Pool(4)
    population(100, 10000, 0, 1, pool)


