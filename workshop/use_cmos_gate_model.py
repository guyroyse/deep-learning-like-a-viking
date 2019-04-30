import json

import numpy as np

from keras.models import model_from_json
from sklearn.preprocessing import LabelEncoder

# load the model structure and weights from the saved files
with open('models/cmos_gate_model.json', 'r') as file:
  model_json = file.read()
  file.close()

model = model_from_json(model_json)
model.load_weights('models/cmos_gate_model.h5')

print()
print("Loading models from 'models/cmos_gate_model.json' and 'models/cmos_gate_model.h5'")
print()

# setup the label encoder
encoder = LabelEncoder()
encoder.fit([True, False])

# try out the model
input_voltages = np.array([[0.0, 0.0], [5.0, 5.0], [0.5, 4.5], [4.5, 0.5], [2.5, 2.5]])
results = model.predict(input_voltages)
result_classes = model.predict_classes(input_voltages)
result_labels = encoder.inverse_transform(result_classes)

# print the results
print("V1\tV2\tResult")
for i in range(len(input_voltages)):
  print(input_voltages[i][0], end='\t')
  print(input_voltages[i][1], end='\t')
  print(result_labels[i], end='\t')
  print("(", end='')
  print(encoder.classes_[0], end=' ')
  print(f"{results[i][0]:.12f}", end=', ')
  print(encoder.classes_[1], end=' ')
  print(f"{results[i][1]:.12f}", end='')
  print(")")
