import json
import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings

logger = logging.getLogger(__name__)

# Check if official SDK is imported
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    logger.warning("google-genai package not found. Fallback mode will be used.")

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.client = None
        if self.api_key and GENAI_AVAILABLE:
            try:
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Gemini Client initialized successfully with API key.")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini Client: {e}")
                self.client = None

    def is_live(self) -> bool:
        return self.client is not None

    def generate_chat_response(
        self,
        user_message: str,
        retrieved_context: List[Dict[str, Any]],
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Generates an AI response strictly grounded in retrieved village & scheme context.
        """
        context_str = "\n\n".join([
            f"--- SOURCE: {c.get('source_title')} ({c.get('type')}) ---\n{c.get('text')}"
            for c in retrieved_context
        ])

        system_instruction = f"""
You are PrajaAI, the Smart Village AI Assistant for Chandanagar Gram Panchayat.
Your goal is to assist citizens, farmers, and village administrators with verified information.

STRICT ACCURACY RULES:
1. Ground your answer ONLY in the provided verified context.
2. If the context does not contain the answer, explicitly state: "Information not verified or unavailable in village records."
3. Never invent project budgets, completion dates, contractor names, official sanctions, or government eligibility rules.
4. Distinguish verified records from sample/demo data when applicable.
5. Provide helpful, citizen-friendly explanations in {'Telugu (తెలుగు)' if language == 'te' else 'English'}.
6. Cite the specific village project, scheme, or meeting mentioned.
7. Never claim you submitted an official application or spoke to a government officer.
"""

        if self.is_live():
            try:
                prompt = f"""
SYSTEM INSTRUCTION:
{system_instruction}

VERIFIED CONTEXT:
{context_str if context_str else "No direct matching documents found."}

USER QUERY:
{user_message}

Answer:
"""
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt
                )
                return {
                    "reply": response.text,
                    "citations": [
                        {"title": c.get("source_title"), "type": c.get("type"), "link": c.get("link")}
                        for c in retrieved_context
                    ],
                    "confidence_note": "Grounded via Gemini 2.0 & verified village knowledge base."
                }
            except Exception as e:
                logger.error(f"Gemini API invocation failed: {e}. Falling back to grounded rule response.")

        # Fallback / Demo Mode (High quality grounded generation)
        return self._generate_fallback_chat(user_message, retrieved_context, language)

    def _generate_fallback_chat(
        self,
        query: str,
        retrieved_context: List[Dict[str, Any]],
        language: str = "en"
    ) -> Dict[str, Any]:
        q = query.lower()
        citations = [
            {"title": c.get("source_title"), "type": c.get("type"), "link": c.get("link")}
            for c in retrieved_context
        ]

        if not retrieved_context:
            if language == "te":
                reply = "క్షమించండి, మీ ప్రశ్నకు సంబంధించిన ధృవీకరించబడిన సమాచారం గ్రామ రికార్డులలో అందుబాటులో లేదు. దయచేసి పంచాయతీ కార్యాలయాన్ని సంప్రదించండి లేదా గ్రామాభివృద్ధి పనులు మరియు సంక్షేమ పథకాల గురించి అడగండి."
            else:
                reply = "I could not find verified records matching your specific question in the Chandanagar Gram Panchayat database. You can ask about ongoing development works, government schemes (such as Rythu Bharosa, Jal Jeevan Mission, Amma Vodi), civic complaints, or Gram Sabha meetings."
            return {
                "reply": reply,
                "citations": [],
                "confidence_note": "Demo Mode: Grounded search returned no matching village records."
            }

        # Compose grounded answer from top snippets
        top_context = retrieved_context[0]
        text = top_context.get("text", "")
        title = top_context.get("source_title", "")
        item_type = top_context.get("type", "")

        if language == "te":
            reply = f"**{title} ({item_type})** ఆధారంగా:\n\n{text}\n\n*గమనిక: ఈ సమాచారం గ్రామ రికార్డుల నుండి పరిశీలించబడింది. అధికారిక ధృవీకరణ కొరకు గ్రామ సచివాలయాన్ని సంప్రదించవచ్చు.*"
        else:
            reply = f"According to verified village records for **{title}** ({item_type}):\n\n{text}\n\n*Source: Chandanagar Gram Panchayat Official Information System. For formal applications, visit the Village Secretariat.*"

        return {
            "reply": reply,
            "citations": citations,
            "confidence_note": "Demo Mode: Response synthesized from local verified village dataset."
        }

    def classify_civic_issue(self, title: str, description: str) -> Dict[str, Any]:
        """
        Classifies an issue into category, priority, and responsible department.
        """
        combined = f"{title} {description}".lower()

        category = "Other"
        priority = "Medium"
        department = "Panchayat Administration"

        if any(w in combined for w in ["water", "pipe", "tap", "leak", "borewell", "drinking"]):
            category = "Water supply"
            department = "Rural Water Supply (RWS) & Sanitation"
            priority = "High" if "burst" in combined or "leak" in combined else "Medium"
        elif any(w in combined for w in ["road", "pothole", "tar", "cement", "broken", "path"]):
            category = "Road damage"
            department = "Panchayat Roads & Engineering"
            priority = "High" if "accident" in combined or "deep" in combined else "Medium"
        elif any(w in combined for w in ["drain", "drainage", "gutter", "overflow", "stagnant"]):
            category = "Drainage"
            department = "Sanitation & Public Health"
            priority = "High"
        elif any(w in combined for w in ["light", "streetlight", "bulb", "dark", "pole"]):
            category = "Streetlights"
            department = "Panchayat Electrical Maintenance"
            priority = "Medium"
        elif any(w in combined for w in ["garbage", "trash", "waste", "dump", "sweep", "clean"]):
            category = "Garbage"
            department = "Village Sanitation Committee"
            priority = "Medium"
        elif any(w in combined for w in ["power", "transformer", "wire", "voltage", "current"]):
            category = "Electricity"
            department = "APCPDCL / Electricity Board"
            priority = "Critical" if "spark" in combined or "hanging" in combined else "High"
        elif any(w in combined for w in ["hospital", "clinic", "doctor", "medicine", "phc"]):
            category = "Health facilities"
            department = "Primary Health Centre (PHC)"
            priority = "High"
        elif any(w in combined for w in ["school", "teacher", "blackboard", "classroom"]):
            category = "School"
            department = "School Education Committee"
            priority = "Medium"

        return {
            "category": category,
            "suggested_priority": priority,
            "suggested_department": department,
            "summary": f"Reported {category.lower()} issue at designated ward. Requires attention from {department}."
        }

gemini_service = GeminiService()
