import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Table,
  Popconfirm,
  message,
  Modal,
  Radio,
} from "antd";
import axios from "axios";
import "./Admin.css";

const API_BASE = "http://172.23.198.45:3500/api";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("c-token")}`,
  },
});

const AdminManagement = ({ setUserRole }) => {
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/users`, getAuthHeaders());
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreateUser = async (values) => {
    try {
      await axios.post(
        `${API_BASE}/register`,
        {
          username: values.username,
          password: values.password,
          role: values.role,
        },
        getAuthHeaders()
      );
      message.success("User registered successfully");
      form.resetFields();
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error("Registration failed:", error);
      message.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE}/users/${id}`, getAuthHeaders());
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete user");
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("c-token");
    setUserRole(null); // Reset userRole to null
    navigate("/");
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => role.charAt(0).toUpperCase() + role.slice(1),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="adminContainer">
      <h1 className="adminTitle">
        User Management
        <Button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </h1>

      <div className="actionContainer">
        <Button type="primary" onClick={showModal} className="createButton">
          Create New User
        </Button>
      </div>

      <Modal
        title="Create User"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="createUserModal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
          className="userForm"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter the username" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter the password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Radio.Group>
              <Radio value="user">User</Radio>
              <Radio value="admin">Admin</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="submitButton">
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className="tableContainer">
        <h2 className="sectionTitle">User List</h2>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={false}
          className="userTable"
        />
      </div>
    </div>
  );
};

export default AdminManagement;