import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { PriorityBadge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { useToast } from '../../components/ui/Toast';
import { updateTask, deleteTask } from '../../api/endpoints';
import { formatDateTime } from '../../utils/dateUtils';

const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];
const STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export default function TaskModal({ task, onClose, onUpdate, onDelete }) {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        status: task.status || 'todo',
        due_date: task.due_date || '',
      });
    }
  }, [task, reset]);

  if (!task) return null;

  const onSubmit = async (data) => {
    try {
      const updated = await updateTask(task.id, data);
      onUpdate(updated);
      toast({ type: 'success', title: 'Task updated!' });
      setIsEditing(false);
    } catch {
      toast({ type: 'error', title: 'Update failed', message: 'Could not save changes.' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task permanently?')) return;
    setDeleting(true);
    try {
      await deleteTask(task.id);
      onDelete(task.id);
      toast({ type: 'success', title: 'Task deleted.' });
      onClose();
    } catch {
      toast({ type: 'error', title: 'Delete failed' });
      setDeleting(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-white';

  return (
    <Modal
      isOpen={!!task}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Task Details'}
      size="lg"
      footer={
        isEditing ? (
          <>
            <Button variant="secondary" onClick={() => setIsEditing(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>Save Changes</Button>
          </>
        ) : (
          <>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
              Edit
            </Button>
          </>
        )
      }
    >
      {isEditing ? (
        /* Edit form */
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#434655] mb-1">Title *</label>
            <input className={inputCls} {...register('title', { required: true })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#434655] mb-1">Description</label>
            <textarea className={`${inputCls} resize-none`} rows={4} {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#434655] mb-1">Priority</label>
              <select className={inputCls} {...register('priority')}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#434655] mb-1">Status</label>
              <select className={inputCls} {...register('status')}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#434655] mb-1">Due Date</label>
            <input type="date" className={inputCls} {...register('due_date')} />
          </div>
        </form>
      ) : (
        /* View mode */
        <div>
          {/* Tabs */}
          <div className="flex gap-1 mb-5 border-b border-[#E2E8F0]">
            {['details', 'checklist', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-[#2563eb] border-b-2 border-[#2563eb]'
                    : 'text-[#505f76] hover:text-[#131b2e]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <PriorityBadge priority={task.priority} />
                <span className="text-xs text-[#505f76] bg-[#f2f3ff] px-2 py-0.5 rounded-full">
                  {STATUSES.find((s) => s.value === task.status)?.label || task.status}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#131b2e] leading-tight">{task.title}</h3>
              </div>

              {task.description && (
                <div>
                  <p className="text-xs font-semibold text-[#434655] mb-1">Description</p>
                  <p className="text-sm text-[#505f76] leading-relaxed whitespace-pre-wrap">{task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E2E8F0]">
                {task.due_date && (
                  <div>
                    <p className="text-xs font-semibold text-[#434655] mb-1">Due Date</p>
                    <div className="flex items-center gap-1.5 text-sm text-[#505f76]">
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>calendar_today</span>
                      {task.due_date}
                    </div>
                  </div>
                )}
                {(task.assignees || task.assignee) && (
                  <div>
                    <p className="text-xs font-semibold text-[#434655] mb-1">Assignees</p>
                    <div className="flex -space-x-1">
                      {(task.assignees || [task.assignee]).map((a, i) => (
                        <Avatar key={i} name={a?.username || a?.email} size="sm" className="border-2 border-white" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Attachments placeholder */}
              <div className="pt-2 border-t border-[#E2E8F0]">
                <p className="text-xs font-semibold text-[#434655] mb-2">Attachments</p>
                <button className="flex items-center gap-2 text-sm text-[#2563eb] hover:underline">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>attach_file</span>
                  Add attachment
                </button>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-2">
              {(task.checklist || []).length === 0 ? (
                <p className="text-sm text-[#737686] text-center py-8">No checklist items yet.</p>
              ) : (
                task.checklist.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f2f3ff] cursor-pointer">
                    <input type="checkbox" defaultChecked={item.done} className="rounded text-[#2563eb]" />
                    <span className={`text-sm ${item.done ? 'line-through text-[#737686]' : 'text-[#131b2e]'}`}>
                      {item.title}
                    </span>
                  </label>
                ))
              )}
              <button className="flex items-center gap-2 text-sm text-[#2563eb] hover:underline mt-2">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                Add item
              </button>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {(task.activity || []).length === 0 ? (
                <p className="text-sm text-[#737686] text-center py-8">No activity yet.</p>
              ) : (
                task.activity.map((act) => (
                  <div key={act.id} className="flex gap-3">
                    <Avatar name={act.user} size="sm" />
                    <div>
                      <p className="text-sm text-[#131b2e]">
                        <span className="font-medium">{act.user}</span> {act.action}
                      </p>
                      <p className="text-xs text-[#737686]">{formatDateTime(act.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
