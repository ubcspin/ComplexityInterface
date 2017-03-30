import entropy as en
import sampen2 as se2
import numpy as np
x = np.array([0,1,2,3,4,5,4,3,2,1,2,3,4,5,4,3,2,1,2,3,4,5,4,3,2,1,0])

print(en.sample_entropy(x, 2))
print(se2.sampen2(x))