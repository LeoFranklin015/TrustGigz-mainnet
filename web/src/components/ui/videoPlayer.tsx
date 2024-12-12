interface VideoPlayerProps {
  videoUrl: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  return (
    <div className="w-full max-w-3xl rounded-lg overflow-hidden shadow-lg">
      <video className="w-full" controls src={videoUrl}>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
