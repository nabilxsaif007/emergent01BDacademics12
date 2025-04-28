import os
import uuid
from datetime import datetime
from pymongo import MongoClient
from passlib.context import CryptContext

# Connect to MongoDB
client = MongoClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017/'))
db = client[os.environ.get('DB_NAME', 'test_database')]

# Create password hash using the same context as the backend
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password_hash = pwd_context.hash("demo123")

# Check if demo user exists
demo_user = db.users.find_one({"email": "demo@bdacademic.org"})
if not demo_user:
    print("Creating demo user...")
    # Create user document
    demo_user = {
        "id": str(uuid.uuid4()),
        "email": "demo@bdacademic.org",
        "name": "Demo User",
        "password": password_hash,
        "role": "academic",
        "created_at": datetime.utcnow()
    }
    
    # Insert user
    db.users.insert_one(demo_user)
    print(f"Created demo user with ID: {demo_user['id']}")
    
    # Create academic profile
    academic_profile = {
        "id": str(uuid.uuid4()),
        "user_id": demo_user['id'],
        "university": "Bangladesh University of Engineering and Technology",
        "research_field": "Computer Science",
        "sub_field": "Artificial Intelligence",
        "keywords": ["machine learning", "deep learning", "natural language processing"],
        "bio": "Demo academic profile for testing purposes",
        "country": "Bangladesh",
        "city": "Dhaka",
        "latitude": 23.8103,
        "longitude": 90.4125,
        "contact_email": "demo@bdacademic.org",
        "profile_picture_url": None,
        "approval_status": "approved",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert academic profile
    db.academics.insert_one(academic_profile)
    print(f"Created academic profile for demo user")
else:
    print(f"Demo user already exists with ID: {demo_user.get('id')}")
    # Update the demo user's password
    result = db.users.update_one(
        {"email": "demo@bdacademic.org"},
        {"$set": {"password": password_hash}}
    )
    
    if result.modified_count > 0:
        print("Demo user password updated successfully")
    else:
        print("Password already up to date")

# Verify the update
demo_user = db.users.find_one({"email": "demo@bdacademic.org"})
if demo_user:
    print(f"Demo user found with ID: {demo_user.get('id')}")
    print(f"Password hash: {demo_user.get('password')}")
else:
    print("Demo user not found")