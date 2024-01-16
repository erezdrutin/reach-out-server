from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from base64 import b64decode
import os

def decrypt_password(encrypted_data, passphrase):
    # Convert data from hex to bytes
    encrypted = bytes.fromhex(encrypted_data['encrypted'])
    salt = bytes.fromhex(encrypted_data['salt'])
    iv = bytes.fromhex(encrypted_data['iv'])

    # Derive the key using PBKDF2
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA512(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    key = kdf.derive(passphrase.encode())

    # Decrypt the data
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted = decryptor.update(encrypted) + decryptor.finalize()

    return decrypted.decode('utf-8')

# Example usage
passphrase = 'lend-a-hand-passphrase'  # Same passphrase as used in Node.js
encrypted_data = {
  "encrypted": '239911e18984f1d82d027fc909719ea141d8596a8fae65970b7aad74ce830b9e',
  "iv": '49af6166819c3709b1d96e498c416d24',
  "salt": 'cb3cce6d2c4f12956b42616c0ece20ce'
}

decrypted_password = decrypt_password(encrypted_data, passphrase)
print(decrypted_password)
