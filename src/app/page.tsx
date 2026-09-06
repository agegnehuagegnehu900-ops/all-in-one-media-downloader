"use client";

import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;
    
    setLoading(true);
    setError("");
    setDownloadLink(null);

    try {
      // ይህ አምራች አወቃቀር ማንኛውንም የቪዲዮ ሊንክ (FB, TikTok, YT) በራሱ ይለያል
      const response = await axios.post('/api/cobalt', { url: videoUrl });

      if (response.data && response.data.url) {
        setDownloadLink(response.data.url);
      } else {
        setError("Could not extract media. Please make sure the post is public.");
      }
    } catch (err: any) {
      setError("Server response error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-slate-900 text-white">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center mt-8">ALL-IN-ONE DOWNLOADER</h1>
        <p className="text-center text-gray-400 text-xs">Supports YouTube, TikTok, Facebook, Instagram & more</p>

        <form onSubmit={handleDownload} className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Paste your video link here..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full p-4 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-center"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 font-bold rounded transition-colors disabled:bg-slate-600"
          >
            {loading ? "⌛ Downloading from Server..." : "🚀 Download Media"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center font-bold text-xs">{error}</p>}

        <div className="w-full mt-6 p-4 rounded bg-slate-800 border border-slate-700 min-h-[150px] flex flex-col items-center justify-center">
          {downloadLink ? (
            <div className="flex flex-col gap-4 w-full items-center">
              <h2 className="text-md font-bold text-green-400 text-center">🎉 Media Ready!</h2>
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 bg-green-600 hover:bg-green-700 font-bold rounded text-center transition-colors text-white block text-lg animate-bounce"
              >
                📥 Save File to Device
              </a>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-xs">Pasted links will auto-extract high quality downloads here.</p>
          )}
        </div>
      </div>
    </main>
  );
}
