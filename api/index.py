<<<<<<< HEAD
import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AI_ENGINE_DIR = os.path.join(ROOT_DIR, "ai-engine")

for path in (AI_ENGINE_DIR, ROOT_DIR):
    if os.path.isdir(path) and path not in sys.path:
        sys.path.insert(0, path)

=======
import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AI_ENGINE_DIR = os.path.join(ROOT_DIR, "ai-engine")

for path in (AI_ENGINE_DIR, ROOT_DIR):
    if os.path.isdir(path) and path not in sys.path:
        sys.path.insert(0, path)

>>>>>>> 047a3959c0b9355b877065c973518c8cbefaa588
from main import app  # noqa: E402,F401