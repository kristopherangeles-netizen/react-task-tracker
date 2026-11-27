import { useState } from 'react'
import { countRemaining, createTask, getVisibleTasks, toggleTask } from './taskLogic.js'
import './App.css'

const filters = ['all', 'active', 'completed']

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState('all')
  const visibleTasks = getVisibleTasks(tasks, filter)

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    setTasks((currentTasks) => [...currentTasks, createTask(trimmedTitle)])
    setTitle('')
  }

  function handleToggle(id) {
    setTasks((currentTasks) => toggleTask(currentTasks, id))
  }

  function clearCompleted() {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">A little more focus, every day</p>
        <h1>Taskboard</h1>
        <p className="subtitle">Make space for what matters.</p>
      </header>

      <section className="task-card" aria-label="Task tracker">
        <form className="new-task-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="new-task">Add a task</label>
          <input
            id="new-task"
            aria-label="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs doing?"
            maxLength={120}
          />
          <button type="submit">Add task</button>
        </form>

        <div className="task-toolbar">
          <p aria-live="polite">
            {countRemaining(tasks)} {countRemaining(tasks) === 1 ? 'task' : 'tasks'} left
          </p>
          <nav className="filters" aria-label="Filter tasks">
            {filters.map((filterName) => (
              <button
                key={filterName}
                type="button"
                className={filter === filterName ? 'filter-button selected' : 'filter-button'}
                aria-pressed={filter === filterName}
                onClick={() => setFilter(filterName)}
              >
                {filterName[0].toUpperCase() + filterName.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {visibleTasks.length > 0 ? (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li className="task-item" key={task.id}>
                <label className={task.completed ? 'task-label completed' : 'task-label'}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                  />
                  <span>{task.title}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">
            {tasks.length === 0 ? 'Your list is clear. Add your first task above.' : 'No tasks in this view.'}
          </p>
        )}

        <footer className="task-footer">
          <span>{tasks.length} {tasks.length === 1 ? 'item' : 'items'}</span>
          <button
            type="button"
            className="clear-button"
            onClick={clearCompleted}
            disabled={!tasks.some((task) => task.completed)}
          >
            Clear completed
          </button>
        </footer>
      </section>

      <p className="page-note">One step at a time.</p>
    </main>
  )
}

export default App
