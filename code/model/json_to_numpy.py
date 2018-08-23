import os
import json
import numpy as np
np.random.seed(42) # consistency is the hobgoblin of small minds

from sklearn.model_selection import train_test_split

X, y = [], []

for filename in os.listdir('../data'):
  with open(f'../data/{filename}') as file:
    data = json.load(file)
    X_item = np.array(data['data'])
    X_item = X_item.reshape(1, 24, 24)
    y_item = data['rune']
    X.append(X_item)
    y.append(y_item)

X = np.array(X)
y = np.array(y)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(X_train.shape)
print(y_train.shape)
print(y_train)

print(X_test.shape)
print(y_test.shape)
print(y_test)
