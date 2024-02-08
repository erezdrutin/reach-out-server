import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

FIREBASE_CONFIG_PATH = '../secret/lend-a-hand-f9ec0-firebase-adminsdk-tetf1-ce9258a9d6.json'
FIREBASE_COL_NAME = 'users'
OUTPUT_PATH = './firestore_data.csv'


def read_firestore_to_csv(firebase_config_path: str, collection_name: str,
                          output_csv_path: str) -> None:
    """ Reads the contents of a firestore collection into a csv file. """
    # Initialize Firebase
    cred = credentials.Certificate(firebase_config_path)
    firebase_admin.initialize_app(cred)

    # Firestore client
    db = firestore.client()

    # Query the collection
    documents = db.collection(collection_name).stream()

    # Convert documents to DataFrame
    docs_list = [{**doc.to_dict(), 'uid': doc.id} for doc in documents]
    df = pd.DataFrame(docs_list)

    # Export DataFrame to CSV
    df.to_csv(output_csv_path, index=False)
    print(f"Data exported to {output_csv_path} successfully.")


if __name__ == '__main__':
    read_firestore_to_csv(FIREBASE_CONFIG_PATH, FIREBASE_COL_NAME, OUTPUT_PATH)
