# Purpose
A branch that holds a bunch of migration scripts required for lendahand to 
work properly. Heavily assumes the format is as specified in lend a hand's 
shared ERD in draw.io.


# Structure
- `db_migration` folder: holds all `normalization` scripts from Google Sheets 
format to the finalized User Object format.
- `fb_integration` folder: This was actually used only for db_migration. 
  Reads data and writes it to firebase.
- `secret` folder: holds a bunch of secrets / stuff to work with secrets.
- `nb_users` folder: holds all required stuff to integrate with 
  NeuroBrave's app, such as:
  - Generating random user-passwords files.
  - Encrypting user-passwords files using AES (256 bits / PKCS#7).
  - A basic decryption example w/ Python.
  - Read firebase documents to a CSV file (for manual retries later, etc.)
  - Write from `users.csv` (which holds all user-encrypted_passwords 
    combinations) to firebase.

