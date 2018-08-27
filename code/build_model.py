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

from common.rune_file import RuneFile
from common.futhark_model import FutharkModel

X, y = [], []

for filename in os.listdir('data'):
  file = RuneFile.from_file(f'data/{filename}')
  X.append(file.rune_data)
  y.append(file.rune_name)

X = np.array(X)
y = np.array(y)

label_encoder = LabelEncoder()

y = label_encoder.fit_transform(y)

model = FutharkModel()
score = model.build(X, y)
model.save()

print(score)
