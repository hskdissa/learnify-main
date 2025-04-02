const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
