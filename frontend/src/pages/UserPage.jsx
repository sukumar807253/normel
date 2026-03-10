import React, { useState } from 'react';
import { Form, Input, Button, Card, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const UserPage = ({ user }) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState(user.file_url || null);

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('mobile', values.mobile);

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/members/${user.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      message.success('Profile updated successfully!');
      // Update local storage and display
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentFileUrl(response.data.file_url || currentFileUrl);
      setSelectedFile(null);
      setFileList([]);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('An error occurred during update');
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: () => {
      setSelectedFile(null);
      setFileList([]);
    },
    beforeUpload: (file) => {
      setSelectedFile(file);
      setFileList([file]);
      return false; // Stop automatic upload
    },
    fileList,
    maxCount: 1,
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '30px 0' }}>
      <Card title="My Profile" style={{ width: 520, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <Form
          form={form}
          name="user_profile"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: user.name,
            mobile: user.mobile,
          }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="Mobile Number"
            rules={[{ required: true, message: 'Please input your mobile number!' }]}
          >
            <Input placeholder="Enter mobile number" />
          </Form.Item>

          <Form.Item label="Upload Document">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Select File to Upload</Button>
            </Upload>
          </Form.Item>

          {currentFileUrl && (
            <div style={{ marginBottom: '16px', padding: '10px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }}>
              <strong>Current Document: </strong>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => window.open(currentFileUrl, '_blank')}
              >
                📄 Open File
              </Button>
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserPage;
