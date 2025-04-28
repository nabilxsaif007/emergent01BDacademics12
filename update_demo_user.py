import os
from pymongo import MongoClient
from passlib.context import CryptContext

# Connect to MongoDB
client = MongoClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017/'))
db = client[os.environ.get('DB_NAME', 'bangladesh_academic_network')]

# Create password hash using the same context as the backend
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password_hash = pwd_context.hash("demo123")

# Update the demo user's password
result = db.users.update_one(
    {"email": "demo@bdacademic.org"},
    {"$set": {"password": password_hash}}
)

if result.modified_count > 0:
    print("Demo user password updated successfully")
else:
    print("Failed to update demo user password")

# Verify the update
demo_user = db.users.find_one({"email": "demo@bdacademic.org"})
if demo_user:
    print(f"Demo user found with ID: {demo_user.get('id')}")
    print(f"Password hash: {demo_user.get('password')}")
else:
    print("Demo user not found")