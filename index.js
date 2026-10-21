const express = require("express");
const app = express();
// const morgan= require("morgan");
// const helmet= require("helmet");


const todosArr = [
    {
        id: 1,
        task: "create all project 1",
        tags: ["nodejs", "javascript"],
        status: "todo"
    },
    {
        id: 2,
        task: "create all project 1",
        tags: ["nodejs"],
        status: "todo"
    },
    {
        id: 3,
        task: "create all project 1",
        tags: ["done"],
        status: "todo"
    }
];

// app.use(helmet())
app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // app.use(express.static("public"))               make file accessable publicaly
    app.use("/avatar",express.static("public") );  
    //  make file accessable under avatar folder
      app.use("/profile", express.static("assets"));

      console.log(`Process Env ${process.env.NODE_Env}`);   

      // app.use(morgan("dev"))

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