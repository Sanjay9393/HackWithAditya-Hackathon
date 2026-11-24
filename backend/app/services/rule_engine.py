from typing import Dict, Any, List, Tuple
from app.schemas.schemas import UserProfileSchema

def evaluate_scheme_eligibility(rules: Dict[str, Any], profile: UserProfileSchema) -> Tuple[str, int, List[Dict[str, Any]], str, str]:
    """
    Evaluates a user profile against structured scheme eligibility rules.
    Returns: (status, score, criteria_breakdown, explanation_en, explanation_te)
    """
    if not rules:
        return (
            "Potential match",
            75,
            [{"criterion": "General Eligibility", "status": "Met", "detail": "Universal citizen eligibility criteria"}],
            "This scheme is generally accessible to residents. Check required documents for formal application.",
            "ఈ పథకం సాధారణంగా నివాసితులకు అందుబాటులో ఉంటుంది. దరఖాస్తుకు అవసరమైన పత్రాలను పరిశీలించండి."
        )

    criteria_breakdown = []
    total_checks = 0
    passed_checks = 0
    missing_info = []
    hard_failures = []

    # 1. State check
    allowed_states = rules.get("state") or rules.get("states")
    if allowed_states:
        total_checks += 1
        user_state = profile.state or "Andhra Pradesh"
        if "All India" in allowed_states or user_state in allowed_states:
            passed_checks += 1
            criteria_breakdown.append({
                "criterion": "State / Region",
                "status": "Met",
                "detail": f"Applicable in {user_state}"
            })
        else:
            hard_failures.append(f"State restricted to {', '.join(allowed_states)}")
            criteria_breakdown.append({
                "criterion": "State / Region",
                "status": "Unmet",
                "detail": f"Requires residence in {', '.join(allowed_states)}"
            })

    # 2. Occupation check
    allowed_occupations = rules.get("occupation")
    if allowed_occupations:
        total_checks += 1
        user_occ = (profile.occupation or "").lower().strip()
        matched = any(occ.lower() in user_occ for occ in allowed_occupations) or \
                  ("farmer" in allowed_occupations and profile.is_farmer) or \
                  ("student" in allowed_occupations and profile.is_student)
        if matched:
            passed_checks += 1
            criteria_breakdown.append({
                "criterion": "Occupation",
                "status": "Met",
                "detail": f"Matched required occupation: {user_occ or 'Farmer/Student'}"
            })
        elif not user_occ:
            missing_info.append("Occupation not specified")
            criteria_breakdown.append({
                "criterion": "Occupation",
                "status": "Unknown",
                "detail": "Please specify your occupation in profile"
            })
        else:
            hard_failures.append(f"Requires occupation: {', '.join(allowed_occupations)}")
            criteria_breakdown.append({
                "criterion": "Occupation",
                "status": "Unmet",
                "detail": f"Requires {', '.join(allowed_occupations)}, but profile is {user_occ}"
            })

    # 3. Age check
    min_age = rules.get("min_age")
    max_age = rules.get("max_age")
    if min_age is not None or max_age is not None:
        total_checks += 1
        if profile.age is None:
            missing_info.append("Age not provided")
            criteria_breakdown.append({
                "criterion": "Age Limit",
                "status": "Unknown",
                "detail": "Age is required to verify age limit"
            })
        else:
            age_ok = True
            msg = f"Age {profile.age} is within limit"
            if min_age is not None and profile.age < min_age:
                age_ok = False
                msg = f"Requires minimum age {min_age} years"
            if max_age is not None and profile.age > max_age:
                age_ok = False
                msg = f"Requires maximum age {max_age} years"
            
            if age_ok:
                passed_checks += 1
                criteria_breakdown.append({
                    "criterion": "Age Limit",
                    "status": "Met",
                    "detail": msg
                })
            else:
                hard_failures.append(msg)
                criteria_breakdown.append({
                    "criterion": "Age Limit",
                    "status": "Unmet",
                    "detail": msg
                })

    # 4. Income limit check
    income_limit = rules.get("income_limit") or rules.get("max_income")
    if income_limit is not None:
        total_checks += 1
        if profile.annual_income is None:
            missing_info.append("Annual income not provided")
            criteria_breakdown.append({
                "criterion": "Income Ceiling",
                "status": "Unknown",
                "detail": f"Requires annual income under Rs. {income_limit:,.0f}"
            })
        elif profile.annual_income <= income_limit:
            passed_checks += 1
            criteria_breakdown.append({
                "criterion": "Income Ceiling",
                "status": "Met",
                "detail": f"Income (Rs. {profile.annual_income:,.0f}) is within limit (Rs. {income_limit:,.0f})"
            })
        else:
            hard_failures.append(f"Income exceeds limit of Rs. {income_limit:,.0f}")
            criteria_breakdown.append({
                "criterion": "Income Ceiling",
                "status": "Unmet",
                "detail": f"Income (Rs. {profile.annual_income:,.0f}) exceeds ceiling (Rs. {income_limit:,.0f})"
            })

    # 5. Farmer specific: land holding check
    max_land = rules.get("max_land_acres")
    if max_land is not None:
        total_checks += 1
        user_land = profile.land_holding_acres or 0.0
        if user_land <= max_land:
            passed_checks += 1
            criteria_breakdown.append({
                "criterion": "Land Holding Limit",
                "status": "Met",
                "detail": f"Land {user_land} acres is within {max_land} acres limit"
            })
        else:
            hard_failures.append(f"Land holding exceeds {max_land} acres")
            criteria_breakdown.append({
                "criterion": "Land Holding Limit",
                "status": "Unmet",
                "detail": f"Land holding ({user_land} acres) exceeds {max_land} acres"
            })

    # 6. Gender specific check
    req_gender = rules.get("gender")
    if req_gender:
        total_checks += 1
        if not profile.gender:
            missing_info.append("Gender not specified")
            criteria_breakdown.append({
                "criterion": "Gender",
                "status": "Unknown",
                "detail": f"Scheme specifically benefits {req_gender}"
            })
        elif profile.gender.lower() == req_gender.lower():
            passed_checks += 1
            criteria_breakdown.append({
                "criterion": "Gender",
                "status": "Met",
                "detail": f"Matches required gender: {req_gender}"
            })
        else:
            hard_failures.append(f"Exclusively for {req_gender} applicants")
            criteria_breakdown.append({
                "criterion": "Gender",
                "status": "Unmet",
                "detail": f"Requires {req_gender} applicant"
            })

    # 7. Housing status check (e.g. for PMAY)
    req_housing = rules.get("housing_status")
    if req_housing:
        total_checks += 1
        user_house = profile.housing_status or "kutcha"
        if user_house in req_housing:
            passed_checks += 1
            criteria_breakdown.append({
                "criterion": "Housing Type",
                "status": "Met",
                "detail": f"Housing type '{user_house}' qualifies for housing assistance"
            })
        else:
            criteria_breakdown.append({
                "criterion": "Housing Type",
                "status": "Unmet",
                "detail": f"Requires {', '.join(req_housing)} housing condition"
            })

    # Compute overall score and status
    if total_checks == 0:
        return (
            "Potential match",
            80,
            criteria_breakdown,
            "General scheme criteria open to all village residents.",
            "ఈ పథకం గ్రామస్తులందరికీ సాధారణ అర్హతతో వర్తిస్తుంది."
        )

    score = int((passed_checks / total_checks) * 100)

    if hard_failures:
        status = "Likely not eligible based on entered information"
        score = min(score, 40)
        expl_en = f"You may not satisfy: {'; '.join(hard_failures)}."
        expl_te = f"మీరు ఈ క్రింది నిబంధనలకు సరిపోకపోవచ్చు: {'; '.join(hard_failures)}."
    elif missing_info:
        status = "Needs more information"
        expl_en = f"Potential match, but requires additional information: {', '.join(missing_info)}."
        expl_te = f"అర్హత అవకాశం ఉంది, కానీ మరిన్ని వివరాలు అవసరం: {', '.join(missing_info)}."
    else:
        status = "Potential match"
        expl_en = "Your entered profile matches all evaluated criteria for this scheme."
        expl_te = "మీ వివరాలు ఈ పథకానికి అవసరమైన అన్ని నిబంధనలకు సరిపోతున్నాయి."

    return (status, score, criteria_breakdown, expl_en, expl_te)
