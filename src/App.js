import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './components/todoList';
import UpdateList from './components/updateList';

const TASKS_URL = '/tasks.json';
const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const isServerTask = (id) => id <= 200;

function App() {
  const [tasks, updateTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(TASKS_URL);
        const loaded = res.data.map((item) => ({
          id: item.id,
          text: item.title,
          done: item.completed,
        }));
        updateTasks(loaded);
      } catch (err) {
        console.error('Помилка завантаження:', err);
        setError('Не вдалося завантажити завдання');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (text) => {
    try {
      await axios.post(API_URL, { title: text, completed: false });
    } catch (err) {
      console.error('Помилка додавання:', err);
      setError('Не вдалося зберегти завдання на сервері');
    }
    updateTasks((prev) => [...prev, { id: Date.now(), text, done: false }]);
  };

  const removeTask = async (id) => {
    try {
      if (isServerTask(id)) {
        await axios.delete(`${API_URL}/${id}`);
      }
      updateTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Помилка видалення:', err);
      setError('Не вдалося видалити завдання');
    }
  };


  const editTask = async (id, newText) => {
    try {
      if (isServerTask(id)) {
        await axios.put(`${API_URL}/${id}`, { id, title: newText });
      }
      updateTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
      );
    } catch (err) {
      console.error('Помилка редагування:', err);
      setError('Не вдалося змінити завдання');
    }
  };


  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    try {
      if (isServerTask(id)) {
        await axios.put(`${API_URL}/${id}`, { id, completed: !task.done });
      }
      updateTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
    } catch (err) {
      console.error('Помилка зміни статусу:', err);
      setError('Не вдалося змінити статус завдання');
    }
  };

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="container">
      <h2>Список завдань</h2>
      <UpdateList onAddTask={addTask} />

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Завантаження...</p>
      ) : (
        <>
          <p className="counter">
            Виконано {doneCount} з {tasks.length}
          </p>
          <TodoList
            tasks={tasks}
            onDelete={removeTask}
            onEdit={editTask}
            onToggle={toggleTask}
          />
        </>
      )}
    </div>
  );
}

export default App;