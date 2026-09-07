import { Card, Row, Col, Statistic, Typography, Tag, Table, Progress, Space, List, Timeline } from 'antd';
import {
  AlertOutlined, CheckCircleOutlined, TeamOutlined, ToolOutlined,
  DollarOutlined, StarOutlined, ArrowUpOutlined, ArrowDownOutlined,
  ClockCircleOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { mockKPI, mockIncidents, chartData, mockNotifications } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const priorityColors: Record<string, string> = {
  critical: 'red', high: 'orange', medium: 'blue', low: 'green',
};
const priorityLabels: Record<string, string> = {
  critical: 'Критический', high: 'Высокий', medium: 'Средний', low: 'Низкий',
};
const statusLabels: Record<string, string> = {
  new: 'Новая', assigned: 'Назначена', in_progress: 'В работе', resolved: 'Решена', closed: 'Закрыта',
};

export default function DashboardPage() {
  const navigate = useNavigate();

  const kpiCards = [
    { title: 'Активные заявки', value: mockKPI.activeIncidents, icon: <AlertOutlined />, color: '#ff4d4f', suffix: '', trend: -12 },
    { title: 'Просрочено', value: mockKPI.overdueIncidents, icon: <ExclamationCircleOutlined />, color: '#faad14', suffix: '', trend: -5 },
    { title: 'Инженеры на смене', value: mockKPI.engineersOnShift, icon: <TeamOutlined />, color: '#1677ff', suffix: '/7', trend: 0 },
    { title: 'ППР сегодня', value: mockKPI.todayPPR, icon: <ToolOutlined />, color: '#52c41a', suffix: '', trend: 15 },
    { title: 'Выручка (мес.)', value: mockKPI.monthlyRevenue, icon: <DollarOutlined />, color: '#722ed1', suffix: '₽', prefix: '', trend: 18, isMoney: true },
    { title: 'Удовлетворённость', value: mockKPI.clientSatisfaction, icon: <StarOutlined />, color: '#faad14', suffix: '/5', trend: 3 },
  ];

  const incidentColumns = [
    { title: '№', dataIndex: 'number', key: 'number', width: 140, render: (v: string) => <Text strong style={{ color: '#1677ff', cursor: 'pointer' }}>{v}</Text> },
    { title: 'Заявка', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: 'Приоритет', dataIndex: 'priority', key: 'priority', width: 120, render: (v: string) => <Tag color={priorityColors[v]}>{priorityLabels[v]}</Tag> },
    { title: 'Статус', dataIndex: 'status', key: 'status', width: 110, render: (v: string) => <Tag>{statusLabels[v]}</Tag> },
    { title: 'Объект', dataIndex: 'objectName', key: 'objectName', width: 150, ellipsis: true },
    { title: 'SLA', key: 'sla', width: 100, render: (_: unknown, r: typeof mockIncidents[0]) => {
      const now = new Date();
      const deadline = new Date(r.deadline);
      const remaining = (deadline.getTime() - now.getTime()) / 1000 / 60;
      if (remaining < 0) return <Tag color="red">Просрочено</Tag>;
      if (remaining < 60) return <Tag color="orange">{Math.round(remaining)} мин</Tag>;
      return <Tag color="green">{Math.round(remaining / 60)} ч</Tag>;
    }},
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 4 }}>Панель управления</Title>
        <Text type="secondary">Обзор ключевых показателей системы</Text>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {kpiCards.map((kpi, i) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={i}>
            <Card size="small" hoverable styles={{ body: { padding: '16px 20px' } }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{kpi.title}</Text>
                  <div style={{ fontSize: 24, fontWeight: 700, color: kpi.color, marginTop: 4 }}>
                    {kpi.isMoney ? `${(kpi.value / 1000000).toFixed(1)}M` : kpi.value}
                    {kpi.suffix && <span style={{ fontSize: 14, fontWeight: 400 }}>{kpi.suffix}</span>}
                  </div>
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${kpi.color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: kpi.color,
                }}>
                  {kpi.icon}
                </div>
              </div>
              {kpi.trend !== 0 && (
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  {kpi.trend > 0 ? (
                    <span style={{ color: '#52c41a' }}><ArrowUpOutlined /> +{kpi.trend}%</span>
                  ) : (
                    <span style={{ color: '#ff4d4f' }}><ArrowDownOutlined /> {kpi.trend}%</span>
                  )}
                  <Text type="secondary" style={{ marginLeft: 4 }}>vs прошлый мес.</Text>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Incidents Chart */}
        <Col xs={24} xl={16}>
          <Card title="Динамика заявок" size="small">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData.incidentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="resolved" name="Решено" fill="#52c41a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overdue" name="Просрочено" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Category Pie */}
        <Col xs={24} xl={8}>
          <Card title="Заявки по категориям" size="small">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData.incidentsByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {chartData.incidentsByCategory.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Active Incidents Table */}
        <Col xs={24} xl={16}>
          <Card
            title={<Space><AlertOutlined style={{ color: '#ff4d4f' }} /><span>Активные заявки</span></Space>}
            size="small"
            extra={<a onClick={() => navigate('/incidents')}>Все заявки →</a>}
          >
            <Table
              dataSource={mockIncidents.filter(i => i.status !== 'closed' && i.status !== 'resolved')}
              columns={incidentColumns}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>

        {/* Notifications & Activity */}
        <Col xs={24} xl={8}>
          <Card title="Уведомления" size="small" style={{ marginBottom: 16 }}>
            <List
              size="small"
              dataSource={mockNotifications.slice(0, 5)}
              renderItem={(item) => (
                <List.Item style={{ padding: '8px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: item.read ? '#d9d9d9' : '#1677ff',
                        marginTop: 6,
                      }} />
                    }
                    title={<Text style={{ fontSize: 13 }}>{item.title}</Text>}
                    description={<Text type="secondary" style={{ fontSize: 12 }}>{item.message}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Последние события" size="small">
            <Timeline
              items={[
                { color: 'red', children: <Text style={{ fontSize: 12 }}>Критическая заявка INC-2026-0002</Text> },
                { color: 'blue', children: <Text style={{ fontSize: 12 }}>Петров А.В. назначен на INC-2026-0005</Text> },
                { color: 'green', children: <Text style={{ fontSize: 12 }}>INC-2026-0006 решена</Text> },
                { color: 'gray', children: <Text style={{ fontSize: 12 }}>ППР задачи на январь созданы</Text> },
                { color: 'purple', children: <Text style={{ fontSize: 12 }}>Оплата от ООО "ТехноПарк"</Text> },
              ]}
            />
          </Card>
        </Col>

        {/* Revenue Chart */}
        <Col xs={24} xl={12}>
          <Card title="Выручка по месяцам" size="small">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} ₽`} />
                <Line type="monotone" dataKey="revenue" stroke="#722ed1" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Engineer Load */}
        <Col xs={24} xl={12}>
          <Card title="Загрузка инженеров" size="small">
            <div style={{ padding: '8px 0' }}>
              {chartData.engineerLoad.map((eng) => (
                <div key={eng.name} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 13 }}>{eng.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{eng.tasks} задач / {eng.hours}ч</Text>
                  </div>
                  <Progress
                    percent={Math.round((eng.hours / 120) * 100)}
                    strokeColor={eng.hours > 100 ? '#ff4d4f' : eng.hours > 80 ? '#faad14' : '#52c41a'}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
