import os
import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build

class GoogleSheetsService:
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
        self.SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), '..', 'config', 'service_account.json')
        self.SPREADSHEET_ID = '14hHqe54wx4dKcfig2v5-17zCxtBBoEypejfK1yemTJw'  # Replace with your actual spreadsheet ID
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