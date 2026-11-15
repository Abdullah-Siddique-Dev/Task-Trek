const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: [true, 'Task is required!'],
        trim: true
    },
    tags: {
        type: [String],
        required: [true, 'Tags are required!'],
        validate: {
            validator: function(arr) {
                return arr.length > 0;
            },
            message: 'At least one tag is required!'
        }
    },
    status: {
        type: String,
        required: [true, 'Status is required!'],
        enum: {
            values: ['todo', 'in-progress', 'done'],
            message: 'Status must be todo, in-progress, or done'
        },
        default: 'todo'
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt
});



app.get ("/todos/tag/:tagName", async (req, res)=>{
    try {
        const tagName = req.params.tagName;

        const todos = await Todo.find({tags: tagName});


        res.json(todos);
    }
    catch(error){
        res.status(500).json({
            message:"Error fetching todos by tag",
            error:error.message
        });
    }
})



app.get("todos/search", async (req, res)=>{
    try{
        const {tag, status}= req.query;

        const filter={};
        if (status) filter.status=status;

        const todos= await Todo.find(filter);
        res.json(todos);

    }
    catch(error){

        res.status(500).json({
            message:"Error searching todos",
            error:error.message
        })
    }
})


app.get("/todos/count/done", async (req, res) => {
    try {
        const count = await Todo.countDocuments({ status: "done" });
        res.json({
            status: "done",
            count: count
        });
    } catch (error) {
        res.status(500).json({
            message: "Error counting todos",
            error: error.message
        });
    }
});



app.get("/todos/search/create", async (req, res) => {
    try {
        const todos = await Todo.find({
            task: { $regex: "Create", $options: "i" }
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({
            message: "Error searching todos",
            error: error.message
        });
    }
});

module.exports = mongoose.model('Todo', todoSchema);
''

module.exports =Todo