import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, Form, Input, Select, Row, Col, InputNumber, Badge, Progress, Tabs } from 'antd';
import { PlusOutlined, MinusOutlined, SwapOutlined, WarningOutlined, SearchOutlined } from '@ant-design/icons';
import { mockWarehouse } from '../../data/mockData';
import { WarehouseItem } from '../../types';

const { Title, Text } = Typography;

export default function WarehousePage() {
  const [modalType, setModalType] = useState<'in' | 'out' | 'reserve' | null>(null);
  const [searchText, setSearchText] = useState('');

  const filtered = mockWarehouse.filter(w =>
    w.name.toLowerCase().includes(searchText.toLowerCase()) ||
    w.sku.toLowerCase().includes(searchText.toLowerCase())
  );

  const lowStock = mockWarehouse.filter(w => w.quantity - w.reserved <= w.minQuantity);

  const columns = [
    { title: 'Артикул', dataIndex: 'sku', key: 'sku', width: 110 },
    { title: 'Наименование', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Категория', dataIndex: 'category', key: 'category', width: 130, render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Остаток', key: 'quantity', width: 120,
      render: (_: unknown, r: WarehouseItem) => {
        const available = r.quantity - r.reserved;
        const isLow = available <= r.minQuantity;
        return (
          <Space>
            <Text strong style={{ color: isLow ? '#ff4d4f' : undefined }}>{r.quantity}</Text>
            {r.reserved > 0 && <Text type="secondary" style={{ fontSize: 12 }}>(рез. {r.reserved})</Text>}
            {isLow && <WarningOutlined style={{ color: '#ff4d4f' }} />}
          </Space>
        );
      },
    },
    { title: 'Мин.', dataIndex: 'minQuantity', key: 'minQuantity', width: 60, align: 'center' as const },
    { title: 'Ед.', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: 'Цена', dataIndex: 'price', key: 'price', width: 100, render: (v: number) => `${v.toLocaleString()} ₽` },
    { title: 'Ячейка', dataIndex: 'location', key: 'location', width: 80 },
    {
      title: '', key: 'actions', width: 120,
      render: (_: unknown, r: WarehouseItem) => (
        <Space>
          <Button type="text" size="small" icon={<PlusOutlined />} onClick={() => setModalType('in')} title="Оприходовать" />
          <Button type="text" size="small" icon={<MinusOutlined />} onClick={() => setModalType('out')} title="Списать" />
          <Button type="text" size="small" icon={<SwapOutlined />} onClick={() => setModalType('reserve')} title="Резерв" />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>Склад</Title>
          <Text type="secondary">Учёт запчастей и материалов</Text>
        </div>
        <Space>
          <Button icon={<PlusOutlined />} onClick={() => setModalType('in')}>Оприходовать</Button>
          <Button type="primary" icon={<PlusOutlined />}>Новая позиция</Button>
        </Space>
      </div>

      {/* Summary */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Text type="secondary">Позиций</Text>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{mockWarehouse.length}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Text type="secondary">Дефицит</Text>
            <div style={{ fontSize: 24, fontWeight: 700, color: lowStock.length > 0 ? '#ff4d4f' : '#52c41a' }}>{lowStock.length}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Text type="secondary">Зарезервировано</Text>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{mockWarehouse.reduce((a, b) => a + b.reserved, 0)}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Text type="secondary">Стоимость склада</Text>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{(mockWarehouse.reduce((a, b) => a + b.quantity * b.price, 0) / 1000).toFixed(0)}K ₽</div>
          </Card>
        </Col>
      </Row>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <Card size="small" style={{ marginBottom: 16, borderColor: '#ff4d4f' }}>
          <Space>
            <WarningOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
            <Text strong style={{ color: '#ff4d4f' }}>Внимание! Минимальный остаток:</Text>
            {lowStock.map(w => <Tag key={w.id} color="red">{w.name} ({w.quantity - w.reserved} {w.unit})</Tag>)}
          </Space>
        </Card>
      )}

      <Card size="small" extra={
        <Input placeholder="Поиск..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 250 }} allowClear />
      }>
        <Table dataSource={filtered} columns={columns} rowKey="id" size="small" pagination={{ pageSize: 10 }} scroll={{ x: 1000 }} />
      </Card>

      {/* Movement Modal */}
      <Modal
        title={modalType === 'in' ? 'Оприходование' : modalType === 'out' ? 'Списание' : 'Резервирование'}
        open={modalType !== null}
        onCancel={() => setModalType(null)}
        okText="Подтвердить"
      >
        <Form layout="vertical">
          <Form.Item label="Позиция"><Select placeholder="Выберите позицию" options={mockWarehouse.map(w => ({ value: w.id, label: `${w.name} (${w.sku})` }))} /></Form.Item>
          <Form.Item label="Количество"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Основание"><Input placeholder={modalType === 'out' ? 'Номер заявки' : 'Документ'} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
