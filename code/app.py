import os
import functools

from flask import Flask, send_from_directory, request, jsonify

from uuid import uuid4

from rune_data import RuneData
from futhark_model import FutharkModel
from futhark_labels import FutharkLabels

app = Flask(__name__, instance_relative_config=True)

@app.route('/rune/save', methods=['POST'])
def save_rune():
  filename = f'{str(uuid4())}.json'

  rune = RuneData.from_json(request.get_json())
  rune.save(f'data/{filename}')

  print(f"Saving rune '{rune.rune_name}' to file {filename}")

  return jsonify(message="OK")

@app.route('/rune/detect', methods=['POST'])
def detect_rune():
  labels = FutharkLabels()
  model = FutharkModel()
  model.load()

  rune = RuneData.from_json(request.get_json())
  encoded_rune = model.predict_one(rune.image_data)
  rune_label = labels.decode_one(encoded_rune)

  print(f"Detected rune of '{encoded_rune}' decodes to '{rune_label}'")

  return jsonify(message="OK", rune=rune_label)

@app.route('/')
def index():
  return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def send_static(path):
  return send_from_directory('static', path)

if __name__ == '__main__':
  app.run()
