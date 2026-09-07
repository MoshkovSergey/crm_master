import { Card, Typography, Form, Input, InputNumber, Switch, Select, Button, Tabs, Divider, Row, Col, Table, Tag, Space, TimePicker, message } from 'antd';
import { SaveOutlined, BellOutlined, ClockCircleOutlined, DollarOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={3} style={{ marginBottom: 0 }}>Настройки</Title>
        <Text type="secondary">Конфигурация системы, SLA, шаблоны, уведомления</Text>
      </div>

      <Tabs items={[
        {
          key: 'sla',
          label: <span><ClockCircleOutlined /> SLA</span>,
          children: (
            <Card size="small">
              <Title level={5}>Параметры SLA по приоритетам</Title>
              <Table
                size="small"
                pagination={false}
                dataSource={[
                  { key: '1', priority: 'Критический', reaction: 15, resolution: 4, escalation: 30 },
                  { key: '2', priority: 'Высокий', reaction: 30, resolution: 8, escalation: 60 },
                  { key: '3', priority: 'Средний', reaction: 60, resolution: 24, escalation: 120 },
                  { key: '4', priority: 'Низкий', reaction: 240, resolution: 72, escalation: 480 },
                ]}
                columns={[
                  { title: 'Приоритет', dataIndex: 'priority', key: 'priority', render: (v: string) => <Tag color={v === 'Критический' ? 'red' : v === 'Высокий' ? 'orange' : v === 'Средний' ? 'blue' : 'green'}>{v}</Tag> },
                  { title: 'Реакция (мин)', dataIndex: 'reaction', key: 'reaction', render: (v: number) => <InputNumber value={v} min={1} size="small" style={{ width: 80 }} /> },
                  { title: 'Устранение (ч)', dataIndex: 'resolution', key: 'resolution', render: (v: number) => <InputNumber value={v} min={1} size="small" style={{ width: 80 }} /> },
                  { title: 'Эскалация (мин)', dataIndex: 'escalation', key: 'escalation', render: (v: number) => <InputNumber value={v} min={1} size="small" style={{ width: 80 }} /> },
                ]}
              />
              <div style={{ marginTop: 16 }}><Button type="primary" icon={<SaveOutlined />}>Сохранить</Button></div>
            </Card>
          ),
        },
        {
          key: 'ppr',
          label: <span><BellOutlined /> Шаблоны ППР</span>,
          children: (
            <Card size="small">
              <Title level={5}>Шаблоны планового обслуживания</Title>
              <Table
                size="small"
                pagination={false}
                dataSource={[
                  { key: '1', name: 'Ежемесячное ТО видеонаблюдения', period: 'Ежемесячно', items: 8, day: 20 },
                  { key: '2', name: 'Квартальное ТО ОПС', period: 'Ежеквартально', items: 15, day: 15 },
                  { key: '3', name: 'Ежемесячное ТО СКУД', period: 'Ежемесячно', items: 6, day: 25 },
                  { key: '4', name: 'Полугодовое ТО дымоудаления', period: 'Раз в 6 месяцев', items: 12, day: 1 },
                  { key: '5', name: 'Ежегодное ТО оповещения', period: 'Ежегодно', items: 20, day: 1 },
                ]}
                columns={[
                  { title: 'Название', dataIndex: 'name', key: 'name' },
                  { title: 'Период', dataIndex: 'period', key: 'period', width: 150 },
                  { title: 'Пунктов чек-листа', dataIndex: 'items', key: 'items', width: 130, align: 'center' as const },
                  { title: 'День месяца', dataIndex: 'day', key: 'day', width: 110, render: (v: number) => <InputNumber value={v} min={1} max={28} size="small" style={{ width: 60 }} /> },
                ]}
              />
              <div style={{ marginTop: 16 }}>
                <Space>
                  <Button type="primary" icon={<SaveOutlined />}>Сохранить</Button>
                  <Button>Добавить шаблон</Button>
                </Space>
              </div>
            </Card>
          ),
        },
        {
          key: 'notifications',
          label: <span><MailOutlined /> Уведомления</span>,
          children: (
            <Card size="small">
              <Title level={5}>Каналы уведомлений</Title>
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="SMTP сервер"><Input placeholder="smtp.example.com" defaultValue="smtp.yandex.ru" /></Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Порт"><InputNumber defaultValue={465} style={{ width: '100%' }} /></Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="SSL"><Switch defaultChecked /></Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Title level={5}>Telegram Bot</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Bot Token"><Input.Password placeholder="123456:ABC..." /></Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Chat ID"><Input placeholder="-100123456789" /></Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Title level={5}>Типы уведомлений</Title>
                <Table
                  size="small"
                  pagination={false}
                  dataSource={[
                    { key: '1', event: 'Новая заявка', email: true, sms: true, telegram: true, push: true },
                    { key: '2', event: 'SLA нарушена', email: true, sms: true, telegram: true, push: true },
                    { key: '3', event: 'Назначение заявки', email: true, sms: false, telegram: true, push: true },
                    { key: '4', event: 'Истечение договора', email: true, sms: false, telegram: false, push: false },
                    { key: '5', event: 'Оплата получена', email: true, sms: false, telegram: true, push: false },
                  ]}
                  columns={[
                    { title: 'Событие', dataIndex: 'event', key: 'event' },
                    { title: 'Email', dataIndex: 'email', key: 'email', render: (v: boolean) => <Switch defaultChecked={v} size="small" /> },
                    { title: 'SMS', dataIndex: 'sms', key: 'sms', render: (v: boolean) => <Switch defaultChecked={v} size="small" /> },
                    { title: 'Telegram', dataIndex: 'telegram', key: 'telegram', render: (v: boolean) => <Switch defaultChecked={v} size="small" /> },
                    { title: 'Push', dataIndex: 'push', key: 'push', render: (v: boolean) => <Switch defaultChecked={v} size="small" /> },
                  ]}
                />
                <div style={{ marginTop: 16 }}><Button type="primary" icon={<SaveOutlined />}>Сохранить</Button></div>
              </Form>
            </Card>
          ),
        },
        {
          key: 'pricing',
          label: <span><DollarOutlined /> Прайс-лист</span>,
          children: (
            <Card size="small">
              <Title level={5}>Стоимость услуг</Title>
              <Table
                size="small"
                pagination={false}
                dataSource={[
                  { key: '1', service: 'Выезд инженера', unit: 'выезд', price: 3500 },
                  { key: '2', service: 'Диагностика ОПС', unit: 'час', price: 2500 },
                  { key: '3', service: 'ТО видеонаблюдения (1 камера)', unit: 'шт', price: 500 },
                  { key: '4', service: 'ТО СКУД (1 контроллер)', unit: 'шт', price: 800 },
                  { key: '5', service: 'ТО дымоудаления (1 клапан)', unit: 'шт', price: 1200 },
                  { key: '6', service: 'Замена датчика ОПС', unit: 'шт', price: 1500 },
                  { key: '7', service: 'Прокладка кабеля (1м)', unit: 'м.п.', price: 150 },
                  { key: '8', service: 'Настройка IP-камеры', unit: 'шт', price: 1000 },
                ]}
                columns={[
                  { title: 'Услуга', dataIndex: 'service', key: 'service' },
                  { title: 'Ед. изм.', dataIndex: 'unit', key: 'unit', width: 100 },
                  { title: 'Цена (₽)', dataIndex: 'price', key: 'price', width: 120, render: (v: number) => <InputNumber value={v} style={{ width: 100 }} formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} /> },
                ]}
              />
              <div style={{ marginTop: 16 }}>
                <Space>
                  <Button type="primary" icon={<SaveOutlined />}>Сохранить</Button>
                  <Button>Добавить услугу</Button>
                </Space>
              </div>
            </Card>
          ),
        },
      ]} />
    </div>
  );
}
