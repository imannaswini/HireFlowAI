from fastapi import UploadFile
from app.core.file_parser import extract_text_from_file

class ParserService:
    def extract_text(self, file: UploadFile) -> str:
        return extract_text_from_file(file)

parser_service = ParserService()
