export function createTask(title, id = globalThis.crypto?.randomUUID?.()) {
  const normalizedTitle = title.trim()
  if (!normalizedTitle) {
    throw new Error('Task title cannot be empty.')
  }

  return {
    id: id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: normalizedTitle,
    completed: false,
  }
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => (
    task.id === id ? { ...task, completed: !task.completed } : task
  ))
}

export function getVisibleTasks(tasks, filter) {
  if (filter === 'active') return tasks.filter((task) => !task.completed)
  if (filter === 'completed') return tasks.filter((task) => task.completed)
  return tasks
}

export function countRemaining(tasks) {
  return tasks.filter((task) => !task.completed).length
}
