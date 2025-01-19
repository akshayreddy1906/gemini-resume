import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import './FileUpload.css';

export function FileUpload({ onFileSelect, disabled = false }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    disabled,
    maxSize: 10485760, // 10MB
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="upload-icon" />
      <p className="dropzone-text">
        {isDragActive ? 'Drop the file here' : "Drag 'n' drop a file here, or click to select"}
      </p>
      <p className="dropzone-hint">
        Supported formats: TXT, PDF, DOC, DOCX (Max 10MB)
      </p>
    </div>
  );
} 