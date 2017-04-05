import entropy as en
import sampen2 as se2
import numpy as np
import pprint
import random
from scipy.stats import entropy

x1 = [random.random() for i in range(1000)]
x = np.array(x1)

temp = 5
np
ent  = entropy(x)
se_1 = en.sample_entropy(x, temp)
se_2 = se2.sampen2(x, mm=temp)
mse  = en.multiscale_entropy(x, temp, tolerance=(np.std(x) * 0.2))

print(ent)
for i in range(0,len(se_1)):
    print("SE1   %.4f \t SE2   %.4f \t MSE   %.4f" % (se_1[i], se_2[i][1], mse[i]) ) 


print(mse)