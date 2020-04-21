import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
#%matplotlib inline

def loadData(data):
    parse_json = json.loads(data)
    with open('data.json','w') as outfile:
        json.dump(parse_json, outfile)
    #print(json.dumps(parse_json, indent=4, sort_keys=True))
    df = pd.DataFrame(parse_json)
    summarizeCategories(df["categories"])

#def summarizeCategories(categories):

