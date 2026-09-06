"use client";

import axios from "axios";
import { useState } from "react";

interface VideoDetails {
  title: string;
  lengthSeconds: string;
  thumbnail: string;
  formats: {
    container: string;
    quality: string;
    url: string;
    itag: number;
  }[];
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;
    
    setLoading(true);
    setError("");
    setVideoDetails(null);

    try {
      const response = await axios.get(`/api/download/${platform}?videoUrl=${encodeURIComponent(videoUrl)}`);
      setVideoDetails(response.data);
    } catch (err: any) {
      setError(err.response?.data || "Failed to fetch video details. Please check the link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-slate-900 text-white">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center mt-8">VIDEO DOWNLOADER</h1>
        <p className="text-center text-gray-300">Paste the Url to download High Quality Videos</p>

        <div className="flex gap-2 w-full justify-center">
          <button 
            type="button"
            onClick={() => setPlatform("youtube")} 
            className={`px-4 py-2 rounded ${platform === "youtube" ? "bg-red-600 font-bold" : "bg-slate-700"}`}
          >
            🔴 Youtube
          </button>
          <button 
            type="button"
            onClick={() => setPlatform("facebook")} 
            className={`px-4 py-2 rounded ${platform === "facebook" ? "bg-blue-600 font-bold" : "bg-slate-700"}`}
          >
            🔵 Facebook
          </button>
        </div>

        <form onSubmit={handleDownload} className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Paste your video link here..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full p-4 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 font-bold rounded transition-colors disabled:bg-slate-600"
          >
            {loading ? "⌛ Loading Video Details..." : "🚀 Download Video"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center font-bold">{error}</p>}

        <div className="w-full mt-6 p-4 rounded bg-slate-800 border border-slate-700 min-h-[150px]">
          {videoDetails ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold line-clamp-2">{videoDetails.title}</h2>
              <p className="text-gray-400">Duration: {videoDetails.lengthSeconds} seconds</p>
              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto mt-2">
                {videoDetails.formats?.map((format, index) => (
                  <a
                    key={index}
                    href={format.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center p-3 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-xs"
                  >
                    <span className="font-bold uppercase">{format.container || "mp4"}</span>
                    <span className="bg-green-600 px-2 py-1 rounded text-white">{format.quality || "Unknown"}</span>
                    <span className="underline text-blue-400 font-bold">Get Link 📥</span>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-8">Your Video Details will appear here...</p>
          )}
        </div>
      </div>
    </main>
  );
}
