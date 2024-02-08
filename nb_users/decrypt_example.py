from nb_users.aes import AESCipher
from secret.passphrase import PASSPHRASE

# Constants
USERNAME = "lend_a_hand_user_321"
ENCRYPTED_PASSWORD = '0rRwEeDHdiB58t+1uH0RLFIWiyKsulVdiAU5H1Rpg/WtaQtyWGNUg7SlNrOnrP5J'

# Initialize the decryptor
aes_cipher = AESCipher(PASSPHRASE)

# Decrypt the password
decrypted_password = aes_cipher.decrypt(ENCRYPTED_PASSWORD)
print(f"Decrypted password for {USERNAME}: {decrypted_password}")
