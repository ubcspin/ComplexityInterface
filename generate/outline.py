def individual(params):
    ''' stub '''
    return 1

def population(size):
    ''' stub '''
    return [individual() for i in range(size)]

def fitness(ind):
    ''' stub '''
    return 1

def kill(pop, tolerance):
    ''' 
    Kill off a percentage of low-fitness individuals, keeping some
    random ones alive.
    '''
    new_pop = [i for i in pop if fitness(i) > tolerance]
    
    return new_pop

def merge(m,f):
    ''' stub '''
    return m

def mutate(pop):
    return pop

def propogate(pop):
    return pop

def next_gen(pop):
    ''' stub '''
    parents  = kill(pop)
    mutated  = mutate(parents)
    children = propogate(mutated)
    return children


def main():
    pass

if __name__ == '__main__':
    main()