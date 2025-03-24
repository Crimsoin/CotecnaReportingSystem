def format_data(data):
    # Function to format data retrieved from Google Sheets
    formatted_data = []
    for row in data:
        formatted_row = {key: value for key, value in zip(data[0], row)}
        formatted_data.append(formatted_row)
    return formatted_data

def handle_error(error):
    # Function to handle errors and return a user-friendly message
    return {"error": str(error)}