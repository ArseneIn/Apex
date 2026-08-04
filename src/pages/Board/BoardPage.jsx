import { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useQuery } from '@tanstack/react-query';
import KanbanColumn from './KanbanColumn';
import TaskModal from './TaskModal';
import { TaskCardSkeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { useToast } from '../../components/ui/Toast';
import { getTasks, moveTask, createTask } from '../../api/endpoints';
import useBoardStore from '../../store/boardStore';

// Mock seed data when API unavailable
const MOCK_TASKS = [
  {
    id: 1, title: 'Design System Architecture Review', description: 'Review current tokens and component structures to ensure alignment with the new brand guidelines.',
    priority: 'HIGH', status: 'todo', due_date: 'Oct 12', progress: null, comments_count: 0,
    assignees: [{ username: 'Sarah', avatar: null }],
  },
  {
    id: 2, title: 'Implement Auth Flow UI', description: null,
    priority: 'MEDIUM', status: 'todo', due_date: 'Oct 10', progress: null, comments_count: 3,
    checklist: [{ id: 1, title: 'Login page', done: true }, { id: 2, title: 'Register page', done: true }, { id: 3, title: 'JWT interceptor', done: false }, { id: 4, title: 'Auto-refresh', done: false }, { id: 5, title: 'Tests', done: false }],
    assignees: [{ username: 'David', avatar: null }, { username: 'Elena', avatar: null }],
  },
  {
    id: 3, title: 'Kanban Board Drag & Drop Logic', description: null,
    priority: 'HIGH', status: 'in_progress', due_date: 'Oct 15', progress: 65, comments_count: 0,
    assignees: [{ username: 'Marcus', avatar: null }],
  },
  {
    id: 4, title: 'Update NPM Packages', description: null,
    priority: 'LOW', status: 'done', due_date: 'Oct 08', progress: null, comments_count: 0,
    assignees: [{ username: 'John', avatar: null }],
  },
];

export default function BoardPage() {
  const toast = useToast();
  const { columns, initBoard, moveTask: moveLocal, addTask, updateTask: updateLocal, deleteTask: deleteLocal } = useBoardStore();
  const [selectedTask, setSelectedTask] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newTaskCol, setNewTaskCol] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    retry: 1,
    onSuccess: (data) => initBoard(Array.isArray(data) ? data : data.results || []),
    onError: () => initBoard(MOCK_TASKS),
  });

  // Initialize with mock data immediately for demo
  useEffect(() => {
    if (!isLoading && Object.keys(columns).length === 0) {
      initBoard(MOCK_TASKS);
    }
  }, [isLoading, columns, initBoard]);

  const handleDragEnd = useCallback(async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    moveLocal(
      Number(draggableId),
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );

    try {
      await moveTask(Number(draggableId), destination.droppableId);
    } catch {
      toast({ type: 'error', title: 'Move failed', message: 'Could not update task status.' });
      // Revert
      moveLocal(Number(draggableId), destination.droppableId, source.droppableId, destination.index, source.index);
    }
  }, [moveLocal, toast]);

  const handleAddTask = async (colId) => {
    setNewTaskCol(colId);
    setCreating(true);
  };

  const submitNewTask = async () => {
    if (!newTaskTitle.trim()) return;
    const taskData = { title: newTaskTitle, status: newTaskCol, priority: 'MEDIUM' };
    try {
      const newTask = await createTask(taskData).catch(() => ({ ...taskData, id: Date.now() }));
      addTask(newTask);
      toast({ type: 'success', title: 'Task created!' });
    } catch {
      toast({ type: 'error', title: 'Create failed' });
    }
    setCreating(false);
    setNewTaskTitle('');
    setNewTaskCol(null);
  };

  const columnOrder = ['todo', 'in_progress', 'done'];

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.12))]">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#737686] mb-1">
            <span>Project</span>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
            <span className="text-[#2563eb] font-medium">Apex Suite</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight">Q3 Product Roadmap</h1>
            <button className="text-[#737686] hover:text-[#2563eb] transition-colors" aria-label="Favorite board">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>star</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Team avatars */}
          <div className="hidden sm:flex -space-x-2">
            {['Sarah', 'David', 'Elena'].map((name) => (
              <Avatar key={name} name={name} size="sm" className="border-2 border-white" />
            ))}
            <div className="w-7 h-7 rounded-full bg-[#eaedff] border-2 border-white flex items-center justify-center text-[10px] font-semibold text-[#505f76]">
              +4
            </div>
          </div>

          <Button variant="secondary" icon="person_add" size="sm">Invite</Button>
          <Button icon="add" size="sm" onClick={() => handleAddTask('todo')}>New Task</Button>
        </div>
      </div>

      {/* Quick Add Form */}
      {creating && (
        <div className="shrink-0 mb-4 bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder={`New task in ${columns[newTaskCol]?.title || 'column'}...`}
            className="flex-1 px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') submitNewTask(); if (e.key === 'Escape') setCreating(false); }}
          />
          <Button size="sm" onClick={submitNewTask}>Add</Button>
          <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>Cancel</Button>
        </div>
      )}

      {/* Kanban columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex gap-6 h-full items-start min-w-max">
            {isLoading
              ? columnOrder.map((col) => (
                  <div key={col} className="w-80 shrink-0 bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3">
                    {[...Array(3)].map((_, i) => <TaskCardSkeleton key={i} />)}
                  </div>
                ))
              : columnOrder.map((colId) => {
                  const col = columns[colId];
                  if (!col) return null;
                  return (
                    <KanbanColumn
                      key={colId}
                      column={col}
                      onTaskClick={setSelectedTask}
                      onAddTask={handleAddTask}
                    />
                  );
                })
            }

            {/* Add section button */}
            {!isLoading && (
              <div className="w-72 shrink-0">
                <button className="w-full py-3 bg-white/60 border-2 border-dashed border-[#c3c6d7] text-[#505f76] rounded-xl hover:bg-white hover:border-[#2563eb] hover:text-[#2563eb] transition-all text-sm font-medium flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">add</span>
                  Add Section
                </button>
              </div>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Task modal */}
      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(updated) => { updateLocal(updated); setSelectedTask(updated); }}
        onDelete={(id) => { deleteLocal(id); setSelectedTask(null); }}
      />
    </div>
  );
}
