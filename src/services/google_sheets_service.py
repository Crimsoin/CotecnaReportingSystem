import os
import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class GoogleSheetsService:
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
        self.SERVICE_ACCOUNT_FILE = os.getenv('SERVICE_ACCOUNT_FILE')
        self.SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')  # Replace with your actual spreadsheet ID
        self.RANGE_NAME = 'Incident Reporting'  # Adjust the range as needed

        self.creds = service_account.Credentials.from_service_account_file(
            self.SERVICE_ACCOUNT_FILE, scopes=self.SCOPES)
        self.service = build('sheets', 'v4', credentials=self.creds)
        self.sheet = self.service.spreadsheets()

    def get_data(self):
        result = self.sheet.values().get(spreadsheetId=self.SPREADSHEET_ID,
                                         range=self.RANGE_NAME).execute()
        values = result.get('values', [])
        if not values:
            print('No data found.')
            return []
        else:
            df = pd.DataFrame(values[1:], columns=values[0])
            return df.to_dict(orient='records')