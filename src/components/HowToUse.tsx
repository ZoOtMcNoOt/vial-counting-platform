import React from 'react';
import Link from 'next/link';

const HowToUse: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        How to Use VialCount Pro
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Upload Tray Image:</strong> Click the "Choose File" button or drag and drop your tray image into the designated area to begin the upload process.
          </li>
          <li>
            <strong>Enter Expected Vial Count:</strong> Input the number of vials you anticipate in the tray to help the system accurately count and analyze the results.
          </li>
          <li>
            <strong>Submit for Processing:</strong> Click the "Submit" button to upload your image. The system will process the image and count the vials based on your input.
          </li>
          <li>
            <strong>Review Results:</strong> Once processing is complete, view the processed image alongside the counted vial details. You can approve the results or make adjustments if necessary.
          </li>
          <li>
            <strong>Download Processed Image:</strong> Click the "Download Processed Image" button to save the analyzed image and results to your device for future reference.
          </li>
        </ol>

        {/* Start Uploading Button */}
        <div className="mt-8 flex justify-center">
          <Link href="/upload" className="px-6 py-3 bg-green-700 text-white rounded-md hover:bg-green-800 focus:bg-green-800 dark:hover:text-white hover:text-white transition-colors duration-200">
              Start Uploading
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowToUse;