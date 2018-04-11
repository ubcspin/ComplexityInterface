import os
import re
import pprint
import json
import numpy as np

def main():

	data = open("5.json", "r").read()
	data = re.findall(r"[-+]?\d*\.\d+|\d+", data)
	data = list(map(float, data))

	#for auto generate behaviour
	# Fs = 1500.0 #sampling rate
	# Ts = 1.0/Fs #sampling interval
	# t = np.arange(0, 1, Ts) #time vector

	# ff = 4

	# # x = np.linspace(0, 2*np.pi*ff, Fs)
	# # data = np.sin(x)  * 31

	# data = np.random.normal(loc = 0, scale = 20, size = Fs)

	pos_list = []

	count = 1
	for d in data:
		temp = {}
		temp['id'] = count
		temp['t'] = (count * 3000)/len(data)
		# temp['value'] = (d / 65) 
		temp['value'] = (d /40.5) -0.65 
		temp['selected'] = 'false'

		count = count + 1
		pos_list.append(temp)

	json_data = {}
	json_data['duration'] = 3000
	json_data['selected'] = 'true'
	json_data['selectedTimeRange'] = {}

	pos_data = {}
	pos_data['valueScale'] = [0, 1]
	pos_data['data'] = pos_list

	json_data['parameters'] = {'position': pos_data}

	with open('5mac.json', 'w') as outfile:
		outfile.write(json.dumps(json_data))





if __name__ == '__main__':
    main()