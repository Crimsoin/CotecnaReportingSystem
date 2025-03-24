# Google Sheets Dashboard

This project is a web application that retrieves data from Google Sheets and displays it on a custom dashboard. It is built using Flask and integrates with the Google Sheets API to fetch and display data dynamically.

## Project Structure

```
google-sheets-dashboard
├── src
│   ├── app.py                  # Entry point of the application
│   ├── templates
│   │   └── index.html          # HTML structure for the dashboard
│   ├── static
│   │   ├── css
│   │   │   └── styles.css      # CSS styles for the dashboard
│   │   └── js
│   │       └── scripts.js      # JavaScript for client-side functionality
│   ├── services
│   │   └── google_sheets_service.py  # Service for Google Sheets API interaction
│   └── utils
│       └── helpers.py          # Utility functions for the application
├── requirements.txt             # Project dependencies
└── README.md                    # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd google-sheets-dashboard
   ```

2. **Install dependencies:**
   It is recommended to use a virtual environment. You can create one using:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
   Then install the required packages:
   ```
   pip install -r requirements.txt
   ```

3. **Google Sheets API Setup:**
   - Create a project in the Google Cloud Console.
   - Enable the Google Sheets API.
   - Create credentials (OAuth 2.0 Client IDs) and download the JSON file.
   - Place the JSON file in the `src` directory and rename it to `credentials.json`.

4. **Run the application:**
   ```
   python src/app.py
   ```
   The application will be accessible at `http://127.0.0.1:5000`.

## Usage Guidelines

- Navigate to the dashboard in your web browser to view the data retrieved from Google Sheets.
- The dashboard will automatically update based on the data in the specified Google Sheet.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.