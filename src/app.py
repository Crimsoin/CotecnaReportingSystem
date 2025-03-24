# filepath: c:\Users\paulj\OneDrive\Desktop\Cotecna_Incident_System\src\app.py
from flask import Flask, render_template
from services.google_sheets_service import GoogleSheetsService

app = Flask(__name__)
sheets_service = GoogleSheetsService()

@app.route('/')
def index():
    data = sheets_service.get_data()
    return render_template('index.html', data=data)

if __name__ == '__main__':
    app.run(debug=True)