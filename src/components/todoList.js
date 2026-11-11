import { useState } from 'react';
function TodoItem({ task, onDelete, onEdit, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.text);

  const save = () => {
    if (value.trim()) {
      onEdit(task.id, value.trim());
    }
    setEditing(false);
  };

  return (
    <li className="task-item">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />

      {editing ? (
        <input
          className="task-edit-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <span className={task.done ? 'task-text done' : 'task-text'}>
          {task.text}
        </span>
      )}

      {editing ? (
        <button onClick={save}>Зберегти</button>
      ) : (
        <button onClick={() => setEditing(true)}>Редагувати</button>
      )}

      <button className="danger" onClick={() => onDelete(task.id)}>
        Видалити
      </button>
    </li>
  );
}

function TodoList({ tasks = [], onDelete, onEdit, onToggle }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

export default TodoList;