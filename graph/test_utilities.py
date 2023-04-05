from math import sqrt

import networkx as nx
import pytest

from .utilities import expander_from_cycles, random_cycle, sort_tuple


def factorial(n):
    if n == 1:
        return 1
    return n * factorial(n - 1)

def test_edge_cases():
    assert random_cycle(0) == [], "Should return empty array"
    assert random_cycle(1) == [], "Should return empty array"

    assert len(expander_from_cycles(0,0)) == 0, "No expander with 0 vertices"
    assert len(expander_from_cycles(0,1)) == 0, "No expander with 1 vertex"
    assert len(expander_from_cycles(0,2)) == 2, "2-cycle"
    assert len(expander_from_cycles(0,3)) == 3, "3-cycle"

@pytest.mark.parametrize("N", [2, 3, 4])
def test_random_cycle(N):
    iterations = 1000
    count = 0
    cycles = {}

    while count < iterations:
        cycle = tuple(random_cycle(N))

        if cycle in cycles:
            cycles[cycle] += 1
        else:
            cycles[cycle] = 1

        count += 1

    # Generates all cycles
    assert len(cycles) == factorial(N - 1), "There are N!/N distinct cycles up to permutation"
    assert all(map(lambda x: x[0] == 0, list(cycles.keys()))), "All cycles start at 0"

    # Cycles have uniform probability
    frequencies = list(map(lambda x: x / iterations, cycles.values()))

    assert max(frequencies) <= 1 / len(cycles) + 1 / sqrt(
        N
    ), "All the frequencies should be in the confidence interval"
    assert min(frequencies) >= 1 / len(cycles) - 1 / sqrt(
        N
    ), "All the frequencies should be in the confidence interval"


def test_sort_tuple():
    assert sort_tuple((0, 1)) == (0, 1)
    assert sort_tuple((2, 1)) == (1, 2)


@pytest.mark.parametrize("k, N", [(2, 7), (3, 9), (4, 10)])
def test_expander_from_cycles(k, N):

    edges = expander_from_cycles(k, N)

    G = nx.Graph()
    G.add_nodes_from(range(N))
    G.add_edges_from(edges)

    assert len(edges) == k * N, "The graph has kN edges"
    assert nx.is_k_regular(G, 2 * k), "The graph is 2k-regular"
