import React, { useRef, useState } from "react";
import { Pause, Volume2 } from "lucide-react";

interface ChapterContent {
  imgUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

interface SelectedChapter {
  title?: string;
  description?: string;
  template?: string;
  content?: ChapterContent;
}

interface TemplateRendererProps {
  selectedChapter: SelectedChapter;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  selectedChapter,
}) => {
  // Media control states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  interface AudioControlsProps {
    isPlaying?: boolean;
    onPlayPause?: () => void;
  }
  const AudioControls: React.FC<AudioControlsProps> = ({
    isPlaying,
    onPlayPause,
  }) => {
    return (
      <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/90 dark:bg-dark-700 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <button
          onClick={onPlayPause}
          className="text-blue-600 hover:text-blue-700 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        <span className="text-sm text-blue-600 font-medium">Audio</span>
      </div>
    );
  };
  const handlePlayPause = () => {
    if (audioRef.current) {
      // Ensure audioRef.current is not null
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      // Ensure audio is unmuted and can play
      audioRef.current.muted = false;
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    } else {
      audioRef.current.pause();
    }

    setIsPlaying(!isPlaying);
  };

  switch (selectedChapter?.template) {
    case "Image Bottom":
      return (
        <div className="min-h-[600px] relative">
          <div className="max-w-4xl mx-auto p-8 overflow-hidden rounded-t-xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedChapter?.title}
            </h1>
            <div className="prose prose-lg dark:prose-dark">
              {selectedChapter?.description}
            </div>
          </div>
          {selectedChapter?.content?.imgUrl && (
            <div className="relative h-96">
              <img
                src={selectedChapter?.content?.imgUrl}
                alt={selectedChapter?.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {selectedChapter?.content?.audioUrl && (
            <>
              <audio ref={audioRef} src={selectedChapter.content.audioUrl} />
              <AudioControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            </>
          )}
        </div>
      );

    case "Image Right, Content Left":
      return (
        <div className="flex flex-col lg:flex-row min-h-[600px] relative overflow-hidden rounded-t-xl">
          <div className="lg:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedChapter?.title}
            </h1>
            <div className="prose prose-lg dark:prose-dark">
              {selectedChapter?.description}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            {selectedChapter?.content?.imgUrl && (
              <img
                src={selectedChapter?.content?.imgUrl}
                alt={selectedChapter?.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {selectedChapter?.content?.audioUrl && (
            <>
              <audio ref={audioRef} src={selectedChapter.content.audioUrl} />
              <AudioControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            </>
          )}
        </div>
      );

    case "Image Top":
      return (
        <div className="min-h-[600px] relative overflow-hidden rounded-t-xl">
          {selectedChapter?.content?.imgUrl && (
            <div className="relative h-96">
              <img
                src={selectedChapter?.content?.imgUrl}
                alt={selectedChapter?.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedChapter?.title}
            </h1>
            <div className="prose prose-lg dark:prose-dark">
              {selectedChapter?.description}
            </div>
          </div>
          {selectedChapter?.content?.audioUrl && (
            <>
              <audio ref={audioRef} src={selectedChapter.content.audioUrl} />
              <AudioControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            </>
          )}
        </div>
      );

    case "Image Left, Content Right":
      return (
        <div className="flex flex-col lg:flex-row min-h-[600px] relative overflow-hidden rounded-t-xl">
          <div className="lg:w-1/2 relative">
            {selectedChapter?.content?.imgUrl && (
              <img
                src={selectedChapter?.content?.imgUrl}
                alt={selectedChapter?.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="lg:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedChapter?.title}
            </h1>
            <div className="prose prose-lg dark:prose-dark">
              {selectedChapter?.description}
            </div>
          </div>
          {selectedChapter?.content?.audioUrl && (
            <>
              <audio ref={audioRef} src={selectedChapter.content.audioUrl} />
              <AudioControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            </>
          )}
        </div>
      );

    case "Background Image with Card":
      return (
        <div className="relative min-h-[600px] overflow-hidden rounded-t-xl">
          {selectedChapter?.content?.imgUrl && (
            <img
              src={selectedChapter?.content?.imgUrl}
              alt={selectedChapter?.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 max-w-4xl mx-auto p-8">
            <div className="bg-white dark:bg-dark-700 rounded-xl shadow-xl p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {selectedChapter?.title}
              </h1>
              <div className="prose prose-lg dark:prose-dark">
                {selectedChapter?.description}
              </div>
            </div>
          </div>
          {selectedChapter?.content?.audioUrl && (
            <>
              <audio ref={audioRef} src={selectedChapter.content.audioUrl} />
              <AudioControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            </>
          )}
        </div>
      );

    case "Centered Header with Image":
      return (
        <div className="min-h-[600px] relative overflow-hidden rounded-t-xl">
          <div className="text-center p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden rounded-t-xl">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedChapter?.title}
            </h1>
          </div>
          {selectedChapter?.content?.imgUrl && (
            <div className="relative h-96">
              <img
                src={selectedChapter?.content?.imgUrl}
                alt={selectedChapter?.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="max-w-4xl mx-auto p-8">
            <div className="prose prose-lg dark:prose-dark">
              {selectedChapter?.description}
            </div>
          </div>
          {selectedChapter?.content?.audioUrl && (
            <>
              <audio ref={audioRef} src={selectedChapter.content.audioUrl} />
              <AudioControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            </>
          )}
        </div>
      );

    default:
      return (
        <div className="w-1/2 flex flex-col rounded-r-xl">
          <p className="text-gray-500 dark:text-gray-300 p-8">
            Template not found
          </p>
        </div>
      );
  }
};

export default TemplateRenderer;
