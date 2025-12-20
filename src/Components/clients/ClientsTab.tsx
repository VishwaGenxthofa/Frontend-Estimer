import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/slices/store';
import { fetchClients, deleteClient } from '../../redux/slices/clientSlice';
import AddClientModal from './AddClientModal';
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import type { Client } from '../../types/Index';

const ClientsTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, loading } = useSelector((state: RootState) => state.clients);

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Client',
      content: 'Are you sure you want to delete this client?',
      okType: 'danger',
      onOk: () => {
        dispatch(deleteClient(id))
          .unwrap()
          .then(() => toast.success('Client deleted successfully'))
          .catch(() => toast.error('Failed to delete client'));
      },
    });
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleView = (client: Client) => {
    Modal.info({
      title: 'Client Details',
      content: (
        <div className="space-y-1">
          <p><b>Name:</b> {client.clientName}</p>
          <p><b>Email:</b> {client.email}</p>
          <p><b>Phone:</b> {client.phone}</p>
          <p><b>Address:</b> {client.address}</p>
          <p>
            <b>Status:</b>{' '}
            {client.isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
          </p>
        </div>
      ),
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'clientName',
      key: 'clientName',
      sorter: (a: Client, b: Client) => a.clientName.localeCompare(b.clientName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) =>
        active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Client) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.clientId)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Clients</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingClient(null);
            setShowModal(true);
          }}
        >
          Add Client
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={clients}
        rowKey="clientId"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 700 }} // mobile friendly scroll
      />

      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          editingClient={editingClient}
          refreshClients={() => dispatch(fetchClients())}
        />
      )}
    </div>
  );
};

export default ClientsTab;
