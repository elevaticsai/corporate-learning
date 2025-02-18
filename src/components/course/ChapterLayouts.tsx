import React, { useRef, useState } from 'react';
import { Layout, Eye, Volume2, Play, Image as ImageIcon, Pause, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

export type ChapterLayout = {
  id: string;
  name: string;
  description: string;
  preview: string;
};

export const chapterLayouts: ChapterLayout[] = [
  {
    id: 'layout1',
    name: 'Image Left, Content Right',
    description: 'Image on the left side with title and content on the right',
    preview: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'layout2',
    name: 'Image Right, Content Left',
    description: 'Image on the right side with title and content on the left',
    preview: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'layout3',
    name: 'Background Image with Card',
    description: 'Full background image with content in a white card overlay',
    preview: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'layout4',
    name: 'Centered Header with Image',
    description: 'Centered heading with full-width image and content below',
    preview: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'layout5',
    name: 'Image Top',
    description: 'Full-width image at the top with content below',
    preview: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'layout6',
    name: 'Image Bottom',
    description: 'Content at the top with full-width image below',
    preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60'
  }
];

interface ChapterLayoutSelectorProps {
  selectedLayout: string;
  onLayoutSelect: (layoutId: string) => void;
  layoutImage: string;
  layoutAudio: string;
}

export const ChapterLayoutSelector: React.FC<ChapterLayoutSelectorProps> = ({
  selectedLayout,
  onLayoutSelect,
  layoutImage,
  layoutAudio
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [previewLayout, setPreviewLayout] = useState<string | null>(null);
  
  const layoutsPerPage = 3;
  const totalPages = Math.ceil(chapterLayouts.length / layoutsPerPage);
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handlePreviewClick = (e: React.MouseEvent, layoutId: string) => {
    e.stopPropagation(); // Prevent the parent button click
    setPreviewLayout(layoutId);
  };

  const currentLayouts = chapterLayouts.slice(
    currentPage * layoutsPerPage,
    (currentPage + 1) * layoutsPerPage
  );

  const selectedLayoutData = chapterLayouts.find(l => l.id === selectedLayout);

  return (
    <div className="space-y-6">
      {/* Dropdown Layout Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Layout className="w-5 h-5 text-gray-500" />
            <span className="text-gray-900 dark:text-white">
              {selectedLayoutData ? selectedLayoutData.name : 'Select a layout'}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-lg">
            {chapterLayouts.map((layout) => (
              <div
                key={layout.id}
                className={`w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center justify-between group ${
                  selectedLayout === layout.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                }`}
              >
                <button
                  onClick={() => {
                    onLayoutSelect(layout.name);
                    setIsDropdownOpen(false);
                  }}
                  className="flex-1 flex items-center space-x-3 text-left"
                >
                  <Layout className={`w-5 h-5 ${selectedLayout === layout.id ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div>
                    <p className={`font-medium ${selectedLayout === layout.id ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                      {layout.name}
                    </p>
                    <p className="text-sm text-gray-500">{layout.description}</p>
                  </div>
                </button>
                <button
                  onClick={(e) => handlePreviewClick(e, layout.id)}
                  className="p-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Layout Previews with Pagination */}
      <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Layout Preview</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentLayouts.map((layout) => (
            <div
              key={layout.id}
              className={`relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                selectedLayout === layout.id
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                  : 'border-gray-200 dark:border-dark-700 hover:border-blue-200'
              }`}
              onClick={() => onLayoutSelect(layout.name)}
            >
              <div className="aspect-video relative">
                <img
                  src={layout.preview}
                  alt={layout.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Layout className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white">{layout.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{layout.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Preview Modal */}
      {previewLayout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-dark-800 p-4 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Preview: {chapterLayouts.find(l => l.id === previewLayout)?.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewLayout(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <ChapterContent
                layout={previewLayout}
                title="Sample Chapter Title"
                content="This is a preview of how your content will look with this layout. The actual content will be replaced with your chapter content."
                // image={chapterLayouts.find(l => l.id === previewLayout)?.preview}
                // audio={true}
                image={layoutImage}
                audio={layoutAudio}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface AudioControlsProps {
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({ isPlaying, onPlayPause }) => {
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

interface ChapterContentProps {
  layout: string;
  title: string;
  content: string;
  image?: string;
  video?: string;
  audio?: boolean;
}

export const ChapterContent: React.FC<ChapterContentProps> = ({
  layout,
  title,
  content,
  image,
  video,
  audio
}) => {

    const audioRef = useRef(null);
  
  console.log(audio, "audio link")
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderLayout = () => {
    switch (layout) {
      case 'layout1':
        return (
          <div className="flex flex-col lg:flex-row min-h-[600px] relative">
            <div className="lg:w-1/2 relative">
              {image && (
                <img src={image} alt={title} className="w-full h-full object-cover" />
              )}
              {video && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <div className="lg:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
              <div className="prose prose-lg dark:prose-dark">{content}</div>
            </div>
            <audio ref={audioRef} src={audio} />
            {audio && (
              <AudioControls isPlaying={isPlaying} onPlayPause={togglePlay} />
            )}
          </div>
        );

      case 'layout2':
        return (
          <div className="flex flex-col lg:flex-row min-h-[600px] relative">
            <div className="lg:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
              <div className="prose prose-lg dark:prose-dark">{content}</div>
            </div>
            <div className="lg:w-1/2 relative">
              {image && (
                <img src={image} alt={title} className="w-full h-full object-cover" />
              )}
              {video && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <audio ref={audioRef} src={audio} />
            {audio && (
              <AudioControls isPlaying={isPlaying} onPlayPause={togglePlay} />
            )}
          </div>
        );

      case 'layout3':
        return (
          <div className="relative min-h-[600px]">
            {image && (
              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 max-w-4xl mx-auto p-8">
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
                <div className="prose prose-lg dark:prose-dark">{content}</div>
              </div>
            </div>
            <audio ref={audioRef} src={audio} />
            {audio && (
              <AudioControls isPlaying={isPlaying} onPlayPause={togglePlay} />
            )}
          </div>
        );

      case 'layout4':
        return (
          <div className="min-h-[600px] relative">
            <div className="text-center p-8 bg-gray-900 text-white">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
            </div>
            {image && (
              <div className="relative h-96">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                {video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
            )}
            <div className="max-w-4xl mx-auto p-8">
              <div className="prose prose-lg dark:prose-dark">{content}</div>
            </div>
            <audio ref={audioRef} src={audio} />
            {audio && (
              <AudioControls isPlaying={isPlaying} onPlayPause={togglePlay} />
            )}
          </div>
        );

      case 'layout5':
        return (
          <div className="min-h-[600px] relative">
            {image && (
              <div className="relative h-96">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                {video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
            )}
            <div className="max-w-4xl mx-auto p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
              <div className="prose prose-lg dark:prose-dark">{content}</div>
            </div>
            <audio ref={audioRef} src={audio} />
            {audio && (
              <AudioControls isPlaying={isPlaying} onPlayPause={togglePlay} />
            )}
          </div>
        );

      case 'layout6':
        return (
          <div className="min-h-[600px] relative">
            <div className="max-w-4xl mx-auto p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
              <div className="prose prose-lg dark:prose-dark">{content}</div>
            </div>
            {image && (
              <div className="relative h-96">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                {video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
            )}
            <audio ref={audioRef} src={audio} />
            {audio && (
              <AudioControls isPlaying={isPlaying} onPlayPause={togglePlay} />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden">
      {renderLayout()}
    </div>
  );
};

interface ChapterPreviewProps {
  layout: string;
  onClose: () => void;
}

export const ChapterPreview: React.FC<ChapterPreviewProps> = ({ layout, onClose, layoutImage, layoutAudio }) => {
  console.log(layoutImage, "layout image")
  const selectedLayout = chapterLayouts.find(l => l.name === layout);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-dark-800 p-4 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Preview: {selectedLayout?.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <ChapterContent
            layout={selectedLayout?.id}
            title="Sample Chapter Title"
            content="This is a preview of how your content will look with this layout. The actual content will be replaced with your chapter content."
            // image={selectedLayout?.preview}
            image={layoutImage}
            audio={layoutAudio}
          />
        </div>
      </div>
    </div>
  );
};
