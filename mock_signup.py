from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import requests
from pydantic import BaseModel

app = FastAPI()

# Firebase project API key
FIREBASE_API_KEY = "<KEY>"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class UserRegistrationData(BaseModel):
    email: str
    password: str


# Route for user sign-up
@app.post("/signup")
async def create_user(registration_data: UserRegistrationData):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_API_KEY}"
    response = requests.post(url, json={"email": registration_data.email,
                                        "password": registration_data.password,
                                        "returnSecureToken": True})

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create user"
        )

    user_info = response.json()
    user_id = user_info["localId"]

    return {"message": "User created successfully", "userId": user_id}


# Route for getting the token
@app.post("/token")
async def token(form_data: OAuth2PasswordRequestForm = Depends()):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    response = requests.post(url, json={"email": form_data.username,
                                        "password": form_data.password,
                                        "returnSecureToken": True})

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token_info = response.json()
    return {"access_token": token_info["idToken"], "token_type": "bearer"}


# Dependency for OAuth2 authentication
async def firebase_auth(token: str = Depends(oauth2_scheme)):
    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={FIREBASE_API_KEY}"
    response = requests.post(verify_url, json={"idToken": token})

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    user_info = response.json()

    return {
        "user_id": user_info["users"][0]["localId"],
        "email": user_info["users"][0]["email"]
    }


@app.post("/protected")
async def read_protected_data(user_info=Depends(firebase_auth)):
    return {"message": "This is a protected endpoint", "user_info": user_info}


# Main function to run the app
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)

