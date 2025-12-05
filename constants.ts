
import { Staff, Client, Service, Appointment, ServiceCategory } from './types';

export const STAFF_MEMBERS: Staff[] = [
  { id: 1, name: 'Aslı Yılmaz', avatar: 'https://picsum.photos/id/1027/200/200' },
];

export const CLIENTS: Client[] = [
  { id: 1, name: 'Elif Şahin', phone: '555-0101', notes: 'Hassas fren hassasiyeti var.', lastVisit: new Date('2023-10-15') },
  { id: 2, name: 'Mehmet Öztürk', phone: '555-0102', notes: 'Genellikle kış bakımı için gelir.', lastVisit: new Date('2023-11-01') },
  { id: 3, name: 'Zeynep Arslan', phone: '555-0103', notes: 'Ses sistemine önem verir.', lastVisit: new Date('2023-09-22') },
  { id: 4, name: 'Ahmet Çelik', phone: '555-0104', notes: '', lastVisit: new Date('2023-11-10') },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 1, name: "Periyodik Bakım", slug: "periyodik-bakim" },
  { id: 2, name: "Fren Sistemi", slug: "fren-sistemi" },
  { id: 3, name: "Motor ve Mekanik", slug: "motor-ve-mekanik" },
  { id: 4, name: "Sıvılar ve Yağlar", slug: "sivilar-ve-yaglar" },
  { id: 5, name: "Lastik ve Jant", slug: "lastik-ve-jant" },
  { id: 6, name: "Elektrik ve Elektronik", slug: "elektrik-ve-elektronik" },
  { id: 7, name: "Klima ve Konfor", slug: "klima-ve-konfor" }
];

export const SERVICES: Service[] = [
  // Periyodik Bakım
  { id: 101, categoryId: 1, name: "Standart Periyodik Bakım", description: "Motor yağı, yağ filtresi, hava filtresi ve polen filtresi değişimi.", duration: 90, price: 2500, requiresParts: true },
  { id: 102, categoryId: 1, name: "Ağır Bakım Paketi", description: "Standart bakıma ek olarak triger, şanzıman yağı ve detaylı kontroller.", duration: 300, price: 8000, requiresParts: true },
  { id: 103, categoryId: 1, name: "Kış Bakım Kontrolü", description: "Antifriz, lastik, akü ve silecek suyu kontrolleri.", duration: 45, price: 500, requiresParts: false },
  { id: 104, categoryId: 1, name: "Muayene Öncesi Hazırlık", description: "TÜVTÜRK standartlarına göre genel araç kontrolü.", duration: 60, price: 750, requiresParts: false },
  
  // Fren Sistemi
  { id: 201, categoryId: 2, name: "Ön Fren Balatası Değişimi", description: "Ön iki tekerlek balata değişimi ve kaliper kontrolü.", duration: 60, price: 1200, requiresParts: true },
  { id: 202, categoryId: 2, name: "Arka Fren Balatası Değişimi", description: "Arka iki tekerlek balata değişimi.", duration: 60, price: 1000, requiresParts: true },
  { id: 203, categoryId: 2, name: "Ön Fren Disk Değişimi", description: "Ön disklerin ve balataların değişimi.", duration: 90, price: 3000, requiresParts: true },
  { id: 204, categoryId: 2, name: "Fren Hidroliği Değişimi", description: "Fren sistemindeki sıvının vakumla çekilip yenilenmesi.", duration: 45, price: 400, requiresParts: true },

  // Motor ve Mekanik
  { id: 301, categoryId: 3, name: "Triger Seti Değişimi", description: "Triger kayışı/zinciri ve devirdaim pompası değişimi.", duration: 240, price: 6000, requiresParts: true },
  { id: 302, categoryId: 3, name: "Debriyaj Seti Değişimi", description: "Şanzıman indirilerek baskı balata setinin değişimi.", duration: 300, price: 7000, requiresParts: true },
  { id: 303, categoryId: 3, name: "Buji Değişimi", description: "Ateşleme bujilerinin takım halinde değişimi.", duration: 45, price: 800, requiresParts: true },
  { id: 304, categoryId: 3, name: "EGR Valfi Temizliği", description: "EGR valfinin sökülerek kurum temizliğinin yapılması.", duration: 120, price: 1500, requiresParts: false },

  // Sıvılar ve Yağlar
  { id: 401, categoryId: 4, name: "Motor Yağı Değişimi (Ekstra)", description: "Sadece yağ değişimi (Filtre hariç).", duration: 30, price: 600, requiresParts: true },
  { id: 402, categoryId: 4, name: "Şanzıman Yağı Değişimi", description: "Manuel veya otomatik şanzıman yağı değişimi.", duration: 60, price: 1500, requiresParts: true },
  { id: 403, categoryId: 4, name: "Antifriz Değişimi", description: "Radyatör suyunun boşaltılıp yeni antifriz konulması.", duration: 45, price: 500, requiresParts: true },

  // Lastik ve Jant
  { id: 501, categoryId: 5, name: "Lastik Değişimi (4 Teker)", description: "Mevcut lastiklerin sökülüp yenilerinin takılması.", duration: 60, price: 600, requiresParts: false },
  { id: 502, categoryId: 5, name: "Rot Balans Ayarı", description: "Ön düzen ve tekerlek denge ayarları.", duration: 45, price: 500, requiresParts: false },
  { id: 503, categoryId: 5, name: "Lastik Tamiri (Yama)", description: "Patlak lastiğin fitil veya yama ile onarımı.", duration: 30, price: 200, requiresParts: false },

  // Elektrik ve Elektronik
  { id: 601, categoryId: 6, name: "Akü Değişimi", description: "Eski akünün sökülüp yenisinin montajı ve ölçümü.", duration: 20, price: 3000, requiresParts: true },
  { id: 602, categoryId: 6, name: "Arıza Tespit (Diagnostik)", description: "OBD cihazı ile araç beynine bağlanıp hata kodlarının okunması.", duration: 30, price: 500, requiresParts: false },
  { id: 603, categoryId: 6, name: "Ampul Değişimi", description: "Far, stop veya sinyal ampullerinin değişimi.", duration: 15, price: 100, requiresParts: true },

  // Klima ve Konfor
  { id: 701, categoryId: 7, name: "Klima Gazı Dolumu", description: "Klima sistemine gaz basılması ve kaçak kontrolü.", duration: 45, price: 1000, requiresParts: true },
  { id: 702, categoryId: 7, name: "Klima Dezenfeksiyonu", description: "Klima kanallarının ozon veya köpükle temizlenmesi.", duration: 30, price: 500, requiresParts: true }
];

export const APPOINTMENTS: Appointment[] = [];

export interface CarMake {
  make: string;
  models: string[];
}

export const CAR_DATABASE: CarMake[] = [
  { make: "Volkswagen", models: ["Golf", "Polo", "Passat", "Tiguan", "Caddy", "Transporter", "Jetta"] },
  { make: "Renault", models: ["Clio", "Megane", "Symbol", "Captur", "Kadjar", "Kangoo", "Taliant"] },
  { make: "Fiat", models: ["Egea", "Doblo", "Fiorino", "500", "Panda", "Linea", "Ducato"] },
  { make: "Ford", models: ["Focus", "Fiesta", "Kuga", "Ranger", "Transit", "Courier", "Mondeo"] },
  { make: "Toyota", models: ["Corolla", "Yaris", "C-HR", "RAV4", "Hilux", "Proace", "Auris"] },
  { make: "Opel", models: ["Corsa", "Astra", "Mokka", "Crossland", "Grandland", "Insignia", "Combo"] },
  { make: "Hyundai", models: ["i20", "i10", "Tucson", "Bayon", "Elantra", "Kona", "Accent"] },
  { make: "Peugeot", models: ["208", "3008", "2008", "5008", "301", "Rifter", "Partner"] },
  { make: "Honda", models: ["Civic", "CR-V", "Jazz", "HR-V", "City", "Accord"] },
  { make: "BMW", models: ["1 Serisi", "3 Serisi", "5 Serisi", "X1", "X3", "X5"] },
  { make: "Mercedes", models: ["A Serisi", "C Serisi", "E Serisi", "CLA", "GLA", "Vito", "Sprinter"] },
  { make: "Audi", models: ["A3", "A4", "A6", "Q2", "Q3", "Q5"] },
  { make: "Dacia", models: ["Duster", "Sandero", "Lodgy", "Jogger", "Dokker"] },
  { make: "Kia", models: ["Sportage", "Stonic", "Rio", "Picanto", "Ceed", "Xceed"] },
  { make: "Nissan", models: ["Qashqai", "Juke", "Micra", "X-Trail"] },
  { make: "Skoda", models: ["Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Scala", "Fabia"] },
  { make: "Citroen", models: ["C3", "C4", "C5 Aircross", "Berlingo", "C-Elysee"] },
  { make: "Seat", models: ["Leon", "Ibiza", "Arona", "Ateca"] }
];