import React, { useState, KeyboardEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Link, Loader2, AlertCircle, Plus, Edit2, Check, XCircle } from 'lucide-react';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface VideoData {
  title: string;
  description: string;
  url: string;
  tags: string[];
  thumbnail?: string;
}

interface AddVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VideoData) => void;
}

const THOUGHT_PROMPTS = [
  "Key concepts and takeaways...",
  "How I might use this...",
  "What makes it interesting...",
  "Who should watch this..."
];

const generateContentWithGPT = async (thought: string, videoTitle: string) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI that generates tags and descriptions for video references. 
          When given a thought about a video and its title, generate:
          1. 2-3 relevant tags (short, keyword-style)
          2. A brief, insightful addition to the description that connects the thought to the video's topic.
          Format your response as JSON with 'tags' array and 'description' string.`
        },
        {
          role: "user",
          content: `Video Title: "${videoTitle}"
          Thought: "${thought}"`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }

    const result = JSON.parse(content);
    return {
      tags: result.tags || [],
      description: result.description || ""
    };
  } catch (error) {
    console.error('Error generating content:', error);
    return {
      tags: [],
      description: thought
    };
  }
};

export function AddVideoDialog({ open, onOpenChange, onSubmit }: AddVideoDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoMetadata, setVideoMetadata] = useState<{ title: string; thumbnail: string } | null>(null);
  const [thoughts, setThoughts] = useState<string[]>(Array(4).fill(''));
  const [currentThought, setCurrentThought] = useState('');
  const [thoughtIndex, setThoughtIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  const handleUrlChange = async (url: string) => {
    setVideoUrl(url);
    if (!url) {
      setVideoMetadata(null);
      return;
    }

    // YouTube URL validation
    const youtubeId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/)?.[1];
    // Vimeo URL validation
    const vimeoId = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/)?.[1];

    if (youtubeId || vimeoId) {
      setIsLoading(true);
      try {
        if (youtubeId) {
          // Use YouTube oEmbed API
          const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`);
          const data = await response.json();
          
          setVideoMetadata({
            title: data.title || 'YouTube Video',
            thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
          });
        } else if (vimeoId) {
          // Use Vimeo oEmbed API
          const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`);
          const data = await response.json();
          
          setVideoMetadata({
            title: data.title || 'Vimeo Video',
            thumbnail: data.thumbnail_url || `https://vumbnail.com/${vimeoId}.jpg`
          });
        }
      } catch (error) {
        console.error('Error fetching video metadata:', error);
        // Set fallback data if fetching fails
        setVideoMetadata({
          title: youtubeId ? 'YouTube Video' : 'Vimeo Video',
          thumbnail: youtubeId 
            ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
            : `https://vumbnail.com/${vimeoId}.jpg`
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleThoughtKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const thought = thoughts[index];
      if (thought.trim() && videoMetadata) {
        setThoughtIndex(index);
        setCurrentThought(thought);
        setThoughts(prev => {
          const newThoughts = [...prev];
          newThoughts[index] = '';
          return newThoughts;
        });
        
        // Generate content using GPT
        setIsGenerating(true);
        try {
          const generated = await generateContentWithGPT(thought, videoMetadata.title);
          
          // Add new tags
          setTags(prev => [...new Set([...prev, ...generated.tags])]);
          
          // Add to description
          setDescription(prev => 
            prev + (prev ? '\n\n' : '') + generated.description
          );
        } catch (error) {
          console.error('Error in content generation:', error);
          // Fallback to basic content
          setTags(prev => [...new Set([...prev, thought.split(' ')[0]])]);
          setDescription(prev => 
            prev + (prev ? '\n\n' : '') + 
            "New insight: " + thought.substring(0, 50) + "..."
          );
        } finally {
          setIsGenerating(false);
        }
      }
    }
  };

  const handleThoughtChange = (index: number, value: string) => {
    const newThoughts = [...thoughts];
    newThoughts[index] = value;
    setThoughts(newThoughts);
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const startEditingDescription = () => {
    setIsEditingDescription(true);
    setEditedDescription(description);
  };

  const saveDescription = () => {
    setDescription(editedDescription);
    setIsEditingDescription(false);
  };

  const handleGenerateAndSave = async () => {
    if (!videoMetadata) return;
    
    onSubmit({
      title: videoMetadata.title,
      description: description,
      url: videoUrl,
      tags: tags,
      thumbnail: videoMetadata.thumbnail
    });
    
    // Reset form
    setVideoUrl('');
    setVideoMetadata(null);
    setThoughts(Array(4).fill(''));
    setTags([]);
    setDescription('');
    setIsGenerating(false);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg w-[56vw] h-[70vh] overflow-hidden flex flex-col">
          <Dialog.Title className="sr-only">Add Video Reference</Dialog.Title>
          <div className="flex-1 p-5">
            <div className="grid grid-cols-12 grid-rows-2 gap-5 h-full">
              {/* Video Section - 30% */}
              <div className="col-span-4 flex flex-col">
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="Paste YouTube or Vimeo URL"
                    className="w-full pl-9 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  />
                </div>

                {isLoading ? (
                  <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                ) : videoMetadata ? (
                  <div className="space-y-2">
                    <img 
                      src={videoMetadata.thumbnail} 
                      alt={videoMetadata.title}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <h3 className="font-medium dark:text-white text-sm line-clamp-2">{videoMetadata.title}</h3>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center text-center p-3">
                    <AlertCircle className="w-5 h-5 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Preview</p>
                  </div>
                )}
              </div>

              {/* Notes Section - 70% */}
              <div className="col-span-8">
                <div className="grid grid-cols-2 gap-3 h-full">
                  {THOUGHT_PROMPTS.map((prompt, index) => (
                    <div key={index} className="relative">
                      <textarea
                        value={thoughts[index]}
                        onChange={(e) => handleThoughtChange(index, e.target.value)}
                        onKeyDown={(e) => handleThoughtKeyDown(e, index)}
                        placeholder={prompt}
                        className="w-full h-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm resize-none"
                      />
                      {thoughtIndex === index && isGenerating && (
                        <div className="absolute top-2 right-2">
                          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Section */}
              <div className="col-span-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Tags</h3>
                <div className="h-[calc(100%-2rem)] border rounded-lg dark:border-gray-600 p-3 overflow-y-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-600 dark:hover:text-blue-300"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="col-span-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Description</h3>
                {isEditingDescription ? (
                  <div className="h-[calc(100%-2rem)] flex flex-col">
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="flex-1 w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setIsEditingDescription(false)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <XCircle size={14} />
                      </button>
                      <button
                        onClick={saveDescription}
                        className="p-1 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[calc(100%-2rem)] relative">
                    <div className="absolute inset-0 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-y-auto">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {description || "Description will appear here as you type your notes and press Enter..."}
                      </p>
                    </div>
                    <button
                      onClick={startEditingDescription}
                      className="absolute top-2 right-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateAndSave}
              disabled={!videoMetadata || isGenerating || (!description && thoughts.every(t => !t.trim()))}
              className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              Save Reference
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 