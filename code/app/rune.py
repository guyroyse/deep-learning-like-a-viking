import functools
import json

from flask import Blueprint, g, request, jsonify

from pillager.db import get_db

bp = Blueprint('rune', __name__, url_prefix='/rune')

@bp.route('/save', methods=['POST'])
def save_rune():
  rune_data = request.get_json()
  print(rune_data)
  rune_name = rune_data['rune']
  rune_image = rune_data['data']
  print(rune_name)
  print(rune_image)

  db = get_db()
  db.execute(
    'INSERT INTO runes (rune, rune_image) VALUES (?, ?)',
    (rune_name, json.dumps(rune_image))
  )
  db.commit()

  return jsonify(
    message="OK"
  )

@bp.route('/dump', methods=['GET'])
def dump_runes():
  db = get_db()
  rows = db.execute(
    'SELECT rune, rune_image FROM runes'
  ).fetchall()

  for row in rows:
    print(row["rune"])
    print(row["rune_image"])

  return ""
