const express = require("express");
const router=express.Router();

const Todo=require('../Models/todos')

const newTodo=new Todo({
    task:todosArr.task,
    status:todo.status,
    tags:todo.tags
})
 
res.status(201).json(newTodo);



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

module.exports = todosArr;
