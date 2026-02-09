import pypdf

try:
    reader = pypdf.PdfReader('assets/story.pdf')
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    print(text)
except Exception as e:
    print(f"Error reading PDF: {e}")
