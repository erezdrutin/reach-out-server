import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

FIREBASE_CONFIG_PATH = '../secret/lend-a-hand-f9ec0-firebase-adminsdk-tetf1-ce9258a9d6.json'
ENCRYPTED_USERS_PATH = './encrypted_users.csv'
FIRESTORE_CSV_PATH = './firestore_data.csv'
FIRESTORE_NEW_OUTPUT_PATH = './fb_update_output.csv'


def update_firestore_from_csv(firebase_config_path, users_csv_path,
                              firestore_csv_path):
    # Load encrypted users data
    encrypted_users_df = pd.read_csv(users_csv_path)

    # Load Firestore data to get document IDs
    firestore_df = pd.read_csv(firestore_csv_path)

    # Initialize Firebase
    cred = credentials.Certificate(firebase_config_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    db = firestore.client()

    output_data = []

    for index, row in firestore_df.iterrows():
        # Fetch the corresponding user details "by order"
        encrypted_user = encrypted_users_df.iloc[index]
        doc_id = row['uid']

        # Prepare update data
        update_data = {
            'nbUsername': encrypted_user['username'],
            'nbPassword': encrypted_user['encrypted_password']
        }

        # Update Firestore document
        # db.collection('users').document(doc_id).update(
        #     {'nbUsername': firestore.DELETE_FIELD,
        #      'nbPassword': firestore.DELETE_FIELD})
        db.collection('users').document(doc_id).set(update_data, merge=True)
        #
        data_dct = row.to_dict()
        data_dct.update(update_data)
        output_data.append(data_dct)

    print("Firestore documents updated successfully.")
    # Convert to DataFrame
    out_df = pd.DataFrame(output_data)

    # Write to CSV file
    out_df.to_csv(FIRESTORE_NEW_OUTPUT_PATH, index=False)
    print(f"Execution results are also stored at: {FIRESTORE_NEW_OUTPUT_PATH}")


# Usage example:
if __name__ == '__main__':
    update_firestore_from_csv(FIREBASE_CONFIG_PATH, ENCRYPTED_USERS_PATH,
                              FIRESTORE_CSV_PATH)
