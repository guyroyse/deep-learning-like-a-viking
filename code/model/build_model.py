import os
os.environ['KERAS_BACKEND'] = 'theano'

import json
import numpy as np
np.random.seed(42) # consistency is the hobgoblin of small minds

from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras.utils import np_utils

from keras import backend as K
K.set_image_dim_ordering('th')

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

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

label_encoder = LabelEncoder()

y = label_encoder.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

X_train = X_train.astype('float32')
X_test = X_test.astype('float32')
X_train /= 255
X_test /= 255

Y_train = np_utils.to_categorical(y_train, 16)
Y_test = np_utils.to_categorical(y_test, 16)

model = Sequential()
model.add(Conv2D(48, (3, 3), activation='relu', input_shape=(1, 24, 24)))
model.add(Conv2D(48, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2,2)))
model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(16, activation='softmax'))

model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

model.fit(X_train, Y_train, batch_size=32, epochs=10, verbose=1)

score = model.evaluate(X_test, Y_test, verbose=0)

print(score)

# serialize model to JSON
model_json = model.to_json()
with open("futhark_model.json", "w") as json_file:
  json_file.write(model_json)

# serialize weights to HDF5
model.save_weights("futhark_model.h5")
