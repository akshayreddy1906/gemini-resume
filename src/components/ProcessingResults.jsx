import { Copy, Download } from 'lucide-react';
import './ProcessingResults.css';

export function ProcessingResults({ results }) {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const downloadResult = (result) => {
    const blob = new Blob([result.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `result-${result.timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="results-container">
      {results.map((result) => (
        <div key={result.timestamp} className="result-card">
          <div className="result-header">
            <span className="timestamp">
              {new Date(result.timestamp).toLocaleString()}
            </span>
            <div className="actions">
              <button
                onClick={() => copyToClipboard(result.content)}
                className="action-button"
                title="Copy to clipboard"
              >
                <Copy className="action-icon" />
              </button>
              <button
                onClick={() => downloadResult(result)}
                className="action-button"
                title="Download result"
              >
                <Download className="action-icon" />
              </button>
            </div>
          </div>
          {result.error ? (
            <div className="error-message">{result.error}</div>
          ) : (
            <pre className="result-content">{result.content}</pre>
          )}
        </div>
      ))}
    </div>
  );
} 