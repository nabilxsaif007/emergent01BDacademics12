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
from typing import Dict, List, Optional, Union, Any
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

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User models
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
        
# Profile models
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
    country: Optional[str] = None
    city: Optional[str] = None
    profile_picture_url: Optional[str] = None
    social_links: Dict = {}
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    public_email: bool = False
    status: ProfileStatus = ProfileStatus.DRAFT
    completion_percentage: int = 0
    feedback: Optional[str] = None
    rejection_reason: Optional[str] = None
    admin_notes: Optional[Dict] = {}
    review_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class ResearcherProfileCreate(BaseModel):
    academic_title: Optional[str] = None
    institution_name: Optional[str] = None
    department: Optional[str] = None
    research_interests: Optional[List[str]] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    public_email: Optional[bool] = None
    social_links: Optional[Dict] = None


class ResearcherProfileUpdate(BaseModel):
    academic_title: Optional[str] = None
    institution_name: Optional[str] = None
    department: Optional[str] = None
    research_interests: Optional[List[str]] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    profile_picture_url: Optional[str] = None
    social_links: Optional[Dict] = None
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    public_email: Optional[bool] = None
    status: Optional[ProfileStatus] = None
    
# JWT token settings
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
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
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise credentials_exception
    return user


async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

# Model for email verification tokens
class VerificationToken(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    token: str = Field(default_factory=lambda: secrets.token_urlsafe(32))
    purpose: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.now)
    is_used: bool = False

# Connection status enum
class ConnectionStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

# Connection request model
class ConnectionRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    requester_id: str
    recipient_id: str
    status: ConnectionStatus = ConnectionStatus.PENDING
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

# Connection request creation model
class ConnectionRequestCreate(BaseModel):
    recipient_id: str
    message: Optional[str] = None
    
# Project status enum
class ProjectStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"

# Project visibility enum
class ProjectVisibility(str, Enum):
    PRIVATE = "private"
    TEAM = "team"
    PUBLIC = "public"

# Project model
class ResearchProject(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    owner_id: str
    research_areas: List[str] = []
    status: ProjectStatus = ProjectStatus.DRAFT
    visibility: ProjectVisibility = ProjectVisibility.PRIVATE
    team_members: List[Dict] = []  # List of {user_id, role, permissions}
    resources: List[Dict] = []  # List of {name, type, url}
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

# Project creation model
class ResearchProjectCreate(BaseModel):
    title: str
    description: str
    research_areas: Optional[List[str]] = None
    visibility: ProjectVisibility = ProjectVisibility.PRIVATE
    tags: Optional[List[str]] = None

# Project update model
class ResearchProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    research_areas: Optional[List[str]] = None
    status: Optional[ProjectStatus] = None
    visibility: Optional[ProjectVisibility] = None
    tags: Optional[List[str]] = None

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Researcher profile routes
@api_router.post("/profiles", response_model=ResearcherProfile)
async def create_researcher_profile(
    profile: ResearcherProfileCreate,
    current_user: User = Depends(get_current_user)
):
    # Check if profile already exists
    existing_profile = await db.researcher_profiles.find_one({"user_id": current_user.id})
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists for this user"
        )
    
    # Create new profile
    profile_dict = profile.dict(exclude_unset=True)
    
    # Calculate completion percentage
    completion_percentage = calculate_profile_completion(profile_dict)
    
    # Create the profile with default values
    new_profile = ResearcherProfile(
        user_id=current_user.id,
        **profile_dict,
        completion_percentage=completion_percentage
    )
    
    # Insert into database
    await db.researcher_profiles.insert_one(new_profile.dict())
    
    return new_profile


@api_router.get("/profiles/me", response_model=ResearcherProfile)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    profile = await db.researcher_profiles.find_one({"user_id": current_user.id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return profile


@api_router.put("/profiles/me", response_model=ResearcherProfile)
async def update_my_profile(
    profile_update: ResearcherProfileUpdate,
    current_user: User = Depends(get_current_user)
):
    # Check if profile exists
    existing_profile = await db.researcher_profiles.find_one({"user_id": current_user.id})
    if not existing_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Update the profile
    update_data = profile_update.dict(exclude_unset=True)
    
    # If any fields are updated, recalculate completion percentage
    if update_data:
        # Get the current profile data
        current_profile = {**existing_profile, **update_data}
        
        # Recalculate completion percentage
        update_data["completion_percentage"] = calculate_profile_completion(current_profile)
        update_data["updated_at"] = datetime.now()
        
        # If status changed to PENDING_APPROVAL, clear any previous feedback
        if update_data.get("status") == ProfileStatus.PENDING_APPROVAL:
            update_data["feedback"] = None
            update_data["rejection_reason"] = None
    
    # Update in database
    await db.researcher_profiles.update_one(
        {"user_id": current_user.id},
        {"$set": update_data}
    )
    
    # Return updated profile
    updated_profile = await db.researcher_profiles.find_one({"user_id": current_user.id})
    return updated_profile


@api_router.put("/profiles/me/submit", response_model=ResearcherProfile)
async def submit_profile_for_approval(
    current_user: User = Depends(get_current_user),
    background_tasks: BackgroundTasks = None
):
    """
    Submit a profile for admin approval.
    """
    # Check if profile exists
    profile = await db.researcher_profiles.find_one({"user_id": current_user.id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Check if profile is complete enough to submit
    if profile.get("completion_percentage", 0) < 70:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile is not complete enough to submit (minimum 70% completion required)"
        )
    
    # Update status to pending approval
    await db.researcher_profiles.update_one(
        {"user_id": current_user.id},
        {"$set": {
            "status": ProfileStatus.PENDING_APPROVAL,
            "updated_at": datetime.now(),
            "feedback": None,
            "rejection_reason": None
        }}
    )
    
    # Get the updated profile
    updated_profile = await db.researcher_profiles.find_one({"user_id": current_user.id})
    
    # Notify admins (just log it for now)
    if background_tasks:
        # Get admin emails
        admins = await db.users.find({"is_admin": True}).to_list(100)
        admin_emails = [admin.get("email") for admin in admins if admin.get("email")]
        
        # Log notification for each admin
        for email in admin_emails:
            background_tasks.add_task(
                log_notification,
                email,
                "New Profile Submission",
                f"A new researcher profile has been submitted for approval: {current_user.get('first_name')} {current_user.get('last_name')}"
            )
    
    return updated_profile


@api_router.get("/profiles/{profile_id}", response_model=ResearcherProfile)
async def get_profile_by_id(profile_id: str):
    profile = await db.researcher_profiles.find_one({"id": profile_id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return profile


@api_router.get("/researchers/search", response_model=List[ResearcherProfile])
async def search_researchers(
    query: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100)
):
    """
    Basic researcher search endpoint.
    Returns only approved profiles matching the query.
    """
    # Start with base filter - only return approved profiles
    filter_query = {"status": "approved"}
    
    # Add text search if query is provided
    if query:
        filter_query["$or"] = [
            {"academic_title": {"$regex": query, "$options": "i"}},
            {"institution_name": {"$regex": query, "$options": "i"}},
            {"department": {"$regex": query, "$options": "i"}},
            {"bio": {"$regex": query, "$options": "i"}}
        ]
    
    # Execute the query
    profiles = await db.researcher_profiles.find(filter_query).limit(limit).to_list(limit)
    
    return profiles


@api_router.get("/researchers/search", response_model=List[ResearcherProfile])
async def search_researchers(
    query: str = Query(None, description="General search query"),
    research_interests: str = Query(None, description="Comma-separated research interests to filter by"),
    institution: str = Query(None, description="Institution name to filter by"),
    academic_title: str = Query(None, description="Academic title to filter by"),
    country: str = Query(None, description="Country to filter by"),
    city: str = Query(None, description="City to filter by"),
    min_completion: int = Query(0, description="Minimum profile completion percentage"),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of results to return"),
    offset: int = Query(0, ge=0, description="Number of results to skip for pagination")
):
    """
    Search for researchers based on multiple criteria.
    Returns only approved profiles.
    """
    # Start with base filter - only return approved profiles
    filter_query = {"status": "approved"}
    
    # Add additional filters based on query parameters
    if query:
        # Search in multiple fields
        filter_query["$or"] = [
            {"academic_title": {"$regex": query, "$options": "i"}},
            {"institution_name": {"$regex": query, "$options": "i"}},
            {"department": {"$regex": query, "$options": "i"}},
            {"bio": {"$regex": query, "$options": "i"}}
        ]
    
    if research_interests:
        interests = [interest.strip() for interest in research_interests.split(",")]
        filter_query["research_interests"] = {"$in": interests}
    
    if institution:
        filter_query["institution_name"] = {"$regex": institution, "$options": "i"}
    
    if academic_title:
        filter_query["academic_title"] = {"$regex": academic_title, "$options": "i"}
    
    if country:
        filter_query["country"] = {"$regex": country, "$options": "i"}
    
    if city:
        filter_query["city"] = {"$regex": city, "$options": "i"}
    
    if min_completion > 0:
        filter_query["completion_percentage"] = {"$gte": min_completion}
    
    # Execute the query
    profiles = await db.researcher_profiles.find(filter_query).skip(offset).limit(limit).to_list(limit)
    
    return profiles


@api_router.get("/researchers/filters", response_model=Dict)
async def get_search_filters():
    """
    Get available filter options for the researcher search.
    """
    # Query all approved profiles
    profiles = await db.researcher_profiles.find({"status": "approved"}).to_list(1000)
    
    # Extract unique values for filters
    academic_titles = set()
    institutions = set()
    countries = set()
    cities = set()
    all_interests = set()
    
    for profile in profiles:
        if profile.get("academic_title"):
            academic_titles.add(profile["academic_title"])
        
        if profile.get("institution_name"):
            institutions.add(profile["institution_name"])
        
        if profile.get("country"):
            countries.add(profile["country"])
        
        if profile.get("city"):
            cities.add(profile["city"])
        
        if profile.get("research_interests"):
            for interest in profile["research_interests"]:
                all_interests.add(interest)
    
    return {
        "academic_titles": sorted(list(academic_titles)),
        "institutions": sorted(list(institutions)),
        "countries": sorted(list(countries)),
        "cities": sorted(list(cities)),
        "research_interests": sorted(list(all_interests))
    }


def calculate_profile_completion(profile: dict) -> int:
    """Calculate the completion percentage of a researcher profile"""
    required_fields = [
        "academic_title", 
        "institution_name", 
        "department", 
        "research_interests", 
        "bio", 
        "location", 
        "contact_email"
    ]
    
    # Count the number of required fields that are populated
    completed_fields = sum(1 for field in required_fields if field in profile and profile[field])
    
    # Calculate percentage
    percentage = int((completed_fields / len(required_fields)) * 100)
    
    return percentage

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
    feedback: Optional[str] = None
    rejection_reason: Optional[str] = None
    admin_notes: Optional[Dict] = {}
    review_date: Optional[datetime] = None
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

async def create_verification_token(db, user_id: str, purpose: str) -> VerificationToken:
    token = VerificationToken(
        user_id=user_id,
        purpose=purpose,
        expires_at=datetime.now() + timedelta(hours=24)
    )
    await db.verification_tokens.insert_one(token.dict())
    return token

async def get_verification_token(db, token: str):
    return await db.verification_tokens.find_one({"token": token})

async def mark_token_as_used(db, token_id: str):
    await db.verification_tokens.update_one(
        {"id": token_id},
        {"$set": {"is_used": True}}
    )

async def send_verification_email(email: str, token: str, name: str):
    # Get email configuration from environment variables
    smtp_server = os.environ.get("SMTP_SERVER")
    smtp_port = int(os.environ.get("SMTP_PORT", 587))
    smtp_username = os.environ.get("SMTP_USERNAME")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    from_email = os.environ.get("FROM_EMAIL")
    
    # Create verification URL
    verification_url = f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/verify-email/{token}"
    
    # Create email message
    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = email
    msg["Subject"] = "Verify your email address"
    
    # Email body
    body = f"""
    Dear {name},
    
    Thank you for registering with Bangladesh Academic Network. Please verify your email address by clicking the link below:
    
    {verification_url}
    
    This link will expire in 24 hours.
    
    If you did not register for an account, please ignore this email.
    
    Best regards,
    Bangladesh Academic Network Team
    """
    
    msg.attach(MIMEText(body, "plain"))
    
    try:
        # Connect to SMTP server and send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
    except Exception as e:
        logging.error(f"Failed to send verification email: {str(e)}")
        # Don't raise the exception as this is running in a background task

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
    user = await db.users.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    user = User(**user)
    return user

async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not enough permissions"
        )
    return current_user

# Auth routes
async def send_verification_email(user_id: str, email: str, name: str):
    """
    Send a verification email to the user
    """
    # Create token
    token_data = VerificationToken(
        user_id=user_id,
        purpose="email_verification",
        expires_at=datetime.now() + timedelta(hours=24)
    )
    
    # Save token to database
    token_dict = token_data.dict()
    await db.verification_tokens.insert_one(token_dict)
    
    # Build verification link
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    verification_link = f"{frontend_url}/verify-email?token={token_data.token}"
    
    # Log the verification email details (in a real app, this would send an actual email)
    logging.info(f"Verification email would be sent to {email}")
    logging.info(f"Verification link: {verification_link}")
    
    # In a real app, you would send an actual email with the verification link
    # For this demo, we'll just log the verification link

@api_router.post("/register", response_model=User)
async def register_user(user: UserCreate, background_tasks: BackgroundTasks):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Create user object
    user_id = str(uuid.uuid4())
    user_data = {
        "id": user_id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "password": hashed_password,
        "is_admin": user.is_admin,
        "email_verified": False,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    # Insert into database
    await db.users.insert_one(user_data)
    
    # Send verification email in background
    background_tasks.add_task(
        send_verification_email,
        user_id,
        user.email,
        f"{user.first_name} {user.last_name}"
    )
    
    # Return user without password
    created_user = await db.users.find_one({"id": user_id})
    return created_user


@api_router.get("/verify-email/{token}")
async def verify_email(token: str):
    # Get the token from the database
    token_data = await get_verification_token(db, token)
    
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    # Check if token is expired
    if datetime.fromisoformat(str(token_data["expires_at"])) < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired"
        )
    
    # Check if token is already used
    if token_data["is_used"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has already been used"
        )
    
    # Mark the token as used
    await mark_token_as_used(db, token_data["id"])
    
    # Update the user's email_verified status
    await db.users.update_one(
        {"id": token_data["user_id"]},
        {"$set": {"email_verified": True}}
    )
    
    return {"message": "Email verified successfully"}

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

# Profile routes
@api_router.post("/profiles", response_model=ResearcherProfile)
async def create_profile(
    profile_data: Dict = Body(...),
    current_user: dict = Depends(get_current_user),
):
    # Check if profile already exists
    existing_profile = await db.profiles.find_one({"user_id": current_user["id"]})
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists for this user"
        )
    
    # Create new profile object
    profile = ResearcherProfile(
        user_id=current_user["id"],
        **profile_data
    )
    
    # Calculate completion percentage
    completion_fields = [
        profile.academic_title,
        profile.institution_name,
        profile.department,
        profile.bio,
        profile.country,
        profile.city,
        profile.contact_email
    ]
    completed_fields = sum(1 for field in completion_fields if field)
    if profile.research_interests:
        completed_fields += 1
    
    profile.completion_percentage = int((completed_fields / 8) * 100)
    
    # Set status based on email verification
    if current_user.get("email_verified", False):
        profile.status = ProfileStatus.VERIFIED
    else:
        profile.status = ProfileStatus.PENDING_VERIFICATION
    
    # Save profile to database
    profile_dict = profile.dict()
    await db.profiles.insert_one(profile_dict)
    
    return profile

# Get user's profile
@api_router.get("/profiles/me", response_model=ResearcherProfile)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    profile = await db.profiles.find_one({"user_id": current_user["id"]})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return profile

# Update user's profile
@api_router.put("/profiles/me", response_model=ResearcherProfile)
async def update_my_profile(
    profile_data: Dict = Body(...),
    current_user: dict = Depends(get_current_user),
):
    # Check if profile exists
    existing_profile = await db.profiles.find_one({"user_id": current_user["id"]})
    if not existing_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Update the profile
    profile_dict = existing_profile.copy()
    profile_dict.update(profile_data)
    profile_dict["updated_at"] = datetime.now()
    
    # Calculate completion percentage
    completion_fields = [
        profile_dict.get("academic_title"),
        profile_dict.get("institution_name"),
        profile_dict.get("department"),
        profile_dict.get("bio"),
        profile_dict.get("country"),
        profile_dict.get("city"),
        profile_dict.get("contact_email")
    ]
    completed_fields = sum(1 for field in completion_fields if field)
    if profile_dict.get("research_interests"):
        completed_fields += 1
    
    profile_dict["completion_percentage"] = int((completed_fields / 8) * 100)
    
    # Update in database
    await db.profiles.update_one(
        {"user_id": current_user["id"]},
        {"$set": profile_dict}
    )
    
    # Return updated profile
    updated_profile = await db.profiles.find_one({"user_id": current_user["id"]})
    return updated_profile

# Email verification endpoint
@api_router.get("/verify-email/{token}")
async def verify_email(token: str):
    # Check if token exists
    token_data = await db.verification_tokens.find_one({"token": token})
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    # Check if token is expired
    if token_data["expires_at"] < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired"
        )
    
    # Check if token is already used
    if token_data["is_used"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has already been used"
        )
    
    # Mark token as used
    await db.verification_tokens.update_one(
        {"id": token_data["id"]},
        {"$set": {"is_used": True}}
    )
    
    # Update user's email_verified status
    await db.users.update_one(
        {"id": token_data["user_id"]},
        {"$set": {"email_verified": True}}
    )
    
    # Update profile status if exists
    await db.profiles.update_one(
        {"user_id": token_data["user_id"]},
        {"$set": {"status": ProfileStatus.VERIFIED}}
    )
    
    return {"message": "Email verified successfully"}

# Admin routes for profile approval workflow
@api_router.get("/admin/profiles", response_model=List[ResearcherProfile])
async def get_profiles_for_admin(
    status: Optional[ProfileStatus] = Query(None),
    current_user: User = Depends(get_current_admin)
):
    """
    Get all researcher profiles for admin review.
    Optionally filter by status.
    """
    query = {}
    if status:
        query["status"] = status
    
    profiles = await db.researcher_profiles.find(query).to_list(1000)
    return profiles


@api_router.get("/admin/profiles/{profile_id}", response_model=ResearcherProfile)
async def get_profile_details_for_admin(
    profile_id: str,
    current_user: User = Depends(get_current_admin)
):
    """
    Get detailed information about a specific profile for admin review.
    """
    profile = await db.researcher_profiles.find_one({"id": profile_id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return profile


@api_router.put("/admin/profiles/{profile_id}/approve", response_model=ResearcherProfile)
async def approve_profile(
    profile_id: str, 
    current_user: User = Depends(get_current_admin),
    background_tasks: BackgroundTasks = None
):
    """
    Approve a researcher profile.
    """
    # Check if profile exists
    profile = await db.researcher_profiles.find_one({"id": profile_id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Update status to approved
    await db.researcher_profiles.update_one(
        {"id": profile_id},
        {"$set": {
            "status": ProfileStatus.APPROVED,
            "updated_at": datetime.now()
        }}
    )
    
    # Get the updated profile
    updated_profile = await db.researcher_profiles.find_one({"id": profile_id})
    
    # Get user info for notification
    user = await db.users.find_one({"id": profile["user_id"]})
    
    # Send notification in background (just log it for now)
    if background_tasks and user:
        background_tasks.add_task(
            log_notification,
            user["email"],
            "Profile Approved",
            f"Your researcher profile has been approved and is now publicly visible."
        )
    
    return updated_profile


@api_router.put("/admin/profiles/{profile_id}/reject", response_model=ResearcherProfile)
async def reject_profile(
    profile_id: str,
    feedback: Dict = Body(...),
    current_user: User = Depends(get_current_admin),
    background_tasks: BackgroundTasks = None
):
    """
    Reject a researcher profile with feedback.
    """
    # Check if profile exists
    profile = await db.researcher_profiles.find_one({"id": profile_id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Update status to rejected and add feedback
    await db.researcher_profiles.update_one(
        {"id": profile_id},
        {"$set": {
            "status": ProfileStatus.DRAFT,  # Set back to draft for editing
            "feedback": feedback.get("message", ""),
            "rejection_reason": feedback.get("reason", ""),
            "updated_at": datetime.now()
        }}
    )
    
    # Get the updated profile
    updated_profile = await db.researcher_profiles.find_one({"id": profile_id})
    
    # Get user info for notification
    user = await db.users.find_one({"id": profile["user_id"]})
    
    # Send notification in background (just log it for now)
    if background_tasks and user:
        background_tasks.add_task(
            log_notification,
            user["email"],
            "Profile Needs Updates",
            f"Your researcher profile requires some updates before it can be approved: {feedback.get('message', '')}"
        )
    
    return updated_profile


async def log_notification(email: str, subject: str, message: str):
    """
    Helper function to log notifications until email service is implemented.
    """
    logging.info(f"NOTIFICATION TO: {email}")
    logging.info(f"SUBJECT: {subject}")
    logging.info(f"MESSAGE: {message}")


# Connection endpoints
@api_router.post("/connections", response_model=ConnectionRequest)
async def create_connection_request(
    connection: ConnectionRequestCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Send a connection request to another researcher.
    """
    # Check if recipient exists
    recipient = await db.users.find_one({"id": connection.recipient_id})
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found"
        )
    
    # Check if this is a self-connection
    if current_user["id"] == connection.recipient_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send connection request to yourself"
        )
    
    # Check if a connection already exists
    existing_connection = await db.connections.find_one({
        "$or": [
            {"requester_id": current_user["id"], "recipient_id": connection.recipient_id},
            {"requester_id": connection.recipient_id, "recipient_id": current_user["id"]}
        ]
    })
    
    if existing_connection:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Connection request already exists"
        )
    
    # Create connection request
    connection_request = ConnectionRequest(
        requester_id=current_user["id"],
        recipient_id=connection.recipient_id,
        message=connection.message
    )
    
    # Insert into database
    await db.connections.insert_one(connection_request.dict())
    
    return connection_request


@api_router.get("/connections", response_model=List[ConnectionRequest])
async def get_my_connections(
    status: Optional[ConnectionStatus] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all connection requests for the current user.
    Optionally filter by status.
    """
    # Build the query
    query = {
        "$or": [
            {"requester_id": current_user["id"]},
            {"recipient_id": current_user["id"]}
        ]
    }
    
    # Add status filter if provided
    if status:
        query["status"] = status
    
    # Fetch connections
    connections = await db.connections.find(query).to_list(1000)
    
    return connections


@api_router.put("/connections/{connection_id}/accept", response_model=ConnectionRequest)
async def accept_connection(
    connection_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Accept a connection request.
    Only the recipient can accept a connection request.
    """
    # Find the connection request
    connection = await db.connections.find_one({"id": connection_id})
    
    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection request not found"
        )
    
    # Check if the current user is the recipient
    if connection["recipient_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the recipient can accept a connection request"
        )
    
    # Check if the connection is already accepted
    if connection["status"] == ConnectionStatus.ACCEPTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Connection request already accepted"
        )
    
    # Update the connection status
    await db.connections.update_one(
        {"id": connection_id},
        {"$set": {
            "status": ConnectionStatus.ACCEPTED,
            "updated_at": datetime.now()
        }}
    )
    
    # Return the updated connection
    updated_connection = await db.connections.find_one({"id": connection_id})
    return updated_connection


@api_router.put("/connections/{connection_id}/reject", response_model=ConnectionRequest)
async def reject_connection(
    connection_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Reject a connection request.
    Only the recipient can reject a connection request.
    """
    # Find the connection request
    connection = await db.connections.find_one({"id": connection_id})
    
    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection request not found"
        )
    
    # Check if the current user is the recipient
    if connection["recipient_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the recipient can reject a connection request"
        )
    
    # Update the connection status
    await db.connections.update_one(
        {"id": connection_id},
        {"$set": {
            "status": ConnectionStatus.REJECTED,
            "updated_at": datetime.now()
        }}
    )
    
    # Return the updated connection
    updated_connection = await db.connections.find_one({"id": connection_id})
    return updated_connection


@api_router.get("/connections/suggestions", response_model=List[ResearcherProfile])
async def get_connection_suggestions(
    limit: int = Query(10, ge=1, le=50),
    current_user: dict = Depends(get_current_user)
):
    """
    Get connection suggestions based on research interests.
    """
    # Get the current user's profile
    my_profile = await db.researcher_profiles.find_one({"user_id": current_user["id"]})
    
    if not my_profile or not my_profile.get("research_interests"):
        # If no profile or no research interests, just return some random approved profiles
        suggestions = await db.researcher_profiles.find({
            "status": "approved",
            "user_id": {"$ne": current_user["id"]}
        }).limit(limit).to_list(limit)
        return suggestions
    
    # Get my connections (to exclude them from suggestions)
    my_connections = await db.connections.find({
        "$or": [
            {"requester_id": current_user["id"]},
            {"recipient_id": current_user["id"]}
        ],
        "status": {"$in": [ConnectionStatus.PENDING, ConnectionStatus.ACCEPTED]}
    }).to_list(1000)
    
    connected_user_ids = set()
    for conn in my_connections:
        connected_user_ids.add(conn["requester_id"])
        connected_user_ids.add(conn["recipient_id"])
    
    # Remove my own ID if it's in the set
    if current_user["id"] in connected_user_ids:
        connected_user_ids.remove(current_user["id"])
    
    # Find researchers with similar interests
    suggestions = await db.researcher_profiles.find({
        "status": "approved",
        "user_id": {"$nin": list(connected_user_ids)},
        "research_interests": {"$in": my_profile.get("research_interests", [])}
    }).limit(limit).to_list(limit)
    
    # If we don't have enough suggestions, get some random ones
    if len(suggestions) < limit:
        random_limit = limit - len(suggestions)
        existing_ids = [s["user_id"] for s in suggestions]
        random_suggestions = await db.researcher_profiles.find({
            "status": "approved",
            "user_id": {"$nin": list(connected_user_ids) + existing_ids}
        }).limit(random_limit).to_list(random_limit)
        
        suggestions.extend(random_suggestions)
    
    return suggestions


# Research Project endpoints
@api_router.post("/projects", response_model=ResearchProject)
async def create_project(
    project: ResearchProjectCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new research project.
    """
    # Create the project with the current user as owner
    project_data = project.dict(exclude_unset=True)
    
    new_project = ResearchProject(
        **project_data,
        owner_id=current_user["id"],
        # Add default team member (the owner) with admin role
        team_members=[{
            "user_id": current_user["id"],
            "role": "owner",
            "permissions": ["admin"]
        }]
    )
    
    # Insert into database
    await db.research_projects.insert_one(new_project.dict())
    
    return new_project


@api_router.get("/projects", response_model=List[ResearchProject])
async def list_projects(
    current_user: dict = Depends(get_current_user),
    status: Optional[ProjectStatus] = None
):
    """
    List all research projects where the current user is a team member.
    Optionally filter by status.
    """
    # Build query
    query = {
        "team_members.user_id": current_user["id"]
    }
    
    if status:
        query["status"] = status
    
    # Execute query
    projects = await db.research_projects.find(query).to_list(1000)
    
    return projects


@api_router.get("/projects/{project_id}", response_model=ResearchProject)
async def get_project(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific research project.
    User must be a team member or the project must be public.
    """
    project = await db.research_projects.find_one({"id": project_id})
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is a team member or project is public
    is_team_member = any(member["user_id"] == current_user["id"] for member in project["team_members"])
    
    if not is_team_member and project["visibility"] != ProjectVisibility.PUBLIC:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this project"
        )
    
    return project


@api_router.put("/projects/{project_id}", response_model=ResearchProject)
async def update_project(
    project_id: str,
    project_update: ResearchProjectUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update a research project.
    User must be a team member with edit permissions.
    """
    # Get the project
    project = await db.research_projects.find_one({"id": project_id})
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is a team member with edit permissions
    is_admin = False
    for member in project["team_members"]:
        if member["user_id"] == current_user["id"]:
            if "admin" in member.get("permissions", []) or member["role"] == "owner":
                is_admin = True
                break
    
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this project"
        )
    
    # Update the project
    update_data = project_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.now()
    
    await db.research_projects.update_one(
        {"id": project_id},
        {"$set": update_data}
    )
    
    # Get updated project
    updated_project = await db.research_projects.find_one({"id": project_id})
    
    return updated_project


@api_router.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a research project.
    Only the project owner can delete it.
    """
    # Get the project
    project = await db.research_projects.find_one({"id": project_id})
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is the owner
    is_owner = False
    for member in project["team_members"]:
        if member["user_id"] == current_user["id"] and member["role"] == "owner":
            is_owner = True
            break
    
    if not is_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the project owner can delete it"
        )
    
    # Delete the project
    await db.research_projects.delete_one({"id": project_id})
    
    return {"message": "Project deleted successfully"}


@api_router.post("/projects/{project_id}/team", response_model=ResearchProject)
async def add_team_member(
    project_id: str,
    member_data: Dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Add a team member to a project.
    Only team members with admin permissions can add new members.
    """
    # Validate input
    if "user_id" not in member_data or "role" not in member_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id and role are required"
        )
    
    # Make sure the user exists
    user = await db.users.find_one({"id": member_data["user_id"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get the project
    project = await db.research_projects.find_one({"id": project_id})
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is a team member with admin permissions
    is_admin = False
    for member in project["team_members"]:
        if member["user_id"] == current_user["id"]:
            if "admin" in member.get("permissions", []) or member["role"] == "owner":
                is_admin = True
                break
    
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to add team members"
        )
    
    # Check if user is already a team member
    if any(member["user_id"] == member_data["user_id"] for member in project["team_members"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a team member"
        )
    
    # Set default permissions based on role
    if "permissions" not in member_data:
        if member_data["role"] == "coordinator":
            member_data["permissions"] = ["edit", "invite"]
        elif member_data["role"] == "collaborator":
            member_data["permissions"] = ["edit"]
        else:
            member_data["permissions"] = ["view"]
    
    # Add the team member
    await db.research_projects.update_one(
        {"id": project_id},
        {
            "$push": {"team_members": member_data},
            "$set": {"updated_at": datetime.now()}
        }
    )
    
    # Get updated project
    updated_project = await db.research_projects.find_one({"id": project_id})
    
    return updated_project


# Include the router in the main app
app.include_router(api_router)



# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
