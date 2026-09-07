import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Row, Col, List, Badge, Tooltip, Select, Divider, Modal, Timeline } from 'antd';
import { CarOutlined, EnvironmentOutlined, PhoneOutlined, UserOutlined, ClockCircleOutlined, AlertOutlined, CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { mockIncidents, engineers } from '../../data/mockData';
import { Incident } from '../../types';

const { Title, Text } = Typography;

const priorityColors: Record<string, string> = { critical: 'red', high: 'orange', medium: 'blue', low: 'green' };
const priorityLabels: Record<string, string> = { critical: 'Крит.', high: 'Выс.', medium: 'Ср.', low: 'Низ.' };

export default function DispatchPage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const activeIncidents = mockIncidents.filter(i => i.status !== 'resolved' && i.status !== 'closed');
  const onShift = engineers.filter(e => e.status === 'on_shift');

  const getSLARemaining = (incident: Incident) => {
    const now = new Date();
    const deadline = new Date(incident.deadline);
    const remaining = (deadline.getTime() - now.getTime()) / 1000 / 60;
    return remaining;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>Диспетчеризация</Title>
          <Text type="secondary">Управление инженерами и заявками в реальном времени</Text>
        </div>
        <Space>
          <Badge count={activeIncidents.length} style={{ backgroundColor: '#ff4d4f' }}>
            <Button icon={<AlertOutlined />}>Активные заявки</Button>
          </Badge>
          <Badge count={onShift.length} style={{ backgroundColor: '#52c41a' }}>
            <Button icon={<CarOutlined />}>На смене</Button>
          </Badge>
        </Space>
      </div>

      <Row gutter={16}>
        {/* Map placeholder */}
        <Col xs={24} lg={14}>
          <Card
            size="small"
            title={<Space><EnvironmentOutlined />Карта инженеров и объектов</Space>}
            extra={<Space><Select size="small" defaultValue="all" options={[{ value: 'all', label: 'Все' }, { value: 'critical', label: 'Критические' }, { value: 'shift', label: 'На смене' }]} style={{ width: 120 }} /><Button size="small" icon={<ThunderboltOutlined />}>Оптимизация маршрутов</Button></Space>}
          >
            {/* Map visualization */}
            <div style={{
              height: 450,
              background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 50%, #e6fffb 100%)',
              borderRadius: 8,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #d9d9d9',
            }}>
              {/* Grid lines */}
              <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.15 }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#1677ff" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="#1677ff" strokeWidth="0.5" />
                ))}
              </svg>

              {/* Engineer markers */}
              {onShift.map((eng, i) => {
                const positions = [
                  { top: '25%', left: '30%' },
                  { top: '45%', left: '55%' },
                  { top: '35%', left: '70%' },
                  { top: '60%', left: '40%' },
                  { top: '50%', left: '20%' },
                ];
                const pos = positions[i % positions.length];
                return (
                  <Tooltip key={eng.id} title={`${eng.name} • ${eng.tasks} задач`}>
                    <div style={{
                      position: 'absolute',
                      ...pos,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: eng.tasks > 2 ? '#ff4d4f' : '#52c41a',
                      border: '3px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      zIndex: 10,
                    }}>
                      <UserOutlined style={{ color: '#fff', fontSize: 14 }} />
                    </div>
                  </Tooltip>
                );
              })}

              {/* Object markers */}
              {[
                { top: '20%', left: '45%', label: 'БЦ Горизонт' },
                { top: '55%', left: '65%', label: 'ТЦ Мегаполис' },
                { top: '30%', left: '80%', label: 'БЦ Столица' },
                { top: '70%', left: '25%', label: 'ЖК Новые Зори' },
              ].map((obj, i) => (
                <Tooltip key={i} title={obj.label}>
                  <div style={{
                    position: 'absolute',
                    ...{ top: obj.top, left: obj.left },
                    width: 28,
                    height: 28,
                    borderRadius: 4,
                    background: '#1677ff',
                    border: '2px solid white',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}>
                    <EnvironmentOutlined style={{ color: '#fff', fontSize: 12 }} />
                  </div>
                </Tooltip>
              ))}

              {/* Legend */}
              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 11,
              }}>
                <Space direction="vertical" size={2}>
                  <Space size={4}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#52c41a' }} /><span>Свободен</span></Space>
                  <Space size={4}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff4d4f' }} /><span>Загружен</span></Space>
                  <Space size={4}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#1677ff' }} /><span>Объект</span></Space>
                </Space>
              </div>
            </div>
          </Card>
        </Col>

        {/* Incidents & Engineers */}
        <Col xs={24} lg={10}>
          {/* Active incidents */}
          <Card
            size="small"
            title={<Space><AlertOutlined style={{ color: '#ff4d4f' }} />Очередь заявок</Space>}
            style={{ marginBottom: 16 }}
            styles={{ body: { padding: 0, maxHeight: 280, overflow: 'auto' } }}
          >
            <List
              dataSource={activeIncidents.sort((a, b) => {
                const order = { critical: 0, high: 1, medium: 2, low: 3 };
                return order[a.priority] - order[b.priority];
              })}
              renderItem={(item) => {
                const remaining = getSLARemaining(item);
                return (
                  <List.Item
                    style={{ padding: '10px 16px', cursor: 'pointer', borderLeft: `3px solid ${priorityColors[item.priority] === 'red' ? '#ff4d4f' : priorityColors[item.priority] === 'orange' ? '#faad14' : '#1677ff'}` }}
                    onClick={() => { setSelectedIncident(item); setAssignModalOpen(true); }}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Tag color={priorityColors[item.priority]} style={{ margin: 0 }}>{priorityLabels[item.priority]}</Tag>
                          <Text style={{ fontSize: 12 }}>{item.number}</Text>
                        </Space>
                      }
                      description={
                        <div>
                          <Text style={{ fontSize: 12 }} ellipsis>{item.title}</Text>
                          <div style={{ marginTop: 2 }}>
                            {remaining < 0 ? (
                              <Tag color="red" style={{ fontSize: 10 }}>Просрочено</Tag>
                            ) : remaining < 60 ? (
                              <Tag color="orange" style={{ fontSize: 10 }}>⏱ {Math.round(remaining)} мин</Tag>
                            ) : (
                              <Tag color="blue" style={{ fontSize: 10 }}>⏱ {Math.round(remaining / 60)} ч</Tag>
                            )}
                            <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>{item.objectName}</Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>

          {/* Engineers on shift */}
          <Card
            size="small"
            title={<Space><CarOutlined />Инженеры на смене</Space>}
            styles={{ body: { padding: 0, maxHeight: 250, overflow: 'auto' } }}
          >
            <List
              dataSource={onShift}
              renderItem={(eng) => (
                <List.Item style={{ padding: '10px 16px' }}>
                  <List.Item.Meta
                    avatar={<div style={{ width: 36, height: 36, borderRadius: '50%', background: eng.tasks > 2 ? '#fff1f0' : '#f6ffed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserOutlined style={{ color: eng.tasks > 2 ? '#ff4d4f' : '#52c41a' }} /></div>}
                    title={<Text strong style={{ fontSize: 13 }}>{eng.name}</Text>}
                    description={
                      <div>
                        <Space size={4} wrap>
                          {eng.skills.map(s => <Tag key={s} style={{ fontSize: 10, margin: 0 }}>{s}</Tag>)}
                        </Space>
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary" style={{ fontSize: 11 }}>Задач: {eng.tasks} • <PhoneOutlined /> {eng.phone}</Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Assign Modal */}
      <Modal
        title={`Назначение: ${selectedIncident?.number}`}
        open={assignModalOpen}
        onCancel={() => setAssignModalOpen(false)}
        width={500}
        okText="Назначить"
      >
        {selectedIncident && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Text strong>{selectedIncident.title}</Text>
              <div><Text type="secondary" style={{ fontSize: 12 }}>{selectedIncident.objectName} • {selectedIncident.clientName}</Text></div>
            </Card>
            <Text type="secondary">Рекомендуемые инженеры:</Text>
            <List
              style={{ marginTop: 8 }}
              dataSource={onShift.sort((a, b) => a.tasks - b.tasks)}
              renderItem={(eng) => (
                <List.Item style={{ padding: '8px 0', cursor: 'pointer' }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <div>
                      <Text strong>{eng.name}</Text>
                      <div><Text type="secondary" style={{ fontSize: 11 }}>{eng.skills.join(', ')}</Text></div>
                    </div>
                    <Space>
                      <Tag color={eng.tasks < 2 ? 'green' : eng.tasks < 3 ? 'orange' : 'red'}>{eng.tasks} задач</Tag>
                      <Button type="primary" size="small">Выбрать</Button>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
