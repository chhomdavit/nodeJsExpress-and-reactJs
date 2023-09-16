import React, { useEffect, useState } from "react";
import {  DownOutlined,  
          InboxOutlined,
          LogoutOutlined,
          MenuUnfoldOutlined,
          } from '@ant-design/icons';
import { AiTwotoneHome,AiOutlineShopping,AiOutlineUser,AiFillAppstore } from "react-icons/ai";
import {  Avatar, Button, Dropdown, Layout, Menu} from 'antd';
import { useNavigate,} from "react-router-dom";
import{Config} from '../../util/service'
import "./Dashboard.css";

const {  Sider } = Layout;

const Dashboard = (props) => {
  
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const isLogin = localStorage.getItem("is_login") === "1"

  useEffect(()=>{
    if(!isLogin){
      navigate("/login")
    }
  },[isLogin, navigate])


  const handleClickMenu = (item) => {
    navigate(item.key)
  }

  const handleLogout = () => {
    localStorage.setItem("is_login","0")
    window.location.href = "/login"
  }
 
  const menuSiderBar = [
    {
      key: '/dashboard',
      icon: <AiTwotoneHome />,
      label: 'Home',
    },
    {
      key: '/dashboard/product',
      icon: <AiOutlineShopping />,
      label: 'Prodcut',
    },
    {
      key: '/dashboard/AdminUser',
      icon: <AiOutlineUser />,
      label: 'Admin-User',
    },
    {
      key: '/dashboard/category',
      icon: <AiFillAppstore />,
      label: 'Category',
    },
    {
      key: '/dashboard/upload-image',
      icon: <InboxOutlined />,
      label: 'Upload-Image',
    }
    ,
    {
      key: '/dashboard/multiple-image',
      icon: <InboxOutlined />,
      label: 'MultipleImage',
    }
    ,
    {
      key: '/dashboard/employee',
      icon: <InboxOutlined />,
      label: 'Employee',
    }
  ]
  
  const menuUser = [
    {
      key: '1',
      label: (
        <a  rel="" href="#1">
          profile
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a rel="" href="#2">
          change password
        </a>
      ),
    },{
      key: '3',
      label: (
        <a rel="" href="/">
          logout
        </a>
      ),
      icon : <LogoutOutlined/>,
      onClick : handleLogout
    },
  ]
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logoLayoutOne">
            <div className={`${collapsed ? "profileContainAnimate" : "profileContain"}`}>
              <h6 style={{ display:"flex",justifyContent:"center",marginTop:'30px'}} >LOGO & Title</h6>
            </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuSiderBar}
          onClick={handleClickMenu}
        />
      </Sider>

      <Layout className="site-layout">
        <div className="headerLayoutOne">
          <MenuUnfoldOutlined
            style={{ fontSize: 26, paddingLeft: 20 }}
            onClick={() => setCollapsed(!collapsed)}/>
          <div>
            <Dropdown
              style={{ width: 150 }}
              menu={{ items: menuUser }}
              placement="bottomLeft">
              <Button type="link" className={"iconProfile"}>
                <Avatar src={Config.imagePath + user.image_admin}/>&nbsp;
                {user.firstname} {user.lastname}
                <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>

        <div className="mainBody">
          {props.children}
        </div>
      </Layout>
    </Layout>
  );
};

export default Dashboard;