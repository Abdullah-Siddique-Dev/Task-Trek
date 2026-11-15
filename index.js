const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

require('dotenv').config({
    path: envFile
});
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const todosArr = require("./todos");
const Todo = require("./Models/todo");  // Import Todo model

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

console.log(process.env.KEY);ose')


mongoose.connect("").then(()=>{
    console.log("mongodb connected")
}).catch((err)=>{
    console.log("failed",err)
});

console.log(process.env.KEY);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file middleware
app.use("/avatar", express.static("Public"));  // Access via /avatar/ktor.jpg
app.use("/profile", express.static("assets")); // Access via /profile/profile.jpg

// Morgan logging middleware (only in development)
console.log(`Current Environment: ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log("Morgan logging enabled");
}

// Custom logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


app.get("/", (req, res) => {
    res.send("TaskTrek!");
});

app.get("/todos", async (req, res) => {
    try {
        // Fetch all todos from MongoDB
        const todos = await Todo.find();
        
        // Return todos array
        res.json(todos);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching todos",
            error: error.message
        });
    }
});

app.get("/todos/:id/", (req, res) => {

    const todoId=parseInt(req.params.id) ;
    const todo=todosArr.find((t)=>t.id  === todoId);
    res.json(todo);

    // res.send(req.params.id);
    // res.send(req.query);         
    // other way to show the status and also ascending and sorted data 
});

app.post('/todos', async (req, res) => {
    const todo = req.body;

    if (!todo) {
        return res.status(400).json({
            message: "Request body is required!"
        });
    }

    if (!todo.task) {
       return res.status(400).json({message: "Task is required!"})
    }
    if (!todo.tags) {
       return res.status(400).json({message: "Tags are required!"})
    }
    if (!todo.status) {
       return res.status(400).json({message: "Status is required!"})
    }
    
    // Create new todo using MongoDB
    const newTodo = new Todo({
        task: todo.task,
        status: todo.status,
        tags: todo.tags
    });
    
    // Save to database
    const storedTodo = await newTodo.save();
    
    // Return stored data
    res.status(201).json(storedTodo);
});

app.put('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { task, tags, status } = req.body;

        // Build update object with only provided fields
        const updateData = {};
        if (task) updateData.task = task;
        if (tags) updateData.tags = tags;
        if (status) updateData.status = status;

        // Find and update the todo
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        // If todo not found
        if (!updatedTodo) {
            return res.status(404).json({
                message: "Todo not found!"
            });
        }

        // Return updated todo
        res.json(updatedTodo);

    } catch (error) {
        res.status(500).json({
            message: "Error updating todo",
            error: error.message
        });
    }
});

app.put('/todos/update/status', async (req, res) => {
    try {
        // Update all todos with status "doing" to "done"
        const result = await Todo.updateMany(
            { status: "doing" },           // Filter: Find todos with status "doing"
            { status: "done" }             // Update: Change status to "done"
        );

        res.json({
            message: "Todos updated successfully",
            matchedCount: result.matchedCount,     // How many found
            modifiedCount: result.modifiedCount    // How many actually updated
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating todos",
            error: error.message
        });
    }
});


app.delete("/todos/:id", (req, res)=>{
    const id = parseInt(req.params.id);

    const todoIndex = todosArr.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({
            message: "Todo not found!"
        });
    }

    todosArr.splice(todoIndex, 1);  // ✅ FIXED - was: splice(todoIndex, 2)
    res.json({message: "Todo deleted successfully"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}....`);
});

app.delete("/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Find and delete the todo
        const deletedTodo = await Todo.findByIdAndDelete(id);

        // If todo not found
        if (!deletedTodo) {
            return res.status(404).json({
                message: "Todo not found!"
            });
        }

        // Return success message
        res.json({
            message: "Todo deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting todo",
            error: error.message
        });
    }
});


// if we get any error in any middle ware then 
// other middleware can not be runnable 