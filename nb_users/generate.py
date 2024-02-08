import csv
import secrets


def generate_password(password_length=16):
    """ Cheers to this legened https://stackoverflow.com/a/61471228"""
    return secrets.token_urlsafe(password_length)


def main():
    # Generate 1,000 users
    users = [
        {"username": f"lend_a_hand_user_{i}", "password": generate_password()}
        for i in range(1, 1001)]

    # Write to a CSV file
    csv_file_path = 'users.csv'  # You can change the file path as needed
    with open(csv_file_path, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=["username", "password"])
        writer.writeheader()
        writer.writerows(users)

    print(f"User data generated and saved to {csv_file_path}")


if __name__ == "__main__":
    main()
