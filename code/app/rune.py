import functools

from uuid import uuid4

from common.rune_file import RuneFile
from common.futhark_model import FutharkModel
from common.futhark_labels import FutharkLabels

from flask import Blueprint, g, request, jsonify

bp = Blueprint('rune', __name__, url_prefix='/rune')

@bp.route('/save', methods=['POST'])
def save_rune():
  filename = f'{str(uuid4())}.json'

  file = RuneFile.from_json(request.get_json())
  file.save(f'data/{filename}')

  print(f"Saving rune '{file.rune_name}' to file {filename}")

  return jsonify(message="OK")

@bp.route('/detect', methods=['POST'])
def detect_rune():
  labels = FutharkLabels()
  model = FutharkModel()
  model.load()

  file = RuneFile.from_json(request.get_json())
  rune_data = file.rune_data
  encoded_rune = model.predict(rune_data)
  rune = labels.decode([encoded_rune])

  print(f"Detected rune of '{encoded_rune}' decodes to '{rune}'")

  return jsonify(message="OK", rune=rune[0])
