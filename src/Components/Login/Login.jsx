import React from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import "./Login.css";
import axios from "axios";

function Login({ onLogin }) {
  const handleLogin = async (values) => {
    try {
      const response = await axios.post("http://172.23.198.45:3500/api/login", {
        username: values.username,
        password: values.password,
      });
      
   
      const { role } = response.data; // Assuming API returns { role: 'admin' or 'user' }
      if (role === "admin" || role === "user") {
        onLogin(role);
        message.success(
          `Logged in as ${role.charAt(0).toUpperCase() + role.slice(1)}`
        );
      } else {
        message.error("Invalid role received from server");
      }
      localStorage.setItem("c-token",response.data.token)
    } catch (error) {
        console.log('error: ', error);
      message.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <>
      <div className="loginParent">
        <h1 className="loginTitle">Login</h1>
        <Form layout="vertical" onFinish={handleLogin} className="loginForm">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="loginButton">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default Login;
