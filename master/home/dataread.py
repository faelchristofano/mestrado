import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
#%matplotlib inline

print('teste')
def loadData(data):
    parse_json = json.loads(data)
    print(json.dumps(parse_json, indent=4, sort_keys=True))