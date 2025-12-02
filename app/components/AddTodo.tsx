import { useState, useEffect, useRef } from 'react';

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
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('');
  const dateTimePickerRef = useRef<HTMLDivElement>(null);
  const dateTimeInputRef = useRef<HTMLInputElement>(null);

  // Close datetime picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateTimePickerRef.current && !dateTimePickerRef.current.contains(event.target as Node) &&
          dateTimeInputRef.current && !dateTimeInputRef.current.contains(event.target as Node)) {
        setShowDateTimePicker(false);
      }
    };

    if (showDateTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateTimePicker]);

  const handleDateTimeConfirm = () => {
    if (tempDate || tempTime) {
      // Combine date and time
      const combinedDateTime = `${tempDate}T${tempTime}`;
      setDeadline(combinedDateTime);
    }
    setShowDateTimePicker(false);
  };

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
        <div className="relative w-64 flex-shrink-0">
          {/* Display input that triggers the custom picker */}
          <input
            ref={dateTimeInputRef}
            type="text"
            value={deadline ? deadline.replace('T', ' ') : ''}
            onFocus={() => {
              // Initialize temp values from current deadline
              if (deadline) {
                const [date, time] = deadline.split('T');
                setTempDate(date);
                setTempTime(time);
              }
              setShowDateTimePicker(true);
            }}
            onClick={() => {
              // Initialize temp values from current deadline
              if (deadline) {
                const [date, time] = deadline.split('T');
                setTempDate(date);
                setTempTime(time);
              }
              setShowDateTimePicker(true);
            }}
            placeholder="YYYY-MM-DD HH:MM"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 cursor-pointer placeholder-gray-400"
            readOnly
          />
          
          {/* Custom DateTime Picker Overlay */}
          {showDateTimePicker && (
            <div ref={dateTimePickerRef} className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Select Date and Time</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Date Picker */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Date</label>
                    <input
                      type="date"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Time Picker */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Time</label>
                    <input
                      type="time"
                      value={tempTime}
                      onChange={(e) => setTempTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Confirm Button */}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDateTimePicker(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDateTimeConfirm}
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select Files (Multi-select)</h3>
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
          <p className="text-sm text-gray-500">No files in resource pool yet. Please upload files first.</p>
        </div>
      )}
    </form>
  );
}
