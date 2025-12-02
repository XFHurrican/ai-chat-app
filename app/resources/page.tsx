'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FileResourcePool from '../components/FileResourcePool';

interface FileResource {
  id: number;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export default function ResourcesPage() {
  // Initialize with empty arrays, load from localStorage later in useEffect
  const [fileResources, setFileResources] = useState<FileResource[]>([]);
  const [nextFileId, setNextFileId] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Load data from localStorage only on client side
  useEffect(() => {
    setIsClient(true);
    const loadFromLocalStorage = () => {
      const savedFileResources = localStorage.getItem('fileResources');
      const savedNextFileId = localStorage.getItem('nextFileId');

      if (savedFileResources) {
        setFileResources(JSON.parse(savedFileResources).map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt),
        })));
      }

      if (savedNextFileId) {
        setNextFileId(parseInt(savedNextFileId, 10));
      }
    };

    loadFromLocalStorage();
  }, []);

  // Save data to localStorage whenever state changes, but only on client side
  const saveToLocalStorage = () => {
    if (isClient) {
      localStorage.setItem('fileResources', JSON.stringify(fileResources));
      localStorage.setItem('nextFileId', nextFileId.toString());
    }
  };

  // Add file resource
  const handleAddFileResource = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newFileResource: FileResource = {
        id: nextFileId,
        name: file.name,
        type: file.type,
        url: e.target?.result as string,
        uploadedAt: new Date(),
      };
      setFileResources([newFileResource, ...fileResources]);
      setNextFileId(nextFileId + 1);
      saveToLocalStorage();
    };
    reader.readAsDataURL(file);
  };

  // Delete file resource
  const handleDeleteFileResource = (fileId: number) => {
    // Get current todos from localStorage to update them as well
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const todos = JSON.parse(savedTodos);
      // Remove file from all todos
      const updatedTodos = todos.map((todo: any) => ({
        ...todo,
        files: todo.files.filter((file: any) => file.id !== fileId),
      }));
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }

    setFileResources(fileResources.filter(file => file.id !== fileId));
    saveToLocalStorage();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <main className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors"
          >
            ← 返回Todo列表
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">资源池管理</h1>
          <p className="text-gray-600">上传和管理文件资源，供Todo项引用</p>
        </div>

        {/* File Resource Pool */}
        <FileResourcePool
          fileResources={fileResources}
          onAddFile={handleAddFileResource}
          onDeleteFile={handleDeleteFileResource}
        />
      </main>
    </div>
  );
}
