// SPDX-License-Identifier: EUPL-1.2
// Copyright (C) 2026 Conduction B.V.

/**
 * In-memory todo store with CRUD methods.
 *
 * @spec openspec/changes/spec/tasks.md#task-2
 */

let todos = []
let nextId = 1

/**
 * Return all todos.
 *
 * @spec openspec/changes/spec/tasks.md#task-2
 * @returns {Array}
 */
export function list () {
  return todos
}

/**
 * Create a new todo.
 *
 * @spec openspec/changes/spec/tasks.md#task-2
 * @param {string} title
 * @returns {Object}
 */
export function create (title) {
  const todo = { id: nextId++, title, completed: false }
  todos.push(todo)
  return todo
}

/**
 * Update a todo by id.
 *
 * @spec openspec/changes/spec/tasks.md#task-2
 * @param {number} id
 * @param {Object} fields
 * @returns {Object|null}
 */
export function update (id, fields) {
  const todo = todos.find(t => t.id === id)
  if (!todo) return null
  Object.assign(todo, fields)
  return todo
}

/**
 * Delete a todo by id.
 *
 * @spec openspec/changes/spec/tasks.md#task-2
 * @param {number} id
 * @returns {boolean}
 */
export function remove (id) {
  const index = todos.findIndex(t => t.id === id)
  if (index === -1) return false
  todos.splice(index, 1)
  return true
}

/**
 * Reset the store (used in tests).
 *
 * @spec openspec/changes/spec/tasks.md#task-2
 */
export function reset () {
  todos = []
  nextId = 1
}
