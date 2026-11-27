import { describe, expect, it, vi } from 'vitest'
import { countRemaining, createTask, getVisibleTasks, toggleTask } from './taskLogic.js'

describe('task behavior', () => {
  it('creates a trimmed, active task with its supplied ID', () => {
    expect(createTask('  Write tests  ', 'task-1')).toEqual({
      id: 'task-1',
      title: 'Write tests',
      completed: false,
    })
  })

  it('generates a UUID when no ID is supplied', () => {
    expect(createTask('Generated task').id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
  })

  it('reports when secure task ID generation is unavailable', () => {
    vi.stubGlobal('crypto', undefined)
    try {
      expect(() => createTask('Generated task')).toThrow(
        'Secure task ID generation is unavailable.',
      )
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('rejects a task with no title', () => {
    expect(() => createTask('   ', 'task-1')).toThrow('Task title cannot be empty.')
  })

  it('toggles only the matching task and derives active and completed tasks', () => {
    const tasks = [
      createTask('Write tests', 'task-1'),
      createTask('Ship feature', 'task-2'),
    ]
    const updatedTasks = toggleTask(tasks, 'task-1')

    expect(tasks[0].completed).toBe(false)
    expect(getVisibleTasks(updatedTasks, 'active').map((task) => task.id)).toEqual(['task-2'])
    expect(getVisibleTasks(updatedTasks, 'completed').map((task) => task.id)).toEqual(['task-1'])
    expect(getVisibleTasks(updatedTasks, 'all')).toEqual(updatedTasks)
    expect(countRemaining(updatedTasks)).toBe(1)
  })
})
