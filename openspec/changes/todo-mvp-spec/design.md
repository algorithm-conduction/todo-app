# Design: Todo MVP

## Status
proposed

## Overview
A minimal TODO app: Node.js + Express REST API with an in-memory store,
served alongside a vanilla HTML/JS frontend.

## Architecture
- `src/server.js` — Express app with REST endpoints
- `src/store.js` — in-memory TODO store (array)
- `public/index.html` — single-page frontend
- `test/api.test.js` — API integration tests (supertest)

## API Endpoints
- `GET    /api/todos`      — list all todos
- `POST   /api/todos`      — create a todo `{ title: string }`
- `PATCH  /api/todos/:id`  — update a todo `{ completed: boolean }`
- `DELETE /api/todos/:id`  — delete a todo

## Constraints
- No database — in-memory array is fine for this MVP
- No authentication
- EUPL-1.2 license headers on all files
