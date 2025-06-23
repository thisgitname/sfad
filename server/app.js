const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/qian', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB连接成功');
}).catch(err => {
  console.error('MongoDB连接失败:', err);
});

// 导入模型
const Jifenxiang = require('./models/jifenxiang');
const Signin = require('./models/signin');

// 路由
const jifenxiangRouter = require('./routes/jifenxiang');
app.use('/api/jifenxiang', jifenxiangRouter);

// 签到相关路由
app.post('/api/signin', async (req, res) => {
  try {
    const { userid } = req.body;
    
    // 获取今天的开始时间
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 检查今天是否已签到
    const existingSignin = await Signin.findOne({
      userid,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (existingSignin) {
      return res.status(400).json({
        code: 400,
        msg: '今天已经签到过了'
      });
    }
    
    // 创建签到记录
    const signin = new Signin({
      userid,
      date: new Date(),
      points: 2
    });
    await signin.save();
    
    // 更新积分
    const lastRecord = await Jifenxiang.findOne({ userid }).sort({ time: -1 });
    const oldJifen = lastRecord ? lastRecord.totaljifen : 0;
    const newJifen = oldJifen + 2;
    
    const newRecord = new Jifenxiang({
      userid,
      title: '每日签到奖励',
      oldjifen: oldJifen,
      newjifen: 2,
      totaljifen: newJifen,
      time: new Date()
    });
    await newRecord.save();
    
    res.json({
      code: 200,
      data: {
        newJifen,
        message: '签到成功'
      }
    });
  } catch (error) {
    console.error('签到失败:', error);
    res.status(500).json({
      code: 500,
      msg: '签到失败'
    });
  }
});

// 获取用户签到记录
app.get('/api/signin/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    
    // 获取最近5天的签到记录
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fiveDaysAgo = new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000);
    
    const signins = await Signin.find({
      userid,
      date: {
        $gte: fiveDaysAgo,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).sort({ date: -1 });
    
    res.json({
      code: 200,
      data: signins
    });
  } catch (error) {
    console.error('获取签到记录失败:', error);
    res.status(500).json({
      code: 500,
      msg: '获取签到记录失败'
    });
  }
});

// 积分相关路由
app.get('/ss/jifen/total', async (req, res) => {
  try {
    const { userid } = req.query;
    const result = await Jifenxiang.find({ userid }).sort({ time: -1 }).limit(1);
    
    if (result.length > 0) {
      res.json({
        code: 200,
        data: {
          total: result[0].totaljifen
        }
      });
    } else {
      res.json({
        code: 200,
        data: {
          total: 0
        }
      });
    }
  } catch (error) {
    console.error('获取积分失败:', error);
    res.status(500).json({
      code: 500,
      msg: '获取积分失败'
    });
  }
});

app.post('/ss/jifen/change', async (req, res) => {
  try {
    const { userid, value, title } = req.body;
    
    // 获取最新积分记录
    const lastRecord = await Jifenxiang.findOne({ userid }).sort({ time: -1 });
    const oldJifen = lastRecord ? lastRecord.totaljifen : 0;
    const newJifen = oldJifen + value;
    
    // 创建新记录
    const newRecord = new Jifenxiang({
      userid,
      title,
      oldjifen: oldJifen,
      newjifen: value,
      totaljifen: newJifen,
      time: new Date()
    });
    
    await newRecord.save();
    
    res.json({
      code: 200,
      data: {
        newJifen
      }
    });
  } catch (error) {
    console.error('积分变更失败:', error);
    res.status(500).json({
      code: 500,
      msg: '积分变更失败'
    });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 