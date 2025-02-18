import React, { useRef, useState } from "react";
import { Pause, Volume2, PlayCircle } from "lucide-react";

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
      <div className="absolute top-11 right-8 flex items-center space-x-2 bg-white/90 dark:bg-dark-700 backdrop-blur-sm rounded-lg px-3  shadow-lg">
        <button onClick={onPlayPause}>
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
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
          <div className="text-center p-8 text-gray-900 dark:text-white overflow-hidden rounded-t-xl">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedChapter?.title}
            </h1>
          </div>
          {selectedChapter?.content?.imgUrl && (
            <div className="relative h-[500px] flex items-center justify-center">
              <img
                src={selectedChapter?.content?.imgUrl}
                alt={selectedChapter?.title}
                className="w-full h-full object-contain"
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
        <div className="w-full flex flex-col lg:flex-row bg-white dark:bg-dark-800 rounded-t-xl shadow-sm">
          {/* Left Section: Chapter Details */}
          <div className="w-1/2 p-8 border-r border-gray-100 dark:border-dark-700 overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {selectedChapter?.title || "Chapter Title"}
            </h2>
            <div
              className="prose prose-blue max-w-none dark:prose-dark"
              dangerouslySetInnerHTML={{
                __html:
                  selectedChapter?.description ||
                  "<p>No content available.</p>",
              }}
            ></div>
          </div>

          {/* Right Section: Image & Media */}
          <div className="w-1/2 flex flex-col">
            <div className="relative flex-1 bg-gray-900 overflow-hidden flex items-center justify-center">
              <img
                src={selectedChapter?.content?.imgUrl || "/placeholder.jpg"}
                alt={selectedChapter?.title || "Media"}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between text-white">
                  {selectedChapter?.content?.audioUrl && (
                    <div className="absolute bottom-4 left-4 flex items-center space-x-4">
                      <audio
                        ref={audioRef}
                        src={selectedChapter?.content?.audioUrl || ""}
                      />
                      <button onClick={toggleAudio}>
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <PlayCircle className="w-6 h-6 text-white" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export default TemplateRenderer;
