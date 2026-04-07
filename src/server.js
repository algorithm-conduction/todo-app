// SPDX-License-Identifier: EUPL-1.2
// Copyright (C) 2026 Conduction B.V.

/**
 * Express REST API for the Todo MVP.
 *
 * Endpoints:
 *   GET    /api/todos       — list all todos
 *   POST   /api/todos       — create a todo { title: string }
 *   PATCH  /api/todos/:id   — update a todo { completed: boolean }
 *   DELETE /api/todos/:id   — delete a todo
 *
 * @spec openspec/changes/spec/tasks.md#task-3
 */

import express from 'express'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { list, create, update, remove } from './store.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(express.json())
app.use(express.static(join(__dirname, '..', 'public')))

/**
 * GET /api/todos — list all todos.
 *
 * @spec openspec/changes/spec/tasks.md#task-3
 */
app.get('/api/todos', (req, res) => {
  res.json(list())
})

/**
 * POST /api/todos — create a new todo.
 *
 * @spec openspec/changes/spec/tasks.md#task-3
 */
app.post('/api/todos', (req, res) => {
  const { title } = req.body
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' })
  }
  const todo = create(title.trim())
  res.status(201).json(todo)
})

/**
 * PATCH /api/todos/:id — update a todo.
 *
 * @spec openspec/changes/spec/tasks.md#task-3
 */
app.patch('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const { completed } = req.body
  const todo = update(id, { completed })
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' })
  }
  res.json(todo)
})

/**
 * DELETE /api/todos/:id — delete a todo.
 *
 * @spec openspec/changes/spec/tasks.md#task-3
 */
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const deleted = remove(id)
  if (!deleted) {
    return res.status(404).json({ error: 'Todo not found' })
  }
  res.status(204).end()
})

// Start server when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Todo API listening on http://localhost:${PORT}`)
  })
}

export default app
