const {Schema, model} = require('mongoose');

const course = new Schema({
    title:  {
        type: String,
        required: true
    },
    price:  {
        type: Number,
        required: true
    },
    image: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

course.method('toClient', function () {
    const cour = this.toObject;
    cour.id = cour._id;
    delete cour._id;
    return cour;
})

module.exports = model('Course', course);