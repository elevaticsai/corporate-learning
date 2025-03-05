import React, { useState, useRef, useEffect } from "react";
import {
  Trash2,
  Upload,
  X,
  Edit,
  Layout,
  Pen,
  Sparkles,
  SpellCheck,
  BookOpen,
  Wand2,
  Volume2,
} from "lucide-react";
//@ts-ignore
import { uploadImage } from "../../utils/api.js";
import { ChapterLayoutSelector, ChapterPreview } from "./ChapterLayouts";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { marked } from "marked";
import { getWritingPrompt, WritingPromptKey } from "../../utils/prompts.js";
import { LLMClient } from "../../services/llm-api-client.js";
import { MdContentCopy, MdOutlineReplay } from "react-icons/md";
import ImageSelectionModal from '../common/ImageSelectionModal';
import toast, { Toaster } from "react-hot-toast";

const ChapterCreation = ({ chapters, onUpdate }: any) => {
  const [newChapter, setNewChapter] = useState({
    title: "",
    content: "",
    duration: "",
    image: "",
    audio: "",
    layout: "",
  });

  const [editingChapterId, setEditingChapterId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const quillRef = useRef<ReactQuill & { getEditor: () => any }>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    top: number;
    left: number;
  }>({ visible: false, top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState<string>("");
  //@ts-ignore
  const [selectedRange, setSelectedRange] = useState<any>(null);
  const [modal, setModal] = useState<{
    visible: boolean;
    content: string;
    top: number;
    left: number;
  }>({ visible: false, content: "", top: 0, left: 0 });
  const [lastAction, setLastAction] = useState<WritingPromptKey | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const normalizedChapters = chapters.map((chapter: any) => ({
    ...chapter,
    content: chapter.content || {
      imgUrl: chapter.image || "",
      audioUrl: chapter.audio || "",
    },
  }));

  const handleAddOrUpdateChapter = () => {
    if (newChapter.title && newChapter.content && newChapter.layout) {
      if (editingChapterId !== null) {
        onUpdate(
          normalizedChapters.map((chapter: any) =>
            chapter.id === editingChapterId
              ? {
                  ...chapter,
                  title: newChapter.title,
                  description: newChapter.content,
                  duration: newChapter.duration,
                  content: {
                    imgUrl: newChapter.image || "",
                    audioUrl: newChapter.audio || "",
                  },
                  layout: newChapter.layout
                    ? newChapter.layout
                    : //@ts-ignore
                      newChapter.template,
                }
              : chapter
          )
        );
        setEditingChapterId(null);
      } else {
        onUpdate([
          ...normalizedChapters,
          {
            id: Date.now(),
            title: newChapter.title,
            description: newChapter.content,
            duration: newChapter.duration,
            content: {
              imgUrl: newChapter.image || "",
              audioUrl: newChapter.audio || "",
            },
            //@ts-ignore
            layout: newChapter.layout ? newChapter.layout : newChapter.template, // Add layout
          },
        ]);
      }
      setNewChapter({
        title: "",
        content: "",
        duration: "",
        image: "",
        audio: "",
        layout: "", // Reset layout
      });
    } else {
      alert("Please fill in all required fields and select a layout");
    }
  };

  const handleRemoveChapter = (id: any) => {
    onUpdate(normalizedChapters.filter((chapter: any) => chapter.id !== id));
    if (editingChapterId === id) {
      setEditingChapterId(null);
      setNewChapter({
        title: "",
        content: "",
        duration: "",
        image: "",
        audio: "",
        layout: "",
      });
    }
  };

  const handleEditChapter = (id: any) => {
    const chapterToEdit = normalizedChapters.find(
      (chapter: any) => chapter.id === id
    );
    if (chapterToEdit) {
      setEditingChapterId(id);
      setNewChapter({
        title: chapterToEdit.title,
        content: chapterToEdit.description || "",
        duration: chapterToEdit.duration || "",
        image: chapterToEdit.content?.imgUrl || "",
        audio: chapterToEdit.content?.audioUrl || "",
        layout: chapterToEdit.template || "", // Set layout
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingChapterId(null);
    setNewChapter({
      title: "",
      content: "",
      duration: "",
      image: "",
      audio: "",
      layout: "", // Reset layout
    });
  };

  const handleImageChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setLoading(true);
      try {
        const uploadResponse = await uploadImage(file);
        setNewChapter((prev) => ({
          ...prev,
          image: uploadResponse.fileUrl,
        }));
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Image upload failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAudioChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Audio file size should be less than 10MB");
        return;
      }
      setLoading2(true);
      try {
        const uploadResponse = await uploadImage(file);
        setNewChapter((prev) => ({
          ...prev,
          audio: uploadResponse.fileUrl,
        }));
      } catch (error) {
        alert("Audio upload failed");
      } finally {
        setLoading2(false);
      }
    }
  };

  const handleGenerateImage = async (page = 1) => {
    if (!imagePrompt.trim()) {
      toast.error("Please enter a prompt for image generation");
      return;
    }

    setIsGenerating(true);
    try {
      // Ensure page is a number
      const pageNumber = Number(page) || 1;
      
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(imagePrompt)}&per_page=9&page=${pageNumber}`,
        {
          headers: {
            Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const newImages = data.results.map((result: any) => result.urls.regular);
      
      // Update images based on page number
      if (pageNumber === 1) {
        setGeneratedImages(newImages);
      } else {
        setGeneratedImages(prev => [...prev, ...newImages]);
      }
      
      setIsModalOpen(true);
      setCurrentPage(pageNumber);
      
      // Fix hasMore calculation
      const hasMorePages = pageNumber < data.total_pages;
      setHasMore(hasMorePages);
    } catch (error) {
      toast.error("Failed to generate images. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadMore = () => {
    // Ensure we pass the next page number
    const nextPage = currentPage + 1;
    handleGenerateImage(nextPage);
  };

  const handleImageSelect = async (imageUrl: string) => {
    // Show selection toast first
    toast.success('Image selected! Starting upload...', {
      duration: 2000,
      //@ts-ignore
      position: 'top-center',
      style: {
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '300px',
      },
    });
    
    // Close modal immediately after selection
    setIsModalOpen(false);
    
    setLoading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });
      
      if (imageInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        //@ts-ignore
        imageInputRef.current.files = dataTransfer.files;
      }

      // Upload the image
      const uploadResponse = await uploadImage(file);
      setNewChapter((prev) => ({
        ...prev,
        image: uploadResponse.fileUrl,
      }));
      setImagePrompt("");
      
      toast.success('Image uploaded successfully!', {
        duration: 3000,
        //@ts-ignore
        position: 'top-center',
        style: {
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center',
          minWidth: '300px',
        },
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image. Please try again.', {
        duration: 3000,
        //@ts-ignore
        position: 'top-center',
        style: {
          backgroundColor: '#f44336',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center',
          minWidth: '300px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAudio = () => {
    setNewChapter((prev) => ({
      ...prev,
      audio: "",
    }));
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      const selectedContent = selection.toString().trim();
      setSelectedText(selectedContent);

      // Get the editor's container
      const editorContainer = event.currentTarget;
      const editorRect = editorContainer.getBoundingClientRect();

      // Calculate the position relative to the editor's container
      const top = event.clientY - editorRect.top + editorContainer.scrollTop;
      const left = event.clientX - editorRect.left + editorContainer.scrollLeft;

      setContextMenu({
        visible: true,
        top,
        left,
      });

      // Store the Quill selection range
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        if (range && range.length > 0) {
          setSelectedRange(range);
        }
      }
    }
  };

  const handleActionSelect = async (action: WritingPromptKey) => {
    setContextMenu({ ...contextMenu, visible: false });
    if (!selectedText) return;
    setLastAction(action);
    try {
      await handleOptionClick(action);
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  const removeMarkdownDelimiters = (text: string) => {
    // Remove ```markdown from the beginning
    text = text.replace(/^```markdown\s*/, "");
    // Remove ``` from the end
    text = text.replace(/```$/, "");
    return text.trim();
  };

  const formatResponse = async (text: string): Promise<string> => {
    // const cleanedText: string = cleanMarkdownOutput(text);
    const planeText = removeMarkdownDelimiters(text);
    const markedText: string = await marked.parse(planeText);
    // console.log("text is => ", markedText);
    return markedText;
    // return DOMPurify.sanitize(markedText);
  };

  const handleOptionClick = async (promptKey: WritingPromptKey) => {
    try {
      const { prompt, systemMessage } = getWritingPrompt(
        promptKey,
        selectedText
      );

      let response = "";
      const client = new LLMClient();

      for await (const chunk of client.streamResponse(prompt, systemMessage)) {
        response += chunk;
        const formattedResponse: string = await formatResponse(response);
        setModal({
          visible: true,
          content: formattedResponse,
          top: contextMenu.top,
          left: contextMenu.left,
        });
      }
    } catch (error) {
      console.error("Error details:", error);
    }
  };

  const insertResponse = () => {
    const quillInstance = quillRef.current?.getEditor();
    if (!quillInstance || !modal.content) return;

    try {
      if (selectedRange) {
        // Delete the selected text
        quillInstance.deleteText(selectedRange.index, selectedRange.length);

        // Insert the HTML content at the selection point
        quillInstance.clipboard.dangerouslyPasteHTML(
          selectedRange.index,
          modal.content
        );

        // Get the length of the inserted content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = modal.content;
        const insertedLength = quillInstance.getText(
          selectedRange.index,
          tempDiv.textContent?.length || 0
        ).length;

        // Apply red color to the inserted text
        quillInstance.formatText(selectedRange.index, insertedLength);

        // Move cursor to end of inserted text
        quillInstance.setSelection(selectedRange.index + insertedLength, 0);
      } else {
        // If no selection, insert at the end
        const length = quillInstance.getLength();
        quillInstance.clipboard.dangerouslyPasteHTML(length, modal.content);
      }
    } catch (e) {
      console.warn("Error replacing selected text:", e);
    }
    setModal((prevState) => ({ ...prevState, visible: false }));
    setSelectedRange(null);
  };

  const retryResponse = async () => {
    if (!lastAction || !selectedText) return;

    try {
      await handleOptionClick(lastAction);
    } catch (error) {
      console.error("Error retrying action:", error);
    }
  };

  const cancelResponse = () => {
    setModal((prevState) => ({ ...prevState, visible: false }));
  };

  const handleCopy = () => {
    const contentContainer = document.getElementById("content-container");
    if (contentContainer) {
      const range = document.createRange();
      range.selectNode(contentContainer);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);

        try {
          const clipboardItem = new ClipboardItem({
            "text/html": new Blob([contentContainer.innerHTML], {
              type: "text/html",
            }),
            "text/plain": new Blob([contentContainer.innerText], {
              type: "text/plain",
            }),
          });
          navigator.clipboard.write([clipboardItem]).then(() => {
            selection.removeAllRanges();
          });
        } catch (err) {
          document.execCommand("copy");
          selection.removeAllRanges();
        }
      }
    }
  };

  const handleLayoutSelect = (layoutName: any) => {
    setNewChapter((prev) => ({
      ...prev,
      layout: layoutName,
    }));
    setShowLayoutSelector(false);
  };

  // Function to strip HTML tags and decode HTML entities
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const convertTextToSpeech = async (text: string) => {
    if (!text) {
      alert("Please enter some text to convert to speech");
      return;
    }

    setIsConverting(true);
    try {
      const cleanText = stripHtml(text);
      
      const params = new URLSearchParams({
        text: cleanText,
        voice: "en-GB-SoniaNeural",
      });

      const response = await fetch(
        `https://audio-api.elevatics.cloud/tts?${params.toString()}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to convert text to speech");
      }

      // The API returns audio/mpeg data directly
      const audioBlob = await response.blob();
      const audioFile = new File([audioBlob], "speech.mp3", {
        type: "audio/mpeg",
      });

      const uploadResponse = await uploadImage(audioFile);
      setNewChapter((prev) => ({
        ...prev,
        audio: uploadResponse.fileUrl,
      }));
    } catch (error) {
      console.error("Error converting text to speech:", error);
      alert("Failed to convert text to speech. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click is on a button
      if (target.tagName === "BUTTON") {
        return;
      }

      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
      // Ensure it doesn't close when clicking inside the context menu or modal
      if (target.closest("#ai-response-modal")) {
        return;
      }

      setModal((prevState) => ({ ...prevState, visible: false }));
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu, modal]);

  return (
    <div className="space-y-15">
      <Toaster position="top-center" />
      <div className="bg-gray-50 dark:bg-dark-800 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {editingChapterId ? "Edit Chapter" : "Add New Chapter"}
        </h3>
        <div className="space-y-14">
          <input
            type="text"
            value={newChapter.title}
            onChange={(e) =>
              setNewChapter({ ...newChapter, title: e.target.value })
            }
            placeholder="Chapter Title"
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
          />
          <div onContextMenu={handleContextMenu}>
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chapter Content
            </label>
            <ReactQuill
              style={{
                marginTop: "20px",
                marginBottom: "10px",
                height: "200px",
              }}
              value={newChapter.content}
              onChange={(value) =>
                setNewChapter({ ...newChapter, content: value })
              }
              theme="snow"
              className="w-full border-gray-300 dark:border-dark-700 rounded-lg  dark:bg-dark-800 text-gray-900 dark:text-white"
              ref={quillRef}
              //@ts-ignore
              onContextMenu={handleContextMenu}
            />
            {contextMenu.visible && (
              <div
                className="dark:bg-[#1e293b] bg-white"
                style={{
                  position: "absolute",
                  top: contextMenu.top + 400,
                  left: contextMenu.left + 300,
                  zIndex: 100,
                  borderRadius: "15px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex flex-col">
                  <button
                    className="px-4 py-2 text-left flex items-center"
                    onClick={() => handleActionSelect("explain")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explain
                  </button>
                  <button
                    className="px-4 py-2 text-left flex items-center"
                    onClick={() => handleActionSelect("improve")}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Improve Writing
                  </button>
                  <button
                    className="px-4 py-2 text-left flex items-center"
                    onClick={() => handleActionSelect("grammar")}
                  >
                    <SpellCheck className="w-4 h-4 mr-2" />
                    Fix Grammar
                  </button>
                  <button
                    className="px-4 py-2 text-left flex items-center"
                    onClick={() => handleActionSelect("concise")}
                  >
                    <Pen className="w-4 h-4 mr-2" />
                    Make Concise
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                Chapter Image
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Enter prompt to generate image..."
                    className="w-full px-4 py-3 border border-gray-200 dark:bg-dark-800 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
                  />
                  <button
                    type="button"
                    //@ts-ignore
                    onClick={handleGenerateImage}
                    disabled={isGenerating}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-solid"></div>
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    Generate
                  </button>
                </div>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-dark-700 border-dashed rounded-lg relative bg-white dark:bg-dark-800">
                  {newChapter.image ? (
                    <div className="relative w-full max-w-xs">
                      <div className="aspect-w-16 h-[200px]">
                        <img
                          src={newChapter.image}
                          alt="Chapter preview"
                          className="object-cover rounded-lg w-full h-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setNewChapter((prev) => ({ ...prev, image: "" }))
                        }
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {loading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 text-sm mb-4" />
                          <div className="flex items-center gap-1 mb-1">
                            <button
                              //@ts-ignore
                              onClick={() => imageInputRef.current?.click()}
                              className="relative cursor-pointer text-sm bg-white dark:bg-dark-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              Upload a file
                            </button>
                            <input
                              ref={imageInputRef}
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                              disabled={loading}
                            />
                            <p className="text-sm text-gray-500">
                              or drag and drop
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chapter Audio
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-dark-700 border-dashed rounded-lg relative bg-white dark:bg-dark-800">
                {loading2 && (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
                  </div>
                )}
                <div className="space-y-1 text-center">
                  {newChapter.audio ? (
                    <div className="relative">
                      <audio
                        src={newChapter.audio}
                        controls
                        className="mx-auto"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveAudio}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Audio
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioChange}
                            className="hidden"
                            ref={audioInputRef}
                          />
                          <button
                            type="button"
                            //@ts-ignore
                            onClick={() => audioInputRef.current?.click()}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded inline-flex items-center"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Audio
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              convertTextToSpeech(newChapter.content)
                            }
                            disabled={
                              isConverting || !newChapter.content.trim()
                            }
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center ${
                              isConverting || !newChapter.content.trim()
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Volume2 className="w-4 h-4 mr-2" />
                            {isConverting
                              ? "Converting..."
                              : "Convert to Speech"}
                          </button>
                          {newChapter.audio && (
                            <div className="flex items-center">
                              <audio
                                controls
                                src={newChapter.audio}
                                className="ml-2"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setNewChapter((prev) => ({
                                    ...prev,
                                    audio: "",
                                  }))
                                }
                                className="ml-2 text-red-500 hover:text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Layout Selection */}
          <div className="space-y-2">
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
              Chapter Layout
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowLayoutSelector(true)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center space-x-2"
              >
                <Layout className="w-5 h-5" />
                <span>
                  {newChapter.layout ? "Change Layout" : "Select Layout"}
                </span>
              </button>
              {newChapter.layout && (
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700"
                >
                  Preview Layout
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            value={newChapter.duration}
            onChange={(e) =>
              setNewChapter({ ...newChapter, duration: e.target.value })
            }
            placeholder="Duration (e.g., 15 mins)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
          />
          <div className="flex space-x-4">
            <button
              onClick={handleAddOrUpdateChapter}
              disabled={
                !newChapter.title || !newChapter.content || !newChapter.layout
              }
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingChapterId ? "Update Chapter" : "Add Chapter"}
            </button>
            {editingChapterId && (
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {modal.visible && (
        <div
          className="dark:bg-[#1e293b] bg-white"
          id="ai-response-modal"
          style={{
            position: "absolute",
            top: modal.top + 425,
            left: modal.left + 200,
            zIndex: 1000,
            borderRadius: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
            width: "670px",
            fontFamily: "Arial, sans-serif",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: "15px" }}>
              AI Suggestion
            </span>
            <button
              onClick={() => setModal({ ...modal, visible: false })}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div
            id="content-container"
            style={{
              padding: "16px",
              fontSize: "14px",
              color: "dark:white",
            }}
            dangerouslySetInnerHTML={{ __html: modal.content }}
          />

          {/* Modal Footer */}
          <div className="flex justify-between items-center mt-9">
            <div className="flex space-x-3 mb-3">
              <button
                onClick={retryResponse}
                className="px-5 py-2 text-[#172b4d] dark:text-white dark:hover:bg-slate-700 hover:bg-gray-200 text-md"
              >
                <MdOutlineReplay size={20} />
              </button>
              <button
                onClick={handleCopy}
                className="px-1 py-1 text-[#172b4d]  dark:text-white dark:hover:bg-slate-700 hover:bg-gray-200 text-md"
              >
                <MdContentCopy size={20} />
              </button>
            </div>
            <div className="flex space-x-3 mr-5 mb-3">
              <button
                onClick={cancelResponse}
                className="hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-white text-md font-semibold text-[#192d4e] px-5 py-1 rounded-md"
              >
                Discard
              </button>
              <button
                onClick={insertResponse}
                className="bg-blue-600 text-md text-white font-semibold px-3 py-1 rounded-md border-4 border-white outline outline-3.5 outline-blue-500 shadow-md hover:bg-blue-800 transition duration-200"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter List */}
      <div className="space-y-4">
        {normalizedChapters.map((chapter: any) => (
          <div
            key={chapter.id}
            className="bg-white dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-700 flex items-center justify-between"
          >
            {chapter.content?.imgUrl && (
              <img
                src={chapter.content.imgUrl}
                alt={chapter.title}
                className="w-16 h-16 object-contain rounded mr-4 border"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {chapter.title}
              </h4>
              <p className="text-sm text-gray-500">{chapter.duration}</p>
            </div>
            {chapter.content?.audioUrl && (
              <audio controls className="w-36 mx-4">
                <source src={chapter.content.audioUrl} type="audio/mpeg" />
              </audio>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditChapter(chapter.id)}
                className="p-2 text-gray-400 hover:text-blue-500"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleRemoveChapter(chapter.id)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Layout Selector Modal */}
      {showLayoutSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Select Chapter Layout
              </h3>
              <button
                onClick={() => setShowLayoutSelector(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ChapterLayoutSelector
              selectedLayout={newChapter.layout}
              onLayoutSelect={handleLayoutSelect}
              layoutImage={newChapter.image}
              layoutAudio={newChapter.audio}
            />
          </div>
        </div>
      )}

      {/* Layout Preview Modal */}
      {showPreview && (
        <ChapterPreview
          layout={newChapter.layout}
          //@ts-ignore
          layoutImage={newChapter.image}
          layoutAudio={newChapter.audio}
          onClose={() => setShowPreview(false)}
        />
      )}

      <ImageSelectionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={generatedImages}
        onSelectImage={handleImageSelect}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={isGenerating}
      />
    </div>
  );
};

export default ChapterCreation;
