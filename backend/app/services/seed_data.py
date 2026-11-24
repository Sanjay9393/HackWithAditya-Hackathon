import datetime
from sqlalchemy.orm import Session
from app.models import models
from app.auth.security import get_password_hash

def seed_database(db: Session):
    # Check if already seeded
    if db.query(models.Village).first():
        return

    print("Seeding PrajaAI database with realistic demo village data...")

    # 1. Demo Users
    admin_user = models.User(
        email="admin@prajaai.org",
        username="admin",
        full_name="B. Rajasekhar (Panchayat Secretary)",
        hashed_password=get_password_hash("admin123"),
        role="admin",
        phone="9848022334",
        preferred_language="en"
    )
    db.add(admin_user)

    citizen_user = models.User(
        email="citizen@prajaai.org",
        username="citizen",
        full_name="K. Sambaiah",
        hashed_password=get_password_hash("citizen123"),
        role="citizen",
        phone="9440112233",
        preferred_language="en"
    )
    db.add(citizen_user)
    db.commit()

    # User Profile for Citizen
    citizen_profile = models.UserProfile(
        user_id=citizen_user.id,
        age=42,
        state="Andhra Pradesh",
        district="Guntur",
        village="Chandanagar",
        ward="Ward 3",
        occupation="farmer",
        is_farmer=True,
        is_student=False,
        annual_income=120000.0,
        family_size=4,
        gender="Male",
        disability_status=False,
        housing_status="semi-pucca",
        land_holding_acres=3.5
    )
    db.add(citizen_profile)

    # 2. Village
    village = models.Village(
        name="Chandanagar Gram Panchayat",
        name_te="చందానగర్ గ్రామ పంచాయతీ",
        district="Guntur",
        state="Andhra Pradesh",
        pincode="522001",
        population=4850,
        total_wards=8,
        panchayat_head="K. Venkata Ramana (Sarpanch)",
        latitude=16.3067,
        longitude=80.4365
    )
    db.add(village)
    db.commit()

    # 3. Wards
    wards_data = [
        (1, "Old Village & Temple Street", "M. Venkateswara Rao", "9848110001"),
        (2, "Bazaar Street & Market Area", "P. Lakshmi Devi", "9848110002"),
        (3, "Rythu Colony & North Fields", "K. Srinivasa Rao", "9848110003"),
        (4, "Ambedkar Nagar & West Ward", "G. Subba Rao", "9848110004"),
        (5, "Panchayat Office & School Road", "T. Anasuya", "9848110005"),
        (6, "Weavers & Artisans Street", "V. Narayana", "9848110006"),
        (7, "South Harijanawada", "D. Mariyamma", "9848110007"),
        (8, "East Canal Bank & New Layout", "Ch. Sivaramakrishna", "9848110008")
    ]
    for w_num, w_name, rep_name, rep_phone in wards_data:
        ward = models.Ward(
            village_id=village.id,
            ward_number=w_num,
            ward_name=w_name,
            representative_name=rep_name,
            representative_phone=rep_phone
        )
        db.add(ward)

    # 4. 12 Development Works
    projects_data = [
        {
            "name": "Cement Concrete (CC) Road Construction - Main Bazaar to Ward 4",
            "name_te": "సిమెంట్ కాంక్రీట్ (CC) రోడ్డు నిర్మాణం - మెయిన్ బజార్ నుండి వార్డు 4",
            "cat": "Roads",
            "ward": 2,
            "loc": "Main Bazaar Road, Ward 2 & 4",
            "lat": 16.3082, "lng": 80.4350,
            "dept": "Panchayat Raj & Rural Development",
            "budget": 1450000.0, "spent": 1120000.0,
            "start": "2025-10-15", "exp": "2026-03-31",
            "status": "In progress", "pct": 78,
            "auth": "Executive Engineer, PR Sub-Division",
            "contractor": "Sri Durga Infra Projects Ltd.",
            "desc": "Laying of 850m durable CC road with 150mm sub-base and drainage shoulders to eliminate monsoon waterlogging.",
            "source": "G.O. Rt. No. 428/PR/2025",
            "before_img": "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
            "progress_img": "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Underground Storm Water Drainage System - Ward 3 & 7",
            "name_te": "అండర్‌గ్రౌండ్ మురుగునీటి డ్రైనేజీ వ్యవస్థ - వార్డు 3 & 7",
            "cat": "Drainage",
            "ward": 3,
            "loc": "Rythu Colony Main Drainage Line",
            "lat": 16.3110, "lng": 80.4390,
            "dept": "Rural Water Supply & Sanitation (RWSS)",
            "budget": 2200000.0, "spent": 1950000.0,
            "start": "2025-08-01", "exp": "2026-02-15",
            "status": "Completed", "pct": 100,
            "auth": "Assistant Executive Engineer, RWSS",
            "contractor": "Coastal Buildtech LLP",
            "desc": "Installation of 1.2 km precast RCC covered drainage pipeline with silt inspection chambers every 30 meters.",
            "source": "Swachh Bharat Mission (Grameen) Phase-II Allocation",
            "progress_img": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
            "after_img": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Community Reverse Osmosis (RO) Safe Drinking Water Plant",
            "name_te": "కమ్యూనిటీ ఆర్.ఓ (RO) రక్షిత మంచినీటి ప్లాంట్",
            "cat": "Drinking water",
            "ward": 1,
            "loc": "Near Old Shivalayam Temple",
            "lat": 16.3055, "lng": 80.4342,
            "dept": "Jal Jeevan Mission / Gram Panchayat",
            "budget": 850000.0, "spent": 850000.0,
            "start": "2025-06-10", "exp": "2025-11-20",
            "status": "Completed", "pct": 100,
            "auth": "Sarpanch & Gram Panchayat Body",
            "contractor": "AquaPure Rural Technologies",
            "desc": "1000 Litres/Hour capacity commercial RO purification plant providing 20-litre cans at Rs. 5 to all households.",
            "source": "15th Finance Commission Grant",
            "after_img": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Solar LED Streetlighting Grid Installation (120 Poles)",
            "name_te": "సోలార్ ఎల్.ఇ.డి వీధి దీపాల ఏర్పాటు (120 స్తంభాలు)",
            "cat": "Streetlights",
            "ward": 5,
            "loc": "All 8 Wards Internal Lanes",
            "lat": 16.3075, "lng": 80.4360,
            "dept": "NREDCAP / New & Renewable Energy",
            "budget": 650000.0, "spent": 480000.0,
            "start": "2025-11-05", "exp": "2026-04-10",
            "status": "In progress", "pct": 70,
            "auth": "District Energy Conservation Cell",
            "contractor": "Surya Kiran Solar Systems",
            "desc": "Installation of 120 dusk-to-dawn 40W solar LED fixtures with lithium ferro-phosphate batteries across unlit lanes.",
            "source": "Gram Panchayat General Fund Resolution #12",
            "progress_img": "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Mandal Parishad Primary School Modernization & Digital Classrooms",
            "name_te": "మండల పరిషత్ ప్రాథమిక పాఠశాల ఆధునికీకరణ మరియు డిజిటల్ తరగతులు",
            "cat": "Schools",
            "ward": 5,
            "loc": "MPPS School Campus, School Road",
            "lat": 16.3060, "lng": 80.4378,
            "dept": "School Education Department (Nadu-Nedu)",
            "budget": 1800000.0, "spent": 1250000.0,
            "start": "2025-07-20", "exp": "2026-03-15",
            "status": "In progress", "pct": 82,
            "auth": "Mandal Educational Officer (MEO)",
            "contractor": "Parent-Teacher Committee & APEWIDC",
            "desc": "Repair of 4 classrooms, installation of 2 interactive smart boards, RO drinking water, and separate modern toilets for girls and boys.",
            "source": "Mana Badi Nadu-Nedu Phase-III",
            "progress_img": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Primary Health Sub-Centre Building & Maternity Clinic Addition",
            "name_te": "ప్రాథమిక ఆరోగ్య ఉపకేంద్ర భవనం & ప్రసవ వార్డు నిర్మాణం",
            "cat": "Health",
            "ward": 2,
            "loc": "Opposite Panchayat Office",
            "lat": 16.3070, "lng": 80.4355,
            "dept": "Medical, Health & Family Welfare",
            "budget": 2400000.0, "spent": 900000.0,
            "start": "2025-09-15", "exp": "2026-06-30",
            "status": "In progress", "pct": 45,
            "auth": "Medical Officer, Chandanagar PHC",
            "contractor": "Venkateswara Constructions",
            "desc": "Construction of modern 3-bed maternity observation room, cold chain immunization chamber, and staff quarters.",
            "source": "National Health Mission (NHM) Infrastructure Sanction",
            "before_img": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
            "progress_img": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Solid Waste Processing Centre (SWPC) & Vermicompost Shed",
            "name_te": "ఘన వ్యర్థాల నిర్వహణ కేంద్రం & వర్మీకంపోస్ట్ షెడ్డు",
            "cat": "Sanitation",
            "ward": 8,
            "loc": "East Village Boundary, Ward 8",
            "lat": 16.3040, "lng": 80.4410,
            "dept": "Panchayat Sanitation Wing",
            "budget": 750000.0, "spent": 750000.0,
            "start": "2025-04-10", "exp": "2025-09-30",
            "status": "Completed", "pct": 100,
            "auth": "Divisional Panchayat Officer",
            "contractor": "EcoClean Rural Solutions",
            "desc": "Dry and wet waste segregation shed with 6 vermicompost pits converting organic waste to bio-fertilizer for farmers.",
            "source": "Clean Andhra Pradesh (CLAP) Grant",
            "after_img": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Village Secretariat (Grama Sachivalayam) Public Seating & Canopy",
            "name_te": "గ్రామ సచివాలయ ప్రజా విశ్రాంతి షెడ్డు & కౌంటర్ల విస్తరణ",
            "cat": "Buildings",
            "ward": 5,
            "loc": "Grama Sachivalayam Premises",
            "lat": 16.3068, "lng": 80.4362,
            "dept": "Grama Ward Sachivalayam Dept",
            "budget": 450000.0, "spent": 120000.0,
            "start": "2026-01-05", "exp": "2026-05-15",
            "status": "In progress", "pct": 30,
            "auth": "Panchayat Secretary",
            "contractor": "Sai Krupa Builders",
            "desc": "Covered waiting area for senior citizens and disabled citizens visiting for pension and Aadhaar services.",
            "source": "Gram Panchayat Own Source Revenue (OSR)",
            "progress_img": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Desilting and Lining of North Irrigation Canal (3.5 km)",
            "name_te": "ఉత్తర సాగునీటి కాలువ పూడికతీత మరియు లైనింగ్ (3.5 కి.మీ)",
            "cat": "Irrigation",
            "ward": 3,
            "loc": "North Ayacut Fields, Wards 3 & 4",
            "lat": 16.3130, "lng": 80.4330,
            "dept": "Water Resources / Irrigation Dept",
            "budget": 1650000.0, "spent": 300000.0,
            "start": "2026-01-15", "exp": "2026-06-10",
            "status": "In progress", "pct": 25,
            "auth": "Executive Engineer, Krishna Western Delta",
            "contractor": "Farmer Water Users Association (WUA #14)",
            "desc": "De-silting of irrigation sub-channel serving 420 acres of paddy and chili lands to prevent tail-end water deficits.",
            "source": "MGNREGA + Irrigation Minor Works Fund",
            "progress_img": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Rythu Bharosa Kendra (RBK) Agri-Testing & Seed Storage Hub",
            "name_te": "రైతు భరోసా కేంద్రం (RBK) విత్తన నిల్వ & మట్టి పరీక్ష కేంద్రం",
            "cat": "Agriculture",
            "ward": 3,
            "loc": "Rythu Colony Junction",
            "lat": 16.3095, "lng": 80.4380,
            "dept": "Department of Agriculture",
            "budget": 1200000.0, "spent": 1200000.0,
            "start": "2025-05-15", "exp": "2025-10-30",
            "status": "Completed", "pct": 100,
            "auth": "Assistant Director of Agriculture (ADA)",
            "contractor": "AP State Warehousing Corporation",
            "desc": "Equipped with digital soil testing kit, moisture meters, certified seed distribution counter, and farmer meeting hall.",
            "source": "Rashtriya Krishi Vikas Yojana (RKVY)",
            "after_img": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Overhead Water Tank (1.5 Lakh Litres) at Ambedkar Nagar",
            "name_te": "అంబేద్కర్ నగర్ వద్ద 1.5 లక్షల లీటర్ల ఓవర్ హెడ్ వాటర్ ట్యాంక్",
            "cat": "Drinking water",
            "ward": 4,
            "loc": "Ward 4 Water Works Ground",
            "lat": 16.3080, "lng": 80.4310,
            "dept": "Rural Water Supply (RWSS)",
            "budget": 3100000.0, "spent": 200000.0,
            "start": "2026-02-01", "exp": "2026-11-30",
            "status": "In progress", "pct": 15,
            "auth": "Superintending Engineer, RWSS Guntur",
            "contractor": "Kiran Infratech Projects",
            "desc": "Elevated Service Reservoir (ELSR) to supply pressurized piped tap connections to 350 households in Ward 4 & 6.",
            "source": "Jal Jeevan Mission Central Sanction",
            "progress_img": "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Panchayat Library & Citizen Digital Literacy Hub",
            "name_te": "పంచాయతీ గ్రంథాలయం & డిజిటల్ అక్షరాస్యత కేంద్రం",
            "cat": "Education",
            "ward": 1,
            "loc": "Opposite Gram Panchayat Old Block",
            "lat": 16.3050, "lng": 80.4358,
            "dept": "Public Libraries Department",
            "budget": 500000.0, "spent": 0.0,
            "start": "2026-04-01", "exp": "2026-08-30",
            "status": "Approved", "pct": 0,
            "auth": "Zilla Grandhalaya Samstha",
            "contractor": "Tenders to be called",
            "desc": "Renovation of unused building into a reading room with 5 internet PCs for youth preparing for competitive exams.",
            "source": "Zilla Parishad Grant 2026",
            "before_img": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80"
        }
    ]

    for p in projects_data:
        proj = models.DevelopmentProject(
            village_id=village.id,
            ward_number=p["ward"],
            project_name=p["name"],
            project_name_te=p.get("name_te"),
            category=p["cat"],
            location_name=p["loc"],
            latitude=p.get("lat"),
            longitude=p.get("lng"),
            department=p["dept"],
            budget_sanctioned=p["budget"],
            expenditure_actual=p["spent"],
            start_date=p.get("start"),
            expected_completion=p.get("exp"),
            status=p["status"],
            progress_pct=p["pct"],
            responsible_authority=p.get("auth"),
            contractor_name=p.get("contractor"),
            description=p["desc"],
            source_document=p.get("source"),
            source_url="https://guntur.ap.gov.in/panchayats/chandanagar",
            verification_status="Verified Official Record",
            before_photo_url=p.get("before_img"),
            progress_photo_url=p.get("progress_img"),
            after_photo_url=p.get("after_img")
        )
        db.add(proj)
        db.flush()

        # Add initial update entry
        upd = models.ProjectUpdate(
            project_id=proj.id,
            update_date=p.get("start") or "2025-10-01",
            title="Work Phase Review",
            notes=f"Site inspection conducted. Progress marked at {p['pct']}%. Materials verified as per technical specifications.",
            progress_pct=p["pct"],
            status=p["status"],
            updated_by="Panchayat Technical Officer"
        )
        db.add(upd)

    # 5. Budget Records
    budget_categories = [
        ("Roads & Transport", 2800000.0, 2150000.0),
        ("Water Supply & Sanitation", 3950000.0, 2800000.0),
        ("School & Education", 2300000.0, 1250000.0),
        ("Healthcare & Maternity", 2400000.0, 900000.0),
        ("Renewable Energy & Lighting", 650000.0, 480000.0),
        ("Agriculture & Irrigation", 2850000.0, 1500000.0),
        ("Administrative & Public Amenities", 950000.0, 420000.0)
    ]
    for cat_name, sanc, spent in budget_categories:
        b_rec = models.BudgetRecord(
            village_id=village.id,
            financial_year="2025-2026",
            category=cat_name,
            sanctioned_amount=sanc,
            spent_amount=spent,
            verification_status="Audited Record",
            source_document="Gram Panchayat Annual Plan FY 2025-26",
            notes="Figures reflected from approved Zilla Parishad grants & 15th FC tied/untied funds."
        )
        db.add(b_rec)

    # 6. 20 Civic Issues
    issues_data = [
        ("Drinking water pipe rupture near Ward 3 Community Hall", "Continuous clean water leakage on the road since yesterday evening causing puddle.", "Water supply", 3, "Near Community Hall, Ward 3", 16.3105, 80.4385, "High", "In progress", "Rural Water Supply", "P. Anji Reddy"),
        ("Overhead streetlights non-functional in lane 4", "Three consecutive solar poles are not lighting up at night, area is completely dark.", "Streetlights", 2, "Bazaar Lane 4, Ward 2", 16.3088, 80.4348, "Medium", "Assigned", "Electrical Maintenance", "M. Koteswara Rao"),
        ("Deep pothole causing vehicle skidding near Bus Stop", "A 2-foot pothole has developed after recent rains right where RTC buses halt.", "Road damage", 1, "Chandanagar Main Bus Stop", 16.3051, 80.4340, "High", "Submitted", "Panchayat Roads", None),
        ("Blocked open drain causing foul odor and mosquito breeding", "Silt and plastic waste clogged the culvert, wastewater is stagnating.", "Drainage", 7, "Near Harijanawada Primary School", 16.3035, 80.4365, "Critical", "In progress", "Sanitation Wing", "G. Yedukondalu"),
        ("Garbage dump uncleared for four days near weekly market", "Vegetable waste pile accumulating; stray cattle dispersing waste across the street.", "Garbage", 2, "Weekly Santha Ground, Ward 2", 16.3079, 80.4352, "Medium", "Acknowledged", "Sanitation Wing", "K. Rama Devi"),
        ("Low hanging 11KV power cable over agricultural pathway", "Electric wire is sagging dangerously close to tractor height near canal bridge.", "Electricity", 3, "North Canal Road, Ward 3", 16.3120, 80.4370, "Critical", "Assigned", "APCPDCL Section Office", "K. Suresh (Lineman)"),
        ("Broken handpump handle near Ward 4 public tap", "Handle bolt came loose and pump is unusable for 40 surrounding households.", "Water supply", 4, "Ambedkar Nagar Cross", 16.3082, 80.4315, "Medium", "Resolved", "RWS Mechanical Staff", "Ch. Venkat"),
        ("Fallen neem tree branch obstructing school access road", "Large branch snapped during heavy winds, partial blockage of pedestrian path.", "Public property", 5, "School Approach Lane", 16.3065, 80.4372, "Low", "Resolved", "Panchayat Field Staff", "B. Appa Rao"),
        ("Mud accumulation and slippery road surface near temple tank", "Tank overflow caused clay buildup making two-wheeler transit dangerous.", "Road damage", 1, "Shivalayam Tank Bund", 16.3058, 80.4345, "Medium", "Submitted", "Panchayat Engineering", None),
        ("Stagnant water near Anganwadi Centre #2", "Mosquito larvae noticed in stagnant depression outside the children play courtyard.", "Health facilities", 6, "Weavers Colony Anganwadi", 16.3090, 80.4402, "High", "Assigned", "Health & Sanitation", "ANM Sarada"),
        ("Street dog menace and aggressive pack near market meat stalls", "Stray dogs gathering in large pack during evening hours causing fear among pedestrians.", "Other", 2, "Market West Gate", 16.3076, 80.4356, "Medium", "Submitted", "Veterinary & Panchayat", None),
        ("Irrigation channel pipe outlet damaged by farm excavator", "Water is bypassing field sub-channel and flooding the field boundary.", "Other", 3, "Field Survey #142", 16.3135, 80.4360, "High", "Assigned", "Irrigation Sub-division", "AE Irrigation"),
        ("Burnt out streetlight sodium bulb at Ward 8 entrance", "Light flickering and went off completely 2 days ago.", "Streetlights", 8, "East Layout Main Arch", 16.3045, 80.4415, "Low", "Acknowledged", "Electrical Wing", None),
        ("Clogged roadside gutter overflowing into residential compound", "Drain needs silt clearance before rains intensify.", "Drainage", 4, "House #4-112 Lane", 16.3086, 80.4320, "High", "In progress", "Sanitation Staff", "G. Yedukondalu"),
        ("Tap water muddy in Ward 6 morning supply", "For past two days, tap water is turbid with brownish sediment for first 20 minutes.", "Water supply", 6, "Ward 6 North Street", 16.3092, 80.4408, "High", "Acknowledged", "RWS Water Quality Lab", "Lab Tech Krishna"),
        ("Damaged speed breaker without reflective paint on main road", "Sharp concrete edge exposed on speed breaker damaging vehicle suspensions.", "Road damage", 5, "Panchayat Main Road", 16.3070, 80.4368, "Low", "Submitted", "Roads & Buildings", None),
        ("School playground gate lock broken and cattle entering", "Boundary mesh damaged on east corner, cattle destroying saplings.", "School", 5, "MPPS School Playground", 16.3061, 80.4380, "Medium", "Submitted", "School Management", None),
        ("Sparking sounds from agricultural distribution transformer", "Occasional loud buzz and blue sparks observed during pump operation hours.", "Electricity", 3, "North Borewell Cluster", 16.3140, 80.4350, "Critical", "In progress", "APCPDCL Breakdown Team", "Sub-Engineer"),
        ("Debris and gravel dumped on public walking track", "Private construction materials left occupying half the public road width.", "Public property", 2, "Bazaar Cross Road", 16.3081, 80.4344, "Low", "Resolved", "Panchayat Notice Issuer", "B. Rajasekhar"),
        ("Public borewell motor burnt due to voltage fluctuations", "Motor failed yesterday noon, Ward 7 residents need alternate water supply.", "Water supply", 7, "Harijanawada Community Bore", 16.3032, 80.4362, "Critical", "In progress", "RWS Electrical Cell", "P. Anji Reddy")
    ]

    for title, desc, cat, ward, loc, lat, lng, prio, stat, dept, off in issues_data:
        issue = models.CivicIssue(
            village_id=village.id,
            user_id=citizen_user.id,
            title=title,
            description=desc,
            category=cat,
            location_name=loc,
            ward_number=ward,
            latitude=lat,
            longitude=lng,
            priority=prio,
            is_anonymous=False,
            reporter_name=citizen_user.full_name,
            reporter_phone=citizen_user.phone,
            status=stat,
            assigned_department=dept,
            assigned_officer=off,
            resolution_notes=f"Action initiated as per standard SOP for {cat}. Field verification logged." if stat != "Submitted" else None,
            photo_url="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
        )
        db.add(issue)
        db.flush()

        # Add issue timeline updates
        upd = models.IssueUpdate(
            issue_id=issue.id,
            status=stat,
            update_text=f"Issue marked as '{stat}'. {f'Assigned to {off} ({dept}).' if off else 'Under initial assessment by Panchayat Helpdesk.'}",
            updated_by=off or "Panchayat Secretary"
        )
        db.add(upd)

    # 7. 10 Announcements
    announcements_data = [
        ("Scheduled Drinking Water Supply Timings for Summer Season", "వేసవి కాలంలో రక్షిత మంచినీటి సరఫరా వేళల వివరాలు", "Water supply", "All Wards", "Important", "Starting March 1st, municipal RO tap supply will run twice daily: 6:00 AM to 8:30 AM in the morning and 5:30 PM to 7:30 PM in the evening. Citizens are requested to store adequate water and prevent wastage.", "2026-02-20", "2026-05-31"),
        ("Gram Sabha Quarterly General Body Meeting Notification", "గ్రామ సభ త్రైమాసిక సర్వసభ్య సమావేశ ప్రకటన", "Gram Sabha", "All Wards", "Urgent", "The Q1 Gram Sabha will convene on 28th February 2026 at 10:00 AM in the Gram Panchayat Hall. Agenda includes approval of works audit, MGNREGA budget, and scheme beneficiary verification. All adult residents are encouraged to attend.", "2026-02-18", "2026-02-28"),
        ("PM-Kisan & Rythu Bharosa e-KYC Verification Camp at Rythu Bharosa Kendra", "పీఎం-కిసాన్ & రైతు భరోసా e-KYC ధృవీకరణ శిబిరం", "Agriculture", "Ward 3", "Important", "Special biometric e-KYC and land seeding camp will be held at RBK Ward 3 from 24th to 26th February. Farmers must bring Aadhaar card, bank passbook, and Pattadar passbook.", "2026-02-17", "2026-02-27"),
        ("National Pulse Polio Immunization Drive for Children Under 5 Years", "5 సంవత్సరాలలోపు పిల్లలందరికీ పల్స్ పోలియో చుక్కల కార్యక్రమం", "Health", "All Wards", "Urgent", "Free polio immunization booths will operate at the Primary School, Panchayat Hall, and Anganwadi centers on Sunday from 8:00 AM to 5:00 PM. Every child under 5 must be brought without fail.", "2026-02-15", "2026-03-05"),
        ("Seasonal Pest Alert: Thrips & Mite Management in Red Chili Crops", "మిరప పంటలో తామర పురుగు మరియు నల్లి నివారణ సూచనలు", "Agriculture", "All Wards", "Normal", "Agricultural Officers advise farmers to install blue sticky traps (20 per acre) and spray recommended bio-pesticides (Neem oil 5ml/L) early morning to combat invasive thrips infestations.", "2026-02-14", "2026-03-15"),
        ("Scheduled 4-Hour Power Outage for 11KV Sub-station Line Maintenance", "విద్యుత్ సబ్-స్టేషన్ మరమ్మతుల నిమిత్తం 4 గంటల విద్యుత్ సరఫరా నిలిపివేత", "Electricity", "Ward 1, 2, 4", "Normal", "APCPDCL announces line clearing work on Wednesday from 10:00 AM to 2:00 PM affecting Wards 1, 2, and 4. Residents and millers are advised to plan accordingly.", "2026-02-12", "2026-02-25"),
        ("MGNREGA 100-Days Employment Social Audit & Job Card Distribution", "ఉపాధి హామీ 100 రోజుల సామాజిక తనిఖీ & జాబ్ కార్డుల పంపిణీ", "General", "All Wards", "Normal", "New wage seekers can enroll for MGNREGA job cards at the Village Secretariat counter. Social audit report of last quarter desilting works is available for public review.", "2026-02-10", "2026-03-10"),
        ("Free Eye Screening and Cataract Surgery Camp by Lions Club", "లయన్స్ క్లబ్ ఆధ్వర్యంలో ఉచిత నేత్ర వైద్య & శుక్లాల ఆపరేషన్ల శిబిరం", "Health", "All Wards", "Important", "Comprehensive eye checkup camp at Community Hall on March 5th. Free prescription spectacles will be provided to eligible elders and cataract patients transported to Guntur for surgery.", "2026-02-08", "2026-03-05"),
        ("Pre-Matric & Post-Matric Scholarship Biometric Authentication Deadline", "స్కాలర్‌షిప్ బయోమెట్రిక్ ప్రమాణీకరణ గడువు తేదీ", "Education", "All Wards", "Important", "Students enrolled in Jagananna Vidya Deevena and Central scholarships must complete biometric verification at the Sachivalayam before February 28th to prevent disbursement holds.", "2026-02-05", "2026-02-28"),
        ("Registration Open for Free Solar Rooftop Scheme (PM Surya Ghar)", "పీఎం సూర్య ఘర్ ఉచిత సౌర విద్యుత్ పథకం దరఖాస్తుల స్వీకరణ", "Government schemes", "All Wards", "Normal", "Households with grid connections can apply for 60% central capital subsidy for up to 2KW rooftop solar panels. Digital assistants at Sachivalayam are assisting with applications.", "2026-02-01", "2026-04-30")
    ]

    for title, title_te, cat, target_ward, prio, content, pub_date, exp_date in announcements_data:
        ann = models.Announcement(
            village_id=village.id,
            title=title,
            title_te=title_te,
            category=cat,
            target_ward=target_ward,
            priority=prio,
            content=content,
            publish_date=pub_date,
            expiry_date=exp_date,
            source="Chandanagar Gram Panchayat Office",
            is_active=True
        )
        db.add(ann)

    # 8. 5 Gram Sabha Meetings
    meetings_data = [
        {
            "title": "Quarterly Gram Sabha General Body Meeting - Q1 2026",
            "title_te": "త్రైమాసిక గ్రామసభ సర్వసభ్య సమావేశం - 2026 ప్రథమ త్రైమాసికం",
            "date": "2026-02-28", "loc": "Gram Panchayat Hall",
            "agenda": "1. Review of CC road and underground drainage progress. 2. Approval of Annual Action Plan for Jal Jeevan Mission. 3. Social audit of MGNREGA works. 4. Resolution on stray cattle impounding.",
            "status": "Scheduled",
            "summary_en": "Scheduled meeting focusing on infrastructure review, water pipe completion, and village cleanliness priorities.",
            "summary_te": "రోడ్లు, డ్రైనేజీ పనుల సమీక్ష మరియు తాగునీటి సరఫరా ప్రాధాన్యతలపై గ్రామసభ సమావేశం.",
            "decisions": [
                (1, "Formation of a 5-member citizen committee to supervise CC road quality in Ward 4."),
                (2, "Proposal to allocate Rs. 3 Lakhs from OSR for street light replacements in lanes.")
            ],
            "actions": [
                ("Publish tender for CC road extension before March 10", "Panchayat Engineering", "2026-03-10"),
                ("Submit drinking water filter maintenance report", "RWSS Department", "2026-03-05")
            ]
        },
        {
            "title": "Special Gram Sabha on Drought Preparedness & Irrigation Water Distribution",
            "title_te": "ప్రత్యేక గ్రామసభ - వేసవి సాగునీరు మరియు కరువు నివారణ చర్యలు",
            "date": "2025-11-15", "loc": "Rythu Bharosa Kendra Meeting Room",
            "agenda": "Canal rotation schedule, borewell recharge structures, and availability of drought-tolerant fodder seeds.",
            "status": "Completed",
            "minutes": "Meeting chaired by Sarpanch. 182 farmers attended. Agreed on 7-day on, 7-day off rotation for North Canal water. Recommended 10 farm pond excavations under MGNREGA.",
            "summary_en": "Farmers unanimously agreed to canal rotation schedule and approved 10 farm pond sites to harvest rain run-off.",
            "summary_te": "రైతులు కాలువ నీటి వంతులవారీ విధానానికి ఆమోదం తెలిపారు మరియు 10 వ్యవసాయ కుంటల నిర్మాణాన్ని ఆమోదించారు.",
            "decisions": [
                (1, "Enforce canal rotational water sharing between Ward 3 and Ward 4 ayacuts."),
                (2, "Sanction Rs. 4.5 Lakhs MGNREGA funds for 10 community farm ponds.")
            ],
            "actions": [
                ("Identify GPS points for 10 farm ponds", "MGNREGA Technical Assistant", "2025-12-01"),
                ("Issue canal rotation roster to Water Users Association", "Irrigation Assistant", "2025-11-20")
            ]
        },
        {
            "title": "Gram Sabha for Annual Budget Plan & 15th Finance Commission Grants",
            "title_te": "వార్షిక బడ్జెట్ ప్రణాళిక & 15వ ఆర్థిక సంఘం నిధుల ఆమోద గ్రామసభ",
            "date": "2025-08-15", "loc": "Gram Panchayat Open Auditorium",
            "agenda": "Presentation of audited receipts and expenditure for FY 2024-25. Approval of priority works under 15th FC tied funds (Water & Sanitation).",
            "status": "Completed",
            "minutes": "Full accounts presented by Panchayat Secretary. Citizens inspected payment vouchers. Unanimous approval of Rs. 42 Lakhs total budget allocation.",
            "summary_en": "Annual audited finances approved. Priority funds allocated to RO plant, solid waste segregation shed, and drainage line.",
            "summary_te": "గ్రామ వార్షిక లెక్కలు పరిశీలించి ఆమోదించబడ్డాయి. తాగునీరు, డ్రైనేజీ మరియు రోడ్లకు నిధులు కేటాయించబడ్డాయి.",
            "decisions": [
                (1, "Approval of Rs. 22 Lakhs drainage project line in Ward 3 and 7."),
                (2, "Resolution to plant 500 shade trees along village roads during Vanamahotsavam.")
            ],
            "actions": [
                ("Deposit matched share for RWSS drainage pipeline", "Panchayat Secretary", "2025-09-01"),
                ("Distribute 500 saplings to households", "Village Horticulture Assistant", "2025-08-30")
            ]
        },
        {
            "title": "Gram Sabha on Cleanliness, Sanitation & Solid Waste Management",
            "title_te": "పరిశుభ్రత, పారిశుద్ధ్యం మరియు వ్యర్థాల నిర్వహణపై గ్రామసభ",
            "date": "2025-05-02", "loc": "Gram Panchayat Hall",
            "agenda": "Door-to-door waste collection fee, ban on single-use plastics under 75 microns, operation of e-rickshaw garbage carts.",
            "status": "Completed",
            "minutes": "Resolution passed adopting plastic-free village pledge. Green and blue bins distributed to 450 households.",
            "summary_en": "Decided to levy nominal Rs. 30/month waste collection fee and enforce plastic ban across shops.",
            "summary_te": "ప్లాస్టిక్ రహిత గ్రామం తీర్మానం ఆమోదించబడింది. చెత్త సేకరణకు ప్రత్యేక ప్రణాళిక రూపొందించారు.",
            "decisions": [
                (1, "Zero tolerance for open garbage dumping on canal banks; Rs. 200 fine instituted."),
                (2, "Procure two electric garbage tipper rickshaws under Swachh Bharat funds.")
            ],
            "actions": [
                ("Deploy electric tippers on daily morning route", "Sanitation Supervisor", "2025-05-15")
            ]
        },
        {
            "title": "Special Gram Sabha on Education, Anganwadi Welfare & Child Nutrition",
            "title_te": "విద్య, అంగన్‌వాడీ సంక్షేమం మరియు పోషకాహారంపై ప్రత్యేక గ్రామసభ",
            "date": "2025-01-26", "loc": "MPPS School Ground",
            "agenda": "Review of midday meal quality, school dropout tracking, supplementary nutrition for pregnant women.",
            "status": "Completed",
            "minutes": "Parents and teachers discussed student learning outcomes. Identified 3 out-of-school children and facilitated re-admission.",
            "summary_en": "Emphasized nutritious diet in midday meals and approved sports equipment purchase for school students.",
            "summary_te": "మధ్యాహ్న భోజన నాణ్యత పర్యవేక్షణ మరియు విద్యార్థులకు క్రీడా సామాగ్రి కొనుగోలుకు ఆమోదం.",
            "decisions": [
                (1, "Form parent monitoring roster for daily midday meal quality inspection."),
                (2, "Install water purifier in Anganwadi Centre #1.")
            ],
            "actions": [
                ("Deliver water purifier to Anganwadi #1", "Panchayat Field Staff", "2025-02-10")
            ]
        }
    ]

    for m_data in meetings_data:
        meeting = models.Meeting(
            village_id=village.id,
            title=m_data["title"],
            title_te=m_data.get("title_te"),
            meeting_date=m_data["date"],
            location=m_data["loc"],
            agenda=m_data["agenda"],
            status=m_data["status"],
            minutes_text=m_data.get("minutes"),
            summary_en=m_data.get("summary_en"),
            summary_te=m_data.get("summary_te"),
            document_url="https://guntur.ap.gov.in/panchayats/chandanagar/minutes.pdf"
        )
        db.add(meeting)
        db.flush()

        for d_num, d_text in m_data.get("decisions", []):
            dec = models.MeetingDecision(
                meeting_id=meeting.id,
                decision_number=d_num,
                decision_text=d_text
            )
            db.add(dec)

        for act_text, dept, dead in m_data.get("actions", []):
            act = models.MeetingActionItem(
                meeting_id=meeting.id,
                action_text=act_text,
                responsible_department=dept,
                deadline=dead,
                status="Completed" if m_data["status"] == "Completed" else "Pending"
            )
            db.add(act)

    # 9. 15 Government Schemes with Structured Eligibility Rules & Documents
    schemes_data = [
        {
            "id": "PM_KISAN",
            "name": "PM-Kisan Samman Nidhi Yojana",
            "name_te": "ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి యోజన",
            "cat": "Agriculture",
            "level": "Central",
            "dept": "Ministry of Agriculture & Farmers Welfare",
            "target": "Small and marginal landholding farmer families",
            "desc": "Direct income support of Rs. 6,000 per year transferred into bank accounts in three equal installments of Rs. 2,000 every four months.",
            "desc_te": "రైతు కుటుంబాలకు ప్రతి సంవత్సరం రూ. 6,000 ఆదాయ సహాయం, మూడు విడతలలో రూ. 2,000 చొప్పున బ్యాంక్ ఖాతాల్లో జమ చేస్తారు.",
            "elig_text": "Landholding farmer families with cultivable land in their name. Institutional landholders and high-income tax payers are excluded.",
            "benefits": "Rs. 6,000 per annum direct DBT bank transfer in three 4-monthly installments.",
            "steps": "1. Verify land record in RoR 1B. 2. Complete biometric e-KYC on PM-Kisan portal or CSC. 3. Seed bank account with Aadhaar (NPCI active).",
            "url": "https://pmkisan.gov.in",
            "rules": {
                "occupation": ["farmer"],
                "is_farmer": True,
                "state": ["All India"],
                "max_land_acres": 25.0
            },
            "req_docs": ["Aadhaar Card", "Pattadar Passbook / Land Record (RoR 1B)", "Aadhaar-linked Bank Passbook"],
            "opt_docs": ["Voter ID Card"]
        },
        {
            "id": "RYTHU_BHAROSA",
            "name": "AP YSR / Annadata Sukhibhava (Rythu Bharosa)",
            "name_te": "వైఎస్సార్ రైతు భరోసా / అన్నదాత సుఖీభవ",
            "cat": "Agriculture",
            "level": "State",
            "dept": "Department of Agriculture, Govt. of Andhra Pradesh",
            "target": "Farmer families including tenant farmers (CCRC holders) and ROFR cultivators",
            "desc": "Financial assistance of Rs. 13,500 per year provided to farmer families ahead of Kharif and Rabi crop sowing seasons to meet agricultural inputs cost.",
            "desc_te": "రైతు కుటుంబాలకు మరియు కౌలు రైతులకు ప్రతి సంవత్సరం రూ. 13,500 పెట్టుబడి సహాయం అందించే పథకం.",
            "elig_text": "All land-owning farmer families of Andhra Pradesh and enrolled tenant farmers holding Crop Cultivator Rights Card (CCRC).",
            "benefits": "Rs. 13,500/year (including PM-Kisan component) + free crop insurance coverage.",
            "steps": "1. Check name in village social audit display at Rythu Bharosa Kendra. 2. Submit CCRC agreement if tenant farmer. 3. Complete biometric e-KYC at Sachivalayam.",
            "url": "https://ysrrythubharosa.ap.gov.in",
            "rules": {
                "occupation": ["farmer"],
                "is_farmer": True,
                "state": ["Andhra Pradesh"]
            },
            "req_docs": ["Aadhaar Card", "Pattadar Passbook / CCRC Agreement", "Bank Account Details", "Ration Card / Rice Card"],
            "opt_docs": ["Soil Health Card"]
        },
        {
            "id": "JAL_JEEVAN_MISSION",
            "name": "Jal Jeevan Mission (Har Ghar Jal)",
            "name_te": "జల్ జీవన్ మిషన్ (హర్ ఘర్ జల్)",
            "cat": "Drinking water",
            "level": "Central",
            "dept": "Department of Drinking Water & Sanitation",
            "target": "All rural households in the village",
            "desc": "Provides safe, adequate, and pressurized drinking water through individual Functional Household Tap Connections (FHTC) delivering 55 litres per capita per day.",
            "desc_te": "ప్రతి గ్రామీణ కుటుంబానికి సురక్షితమైన కుళాయి ద్వారా నిరంతర రక్షిత తాగునీరు అందించే పథకం.",
            "elig_text": "All permanent residential households in the Gram Panchayat without an existing metered piped water connection.",
            "benefits": "Free installation of household tap water connection and pipeline network.",
            "steps": "1. Submit connection request to Panchayat Secretary or Sachivalayam Engineering Assistant. 2. Inspection of pipeline feasibility. 3. Connection issuance.",
            "url": "https://jaljeevanmission.gov.in",
            "rules": {
                "state": ["All India"]
            },
            "req_docs": ["Aadhaar Card of Head of Family", "Electricity Bill / House Tax Receipt", "Ration Card"],
            "opt_docs": []
        },
        {
            "id": "AMMA_VODI",
            "name": "Jagananna Amma Vodi (School Education Incentive)",
            "name_te": "జగనన్న అమ్మ ఒడి పథకం",
            "cat": "Education",
            "level": "State",
            "dept": "School Education Department, Govt of AP",
            "target": "Mothers / guardians sending their children to Class 1 through Intermediate",
            "desc": "Annual financial grant of Rs. 15,000 deposited directly into the mother's bank account to encourage children's education and eliminate dropouts.",
            "desc_te": "తమ పిల్లలను బడికి పంపించే తల్లుల ఖాతాల్లో ప్రతి సంవత్సరం రూ. 15,000 జమ చేసే విద్యా ప్రోత్సాహక పథకం.",
            "elig_text": "Below Poverty Line (BPL) families in Andhra Pradesh with minimum 75% student attendance across Class 1 to 12 in recognized schools.",
            "benefits": "Rs. 15,000 per school academic year directly in mother's account.",
            "steps": "1. Headmaster uploads student attendance. 2. Verify mother-child Aadhaar linkage on school portal. 3. Social audit at Sachivalayam.",
            "url": "https://jaganannaammavodi.ap.gov.in",
            "rules": {
                "state": ["Andhra Pradesh"],
                "income_limit": 250000.0,
                "gender": "Female"
            },
            "req_docs": ["Mother's Aadhaar Card", "Child's Aadhaar Card", "Rice Card / Income Certificate", "Mother's Bank Passbook", "School Study Certificate"],
            "opt_docs": []
        },
        {
            "id": "AROGYASRI",
            "name": "Dr. YSR Aarogyasri Health Insurance Scheme",
            "name_te": "డాక్టర్ వైఎస్సార్ ఆరోగ్యశ్రీ హెల్త్ స్కీమ్",
            "cat": "Healthcare",
            "level": "State",
            "dept": "Aarogyasri Health Care Trust, Govt of AP",
            "target": "BPL and low/middle income families in Andhra Pradesh",
            "desc": "Comprehensive cashless medical treatment coverage up to Rs. 25,00,000 per family per year for over 3,250 listed secondary and tertiary procedures in empanelled hospitals.",
            "desc_te": "ప్రతి పేద కుటుంబానికి ఏటా రూ. 25 లక్షల వరకు ఉచిత నగదు రహిత కార్పొరేట్ వైద్య చికిత్స అందించే పథకం.",
            "elig_text": "Families holding a valid Rice Card / BPL card in Andhra Pradesh, or annual family income below Rs. 5,00,000.",
            "benefits": "Cashless hospitalization, surgical care, diagnostic tests, and post-operative Aarogya Aasara financial allowance.",
            "steps": "1. Present Aarogyasri card / Rice card at any network hospital reception. 2. Aarogya Mithra desk creates digital case sheet. 3. Immediate pre-authorization.",
            "url": "https://aarogyasri.ap.gov.in",
            "rules": {
                "state": ["Andhra Pradesh"],
                "income_limit": 500000.0
            },
            "req_docs": ["Rice Card / Aarogyasri Card", "Aadhaar Card of all family members", "Medical Referral / Doctor Prescription"],
            "opt_docs": []
        },
        {
            "id": "PMAY_G",
            "name": "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
            "name_te": "ప్రధాన మంత్రి ఆవాస్ యోజన - గ్రామీణ (PMAY-G)",
            "cat": "Housing",
            "level": "Central",
            "dept": "Ministry of Rural Development",
            "target": "Houseless rural families and those living in kutcha/dilapidated houses",
            "desc": "Financial assistance of Rs. 1,20,000 in plain areas plus 90 days of MGNREGA wages (approx Rs. 27,000) and Rs. 12,000 for toilet construction under Swachh Bharat.",
            "desc_te": "గ్రామీణ ప్రాంతాల్లో ఇళ్లు లేని పేదలకు పక్కా ఇల్లు నిర్మించుకోవడానికి ఆర్థిక సహాయం అందించే పథకం.",
            "elig_text": "Families registered in SECC deprivation list without a pucca house in their name anywhere in India.",
            "benefits": "Rs. 1,32,000+ total grant released in stages based on geo-tagged construction milestones.",
            "steps": "1. Identification through SECC and Gram Sabha verification. 2. Sanction order generation with AwaasSoft ID. 3. Geo-tagged photo upload at foundation, plinth, and lintel levels.",
            "url": "https://pmayg.nic.in",
            "rules": {
                "state": ["All India"],
                "housing_status": ["kutcha", "homeless", "semi-pucca"],
                "income_limit": 200000.0
            },
            "req_docs": ["Aadhaar Card", "Bank Account Details", "Land Title Deed / Patta", "MGNREGA Job Card", "Ration Card"],
            "opt_docs": ["Caste Certificate"]
        },
        {
            "id": "MGNREGA_WORK",
            "name": "Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGA)",
            "name_te": "మహాత్మా గాంధీ జాతీయ గ్రామీణ ఉపాధి హామీ పథకం",
            "cat": "Employment",
            "level": "Central",
            "dept": "Ministry of Rural Development",
            "target": "Every rural household whose adult members volunteer to do unskilled manual work",
            "desc": "Guarantees at least 100 days of wage employment in a financial year to every rural household at statutory notified daily wages (Rs. 300/day in AP).",
            "desc_te": "గ్రామీణ ప్రాంతాల్లో ప్రతి కుటుంబానికి సంవత్సరానికి కనీసం 100 రోజుల వేతన ఉపాధి కల్పించే చట్టబద్ధమైన పథకం.",
            "elig_text": "Any adult resident (age 18+) living in the Gram Panchayat willing to perform unskilled manual public works.",
            "benefits": "Statutory wage payment within 15 days directly into bank/post office account; unemployment allowance if work not given in 15 days.",
            "steps": "1. Apply for Job Card at Gram Panchayat. 2. Submit Form 6 work demand application. 3. Receive work assignment within 15 days.",
            "url": "https://nrega.nic.in",
            "rules": {
                "state": ["All India"],
                "min_age": 18
            },
            "req_docs": ["Aadhaar Card", "Passport Size Photograph", "Bank or Post Office Passbook"],
            "opt_docs": []
        },
        {
            "id": "YSR_PENSION",
            "name": "YSR Pension Kanuka (Old Age, Widow, & Disability Pension)",
            "name_te": "వైఎస్సార్ పెన్షన్ కానుక (వృద్ధాప్య, వితంతు, వికలాంగుల పెన్షన్)",
            "cat": "Senior citizens",
            "level": "State",
            "dept": "Society for Rural Development (SERP), Govt of AP",
            "target": "Senior citizens (age 60+), widows, single women, weavers, and persons with disabilities",
            "desc": "Monthly social security pension of Rs. 3,000 per month (Rs. 6,000 for persons with severe disabilities) delivered at doorstep on the 1st of every month.",
            "desc_te": "వృద్ధులు, వితంతువులు మరియు దివ్యాంగులకు ప్రతి నెలా మొదటి తేదీనే ఇంటి వద్దే పెన్షన్ అందించే సాంఘిక భద్రతా పథకం.",
            "elig_text": "Age 60 years or above for Old Age Pension; age 18+ for Widow/Disability Pension; family income under Rs. 1,20,000/year; less than 3 acres wetland or 10 acres dryland.",
            "benefits": "Monthly cash pension of Rs. 3,000 to Rs. 6,000 delivered via biometric Aadhaar auth.",
            "steps": "1. Submit application at Sachivalayam with age and income proofs. 2. Field verification by Welfare Assistant. 3. Approval by MPDO/Municipal Commissioner.",
            "url": "https://sspensions.ap.gov.in",
            "rules": {
                "state": ["Andhra Pradesh"],
                "min_age": 60,
                "income_limit": 120000.0
            },
            "req_docs": ["Aadhaar Card", "Age Proof (Birth Certificate / Voter ID)", "Rice Card", "Bank Passbook"],
            "opt_docs": ["SADAREM Disability Certificate (for disability pension)", "Death Certificate of Husband (for widow pension)"]
        },
        {
            "id": "PM_SURYA_GHAR",
            "name": "PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar)",
            "name_te": "పీఎం సూర్య ఘర్: ఉచిత విద్యుత్ పథకం (రూఫ్‌టాప్ సోలార్)",
            "cat": "Financial assistance",
            "level": "Central",
            "dept": "Ministry of New and Renewable Energy (MNRE)",
            "target": "Residential households with roof space and domestic power connection",
            "desc": "Provides up to Rs. 78,000 direct central subsidy for installing 3 KW solar rooftop panels, giving households up to 300 units of free clean electricity every month.",
            "desc_te": "ఇంటి పైకప్పుపై సోలార్ ప్యానెల్స్ అమర్చుకోవడానికి రూ. 78,000 వరకు సబ్సిడీ మరియు నెలకు 300 యూనిట్ల ఉచిత విద్యుత్ అందించే పథకం.",
            "elig_text": "Indian citizen residential consumer with an active electricity connection in their name and suitable roof ownership.",
            "benefits": "Rs. 30,000 for 1 KW, Rs. 60,000 for 2 KW, and Rs. 78,000 for 3 KW systems + excess power grid sellback.",
            "steps": "1. Register on National Portal for Rooftop Solar. 2. Select empanelled vendor. 3. Discom feasibility and net meter installation.",
            "url": "https://pmsuryaghar.gov.in",
            "rules": {
                "state": ["All India"]
            },
            "req_docs": ["Electricity Consumer Connection Bill", "Aadhaar Card", "Bank Account Details (cancelled cheque)", "Roof Ownership Proof"],
            "opt_docs": []
        },
        {
            "id": "JAGANANNA_VIDYA_DEEVENA",
            "name": "Jagananna Vidya Deevena (Full Fee Reimbursement)",
            "name_te": "జగనన్న విద్యా దీవెన (పూర్తి ఫీజు రీయింబర్స్‌మెంట్)",
            "cat": "Education",
            "level": "State",
            "dept": "Higher Education Department, Govt of AP",
            "target": "Post-matric students pursuing ITI, Polytechnic, Degree, Engineering, and Professional courses",
            "desc": "100% full fee reimbursement paid directly to the student mother's account in four quarterly tranches.",
            "desc_te": "డిగ్రీ, ఇంజనీరింగ్, ఐటీఐ చదివే పేద విద్యార్థులకు పూర్తి కళాశాల ఫీజు రీయింబర్స్‌మెంట్ అందించే పథకం.",
            "elig_text": "Family annual income below Rs. 2,50,000; students pursuing recognized higher education courses in AP with 75% college attendance.",
            "benefits": "100% tuition fee reimbursement credited directly quarterly.",
            "steps": "1. Apply via Jnanabhumi portal through college desk. 2. Biometric validation by student and mother at Sachivalayam. 3. District Welfare Officer release.",
            "url": "https://jnanabhumi.ap.gov.in",
            "rules": {
                "state": ["Andhra Pradesh"],
                "income_limit": 250000.0,
                "is_student": True
            },
            "req_docs": ["College Admission & Fee Structure Letter", "Aadhaar of Student & Mother", "Income Certificate / Rice Card", "Previous Marksheet"],
            "opt_docs": []
        },
        {
            "id": "PM_FASAL_BIMA",
            "name": "Pradhan Mantri Fasal Bima Yojana (Crop Insurance)",
            "name_te": "ప్రధాన మంత్రి ఫసల్ బీమా యోజన (పంట బీమా)",
            "cat": "Agriculture",
            "level": "Central",
            "dept": "Ministry of Agriculture",
            "target": "Farmers growing notified crops (Paddy, Cotton, Chili, Bengal Gram)",
            "desc": "Comprehensive crop insurance shield against non-preventable natural risks (drought, flood, unseasonal rain, pest outbreaks) from pre-sowing to post-harvest.",
            "desc_te": "వరదలు, కరువు, తెగుళ్ల వల్ల పంట నష్టపోతే పరిహారం చెల్లించే సమగ్ర పంట బీమా పథకం.",
            "elig_text": "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
            "benefits": "Full sum insured claim payment based on Crop Cutting Experiments (CCE) yield loss data.",
            "steps": "1. e-Crop booking at Rythu Bharosa Kendra. 2. Automatic enrollment without premium burden for AP farmers. 3. Claim settlement via DBT.",
            "url": "https://pmfby.gov.in",
            "rules": {
                "occupation": ["farmer"],
                "is_farmer": True,
                "state": ["All India"]
            },
            "req_docs": ["Aadhaar Card", "e-Crop Booking Receipt", "Land Record / CCRC Agreement", "Bank Passbook"],
            "opt_docs": []
        },
        {
            "id": "YSR_CHEYUTHA",
            "name": "YSR Cheyutha (Women Livelihood Support)",
            "name_te": "వైఎస్సార్ చేయూత పథకం (మహిళా జీవనోపాధి సహాయం)",
            "cat": "Women",
            "level": "State",
            "dept": "BC, SC, ST, Minorities Welfare Dept, Govt of AP",
            "target": "SC, ST, BC, and Minority women aged 45 to 60 years",
            "desc": "Financial assistance of Rs. 18,750 per year (total Rs. 75,000 over 4 years) to promote sustainable entrepreneurship such as dairy cattle, grocery shops, and poultry.",
            "desc_te": "45 నుండి 60 సంవత్సరాల మధ్య వయస్సు గల పేద మహిళలకు జీవనోపాధి కోసం ఏటా రూ. 18,750 ఆర్థిక సహాయం అందించే పథకం.",
            "elig_text": "Women belonging to SC, ST, BC, or Minority communities aged between 45 and 60 years with family income under Rs. 1,20,000 in rural areas.",
            "benefits": "Rs. 18,750/year direct cash grant + technical tie-ups with Amul, Reliance, and ITC for retail business setup.",
            "steps": "1. Verification of age and community credentials at Sachivalayam. 2. Social audit publication. 3. Direct credit into woman's savings bank account.",
            "url": "https://gramawardsachivalayam.ap.gov.in",
            "rules": {
                "state": ["Andhra Pradesh"],
                "gender": "Female",
                "min_age": 45,
                "max_age": 60,
                "income_limit": 120000.0
            },
            "req_docs": ["Aadhaar Card", "Integrated Community Certificate (Caste)", "Age Proof", "Rice Card", "Bank Passbook"],
            "opt_docs": []
        },
        {
            "id": "STAND_UP_INDIA",
            "name": "Stand-Up India Scheme for Greenfield Enterprises",
            "name_te": "స్టాండ్-అప్ ఇండియా పథకం",
            "cat": "Entrepreneurship",
            "level": "Central",
            "dept": "Department of Financial Services, Ministry of Finance",
            "target": "SC/ST and Woman entrepreneurs launching greenfield enterprises",
            "desc": "Bank composite loans between Rs. 10 Lakhs and Rs. 1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch for manufacturing, services, or trading.",
            "desc_te": "మహిళలు మరియు ఎస్సీ/ఎస్టీ ఔత్సాహిక పారిశ్రామికవేత్తలకు రూ. 10 లక్షల నుండి రూ. 1 కోటి వరకు బ్యాంక్ రుణాలు అందించే పథకం.",
            "elig_text": "SC/ST and/or woman entrepreneurs aged 18+ setting up a new business enterprise.",
            "benefits": "Collateral-free subsidized interest loans with 7-year repayment period and up to 18-month moratorium.",
            "steps": "1. Apply online through Stand-Up India portal. 2. Handholding support by Lead District Manager (LDM). 3. Branch appraisal and loan sanction.",
            "url": "https://standupmitra.in",
            "rules": {
                "state": ["All India"],
                "min_age": 18
            },
            "req_docs": ["Project Detailed Report (DPR)", "Identity Proof (Aadhaar/PAN)", "Proof of Category / Gender", "Bank Statements"],
            "opt_docs": ["MSME Udyam Registration"]
        },
        {
            "id": "PMMVY",
            "name": "Pradhan Mantri Matru Vandana Yojana (Maternity Support)",
            "name_te": "ప్రధాన మంత్రి మాతృ వందన యోజన",
            "cat": "Women",
            "level": "Central",
            "dept": "Ministry of Women & Child Development",
            "target": "Pregnant women and lactating mothers for first and second live child",
            "desc": "Direct cash incentive of Rs. 5,000 in two installments for the first child (and Rs. 6,000 for a girl child as second birth) to compensate for wage loss during pregnancy.",
            "desc_te": "గర్భిణీ స్త్రీలకు మరియు బాలింతలకు పౌష్టికాహారం మరియు వేతన నష్ట పరిహారంగా రూ. 5,000 నుండి రూ. 6,000 నగదు సహాయం.",
            "elig_text": "Pregnant women and lactating mothers registered at Anganwadi / Health Centre within 150 days of Last Menstrual Period (LMP).",
            "benefits": "Cash transfer linked to ANC checkups, institutional delivery, and child vaccination milestones.",
            "steps": "1. Register at nearest Anganwadi centre with MCP card. 2. Submit ANC medical confirmation. 3. DBT release.",
            "url": "https://pmmvy.wcd.gov.in",
            "rules": {
                "gender": "Female",
                "state": ["All India"],
                "min_age": 19
            },
            "req_docs": ["Mother and Child Protection (MCP) Card", "Aadhaar of Mother and Husband", "Bank Passbook of Mother"],
            "opt_docs": []
        },
        {
            "id": "DDU_GKY",
            "name": "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (Rural Youth Skilling)",
            "name_te": "దీన్ దయాళ్ ఉపాధ్యాయ గ్రామీణ కౌశల్య యోజన",
            "cat": "Employment",
            "level": "Central",
            "dept": "Ministry of Rural Development",
            "target": "Rural poor youth aged 15 to 35 years seeking formal employment",
            "desc": "Free residential skill training programs in IT, hospitality, automotive, electronics, and retail with guaranteed placement in organized private sector companies.",
            "desc_te": "గ్రామీణ ప్రాంత యువతకు ఉచిత నైపుణ్య శిక్షణ మరియు ప్రముఖ కంపెనీలలో గ్యారెంటీ ఉద్యోగావకాశాలు కల్పించే పథకం.",
            "elig_text": "Rural youth aged 15-35 years from rural poor families (possessing BPL ration card or MGNREGA job card).",
            "benefits": "100% free boarding, lodging, uniform, course books, training, and minimum 70% job placement guarantee.",
            "steps": "1. Register on Kaushal Panjee portal or attend Gram Panchayat mobilization drive. 2. Counseling & batch allocation. 3. 3-to-6 month training.",
            "url": "https://ddugky.gov.in",
            "rules": {
                "state": ["All India"],
                "min_age": 15,
                "max_age": 35
            },
            "req_docs": ["Aadhaar Card", "10th / Intermediate Marksheet", "BPL Ration Card / Job Card", "Passport Size Photos"],
            "opt_docs": []
        }
    ]

    for s_data in schemes_data:
        scheme = models.Scheme(
            scheme_id=s_data["id"],
            name=s_data["name"],
            name_te=s_data.get("name_te"),
            category=s_data["cat"],
            government_level=s_data["level"],
            department=s_data["dept"],
            target_beneficiaries=s_data["target"],
            description=s_data["desc"],
            description_te=s_data.get("desc_te"),
            eligibility_criteria_text=s_data["elig_text"],
            benefits_text=s_data["benefits"],
            application_steps_text=s_data["steps"],
            official_url=s_data["url"],
            source_document=f"Govt Official Portal & Guidelines: {s_data['url']}",
            source_url=s_data["url"],
            verification_status="Verified",
            last_verified_date="2026-01-15",
            eligibility_rules=s_data.get("rules"),
            required_documents=s_data.get("req_docs", []),
            optional_documents=s_data.get("opt_docs", [])
        )
        db.add(scheme)

    # 10. 10 Government Services
    services_data = [
        ("Village Secretariat (Grama Sachivalayam)", "గ్రామ సచివాలయం", "Panchayat", "Opposite Panchayat Library, Ward 5", "0863-2244101", "sachivalayam.chandanagar@ap.gov.in", "9:30 AM - 5:30 PM (Mon-Sat)", "Aadhaar updation, caste/income certificates, pension distribution, scheme applications, revenue mutations, civil registrations.", 16.3068, 80.4362),
        ("Primary Health Sub-Centre (PHC Clinic)", "ప్రాథమిక ఆరోగ్య ఉపకేంద్రం", "Health", "Near Shivalayam Tank, Ward 2", "0863-2244102", "phc.chandanagar@ap.gov.in", "8:30 AM - 4:00 PM (Emergency 24x7)", "Outpatient consultations, maternal checkups, childhood immunizations, diagnostic BP/sugar testing, free generic medicine dispensary.", 16.3070, 80.4355),
        ("Rythu Bharosa Kendra (RBK - Agriculture Hub)", "రైతు భరోసా కేంద్రం", "Agriculture", "Rythu Colony Main Road, Ward 3", "0863-2244103", "rbk.chandanagar@ap.gov.in", "8:00 AM - 1:00 PM & 3:00 PM - 6:00 PM", "Quality certified seeds and fertilizers, digital soil testing, e-Crop booking, farm mechanization custom hiring, pest diagnostic lab.", 16.3095, 80.4380),
        ("District Cooperative Central Bank (DCCB) Village Branch", "డీసీసీబీ బ్యాంక్ శాఖ", "Banking", "Bazaar Street, Ward 2", "0863-2244104", "dccb.chandanagar@dccb.ap.gov.in", "10:00 AM - 4:00 PM (Mon-Sat, 2nd/4th Sat off)", "Crop loans (KCC), savings bank accounts, SHG bank linkage loans, fixed deposits, ATM service, direct benefit transfer payouts.", 16.3080, 80.4349),
        ("Fair Price / Ration Shop #12 (Civil Supplies)", "రేషన్ దుకాణం #12", "Ration", "Harijanawada Road, Ward 7", "9848123401", None, "7:00 AM - 12:00 PM & 4:00 PM - 8:00 PM", "Subsidized fortified rice, red gram dal, sugar, cooking oil distribution via e-PoS biometric authentication under PM-GKAY.", 16.3038, 80.4368),
        ("Anganwadi Welfare Centre #1 (Integrated Child Dev)", "అంగన్‌వాడీ కేంద్రం #1", "Social welfare", "School Campus, Ward 5", "9848123402", None, "9:00 AM - 3:00 PM (Mon-Sat)", "Early childhood pre-school education, hot cooked meals for pregnant and lactating mothers, Take-Home Rations (Balamrutham).", 16.3063, 80.4375),
        ("Mandal Parishad Primary School (MPPS)", "మండల పరిషత్ ప్రాథమిక పాఠశాల", "Education", "School Lane, Ward 5", "0863-2244105", "mpps.chandanagar@ap.edu.in", "9:00 AM - 4:30 PM (Mon-Fri)", "Telugu and English medium education Class 1-5, smart digital classrooms, free textbooks and uniforms, midday meals with eggs.", 16.3060, 80.4378),
        ("MeeSeva / Common Service Centre (CSC)", "మీసేవ / కామన్ సర్వీస్ సెంటర్", "Panchayat", "Near Bus Stop, Ward 1", "9848123403", "meeseva.chandanagar@ap.gov.in", "8:30 AM - 8:00 PM (All days)", "Electricity bill payment, PAN card application, passport assistance, land record Adangal printing, insurance renewal.", 16.3052, 80.4342),
        ("Veterinary First Aid Dispensary", "పశువైద్య ప్రాథమిక చికిత్సా కేంద్రం", "Agriculture", "Bazaar Road North, Ward 2", "0863-2244106", None, "8:00 AM - 12:00 PM", "Livestock vaccination, artificial insemination, foot and mouth disease treatment, cattle feed subsidy distribution.", 16.3085, 80.4355),
        ("Village Emergency Police & Fire Response Beat", "గ్రామ అత్యవసర పోలీస్ మరియు రక్షక దళం", "Emergency", "Panchayat Compound, Ward 5", "112 / 100", "guntur.ruralpolice@ap.gov.in", "24 Hours / 7 Days", "Dial 112 emergency response, village Mahila Police liaison, dispute mediation, night patrol beat.", 16.3067, 80.4360)
    ]

    for name, name_te, cat, addr, phone, email, hours, serv, lat, lng in services_data:
        gs = models.GovernmentService(
            village_id=village.id,
            name=name,
            name_te=name_te,
            category=cat,
            address=addr,
            contact_phone=phone,
            contact_email=email,
            opening_hours=hours,
            services_offered=serv,
            latitude=lat,
            longitude=lng,
            official_link="https://guntur.ap.gov.in/services",
            verification_status="Verified"
        )
        db.add(gs)

    # 11. Agriculture Advisories & Market Prices
    agri_advisories = [
        ("Paddy (వరి)", "వరి", "Rabi", "Clay Loam / Black Soil", "High", "Apply second split of Nitrogen (Urea 25 kg/acre) along with Potash at panicle initiation stage. Maintain 2-3 cm thin water layer in field. Watch out for stem borer and blast symptoms.", "అంకురం దశలో ఎకరాకు 25 కిలోల యూరియా మరియు పొటాష్ వేయండి. పొలంలో 2-3 సెం.మీ నీరు ఉండేలా చూడండి.", "Pheromone traps (4/acre) recommended for stem borer detection."),
        ("Red Chili (ఎర్ర మిరప)", "ఎర్ర మిరప", "Kharif-Rabi", "Well-drained Black Cotton Soil", "Medium", "Harvest ripe red pods when color turns deep crimson. Dry on clean poly-sheets to maintain low moisture (<10%) and prevent aflatoxin formation.", "మిరప కాయలు బాగా ఎర్రబడిన తర్వాత మాత్రమే కోత కోయండి. పాలిథిన్ షీట్లపై మాత్రమే ఆరబెట్టండి.", "Install blue sticky traps for invasive thrips control."),
        ("Cotton (ప్రత్తి)", "ప్రత్తి", "Kharif", "Deep Black Cotton Soil", "Medium", "Last picking completed. Remove stubbles promptly to prevent pink bollworm survival. Deep summer ploughing recommended before April.", "పత్తి తీత పూర్తయిన వెంటనే మోళ్లను తొలగించి వేసవి లోతు దుక్కులు చేయండి.", "Destroy leftover bolls to break pink bollworm life cycle."),
        ("Bengal Gram (శనగ)", "శనగ", "Rabi", "Heavy Black Clay", "Low", "Crop approaching maturity stage. Cease irrigation 10 days before harvest to ensure uniform ripening of pods.", "పంట పక్వానికి వచ్చే దశలో ఉంది. కోతకు 10 రోజుల ముందు నీటి తడులు ఆపండి.", "Check for pod borer (Helicoverpa armigera) entry holes.")
    ]
    for c_name, c_te, ssn, soil, w_req, adv, adv_te, pest in agri_advisories:
        ag = models.AgricultureRecord(
            crop_name=c_name,
            crop_name_te=c_te,
            season=ssn,
            soil_type=soil,
            water_requirement=w_req,
            advisory_text=adv,
            advisory_te=adv_te,
            pest_alerts=pest
        )
        db.add(ag)

    market_prices = [
        ("Paddy (Grade A / Fine)", "Guntur Agricultural Market Yard", 2320.0, 2450.0, 2380.0, "Rs./Quintal"),
        ("Red Chili (Teja / Medium)", "Guntur Market Yard (Asia's Largest)", 17500.0, 21000.0, 19200.0, "Rs./Quintal"),
        ("Cotton (Medium Staple)", "Adilabad / Guntur CCI Centre", 7120.0, 7550.0, 7350.0, "Rs./Quintal"),
        ("Bengal Gram (Desi Chana)", "Tenali APMC Yard", 5600.0, 6100.0, 5850.0, "Rs./Quintal"),
        ("Maize (Yellow Feed Grade)", "Guntur APMC Yard", 2050.0, 2220.0, 2150.0, "Rs./Quintal")
    ]
    for c_name, m_name, min_p, max_p, mod_p, unit in market_prices:
        mp = models.MarketPriceRecord(
            crop_name=c_name,
            market_name=m_name,
            min_price=min_p,
            max_price=max_p,
            modal_price=mod_p,
            unit=unit,
            verification_status="Verified AP Agmarknet Record"
        )
        db.add(mp)

    # 12. Employment Records
    employment_data = [
        ("MGNREGA Canal Desilting & Bund Strengthening", "ఉపాధి హామీ కాలువ పూడికతీత పనులు", "MGNREGA", "Excavation and desilting of North Irrigation Canal from Survey #120 to #180. 100 days statutory rural work guaranteed.", "Rs. 300 / Day", "Up to 100 days / year", "All adult resident job card holders (age 18+). Both men and women eligible.", "Submit Form 6 work demand at Sachivalayam counter or to Field Assistant.", "https://nrega.nic.in"),
        ("Gram Panchayat Village Sanitation & Waste Segregation Worker", "గ్రామ పంచాయతీ పారిశుద్ధ్య కార్మికులు", "Panchayat Contract", "Daily door-to-door solid waste collection using electric cart and segregation at SWPC shed.", "Rs. 10,000 / Month", "Permanent contractual", "Local village resident, physical fitness, age 18-45.", "Submit handwritten application to Panchayat Secretary.", "https://guntur.ap.gov.in"),
        ("Custom Hiring Centre Farm Machinery & Tractor Operator", "వ్యవసాయ పరికరాల కేంద్రం ఆపరేటర్", "Agricultural Labor", "Operate combine harvester, paddy transplanter, and rotary tiller at subsidized rates for village farmers.", "Rs. 450 / Day", "Seasonal during sowing & harvest", "Valid driving license (LMV/Tractor), basic farm machinery repair knowledge.", "Contact Rythu Bharosa Kendra Agricultural Officer.", "https://ysrrythubharosa.ap.gov.in"),
        ("Asha Health Worker & Community Nutrition Volunteer", "ఆశా కార్యకర్త (ASHA Volunteer)", "Health Support", "Assisting pregnant women, tracking child immunizations, coordinating PHC health camps.", "Rs. 10,000 / Month honorarium", "Honorary community post", "Local married female resident, 10th pass, good community communication.", "Apply during Medical Department notification window.", "https://nhm.gov.in")
    ]
    for title, title_te, cat, desc, wage, days, elig, proc, link in employment_data:
        emp = models.EmploymentRecord(
            village_id=village.id,
            title=title,
            title_te=title_te,
            category=cat,
            description=desc,
            wage_rate=wage,
            working_days=days,
            eligibility=elig,
            application_procedure=proc,
            official_link=link,
            verification_status="Verified Scheme Record"
        )
        db.add(emp)

    # 13. In-App Notifications
    notifs = [
        ("Important: Gram Sabha Meeting Scheduled for Feb 28th", "ముఖ్య గమనిక: ఫిబ్రవరి 28న గ్రామసభ సమావేశం", "Notice for Q1 general body meeting issued. Check agenda items.", "meeting", "/gram-sabha"),
        ("Scheme Match: You may be eligible for PM-Kisan & Rythu Bharosa", "పథకం అర్హత: మీరు పీఎం-కిసాన్ మరియు రైతు భరోసాకు అర్హులు కావచ్చు", "Based on your farmer profile with 3.5 acres land holding, check the document readiness checklist.", "scheme", "/schemes"),
        ("Civic Issue Update: Water pipe repair assigned in Ward 3", "సమస్య పరిష్కార సమాచారం: వార్డు 3లో తాగునీటి పైపు మరమ్మతు కేటాయించబడింది", "Assigned to P. Anji Reddy (Rural Water Supply). Expected resolution in 24 hours.", "issue", "/issues"),
        ("Summer Water Supply Timings Announced", "వేసవి తాగునీటి సరఫరా వేళల ప్రకటన", "Morning 6:00 AM - 8:30 AM and Evening 5:30 PM - 7:30 PM.", "announcement", "/announcements")
    ]
    for title, title_te, msg, cat, link in notifs:
        n = models.Notification(
            user_id=citizen_user.id,
            title=title,
            title_te=title_te,
            message=msg,
            category=cat,
            link_url=link,
            is_read=False
        )
        db.add(n)

    # 14. Sample Document Checklist for citizen
    pm_kisan_scheme = db.query(models.Scheme).filter(models.Scheme.scheme_id == "PM_KISAN").first()
    if pm_kisan_scheme:
        checklists = [
            ("Aadhaar Card", "Identity Proof", "Collected", "Aadhaar verified with mobile link"),
            ("Pattadar Passbook / RoR 1B", "Land Record", "Uploaded", "Uploaded scanned copy of Title Deed Patta #248"),
            ("Aadhaar-linked Bank Passbook", "Financial Proof", "Collected", "DCCB Bank account seeded with NPCI"),
            ("Voter ID Card", "Identity Proof", "Not collected", "Optional document")
        ]
        for d_name, d_type, stat, note in checklists:
            chk = models.CitizenDocumentChecklist(
                user_id=citizen_user.id,
                scheme_id=pm_kisan_scheme.id,
                document_name=d_name,
                document_type=d_type,
                status=stat,
                notes=note
            )
            db.add(chk)

    db.commit()
    print("Database seeding completed successfully!")
