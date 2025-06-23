const mongoose = require('mongoose');

const jifenxiangSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  oldjifen: {
    type: Number,
    required: true
  },
  newjifen: {
    type: Number,
    required: true
  },
  totaljifen: {
    type: Number,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Jifenxiang', jifenxiangSchema); 