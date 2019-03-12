import os

import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from keras.models import Sequential
from keras.layers import Dense, Flatten, Conv2D, MaxPooling2D
from keras.utils import np_utils

from rune_data import RuneData

runes = [
  "fe", "ur", "thurs", "as", "reith", "kaun", "hagall", "nauthr",
  "isa", "ar", "sol", "tyr", "bjork", "mathr", "logr", "yr"
]

encoder = LabelEncoder()
encoder.fit(runes)

X, y = [], []

print()
print("Loading runic JSON files...")

for filename in os.listdir('../code/data'):
  rune = RuneData.from_file(f'../code/data/{filename}')
  X.append(rune.image_data)
  y.append(rune.rune_name)
  print(f"  ...'{rune.rune_name}' from {filename}")

y = encoder.transform(y)

X = np.array(X)
y = np.array(y)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

X_train = X_train.astype('float32')
X_test = X_test.astype('float32')
X_train /= 255
X_test /= 255

Y_train = np_utils.to_categorical(y_train, 16)
Y_test = np_utils.to_categorical(y_test, 16)

model = Sequential()
model.add(Conv2D(48, (3, 3), activation='relu', data_format='channels_first', input_shape=(1, 24, 24)))
model.add(MaxPooling2D(pool_size=(2,2)))
model.add(Conv2D(24, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2,2)))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dense(16, activation='softmax'))

model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

model.fit(X_train, Y_train, batch_size=32, epochs=20, verbose=1)

print(model.evaluate(X_test, Y_test, verbose=0))

print(encoder.inverse_transform(model.predict_classes(X_test)))
