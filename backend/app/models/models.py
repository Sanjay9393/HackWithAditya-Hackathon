import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, Enum, JSON
)
from sqlalchemy.orm import relationship
from app.database.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="citizen") # citizen, admin, data_manager
    phone = Column(String(20), nullable=True)
    preferred_language = Column(String(10), default="en") # en, te
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    issues = relationship("CivicIssue", back_populates="user")
    saved_schemes = relationship("SavedScheme", back_populates="user")
    checklists = relationship("CitizenDocumentChecklist", back_populates="user")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    age = Column(Integer, nullable=True)
    state = Column(String(100), default="Andhra Pradesh")
    district = Column(String(100), default="Guntur")
    village = Column(String(100), default="Chandanagar")
    ward = Column(String(50), nullable=True)
    occupation = Column(String(100), nullable=True) # farmer, student, wage_worker, self_employed, homemaker, retired
    is_student = Column(Boolean, default=False)
    is_farmer = Column(Boolean, default=False)
    annual_income = Column(Float, nullable=True)
    family_size = Column(Integer, default=4)
    gender = Column(String(20), nullable=True)
    disability_status = Column(Boolean, default=False)
    housing_status = Column(String(50), default="kutcha") # kutcha, pucca, semi-pucca, homeless
    land_holding_acres = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="profile")

class Village(Base):
    __tablename__ = "villages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    name_te = Column(String(150), nullable=True)
    district = Column(String(100), nullable=False)
    state = Column(String(100), default="Andhra Pradesh")
    pincode = Column(String(10), default="522001")
    population = Column(Integer, default=4850)
    total_wards = Column(Integer, default=8)
    panchayat_head = Column(String(150), default="K. Venkata Ramana (Sarpanch)")
    latitude = Column(Float, default=16.3067)
    longitude = Column(Float, default=80.4365)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    wards = relationship("Ward", back_populates="village")
    projects = relationship("DevelopmentProject", back_populates="village")
    issues = relationship("CivicIssue", back_populates="village")
    announcements = relationship("Announcement", back_populates="village")
    meetings = relationship("Meeting", back_populates="village")

class Ward(Base):
    __tablename__ = "wards"
    
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    ward_number = Column(Integer, nullable=False)
    ward_name = Column(String(100), nullable=False)
    representative_name = Column(String(150), nullable=True)
    representative_phone = Column(String(20), nullable=True)
    
    village = relationship("Village", back_populates="wards")

class DevelopmentProject(Base):
    __tablename__ = "development_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    ward_number = Column(Integer, default=1)
    project_name = Column(String(255), nullable=False)
    project_name_te = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    description_te = Column(Text, nullable=True)
    category = Column(String(50), nullable=False) # Roads, Drainage, Drinking water, Streetlights, Sanitation, Schools, Health, Buildings, Agriculture, Irrigation, Other
    location_name = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    department = Column(String(150), nullable=False)
    budget_sanctioned = Column(Float, default=0.0)
    expenditure_actual = Column(Float, default=0.0)
    start_date = Column(String(50), nullable=True)
    expected_completion = Column(String(50), nullable=True)
    actual_completion = Column(String(50), nullable=True)
    status = Column(String(50), default="In progress") # Proposed, Approved, Not started, In progress, Delayed, Completed, Cancelled
    progress_pct = Column(Integer, default=0)
    responsible_authority = Column(String(150), nullable=True)
    contractor_name = Column(String(150), nullable=True)
    source_document = Column(String(255), nullable=True)
    source_url = Column(String(500), nullable=True)
    verification_status = Column(String(50), default="Sample Data") # Verified, Sample Data, Pending Review
    before_photo_url = Column(String(500), nullable=True)
    progress_photo_url = Column(String(500), nullable=True)
    after_photo_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    village = relationship("Village", back_populates="projects")
    updates = relationship("ProjectUpdate", back_populates="project", cascade="all, delete-orphan")

class ProjectUpdate(Base):
    __tablename__ = "project_updates"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("development_projects.id"), nullable=False)
    update_date = Column(String(50), default=lambda: datetime.date.today().isoformat())
    title = Column(String(200), nullable=False)
    notes = Column(Text, nullable=True)
    progress_pct = Column(Integer, default=0)
    status = Column(String(50), nullable=False)
    updated_by = Column(String(100), default="Panchayat Engineer")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    project = relationship("DevelopmentProject", back_populates="updates")

class BudgetRecord(Base):
    __tablename__ = "budget_records"
    
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    financial_year = Column(String(20), default="2025-2026")
    category = Column(String(50), nullable=False)
    sanctioned_amount = Column(Float, default=0.0)
    spent_amount = Column(Float, default=0.0)
    allocated_project_id = Column(Integer, nullable=True)
    verification_status = Column(String(50), default="Sample Data")
    source_document = Column(String(255), default="Panchayat Annual Budget Resolution")
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class CivicIssue(Base):
    __tablename__ = "civic_issues"
    
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False) # Road damage, Water supply, Drainage, Garbage, Streetlights, Electricity, Public property, School, Health facilities, Other
    photo_url = Column(String(500), nullable=True)
    location_name = Column(String(255), nullable=False)
    ward_number = Column(Integer, default=1)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    priority = Column(String(20), default="Medium") # Low, Medium, High, Critical
    is_anonymous = Column(Boolean, default=False)
    reporter_name = Column(String(150), nullable=True)
    reporter_phone = Column(String(20), nullable=True)
    status = Column(String(50), default="Submitted") # Submitted, Acknowledged, Assigned, In progress, Resolved, Closed
    assigned_department = Column(String(150), nullable=True)
    assigned_officer = Column(String(150), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    resolution_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    village = relationship("Village", back_populates="issues")
    user = relationship("User", back_populates="issues")
    updates = relationship("IssueUpdate", back_populates="issue", cascade="all, delete-orphan")

class IssueUpdate(Base):
    __tablename__ = "issue_updates"
    
    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("civic_issues.id"), nullable=False)
    status = Column(String(50), nullable=False)
    update_text = Column(Text, nullable=False)
    updated_by = Column(String(100), default="Ward Officer")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    issue = relationship("CivicIssue", back_populates="updates")

class Announcement(Base):
    __tablename__ = "announcements"
    
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    title = Column(String(255), nullable=False)
    title_te = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    content_te = Column(Text, nullable=True)
    category = Column(String(50), default="General") # Water supply, Electricity, Health, Education, Panchayat, Gram Sabha, Agriculture, Government schemes, Emergency, General
    publish_date = Column(String(50), default=lambda: datetime.date.today().isoformat())
    expiry_date = Column(String(50), nullable=True)
    priority = Column(String(20), default="Normal") # Normal, Important, Urgent, Emergency
    target_ward = Column(String(50), default="All Wards")
    source = Column(String(150), default="Panchayat Office")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    village = relationship("Village", back_populates="announcements")

class Meeting(Base):
    __tablename__ = "meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    title = Column(String(255), nullable=False)
    title_te = Column(String(255), nullable=True)
    meeting_date = Column(String(50), nullable=False)
    location = Column(String(200), default="Gram Panchayat Meeting Hall")
    agenda = Column(Text, nullable=False)
    agenda_te = Column(Text, nullable=True)
    status = Column(String(50), default="Scheduled") # Scheduled, In Progress, Completed, Cancelled
    minutes_text = Column(Text, nullable=True)
    minutes_te = Column(Text, nullable=True)
    summary_en = Column(Text, nullable=True)
    summary_te = Column(Text, nullable=True)
    document_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    village = relationship("Village", back_populates="meetings")
    decisions = relationship("MeetingDecision", back_populates="meeting", cascade="all, delete-orphan")
    action_items = relationship("MeetingActionItem", back_populates="meeting", cascade="all, delete-orphan")

class MeetingDecision(Base):
    __tablename__ = "meeting_decisions"
    
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    decision_number = Column(Integer, default=1)
    decision_text = Column(Text, nullable=False)
    decision_te = Column(Text, nullable=True)
    
    meeting = relationship("Meeting", back_populates="decisions")

class MeetingActionItem(Base):
    __tablename__ = "meeting_action_items"
    
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    action_text = Column(Text, nullable=False)
    action_te = Column(Text, nullable=True)
    responsible_department = Column(String(150), nullable=False)
    deadline = Column(String(50), nullable=True)
    status = Column(String(50), default="Pending") # Pending, In Progress, Completed
    
    meeting = relationship("Meeting", back_populates="action_items")

class Scheme(Base):
    __tablename__ = "schemes"
    
    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    name_te = Column(String(255), nullable=True)
    category = Column(String(50), nullable=False) # Agriculture, Education, Healthcare, Women, Senior citizens, Housing, Employment, Disability, Financial assistance, Entrepreneurship, Social welfare
    government_level = Column(String(50), default="Central") # Central, State
    department = Column(String(200), nullable=False)
    state_applicability = Column(String(100), default="All India")
    target_beneficiaries = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    description_te = Column(Text, nullable=True)
    eligibility_criteria_text = Column(Text, nullable=False)
    eligibility_criteria_te = Column(Text, nullable=True)
    benefits_text = Column(Text, nullable=False)
    benefits_te = Column(Text, nullable=True)
    application_steps_text = Column(Text, nullable=False)
    application_steps_te = Column(Text, nullable=True)
    application_deadline = Column(String(100), default="Ongoing / Open")
    official_url = Column(String(500), nullable=False)
    source_document = Column(String(255), nullable=True)
    source_url = Column(String(500), nullable=True)
    verification_status = Column(String(50), default="Verified") # Verified, Official Portal, Sample Data
    last_verified_date = Column(String(50), default="2026-01-15")
    eligibility_rules = Column(JSON, nullable=True) # Structured JSON for Rule Engine
    required_documents = Column(JSON, nullable=True) # list of doc names
    optional_documents = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SavedScheme(Base):
    __tablename__ = "saved_schemes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    saved_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="saved_schemes")
    scheme = relationship("Scheme")

class CitizenDocumentChecklist(Base):
    __tablename__ = "citizen_document_checklists"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    document_name = Column(String(150), nullable=False)
    document_type = Column(String(100), default="Identity Proof")
    status = Column(String(50), default="Not collected") # Not collected, Collected, Uploaded, Needs verification
    file_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="checklists")
    scheme = relationship("Scheme")

class GovernmentService(Base):
    __tablename__ = "government_services"
    
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    name = Column(String(200), nullable=False)
    name_te = Column(String(200), nullable=True)
    category = Column(String(50), nullable=False) # Panchayat, Village secretariat, Health, Education, Agriculture, Banking, Ration, Social welfare, Employment, Emergency
    address = Column(String(255), nullable=False)
    contact_phone = Column(String(50), nullable=True)
    contact_email = Column(String(100), nullable=True)
    opening_hours = Column(String(100), default="9:00 AM - 5:00 PM (Mon-Sat)")
    services_offered = Column(Text, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    official_link = Column(String(500), nullable=True)
    verification_status = Column(String(50), default="Verified")

class EmploymentRecord(Base):
    __tablename__ = "employment_records"
    
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    title = Column(String(255), nullable=False)
    title_te = Column(String(255), nullable=True)
    category = Column(String(100), default="MGNREGA") # MGNREGA, Panchayat Contract, Agricultural Labor, Local Skill Work
    description = Column(Text, nullable=False)
    wage_rate = Column(String(100), default="Rs. 300 / day")
    working_days = Column(String(100), default="Up to 100 days/year")
    eligibility = Column(Text, nullable=False)
    application_procedure = Column(Text, nullable=False)
    official_link = Column(String(500), nullable=True)
    verification_status = Column(String(50), default="Sample Data")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class AgricultureRecord(Base):
    __tablename__ = "agriculture_records"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), nullable=False)
    crop_name_te = Column(String(100), nullable=True)
    season = Column(String(50), default="Kharif") # Kharif, Rabi, Zaid
    soil_type = Column(String(100), default="Black / Red Loamy")
    water_requirement = Column(String(100), default="Medium")
    advisory_text = Column(Text, nullable=False)
    advisory_te = Column(Text, nullable=True)
    pest_alerts = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class MarketPriceRecord(Base):
    __tablename__ = "market_price_records"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), nullable=False)
    market_name = Column(String(100), default="Guntur Agricultural Market Yard")
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False)
    unit = Column(String(20), default="Rs. / Quintal")
    price_date = Column(String(50), default=lambda: datetime.date.today().isoformat())
    verification_status = Column(String(50), default="Sample Demo Data")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    title_te = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    message_te = Column(Text, nullable=True)
    category = Column(String(50), default="announcement") # scheme, announcement, issue, meeting, work
    is_read = Column(Boolean, default=False)
    link_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    language = Column(String(10), default="en") # en, te
    title = Column(String(255), default="Village Inquiry")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), ForeignKey("chat_sessions.session_id"), nullable=False)
    role = Column(String(20), nullable=False) # user, assistant, system
    content = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    citations = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    session = relationship("ChatSession", back_populates="messages")

class DocumentKnowledge(Base):
    __tablename__ = "document_knowledge"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    document_type = Column(String(50), default="Gram Sabha Minutes")
    source_url = Column(String(500), nullable=True)
    raw_text = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    extracted_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
