const express = require('express');
const router = express.Router();
const Jifenxiang = require('../models/jifenxiang');

// 检查用户是否有积分记录
router.get('/check/:userid', async (req, res) => {
  try {
    const userid = req.params.userid;
    const count = await Jifenxiang.countDocuments({ userid });
    res.json({ exists: count > 0 });
  } catch (error) {
    console.error('检查积分记录失败:', error);
    res.status(500).json({ message: '检查积分记录失败' });
  }
});

// 初始化用户积分
router.post('/init', async (req, res) => {
  try {
    const { userid, title, oldjifen, newjifen, totaljifen, time } = req.body;
    
    // 检查是否已存在记录
    const exists = await Jifenxiang.findOne({ userid });
    if (exists) {
      return res.status(400).json({ message: '用户已有积分记录' });
    }

    // 创建初始积分记录
    const newJifenxiang = new Jifenxiang({
      userid,
      title,
      oldjifen,
      newjifen,
      totaljifen,
      time: time || new Date()
    });

    await newJifenxiang.save();
    res.status(201).json({ message: '积分初始化成功', data: newJifenxiang });
  } catch (error) {
    console.error('初始化积分失败:', error);
    res.status(500).json({ message: '初始化积分失败' });
  }
});

// ... 其他现有路由保持不变 ...

module.exports = router; 