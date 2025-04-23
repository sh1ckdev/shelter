const { Schema, model } = require('mongoose');

const newsSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now },
    isEvent: { type: Boolean, default: false },
    eventDate: { type: Date },
    isPublished: { type: Boolean, default: true }
});

module.exports = model('News', newsSchema); 