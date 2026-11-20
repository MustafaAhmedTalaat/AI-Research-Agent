import os
import logging
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from openai import OpenAI

load_dotenv()
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")

gemini_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
openrouter_client = (
    OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
        default_headers={
            "HTTP-Referer": FRONTEND_URL,
            "X-Title": "AI Research Agent",
        },
    )
    if OPENROUTER_API_KEY
    else None
)

OPENROUTER_FREE_MODELS = [
    "baidu/ernie-5.5-flash-preview:free",
    "dots-studio/dots-3-note-preview:free",
    "nvidia/nemotron-3-ultra-550b-a55b:free",
]

GEMINI_FALLBACK_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")


def _call_openrouter(
    model_name: str,
    prompt: str,
    system_instruction: str,
    json_mode: bool,
    temperature: float,
) -> str:
    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({"role": "user", "content": prompt})

    kwargs = {
        "model": model_name,
        "messages": messages,
        "temperature": temperature,
    }
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}

    try:
        completion = openrouter_client.chat.completions.create(**kwargs)
        return completion.choices[0].message.content
    except Exception as e:
        if json_mode and "response_format" in str(e).lower():
            logger.warning(
                f"Model {model_name} rejected json_mode, retrying without response_format"
            )
            kwargs.pop("response_format", None)
            completion = openrouter_client.chat.completions.create(**kwargs)
            return completion.choices[0].message.content
        raise


def _call_gemini(
    prompt: str,
    system_instruction: str,
    json_mode: bool,
    temperature: float,
) -> str:
    config_args = {"temperature": temperature}
    if system_instruction:
        config_args["system_instruction"] = system_instruction
    if json_mode:
        config_args["response_mime_type"] = "application/json"

    response = gemini_client.models.generate_content(
        model=GEMINI_FALLBACK_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(**config_args),
    )
    return response.text


def generate_ai_response(
    prompt: str,
    system_instruction: str = "",
    json_mode: bool = False,
    temperature: float = 0.3,
) -> str:
    last_error = None

    if openrouter_client:
        for model_name in OPENROUTER_FREE_MODELS:
            for attempt in range(2):
                try:
                    logger.info(f"Using OpenRouter free model: {model_name}")
                    return _call_openrouter(
                        model_name, prompt, system_instruction, json_mode, temperature
                    )
                except Exception as e:
                    last_error = e
                    error_str = str(e)
                    logger.warning(
                        f"OpenRouter model {model_name} (attempt {attempt + 1}/2) failed: {error_str}"
                    )
                    if "404" in error_str:
                        break
                    if "429" in error_str and attempt == 0:
                        time.sleep(2)
                    elif attempt == 0:
                        time.sleep(1)

    if gemini_client:
        for attempt in range(2):
            try:
                logger.info(f"Falling back to Gemini model: {GEMINI_FALLBACK_MODEL}")
                return _call_gemini(prompt, system_instruction, json_mode, temperature)
            except Exception as e:
                last_error = e
                logger.warning(f"Gemini fallback (attempt {attempt + 1}/2) failed: {e}")
                if attempt == 0:
                    time.sleep(1.5)

    raise last_error or RuntimeError("No LLM client configured or all models failed.")