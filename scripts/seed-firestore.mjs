import fs from 'fs';
import path from 'path';
import os from 'os';

const PROJECT_ID = 'kitsatoz-8becc';
const BUCKET = 'kitsatoz-8becc.firebasestorage.app';

function getStorageUrl(filename) {
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/products%2F${encodeURIComponent(filename)}?alt=media`;
}

function getAccessToken() {
  const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  if (fs.existsSync(configPath)) {
    const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (data?.tokens?.access_token) {
      return data.tokens.access_token;
    }
  }
  throw new Error('Could not find Firebase access token in configstore.');
}

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (val instanceof Date) return { timestampValue: val.toISOString() };
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

async function saveDocument(collection, docId, data, token) {
  const fields = {};
  for (const [k, v] of Object.entries(data)) {
    fields[k] = toFirestoreValue(v);
  }

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to save ${collection}/${docId}: ${res.status} - ${errText}`);
  }
  console.log(`Saved ${collection}/${docId}`);
}

const products = [
  // --- 3D PRINTED SECTION ---
  {
    id: '3d-printed-venom-symbiote-figurine',
    slug: '3d-printed-venom-symbiote-figurine',
    name: '3D Printed Venom Symbiote Collectible Figurine Statue',
    category: '3D Printed Kits',
    categories: ['3D Printed Kits'],
    price: 999,
    comparePrice: 1499,
    stock: 18,
    bestSeller: true,
    published: true,
    customizable: true,
    badge: 'Featured Masterpiece',
    description: 'Ultra-high detail 3D printed Venom symbiote figurine perched menacingly atop a stone monolith. Features intricate anatomy, extended dripping tongue, razor claws, and spider chest insignia. Available in collector hand-painted or raw DIY paintable edition.',
    specs: {
      Material: 'High-Density Tough Resin & PLA+ Composite',
      Height: '185mm (Approx 7.3 inches) with stone pedestal',
      Base: '95mm x 90mm Stable Monolith Display Base',
      Finish: 'Hand-Painted Master Edition / Raw DIY Paintable',
      Resolution: '0.08mm Ultra-Fine Layer Height'
    },
    images: [
      '/products/3d-printed-venom-figurine-front.jpg',
      '/products/3d-printed-venom-figurine-side.jpg',
      '/products/3d-printed-venom-figurine-raw.jpg'
    ],
    createdAt: new Date()
  },
  {
    id: '3d-printed-kitsatoz-robotic-arm-frame',
    slug: '3d-printed-kitsatoz-robotic-arm-frame',
    name: 'KITSaTOz 3D Printed Robotic Arm & Linkage Mechanism Frame Kit',
    category: '3D Printed Kits',
    categories: ['3D Printed Kits', 'Robotics & Components'],
    price: 499,
    comparePrice: 699,
    stock: 25,
    bestSeller: true,
    published: true,
    customizable: true,
    badge: 'KITSaTOz Original',
    description: 'Official KITSaTOz precision 3D-printed modular robotic arm frame. Features snap-break sprue runners, dual linkage slider bars, servo mounting horns, and eccentric disc cams for building pan-tilt mechanisms and robotic arms.',
    specs: {
      Material: 'Industrial-Grade Matte White PLA+',
      Components: '2x Slotted Linkage Bars, 2x Servo Horns, 2x Disc Cams, 2x U-Brackets',
      Compatibility: 'Standard Micro Servos (SG90 / MG90S) & TT BO Motors',
      Dimensions: '165mm x 155mm x 22mm',
      Assembly: 'Snap-off Sprue with M3 Precision Holes'
    },
    images: [
      '/products/image2.jpeg',
      '/products/image_1.jpeg'
    ],
    createdAt: new Date()
  },
  {
    id: '3d-printed-lord-ganesha-figurine',
    slug: '3d-printed-lord-ganesha-figurine',
    name: '3D Printed Lord Ganesha Divine Meditative Figurine',
    category: '3D Printed Kits',
    categories: ['3D Printed Kits'],
    price: 799,
    comparePrice: 1099,
    stock: 20,
    bestSeller: true,
    published: true,
    customizable: false,
    badge: 'Spiritual Artisan',
    description: 'Intricately detailed 3D-printed Lord Ganesha idol in vivid devotional vermilion red. Features delicate micro-layer relief on the ornate mukut (crown), ceremonial weapons, modak, and blessing posture.',
    specs: {
      Material: 'Vibrant Devotional Red Biopolymer PLA',
      LayerHeight: '0.08mm Ultra-Fine Detail',
      Dimensions: '110mm x 85mm x 140mm',
      Weight: '135g Solid Infill Base',
      Finish: 'Silky Matte Vermilion Red'
    },
    images: [
      '/products/ganesh_image.jpeg'
    ],
    createdAt: new Date()
  },
  {
    id: '3d-printed-spider-emblem-wall-art',
    slug: '3d-printed-spider-emblem-wall-art',
    name: '3D Printed Spider Emblem Silhouette Wall Art Plaque',
    category: '3D Printed Kits',
    categories: ['3D Printed Kits'],
    price: 349,
    comparePrice: 499,
    stock: 30,
    bestSeller: true,
    published: true,
    customizable: true,
    badge: '3D Wall Art',
    description: 'Iconic arachnid superhero insignia crafted through precision multi-layer 3D printing. Features a raised geometric spider silhouette with elongated predatory legs mounted on a sleek minimalist backing plaque.',
    specs: {
      Material: 'Dual-Layer Matte PLA+',
      Dimensions: '160mm x 160mm x 10mm',
      Mounting: 'Wall Hanger Slot & Desk Stand Groove',
      Design: 'Precision Multi-segment Arachnid Relief'
    },
    images: [
      '/products/spider_3D.jpeg'
    ],
    createdAt: new Date()
  },
  {
    id: 'robot-smart-car-wheels-4pc',
    slug: 'robot-smart-car-wheels-4pc',
    name: '3D Printed High-Traction Robot Smart Car Wheels (Set of 4)',
    category: '3D Printed Kits',
    categories: ['3D Printed Kits', 'Robotics & Components'],
    price: 199,
    comparePrice: 299,
    stock: 40,
    bestSeller: false,
    published: true,
    customizable: false,
    badge: '3D Maker Choice',
    description: 'Pack of 4 durable 65mm robotic smart car wheels with anti-skid rubber tires and 5-spoke yellow rims. Precision bore matching TT motor dual-flat shafts.',
    specs: {
      Diameter: '65mm',
      Width: '27mm',
      Shaft: 'TT Motor Dual-Flat (D-Type) 5.4mm',
      TireType: 'Anti-Skid High-Grip Rubber Tread',
      RimArchitecture: '5-Spoke Kinetic Star Hub'
    },
    images: [
      '/products/robot-wheels-set-4.jpg',
      '/products/weel.jpeg'
    ],
    createdAt: new Date()
  },

  // --- WOODEN DIY KITS ---
  {
    id: 'wooden-motor-walking-kit',
    slug: 'wooden-motor-walking-kit',
    name: 'Wooden Motor Walking Spider Kit',
    category: 'Wooden DIY Kits',
    categories: ['Wooden DIY Kits'],
    price: 349,
    comparePrice: 449,
    stock: 20,
    bestSeller: false,
    published: true,
    customizable: false,
    description: 'Laser-cut wooden motorized spider with crank-linkage legs that authentically crawls across surfaces when powered.',
    specs: {
      Material: 'Laser-Cut Birch Plywood',
      DriveMechanism: 'Electric DC Gearbox Motor',
      PowerSource: '2x AA Battery Holder with Switch',
      Dimensions: '170mm x 150mm x 90mm',
      Difficulty: 'Beginner Friendly'
    },
    images: [
      '/products/spider_wood.jpeg',
      '/products/spider_wood2.jpeg'
    ],
    createdAt: new Date()
  },
  {
    id: 'wooden-rc-car',
    slug: 'wooden-rc-car',
    name: 'Wooden Remote Control Car Kit',
    category: 'Wooden DIY Kits',
    categories: ['Wooden DIY Kits'],
    price: 599,
    comparePrice: 799,
    stock: 15,
    bestSeller: true,
    published: true,
    customizable: false,
    description: 'Assemble a wooden car with a wireless remote control.',
    specs: {
      Material: 'Plywood',
      Type: 'DIY kit',
      Control: 'Wireless remote',
      Difficulty: 'Intermediate'
    },
    images: [
      '/products/wooden-rc-car.jpg'
    ],
    createdAt: new Date()
  },
  {
    id: 'electric-wooden-airplane',
    slug: 'electric-wooden-airplane',
    name: 'Electric Wooden Airplane Kit',
    category: 'Wooden DIY Kits',
    categories: ['Wooden DIY Kits'],
    price: 399,
    comparePrice: 499,
    stock: 20,
    bestSeller: true,
    published: true,
    customizable: false,
    description: 'Build your own wooden airplane with a motor, propeller and wheels.',
    specs: {
      Material: 'Plywood',
      Type: 'DIY kit',
      Difficulty: 'Beginner'
    },
    images: [
      '/products/electric-airplane-1.jpg',
      '/products/electric-airplane-2.jpg',
      '/products/electric-airplane-3.jpg'
    ],
    createdAt: new Date()
  },
  {
    id: 'wooden-halloween-pumpkin-lantern',
    slug: 'wooden-halloween-pumpkin-lantern',
    name: 'Wooden Halloween Pumpkin LED Lantern Kit',
    category: 'Wooden DIY Kits',
    categories: ['Wooden DIY Kits'],
    price: 299,
    comparePrice: 399,
    stock: 25,
    bestSeller: true,
    published: true,
    customizable: false,
    description: "Handcrafted wooden Jack-o'-Lantern LED lamp kit that casts an eerie festive glow.",
    specs: {
      Material: 'Laser-Cut Plywood & Acrylic',
      Light: 'Red Glow LED Module Included',
      Difficulty: 'Beginner',
      Dimensions: '120mm x 110mm x 70mm'
    },
    images: [
      '/products/halloween-pumpkin-lantern-1.jpg',
      '/products/halloween-pumpkin-lantern-2.jpg',
      '/products/halloween-pumpkin-lantern-3.jpg'
    ],
    createdAt: new Date()
  },

  // --- ROBOTICS & COMPONENTS ---
  {
    id: 'bo-gear-motor-tt-dual-shaft',
    slug: 'bo-gear-motor-tt-dual-shaft',
    name: 'Dual Shaft TT BO Gear Motor (3V-6V)',
    category: 'Robotics & Components',
    categories: ['Robotics & Components'],
    price: 149,
    comparePrice: 199,
    stock: 60,
    bestSeller: true,
    published: true,
    customizable: false,
    description: 'Dual output shaft DC reduction gearbox motor (1:48 ratio) for smart cars and robotics projects.',
    specs: {
      Voltage: '3V - 6V DC',
      Ratio: '1:48',
      Speed: '200 RPM @ 6V'
    },
    images: [
      '/products/bo-gear-motor-tt.jpg'
    ],
    createdAt: new Date()
  }
];

const schemaOrder = {
  userId: '',
  name: 'Schema placeholder',
  phone: '',
  email: '',
  address: '',
  pincode: '',
  notes: '',
  items: [
    {
      id: '3d-printed-kitsatoz-robotic-arm-frame',
      name: 'KITSaTOz 3D Printed Robotic Arm & Linkage Mechanism Frame Kit',
      price: 499,
      qty: 1
    }
  ],
  total: 499,
  status: 'cancelled',
  paymentStatus: 'pending',
  isPlaceholder: true,
  createdAt: new Date()
};

async function main() {
  console.log('Fetching Firebase access token...');
  const token = getAccessToken();

  console.log(`\nSeeding ${products.length} products to Firestore...`);
  for (const product of products) {
    await saveDocument('products', product.id, product, token);
  }

  console.log('\nCreating schema placeholder in orders collection...');
  await saveDocument('orders', '_schema', schemaOrder, token);

  console.log('\nSeeding completed successfully!');
}

main().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
