import os

from flask import Flask, send_from_directory

def create_app(test_config=None):
  app = Flask(__name__, instance_relative_config=True)
  config_app(app, test_config)
  create_instance_folder(app)
  setup_static_routes(app)
  return app

def config_app(app, test_config):
  app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'pillager.sqlite')
  )

  if test_config is None:
    app.config.from_pyfile('config.py', silent=True)
  else:
    app.config.from_mapping(test_config)

def create_instance_folder(app):
  try:
    os.makedirs(app.instance_path)
  except OSError:
    pass

def setup_static_routes(app):
  @app.route('/')
  def index():
    return send_from_directory('static', 'index.html')

  @app.route('/<path:path>')
  def send_static(path):
    return send_from_directory('static', path)

