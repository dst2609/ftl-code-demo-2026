# Good Practices for Using CLAUDE.md in Team Projects

## 1. Treat CLAUDE.md like a team agreement

`CLAUDE.md` should explain how Claude Code should help your team.

It should include:

- What the project is
- What tech stack you are using
- How the code is organized
- What style the team wants
- What Claude should do before editing
- What Claude should avoid doing
- How Claude should explain changes

This helps the whole team get consistent support from Claude Code.

---

## 2. Keep CLAUDE.md clear and specific

Avoid vague instructions like:

“Help us write good code.”

Better:

“Before editing code, inspect the relevant files, explain the issue, suggest a short plan, and make the smallest reasonable change.”

Good instructions are specific enough that Claude knows how to behave.

---

## 3. Include the project structure

Claude Code works better when it understands how your app is organized.

Example:

```txt
Project structure:

client/
- React frontend
- components/
- pages/
- services/api.js

server/
- Express backend
- routes/
- controllers/
- db/
- server.js

database/
- schema.sql
- seed.sql
```

This helps Claude know where to look first.

---

## 4. Include team coding rules

The team should agree on coding expectations.

Example:

```txt
Coding rules:

- Use beginner-friendly JavaScript.
- Use async/await for backend code.
- Keep components small and readable.
- Do not add new libraries unless the team agrees.
- Follow the existing folder structure.
- Use clear variable names.
- Make the smallest change needed to solve the problem.
```

This keeps Claude from overengineering the project.

---

## 5. Tell Claude how to handle bugs

Bug fixes should follow a clear process.

Example:

```txt
When debugging:

1. Read the error message.
2. Identify where the error is happening.
3. Trace the flow across the stack.
4. Check the frontend request.
5. Check the Express route.
6. Check the controller logic.
7. Check the database query.
8. Suggest the smallest fix.
9. Explain how to test it.
```

This is especially useful in PERN projects because bugs often happen between the frontend, backend, and database.

---

## 6. Tell Claude not to make big surprise changes

This is very important for team projects.

Add something like:

```txt
Do not rewrite large parts of the project without asking first.

Do not change the project architecture unless requested.

Do not rename files, routes, variables, or database columns unless necessary.

Do not install new packages without explaining why they are needed.

Do not modify shared files like server.js, package.json, or schema.sql without explaining the impact.
```

This prevents Claude from accidentally breaking a teammate’s work.

---

## 7. Include shared-file rules

Some files affect the whole team.

Example:

```txt
Shared files:

- package.json
- server.js
- app.jsx
- database schema files
- routes/index.js
- .env.example

Before changing these files, explain the reason and possible impact.
```

This helps students understand that some changes are riskier than others.

---

## 8. Require explanations after changes

Claude should not just edit code and stop.

Add this expectation:

```txt
After making changes, always explain:

1. What files changed
2. What code changed
3. Why the change was needed
4. How the fix works
5. How the team can test it
```

This supports learning and makes code review easier.

---

## 9. Use CLAUDE.md to protect learning

Students should not use Claude Code to skip understanding.

Add a student-centered rule:

```txt
This is a learning project.

When helping, explain concepts clearly.

Do not complete large features without explaining the full flow.

When writing code, include a short explanation of how the frontend, backend, and database connect.

The student team should be able to explain all accepted code.
```

---

## 10. Update CLAUDE.md as the project evolves

`CLAUDE.md` should not stay frozen.

Update it when the team adds:

- New folders
- New routes
- New database tables
- New naming conventions
- New project rules
- New team decisions

Example:

```txt
Update:
All API calls should now go through client/src/services/api.js.
Do not write fetch or axios calls directly inside components unless the team agrees.
```

---

# Sample Team CLAUDE.md Section

```md
# CLAUDE.md

## Project Context

This is a PERN stack team project for a full-stack development course.

The app uses:

- PostgreSQL for the database
- Express.js for the backend
- React for the frontend
- Node.js as the runtime

This is a student learning project, so explanations should be beginner-friendly and connected to full-stack concepts.

---

## Team Expectations

Before editing code:

1. Inspect the relevant files.
2. Explain what you found.
3. Suggest a short plan.
4. Make the smallest reasonable change.

After editing code:

1. List the files changed.
2. Explain what changed.
3. Explain why it works.
4. Suggest how to test it.

---

## Coding Style

- Use clear, beginner-friendly JavaScript.
- Use async/await for backend code.
- Use meaningful variable names.
- Keep React components readable.
- Do not add new libraries unless necessary.
- Follow the existing folder structure.
- Prefer small changes over large rewrites.

---

## Team Safety Rules

Do not rewrite the whole project.

Do not change the database schema unless specifically asked.

Do not rename routes, files, or variables unless necessary.

Do not edit package.json without explaining why.

Do not modify shared files without explaining the impact.

If a change may affect teammates, explain the risk before editing.

---

## PERN Debugging Process

When debugging, trace the full-stack flow:

React component  
→ API call  
→ Express route  
→ Controller logic  
→ PostgreSQL query  
→ Response back to React

When fixing a bug, explain where the issue happened in this flow.

---

## Learning Rule

Do not just give the final answer.

Explain the reasoning in simple language so the team can understand and present the code themselves.
```

---

# Quick Student Reminder

`CLAUDE.md` does not replace good prompting.

It gives Claude Code the default rules for the project.

Students should still write clear prompts like:

```txt
Using our CLAUDE.md guidelines, help me debug why the Create Post form is not saving to the database.

Please inspect the frontend form, backend route, controller, and database query before editing.
```
