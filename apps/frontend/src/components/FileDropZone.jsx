import React, { useRef } from "react";

export default function FileDropZone({ file, onFileChange, accept = ".pdf,image/*" }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFileChange(dropped);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="drop-zone"
      onClick={() => inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFileChange(e.target.files[0])}
      />
      {file ? (
        <div className="text-center">
          <p className="text-indigo-400 font-medium text-lg">📄 {file.name}</p>
          <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
          <p className="text-gray-600 text-xs mt-2">Click to replace</p>
        </div>
      ) : (
        <div>
          <p className="text-4xl mb-3">⬆️</p>
          <p className="text-gray-300 font-medium">Drop your certificate here</p>
          <p className="text-gray-500 text-sm mt-1">or click to browse</p>
          <p className="text-gray-600 text-xs mt-2">PDF, JPG, PNG, WEBP — max 10MB</p>
        </div>
      )}
    </div>
  );
}
