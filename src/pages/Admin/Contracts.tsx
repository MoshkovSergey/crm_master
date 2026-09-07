import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, Form, Input, Select, Row, Col, DatePicker, InputNumber, Badge, Progress } from 'antd';
import { PlusOutlined, FileTextOutlined, DownloadOutlined, EyeOutlined, EditOutlined, BellOutlined } from '@ant-design/icons';
import { mockContracts } from '../../data/mockData';
import { Contract, ContractStatus, ContractType } from '../../types';

const { Title, Text } = Typography;

const statusConfig: Record<ContractStatus, { color: string; label: string }> = {
  active: { color: 'green', label: 'Действующий' },
  expired: { color: 'red', label: 'Истёк' },
  terminated: { color: 'default', label: 'Расторгнут' },
};

const typeLabels: Record<ContractType, string> = {
  subscription: 'Абонентский',
  one_time: 'Разовый',
};

export default function ContractsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockContracts.filter(c => statusFilter === 'all' || c.status === statusFilter);

  const columns = [
    { title: 'Номер', dataIndex: 'number', key: 'number', width: 120, render: (v: string) => <a>{v}</a> },
    { title: 'Клиент', dataIndex: 'clientName', key: 'clientName', ellipsis: true },
    { title: 'Тип', dataIndex: 'type', key: 'type', width: 120, render: (v: ContractType) => <Tag>{typeLabels[v]}</Tag> },
    { title: 'Статус', dataIndex: 'status', key: 'status', width: 120, render: (v: ContractStatus) => <Tag color={statusConfig[v].color}>{statusConfig[v].label}</Tag> },
    { title: 'Период', key: 'period', width: 200, render: (_: unknown, r: Contract) => `${new Date(r.startDate).toLocaleDateString('ru')} — ${new Date(r.endDate).toLocaleDateString('ru')}` },
    { title: 'Сумма', dataIndex: 'amount', key: 'amount', width: 130, render: (v: number) => <Text strong>{v.toLocaleString()} ₽</Text> },
    {
      title: 'Истечение', key: 'expiry', width: 120,
      render: (_: unknown, r: Contract) => {
        const days = Math.ceil((new Date(r.endDate).getTime() - Date.now()) / 1000 / 86400);
        if (days < 0) return <Tag color="red">Истёк</Tag>;
        if (days < 30) return <Tag color="orange">{days} дн.</Tag>;
        return <Tag color="green">{days} дн.</Tag>;
      },
    },
    {
      title: '', key: 'actions', width: 100,
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<DownloadOutlined />} />
        </Space>
      ),
    },
  ];

  const totalActive = mockContracts.filter(c => c.status === 'active').reduce((a, b) => a + b.amount, 0);
  const totalMonthly = mockContracts.filter(c => c.status === 'active').reduce((a, b) => a + (b.monthlyAmount || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>Договоры</Title>
          <Text type="secondary">Управление договорами и абонентским обслуживанием</Text>
        </div>
        <Space>
          <Button icon={<FileTextOutlined />}>Шаблон</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>Новый договор</Button>
        </Space>
      </div>

      {/* Summary */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Text type="secondary">Активных</Text>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{mockContracts.filter(c => c.status === 'active').length}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Text type="secondary">Истекают (30 дн.)</Text>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#faad14' }}>{mockContracts.filter(c => { const d = Math.ceil((new Date(c.endDate).getTime() - Date.now()) / 1000 / 86400); return d >= 0 && d < 30; }).length}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Text type="secondary">Общая сумма</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{(totalActive / 1000000).toFixed(1)}M ₽</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Text type="secondary">Ежемесячно</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{(totalMonthly / 1000).toFixed(0)}K ₽</div>
          </Card>
        </Col>
      </Row>

      <Card size="small" extra={
        <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }} options={[
          { value: 'all', label: 'Все статусы' },
          { value: 'active', label: 'Действующие' },
          { value: 'expired', label: 'Истёкшие' },
          { value: 'terminated', label: 'Расторгнутые' },
        ]} />
      }>
        <Table dataSource={filtered} columns={columns} rowKey="id" size="small" pagination={{ pageSize: 10 }} scroll={{ x: 1000 }} />
      </Card>

      <Modal title="Новый договор" open={modalOpen} onCancel={() => setModalOpen(false)} width={600} okText="Создать">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Номер"><Input placeholder="Д-2026-XXX" /></Form.Item></Col>
            <Col span={12}><Form.Item label="Тип"><Select options={[{ value: 'subscription', label: 'Абонентский' }, { value: 'one_time', label: 'Разовый' }]} /></Form.Item></Col>
          </Row>
          <Form.Item label="Клиент"><Select placeholder="Выберите клиента" /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Дата начала"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item label="Дата окончания"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Сумма договора"><InputNumber prefix="₽" style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item label="Ежемесячно"><InputNumber prefix="₽" style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Form.Item label="Системы"><Select mode="multiple" options={['Видеонаблюдение', 'ОПС', 'СКУД', 'СКС', 'Дымоудаление', 'Оповещение'].map(s => ({ value: s, label: s }))} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
