const mongoose = require('mongoose');

const signinSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  points: {
    type: Number,
    default: 2
  }
});

// 创建复合索引，确保每个用户每天只能签到一次
signinSchema.index({ userid: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Signin', signinSchema); 