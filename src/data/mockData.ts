import { Incident, Client, CRMObject, Contract, PPRTask, WarehouseItem, Notification, KPIData, User } from '../types';

export const currentUser: User = {
  id: 'u1',
  name: 'Иванов Сергей Петрович',
  email: 'admin@crm.ru',
  role: 'admin',
  phone: '+7 (495) 123-45-67',
  skills: ['ОПС', 'Видеонаблюдение', 'СКУД'],
  zone: 'Москва'
};

export const mockIncidents: Incident[] = [
  { id: '1', number: 'INC-2026-0001', title: 'Не работает камера видеонаблюдения', description: 'Камера №5 на 3 этаже не передаёт изображение', category: 'video', priority: 'high', status: 'in_progress', objectId: 'obj1', objectName: 'БЦ "Горизонт"', clientName: 'ООО "ТехноПарк"', assignedTo: 'e1', assignedToName: 'Петров А.В.', createdAt: '2026-01-15T09:30:00', deadline: '2026-01-15T17:30:00', slaReactionMinutes: 30, slaResolutionHours: 8 },
  { id: '2', number: 'INC-2026-0002', title: 'Сбой ОПС — ложное срабатывание', description: 'Датчик дыма в серверной срабатывает без причины', category: 'ops', priority: 'critical', status: 'new', objectId: 'obj2', objectName: 'ТЦ "Мегаполис"', clientName: 'АО "Ритейл Групп"', createdAt: '2026-01-15T10:15:00', deadline: '2026-01-15T14:15:00', slaReactionMinutes: 15, slaResolutionHours: 4 },
  { id: '3', number: 'INC-2026-0003', title: 'СКУД не открывает дверь', description: 'Контроллер СКУД на центральном входе не реагирует на карты', category: 'skud', priority: 'high', status: 'assigned', objectId: 'obj3', objectName: 'Офис "Альфа"', clientName: 'ООО "ФинКонсалт"', assignedTo: 'e2', assignedToName: 'Козлов И.М.', createdAt: '2026-01-15T08:00:00', deadline: '2026-01-15T16:00:00', slaReactionMinutes: 30, slaResolutionHours: 8 },
  { id: '4', number: 'INC-2026-0004', title: 'Обрыв линии СКС', description: 'Нет связи на 2-м порту коммутатора 5 этаж', category: 'sks', priority: 'medium', status: 'new', objectId: 'obj4', objectName: 'БЦ "Столица"', clientName: 'ПАО "ИнвестБанк"', createdAt: '2026-01-15T11:00:00', deadline: '2026-01-16T11:00:00', slaReactionMinutes: 60, slaResolutionHours: 24 },
  { id: '5', number: 'INC-2026-0005', title: 'Неисправность системы дымоудаления', description: 'Клапан дымоудаления не открывается при тестировании', category: 'smoke', priority: 'critical', status: 'in_progress', objectId: 'obj5', objectName: 'ЖК "Новые Зори"', clientName: 'ООО "ДевелопМакс"', assignedTo: 'e1', assignedToName: 'Петров А.В.', createdAt: '2026-01-14T16:00:00', deadline: '2026-01-15T04:00:00', slaReactionMinutes: 15, slaResolutionHours: 4 },
  { id: '6', number: 'INC-2026-0006', title: 'Сбой оповещения', description: 'Речевое оповещение не работает на парковке', category: 'alert', priority: 'medium', status: 'resolved', objectId: 'obj1', objectName: 'БЦ "Горизонт"', clientName: 'ООО "ТехноПарк"', assignedTo: 'e3', assignedToName: 'Сидоров К.Л.', createdAt: '2026-01-14T12:00:00', deadline: '2026-01-15T12:00:00', resolvedAt: '2026-01-14T18:30:00', slaReactionMinutes: 60, slaResolutionHours: 24 },
  { id: '7', number: 'INC-2026-0007', title: 'Потеря записей архива', description: 'Видеоархив за последние 3 дня отсутствует', category: 'video', priority: 'high', status: 'new', objectId: 'obj6', objectName: 'Склад "Логистик"', clientName: 'ООО "ТрансЛайн"', createdAt: '2026-01-15T07:45:00', deadline: '2026-01-15T15:45:00', slaReactionMinutes: 30, slaResolutionHours: 8 },
  { id: '8', number: 'INC-2026-0008', title: 'Датчик движения ОПС', description: 'Датчик в коридоре 2 этажа не реагирует', category: 'ops', priority: 'low', status: 'assigned', objectId: 'obj7', objectName: 'Школа №45', clientName: 'ГБОУ Школа №45', assignedTo: 'e2', assignedToName: 'Козлов И.М.', createdAt: '2026-01-15T09:00:00', deadline: '2026-01-17T09:00:00', slaReactionMinutes: 60, slaResolutionHours: 72 },
];

export const mockClients: Client[] = [
  { id: 'c1', name: 'ООО "ТехноПарк"', inn: '7701234567', phone: '+7 (495) 111-22-33', email: 'info@technopark.ru', address: 'г. Москва, ул. Ленина, 15', contractCount: 3, objectCount: 2 },
  { id: 'c2', name: 'АО "Ритейл Групп"', inn: '7709876543', phone: '+7 (495) 222-33-44', email: 'security@retail.ru', address: 'г. Москва, Кутузовский пр-т, 45', contractCount: 2, objectCount: 5 },
  { id: 'c3', name: 'ООО "ФинКонсалт"', inn: '7703456789', phone: '+7 (495) 333-44-55', email: 'office@finconsult.ru', address: 'г. Москва, ул. Тверская, 22', contractCount: 1, objectCount: 1 },
  { id: 'c4', name: 'ПАО "ИнвестБанк"', inn: '7705678901', phone: '+7 (495) 444-55-66', email: 'it@investbank.ru', address: 'г. Москва, Пресненская наб., 8', contractCount: 4, objectCount: 3 },
  { id: 'c5', name: 'ООО "ДевелопМакс"', inn: '7707890123', phone: '+7 (495) 555-66-77', email: 'info@developmax.ru', address: 'г. Москва, ул. Строителей, 10', contractCount: 2, objectCount: 8 },
];

export const mockObjects: CRMObject[] = [
  { id: 'obj1', name: 'БЦ "Горизонт"', clientId: 'c1', clientName: 'ООО "ТехноПарк"', address: 'г. Москва, ул. Ленина, 15', lat: 55.7558, lng: 37.6173, floors: 12, systems: ['Видеонаблюдение', 'ОПС', 'СКУД', 'СКС'], equipmentCount: 245 },
  { id: 'obj2', name: 'ТЦ "Мегаполис"', clientId: 'c2', clientName: 'АО "Ритейл Групп"', address: 'г. Москва, Кутузовский пр-т, 45', lat: 55.7412, lng: 37.5432, floors: 3, systems: ['ОПС', 'Видеонаблюдение', 'Дымоудаление', 'Оповещение'], equipmentCount: 580 },
  { id: 'obj3', name: 'Офис "Альфа"', clientId: 'c3', clientName: 'ООО "ФинКонсалт"', address: 'г. Москва, ул. Тверская, 22', lat: 55.7612, lng: 37.6089, floors: 5, systems: ['СКУД', 'Видеонаблюдение', 'СКС'], equipmentCount: 89 },
  { id: 'obj4', name: 'БЦ "Столица"', clientId: 'c4', clientName: 'ПАО "ИнвестБанк"', address: 'г. Москва, Пресненская наб., 8', lat: 55.7497, lng: 37.5378, floors: 20, systems: ['Видеонаблюдение', 'ОПС', 'СКУД', 'СКС', 'Дымоудаление', 'Оповещение'], equipmentCount: 1200 },
  { id: 'obj5', name: 'ЖК "Новые Зори"', clientId: 'c5', clientName: 'ООО "ДевелопМакс"', address: 'г. Москва, ул. Строителей, 10', lat: 55.7234, lng: 37.5123, floors: 25, systems: ['ОПС', 'Видеонаблюдение', 'СКУД', 'Дымоудаление', 'Оповещение'], equipmentCount: 3400 },
];

export const mockContracts: Contract[] = [
  { id: 'ct1', number: 'Д-2026-001', clientId: 'c1', clientName: 'ООО "ТехноПарк"', type: 'subscription', status: 'active', startDate: '2026-01-01', endDate: '2026-12-31', amount: 1800000, monthlyAmount: 150000, systems: ['Видеонаблюдение', 'ОПС', 'СКУД'] },
  { id: 'ct2', number: 'Д-2026-002', clientId: 'c2', clientName: 'АО "Ритейл Групп"', type: 'subscription', status: 'active', startDate: '2026-01-01', endDate: '2026-12-31', amount: 3600000, monthlyAmount: 300000, systems: ['ОПС', 'Видеонаблюдение', 'Дымоудаление'] },
  { id: 'ct3', number: 'Д-2026-003', clientId: 'c3', clientName: 'ООО "ФинКонсалт"', type: 'one_time', status: 'active', startDate: '2026-01-10', endDate: '2026-03-10', amount: 450000, systems: ['СКУД', 'Видеонаблюдение'] },
  { id: 'ct4', number: 'Д-2025-015', clientId: 'c4', clientName: 'ПАО "ИнвестБанк"', type: 'subscription', status: 'expired', startDate: '2025-01-01', endDate: '2025-12-31', amount: 5400000, monthlyAmount: 450000, systems: ['Видеонаблюдение', 'ОПС', 'СКУД', 'СКС'] },
  { id: 'ct5', number: 'Д-2026-004', clientId: 'c5', clientName: 'ООО "ДевелопМакс"', type: 'subscription', status: 'active', startDate: '2026-02-01', endDate: '2027-01-31', amount: 7200000, monthlyAmount: 600000, systems: ['ОПС', 'Видеонаблюдение', 'СКУД', 'Дымоудаление'] },
];

export const mockPPRTasks: PPRTask[] = [
  { id: 'ppr1', objectId: 'obj1', objectName: 'БЦ "Горизонт"', assignedTo: 'e1', assignedToName: 'Петров А.В.', scheduledDate: '2026-01-20', status: 'planned', template: 'Ежемесячное ТО видеонаблюдения', checklist: [{ id: 'ch1', title: 'Проверка камер (визуальный осмотр)', checked: false }, { id: 'ch2', title: 'Очистка объективов', checked: false }, { id: 'ch3', title: 'Проверка записи архива', checked: false }, { id: 'ch4', title: 'Тест поворота PTZ-камер', checked: false }] },
  { id: 'ppr2', objectId: 'obj2', objectName: 'ТЦ "Мегаполис"', assignedTo: 'e2', assignedToName: 'Козлов И.М.', scheduledDate: '2026-01-18', status: 'in_progress', template: 'Квартальное ТО ОПС', checklist: [{ id: 'ch5', title: 'Проверка датчиков дыма', checked: true }, { id: 'ch6', title: 'Тест шлейфов', checked: true }, { id: 'ch7', title: 'Проверка приёмно-контрольного прибора', checked: false }, { id: 'ch8', title: 'Замер сопротивления линий', checked: false }] },
  { id: 'ppr3', objectId: 'obj4', objectName: 'БЦ "Столица"', assignedTo: 'e3', assignedToName: 'Сидоров К.Л.', scheduledDate: '2026-01-15', status: 'overdue', template: 'Ежемесячное ТО СКУД', checklist: [{ id: 'ch9', title: 'Проверка контроллеров', checked: false }, { id: 'ch10', title: 'Тест электромагнитных замков', checked: false }, { id: 'ch11', title: 'Обновление базы карт доступа', checked: false }] },
  { id: 'ppr4', objectId: 'obj5', objectName: 'ЖК "Новые Зори"', assignedTo: 'e1', assignedToName: 'Петров А.В.', scheduledDate: '2026-01-22', status: 'planned', template: 'Полугодовое ТО дымоудаления', checklist: [{ id: 'ch12', title: 'Проверка клапанов', checked: false }, { id: 'ch13', title: 'Тест вентиляторов', checked: false }, { id: 'ch14', title: 'Проверка автоматики', checked: false }, { id: 'ch15', title: 'Замер параметров', checked: false }] },
];

export const mockWarehouse: WarehouseItem[] = [
  { id: 'w1', name: 'Камера IP Hikvision DS-2CD2143G2', sku: 'HK-2143G2', category: 'Видеонаблюдение', quantity: 15, minQuantity: 5, reserved: 3, unit: 'шт', price: 12500, location: 'A-01-03' },
  { id: 'w2', name: 'Датчик дыма ИП 212-141М', sku: 'IP-212-141', category: 'ОПС', quantity: 42, minQuantity: 20, reserved: 8, unit: 'шт', price: 890, location: 'A-02-01' },
  { id: 'w3', name: 'Контроллер СКУД Sigur SG-AC', sku: 'SG-AC-02', category: 'СКУД', quantity: 3, minQuantity: 5, reserved: 2, unit: 'шт', price: 18900, location: 'B-01-02' },
  { id: 'w4', name: 'Кабель UTP Cat5e (бухта 305м)', sku: 'UTP-5E-305', category: 'СКС', quantity: 8, minQuantity: 3, reserved: 1, unit: 'бухта', price: 7800, location: 'C-01-01' },
  { id: 'w5', name: 'Клапан дымоудаления КД-150', sku: 'KD-150', category: 'Дымоудаление', quantity: 2, minQuantity: 3, reserved: 0, unit: 'шт', price: 24500, location: 'B-02-04' },
  { id: 'w6', name: 'Оповещатель речевой РОСТ-4Т', sku: 'ROST-4T', category: 'Оповещение', quantity: 12, minQuantity: 5, reserved: 4, unit: 'шт', price: 5600, location: 'A-03-02' },
  { id: 'w7', name: 'Блок питания 12В 5А', sku: 'BP-12-5', category: 'Компоненты', quantity: 25, minQuantity: 10, reserved: 5, unit: 'шт', price: 1200, location: 'C-02-01' },
  { id: 'w8', name: 'Коммутатор TP-Link TL-SG1008', sku: 'TPL-SG1008', category: 'СКС', quantity: 6, minQuantity: 3, reserved: 0, unit: 'шт', price: 4500, location: 'C-01-03' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'incident', title: 'Новая критическая заявка', message: 'INC-2026-0002: Сбой ОПС — ложное срабатывание', read: false, createdAt: '2026-01-15T10:15:00' },
  { id: 'n2', type: 'sla', title: 'SLA нарушена!', message: 'INC-2026-0005: Превышено время реакции (15 мин)', read: false, createdAt: '2026-01-15T09:45:00' },
  { id: 'n3', type: 'assignment', title: 'Назначение заявки', message: 'Вам назначена заявка INC-2026-0003', read: true, createdAt: '2026-01-15T08:30:00' },
  { id: 'n4', type: 'system', title: 'ППР задачи сгенерированы', message: 'Создано 15 задач ППР на январь 2026', read: true, createdAt: '2026-01-14T18:00:00' },
  { id: 'n5', type: 'payment', title: 'Оплата получена', message: 'ООО "ТехноПарк" — 150 000 ₽ по договору Д-2026-001', read: true, createdAt: '2026-01-14T14:20:00' },
];

export const mockKPI: KPIData = {
  activeIncidents: 8,
  overdueIncidents: 2,
  engineersOnShift: 5,
  todayPPR: 4,
  monthlyRevenue: 1650000,
  clientSatisfaction: 4.7
};

export const engineers = [
  { id: 'e1', name: 'Петров А.В.', status: 'on_shift', lat: 55.7558, lng: 37.6173, tasks: 3, skills: ['ОПС', 'Видеонаблюдение'], phone: '+7 (916) 111-11-11' },
  { id: 'e2', name: 'Козлов И.М.', status: 'on_shift', lat: 55.7412, lng: 37.5432, tasks: 2, skills: ['СКУД', 'СКС'], phone: '+7 (916) 222-22-22' },
  { id: 'e3', name: 'Сидоров К.Л.', status: 'on_shift', lat: 55.7612, lng: 37.6089, tasks: 1, skills: ['ОПС', 'Дымоудаление', 'Оповещение'], phone: '+7 (916) 333-33-33' },
  { id: 'e4', name: 'Морозов Д.Е.', status: 'off_shift', lat: 55.7234, lng: 37.5123, tasks: 0, skills: ['Видеонаблюдение', 'СКС'], phone: '+7 (916) 444-44-44' },
  { id: 'e5', name: 'Волков Р.С.', status: 'on_shift', lat: 55.7497, lng: 37.5378, tasks: 2, skills: ['ОПС', 'СКУД', 'Видеонаблюдение'], phone: '+7 (916) 555-55-55' },
];

export const chartData = {
  incidentsByMonth: [
    { month: 'Авг', total: 45, resolved: 42, overdue: 3 },
    { month: 'Сен', total: 52, resolved: 48, overdue: 4 },
    { month: 'Окт', total: 38, resolved: 36, overdue: 2 },
    { month: 'Ноя', total: 61, resolved: 55, overdue: 6 },
    { month: 'Дек', total: 47, resolved: 44, overdue: 3 },
    { month: 'Янв', total: 33, resolved: 25, overdue: 2 },
  ],
  incidentsByCategory: [
    { name: 'Видеонаблюдение', value: 35, color: '#1677ff' },
    { name: 'ОПС', value: 28, color: '#ff4d4f' },
    { name: 'СКУД', value: 15, color: '#52c41a' },
    { name: 'СКС', value: 12, color: '#faad14' },
    { name: 'Дымоудаление', value: 6, color: '#722ed1' },
    { name: 'Оповещение', value: 4, color: '#13c2c2' },
  ],
  engineerLoad: [
    { name: 'Петров А.В.', tasks: 12, hours: 96 },
    { name: 'Козлов И.М.', tasks: 8, hours: 64 },
    { name: 'Сидоров К.Л.', tasks: 10, hours: 80 },
    { name: 'Морозов Д.Е.', tasks: 6, hours: 48 },
    { name: 'Волков Р.С.', tasks: 9, hours: 72 },
  ],
  revenueByMonth: [
    { month: 'Авг', revenue: 1200000 },
    { month: 'Сен', revenue: 1350000 },
    { month: 'Окт', revenue: 1100000 },
    { month: 'Ноя', revenue: 1500000 },
    { month: 'Дек', revenue: 1400000 },
    { month: 'Янв', revenue: 1650000 },
  ],
};
