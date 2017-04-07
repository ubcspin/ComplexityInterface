import numpy as np
# import matplotlib.pylab as plt
import pprint
from sklearn.preprocessing import normalize
import itertools
import operator
from multiprocessing import Pool
from functools import partial

pool = Pool(2)

Fs = 250
# f = 25
sample = 250

x = np.arange(sample)

spectrum_0 = [np.sin(2 * np.pi * f * x / Fs) for f in range(1,25)]
spectrum = [np.around(x, decimals=3) for x in spectrum_0]
# plt.plot(x, spectrum[0], 'r', x, spectrum[1], 'g', x, spectrum[2], 'b')
# plt.xlabel('voltage(V)')
# plt.ylabel('sample(n)')
# plt.show()

# plt.plot(x, np.sin(x))
# plt.show()

# print(x)


# k = (np.array([0, 0, 0]), np.array([1, 1, 0]), np.array([3, 3, 1]))
# print(np.sum(k, axis=0))

all_waves = []
acc = 0
for i in range(0, 10):
    combinations = list(itertools.combinations(spectrum, i))
    # superpositions = [np.sum(k, axis=0) for k in combinations]
    superpositions = pool.map(partial(np.sum, axis=0), combinations)
    all_waves += superpositions
    cnt = len(superpositions)
    acc += cnt
    print(cnt)
print(acc)

# outfile = open('wavelog.txt', 'w+')
# for wave in range(0, len(all_waves)):
fname = "waves/wavelog"
np.savez_compressed(fname, *all_waves)

# for w in all_waves:
#     print(len(w))

    # all_waves[wave].tofile(fname)
    # outfile.write(str(wave))
    # outfile.write("\n")
# outfile.close()
# plt.plot(x, superpositions[0+200], 'r', x, superpositions[1+200], 'g', x, superpositions[2+200], 'b')
# plt.show()