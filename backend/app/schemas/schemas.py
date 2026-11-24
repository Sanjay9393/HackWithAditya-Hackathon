from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import datetime

# --- Auth & User ---
class UserBase(BaseModel):
    email: str
    username: str
    full_name: str
    phone: Optional[str] = None
    preferred_language: Optional[str] = "en"

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "citizen"

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserProfileSchema(BaseModel):
    age: Optional[int] = None
    state: Optional[str] = "Andhra Pradesh"
    district: Optional[str] = "Guntur"
    village: Optional[str] = "Chandanagar"
    ward: Optional[str] = None
    occupation: Optional[str] = None
    is_student: Optional[bool] = False
    is_farmer: Optional[bool] = False
    annual_income: Optional[float] = None
    family_size: Optional[int] = 4
    gender: Optional[str] = None
    disability_status: Optional[bool] = False
    housing_status: Optional[str] = "kutcha"
    land_holding_acres: Optional[float] = 0.0

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime.datetime
    profile: Optional[UserProfileSchema] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Village & Ward ---
class WardResponse(BaseModel):
    id: int
    ward_number: int
    ward_name: str
    representative_name: Optional[str] = None
    representative_phone: Optional[str] = None

    class Config:
        from_attributes = True

class VillageResponse(BaseModel):
    id: int
    name: str
    name_te: Optional[str] = None
    district: str
    state: str
    pincode: str
    population: int
    total_wards: int
    panchayat_head: str
    latitude: float
    longitude: float

    class Config:
        from_attributes = True

# --- Development Projects ---
class ProjectUpdateSchema(BaseModel):
    id: Optional[int] = None
    update_date: Optional[str] = None
    title: str
    notes: Optional[str] = None
    progress_pct: int
    status: str
    updated_by: Optional[str] = "Panchayat Engineer"

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    project_name: str
    project_name_te: Optional[str] = None
    description: Optional[str] = None
    description_te: Optional[str] = None
    category: str
    location_name: str
    ward_number: int = 1
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    department: str
    budget_sanctioned: float = 0.0
    expenditure_actual: float = 0.0
    start_date: Optional[str] = None
    expected_completion: Optional[str] = None
    actual_completion: Optional[str] = None
    status: str = "In progress"
    progress_pct: int = 0
    responsible_authority: Optional[str] = None
    contractor_name: Optional[str] = None
    source_document: Optional[str] = None
    source_url: Optional[str] = None
    verification_status: Optional[str] = "Sample Data"
    before_photo_url: Optional[str] = None
    progress_photo_url: Optional[str] = None
    after_photo_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    village_id: int = 1

class ProjectUpdateInput(BaseModel):
    project_name: Optional[str] = None
    project_name_te: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location_name: Optional[str] = None
    ward_number: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    budget_sanctioned: Optional[float] = None
    expenditure_actual: Optional[float] = None
    status: Optional[str] = None
    progress_pct: Optional[int] = None
    expected_completion: Optional[str] = None
    contractor_name: Optional[str] = None
    source_document: Optional[str] = None
    before_photo_url: Optional[str] = None
    progress_photo_url: Optional[str] = None
    after_photo_url: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    village_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    updates: List[ProjectUpdateSchema] = []

    class Config:
        from_attributes = True

# --- Budget ---
class BudgetRecordSchema(BaseModel):
    id: int
    financial_year: str
    category: str
    sanctioned_amount: float
    spent_amount: float
    allocated_project_id: Optional[int] = None
    verification_status: str
    source_document: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class BudgetAnalyticsResponse(BaseModel):
    financial_year: str
    total_sanctioned: float
    total_spent: float
    utilization_pct: float
    categories: List[Dict[str, Any]]
    projects: List[Dict[str, Any]]
    ai_insights: List[str]
    verification_status: str

# --- Civic Issues ---
class IssueUpdateSchema(BaseModel):
    id: Optional[int] = None
    status: str
    update_text: str
    updated_by: Optional[str] = "Ward Officer"
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class CivicIssueBase(BaseModel):
    title: str
    description: str
    category: str
    photo_url: Optional[str] = None
    location_name: str
    ward_number: int = 1
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    priority: Optional[str] = "Medium"
    is_anonymous: Optional[bool] = False
    reporter_name: Optional[str] = None
    reporter_phone: Optional[str] = None

class CivicIssueCreate(CivicIssueBase):
    village_id: int = 1

class CivicIssueAdminUpdate(BaseModel):
    status: Optional[str] = None
    assigned_department: Optional[str] = None
    assigned_officer: Optional[str] = None
    resolution_notes: Optional[str] = None
    priority: Optional[str] = None
    update_comment: Optional[str] = None

class CivicIssueResponse(CivicIssueBase):
    id: int
    village_id: int
    user_id: Optional[int] = None
    status: str
    assigned_department: Optional[str] = None
    assigned_officer: Optional[str] = None
    resolution_notes: Optional[str] = None
    resolution_date: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    updates: List[IssueUpdateSchema] = []

    class Config:
        from_attributes = True

# --- Announcements ---
class AnnouncementBase(BaseModel):
    title: str
    title_te: Optional[str] = None
    content: str
    content_te: Optional[str] = None
    category: str = "General"
    publish_date: Optional[str] = None
    expiry_date: Optional[str] = None
    priority: Optional[str] = "Normal"
    target_ward: Optional[str] = "All Wards"
    source: Optional[str] = "Panchayat Office"
    is_active: Optional[bool] = True

class AnnouncementCreate(AnnouncementBase):
    village_id: int = 1

class AnnouncementResponse(AnnouncementBase):
    id: int
    village_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Schemes & Recommendations ---
class SchemeBase(BaseModel):
    scheme_id: str
    name: str
    name_te: Optional[str] = None
    category: str
    government_level: str = "Central"
    department: str
    state_applicability: str = "All India"
    target_beneficiaries: str
    description: str
    description_te: Optional[str] = None
    eligibility_criteria_text: str
    eligibility_criteria_te: Optional[str] = None
    benefits_text: str
    benefits_te: Optional[str] = None
    application_steps_text: str
    application_steps_te: Optional[str] = None
    application_deadline: Optional[str] = "Ongoing / Open"
    official_url: str
    source_document: Optional[str] = None
    source_url: Optional[str] = None
    verification_status: Optional[str] = "Verified"
    last_verified_date: Optional[str] = "2026-01-15"
    eligibility_rules: Optional[Dict[str, Any]] = None
    required_documents: Optional[List[str]] = []
    optional_documents: Optional[List[str]] = []

class SchemeResponse(SchemeBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class SchemeRecommendationResult(BaseModel):
    scheme: SchemeResponse
    match_status: str # "Potential match", "Likely not eligible", "Needs more information"
    match_score: int # 0 - 100
    matched_criteria: List[str]
    unmet_criteria: List[str]
    missing_info: List[str]
    explanation: str
    explanation_te: Optional[str] = None
    required_documents: List[str]

class EligibilityEvaluationRequest(BaseModel):
    scheme_id: int
    profile: UserProfileSchema

class EligibilityEvaluationResponse(BaseModel):
    scheme_id: int
    scheme_name: str
    status: str # "Eligible", "Ineligible", "Incomplete Information"
    score: int
    criteria_breakdown: List[Dict[str, Any]]
    explanation: str
    required_documents: List[str]

# --- Document Checklist ---
class DocumentChecklistCreate(BaseModel):
    scheme_id: int
    document_name: str
    document_type: Optional[str] = "Identity Proof"
    status: Optional[str] = "Not collected"
    notes: Optional[str] = None

class DocumentChecklistUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    file_url: Optional[str] = None

class DocumentChecklistResponse(BaseModel):
    id: int
    scheme_id: int
    document_name: str
    document_type: str
    status: str
    file_url: Optional[str] = None
    notes: Optional[str] = None
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Meetings ---
class MeetingDecisionSchema(BaseModel):
    id: Optional[int] = None
    decision_number: int
    decision_text: str
    decision_te: Optional[str] = None

    class Config:
        from_attributes = True

class MeetingActionItemSchema(BaseModel):
    id: Optional[int] = None
    action_text: str
    action_te: Optional[str] = None
    responsible_department: str
    deadline: Optional[str] = None
    status: str = "Pending"

    class Config:
        from_attributes = True

class MeetingResponse(BaseModel):
    id: int
    village_id: int
    title: str
    title_te: Optional[str] = None
    meeting_date: str
    location: str
    agenda: str
    agenda_te: Optional[str] = None
    status: str
    minutes_text: Optional[str] = None
    minutes_te: Optional[str] = None
    summary_en: Optional[str] = None
    summary_te: Optional[str] = None
    document_url: Optional[str] = None
    decisions: List[MeetingDecisionSchema] = []
    action_items: List[MeetingActionItemSchema] = []

    class Config:
        from_attributes = True

# --- Services Directory ---
class GovernmentServiceResponse(BaseModel):
    id: int
    name: str
    name_te: Optional[str] = None
    category: str
    address: str
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    opening_hours: str
    services_offered: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    official_link: Optional[str] = None
    verification_status: str

    class Config:
        from_attributes = True

# --- Agriculture ---
class AgricultureAdvisoryResponse(BaseModel):
    id: int
    crop_name: str
    crop_name_te: Optional[str] = None
    season: str
    soil_type: str
    water_requirement: str
    advisory_text: str
    advisory_te: Optional[str] = None
    pest_alerts: Optional[str] = None

    class Config:
        from_attributes = True

class MarketPriceResponse(BaseModel):
    id: int
    crop_name: str
    market_name: str
    min_price: float
    max_price: float
    modal_price: float
    unit: str
    price_date: str
    verification_status: str

    class Config:
        from_attributes = True

# --- Employment ---
class EmploymentResponse(BaseModel):
    id: int
    title: str
    title_te: Optional[str] = None
    category: str
    description: str
    wage_rate: str
    working_days: str
    eligibility: str
    application_procedure: str
    official_link: Optional[str] = None
    verification_status: str

    class Config:
        from_attributes = True

# --- Notifications ---
class NotificationResponse(BaseModel):
    id: int
    title: str
    title_te: Optional[str] = None
    message: str
    message_te: Optional[str] = None
    category: str
    is_read: bool
    link_url: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- AI & Chat ---
class AIChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en" # "en" or "te"
    session_id: Optional[str] = None

class AIChatResponse(BaseModel):
    session_id: str
    reply: str
    language: str
    citations: List[Dict[str, Any]]
    confidence_note: str

class AIClassifyIssueRequest(BaseModel):
    title: str
    description: str

class AIClassifyIssueResponse(BaseModel):
    category: str
    suggested_priority: str
    suggested_department: str
    summary: str
    potential_duplicates: List[Dict[str, Any]] = []

class AIDocumentProcessResponse(BaseModel):
    document_type: str
    extracted_text_preview: str
    summary: str
    summary_te: Optional[str] = None
    important_dates: List[str]
    decisions_found: List[str]
    action_items_found: List[str]
    confidence: str
