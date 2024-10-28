import { useState } from 'react';
import axios from 'axios';

interface UploadFormProps {
  onResult: (data: any) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onResult }) => {
  const [image, setImage] = useState<File | null>(null);
  const [expectedCount, setExpectedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setError('Please upload an image.');
      return;
    }

    if (expectedCount <= 0) {
      setError('Please enter a valid expected count.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('expectedCount', expectedCount.toString());

      const response = await axios.post('/api/process-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onResult(response.data);
    } catch (err: any) {
      setError('An error occurred while processing the image.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Upload Tray Image</h2>
      <div>
        <label className="block text-gray-700 mb-2">Tray Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-red-700
                     hover:file:bg-blue-100
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Expected Vial Count:</label>
        <input
          type="number"
          value={expectedCount}
          onChange={(e) => setExpectedCount(parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition-all duration-200"
          placeholder="Enter expected count"
          min="1"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700
                   focus:outline-none focus:ring-2 focus:ring-red-500
                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
};

export default UploadForm;
