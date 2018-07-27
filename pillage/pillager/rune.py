import functools

from flask import Blueprint, g, request, jsonify

from pillager.db import get_db

bp = Blueprint('rune', __name__, url_prefix='/rune')

@bp.route('/save', methods=['POST'])
def save_rune():
  print(request.get_json())
  return jsonify(
    message="OK"
  )