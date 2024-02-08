import os

# Get the absolute path to the directory containing the script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the absolute path to passphrase.txt
passphrase_file_path = os.path.join(script_dir, 'passphrase.txt')

# Now you can open and read the file
with open(passphrase_file_path, 'r') as file:
    PASSPHRASE = file.read()
