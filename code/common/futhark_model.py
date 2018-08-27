import os
os.environ['KERAS_BACKEND'] = 'theano'

import numpy as np

from keras.models import Sequential, model_from_json
from keras.layers import Dense, Dropout, Activation, Flatten, Conv2D, MaxPooling2D
from keras.utils import np_utils
from keras import backend as K
K.set_image_dim_ordering('th')

from sklearn.model_selection import train_test_split

class FutharkModel:

  def build(self, X, y):
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

    model.fit(X_train, Y_train, batch_size=32, epochs=50, verbose=1)

    self.__model = model

    return model.evaluate(X_test, Y_test, verbose=0)

  def save(self):
    model_json = self.__model.to_json()
    with open('model/futhark_model.json', 'w') as json_file:
      json_file.write(model_json)
    self.__model.save_weights('model/futhark_model.h5')

  def load(self):
    with open('model/futhark_model.json', 'r') as json_file:
      model_json = json_file.read()
      json_file.close()

    self.__model = model_from_json(model_json)
    self.__model.load_weights('model/futhark_model.h5')

  def predict(self, X):
    return self.__model.predict_classes(X.reshape(1, 1, 24, 24))[0]
