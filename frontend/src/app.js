import React, { useState } from 'react';
import axios from 'axios';
import './app.css';  // Correct import with lowercase 'app.css'

const App = () => {
  const [url, setUrl] = useState('');
  const [wordData, setWordData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async () => {
    if (!url) {
      setError('Please enter a URL.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/fetch-word-frequency', { url });
      setWordData(response.data);
    } catch (err) {
      setError('Error fetching data from the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Word Frequency Analyzer</h1>
      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        placeholder="Enter URL"
        style={{ width: '300px' }}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Get Word Frequency'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {wordData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {wordData.map((word, index) => (
              <tr key={index}>
                <td>{word.word}</td>
                <td>{word.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
