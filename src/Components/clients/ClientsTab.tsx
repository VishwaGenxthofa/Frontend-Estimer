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
  Input,
  Descriptions,
  Dropdown,
} from 'antd';

import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import toast, { Toaster } from 'react-hot-toast';
import type { Client } from '../../types/Index';
const ClientsTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, loading } = useSelector((state: RootState) => state.clients);

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    dispatch(fetchClients({ page: 2, pageSize: 20 }));
  }, [dispatch]);

  // ================= DELETE =================
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

  // ================= EDIT =================
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  // ================= VIEW =================
  const handleView = (client: Client) => {
    Modal.info({
      title: 'Client Details',
      width: 600,
      content: (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="ID">{client.clientId}</Descriptions.Item>
          <Descriptions.Item label="Name">{client.clientName}</Descriptions.Item>
          <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{client.phone}</Descriptions.Item>
          <Descriptions.Item label="Address">{client.address}</Descriptions.Item>
          <Descriptions.Item label="Status">
            {client.isActive ? (
              <Tag color="green">Active</Tag>
            ) : (
              <Tag color="red">Inactive</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      ),
    });
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: 'ID',
      dataIndex: 'clientId',
      key: 'clientId',
    },
    {
      title: 'Name',
      dataIndex: 'clientName',
      key: 'clientName',
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={confirm}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={confirm} size="small">
              Search
            </Button>
            <Button onClick={clearFilters} size="small">
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: string, record: Client) =>
        record.clientName
          ?.toLowerCase()
          .includes(value.toLowerCase()),
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
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: boolean, record: Client) =>
        record.isActive === value,
      render: (active: boolean) =>
        active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Client) => {
        const menuItems = [
          {
            key: 'view',
            label: (
              <span onClick={() => handleView(record)}>
                <EyeOutlined /> View
              </span>
            ),
          },
          {
            key: 'edit',
            label: (
              <span onClick={() => handleEdit(record)}>
                <EditOutlined /> Edit
              </span>
            ),
          },
          {
            key: 'delete',
            label: (
              <span onClick={() => handleDelete(record.clientId)}>
                <DeleteOutlined style={{ color: 'red' }} /> Delete
              </span>
            ),
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
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

      {/* Table */}
      <Table 
        columns={columns}
        dataSource={clients}
        rowKey="clientId"
        loading={loading}
        pagination={{ pageSize:10, }}
        scroll={{ x: 700 }}
        className="shadow"
      />

      {/* Add / Edit Modal */}
      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          editingClient={editingClient}
          refreshClients={() => dispatch(fetchClients({ page: 2, pageSize: 20 }))}
        />
      )}
    </div>
  );
};

export default ClientsTab;
