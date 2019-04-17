import pandas as pd

import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from keras.models import Sequential
from keras.layers import Dense
from keras.utils import np_utils

# x holds the voltages, y holds the labels
x, y = [], []

# read the dat from the CSV
data = pd.read_csv('data/cmos/cmos-gate.csv', encoding='utf-8')
X = data.filter(items=['input_voltage_1','input_voltage_2'])
y = data.filter(items=['output_value'])

# convert X and y to numpy arrays
X, y = np.array(X), np.array(y).flatten()

# create an encoder for the labels
encoder = LabelEncoder()
encoder.fit([True, False])

# convert the labels from strings to numbers
y = encoder.transform(y)

# convert the labels from numbers to one-hot encoding
Y = np_utils.to_categorical(y, 2)

# split for train and test
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2)

# configure the neural network
model = Sequential()
model.add(Dense(24, input_shape=(2, ), activation='relu'))
model.add(Dense(2, activation='softmax'))

# compile the model
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# train it
model.fit(X_train, Y_train, batch_size=32, epochs=5, verbose=1)

# evaluate it
print()
print(model.evaluate(X_test, Y_test, verbose=0))
print()

# save it
model.save_weights('models/cmos_gate_model.h5')
with open('models/cmos_gate_model.json', 'w') as file:
  file.write(model.to_json())

print("Saved model to 'models/cmos_gate_model.h5' and 'models/cmos_gate_model.json'")
print()
