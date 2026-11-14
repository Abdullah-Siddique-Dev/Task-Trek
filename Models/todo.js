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

module.exports = mongoose.model('Todo', todoSchema);
''

module.exports =Todo