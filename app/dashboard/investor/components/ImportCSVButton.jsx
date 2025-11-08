"use client";
import { useRef } from "react";
import Papa from "papaparse";
import axios from "axios";

export default function ImportButton({ onUploadSuccess }) {
  const fileRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const { data } = await axios.post("/api/portfolio", {
            holdings: results.data,
          });
          onUploadSuccess(data.holdings);
          alert("Portfolio imported successfully!");
        } catch (err) {
          console.error(err);
          alert("Error uploading portfolio");
        }
      },
    });
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileRef}
        onChange={handleFileChange}
        hidden
      />
      <button
        onClick={() => fileRef.current.click()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Import Stocks
      </button>
    </>
  );
}
