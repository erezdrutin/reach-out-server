import firebase_admin
from firebase_admin import credentials, firestore

FIREBASE_CONFIG_PATH = '../secret/lend-a-hand-f9ec0-firebase-adminsdk-tetf1-ce9258a9d6.json'
COL_NAME = 'users'

# Initialize Firebase Admin
cred = credentials.Certificate(FIREBASE_CONFIG_PATH)
firebase_admin.initialize_app(cred)
# Firestore client
db = firestore.client()

# Query the collection
documents = db.collection(COL_NAME).stream()

# Iterate over the documents and print them
res = []
for doc in documents:
    res.append({**doc.to_dict(), 'uid': doc.id})

print(res)
