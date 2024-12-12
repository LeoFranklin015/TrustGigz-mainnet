"use client";

import { VideoUploader } from "@/components/ui/videoUpload";
import { VideoPlayer } from "@/components/ui/videoPlayer";
import { Button } from "@/components/ui/button";
import OpenAI from "openai";
import { useCallback, useState } from "react";

function Submission() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    dangerouslyAllowBrowser: true,
  });

  // Function to extract frames from a video
  const extractFrames = useCallback(
    async (file: File, numFrames = 5): Promise<string[]> => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject("Canvas context is not supported.");
          return;
        }

        const frames: string[] = [];
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const interval = video.duration / numFrames;
          let currentFrame = 0;

          const captureFrame = () => {
            if (currentFrame >= numFrames) {
              resolve(frames);
              return;
            }

            video.currentTime = currentFrame * interval;
            currentFrame++;
          };

          video.onseeked = () => {
            try {
              ctx.drawImage(video, 0, 0);
              frames.push(canvas.toDataURL("image/jpeg", 0.5));
              captureFrame();
            } catch (err) {
              reject(`Error capturing frame: ${err}`);
            }
          };

          captureFrame();
        };

        video.onerror = (error) => {
          reject(`Error loading video: ${error}`);
        };
      });
    },
    []
  );

  const analyzeVideo = useCallback(async (frames: string[]) => {
    try {
      // Convert data URLs to base64
      const base64Frames = frames.map((dataUrl) => ({
        type: "image_url",
        image_url: {
          url: dataUrl,
        },
      }));

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze these frames from a video and provide a detailed summary of what's happening. Include visual context, actions, and any important details you observe.",
              },
              ...base64Frames,
            ],
          },
        ],
        max_tokens: 500,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error analyzing video:", error);
      throw new Error("Failed to analyze video content");
    }
  }, []);

  const handleVideoSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoFile(file);
    setSummary("");
    setError("");
  }, []);

  const handleAnalyzeVideo = useCallback(async () => {
    if (!videoFile) {
      setError("Please upload a video first");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const frames = await extractFrames(videoFile);
      const summary = await analyzeVideo(frames);
      setSummary(summary || "No summary available");
    } catch (err) {
      setError("Failed to analyze video. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [videoFile, extractFrames]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Video Content Analyzer
          </h1>
          <p className="text-gray-600">
            Upload your video and get an AI-powered analysis of its content
          </p>
        </div>

        {!videoUrl && <VideoUploader onVideoSelect={handleVideoSelect} />}

        {videoUrl && (
          <div className="space-y-6">
            <VideoPlayer videoUrl={videoUrl} />

            <div className="flex justify-center">
              <Button
                onClick={handleAnalyzeVideo}
                disabled={isLoading}
                className="flex items-center gap-2 bg-black text-white"
              >
                {isLoading ? "Analyzing Video..." : "Analyze Content"}
              </Button>
            </div>

            {summary && (
              <div className="mt-4 p-4 bg-white rounded shadow">
                <h2 className="text-lg font-bold mb-2">Analysis Summary</h2>
                <p className="text-gray-800">{summary}</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Submission;
