from itertools import pairwise

import numpy as np


def random_cycle(size):
    """
    Returns a random cycle of given size using Durstenfeld algorithm
    https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm

    Note: this is faster than np.random.permutation since there are only (n-1)! cycles against n! permutations of size n
    """

    if size == 0 or size == 1:
        return []
    else:
        return np.concatenate(np.random.permutation(size - 1), [size - 1])


def expander_from_cycles(k, N):
    """
    k = number of random cycles
    N = size of cycles

    Finds k random cycles of size N sharing no edge, so a graph made from these edges will be 2k-regular of degree N.

    Returns the list of edges
    """
    if N < 2:
        return []
    elif N < 5:
        cycle = range(N)
        return [*list(pairwise(cycle)), (cycle[-1], cycle[0])]

    assert k > 1, "You need at least 2 cycles"
    assert N * (N - 1) > 2 * k, f"There is not enough room for {k} cycles in a graph of size {N}"

    cycles = []
    edges = set()

    for i in range(k):
        while len(edges) != (i + 1) * N:
            cycle = random_cycle(N)

            cycle_edges = [*list(pairwise(cycle)), (cycle[-1], cycle[0])]
            cycle_edges_sorted = list(map(lambda x: tuple(sorted(x)), cycle_edges))
            edges_copy = set([*edges, *cycle_edges_sorted])

            if len(edges_copy) == len(edges) + N:
                cycles.append(cycle)
                edges = set([*edges_copy])

    return list(edges)
