import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  // ── SMARTPHONES ──
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Smartphone',
    price: 1469,
    description: 'Le smartphone premium de Samsung avec S Pen intégré, écran AMOLED 6.8 pouces, puce Snapdragon 8 Gen 3 et quadruple caméra 200MP.',
    specs: { screen: '6.8" AMOLED 120Hz', chip: 'Snapdragon 8 Gen 3', ram: '12 Go', storage: '256 Go', camera: '200MP + 50MP + 12MP + 10MP', battery: '5000 mAh' },
    image: '',
    inStock: true,
  },
  {
    name: 'Apple iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'Smartphone',
    price: 1479,
    description: 'Le flagship Apple avec puce A17 Pro, boîtier titane, caméra 48MP avec zoom optique 5x et port USB-C.',
    specs: { screen: '6.7" Super Retina XDR', chip: 'A17 Pro', ram: '8 Go', storage: '256 Go', camera: '48MP + 12MP + 12MP', battery: '4441 mAh' },
    image: '',
    inStock: true,
  },
  {
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    category: 'Smartphone',
    price: 1499,
    description: 'Smartphone photo par excellence avec optiques Leica Summilux, capteur 1 pouce 50MP et Snapdragon 8 Gen 3.',
    specs: { screen: '6.73" AMOLED 120Hz', chip: 'Snapdragon 8 Gen 3', ram: '16 Go', storage: '512 Go', camera: '50MP Leica x4', battery: '5000 mAh' },
    image: '',
    inStock: true,
  },
  {
    name: 'Samsung Galaxy A55',
    brand: 'Samsung',
    category: 'Smartphone',
    price: 499,
    description: 'Milieu de gamme Samsung avec écran Super AMOLED 120Hz, triple caméra 50MP et batterie longue durée.',
    specs: { screen: '6.6" Super AMOLED 120Hz', chip: 'Exynos 1480', ram: '8 Go', storage: '128 Go', camera: '50MP + 12MP + 5MP', battery: '5000 mAh' },
    image: '',
    inStock: true,
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro',
    brand: 'Xiaomi',
    category: 'Smartphone',
    price: 329,
    description: 'Le meilleur rapport qualité-prix avec écran AMOLED 120Hz, caméra 200MP et charge rapide 67W.',
    specs: { screen: '6.67" AMOLED 120Hz', chip: 'Snapdragon 7s Gen 2', ram: '8 Go', storage: '256 Go', camera: '200MP + 8MP + 2MP', battery: '5100 mAh' },
    image: '',
    inStock: true,
  },
  {
    name: 'Sony Xperia 1 VI',
    brand: 'Sony',
    category: 'Smartphone',
    price: 1399,
    description: 'Le smartphone des créateurs avec écran 4K OLED, triple caméra Zeiss et enregistrement vidéo professionnel.',
    specs: { screen: '6.5" OLED 4K 120Hz', chip: 'Snapdragon 8 Gen 3', ram: '12 Go', storage: '256 Go', camera: '52MP Zeiss x3', battery: '5000 mAh' },
    image: '',
    inStock: false,
  },

  // ── LAPTOPS ──
  {
    name: 'Apple MacBook Pro 16 M3 Pro',
    brand: 'Apple',
    category: 'Laptop',
    price: 2799,
    description: 'Le laptop pro ultime avec puce M3 Pro, écran Liquid Retina XDR 16 pouces et autonomie record de 22 heures.',
    specs: { screen: '16.2" Liquid Retina XDR', chip: 'Apple M3 Pro', ram: '18 Go', storage: '512 Go SSD', battery: '22h', weight: '2.14 kg' },
    image: '',
    inStock: true,
  },
  {
    name: 'Asus ROG Strix G16',
    brand: 'Asus',
    category: 'Laptop',
    price: 1899,
    description: 'PC portable gaming avec RTX 4070, écran 240Hz, processeur Intel Core i9 et clavier RGB personnalisable.',
    specs: { screen: '16" QHD 240Hz', chip: 'Intel Core i9-14900HX', ram: '16 Go DDR5', storage: '1 To SSD', gpu: 'RTX 4070 8 Go', weight: '2.5 kg' },
    image: '',
    inStock: true,
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    brand: 'Lenovo',
    category: 'Laptop',
    price: 1649,
    description: 'Ultrabook professionnel ultra-léger avec écran 14 pouces 2.8K OLED, Intel Core i7 et 1.12 kg seulement.',
    specs: { screen: '14" 2.8K OLED', chip: 'Intel Core i7-1365U', ram: '16 Go', storage: '512 Go SSD', battery: '15h', weight: '1.12 kg' },
    image: '',
    inStock: true,
  },
  {
    name: 'Asus ZenBook 14 OLED',
    brand: 'Asus',
    category: 'Laptop',
    price: 1099,
    description: 'Ultrabook élégant avec écran OLED 14 pouces, Intel Core Ultra 7 et design compact en aluminium.',
    specs: { screen: '14" 2.8K OLED', chip: 'Intel Core Ultra 7', ram: '16 Go', storage: '512 Go SSD', battery: '16h', weight: '1.28 kg' },
    image: '',
    inStock: true,
  },
  {
    name: 'Lenovo Legion Pro 5',
    brand: 'Lenovo',
    category: 'Laptop',
    price: 2199,
    description: 'Laptop gaming haut de gamme avec RTX 4070, écran 16 pouces 240Hz et système de refroidissement avancé.',
    specs: { screen: '16" WQXGA 240Hz', chip: 'AMD Ryzen 9 7945HX', ram: '32 Go DDR5', storage: '1 To SSD', gpu: 'RTX 4070 8 Go', weight: '2.52 kg' },
    image: '',
    inStock: true,
  },
  {
    name: 'Samsung Galaxy Book4 Pro',
    brand: 'Samsung',
    category: 'Laptop',
    price: 1799,
    description: 'Laptop premium Samsung avec écran AMOLED 16 pouces, Intel Core Ultra 7, ultra-fin et léger.',
    specs: { screen: '16" AMOLED 3K 120Hz', chip: 'Intel Core Ultra 7', ram: '16 Go', storage: '512 Go SSD', battery: '18h', weight: '1.56 kg' },
    image: '',
    inStock: false,
  },

  // ── WEARABLES ──
  {
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    category: 'Wearable',
    price: 899,
    description: 'La montre connectée la plus robuste d Apple avec boîtier titane, GPS double fréquence et autonomie 36h.',
    specs: { screen: '49mm OLED', chip: 'Apple S9', battery: '36h', water: '100m', sensors: 'SpO2, ECG, température' },
    image: '',
    inStock: true,
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic',
    brand: 'Samsung',
    category: 'Wearable',
    price: 399,
    description: 'Montre connectée premium avec lunette rotative, suivi santé complet et Wear OS Google.',
    specs: { screen: '47mm Super AMOLED', chip: 'Exynos W930', battery: '40h', water: '50m', sensors: 'SpO2, ECG, BIA' },
    image: '',
    inStock: true,
  },
  {
    name: 'Xiaomi Smart Band 8 Pro',
    brand: 'Xiaomi',
    category: 'Wearable',
    price: 59,
    description: 'Bracelet connecté avec grand écran AMOLED, GPS intégré, 150+ modes sportifs et 14 jours d autonomie.',
    specs: { screen: '1.74" AMOLED', battery: '14 jours', water: '50m', sensors: 'SpO2, fréquence cardiaque', gps: 'Oui' },
    image: '',
    inStock: true,
  },
  {
    name: 'Sony WF-1000XM5',
    brand: 'Sony',
    category: 'Wearable',
    price: 299,
    description: 'Écouteurs true wireless haut de gamme avec réduction de bruit leader, codec LDAC et 24h d autonomie.',
    specs: { driver: '8.4mm', anc: 'Oui (leader)', battery: '8h + 16h boîtier', codec: 'LDAC, AAC, SBC', water: 'IPX4' },
    image: '',
    inStock: true,
  },
  {
    name: 'Samsung Galaxy Buds3 Pro',
    brand: 'Samsung',
    category: 'Wearable',
    price: 249,
    description: 'Écouteurs premium Samsung avec ANC intelligent, son Hi-Fi 24 bits et design semi-ouvert confortable.',
    specs: { driver: '10.5mm', anc: 'Oui (adaptatif)', battery: '7h + 23h boîtier', codec: 'SSC HiFi, AAC', water: 'IP57' },
    image: '',
    inStock: true,
  },

  // ── ACCESSOIRES ──
  {
    name: 'Apple AirPods Max',
    brand: 'Apple',
    category: 'Accessoire',
    price: 579,
    description: 'Casque premium Apple avec audio spatial, réduction de bruit active et design en aluminium et acier.',
    specs: { driver: '40mm Apple', anc: 'Oui', battery: '20h', connectivity: 'Bluetooth 5.0', weight: '384g' },
    image: '',
    inStock: true,
  },
  {
    name: 'Asus ROG Cetra True Wireless',
    brand: 'Asus',
    category: 'Accessoire',
    price: 99,
    description: 'Écouteurs gaming true wireless avec latence ultra-faible, ANC et éclairage RGB.',
    specs: { driver: '10mm', anc: 'Oui', battery: '5.5h + 21.5h', latency: '40ms', water: 'IPX5' },
    image: '',
    inStock: true,
  },
  {
    name: 'Xiaomi 67W Power Bank 10000mAh',
    brand: 'Xiaomi',
    category: 'Accessoire',
    price: 39,
    description: 'Batterie externe compacte avec charge rapide 67W, USB-C bidirectionnel et affichage LED.',
    specs: { capacity: '10000 mAh', output: '67W USB-C', ports: '1 USB-C + 1 USB-A', weight: '220g' },
    image: '',
    inStock: true,
  },
  {
    name: 'Samsung T7 Shield SSD 1To',
    brand: 'Samsung',
    category: 'Accessoire',
    price: 109,
    description: 'SSD portable ultra-résistant avec vitesses de 1050 Mo/s, certifié IP65 et antichoc.',
    specs: { capacity: '1 To', speed: '1050 Mo/s lecture', interface: 'USB 3.2 Gen 2', resistance: 'IP65, chute 3m', weight: '98g' },
    image: '',
    inStock: true,
  },
  {
    name: 'Lenovo ThinkPad USB-C Dock Gen 2',
    brand: 'Lenovo',
    category: 'Accessoire',
    price: 249,
    description: 'Station d accueil professionnelle USB-C avec triple écran, Ethernet Gigabit et charge 100W.',
    specs: { ports: '3x USB-A, 2x USB-C, 2x HDMI, 1x DP', power: '100W PD', ethernet: 'Gigabit', display: 'Triple 4K' },
    image: '',
    inStock: true,
  },
  {
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'Accessoire',
    price: 349,
    description: 'Casque circum-aural référence avec réduction de bruit adaptative, 30h d autonomie et son LDAC Hi-Res.',
    specs: { driver: '30mm', anc: 'Oui (8 micros)', battery: '30h', codec: 'LDAC, AAC, SBC', weight: '250g' },
    image: '',
    inStock: true,
  },
  {
    name: 'Apple MagSafe Charger Duo',
    brand: 'Apple',
    category: 'Accessoire',
    price: 149,
    description: 'Chargeur sans fil pliable pour iPhone et Apple Watch avec alignement magnétique MagSafe.',
    specs: { power: '15W iPhone + 5W Watch', compatibility: 'iPhone 12+, Apple Watch', cable: 'USB-C 1m', weight: '132g' },
    image: '',
    inStock: false,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    await Product.deleteMany({});
    console.log('🗑️  Products collection cleared');

    const created = [];
    for (const product of products) {
    const doc = await Product.create(product);
    created.push(doc);
    }
    console.log(`🌱 ${created.length} products seeded successfully`);

    const stats = created.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    console.log('📊 Breakdown:', stats);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();