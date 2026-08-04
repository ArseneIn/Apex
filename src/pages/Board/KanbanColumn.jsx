import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const columnColors = {
  todo: '#505f76',
  in_progress: '#2563eb',
  done: '#10B981',
};

export default function KanbanColumn({ column, onTaskClick, onAddTask }) {
  const { id, title, tasks = [] } = column;

  return (
    <div className="w-80 shrink-0 flex flex-col bg-white rounded-xl border border-[#E2E8F0] max-h-full"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      {/* Column header */}
      <div className="px-4 py-3.5 border-b border-[#E2E8F0] flex justify-between items-center shrink-0">
        <h3 className="text-sm font-semibold text-[#131b2e] flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: columnColors[id] || '#505f76' }}
          />
          {title}
          <span className="text-xs font-medium text-[#505f76] bg-[#eaedff] px-2 py-0.5 rounded-full ml-1">
            {tasks.length}
          </span>
        </h3>
        <button
          className="text-[#505f76] hover:text-[#004ac6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] rounded p-1"
          aria-label={`More options for ${title}`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_horiz</span>
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[100px] transition-colors duration-150 ${
              snapshot.isDraggingOver ? 'droppable-over' : ''
            }`}
            aria-label={`${title} column drop zone`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}

            {/* Add task button inside column */}
            <button
              onClick={() => onAddTask(id)}
              className="w-full py-2 border-2 border-dashed border-[#c3c6d7] text-[#505f76] rounded-lg hover:border-[#2563eb] hover:text-[#2563eb] transition-colors text-sm font-medium flex items-center justify-center gap-1 mt-auto"
              aria-label={`Add task to ${title}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
              Add Task
            </button>
          </div>
        )}
      </Droppable>
    </div>
  );
}
