import json
import numpy as np

class RuneFile:

  def __init__(self, json_data):
    self.__json_data = json_data

  @classmethod
  def from_file(clazz, filename):
    with open(filename) as file:
      json_data = json.load(file)
      file.close
      return clazz.from_json(json_data)

  @classmethod
  def from_json(clazz, json_data):
    return clazz(json_data)

  @property
  def rune_name(self):
    return self.__json_data['rune']

  @property
  def rune_data(self):
    return np.array(self.__json_data['data']).reshape(1, 24, 24)

  def save(self, filename):
    with open(filename, 'w') as file:
      file.write(json.dumps(self.__json_data))
      file.close
