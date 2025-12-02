import { useState } from 'react';

interface FileResource {
  id: number;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

interface AddTodoProps {
  onAddTodo: (title: string, deadline?: Date, files?: FileResource[]) => void;
  fileResources: FileResource[];
}

export default function AddTodo({ onAddTodo, fileResources }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]);
  const [showFileSelector, setShowFileSelector] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const deadlineDate = deadline ? new Date(deadline) : undefined;
      // Get the selected files from fileResources
      const selectedFiles = fileResources.filter(file => selectedFileIds.includes(file.id));
      onAddTodo(title.trim(), deadlineDate, selectedFiles);
      setTitle('');
      setDeadline('');
      setSelectedFileIds([]);
      setShowFileSelector(false);
    }
  };

  const handleFileToggle = (fileId: number) => {
    setSelectedFileIds(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };

  const getFileIcon = (type: string): string => {
    if (type.includes('word') || type.includes('document')) {
      return '📝';
    } else if (type.includes('excel') || type.includes('spreadsheet')) {
      return '📊';
    } else if (type.includes('pdf')) {
      return '📄';
    } else if (type.includes('image')) {
      return '🖼️';
    } else {
      return '📎';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setShowFileSelector(!showFileSelector)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          📎 {selectedFileIds.length > 0 && `(${selectedFileIds.length})`}
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>

      {/* File selector dropdown */}
      {showFileSelector && fileResources.length > 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-700 mb-3">选择文件（可多选）</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {fileResources.map((file) => (
              <label
                key={file.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${selectedFileIds.includes(file.id) ? 'bg-blue-50 border border-blue-200' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedFileIds.includes(file.id)}
                  onChange={() => handleFileToggle(file.id)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span>{getFileIcon(file.type)}</span>
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {showFileSelector && fileResources.length === 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-sm text-gray-500">资源池暂无文件，请先上传文件</p>
        </div>
      )}
    </form>
  );
}
