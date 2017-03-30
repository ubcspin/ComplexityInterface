
# Sample Entropy #

Sample Entropy is a useful tool for investigating the dynamics of heart rate and other time series. Sample Entropy is the negative natural logarithm of an estimate of the conditional probability that subseries (epochs) of length m that match pointwise within a tolerance r also match at the next point.

This program calculates the sample entropy of the time series given in the specified (text format) input-file. (If no input-file is specified, sampen reads the time series from its standard input.) The outputs are the sample entropies of the input, for all epoch lengths of 1 to a specified maximum length, m.

# Multiescale Sample Entropy #

Traditional approaches to measuring the complexity of biological signals fail to account for the multiple time scales inherent in such time series. These algorithms have yielded contradictory findings when applied to
real-world datasets obtained in health and disease states. We describe in detail the basis and implementation of the multiscale entropy (MSE) method. We extend and elaborate previous findings showing its applicability to the fluctuations of the human heartbeat under physiologic and pathologic conditions. The method consistently indicates a loss of complexity with aging, with an erratic cardiac arrhythmia (atrial fibrillation), and with a life-threatening syndrome (congestive heart failure). Further, these different conditions have distinct MSE curve profiles, suggesting diagnostic uses. The results support a general “complexity-loss” theory of aging and disease. We also apply the method to the analysis of coding and noncoding DNA sequences and find that the
latter have higher multiscale entropy, consistent with the emerging view that so-called "junk DNA" sequences contain important biological information.




----

* http://physionet.org/physiotools/mse/papers
* http://physionet.org/physiotools/sampen
* http://physionet.org/physiotools/mse/mse.c
