'use client'
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  const [ uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    // Create a temporary URL for the selected image
    const imageUrl = URL.createObjectURL(file);

    // Set the temporary URL as the source of the image
    setUploadedImage(imageUrl);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Make a POST request to the FastAPI endpoint
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      // Handle the response as needed
      if (response.ok) {
        console.log('Image uploaded successfully');
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error during image upload:', error);
    }
  };


  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      <div>
        <h2>Image Upload</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {/* Display the uploaded image */}
        {uploadedImage && (
          <div className="flex items-center justify-center">
          <div>
            <h3>Uploaded Image Preview</h3>
            <img
              src={uploadedImage}
              alt="Uploaded Preview"
              className="max-w-full h-auto max-h-96" 
            />
          </div>
        </div>
        )}
      </div>

    </>
  )
}

export default App
