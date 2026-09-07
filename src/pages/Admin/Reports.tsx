import { Card, Typography, Row, Col, Select, Space, Table, Tag, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { chartData, mockIncidents } from '../../data/mockData';

const { Title, Text } = Typography;

export default function ReportsPage() {
  const slaData = [
    { name: 'Реакция < 15 мин', value: 45, color: '#52c41a' },
    { name: 'Реакция 15-30 мин', value: 30, color: '#1677ff' },
    { name: 'Реакция 30-60 мин', value: 15, color: '#faad14' },
    { name: 'SLA нарушена', value: 10, color: '#ff4d4f' },
  ];

  const topObjects = [
    { name: 'ТЦ "Мегаполис"', incidents: 18, resolved: 16, sla: 89 },
    { name: 'БЦ "Столица"', incidents: 15, resolved: 14, sla: 93 },
    { name: 'ЖК "Новые Зори"', incidents: 12, resolved: 10, sla: 83 },
    { name: 'БЦ "Горизонт"', incidents: 9, resolved: 9, sla: 100 },
    { name: 'Офис "Альфа"', incidents: 6, resolved: 5, sla: 83 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>Аналитика и отчёты</Title>
          <Text type="secondary">SLA-метрики, загрузка, финансовые показатели</Text>
        </div>
        <Space>
          <Select defaultValue="month" style={{ width: 150 }} options={[
            { value: 'week', label: 'Неделя' },
            { value: 'month', label: 'Месяц' },
            { value: 'quarter', label: 'Квартал' },
            { value: 'year', label: 'Год' },
          ]} />
          <Button icon={<DownloadOutlined />}>Экспорт PDF</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {/* SLA Performance */}
        <Col xs={24} lg={12}>
          <Card title="SLA — Время реакции" size="small">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={slaData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}%`}>
                  {slaData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Resolution trend */}
        <Col xs={24} lg={12}>
          <Card title="Динамика решения заявок" size="small">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData.incidentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="total" name="Всего" stroke="#1677ff" fill="#1677ff" fillOpacity={0.1} />
                <Area type="monotone" dataKey="resolved" name="Решено" stroke="#52c41a" fill="#52c41a" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Top objects */}
        <Col xs={24} lg={12}>
          <Card title="Топ-5 объектов по заявкам" size="small">
            <Table
              size="small"
              pagination={false}
              dataSource={topObjects}
              rowKey="name"
              columns={[
                { title: 'Объект', dataIndex: 'name', key: 'name' },
                { title: 'Заявок', dataIndex: 'incidents', key: 'incidents', width: 80, align: 'center' as const },
                { title: 'Решено', dataIndex: 'resolved', key: 'resolved', width: 80, align: 'center' as const, render: (v: number) => <Tag color="green">{v}</Tag> },
                { title: 'SLA %', dataIndex: 'sla', key: 'sla', width: 80, render: (v: number) => <Tag color={v >= 90 ? 'green' : v >= 80 ? 'orange' : 'red'}>{v}%</Tag> },
              ]}
            />
          </Card>
        </Col>

        {/* Revenue */}
        <Col xs={24} lg={12}>
          <Card title="Финансовые показатели" size="small">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} ₽`} />
                <Bar dataKey="revenue" name="Выручка" fill="#722ed1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Engineer performance */}
        <Col xs={24}>
          <Card title="Производительность инженеров" size="small">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData.engineerLoad} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" name="Задач" fill="#1677ff" radius={[0, 4, 4, 0]} />
                <Bar dataKey="hours" name="Часов" fill="#52c41a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Category breakdown */}
        <Col xs={24} lg={12}>
          <Card title="Заявки по категориям систем" size="small">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData.incidentsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Заявок" radius={[4, 4, 0, 0]}>
                  {chartData.incidentsByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* SLA compliance table */}
        <Col xs={24} lg={12}>
          <Card title="Соблюдение SLA по приоритетам" size="small">
            <Table
              size="small"
              pagination={false}
              dataSource={[
                { priority: 'Критический', reaction: '15 мин', resolution: '4 ч', compliance: 87, color: 'red' },
                { priority: 'Высокий', reaction: '30 мин', resolution: '8 ч', compliance: 92, color: 'orange' },
                { priority: 'Средний', reaction: '60 мин', resolution: '24 ч', compliance: 95, color: 'blue' },
                { priority: 'Низкий', reaction: '4 ч', resolution: '72 ч', compliance: 98, color: 'green' },
              ]}
              rowKey="priority"
              columns={[
                { title: 'Приоритет', dataIndex: 'priority', key: 'priority', render: (v: string, r: any) => <Tag color={r.color}>{v}</Tag> },
                { title: 'Реакция', dataIndex: 'reaction', key: 'reaction' },
                { title: 'Устранение', dataIndex: 'resolution', key: 'resolution' },
                { title: 'SLA %', dataIndex: 'compliance', key: 'compliance', render: (v: number) => <Tag color={v >= 95 ? 'green' : v >= 90 ? 'orange' : 'red'}>{v}%</Tag> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
