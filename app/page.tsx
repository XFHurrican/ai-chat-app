'use client';

import { useState, useEffect } from 'react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import FileResourcePool from './components/FileResourcePool';

interface FileResource {
  id: number;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  files: FileResource[];
}

export default function Home() {
  // Initialize with empty arrays, load from localStorage later in useEffect
  const [todos, setTodos] = useState<Todo[]>([]);
  const [nextId, setNextId] = useState(1);
  const [fileResources, setFileResources] = useState<FileResource[]>([]);
  const [nextFileId, setNextFileId] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Load data from localStorage only on client side
  useEffect(() => {
    setIsClient(true);
    const loadFromLocalStorage = () => {
      const savedTodos = localStorage.getItem('todos');
      const savedFileResources = localStorage.getItem('fileResources');
      const savedNextId = localStorage.getItem('nextId');
      const savedNextFileId = localStorage.getItem('nextFileId');

      if (savedTodos) {
        setTodos(JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          deadline: todo.deadline ? new Date(todo.deadline) : undefined,
          files: todo.files.map((file: any) => ({
            ...file,
            uploadedAt: new Date(file.uploadedAt),
          })),
        })));
      }

      if (savedFileResources) {
        setFileResources(JSON.parse(savedFileResources).map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt),
        })));
      }

      if (savedNextId) {
        setNextId(parseInt(savedNextId, 10));
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
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('fileResources', JSON.stringify(fileResources));
      localStorage.setItem('nextId', nextId.toString());
      localStorage.setItem('nextFileId', nextFileId.toString());
    }
  };

  // Add new todo with file references
  const handleAddTodo = (title: string, deadline?: Date, files: FileResource[] = []) => {
    const newTodo: Todo = {
      id: nextId,
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline,
      files,
    };
    setTodos([newTodo, ...todos]);
    setNextId(nextId + 1);
    saveToLocalStorage();
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
    setFileResources(fileResources.filter(file => file.id !== fileId));
    // Also remove from all todos
    setTodos(todos.map(todo => ({
      ...todo,
      files: todo.files.filter(file => file.id !== fileId),
    })));
    saveToLocalStorage();
  };

  // Toggle todo completion
  const handleToggleTodo = (id: number, completed: boolean) => {
    setTodos(todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed,
          updatedAt: new Date(),
        };
      }
      return todo;
    }));
    saveToLocalStorage();
  };

  // Delete todo
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    saveToLocalStorage();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <main className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">A simple and elegant todo application with resource pool</p>
        </div>

        {/* File Resource Pool */}
        <FileResourcePool
          fileResources={fileResources}
          onAddFile={handleAddFileResource}
          onDeleteFile={handleDeleteFileResource}
        />

        {/* Add Todo Form */}
        <AddTodo 
          onAddTodo={handleAddTodo} 
          fileResources={fileResources} 
        />
        
        {/* Todo List */}
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />

      </main>
    </div>
  );
}
