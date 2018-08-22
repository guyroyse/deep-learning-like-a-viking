import functools
import json
from uuid import uuid4

from flask import Blueprint, g, request, jsonify

bp = Blueprint('rune', __name__, url_prefix='/rune')

@bp.route('/save', methods=['POST'])
def save_rune():
  rune_data = request.get_json()

  with open(f'data/{uuid()}.json', 'w') as file:
    file.write(json.dumps(rune_data))
  file.close

  return jsonify(
    message="OK"
  )

def uuid():
  return str(uuid4())