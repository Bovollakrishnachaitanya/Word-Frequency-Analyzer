from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from collections import Counter
import re
from flask_cors import CORS  # Importing CORS for cross-origin handling

app = Flask(__name__)
CORS(app)  # Enabling CORS for all routes

# Helper function to fetch words from the webpage
def get_word_frequencies(url):
    # Ensure the URL is properly formatted and valid
    if not url.startswith('http'):
        raise ValueError("Invalid URL. Please make sure the URL starts with 'http' or 'https'.")

    response = requests.get(url)
    
    # Check for valid HTTP response
    if response.status_code != 200:
        raise ValueError(f"Failed to fetch the URL, received status code: {response.status_code}")
    
    soup = BeautifulSoup(response.text, 'html.parser')
    text = soup.get_text()

    # Clean the text and split it into words
    words = re.findall(r'\w+', text.lower())  # Convert to lowercase and split by word
    word_count = Counter(words)
    
    # Get the top 10 frequent words
    most_common_words = word_count.most_common(10)
    return [{'word': word, 'frequency': freq} for word, freq in most_common_words]

@app.route('/fetch-word-frequency', methods=['POST'])
def fetch_word_frequency():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    try:
        word_frequencies = get_word_frequencies(url)
        return jsonify(word_frequencies)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
