import os
import json
import numpy as np

x, y = [], []

for filename in os.listdir('../data'):
  with open(f'../data/{filename}') as file:
    data = json.load(file)
    x_item = np.array(data['data'])
    x_item = x_item.reshape(1, 24, 24)
    y_item = data['rune']
    x.append(x_item)
    y.append(y_item)

x = np.array(x)
y = np.array(y)
print(x.shape)
print(y)
print(y.shape)
