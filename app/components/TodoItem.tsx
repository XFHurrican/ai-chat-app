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

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  // Format date to a readable string, precise to minute
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString([], { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
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
    <div className="p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => onToggle(todo.id, e.target.checked)}
              className="w-5 h-5 mt-1 text-blue-500 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <span
                className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
              >
                {todo.title}
              </span>
              <div className="mt-1 text-xs text-gray-500 space-x-4">
                <span>Created: {formatDate(todo.createdAt)}</span>
                {todo.deadline && (
                  <span className="text-orange-500">
                    Deadline: {formatDate(todo.deadline)}
                  </span>
                )}
              </div>
              
              {/* File references */}
              {todo.files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {todo.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors"
                    >
                      <span>{getFileIcon(file.type)}</span>
                      <span>{file.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          className="px-3 py-1 text-red-500 hover:text-red-700 transition-colors ml-4"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
