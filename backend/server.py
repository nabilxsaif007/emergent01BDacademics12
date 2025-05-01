import os
import uuid
import random
import logging
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional, Union
from dotenv import load_dotenv

from fastapi import BackgroundTasks, Body, Depends, FastAPI, HTTPException, Query, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
import jwt
from passlib.context import CryptContext
import re

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

class ProfileStatus(str, Enum):
    DRAFT = "draft"
    PENDING_VERIFICATION = "pending_verification"
    VERIFIED = "verified"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"


class ResearcherProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    academic_title: Optional[str] = None
    institution_name: Optional[str] = None
    department: Optional[str] = None
    research_interests: List[str] = []
    bio: Optional[str] = None
    publications: List[Dict] = []
    education: List[Dict] = []
    location: Optional[Dict] = None
    profile_picture_url: Optional[str] = None
    social_links: Dict = {}
    contact_email: Optional[EmailStr] = None
    public_email: bool = False
    status: ProfileStatus = ProfileStatus.DRAFT
    completion_percentage: int = 0
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class ResearcherProfileCreate(BaseModel):
    academic_title: Optional[str] = None
    institution_name: Optional[str] = None
    department: Optional[str] = None
    research_interests: Optional[List[str]] = None
    bio: Optional[str] = None
    location: Optional[Dict] = None
    contact_email: Optional[EmailStr] = None
    public_email: Optional[bool] = None


class ResearcherProfileUpdate(BaseModel):
    academic_title: Optional[str] = None
    institution_name: Optional[str] = None
    department: Optional[str] = None
    research_interests: Optional[List[str]] = None
    bio: Optional[str] = None
    publications: Optional[List[Dict]] = None
    education: Optional[List[Dict]] = None
    location: Optional[Dict] = None
    profile_picture_url: Optional[str] = None
    social_links: Optional[Dict] = None
    contact_email: Optional[EmailStr] = None
    public_email: Optional[bool] = None
    status: Optional[ProfileStatus] = None


class VerificationToken(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    token: str = Field(default_factory=lambda: secrets.token_urlsafe(32))
    purpose: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.now)
    is_used: bool = False


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    is_admin: bool = False


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_admin: Optional[bool] = None
    password: Optional[str] = None


class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    email_verified: bool = False

    class Config:
        from_attributes = True
    
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

# User profile routes
@api_router.get("/users/me", response_model=User)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.get("/users/{user_id}/profile")
async def get_user_profile(user_id: str, current_user: User = Depends(get_current_user)):
    # Check if requesting own profile or admin
    if user_id != current_user.id and current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own profile"
        )
    
    # Try to find academic profile
    profile = await db.academics.find_one({"user_id": user_id})
    if profile:
        # Convert ObjectId to string for JSON serialization
        if "_id" in profile:
            profile["_id"] = str(profile["_id"])
        return profile
    
    # No profile found
    return None

@api_router.get("/users/{user_id}/stats")
async def get_user_stats(user_id: str, current_user: User = Depends(get_current_user)):
    # Check if requesting own stats or admin
    if user_id != current_user.id and current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own stats"
        )
    
    # Get real stats if available, otherwise return placeholder data
    # In a real app, these would come from actual database queries
    
    # Check if user has a profile
    profile = await db.academics.find_one({"user_id": user_id})
    
    if profile:
        # For demo purposes, generate random stats
        # In production, these would be actual metrics from the database
        profile_views = random.randint(50, 200)
        connections_count = random.randint(5, 30)
        messages_count = random.randint(0, 10)
    else:
        # Default stats for users without profiles
        profile_views = 0
        connections_count = 0
        messages_count = 0
    
    return {
        "profileViews": profile_views,
        "connections": connections_count, 
        "messages": messages_count
    }

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

# Globe data endpoint
@api_router.get("/globe-data")
async def get_globe_data():
    # Sample data for the globe visualization
    sample_data = [
        # Bangladesh academics
        {
            "id": "bd-1",
            "name": "Dr. Rahim Ahmed",
            "university": "Bangladesh University of Engineering and Technology",
            "field": "Computer Science",
            "bio": "Pioneering researcher in machine learning and artificial intelligence with a focus on natural language processing for Bangla language.",
            "country": "Bangladesh",
            "city": "Dhaka",
            "lat": 23.7104,
            "lng": 90.4074,
            "publications": 45,
            "research_areas": ["AI", "NLP", "Deep Learning"],
            "email": "rahim.ahmed@buet.ac.bd",
            "phone": "+880 1XX-XXXXXXX"
        },
        {
            "id": "bd-2",
            "name": "Dr. Farida Begum",
            "university": "University of Dhaka",
            "field": "Medicine",
            "bio": "Expert in infectious diseases research with extensive experience in tropical medicine and community health initiatives.",
            "country": "Bangladesh",
            "city": "Dhaka",
            "lat": 23.7300,
            "lng": 90.3900,
            "publications": 32,
            "research_areas": ["Infectious Diseases", "Tropical Medicine", "Public Health"],
            "email": "farida.begum@du.ac.bd",
            "phone": "+880 1XX-XXXXXXX"
        },
        {
            "id": "bd-3",
            "name": "Dr. Anisur Rahman",
            "university": "Jahangirnagar University",
            "field": "Environmental Science",
            "bio": "Environmental researcher specializing in climate change impacts on Bangladesh's coastal regions and sustainable development.",
            "country": "Bangladesh",
            "city": "Savar",
            "lat": 23.8830,
            "lng": 90.2670,
            "publications": 28,
            "research_areas": ["Climate Change", "Coastal Ecology", "Sustainable Development"],
            "email": "anisur.rahman@ju.ac.bd",
            "phone": "+880 1XX-XXXXXXX"
        },
        {
            "id": "bd-4",
            "name": "Dr. Taslima Khatun",
            "university": "Rajshahi University",
            "field": "Agricultural Science",
            "bio": "Agricultural scientist working on crop improvement and sustainable farming practices for rural Bangladesh.",
            "country": "Bangladesh",
            "city": "Rajshahi",
            "lat": 24.3636,
            "lng": 88.6241,
            "publications": 22,
            "research_areas": ["Agronomy", "Crop Science", "Food Security"],
            "email": "taslima.khatun@ru.ac.bd",
            "phone": "+880 1XX-XXXXXXX"
        },
        {
            "id": "bd-5",
            "name": "Dr. Kamal Hossain",
            "university": "Chittagong University of Engineering and Technology",
            "field": "Civil Engineering",
            "bio": "Civil engineer specializing in earthquake-resistant structures and infrastructure development in seismic zones.",
            "country": "Bangladesh",
            "city": "Chittagong",
            "lat": 22.4716,
            "lng": 91.7877,
            "publications": 19,
            "research_areas": ["Structural Engineering", "Earthquake Engineering", "Infrastructure"],
            "email": "kamal.hossain@cuet.ac.bd",
            "phone": "+880 1XX-XXXXXXX"
        },
        
        # International academics
        {
            "id": "int-1",
            "name": "Dr. John Smith",
            "university": "MIT",
            "field": "Robotics",
            "bio": "Leading researcher in advanced robotics with a focus on human-robot interaction and autonomous systems.",
            "country": "USA",
            "city": "Boston",
            "lat": 42.3601,
            "lng": -71.0942,
            "publications": 78,
            "research_areas": ["Robotics", "AI", "Human-Robot Interaction"],
            "email": "john.smith@mit.edu",
            "phone": "+1 XXX-XXX-XXXX"
        },
        {
            "id": "int-2",
            "name": "Dr. Sarah Johnson",
            "university": "University of Oxford",
            "field": "Literature",
            "bio": "Literary scholar specializing in South Asian literature with focus on Bengali works in translation.",
            "country": "UK",
            "city": "Oxford",
            "lat": 51.7520,
            "lng": -1.2577,
            "publications": 42,
            "research_areas": ["South Asian Literature", "Translation Studies", "Postcolonial Theory"],
            "email": "sarah.johnson@oxford.ac.uk",
            "phone": "+44 XXXX XXXXXX"
        },
        {
            "id": "int-3",
            "name": "Dr. Takashi Yamamoto",
            "university": "University of Tokyo",
            "field": "Physics",
            "bio": "Theoretical physicist working on quantum field theory with collaborative projects with Bangladeshi institutions.",
            "country": "Japan",
            "city": "Tokyo",
            "lat": 35.6895,
            "lng": 139.6917,
            "publications": 64,
            "research_areas": ["Quantum Physics", "Theoretical Physics", "Particle Physics"],
            "email": "takashi.yamamoto@u-tokyo.ac.jp",
            "phone": "+81 XX-XXXX-XXXX"
        },
        {
            "id": "int-4",
            "name": "Dr. Fatima Khan",
            "university": "University of Toronto",
            "field": "Economics",
            "bio": "Economist studying developmental economics with a focus on microfinance and poverty alleviation in South Asia.",
            "country": "Canada",
            "city": "Toronto",
            "lat": 43.6532,
            "lng": -79.3832,
            "publications": 37,
            "research_areas": ["Developmental Economics", "Microfinance", "Poverty Studies"],
            "email": "fatima.khan@utoronto.ca",
            "phone": "+1 XXX-XXX-XXXX"
        },
        {
            "id": "int-5",
            "name": "Dr. Mohammad Rahman",
            "university": "Stanford University",
            "field": "Computer Science",
            "bio": "Computer scientist specializing in big data analytics and machine learning applications in healthcare.",
            "country": "USA",
            "city": "Palo Alto",
            "lat": 37.4419,
            "lng": -122.1430,
            "publications": 52,
            "research_areas": ["Big Data", "Machine Learning", "Healthcare Informatics"],
            "email": "mohammad.rahman@stanford.edu",
            "phone": "+1 XXX-XXX-XXXX"
        },
        {
            "id": "int-6",
            "name": "Dr. Amina Patel",
            "university": "University of Melbourne",
            "field": "Public Health",
            "bio": "Public health researcher specializing in health systems strengthening in developing countries.",
            "country": "Australia",
            "city": "Melbourne",
            "lat": -37.8136,
            "lng": 144.9631,
            "publications": 29,
            "research_areas": ["Public Health", "Health Systems", "Global Health"],
            "email": "amina.patel@unimelb.edu.au",
            "phone": "+61 X XXXX XXXX"
        },
        {
            "id": "int-7",
            "name": "Dr. Abdullah Al-Farabi",
            "university": "Technical University of Munich",
            "field": "Mechanical Engineering",
            "bio": "Mechanical engineer specializing in renewable energy technologies and sustainable engineering.",
            "country": "Germany",
            "city": "Munich",
            "lat": 48.1351,
            "lng": 11.5820,
            "publications": 31,
            "research_areas": ["Renewable Energy", "Sustainable Engineering", "Thermodynamics"],
            "email": "abdullah.alfarabi@tum.de",
            "phone": "+49 XXX XXXXXXXX"
        },
        {
            "id": "int-8",
            "name": "Dr. Priya Sharma",
            "university": "National University of Singapore",
            "field": "Bioengineering",
            "bio": "Bioengineer working on tissue engineering and regenerative medicine with applications in tropical diseases.",
            "country": "Singapore",
            "city": "Singapore",
            "lat": 1.2966,
            "lng": 103.7764,
            "publications": 40,
            "research_areas": ["Tissue Engineering", "Regenerative Medicine", "Tropical Diseases"],
            "email": "priya.sharma@nus.edu.sg",
            "phone": "+65 XXXX XXXX"
        }
    ]
    return sample_data

@api_router.get("/academics/{academic_id}")
async def get_academic_by_id(academic_id: str):
    """Get details of a specific academic by ID"""
    # Get all sample data
    all_academics = await get_globe_data()
    
    # Find the academic with the matching ID
    for academic in all_academics:
        if academic["id"] == academic_id:
            return academic
            
    # If not found, raise a 404 error
    raise HTTPException(status_code=404, detail="Academic not found")

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
