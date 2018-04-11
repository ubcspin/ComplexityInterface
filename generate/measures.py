from pymse import PyMSE as MSE
import numpy as np
import pprint

def multi_se(dataset):
	mse = MSE(dataset)
	out = mse.get(scale=range(1, 21), m=2, r=0.15)

	for key in out['mse']:
		print('MSE {} = {}'.format(key, out['mse'][key]))

	return out

def variance(dataset):
	out = np.var(dataset)
	print('VAR = ' % (out))
	return out

def spectral_density():
	out = 0
	print('PSD = ' % (out))
	return out

def main():
	'''
	Todo: import the generated waveform to here
	'''
	#Create dataset, sin(x)
	dataset = np.sin(np.linspace(0, 2*np.pi, 1000))
	multi_se(dataset)
	variance(dataset)

	

if __name__ == '__main__':
    main()
