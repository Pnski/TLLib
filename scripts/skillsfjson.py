import os
import json

def compare_filenames(directory, json_string):
    # Parse the JSON string into a Python list
    json_filenames = json.loads(json_string)
    
    # Get all filenames in the specified directory
    directory_filenames = os.listdir(directory)
    
    # Compare the filenames from the directory to the JSON list
    matches = []
    differences = []

    for filename in json_filenames:
        if filename in directory_filenames:
            matches.append(filename)
        else:
            differences.append(filename)
    
    for filename in directory_filenames:
        if filename not in json_filenames:
            differences.append(filename)
    
    return matches, differences

# Example usage:
directory = 'D:\FModel\4.4.4\Output\Exports\TL\Content\Image\Skill'  # Replace with your directory path
json_string = '["file1.txt", "file2.jpg", "file3.pdf"]'  # Replace with your JSON string

matches, differences = compare_filenames(directory, json_string)

print(f"Matching filenames: {matches}")
print(f"Different filenames: {differences}")