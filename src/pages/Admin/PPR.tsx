import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Row, Col, Badge, Progress, Checkbox, Divider, Modal, List, Calendar } from 'antd';
import { ToolOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, CalendarOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { mockPPRTasks } from '../../data/mockData';
import { PPRTask, PPRTaskStatus } from '../../types';

const { Title, Text } = Typography;

const statusConfig: Record<PPRTaskStatus, { color: string; label: string; icon: React.ReactNode }> = {
  planned: { color: 'blue', label: 'Запланировано', icon: <ClockCircleOutlined /> },
  in_progress: { color: 'orange', label: 'Выполняется', icon: <PlayCircleOutlined /> },
  completed: { color: 'green', label: 'Выполнено', icon: <CheckCircleOutlined /> },
  overdue: { color: 'red', label: 'Просрочено', icon: <WarningOutlined /> },
};

export default function PPRPage() {
  const [selectedTask, setSelectedTask] = useState<PPRTask | null>(null);
  const [checklistModal, setChecklistModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  const columns = [
    {
      title: 'Статус', dataIndex: 'status', key: 'status', width: 120,
      render: (v: PPRTaskStatus) => {
        const cfg = statusConfig[v];
        return <Tag icon={cfg.icon} color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    { title: 'Объект', dataIndex: 'objectName', key: 'objectName', ellipsis: true },
    { title: 'Шаблон', dataIndex: 'template', key: 'template', ellipsis: true },
    { title: 'Исполнитель', dataIndex: 'assignedToName', key: 'assignedToName', width: 130 },
    { title: 'Дата', dataIndex: 'scheduledDate', key: 'scheduledDate', width: 110, render: (v: string) => new Date(v).toLocaleDateString('ru') },
    {
      title: 'Прогресс', key: 'progress', width: 120,
      render: (_: unknown, r: PPRTask) => {
        const done = r.checklist.filter(c => c.checked).length;
        const total = r.checklist.length;
        return <Progress percent={Math.round((done / total) * 100)} size="small" />;
      },
    },
    {
      title: '', key: 'actions', width: 60,
      render: (_: unknown, r: PPRTask) => (
        <Button type="link" size="small" onClick={() => { setSelectedTask(r); setChecklistModal(true); }}>
          Чек-лист
        </Button>
      ),
    },
  ];

  const planned = mockPPRTasks.filter(t => t.status === 'planned').length;
  const inProgress = mockPPRTasks.filter(t => t.status === 'in_progress').length;
  const completed = mockPPRTasks.filter(t => t.status === 'completed').length;
  const overdue = mockPPRTasks.filter(t => t.status === 'overdue').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>ППР — Плановое обслуживание</Title>
          <Text type="secondary">Шаблоны, задачи и маршрутные листы</Text>
        </div>
        <Space>
          <Button onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')} icon={<CalendarOutlined />}>
            {viewMode === 'table' ? 'Календарь' : 'Таблица'}
          </Button>
          <Button type="primary" icon={<ToolOutlined />}>Сгенерировать ППР</Button>
        </Space>
      </div>

      {/* Summary */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Badge status="processing" text="Запланировано" />
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1677ff' }}>{planned}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Badge status="warning" text="Выполняется" />
            <div style={{ fontSize: 24, fontWeight: 700, color: '#faad14' }}>{inProgress}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Badge status="success" text="Выполнено" />
            <div style={{ fontSize: 24, fontWeight: 700, color: '#52c41a' }}>{completed}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Badge status="error" text="Просрочено" />
            <div style={{ fontSize: 24, fontWeight: 700, color: '#ff4d4f' }}>{overdue}</div>
          </Card>
        </Col>
      </Row>

      {viewMode === 'table' ? (
        <Card size="small">
          <Table dataSource={mockPPRTasks} columns={columns} rowKey="id" size="small" pagination={{ pageSize: 10 }} scroll={{ x: 900 }} />
        </Card>
      ) : (
        <Card size="small">
          <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>
            <CalendarOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <div><Text type="secondary">Календарный вид ППР задач</Text></div>
            <div style={{ marginTop: 16 }}>
              <Row gutter={8}>
                {mockPPRTasks.map(task => (
                  <Col key={task.id} xs={12} sm={6}>
                    <Card size="small" style={{ marginBottom: 8, borderLeft: `3px solid ${statusConfig[task.status].color === 'blue' ? '#1677ff' : statusConfig[task.status].color === 'orange' ? '#faad14' : statusConfig[task.status].color === 'green' ? '#52c41a' : '#ff4d4f'}` }}>
                      <Text strong style={{ fontSize: 12 }}>{task.objectName}</Text>
                      <div><Text type="secondary" style={{ fontSize: 11 }}>{new Date(task.scheduledDate).toLocaleDateString('ru')}</Text></div>
                      <Tag color={statusConfig[task.status].color} style={{ fontSize: 10, marginTop: 4 }}>{statusConfig[task.status].label}</Tag>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Card>
      )}

      {/* Checklist Modal */}
      <Modal
        title={`Чек-лист: ${selectedTask?.objectName}`}
        open={checklistModal}
        onCancel={() => setChecklistModal(false)}
        width={500}
        footer={[
          <Button key="cancel" onClick={() => setChecklistModal(false)}>Закрыть</Button>,
          <Button key="save" type="primary">Сохранить</Button>,
        ]}
      >
        {selectedTask && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Text type="secondary">Шаблон:</Text> <Text strong>{selectedTask.template}</Text>
              <div style={{ marginTop: 4 }}>
                <Text type="secondary">Исполнитель:</Text> <Text>{selectedTask.assignedToName}</Text>
                <Text type="secondary" style={{ marginLeft: 16 }}>Дата:</Text> <Text>{new Date(selectedTask.scheduledDate).toLocaleDateString('ru')}</Text>
              </div>
            </Card>

            <List
              dataSource={selectedTask.checklist}
              renderItem={(item) => (
                <List.Item>
                  <Checkbox checked={item.checked} style={{ marginRight: 8 }}>
                    <Text style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#8c8c8c' : undefined }}>
                      {item.title}
                    </Text>
                  </Checkbox>
                </List.Item>
              )}
            />

            <Divider />
            <Button block icon={<CheckCircleOutlined />} type="primary" ghost>
              Завершить ППР
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
