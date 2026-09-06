"use client";

import axios from "axios";
import { useState } from "react";

interface CobaltFormat {
  url: string;
  filename: string;
  status: string;
}

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
      // Cobalt APIን በቀጥታ በመጥራት የዩቲዩብን የሰርቨር ክልከላ ይሰብራል
      const response = await axios.post('https://cobalt.tools', {
        url: videoUrl,
        videoQuality: "720", // Standard High Quality
        downloadMode: "auto"
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.url) {
        setDownloadLink(response.data.url);
      } else {
        setError("Could not generate a download link. Please try another video.");
      }
    } catch (err: any) {
      setError("Failed to process video. Cobalt server might be busy, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-slate-900 text-white">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center mt-8">VIDEO DOWNLOADER</h1>
        <p className="text-center text-gray-300">Fast Video & Shorts Downloader via Cobalt API</p>

        <form onSubmit={handleDownload} className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Paste your YouTube or Shorts link here..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full p-4 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 font-bold rounded transition-colors disabled:bg-slate-600"
          >
            {loading ? "⌛ Bypassing YouTube Restrictions..." : "🚀 Download Video"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center font-bold">{error}</p>}

        <div className="w-full mt-6 p-4 rounded bg-slate-800 border border-slate-700 min-h-[150px] flex flex-col items-center justify-center">
          {downloadLink ? (
            <div className="flex flex-col gap-4 w-full items-center">
              <h2 className="text-lg font-bold text-green-400 text-center">🎉 Video Successfully Processed!</h2>
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 bg-green-600 hover:bg-green-700 font-bold rounded text-center transition-colors text-white block text-lg"
              >
                📥 Save File to Device
              </a>
            </div>
          ) : (
            <p className="text-center text-gray-400">Your High-Quality Download link will appear here...</p>
          )}
        </div>
      </div>
    </main>
  );
}
