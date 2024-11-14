import React from 'react';

const HowToUse: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        How to Use
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Upload Tray Image:</strong> Click on the "Choose File" button to select the tray image you want to process.
          </li>
          <li>
            <strong>Enter Expected Vial Count:</strong> Input the number of vials you expect to find in the tray.
          </li>
          <li>
            <strong>Submit for Processing:</strong> Click the "Submit" button to upload and process your image.
          </li>
          <li>
            <strong>View Results:</strong> Once processing is complete, you'll see the processed image along with the counted vial details.
          </li>
          <li>
            <strong>Download Processed Image:</strong> Click the "Download Processed Image" button to save the result to your device.
          </li>
        </ol>
      </div>
    </section>
  );
};

export default HowToUse;