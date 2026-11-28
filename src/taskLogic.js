function generateTaskId() {
  const randomUUID = globalThis.crypto?.randomUUID
  if (typeof randomUUID !== 'function') {
    throw new Error('Secure task ID generation is unavailable.')
  }

  return randomUUID.call(globalThis.crypto)
}

export function createTask(title, id) {
  const normalizedTitle = title.trim()
  if (!normalizedTitle) {
    throw new Error('Task title cannot be empty.')
  }

  return {
    id: id ?? generateTaskId(),
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
