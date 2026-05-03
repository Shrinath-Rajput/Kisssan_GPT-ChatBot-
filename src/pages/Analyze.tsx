import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeCropHealth } from "../../services/geminiService";
import { useAppContext } from "../context/AppContext";

export const Analyze: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAnalysisResult, contextData } = useAppContext();

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return alert("Upload image first");

    setLoading(true);

    const base64 = image.split(",")[1];

    const res = await analyzeCropHealth(base64, "English", contextData);

    setAnalysisResult(res);
    setLoading(false);

    navigate("/result");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">

        <h2 className="text-xl font-bold mb-4 text-center">
          Crop Health Analyzer 🌿
        </h2>

        {!image ? (
          <label className="border-2 border-dashed p-6 block text-center cursor-pointer">
            📷 Upload Image
            <input type="file" onChange={handleUpload} hidden />
          </label>
        ) : (
          <div>
            <img src={image} className="rounded mb-3" />
            <button
              className="text-red-500"
              onClick={() => setImage(null)}
            >
              Remove Image
            </button>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          className="w-full bg-green-600 text-white p-2 mt-4 rounded"
        >
          {loading ? "Analyzing..." : "Analyze Crop"}
        </button>
      </div>
    </div>
  );
};