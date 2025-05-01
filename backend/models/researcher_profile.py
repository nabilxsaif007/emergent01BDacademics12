import uuid
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, EmailStr, Field


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