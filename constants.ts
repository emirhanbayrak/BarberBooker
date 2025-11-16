import { Staff, Client, Service, Appointment } from './types';

export const STAFF_MEMBERS: Staff[] = [
  { id: 1, name: 'Aslı Yılmaz', avatar: 'https://picsum.photos/id/1027/200/200' },
];

export const CLIENTS: Client[] = [
  { id: 1, name: 'Elif Şahin', phone: '555-0101', notes: 'Hassas saç derisi var.', lastVisit: new Date('2023-10-15') },
  { id: 2, name: 'Mehmet Öztürk', phone: '555-0102', notes: 'Genellikle 3 numara yanlar.', lastVisit: new Date('2023-11-01') },
  { id: 3, name: 'Zeynep Arslan', phone: '555-0103', notes: 'Sıcak tonları seviyor.', lastVisit: new Date('2023-09-22') },
  { id: 4, name: 'Ahmet Çelik', phone: '555-0104', notes: '', lastVisit: new Date('2023-11-10') },
];

export const SERVICES: Service[] = [
  { id: 1, name: 'Saç Kesim', duration: 45, price: 250 },
  { id: 2, name: 'Fön', duration: 30, price: 150 },
  { id: 3, name: 'Boya', duration: 120, price: 800 },
  { id: 4, name: 'Röfle', duration: 180, price: 1200 },
  { id: 5, name: 'Manikür', duration: 60, price: 300 },
  { id: 6, name: 'Sakal Tıraşı', duration: 30, price: 120 },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

export const APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    clientName: 'Elif Şahin',
    staffId: 1,
    serviceId: 1,
    startTime: new Date(new Date(today).setHours(9, 0)),
    endTime: new Date(new Date(today).setHours(9, 45)),
    price: 250,
  },
  {
    id: 2,
    clientName: 'Mehmet Öztürk',
    staffId: 2, // This will not be shown for Aslı Yılmaz but exists in mock data
    serviceId: 6,
    startTime: new Date(new Date(today).setHours(10, 0)),
    endTime: new Date(new Date(today).setHours(10, 30)),
    price: 120,
  },
  {
    id: 3,
    clientName: 'Zeynep Arslan',
    staffId: 1,
    serviceId: 3,
    startTime: new Date(new Date(today).setHours(11, 0)),
    endTime: new Date(new Date(today).setHours(13, 0)),
    price: 800,
  },
    {
    id: 4,
    clientName: 'Ahmet Çelik',
    staffId: 3, // This will not be shown for Aslı Yılmaz but exists in mock data
    serviceId: 2,
    startTime: new Date(new Date(today).setHours(14, 0)),
    endTime: new Date(new Date(today).setHours(14, 30)),
    price: 150,
  },
];