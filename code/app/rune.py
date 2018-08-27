import functools
import numpy as np

from uuid import uuid4
from common.rune_file import RuneFile
from common.futhark_model import FutharkModel
from common.futhark_labels import FutharkLabels

from flask import Blueprint, g, request, jsonify

bp = Blueprint('rune', __name__, url_prefix='/rune')

@bp.route('/save', methods=['POST'])
def save_rune():
  file = RuneFile.from_json(request.get_json())
  file.save(f'data/{uuid()}.json')
  return jsonify(message="OK")

def uuid():
  return str(uuid4())

@bp.route('/detect', methods=['POST'])
def detect_rune():
  rune_data = request.get_json()

  X = np.array(rune_data['data'])
  X = X.reshape(1, 1, 24, 24)

  model = FutharkModel()
  model.load()
  y = model.predict(X)

  labels = FutharkLabels()
  result = labels.decode(y)

  return jsonify(message="OK", rune=result[0])
