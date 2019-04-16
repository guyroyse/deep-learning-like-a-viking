import random

def main():
  voltages = [x/10.0 for x in range(0, 51)]

  print("input_voltage_1,input_voltage_2,output_value")

  for i in range(10):
    for x in voltages:
      for y in voltages:
        binary_x = binary_it(x)
        binary_y = binary_it(y)
        binary_result = binary_x and binary_y

        print(f"{x},{y},{binary_result}")

def binary_it(voltage):
  if voltage >= 3.5: return True
  if voltage >= 3.3: return random.choice([True, True, True, True, False])
  if voltage >= 3.1: return random.choice([True, True, True, False])
  if voltage >= 2.9: return random.choice([True, True, False])

  if voltage <= 1.5: return False
  if voltage <= 1.7: return random.choice([False, False, False, False, True])
  if voltage <= 1.9: return random.choice([False, False, False, True])
  if voltage <= 2.1: return random.choice([False, False, True])

  return random.choice([True, False])

main()