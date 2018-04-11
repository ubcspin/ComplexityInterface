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

def multi_se(dataset):
	
	scale = 40

	mse = MSE(dataset)
	out = mse.get(scale=range(1, scale), m=2, r=1.5)

	scale_list = []
	for key in out['mse']:
		scale_list.append(key)

	mse_list = []
	for m in out['mse']:
		mse_list.append(out['mse'][m])

	plt.plot(scale_list, mse_list, 'ro')
	plt.axis([0, scale, 0, 4])
	plt.show()

	return out

def variance(dataset):
	out = np.var(dataset, ddof=1)
	print('VAR = {}'.format(out))
	return out

def spectral_density(dataset, Fs):

	n = len(dataset)
	k = np.arange(n)
	T = n/Fs
	frq = k/T
	frq = frq[range(n/2)]

	# compute fft
	out = np.fft.fft(dataset)
	out = out[range(n/2)]
	out = np.abs(out)**2

	# slope, intercept, r_value, p_value, std_err = stats.linregress(np.log10(frq+1), np.log10(out))
	# slope, intercept, r_value, p_value, std_err = stats.linregress(frq, out)
	kurtosis = stats.kurtosis(out, fisher=False)
	std = np.std(out)
	peak = 0.0

	for o in out:
		if ( o > ( 2.6*std + np.mean(abs(out)))):
			peak = peak + 1
		# if ( o > ( std + np.mean(out))):
		# 	peak = peak + 1


	# normalize the result
	# peak = peak / 50

	#plot the resulpbucci@gmail.comt 
	# plt.loglog(frq, out, basex = 10, basey = 10)
	# plt.plot(np.log(frq), out)

	# plt.show()

	# print('PSD kurtosis = {}'.format(kurtosis))
	# print('fft std = {}'.format(std))
	# print('fft slope = {}'.format(slope))
	print('fft number of peaks = {}'.format(peak))
	# print('fft number of peaks with threshold = {}'.format(peak_threshold))
	return peak

def compare_psd( Fs):
	array = []
	title = ['']

	title.extend('spectral distribution')

	# read the generated json file 
	for c in range(0, 55):
		name = str(c) + ".json"
		data = open(name, "r").read()
		data = re.findall(r"[-+]?\d*\.\d+|\d+", data)
		data = list(map(float, data))

		#normalize the position data
		mean = reduce(lambda x, y: x+y, data) / len(data)
		data = [x-mean for x in data]

		#get rid of the last few digits to make sure the length is 1500 
		dataset = np.asarray(data[:int(Fs)])

		out = spectral_density(dataset, Fs)

		entry = [str(c)]
		entry.append(out)

		array.append(entry)

	with open('spect.csv', 'wb') as myfile:
		wr = csv.writer(myfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL, lineterminator='\n')
		wr.writerow(title)
		for item in array:
			wr.writerow(item)


# This method is used to write mse of every behaviour to a csv file
def compare_mse(Fs):
	array = []
	title = ['']

	for c in range(0, 55):
		name = str(c) + ".json"
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

	with open('mse.csv', 'wb') as myfile:
		wr = csv.writer(myfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL, lineterminator='\n')
		wr.writerow(title)
		for item in array:
			wr.writerow(item)

def main():
	'''
	Todo: import the generated waveform to here
	'''
	#Create dataset, sin(x)
	Fs = 1500.0 #sampling rate
	# Ts = 1.0/Fs #sampling interval
	# t = np.arange(0, 1, Ts) #time vecto2

	# ff = 20


	# #    # Test: sine wave
	# x = np.linspace(0, ff*2*np.pi, Fs)
	# dataset = ( np.sin(x) +  np.sin(2*x) + np.sin(4*x)) * 31 /3
	# print(len(dataset))

	#    # Test: white noise
	# dataset = np.random.normal(loc = 0, scale = 20, size = Fs)

	# read the generated json file 
	data = open("behaviours/52.json", "r").read()
	data = re.findall(r"[-+]?\d*\.\d+|\d+", data)
	data = list(map(float, data))

	# #normalize the position data
	# # mean = reduce(lambda x, y: x+y, data) / len(data)
	# # data = [x-mean for x in data]

	#get rid of the last few digits to make sure the length is 1500 
	dataset = np.asarray(data[: int(Fs)])
	# # #draw the waveform
	# print(len(dataset))
	Fs = len(dataset)
	x = np.linspace(0, Fs, Fs)
	plt.plot(x, dataset)
	plt.show()
	# # calculate measures
	# multi_se(dataset)
	# variance(dataset)
	# spectral_density(dataset, Fs)

	# compare_psd(Fs)
	# compare_mse(Fs)
	

if __name__ == '__main__':
    main()


