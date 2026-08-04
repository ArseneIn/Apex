import { Draggable } from '@hello-pangea/dnd';
import { PriorityBadge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { isAfter } from '../../utils/dateUtils';

export default function TaskCard({ task, index, onClick }) {
  const isOverdue = task.due_date && isAfter(task.due_date);
  const isDone = task.status === 'done';

  const checklistDone = task.checklist?.filter((c) => c.done).length || 0;
  const checklistTotal = task.checklist?.length || 0;

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card bg-white border border-[#E2E8F0] p-3 rounded-lg cursor-pointer select-none ${
            snapshot.isDragging ? 'dragging rotate-1 scale-[1.02]' : ''
          } ${isDone ? 'opacity-75' : ''}`}
          onClick={() => onClick(task)}
          role="button"
          aria-label={`Task: ${task.title}`}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(task); }}
        >
          {/* Priority + actions */}
          <div className="flex justify-between items-start mb-2">
            <PriorityBadge priority={task.priority} />
            {isDone && (
              <span className="material-symbols-outlined text-[#10B981]" style={{ fontSize: '18px' }}>
                check_circle
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className={`text-sm font-medium text-[#131b2e] mb-1.5 leading-snug ${isDone ? 'line-through decoration-[#737686]' : ''}`}>
            {task.title}
          </h4>

          {/* Description excerpt */}
          {task.description && !isDone && (
            <p className="text-xs text-[#505f76] mb-2.5 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Progress bar (in_progress only) */}
          {task.status === 'in_progress' && task.progress != null && (
            <div className="mb-2.5">
              <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#2563eb] h-full rounded-full transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Checklist + comments */}
          {(checklistTotal > 0 || task.comments_count > 0) && (
            <div className="flex items-center gap-3 mb-2.5 text-[#505f76]">
              {checklistTotal > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_box</span>
                  {checklistDone}/{checklistTotal}
                </div>
              )}
              {task.comments_count > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chat_bubble</span>
                  {task.comments_count}
                </div>
              )}
            </div>
          )}

          {/* Footer: due date + assignees */}
          <div className="flex justify-between items-center mt-auto pt-2.5 border-t border-[#f2f3ff]">
            {task.due_date ? (
              <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-[#EF4444] font-medium' : 'text-[#505f76]'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                  {isOverdue ? 'event_busy' : 'calendar_today'}
                </span>
                {task.due_date}
              </div>
            ) : <div />}

            {/* Assignees */}
            <div className="flex -space-x-1">
              {(task.assignees || (task.assignee ? [task.assignee] : [])).slice(0, 3).map((a, i) => (
                <Avatar
                  key={i}
                  src={a.avatar}
                  name={a.username || a.email}
                  size="sm"
                  grayscale={isDone}
                  className="border-2 border-white"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
