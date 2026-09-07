import { useState } from 'react';
import { Table, Card, Tag, Button, Space, Input, Select, Typography, Modal, Form, DatePicker, Row, Col, Badge, Tooltip, Drawer, Descriptions, Timeline, Divider } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined, ReloadOutlined, EyeOutlined, EditOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { mockIncidents, engineers } from '../../data/mockData';
import { Incident, IncidentPriority, IncidentStatus, IncidentCategory } from '../../types';

const { Title, Text } = Typography;

const priorityConfig: Record<IncidentPriority, { color: string; label: string }> = {
  critical: { color: 'red', label: 'Критический' },
  high: { color: 'orange', label: 'Высокий' },
  medium: { color: 'blue', label: 'Средний' },
  low: { color: 'green', label: 'Низкий' },
};

const statusConfig: Record<IncidentStatus, { color: string; label: string }> = {
  new: { color: 'default', label: 'Новая' },
  assigned: { color: 'processing', label: 'Назначена' },
  in_progress: { color: 'warning', label: 'В работе' },
  resolved: { color: 'success', label: 'Решена' },
  closed: { color: 'default', label: 'Закрыта' },
};

const categoryLabels: Record<IncidentCategory, string> = {
  ops: 'ОПС', video: 'Видеонаблюдение', skud: 'СКУД', sks: 'СКС', smoke: 'Дымоудаление', alert: 'Оповещение',
};

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  const filteredIncidents = mockIncidents.filter((inc) => {
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && inc.priority !== priorityFilter) return false;
    if (searchText && !inc.title.toLowerCase().includes(searchText.toLowerCase()) && !inc.number.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      title: 'Номер',
      dataIndex: 'number',
      key: 'number',
      width: 140,
      render: (v: string, r: Incident) => (
        <a onClick={() => { setSelectedIncident(r); setDrawerOpen(true); }}>{v}</a>
      ),
    },
    {
      title: 'Описание',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      width: 130,
      render: (v: IncidentCategory) => <Tag>{categoryLabels[v]}</Tag>,
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: (v: IncidentPriority) => (
        <Tag color={priorityConfig[v].color}>{priorityConfig[v].label}</Tag>
      ),
      filters: Object.entries(priorityConfig).map(([k, v]) => ({ text: v.label, value: k })),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (v: IncidentStatus) => (
        <Badge status={statusConfig[v].color as 'default' | 'processing' | 'warning' | 'success'} text={statusConfig[v].label} />
      ),
    },
    {
      title: 'Объект',
      dataIndex: 'objectName',
      key: 'objectName',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Исполнитель',
      dataIndex: 'assignedToName',
      key: 'assignedToName',
      width: 130,
      render: (v: string) => v || <Text type="secondary">Не назначен</Text>,
    },
    {
      title: 'SLA',
      key: 'sla',
      width: 100,
      render: (_: unknown, r: Incident) => {
        const now = new Date();
        const deadline = new Date(r.deadline);
        const remaining = (deadline.getTime() - now.getTime()) / 1000 / 60;
        if (r.status === 'resolved' || r.status === 'closed') return <Tag color="green">✓</Tag>;
        if (remaining < 0) return <Tooltip title="Просрочено"><Tag color="red" className="sla-critical">⚠</Tag></Tooltip>;
        if (remaining < 60) return <Tag color="orange">{Math.round(remaining)}м</Tag>;
        return <Tag color="blue">{Math.round(remaining / 60)}ч</Tag>;
      },
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: unknown, r: Incident) => (
        <Space>
          <Tooltip title="Просмотр"><Button type="text" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedIncident(r); setDrawerOpen(true); }} /></Tooltip>
          {r.status === 'new' && <Tooltip title="Назначить"><Button type="text" size="small" icon={<UserSwitchOutlined />} onClick={() => { setSelectedIncident(r); setAssignModalOpen(true); }} /></Tooltip>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>Аварийные заявки</Title>
          <Text type="secondary">Управление инцидентами и SLA</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Новая заявка
        </Button>
      </div>

      {/* Filters */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space wrap>
              <Input
                placeholder="Поиск по номеру или описанию..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 280 }}
                allowClear
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
                options={[
                  { value: 'all', label: 'Все статусы' },
                  { value: 'new', label: 'Новые' },
                  { value: 'assigned', label: 'Назначенные' },
                  { value: 'in_progress', label: 'В работе' },
                  { value: 'resolved', label: 'Решённые' },
                  { value: 'closed', label: 'Закрытые' },
                ]}
              />
              <Select
                value={priorityFilter}
                onChange={setPriorityFilter}
                style={{ width: 150 }}
                options={[
                  { value: 'all', label: 'Все приоритеты' },
                  { value: 'critical', label: '🔴 Критический' },
                  { value: 'high', label: '🟠 Высокий' },
                  { value: 'medium', label: '🔵 Средний' },
                  { value: 'low', label: '🟢 Низкий' },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<FilterOutlined />}>Фильтры</Button>
              <Button icon={<ReloadOutlined />}>Обновить</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Summary badges */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Badge count={mockIncidents.filter(i => i.status === 'new').length} style={{ backgroundColor: '#8c8c8c' }}>
          <Tag>Новые</Tag>
        </Badge>
        <Badge count={mockIncidents.filter(i => i.status === 'in_progress').length} style={{ backgroundColor: '#faad14' }}>
          <Tag>В работе</Tag>
        </Badge>
        <Badge count={mockIncidents.filter(i => i.priority === 'critical' && i.status !== 'resolved' && i.status !== 'closed').length} style={{ backgroundColor: '#ff4d4f' }}>
          <Tag color="red">Критические</Tag>
        </Badge>
        <Badge count={mockIncidents.filter(i => new Date(i.deadline) < new Date() && i.status !== 'resolved' && i.status !== 'closed').length} style={{ backgroundColor: '#ff4d4f' }}>
          <Tag color="red">Просрочены</Tag>
        </Badge>
      </Space>

      {/* Table */}
      <Card size="small">
        <Table
          dataSource={filteredIncidents}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `Всего: ${t}` }}
          scroll={{ x: 1200 }}
          rowClassName={(r) => r.priority === 'critical' && r.status !== 'resolved' ? 'sla-critical' : ''}
        />
      </Card>

      {/* Incident Detail Drawer */}
      <Drawer
        title={selectedIncident ? `${selectedIncident.number}: ${selectedIncident.title}` : ''}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={600}
      >
        {selectedIncident && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Приоритет"><Tag color={priorityConfig[selectedIncident.priority].color}>{priorityConfig[selectedIncident.priority].label}</Tag></Descriptions.Item>
              <Descriptions.Item label="Статус"><Badge status={statusConfig[selectedIncident.status].color as any} text={statusConfig[selectedIncident.status].label} /></Descriptions.Item>
              <Descriptions.Item label="Категория">{categoryLabels[selectedIncident.category]}</Descriptions.Item>
              <Descriptions.Item label="Объект">{selectedIncident.objectName}</Descriptions.Item>
              <Descriptions.Item label="Клиент">{selectedIncident.clientName}</Descriptions.Item>
              <Descriptions.Item label="Исполнитель">{selectedIncident.assignedToName || 'Не назначен'}</Descriptions.Item>
              <Descriptions.Item label="Создана">{new Date(selectedIncident.createdAt).toLocaleString('ru')}</Descriptions.Item>
              <Descriptions.Item label="Дедлайн">{new Date(selectedIncident.deadline).toLocaleString('ru')}</Descriptions.Item>
              <Descriptions.Item label="SLA реакция" span={2}>{selectedIncident.slaReactionMinutes} мин</Descriptions.Item>
              <Descriptions.Item label="SLA устранение" span={2}>{selectedIncident.slaResolutionHours} ч</Descriptions.Item>
            </Descriptions>

            <Divider />
            <Title level={5}>Описание</Title>
            <Text>{selectedIncident.description}</Text>

            <Divider />
            <Title level={5}>Хронология</Title>
            <Timeline
              items={[
                { color: 'blue', children: <Text style={{ fontSize: 12 }}>Заявка создана — {new Date(selectedIncident.createdAt).toLocaleString('ru')}</Text> },
                ...(selectedIncident.assignedToName ? [{ color: 'green', children: <Text style={{ fontSize: 12 }}>Назначен исполнитель: {selectedIncident.assignedToName}</Text> }] : []),
                ...(selectedIncident.status === 'in_progress' ? [{ color: 'orange', children: <Text style={{ fontSize: 12 }}>Взята в работу</Text> }] : []),
                ...(selectedIncident.resolvedAt ? [{ color: 'green', children: <Text style={{ fontSize: 12 }}>Решена — {new Date(selectedIncident.resolvedAt).toLocaleString('ru')}</Text> }] : []),
              ]}
            />
          </div>
        )}
      </Drawer>

      {/* New Incident Modal */}
      <Modal title="Новая заявка" open={modalOpen} onCancel={() => setModalOpen(false)} width={600} okText="Создать">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Категория" rules={[{ required: true }]}><Select options={Object.entries(categoryLabels).map(([k, v]) => ({ value: k, label: v }))} /></Form.Item></Col>
            <Col span={12}><Form.Item label="Приоритет" rules={[{ required: true }]}><Select options={Object.entries(priorityConfig).map(([k, v]) => ({ value: k, label: v.label }))} /></Form.Item></Col>
          </Row>
          <Form.Item label="Тема" rules={[{ required: true }]}><Input placeholder="Краткое описание проблемы" /></Form.Item>
          <Form.Item label="Описание"><Input.TextArea rows={3} placeholder="Подробное описание" /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Объект"><Select placeholder="Выберите объект" options={[]} /></Form.Item></Col>
            <Col span={12}><Form.Item label="Контактное лицо"><Input placeholder="ФИО, телефон" /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>

      {/* Assign Modal */}
      <Modal title={`Назначить: ${selectedIncident?.number}`} open={assignModalOpen} onCancel={() => setAssignModalOpen(false)} okText="Назначить">
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Рекомендуемые инженеры (ближайшие, с нужными навыками):</Text>
        </div>
        <Space direction="vertical" style={{ width: '100%' }}>
          {engineers.filter(e => e.status === 'on_shift').map((eng) => (
            <Card key={eng.id} size="small" hoverable style={{ cursor: 'pointer' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <div>
                  <Text strong>{eng.name}</Text>
                  <div><Text type="secondary" style={{ fontSize: 12 }}>{eng.skills.join(', ')}</Text></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text style={{ fontSize: 12 }}>Задач: {eng.tasks}</Text>
                  <div><Tag color="green">На смене</Tag></div>
                </div>
              </Space>
            </Card>
          ))}
        </Space>
      </Modal>
    </div>
  );
}
