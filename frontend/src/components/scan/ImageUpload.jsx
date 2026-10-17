import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

export function ImageUpload({ onUpload }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const processFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setPreview(dataUrl);
        const base64 = dataUrl.split(',')[1];
        onUpload?.(base64, dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      processFile(file);
    },
    [processFile]
  );

  const handleChange = (e) => {
    processFile(e.target.files[0]);
  };

  const clearPreview = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-green-400 shadow-lg w-full">
          <img src={preview} alt="Uploaded food" className="w-full max-h-80 object-contain bg-gray-50" />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-lg font-medium">
            ✓ Ready
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={[
            'w-full rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer transition-all duration-150',
            dragOver
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-gray-50 hover:border-green-400 hover:bg-green-50',
          ].join(' ')}
        >
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
            {dragOver ? (
              <ImageIcon className="w-7 h-7 text-green-600" />
            ) : (
              <Upload className="w-7 h-7 text-green-600" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">
              {dragOver ? 'Drop it here!' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10 MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
