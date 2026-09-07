import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, Form, Input, Select, Row, Col, Tree, Drawer, Descriptions, Divider, InputNumber } from 'antd';
import { PlusOutlined, SearchOutlined, ApartmentOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import { mockObjects, mockClients } from '../../data/mockData';

const { Title, Text } = Typography;

const systemColors: Record<string, string> = {
  'Видеонаблюдение': 'blue', 'ОПС': 'red', 'СКУД': 'green',
  'СКС': 'orange', 'Дымоудаление': 'purple', 'Оповещение': 'cyan',
};

export default function ObjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState<typeof mockObjects[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns = [
    { title: 'Объект', dataIndex: 'name', key: 'name', render: (v: string, r: typeof mockObjects[0]) => <a onClick={() => { setSelectedObject(r); setDrawerOpen(true); }}>{v}</a> },
    { title: 'Клиент', dataIndex: 'clientName', key: 'clientName', ellipsis: true },
    { title: 'Адрес', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: 'Этажей', dataIndex: 'floors', key: 'floors', width: 80, align: 'center' as const },
    { title: 'Системы', dataIndex: 'systems', key: 'systems', render: (v: string[]) => <Space wrap size={2}>{v.map(s => <Tag key={s} color={systemColors[s] || 'default'} style={{ fontSize: 11 }}>{s}</Tag>)}</Space> },
    { title: 'Оборудование', dataIndex: 'equipmentCount', key: 'equipmentCount', width: 110, render: (v: number) => <Text strong>{v.toLocaleString()} ед.</Text> },
    {
      title: '', key: 'actions', width: 80,
      render: (_: unknown, r: typeof mockObjects[0]) => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedObject(r); setDrawerOpen(true); }} />
          <Button type="text" size="small" icon={<EditOutlined />} />
        </Space>
      ),
    },
  ];

  const treeData = mockObjects.map(obj => ({
    title: obj.name,
    key: obj.id,
    icon: <ApartmentOutlined />,
    children: [
      { title: `Этаж 1-${obj.floors}`, key: `${obj.id}-floors`, children: [
        { title: `Серверная`, key: `${obj.id}-server` },
        { title: `Щитовая`, key: `${obj.id}-panel` },
      ]},
    ],
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>Объекты</Title>
          <Text type="secondary">Иерархический учёт объектов и оборудования</Text>
        </div>
        <Space>
          <Button icon={<ImportOutlined />}>Импорт Excel</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>Добавить объект</Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col xs={24} lg={6}>
          <Card title="Структура объектов" size="small" style={{ marginBottom: 16 }}>
            <Input placeholder="Поиск..." prefix={<SearchOutlined />} style={{ marginBottom: 12 }} />
            <Tree
              showIcon
              defaultExpandAll
              treeData={treeData}
              style={{ maxHeight: 500, overflow: 'auto' }}
            />
          </Card>
          <Card title="Статистика" size="small">
            <div style={{ marginBottom: 8 }}><Text type="secondary">Всего объектов:</Text> <Text strong>{mockObjects.length}</Text></div>
            <div style={{ marginBottom: 8 }}><Text type="secondary">Оборудования:</Text> <Text strong>{mockObjects.reduce((a, b) => a + b.equipmentCount, 0).toLocaleString()} ед.</Text></div>
            <div><Text type="secondary">Клиентов:</Text> <Text strong>{mockClients.length}</Text></div>
          </Card>
        </Col>

        <Col xs={24} lg={18}>
          <Card size="small">
            <Table
              dataSource={mockObjects}
              columns={columns}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 900 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Object Detail Drawer */}
      <Drawer
        title={selectedObject?.name}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={600}
      >
        {selectedObject && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Клиент">{selectedObject.clientName}</Descriptions.Item>
              <Descriptions.Item label="Адрес">{selectedObject.address}</Descriptions.Item>
              <Descriptions.Item label="Этажей">{selectedObject.floors}</Descriptions.Item>
              <Descriptions.Item label="Оборудование">{selectedObject.equipmentCount} ед.</Descriptions.Item>
              <Descriptions.Item label="Системы" span={2}>
                <Space wrap>{selectedObject.systems.map(s => <Tag key={s} color={systemColors[s] || 'default'}>{s}</Tag>)}</Space>
              </Descriptions.Item>
              <Descriptions.Item label="Координаты" span={2}>{selectedObject.lat}, {selectedObject.lng}</Descriptions.Item>
            </Descriptions>

            <Divider />
            <Title level={5}>Оборудование</Title>
            <Table
              size="small"
              pagination={false}
              dataSource={[
                { key: '1', name: 'Камера Hikvision DS-2CD2143G2', serial: 'HK2024001234', category: 'Видеонаблюдение', status: 'active' },
                { key: '2', name: 'Датчик дыма ИП 212-141М', serial: 'IP2024005678', category: 'ОПС', status: 'active' },
                { key: '3', name: 'Контроллер СКУД Sigur SG-AC', serial: 'SG2024009012', category: 'СКУД', status: 'maintenance' },
              ]}
              columns={[
                { title: 'Наименование', dataIndex: 'name', key: 'name' },
                { title: 'Серийный №', dataIndex: 'serial', key: 'serial' },
                { title: 'Категория', dataIndex: 'category', key: 'category', render: (v: string) => <Tag>{v}</Tag> },
                { title: 'Статус', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'active' ? 'green' : 'orange'}>{v === 'active' ? 'Работает' : 'ТО'}</Tag> },
              ]}
            />
          </div>
        )}
      </Drawer>

      {/* New Object Modal */}
      <Modal title="Новый объект" open={modalOpen} onCancel={() => setModalOpen(false)} width={600} okText="Создать">
        <Form layout="vertical">
          <Form.Item label="Название" rules={[{ required: true }]}><Input placeholder="Название объекта" /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Клиент" rules={[{ required: true }]}><Select placeholder="Выберите клиента" options={mockClients.map(c => ({ value: c.id, label: c.name }))} /></Form.Item></Col>
            <Col span={12}><Form.Item label="Этажей"><InputNumber min={1} max={100} style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Form.Item label="Адрес"><Input placeholder="Полный адрес" /></Form.Item>
          <Form.Item label="Системы"><Select mode="multiple" options={Object.entries(systemColors).map(([k]) => ({ value: k, label: k }))} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
