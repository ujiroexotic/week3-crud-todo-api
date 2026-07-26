require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Handle malformed JSON errors from express.json()
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    next(err);
});

let todos = [
    {id: 1, task: 'Learn Express', completed: false},
    {id: 2, task: 'Build Todo API', completed: true},
];

// GET all todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// GET a single todo by ID
app.get('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Todo not found');
    res.json(todo);
});

// POST a new todo
app.post('/todos', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }

    const newTodo = {
        id: todos.length + 1,
        task,
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json({
        request: req.body,
        todo: newTodo
    });
});

// PUT to update a todo by ID
app.put('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({error: 'Todo not found'});

    todo.task = req.body.task || todo.task;
    if (req.body.completed !== undefined) {
        todo.completed = req.body.completed;
    }

    res.json({
        request: req.body,
        todo
    });
});

// DELETE a todo by ID
app.delete('/todos/:id', (req, res) => {
    const index = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({error: 'Todo not found'});

    todos.splice(index, 1);
    res.json({message: 'Todo deleted successfully'});
});

// Bonus
app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter(todo => !todo.completed);
    res.json(activeTodos);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});