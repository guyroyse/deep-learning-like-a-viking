from sklearn.preprocessing import LabelEncoder

class FutharkLabels:

  def __init__(self):
    runes = [
      "fe", "ur", "thurs", "as", "reith", "kaun", "hagall", "nauthr",
      "isa", "ar", "sol", "tyr", "bjork", "mathr", "logr", "yr"
    ]
    self.__encoder = LabelEncoder()
    self.__encoder.fit(runes)

  def encode(self, y):
    return self.__encoder.transform(y)

  def decode(self, y):
    return self.__encoder.inverse_transform(y)

  def decode_one(self, y):
    return self.__encoder.inverse_transform([y])[0]
