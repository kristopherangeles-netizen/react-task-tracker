import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('Taskboard', () => {
  it('adds tasks, filters them, marks them complete, and clears completed tasks', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByRole('textbox', { name: 'Task title' })
    await user.type(input, 'Plan release')
    await user.click(screen.getByRole('button', { name: 'Add task' }))
    await user.type(input, 'Review changes')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    expect(screen.getByText('2 tasks left')).toBeInTheDocument()
    expect(screen.getByText('Plan release')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'Plan release' }))
    await user.click(screen.getByRole('button', { name: 'Active' }))
    expect(screen.queryByText('Plan release')).not.toBeInTheDocument()
    expect(screen.getByText('Review changes')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Completed' }))
    expect(screen.getByText('Plan release')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear completed' }))

    expect(screen.queryByText('Plan release')).not.toBeInTheDocument()
    expect(screen.getByText('1 task left')).toBeInTheDocument()
  })

  it('does not add whitespace-only input', () => {
    render(<App />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Task title' }), {
      target: { value: '   ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))

    expect(screen.getByText('Your list is clear. Add your first task above.')).toBeInTheDocument()
    expect(within(screen.getByRole('contentinfo')).getByText('0 items')).toBeInTheDocument()
  })
})
