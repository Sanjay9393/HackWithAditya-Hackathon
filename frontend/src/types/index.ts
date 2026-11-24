export interface UserProfile {
  age?: number;
  state?: string;
  district?: string;
  village?: string;
  ward?: string;
  occupation?: string;
  is_student?: boolean;
  is_farmer?: boolean;
  annual_income?: number;
  family_size?: number;
  gender?: string;
  disability_status?: boolean;
  housing_status?: string;
  land_holding_acres?: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'citizen' | 'admin' | 'data_manager';
  phone?: string;
  preferred_language: 'en' | 'te';
  profile?: UserProfile;
}

export interface ProjectUpdate {
  id?: number;
  update_date?: string;
  title: string;
  notes?: string;
  progress_pct: number;
  status: string;
  updated_by?: string;
}

export interface DevelopmentProject {
  id: number;
  village_id: number;
  ward_number: number;
  project_name: string;
  project_name_te?: string;
  description?: string;
  description_te?: string;
  category: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  department: string;
  budget_sanctioned: number;
  expenditure_actual: number;
  start_date?: string;
  expected_completion?: string;
  actual_completion?: string;
  status: string;
  progress_pct: number;
  responsible_authority?: string;
  contractor_name?: string;
  source_document?: string;
  source_url?: string;
  verification_status?: string;
  before_photo_url?: string;
  progress_photo_url?: string;
  after_photo_url?: string;
  created_at: string;
  updated_at: string;
  updates?: ProjectUpdate[];
}

export interface CivicIssueUpdate {
  id: number;
  status: string;
  update_text: string;
  updated_by: string;
  created_at: string;
}

export interface CivicIssue {
  id: number;
  village_id: number;
  user_id?: number;
  title: string;
  description: string;
  category: string;
  photo_url?: string;
  location_name: string;
  ward_number: number;
  latitude?: number;
  longitude?: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  is_anonymous: boolean;
  reporter_name?: string;
  reporter_phone?: string;
  status: 'Submitted' | 'Acknowledged' | 'Assigned' | 'In progress' | 'Resolved' | 'Closed';
  assigned_department?: string;
  assigned_officer?: string;
  resolution_notes?: string;
  resolution_date?: string;
  created_at: string;
  updated_at: string;
  updates?: CivicIssueUpdate[];
}

export interface Scheme {
  id: number;
  scheme_id: string;
  name: string;
  name_te?: string;
  category: string;
  government_level: 'Central' | 'State';
  department: string;
  state_applicability: string;
  target_beneficiaries: string;
  description: string;
  description_te?: string;
  eligibility_criteria_text: string;
  eligibility_criteria_te?: string;
  benefits_text: string;
  benefits_te?: string;
  application_steps_text: string;
  application_steps_te?: string;
  application_deadline?: string;
  official_url: string;
  source_document?: string;
  source_url?: string;
  verification_status: string;
  last_verified_date: string;
  eligibility_rules?: Record<string, any>;
  required_documents?: string[];
  optional_documents?: string[];
}

export interface SchemeRecommendation {
  scheme: Scheme;
  match_status: string;
  match_score: number;
  matched_criteria: string[];
  unmet_criteria: string[];
  missing_info: string[];
  explanation: string;
  explanation_te?: string;
  required_documents: string[];
}

export interface DocumentChecklistItem {
  id: number;
  scheme_id: number;
  document_name: string;
  document_type: string;
  status: 'Not collected' | 'Collected' | 'Uploaded' | 'Needs verification';
  file_url?: string;
  notes?: string;
  updated_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  title_te?: string;
  content: string;
  content_te?: string;
  category: string;
  publish_date: string;
  expiry_date?: string;
  priority: 'Normal' | 'Important' | 'Urgent' | 'Emergency';
  target_ward: string;
  source: string;
  is_active: boolean;
}

export interface MeetingDecision {
  id: number;
  decision_number: number;
  decision_text: string;
}

export interface MeetingActionItem {
  id: number;
  action_text: string;
  responsible_department: string;
  deadline?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface Meeting {
  id: number;
  title: string;
  title_te?: string;
  meeting_date: string;
  location: string;
  agenda: string;
  agenda_te?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  minutes_text?: string;
  summary_en?: string;
  summary_te?: string;
  document_url?: string;
  decisions: MeetingDecision[];
  action_items: MeetingActionItem[];
}

export interface GovernmentService {
  id: number;
  name: string;
  name_te?: string;
  category: string;
  address: string;
  contact_phone?: string;
  contact_email?: string;
  opening_hours: string;
  services_offered: string;
  latitude?: number;
  longitude?: number;
  official_link?: string;
  verification_status: string;
}

export interface AgricultureAdvisory {
  id: number;
  crop_name: string;
  crop_name_te?: string;
  season: string;
  soil_type: string;
  water_requirement: string;
  advisory_text: string;
  advisory_te?: string;
  pest_alerts?: string;
}

export interface MarketPrice {
  id: number;
  crop_name: string;
  market_name: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit: string;
  price_date: string;
  verification_status: string;
}

export interface EmploymentRecord {
  id: number;
  title: string;
  title_te?: string;
  category: string;
  description: string;
  wage_rate: string;
  working_days: string;
  eligibility: string;
  application_procedure: string;
  official_link?: string;
  verification_status: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  title_te?: string;
  message: string;
  message_te?: string;
  category: string;
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

export interface AIChatCitation {
  title: string;
  type: string;
  link?: string;
}

export interface AIChatResponse {
  session_id: string;
  reply: string;
  language: string;
  citations: AIChatCitation[];
  confidence_note: string;
}

export interface DashboardData {
  village: {
    name: string;
    name_te?: string;
    district: string;
    state: string;
    pincode: string;
    population: number;
    total_wards: number;
    panchayat_head: string;
  };
  kpis: {
    total_works: number;
    ongoing_works: number;
    completed_works: number;
    delayed_works: number;
    total_issues: number;
    resolved_issues: number;
    pending_issues: number;
    total_budget_sanctioned: number;
    total_budget_spent: number;
    budget_utilization_pct: number;
    announcements_count: number;
  };
  charts: {
    works_by_status: { name: string; count: number; color: string }[];
    budget_by_category: { category: string; sanctioned: number; spent: number; utilization: number }[];
    issues_by_category: { category: string; count: number }[];
    monthly_trends: { month: string; reported: number; resolved: number }[];
  };
  recent_works: any[];
  recent_issues: any[];
  active_announcements: any[];
  next_meeting?: any;
  weather: any;
  data_notice: string;
}
