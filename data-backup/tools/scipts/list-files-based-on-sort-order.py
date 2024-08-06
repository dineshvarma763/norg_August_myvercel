import os
import json

# List to hold the JSON data and the filenames
json_data_list = []

# Iterate through each file in the current directory
for filename in os.listdir('.'):
    # Check if the file has a .json extension
    if filename.endswith('.json'):
        # Open and read the JSON content
        with open(filename, 'r') as file:
            try:
                data = json.load(file)
                # Add the JSON data along with the filename to the list
                json_data_list.append((filename, data))
            except json.JSONDecodeError as e:
                print(f"Error reading JSON from {filename}: {e}")

# Sort the list based on sortOrder field of the JSON data
json_data_list.sort(key=lambda x: x[1].get('sortOrder', float('inf')))

# print out the sorted list, here I'm only printing filenames for simplicity
for filename, _ in json_data_list:
    print(filename)
