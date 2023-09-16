import React, { useState } from "react";
import { request } from "../../util/api";
import { Button, Form, message, Input} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "./Login.css";

const Login = () => {
  const [loading,setLoading] = useState(false)
  const onFinish = (fields) => {
    var params = {
      username: fields.username,
      password: fields.password,
    };
    setLoading(true)
    request("post", "employee/login", params).then((res) => {
      console.log(res)
      // return false
      setTimeout(() => {
        setLoading(false)
      }, 1000);
      if (!res.error) {
        localStorage.setItem("is_login","1")
        localStorage.setItem("access_token",res.data.access_token)
        localStorage.setItem("refresh_token",res.data.refresh_token)
        localStorage.setItem("permission",JSON.stringify(res.data.permission))
        localStorage.setItem("user",JSON.stringify(res.data.user))
        window.location.href="/dashboard"
        // localStorage.setItem("is_login", "1");
        // localStorage.setItem("profile", JSON.stringify(res.data.profile));
        // localStorage.setItem("token",res.data.token);
        // window.location.href = "/dashboard";
      } else {
        message.warning(res.data.message);
      }
    });
  };
  return (
    <div className="loging-form">
    <h1>Login</h1>
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: false,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="username" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <div className="login-form-forgot">
        <a href="">Forgot password</a>
      </div>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          loading={loading}
        >
          Log in
        </Button>
        <div>
          Or <a href="">register now!</a>
        </div>
      </Form.Item>
    </Form>
  </div>
  )
}

export default Login;

// import React, { useState } from 'react';
// import { Button, Checkbox, Form, Input,message } from 'antd';
// // import "./LoginDashBoard.css"
// import { request } from '../../share/request';


// const Login = () => {
//   const [loading,setLoading] = useState(false)
//   const onFinish = (values) => {
//     setLoading(true)
//     var param = {
//       "username" : values.username,//"0998887778",
//       "password" : values.password, //"123456"
//     }
//     request("employee_login","post",param).then(res=>{
//       setLoading(false)
//       if(!res.error){
//         localStorage.setItem("isLogin","1")
//         localStorage.setItem("access_token",res.access_token)
//         localStorage.setItem("refresh_token",res.refresh_token)
//         localStorage.setItem("permission",JSON.stringify(res.permission))
//         localStorage.setItem("user",JSON.stringify(res.user))
//         window.location.href="/dashboard"
//       }else{
//         message.error(res.message)
//       }
//     })
//   };
//   const onFinishFailed = (errorInfo) => {
//     console.log('Failed:', errorInfo);
//   };
  

// //   return (
// //     <div className='LoginDashBoardContainer'>
// //       <h1>Login</h1>
// //       <Form
// //         name="basic"
// //         style={{
// //           maxWidth: 600,
// //         }}
// //         initialValues={{
// //           remember: true,
// //         }}
// //         onFinish={onFinish}
// //         onFinishFailed={onFinishFailed}
// //         autoComplete="off"
// //       >
// //         <Form.Item
// //           label="Username"
// //           name="username"
// //           rules={[
// //             {
// //               required: true,
// //               message: 'Please input your username!',
// //             },
// //           ]}
// //         >
// //           <Input />
// //         </Form.Item>
  
// //         <Form.Item
// //           label="Password"
// //           name="password"
// //           rules={[
// //             {
// //               required: true,
// //               message: 'Please input your password!',
// //             },
// //           ]}
// //         >
// //           <Input.Password />
// //         </Form.Item>
        
// //         <Form.Item
// //           style={{textAlign:"right"}}
// //           // wrapperCol={{
// //           //   offset: 12,
// //           //   span: 12,
// //           // }}
// //         >
// //           <Button loading={loading} type="primary" htmlType="submit">
// //             Login
// //           </Button>
// //         </Form.Item>
  
// //       </Form>
// //     </div>
// //   )
  
// // }

// // export default Login;