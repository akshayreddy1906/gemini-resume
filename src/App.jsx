import { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ProcessingResults } from './components/ProcessingResults';
import { Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [processing, setProcessing] = useState({
    isLoading: false,
    error: null,
    results: [],
  });

const processFile = useCallback(async () => {
    if (!file || !prompt) return;

    setProcessing((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      // Convert file to base64
      const fileContent = await file.arrayBuffer();
      const base64Data = btoa(
        new Uint8Array(fileContent).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        },
        { text: prompt },
      ]);

      const response = await result.response;
      const text = response.text();

      setProcessing((prev) => ({
        ...prev,
        isLoading: false,
        results: [
          {
            timestamp: new Date().toISOString(),
            content: text,
          },
          ...prev.results,
        ],
      }));
    } catch (error) {
      setProcessing((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
        results: [
          {
            timestamp: new Date().toISOString(),
            content: '',
            error:
              error instanceof Error
                ? error.message
                : 'An unknown error occurred',
          },
          ...prev.results,
        ],
      }));
    }
  }, [file, prompt]);


  return (
    <div className="app">
      <div className="container">
        <div className="content">
          <div className="upload-section">
            <FileUpload
              onFileSelect={setFile}
              disabled={processing.isLoading}
            />

            <div className="prompt-section">
              <label htmlFor="prompt" className="prompt-label">
                Custom Prompt
              </label>
              <textarea
                id="prompt"
                rows={4}
                className="prompt-input"
                placeholder="Enter your instructions for processing the file..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={processing.isLoading}
              />
            </div>

            <div className="button-section">
              <button
                onClick={processFile}
                disabled={!file || !prompt || processing.isLoading}
                className="process-button"
              >
                {processing.isLoading ? (
                  <>
                    <Loader2 className="spinner" />
                    Processing...
                  </>
                ) : (
                  'Process File'
                )}
              </button>
            </div>

            {file && (
              <div className="file-info">
                Selected file: {file.name}
              </div>
            )}
          </div>

          {processing.error && (
            <div className="error-message">
              {processing.error}
            </div>
          )}

          {processing.results.length > 0 && (
            <ProcessingResults results={processing.results} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;