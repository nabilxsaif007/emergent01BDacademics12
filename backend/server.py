from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Query, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import re
from enum import Enum
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'bangladesh_academic_network')]

# Create the main app without a prefix
app = FastAPI(title="Bangladesh Academic Mentor Network API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
SECRET_KEY = os.environ.get("SECRET_KEY", "mysecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

# Enums
class Role(str, Enum):
    ADMIN = "admin"
    ACADEMIC = "academic"
    USER = "user"

class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

# Models
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    role: str

class TokenData(BaseModel):
    email: str
    role: str
    user_id: str

class UserBase(BaseModel):
    email: EmailStr
    name: str
    
class UserCreate(UserBase):
    password: str
    role: Role = Role.USER

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: Role = Role.USER
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class Keyword(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    
class AcademicBase(BaseModel):
    user_id: str
    university: str
    research_field: str
    sub_field: Optional[str] = None
    keywords: List[str] = []
    bio: Optional[str] = None
    country: str
    city: str
    latitude: float
    longitude: float
    contact_email: EmailStr
    profile_picture_url: Optional[str] = None
    
class AcademicCreate(AcademicBase):
    pass

class Academic(AcademicBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    approval_status: ApprovalStatus = ApprovalStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user_by_email(email: str):
    user = await db.users.find_one({"email": email})
    if user:
        return User(**user)
    return None

async def authenticate_user(email: str, password: str):
    user = await db.users.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user.get("password")):
        return False
    return User(**{k: v for k, v in user.items() if k != "password"})

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        user_id: str = payload.get("user_id")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, role=role, user_id=user_id)
    except jwt.PyJWTError:
        raise credentials_exception
    user = await get_user_by_email(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not enough permissions"
        )
    return current_user

# Auth routes
@api_router.post("/register", response_model=User)
async def register_user(user: UserCreate):
    # Check if user already exists
    existing_user = await get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create new user
    new_user = User(**user.dict(exclude={"password"}))
    new_user_dict = new_user.dict()
    new_user_dict["password"] = get_password_hash(user.password)
    
    # Insert into database
    await db.users.insert_one(new_user_dict)
    
    return new_user

@api_router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "user_id": user.id},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id, "role": user.role}

# Academic profile routes
@api_router.post("/academics", response_model=Academic)
async def create_academic_profile(profile: AcademicCreate, current_user: User = Depends(get_current_user)):
    # Ensure the user is creating their own profile
    if profile.user_id != current_user.id and current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create a profile for yourself"
        )
    
    # Check if profile already exists
    existing_profile = await db.academics.find_one({"user_id": profile.user_id})
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists for this user"
        )
    
    # Create new academic profile
    new_profile = Academic(**profile.dict())
    await db.academics.insert_one(new_profile.dict())
    
    # Update user role to academic if not already
    if current_user.role == Role.USER:
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": {"role": Role.ACADEMIC}}
        )
    
    # Add keywords to the database if they don't exist
    for keyword in profile.keywords:
        await db.keywords.update_one(
            {"name": keyword},
            {"$set": {"name": keyword}},
            upsert=True
        )
    
    return new_profile

@api_router.get("/academics", response_model=List[Academic])
async def get_academics(
    approval_status: Optional[ApprovalStatus] = Query(None),
    country: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    keywords: Optional[List[str]] = Query(None),
    research_field: Optional[str] = Query(None)
):
    # Build query based on filters
    query = {}
    
    # Only show approved profiles to regular users
    query["approval_status"] = ApprovalStatus.APPROVED
    
    if country:
        query["country"] = country
    if city:
        query["city"] = city
    if research_field:
        query["research_field"] = {"$regex": research_field, "$options": "i"}
    if keywords:
        query["keywords"] = {"$in": keywords}
    
    academics = await db.academics.find(query).to_list(1000)
    return [Academic(**academic) for academic in academics]

@api_router.get("/academics/{academic_id}", response_model=Academic)
async def get_academic(academic_id: str):
    academic = await db.academics.find_one({"id": academic_id})
    if not academic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic profile not found"
        )
    return Academic(**academic)

@api_router.put("/academics/{academic_id}", response_model=Academic)
async def update_academic(
    academic_id: str, 
    profile_update: dict = Body(...), 
    current_user: User = Depends(get_current_user)
):
    # Get the current profile
    academic = await db.academics.find_one({"id": academic_id})
    if not academic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic profile not found"
        )
    
    # Check permissions
    if academic["user_id"] != current_user.id and current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile"
        )
    
    # Update the profile
    profile_update["updated_at"] = datetime.utcnow()
    
    # If non-admin tries to change approval status, remove that field
    if current_user.role != Role.ADMIN and "approval_status" in profile_update:
        del profile_update["approval_status"]
    
    await db.academics.update_one(
        {"id": academic_id},
        {"$set": profile_update}
    )
    
    # Add new keywords to the database
    if "keywords" in profile_update:
        for keyword in profile_update["keywords"]:
            await db.keywords.update_one(
                {"name": keyword},
                {"$set": {"name": keyword}},
                upsert=True
            )
    
    updated_academic = await db.academics.find_one({"id": academic_id})
    return Academic(**updated_academic)

# User routes
@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    # Only return safe fields (exclude any sensitive information)
    return User(**{k: v for k, v in user.items() if k != "password"})

# Admin routes
@api_router.get("/admin/academics", response_model=List[Academic])
async def get_academics_for_admin(
    approval_status: Optional[ApprovalStatus] = Query(None),
    current_user: User = Depends(get_current_admin)
):
    query = {}
    if approval_status:
        query["approval_status"] = approval_status
    
    academics = await db.academics.find(query).to_list(1000)
    return [Academic(**academic) for academic in academics]

@api_router.put("/admin/academics/{academic_id}/approve", response_model=Academic)
async def approve_academic(academic_id: str, current_user: User = Depends(get_current_admin)):
    # Update the approval status
    await db.academics.update_one(
        {"id": academic_id},
        {"$set": {"approval_status": ApprovalStatus.APPROVED}}
    )
    
    updated_academic = await db.academics.find_one({"id": academic_id})
    if not updated_academic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic profile not found"
        )
    
    return Academic(**updated_academic)

@api_router.put("/admin/academics/{academic_id}/reject", response_model=Academic)
async def reject_academic(academic_id: str, current_user: User = Depends(get_current_admin)):
    # Update the approval status
    await db.academics.update_one(
        {"id": academic_id},
        {"$set": {"approval_status": ApprovalStatus.REJECTED}}
    )
    
    updated_academic = await db.academics.find_one({"id": academic_id})
    if not updated_academic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic profile not found"
        )
    
    return Academic(**updated_academic)

# Keyword routes
@api_router.get("/keywords", response_model=List[Keyword])
async def get_keywords():
    keywords = await db.keywords.find().to_list(1000)
    return [Keyword(**keyword) for keyword in keywords]

# Stats routes
@api_router.get("/stats/academics-by-city")
async def get_academics_by_city(country: Optional[str] = Query(None)):
    pipeline = [
        {"$match": {"approval_status": ApprovalStatus.APPROVED}},
    ]
    
    if country:
        pipeline[0]["$match"]["country"] = country
    
    pipeline.extend([
        {"$group": {"_id": {"country": "$country", "city": "$city"}, "count": {"$sum": 1}}},
        {"$sort": {"_id.country": 1, "_id.city": 1}}
    ])
    
    results = await db.academics.aggregate(pipeline).to_list(1000)
    
    formatted_results = []
    for result in results:
        formatted_results.append({
            "country": result["_id"]["country"],
            "city": result["_id"]["city"],
            "count": result["count"]
        })
    
    return formatted_results

@api_router.get("/stats/academics-by-field")
async def get_academics_by_field():
    pipeline = [
        {"$match": {"approval_status": ApprovalStatus.APPROVED}},
        {"$group": {"_id": "$research_field", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    
    results = await db.academics.aggregate(pipeline).to_list(1000)
    
    formatted_results = []
    for result in results:
        formatted_results.append({
            "field": result["_id"],
            "count": result["count"]
        })
    
    return formatted_results

# Test route
@api_router.get("/")
async def root():
    return {"message": "Welcome to Bangladesh Academic Mentor Network API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
