#!/usr/bin/env python

#For use compiled mse.c
#from pymse import MSE as MSE

#For use Python pure
from pymse import PyMSE as MSE

import numpy as np


#Create dataset, sin(x)
dataset = np.sin(np.linspace(0, 2*np.pi, 1000))

#Initialize mse
mse = MSE(dataset)

#result = mse.get(scale=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], m=2, r=0.15)  #first 10 scales
#result = mse.get(scale=15, m=2, r=0.15)  #only 15th scale
result = mse.get(scale=range(1, 21), m=2, r=0.15)  #from scale 1 to 20

for key in result["mse"]:
    print("MSE scale {}: {}".format(key, result["mse"][key]))
