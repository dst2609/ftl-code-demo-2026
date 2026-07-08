# CLAUDE.md

## Project Context

This is a PERN stack capstone project.

The app uses:

- PostgreSQL for the database
- Prisma as ORM
- Express.js for the backend
- React for the frontend
- Node.js as the runtime

This is a learning project. Explain concepts in beginner-friendly language.

## Project Structure

client/

- React frontend
- Components are in client/src/components
- Main app file is client/src/App.jsx

server/

- Express backend
- Routes are in server/routes
- Database connection is in server/db/db.js
- Main server file is server/server.js

## How You Should Help

Before editing code:

1. Inspect the relevant files.
2. Explain what you found.
3. Suggest a short plan.
4. Make the smallest reasonable change.

After editing code:

1. List the files changed.
2. Explain what changed.
3. Explain why the change works.
4. Suggest how to test it.

## Coding Rules

- Use beginner-friendly JavaScript.
- Use async/await for backend code.
- Do not rewrite the whole project.
- Do not add new libraries unless necessary.
- Follow the existing folder structure.
- Keep React components readable.
- Use clear variable names.

## Debugging Rule

When debugging a full-stack feature, trace the flow:

React component
→ API request
→ Express route
→ Controller or route logic
→ PostgreSQL query
→ Response back to React

Explain where the issue happens in this flow.

## Team Safety Rules

Do not change the database schema unless asked.

Do not edit package.json unless necessary.

Do not rename routes, files, or variables unless needed.

If a change affects shared files, explain the impact first.

## Learning Rule

Do not just give the final answer.

Explain your reasoning so the student team can understand and present the code.
