import os
import json
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from keras.models import Sequential
from keras.layers import Dense, Flatten, Conv2D, MaxPooling2D
from keras.utils import np_utils

# X holds the images, y holds the labels
X, y = [], []

print()
print("Loading runic JSON files...")

# loop over all the data files
for filename in os.listdir('data/runes'):
  with open(f'data/runes/{filename}') as file:

    # parse the JSON within
    json_data = json.load(file)
    file.close

    # extract the image and the label from the JSON
    rune_image = np.array(json_data['data']).reshape(1, 24, 24)
    rune_name = json_data['rune']

    # add the image and the label to their respective arrays
    X.append(rune_image)
    y.append(rune_name)

    print(f"  ...'{rune_name}' from {filename}")

print()

# convert X and y to numpy arrays
X, y = np.array(X), np.array(y)

# scale the image data from 0...255 to 0.0...1.0
X = X.astype('float32')
X /= 255

# create an encoder for the labels
encoder = LabelEncoder()
encoder.fit([
  "fe", "ur", "thurs", "as", "reith", "kaun", "hagall", "nauthr",
  "isa", "ar", "sol", "tyr", "bjork", "mathr", "logr", "yr"
])

# convert the labels from strings to numbers
y = encoder.transform(y)

# convert the labels from numbers to one-hot encoding
Y = np_utils.to_categorical(y, 16)

# split for train and test
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2)

# configure the neural network
model = Sequential()
model.add(Dense(48, input_shape=(1, 24, 24), activation='relu'))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dense(16, activation='softmax'))

# compile the model
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# train it
model.fit(X_train, Y_train, batch_size=32, epochs=20, verbose=1)

# evaluate it
print()
print(model.evaluate(X_test, Y_test, verbose=0))
print()

# save it
model.save_weights('models/futhark_model.h5')
with open('models/futhark_model.json', 'w') as file:
  file.write(model.to_json())

print("Saved model to 'models/futhark_model.json' and 'models/futhark_model.h5'")
print()
