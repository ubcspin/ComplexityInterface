from pymse import PyMSE as MSE
import numpy as np
import matplotlib.pyplot as plt 
# import plotly.plotly as py
import os
import pprint
import json
import re
from scipy import stats
import csv

# This method is used to write mse of every behaviour to a csv file
def compare_mse(Fs):
	array = []
	title = ['']

# Change the number to the name of the measured json files
	for c in range(0, 55):
		name = "behaviours/" + str(c) + ".json"
		data = open(name, "r").read()
		data = re.findall(r"[-+]?\d*\.\d+|\d+", data)
		data = list(map(float, data))

		#normalize the position data
		mean = reduce(lambda x, y: x+y, data) / len(data)
		data = [x-mean for x in data]

		#get rid of the last few digits to make sure the length is 1500 
		dataset = np.asarray(data[:int(Fs)])

		mse = MSE(dataset)
		out = mse.get(scale=range(1, 40), m=2, r=1.5)

		scale_list = []
		for key in out['mse']:
			scale_list.append(key)

		title.extend(scale_list)

		mse_list = []
		for m in out['mse']:
			mse_list.append(out['mse'][m])

		entry = [str(c)]
		entry.extend(mse_list)

		array.append(entry)

	with open('test_mse.csv', 'wb') as myfile:
		wr = csv.writer(myfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL, lineterminator='\n')
		wr.writerow(title)
		for item in array:
			wr.writerow(item)

def main():

	#Create dataset, sin(x)
	Fs = 1500.0 #sampling rate
	# Ts = 1.0/Fs #sampling interval
	# t = np.arange(0, 1, Ts) #time vecto2

	# ff = 20

	# calculate measures
	compare_mse(Fs)
	

if __name__ == '__main__':
    main()


