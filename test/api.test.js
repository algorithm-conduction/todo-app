// SPDX-License-Identifier: EUPL-1.2
// Copyright (C) 2026 Conduction B.V.

/**
 * Integration tests for the Todo REST API.
 *
 * Covers all scenarios from openspec/changes/spec/specs/api.md.
 *
 * @spec openspec/changes/spec/tasks.md#task-5
 */

import { describe, it, beforeEach } from 'vitest'
import { expect } from 'vitest'
import request from 'supertest'
import app from '../src/server.js'
import * as store from '../src/store.js'

beforeEach(() => {
  store.reset()
})

describe('POST /api/todos', () => {
  it('creates a todo and returns 201 with id, title and completed=false', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Buy milk' })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      title: 'Buy milk',
      completed: false
    })
  })

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({})

    expect(res.status).toBe(400)
  })

  it('returns 400 when title is not a string', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 42 })

    expect(res.status).toBe(400)
  })
})

describe('GET /api/todos', () => {
  it('returns 200 with an empty array when no todos exist', async () => {
    const res = await request(app).get('/api/todos')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('returns 200 with array containing the created todo', async () => {
    await request(app).post('/api/todos').send({ title: 'Buy milk' })

    const res = await request(app).get('/api/todos')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toMatchObject({ title: 'Buy milk', completed: false })
  })

  it('returns all todos when multiple exist', async () => {
    await request(app).post('/api/todos').send({ title: 'Task A' })
    await request(app).post('/api/todos').send({ title: 'Task B' })

    const res = await request(app).get('/api/todos')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})

describe('PATCH /api/todos/:id', () => {
  it('marks a todo as completed and returns 200', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'Buy milk' })
    const id = created.body.id

    const res = await request(app)
      .patch(`/api/todos/${id}`)
      .send({ completed: true })

    expect(res.status).toBe(200)
    expect(res.body.completed).toBe(true)
  })

  it('returns 404 for a non-existent todo', async () => {
    const res = await request(app)
      .patch('/api/todos/9999')
      .send({ completed: true })

    expect(res.status).toBe(404)
  })

  it('can mark a todo as not completed after it was completed', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'Task' })
    const id = created.body.id

    await request(app).patch(`/api/todos/${id}`).send({ completed: true })
    const res = await request(app).patch(`/api/todos/${id}`).send({ completed: false })

    expect(res.status).toBe(200)
    expect(res.body.completed).toBe(false)
  })
})

describe('DELETE /api/todos/:id', () => {
  it('deletes a todo and returns 204', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'Buy milk' })
    const id = created.body.id

    const res = await request(app).delete(`/api/todos/${id}`)

    expect(res.status).toBe(204)
  })

  it('removes the todo from the list after deletion', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'Buy milk' })
    const id = created.body.id

    await request(app).delete(`/api/todos/${id}`)

    const listRes = await request(app).get('/api/todos')
    expect(listRes.body.find(t => t.id === id)).toBeUndefined()
  })

  it('returns 404 when deleting a non-existent todo', async () => {
    const res = await request(app).delete('/api/todos/9999')

    expect(res.status).toBe(404)
  })
})
