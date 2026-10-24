import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4cWhvf1VODznXVJvmQIu9oAws3Jsc1dU",
  authDomain: "kitsatoz-8becc.firebaseapp.com",
  projectId: "kitsatoz-8becc",
  storageBucket: "kitsatoz-8becc.firebasestorage.app",
  messagingSenderId: "142802893375",
  appId: "1:142802893375:web:94ec1b4dff4bb87319968a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const venomProduct = {
  id: '3d-printed-venom-symbiote-figurine',
  slug: '3d-printed-venom-symbiote-figurine',
  name: '3D Printed Venom Symbiote Collectible Figurine Statue',
  category: '3D Printed Kits',
  categories: ['3D Printed Kits'],
  price: 999,
  comparePrice: 1499,
  stock: 18,
  stockCount: 18,
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
  createdAt: new Date().toISOString()
};

async function run() {
  console.log('Writing Venom product to Firestore...');
  await setDoc(doc(db, 'products', venomProduct.id), venomProduct);
  console.log('Successfully saved Venom figurine in Firestore!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed to save to Firestore:', err);
  process.exit(1);
});
