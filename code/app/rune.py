import os
os.environ['KERAS_BACKEND'] = 'theano'

import numpy as np

from sklearn.preprocessing import LabelEncoder

from keras.models import model_from_json
from keras import backend as K
K.set_image_dim_ordering('th')

import functools
import json
from uuid import uuid4

from flask import Blueprint, g, request, jsonify

from common.rune_file import RuneFile

bp = Blueprint('rune', __name__, url_prefix='/rune')

@bp.route('/save', methods=['POST'])
def save_rune():
  rune_data = request.get_json()

  file = RuneFile.from_json(request.get_json())
  file.save(f'data/{uuid()}.json')

  return jsonify(
    message="OK"
  )

def uuid():
  return str(uuid4())

@bp.route('/detect', methods=['POST'])
def detect_rune():
  rune_data = request.get_json()

  X = np.array(rune_data['data'])
  X = X.reshape(1, 1, 24, 24)

  # label decoding
  label_encoder = LabelEncoder()
  label_encoder.fit(["fe", "ur", "thurs", "as", "reith", "kaun", "hagall", "nauthr", "isa", "ar", "sol", "tyr", "bjork", "mathr", "logr", "yr"])

  # load model from disk
  json_file = open('model/futhark_model.json', 'r')
  model_json = json_file.read()
  print(model_json)
  json_file.close()
  model = model_from_json(model_json)
  model.load_weights("model/futhark_model.h5")

  y = model.predict_classes(X)
  result = label_encoder.inverse_transform(y)

  print(y)
  print(result)

  return jsonify(
    message="OK",
    rune=result[0]
  )





