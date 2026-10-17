import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

export function CameraCapture({ onCapture }) {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [error, setError] = useState(null);
  const [captured, setCaptured] = useState(null);

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setCaptured(screenshot);
        // Strip the data: prefix to get raw base64
        const base64 = screenshot.split(',')[1];
        onCapture?.(base64, screenshot);
      }
    }
  }, [onCapture]);

  const handleRetake = () => {
    setCaptured(null);
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (captured) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative rounded-2xl overflow-hidden border-2 border-green-400 shadow-lg">
          <img src={captured} alt="Captured food" className="max-w-full max-h-80 object-contain" />
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-lg font-medium">
            ✓ Captured
          </div>
        </div>
        <Button variant="secondary" onClick={handleRetake}>
          <RefreshCw className="w-4 h-4" />
          Retake Photo
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {error ? (
        <div className="w-full max-w-md rounded-2xl border-2 border-dashed border-red-200 bg-red-50 p-8 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-sm font-medium text-red-600">Camera not available</p>
          <p className="text-xs text-red-400">{error}</p>
          <p className="text-xs text-gray-500">Please use the Upload tab instead.</p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md bg-black w-full max-w-md">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.92}
            videoConstraints={{ facingMode }}
            onUserMediaError={(err) => setError(err.message || 'Camera access denied')}
            className="w-full"
          />
          {/* Viewfinder overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-52 h-52 border-2 border-white/60 rounded-xl" />
          </div>
          {/* Flip camera */}
          <button
            onClick={toggleCamera}
            className="absolute top-3 right-3 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {!error && (
        <Button variant="primary" size="lg" onClick={handleCapture}>
          <Camera className="w-5 h-5" />
          Capture Photo
        </Button>
      )}
    </div>
  );
}
