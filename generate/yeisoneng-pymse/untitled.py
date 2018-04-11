import numpy as np
import csv

with open(mse.csv, 'rb') as file:
	mse = csv.reader(file, delimiter=' ', quotechar='|')
	for row in mse:
		print '!!!'.join(row)

		
