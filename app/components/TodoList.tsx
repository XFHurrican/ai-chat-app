import TodoItem from './TodoItem';

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

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No todos yet. Add one above!</p>
      </div>
    );
  }

  // Sort todos by deadline: 
  // 1. Todos with deadline come first
  // 2. Todos with deadline are sorted by deadline time (closest first)
  // 3. Todos without deadline come last
  const sortedTodos = [...todos].sort((a, b) => {
    // Handle case where one has deadline and the other doesn't
    if (a.deadline && !b.deadline) return -1;
    if (!a.deadline && b.deadline) return 1;
    if (!a.deadline && !b.deadline) return 0;
    
    // Both have deadline, sort by deadline time
    return new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime();
  });

  return (
    <div className="space-y-2">
      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
