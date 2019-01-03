import os
import numpy as np

from rune_data import RuneData
from futhark_model import FutharkModel
from futhark_labels import FutharkLabels

model = FutharkModel()
labels = FutharkLabels()

X, y = [], []

print()
print("Loading runic JSON files...")

for filename in os.listdir('data'):
  rune = RuneData.from_file(f'data/{filename}')
  X.append(rune.image_data)
  y.append(rune.rune_name)
  print(f"  ...'{rune.rune_name}' from {filename}")

X = np.array(X)
y = np.array(y)

y = labels.encode(y)

print()
print("Building model...")

score = model.build(X, y)
model.save()

print()
print("Modeled saved")
print()

print("Model Score:", score)
print()
