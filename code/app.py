import os
import json

import numpy as np
import tensorflow as tf

from flask import Flask, send_from_directory, request, jsonify

from tensorflow.keras.models import model_from_json
from sklearn.preprocessing import LabelEncoder

from uuid import uuid4

# the Flask app
app = Flask(__name__, instance_relative_config=True)

# make the model global so we can reuse it
global model

# load the model structure and weights for the saved off files
with open('model/futhark_model.json', 'r') as file:
  model_json = file.read()
  file.close()

model = model_from_json(model_json)
model.load_weights('model/futhark_model.h5')

# setup the label encoder
encoder = LabelEncoder()
encoder.fit([
  "fe", "ur", "thurs", "as", "reith", "kaun", "hagall", "nauthr",
  "isa", "ar", "sol", "tyr", "bjork", "mathr", "logr", "yr"
])



# saving runes
@app.route('/rune/save', methods=['POST'])
def save_rune():

  # get the JSON containing the name and image of the rune
  rune_json = request.get_json()

  # generate a random filename
  filename = f'{str(uuid4())}.json'

  # write the contents of the rune out to the file
  with open(f'data/{filename}', 'w') as file:
    file.write(json.dumps(rune_json))
    file.close

  # tell everyone about it
  print(f"Saving rune '{rune_json['rune']}' to file {filename}")

  # return a simple OK message
  return jsonify(message="OK")



# detecting runes
@app.route('/rune/detect', methods=['POST'])
def detect_rune():

  # get the JSON containing the image of the rune
  rune_json = request.get_json()

  # print out the data for the image in a human friendly fashion
  for row in rune_json['data']:
    print()
    for cell in row:
      print("{:^4d}".format(cell), end='')

  print()

  # convert the image to numpy for use by the model
  #
  # NOTE: We are adding two more dimensions to the image. The last
  # provides depth for RGB images which Keras expects. We are doing
  # the alpha channel only so we only have one dimension there. The
  # first is that Keras expects to classify an array of images. We
  # only want to classify one image. So, just one there as well.
  rune_image = np.array(rune_json['data']).reshape(1, 24, 24, 1)

  # make a prediction, returns and array of probabilities.
  #
  # NOTE: This returns and array of predictions with only one
  # prediction in it. We'll grab the first one
  runes = model.predict(rune_image)[0]

  # get the position of the max probabilty, that's our winner
  rune = np.argmax(runes, axis=-1)

  print("*************************")
  print(runes, max)

  # decoded the predictions from a numeric labels to strings
  rune_label = encoder.inverse_transform([rune])[0]

  # tell everyone about it
  print(f"Detected rune of '{rune}' decodes to '{rune_label}'")
  print()

  # return just the first prediction
  return jsonify(message = "OK", rune = rune_label)



# this route serves up 'index.html'
@app.route('/')
def index():
  return send_from_directory('static', 'index.html')



# this route serves up and other paths to the static folder
@app.route('/<path:path>')
def send_static(path):
  return send_from_directory('static', path)



# kick of the Flask application
if __name__ == '__main__':
  app.run()
