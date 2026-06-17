import os
import tempfile
import pypdf
import docx2txt
from fastapi import UploadFile, HTTPException

def extract_text_from_file(file: UploadFile) -> str:
    filename = file.filename or ""
    ext = filename.split(".")[-1].lower()
    try:
        if ext == "txt":
            return file.file.read().decode("utf-8")
        elif ext == "pdf":
            reader = pypdf.PdfReader(file.file)
            text = ""
            for page in reader.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"
            return text
        elif ext == "docx":
            with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
                tmp.write(file.file.read())
                tmp_path = tmp.name
            try:
                text = docx2txt.process(tmp_path)
            finally:
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
            return text
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or TXT.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text from file: {str(e)}")
