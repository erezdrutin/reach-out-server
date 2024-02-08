import string
import secrets


def generate_passphrase(length=16):
    """Generate a secure passphrase for AES key.

    Args:
    length (int): Length of the passphrase. Default is 16 characters.

    Returns:
    str: A secure passphrase.
    """
    characters = string.ascii_letters + string.digits + string.punctuation
    passphrase = ''.join(secrets.choice(characters) for i in range(length))
    return passphrase


# Generate a 16-character long passphrase
passphrase = generate_passphrase(16)
passphrase_path = 'passphrase.txt'
with open(passphrase_path, 'w') as fp:
    fp.write(passphrase)
print(f"AES Key Passphrase generated and stored in {passphrase_path}")
