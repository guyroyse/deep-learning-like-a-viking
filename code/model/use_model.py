import os
os.environ['KERAS_BACKEND'] = 'theano'

from keras.models import model_from_json
from keras import backend as K
K.set_image_dim_ordering('th')

# load JSON to create model
json_file = open('model.json', 'r')
model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(model_json)

# load weights into new model
loaded_model.load_weights("model.h5")
print("Loaded model from disk")