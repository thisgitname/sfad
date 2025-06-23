import React, { useEffect, useState } from 'react'
import Navbar from '../component/Navbar'
import { Button, Toast, TextArea, Input } from 'antd-mobile'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './Jifen.module.css'

export default function ShopTi() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

  const [user, setUser] = useState({ name: '', phone: '', address: '' });
  const [goods, setGoods] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [remark, setRemark] = useState('');
  const [count, setCount] = useState(1);

  // 获取用户信息（可根据实际情况调整）
  useEffect(() => {
    // 假设用户信息保存在localStorage
    const name = localStorage.getItem('username') || '张三';
    const phone = localStorage.getItem('userphone') || '155****1111';
    const address = localStorage.getItem('useraddress') || '地址地址地址地址地址地址地址地址地址地址地址 8栋0801';
    setUser({ name, phone, address });
  }, []);

  // 获取商品信息
  useEffect(() => {
    if (!id) {
      setError('未找到商品ID');
      setLoading(false);
      return;
    }
    axios.get(`http://localhost:3000/ss?_id=${id}`)
      .then(res => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          setGoods(res.data.data[0]);
        } else {
          setError('未找到商品信息');
        }
      })
      .catch(() => {
        setError('获取商品信息失败');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 处理数量变化
  const handleCountChange = (value) => {
    const num = parseInt(value);
    if (isNaN(num)) {
      setCount(1);
      return;
    }
    if (num < 1) {
      Toast.show({ icon: 'fail', content: '最小数量为1' });
      setCount(1);
      return;
    }
    if (num > 99) {
      Toast.show({ icon: 'fail', content: '最大数量为99' });
      setCount(99);
      return;
    }
    setCount(num);
  };

  // 处理数量增减
  const handleCountAdjust = (delta) => {
    const newCount = count + delta;
    if (newCount < 1) {
      Toast.show({ icon: 'fail', content: '最小数量为1' });
      return;
    }
    if (newCount > 99) {
      Toast.show({ icon: 'fail', content: '最大数量为99' });
      return;
    }
    setCount(newCount);
  };

  // 生成订单
  const handleOrder = async () => {
    if (!goods) return;
    if (count < 1) return;
    setSubmitting(true);
    try {
      const userid = localStorage.getItem('userid');
      if (!userid) {
        Toast.show({ icon: 'fail', content: '请先登录' });
        setSubmitting(false);
        return;
      }
      // 这里补充所有参数
      const res = await axios.post('http://localhost:3000/ss/order/create', {
        userid,
        goodsid: goods._id,
        goodsname: goods.name,
        img: goods.img,
        price: goods.price * count, // 总积分
        unitPrice: goods.price, // 单价
        count,
        username: user.name,
        phone: user.phone,
        address: user.address,
        remark: remark || '',
        yunfei: 0 // 运费
      });
      if (res.data && res.data.code === 200) {
        Toast.show({ icon: 'success', content: '兑换成功！' });
        setTimeout(() => {
          navigate('/jifendui');
        }, 1200);
      } else {
        Toast.show({ icon: 'fail', content: res.data.msg || '兑换失败' });
      }
    } catch (err) {
      Toast.show({ icon: 'fail', content: '兑换失败，请稍后重试' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.shoptiPage}>
        <div className={styles.navbar}><Navbar title="提交订单"/></div>
        <div className={styles.loading}>加载中...</div>
      </div>
    )
  }
  if (error) {
    return (
      <div className={styles.shoptiPage}>
        <div className={styles.navbar}><Navbar title="提交订单"/></div>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    )
  }

  return (
    <div className={styles.shoptiPage}>
      <div className={styles.navbar}><Navbar title="提交订单"/></div>
      {/* 顶部蓝色背景和白色卡片包裹地址 */}
      <div className={styles.shoptiTopBg}>
        <div className={styles.shoptiAddrCard}>
          <div className={styles.shoptiAddrIcon}>
            {/* 定位图标SVG */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 6.25 8.75 6.53 8.9.3.16.64.16.94 0C10.75 17.75 17 14.25 17 9c0-3.87-3.13-7-7-7zm0 11.5c-2.48 0-4.5-2.02-4.5-4.5S7.52 4.5 10 4.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7A2.5 2.5 0 1 0 10 11a2.5 2.5 0 0 0 0-5z" fill="#1677ff"/></svg>
          </div>
          <div className={styles.shoptiAddrInfo}>
            <div className={styles.shoptiAddrUser}><span>{user.name}</span> <span className={styles.shoptiAddrPhone}>{user.phone}</span></div>
            <div className={styles.shoptiAddrDetail}>{user.address}</div>
          </div>
          <div className={styles.shoptiAddrArrow}>›</div>
        </div>
      </div>
      {/* 商品卡片 */}
      <div className={styles.shoptiGoodsCard}>
        <div className={styles.shoptiGoodsItem}>
          <img src={goods.img} alt={goods.name} className={styles.shoptiGoodsImg}/>
          <div className={styles.shoptiGoodsDetail}>
            <div className={styles.shoptiGoodsName}>{goods.name}</div>
            <div className={styles.shoptiGoodsPrice}><span>{goods.price}</span><span className={styles.shoptiGoodsPriceUnit}>积分</span></div>
            <div className={styles.shoptiGoodsCount}>
              <button onClick={() => handleCountAdjust(-1)} style={{marginRight:8}}>-</button>
              <Input
                type='number'
                value={count.toString()}
                onChange={handleCountChange}
                style={{
                  width: '50px',
                  textAlign: 'center',
                  padding: '0 4px'
                }}
              />
              <button onClick={() => handleCountAdjust(1)} style={{marginLeft:8}}>+</button>
            </div>
          </div>
        </div>
      </div>
      {/* 留言输入框 */}
      <div className={styles.shoptiRemarkBox}>
        <TextArea
          className={styles.shoptiRemark}
          placeholder="给买家留言"
          value={remark}
          onChange={setRemark}
          maxLength={50}
          rows={2}
          showCount
        />
      </div>
      {/* 订单信息 */}
      <div className={styles.shoptiInfoCard}>
        <div className={styles.shoptiInfoRow}>
          <span>所需积分</span>
          <span className={styles.shoptiInfoValue}>{goods.price * count}积分</span>
        </div>
        <div className={styles.shoptiInfoRow}>
          <span>运费</span>
          <span className={styles.shoptiInfoValue}>￥0.00</span>
        </div>
      </div>
      {/* 底部按钮 */}
      <div className={styles.shoptiBtnBox}>
        <Button block color='primary' size='large' loading={submitting} onClick={handleOrder} disabled={submitting}>
          立即兑换
        </Button>
      </div>
    </div>
  )
}
