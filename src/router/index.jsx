import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Study from "../pages/Study/Study.jsx";
import Quan from "../pages/Quan/Quan.jsx";
import Login from "../pages/Login/Login.jsx";
import Jing from "../pages/Jing/Jing.jsx";
import Mine from "../pages/Mine/Mine.jsx";
import Setting from "../pages/Setting/Setting.jsx"; //设置
import AboutUs from "../pages/Setting/AboutUs.jsx"; //关于我们
import Clause from "../pages/Setting/Clause.jsx"; //条款隐私
import MyJifen  from "../pages/ji/MyJifen.jsx";  //我的积分
import JifenShop from "../pages/ji/JifenShop.jsx";  //积分商城
import JifenDui from "../pages/ji/JifenDui.jsx";  //积分兑换成功
import JifenMing from "../pages/ji/JifenMing.jsx";  //积分明细
import JifenLi from "../pages/ji/JifenLi.jsx";     // 积分日历
import ShopMing from "../pages/ji/ShopMing.jsx";   //商品明细
import ShopTi from "../pages/ji/ShopTi.jsx";   //商品兑换
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/study" />,
      },
      {
        path: "/study",
        element: <Study />,
      },
      {
        path: "/quan",
        element: <Quan />,
      },
      {
        path: "/jing",
        element: <Jing />,
      },
      {
        path: "/mine",
        element: <Mine />,
      },

    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:'/setting',
    element:<Setting/>
  },
  {
    path:"/aboutus",
    element:<AboutUs/>
  },
  {
    path:"/clause",
    element:<Clause/>
  },
  {
    path:"/myjifen",
    element:<MyJifen/>
  },
  {
    path:"/jifenshop",
    element:<JifenShop/> 
  },
  {
    path:"/jifendui",
    element:<JifenDui/>
  },
  {
    path:"/jifenming",
    element:<JifenMing/> 
  },
  {
    path:"/jifenli",
    element:<JifenLi/> 
  },
  {
    path:"/shopming",
    element:<ShopMing/> 
  },
  {
    path:"/shopti",
    element:<ShopTi/> 
  }
]);

export default router;
