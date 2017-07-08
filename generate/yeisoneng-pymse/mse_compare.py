import numpy as np
import csv

with open('mse.csv', 'rb') as file:
	reader = csv.reader(file, delimiter="\t")
	mse = {}

	for line in enumerate(reader):

		x = line[0] - 1
		if x > 0:
			row = line[1:][0][0]
			row = [float(y) for y in row.split(',')]
			mse[x] = row[1:]



	# Sort behaviours based on: 
	# 	- A is ranked higher, if there are more scales in which 
	# 	entropy of A is higher than entropy of B
	rank = {}
	for i in range(1,55):
		winner = mse.keys()[0]
		for n in mse:
			dif = list(np.subtract(mse[winner], mse[n]))
			count = 0
			for d in dif:
				if d > 0:
					count = count + 1

			if count < 21:
				winner = n

		rank[i] = winner
		del mse[winner]

	print(rank)


