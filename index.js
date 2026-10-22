const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

require('dotenv').config({
    path: envFile
});
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const todosArr = require("./todos");

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

app.get("/todos", (req, res) => {
    res.json(todosArr);
});

app.get("/todos/:id/", (req, res) => {

    const todoId=parseInt(req.params.id) ;
    const todo=todosArr.find((t)=>t.id  === todoId);
    res.json(todo);

    // res.send(req.params.id);
    // res.send(req.query);         
    // other way to show the status and also ascending and sorted data 
});

app.post('/todos',(req,res)=>{
    const todo=req.body;


    if (!todo) {
        return res.status(400).json({
            message: "Request body is required!"
        });
    }

    if(!todo.task){

       return  res.status(400).json({message:"Task is required!"})
    }
    if(!todo.tags){

       return  res.status(400).json({message:"tags is required!"})
    }
    if(!todo.status){

       return  res.status(400).json({message:"status is required!"})
    }
    const newTodo={
        id:todosArr[todosArr.length - 1].id +  1,
        task:todo,
        tags:todo.tags,
        status:todo.status
    }
    todosArr.push(newTodo)
    res.status(201).json(newTodo);

});

app.put('/todos/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const { task, tags, status } = req.body;

    const todoIndex = todosArr.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({
            message: "Todo not found!"
        });
    }

    if (task) {
        todosArr[todoIndex].task = task;
    }

    if (tags) {
        todosArr[todoIndex].tags = tags;
    }

    if (status) {
        todosArr[todoIndex].status = status;
    }

    res.json(todosArr[todoIndex]);
});

app.delete("/todos/:id", (req, res)=>{
    const id =parseInt(req.params.id);

    const todoIndex = todosArr.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({
            message: "Todo not found!"
        });
    }

    todosArr.splice(todoIndex, 2)
    res.json({message:"Todo deleted Successfully"})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}....`);
});



// if we get any error in any middle ware then 
// other middleware can not be runnable 