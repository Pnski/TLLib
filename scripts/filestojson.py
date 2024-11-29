import os
import json

def folder_to_json(folder_paths, output_file):
    """
    Reads the contents of given folders and writes their file information to a JSON file.

    Args:
        folder_paths (list): List of folder paths to scan.
        output_file (str): Output JSON file path.
    """
    data = []

    for folder in folder_paths:
        if not os.path.exists(folder):
            print(f"Folder not found: {folder}")
            continue

        for root, _, files in os.walk(folder):
            for file in files:
                file_data = {
                    "name": file,
                    "path": os.path.relpath(os.path.join(root, file), start=os.getcwd())
                }
                data.append(file_data)

    with open(output_file, "w") as f:
        json.dump(data, f, indent=4)
    print(f"JSON saved to {output_file}")

# List of folders to scan
folders = ["./docs/Images/Monster", "./docs/Images/Icon"]  # Add your folders here

# Output JSON file
output = "file_data.json"

folder_to_json(folders, output)
