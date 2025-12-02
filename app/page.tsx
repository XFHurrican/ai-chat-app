'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

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
        {/* Navigation */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
            <p className="text-gray-600">A simple and elegant todo application with resource pool</p>
          </div>
          <Link 
            href="/resources" 
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            管理资源池 →
          </Link>
        </div>

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
