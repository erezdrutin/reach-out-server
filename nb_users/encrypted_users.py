import pandas as pd
from nb_users.aes import AESCipher
from secret.passphrase import PASSPHRASE

# Initialize the AES cipher
aes_cipher = AESCipher(PASSPHRASE)

# Read the CSV file
df = pd.read_csv('users.csv')

# Encrypt the passwords and store them in a new DataFrame
encrypted_data = []
for index, row in df.iterrows():
    encrypted_password = aes_cipher.encrypt(row['password'])
    encrypted_data.append({
        'username': row['username'],
        'encrypted_password': encrypted_password.decode()
    })

# Create a new DataFrame with encrypted passwords
encrypted_df = pd.DataFrame(encrypted_data)

# Save the new DataFrame to a CSV file
encrypted_df.to_csv('encrypted_users.csv', index=False)
