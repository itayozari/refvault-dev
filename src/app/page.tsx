'use client';

import React, { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { AddVideoDialog } from '@/components/add-video-dialog';
import { Sidebar } from '@/components/sidebar';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  thumbnail?: string;
}

const initialVideos: Video[] = [
  {
    id: '1',
    title: 'UI Design Fundamentals',
    description: 'Learn the basics of UI design with practical examples and tips',
    url: 'https://www.youtube.com/watch?v=tRpoI6vkqLs',
    tags: ['UI Design', 'Fundamentals'],
    thumbnail: 'https://i.ytimg.com/vi/tRpoI6vkqLs/maxresdefault.jpg'
  },
  {
    id: '2',
    title: 'React Hooks Tutorial',
    description: 'Complete guide to React Hooks with real-world examples',
    url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q',
    tags: ['React', 'Hooks', 'Tutorial'],
    thumbnail: 'https://i.ytimg.com/vi/TNhaISOUy6Q/maxresdefault.jpg'
  },
  {
    id: '3',
    title: 'CSS Grid Layout Crash Course',
    description: 'Master CSS Grid layout in 30 minutes with practical demos',
    url: 'https://www.youtube.com/watch?v=jV8B24rSN5o',
    tags: ['CSS', 'Grid', 'Layout'],
    thumbnail: 'https://i.ytimg.com/vi/jV8B24rSN5o/maxresdefault.jpg'
  },
  {
    id: '4',
    title: 'TypeScript for Beginners',
    description: 'Introduction to TypeScript for JavaScript developers',
    url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    tags: ['TypeScript', 'JavaScript', 'Tutorial'],
    thumbnail: 'https://i.ytimg.com/vi/BwuLxPH8IDs/maxresdefault.jpg'
  },
  {
    id: '5',
    title: 'Next.js Full Course',
    description: 'Build modern web applications with Next.js framework',
    url: 'https://www.youtube.com/watch?v=mTz0GXj8NN0',
    tags: ['Next.js', 'React', 'Framework'],
    thumbnail: 'https://i.ytimg.com/vi/mTz0GXj8NN0/maxresdefault.jpg'
  },
  {
    id: '6',
    title: 'Tailwind CSS Tutorial',
    description: 'Learn how to build beautiful websites with Tailwind CSS',
    url: 'https://www.youtube.com/watch?v=UBOj6rqRUME',
    tags: ['Tailwind', 'CSS', 'Tutorial'],
    thumbnail: 'https://i.ytimg.com/vi/UBOj6rqRUME/maxresdefault.jpg'
  }
];

export default function Home() {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddVideo = (videoData: Omit<Video, 'id'>) => {
    const newVideo: Video = {
      ...videoData,
      id: Date.now().toString(),
      tags: videoData.tags || [],
    };
    setVideos((prevVideos) => [...prevVideos, newVideo]);
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar onCollapse={setIsSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Main Content */}
        <main className="p-6">
          {/* Search Bar */}
          <div className="mb-6 flex justify-start">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-[var(--background)] app-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredVideos.map((video) => (
              <div 
                key={video.id} 
                className="group bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="aspect-video bg-[var(--background-secondary)] relative overflow-hidden">
                    {video.thumbnail ? (
                      <div className="w-full h-full transform transition-all duration-500 ease-out will-change-transform group-hover:scale-[1.05]">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </a>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-[var(--text)] line-clamp-2">{video.title}</h3>
                  {video.tags && video.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {video.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Floating Action Button */}
          <button 
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-[var(--primary)] hover:bg-opacity-90 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <PlusCircle size={24} />
          </button>
        </main>
      </div>

      <AddVideoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddVideo}
      />
    </div>
  );
} 