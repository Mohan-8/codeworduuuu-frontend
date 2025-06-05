import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CodewordApp = () => {
  const [encryptText, setEncryptText] = useState("");
  const [decryptText, setDecryptText] = useState("");
  const [algorithm, setAlgorithm] = useState("caesar");
  const [shift, setShift] = useState(3);
  const [xorKey, setXorKey] = useState(42);
  const [unlockTime, setUnlockTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const handleEncrypt = async () => {
    await handleAction("/encrypt", encryptText);
  };

  const handleDecrypt = async () => {
    await handleAction("/decrypt", decryptText);
  };

  const handleAction = async (action, text) => {
    try {
      let payload;
      let headers = {};

      if (algorithm === "steganography") {
        if (!imageFile) {
          setResult("Error: No image file selected.");
          return;
        }

        payload = new FormData();
        payload.append("algorithm", algorithm);
        payload.append("image", imageFile, imageFile.name);

        if (action === "/encrypt") {
          if (!text.trim()) {
            setResult("Error: Text is required for steganography encryption.");
            return;
          }
          payload.append("text", text.trim());
        }

        headers = {}; // FormData does not need JSON headers
      } else {
        if (!text.trim()) {
          setResult("Error: Text is required.");
          return;
        }

        payload = { text: text.trim(), algorithm };
        if (algorithm === "caesar") payload.shift = shift;
        if (algorithm === "xor") payload.key = xorKey;
        if (algorithm === "time-lock") {
          payload.unlockTime = new Date(unlockTime).getTime();
        }
        headers = { "Content-Type": "application/json" };
      }

      const response = await fetch(
        `https://codeworduuu.vercel.app/api${action}`,
        {
          method: "POST",
          headers: algorithm === "steganography" ? {} : headers,
          body:
            algorithm === "steganography" ? payload : JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error processing request");
      }

      const resultData = await response.json();
      setResult(resultData.encrypted || resultData.decrypted || "No output");

      // If the result is an image URL (for steganography), set it for download
      if (action === "/encrypt" && resultData.imageUrl) {
        setDownloadUrl(resultData.imageUrl);
      } else if (action === "/decrypt" && resultData.imageUrl) {
        setDownloadUrl(resultData.imageUrl);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setResult(`Error: ${error.message}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(result)
      .then(() => alert("Result copied to clipboard!"))
      .catch((err) => console.error("Failed to copy result:", err));
  };
  const downloadImage = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "encrypted_image.png"; // Change the file name as needed
      link.click();
    }
  };
  const handleClearInputs = () => {
    setEncryptText("");
    setDecryptText("");
    setResult("");
    setDownloadUrl("");
    setImageFile(null);
  };
  return (
    <div className="container text-center mt-3">
      <h1 className="mb-4">🔐 Codeword Emoji Encryption</h1>

      <div className="row">
        {/* Encryption Section */}
        <div className="col-md-6 bg-info p-4">
          <h2>Encryption</h2>
          <form>
            <label htmlFor="encryptText">Enter Text:</label>
            <input
              type="text"
              id="encryptText"
              className="form-control mt-2"
              value={encryptText}
              onChange={(e) => setEncryptText(e.target.value)}
              required
            />

            <label className="mt-3">Select Algorithm:</label>
            <select
              className="form-select mt-2"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="caesar">Caesar Cipher</option>
              <option value="substitution">Substitution Cipher</option>
              <option value="xor">XOR Encryption</option>
              <option value="morse">Morse Code</option>
              <option value="time-lock">Time-Locked Encryption</option>
              <option value="steganography">Steganography (Image)</option>
            </select>

            {algorithm === "caesar" && (
              <>
                <label className="mt-3">Shift Value:</label>
                <input
                  type="number"
                  className="form-control mt-2"
                  value={shift}
                  onChange={(e) => setShift(parseInt(e.target.value))}
                />
              </>
            )}

            {algorithm === "xor" && (
              <>
                <label className="mt-3">XOR Key:</label>
                <input
                  type="number"
                  className="form-control mt-2"
                  value={xorKey}
                  onChange={(e) => setXorKey(parseInt(e.target.value))}
                />
              </>
            )}

            {algorithm === "time-lock" && (
              <>
                <label className="mt-3">Unlock Date & Time:</label>
                <input
                  type="datetime-local"
                  className="form-control mt-2"
                  value={unlockTime}
                  onChange={(e) => setUnlockTime(e.target.value)}
                />
              </>
            )}

            {algorithm === "steganography" && (
              <>
                <label className="mt-3">Upload Image:</label>
                <input
                  type="file"
                  className="form-control mt-2"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </>
            )}

            <button
              type="button"
              className="btn btn-warning mt-3 text-light"
              onClick={handleEncrypt}
            >
              Encrypt 🔒
            </button>
          </form>
        </div>

        {/* Decryption Section */}
        <div className="col-md-6 bg-warning p-4">
          <h2>Decryption</h2>
          <form>
            <label htmlFor="decryptText">Enter Encrypted Text:</label>
            <input
              type="text"
              id="decryptText"
              className="form-control mt-2"
              value={decryptText}
              onChange={(e) => setDecryptText(e.target.value)}
              required
            />

            <label className="mt-3">Select Algorithm:</label>
            <select
              className="form-select mt-2"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="caesar">Caesar Cipher</option>
              <option value="substitution">Substitution Cipher</option>
              <option value="xor">XOR Encryption</option>
              <option value="morse">Morse Code</option>
              <option value="time-lock">Time-Locked Encryption</option>
              <option value="steganography">Steganography (Image)</option>
            </select>

            {algorithm === "caesar" && (
              <>
                <label className="mt-3">Shift Value:</label>
                <input
                  type="number"
                  className="form-control mt-2"
                  value={shift}
                  onChange={(e) => setShift(parseInt(e.target.value))}
                />
              </>
            )}

            {algorithm === "xor" && (
              <>
                <label className="mt-3">XOR Key:</label>
                <input
                  type="number"
                  className="form-control mt-2"
                  value={xorKey}
                  onChange={(e) => setXorKey(parseInt(e.target.value))}
                />
              </>
            )}
            {algorithm === "steganography" && (
              <>
                <label className="mt-3">Upload Image for Decryption:</label>
                <input
                  type="file"
                  className="form-control mt-2"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </>
            )}

            <button
              type="button"
              className="btn btn-info mt-3 text-light"
              onClick={handleDecrypt}
            >
              Decrypt 🔓
            </button>
          </form>
        </div>
      </div>

      {/* Result Section */}
      <div className="bg-success p-3 text-dark bg-opacity-25 mt-3">
        <h4>🔎 Result:</h4>
        <p className="fs-5">{result}</p>

        {/* Download Image Button */}
        {downloadUrl && (
          <button
            className="btn btn-primary text-light mt-3"
            onClick={downloadImage}
          >
            📥 Download Image
          </button>
        )}

        <button
          className="btn btn-success text-light mt-3"
          onClick={copyToClipboard}
        >
          📋 Copy Result
        </button>
        <button
          className="btn btn-danger text-light mt-3"
          onClick={handleClearInputs}
        >
          🧹 Clear Inputs
        </button>
      </div>
    </div>
  );
};

export default CodewordApp;
// ###
