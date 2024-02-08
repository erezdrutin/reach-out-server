import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore

FIREBASE_CONFIG_PATH = '../secret/lend-a-hand-f9ec0-firebase-adminsdk-tetf1-ce9258a9d6.json'
MIGRATED_DB_PATH = '../db_migration/res.xlsx'
COL_NAME = 'users'

# Initialize Firebase Admin
cred = credentials.Certificate(FIREBASE_CONFIG_PATH)
firebase_admin.initialize_app(cred)

# Assuming df is your pandas DataFrame
df = pd.read_excel(MIGRATED_DB_PATH, engine='openpyxl')

# Convert DataFrame to dictionary format
records = df.to_dict(orient='records')

# Firestore client
db = firestore.client()

# Iterate and write each record to Firestore
for record in records:
    # Add a new document in collection 'your_collection_name'
    db.collection(COL_NAME).add(record)
