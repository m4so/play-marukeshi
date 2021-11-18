import numpy as np
base = "line2dots"
np.save(base+".npy", np.array(np.load(base + "_int64.npy"), np.int8))