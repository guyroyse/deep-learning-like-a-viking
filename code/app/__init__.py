import os

from flask import Flask, send_from_directory
from . import rune

def create_app(test_config=None):
  app = Flask(__name__, instance_relative_config=True)

  try:
    os.makedirs('data')
  except OSError:
    pass

  @app.route('/')
  def index():
    return send_from_directory('static', 'index.html')

  @app.route('/<path:path>')
  def send_static(path):
    return send_from_directory('static', path)

  app.register_blueprint(rune.bp)

  return app
