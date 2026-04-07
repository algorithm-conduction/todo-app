# Spec: Todo REST API

## Requirement: CRUD operations
The API MUST support create, read, update, and delete operations on todo items.

### Scenario: Create a todo
- GIVEN the API is running
- WHEN POST /api/todos with body `{ "title": "Buy milk" }`
- THEN response status is 201
- AND response body contains `id`, `title`, `completed: false`

### Scenario: List todos
- GIVEN a todo exists
- WHEN GET /api/todos
- THEN response status is 200
- AND response body is an array containing the todo

### Scenario: Complete a todo
- GIVEN a todo exists with id 1
- WHEN PATCH /api/todos/1 with body `{ "completed": true }`
- THEN response status is 200
- AND the todo's completed field is true

### Scenario: Delete a todo
- GIVEN a todo exists with id 1
- WHEN DELETE /api/todos/1
- THEN response status is 204
- AND GET /api/todos no longer contains the todo
