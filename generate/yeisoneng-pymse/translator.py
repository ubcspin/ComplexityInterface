import os
import re
import pprint
import json

def main():

	# change the file name to whatever being translated
	json_data = open("5mac.json", "r").read()
	data = json.loads(json_data)

	pos_list = data['parameters']['position']['data']

	out = []

	for x in range(0,len(pos_list)):
		# The parameter 65 might need to be adjusted
		value = data['parameters']['position']['data'][x]['value'] * 65
		out.append(value)
	out = out[:1500]

	with open('5.json', 'w') as outfile:
		for o in out:
			outfile.write("%s, " % o)




if __name__ == '__main__':
    main()