export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Precision Tourbillon Desk Automaton',
    category: '3D Printed Kits',
    price: 3499,
    originalPrice: 4299,
    rating: 4.9,
    reviewCount: 38,
    inStock: true,
    stockCount: 14,
    isCustomOption: true,
    badge: 'Best Seller',
    shortDescription: 'A hypnotic, functional 3D-printed triple-axis tourbillon escapement driven by a steel balance spring.',
    fullDescription: 'Experience mechanical mastery on your desk. Engineered with 0.12mm high-precision additive manufacturing, this mechanical kinetic tourbillon showcases genuine horological kinematics. Comes with smooth stainless steel micro-bearings and customizable high-torque gearing.',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1000&q=80'
    ],
    specifications: {
      'Print Resolution': '0.12mm Ultra-Fine Layer Height',
      'Assembly Time': '2.5 to 3 Hours',
      'Difficulty Level': 'Intermediate (Level 3/5)',
      'Drive Type': 'Manual Wind / Gravity Escapement'
    },
    billOfMaterials: [
      '38 Precision 3D Printed Gears & Cage Parts',
      '6 ABEC-7 Stainless Steel Micro Bearings',
      'Tempered Steel Balance Hairspring',
      'Stainless Steel Metric Screws & Allen Key',
      'Anti-Vibration Weighted Silicone Feet',
      'Illustrated Blueprint Assembly Guide (Booklet & Digital)'
    ],
    dimensions: '180mm x 140mm x 195mm',
    materials: ['Matte PLA+ Composite', 'PETG High-Toughness', 'Carbon Fiber Enriched PLA'],
    colors: ['Terracotta & Charcoal', 'Stealth Matte Black', 'Ghost White & Gold', 'Cobalt Blue & Grey'],
    assemblyOptions: ['DIY Kit (Unassembled)', 'Pre-Assembled & Calibrated (+₹800)']
  },
  {
    id: 'prod-2',
    name: 'Steampunk Cyberpunk Mechanical Hexapod',
    category: '3D Printed Kits',
    price: 4899,
    originalPrice: 5999,
    rating: 4.8,
    reviewCount: 24,
    inStock: true,
    stockCount: 8,
    isCustomOption: true,
    badge: 'Trending',
    shortDescription: 'Articulated 6-legged walking robot chassis kit with modular servo brackets and snap-fit joints.',
    fullDescription: 'The Hexapod MK-IV combines biological gait kinematics with striking cyberpunk aesthetics. Each leg features 3 degrees of freedom, designed to fit standard micro-servos (SG90/MG90S) or serve as an articulated kinetic display figure.',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80'
    ],
    specifications: {
      'Total Parts': '62 3D-Printed Structural Components',
      'Degrees of Freedom': '18 Independent Pivot Points',
      'Electronics Ready': 'Mounts for Arduino Nano / ESP32 & 9g Servos',
      'Assembly Time': '3 to 4 Hours'
    },
    billOfMaterials: [
      '6 Multi-segment Leg Assemblies',
      'Dual-deck Carbon-Infill Body Frame',
      'Hardware Kit (M2.5 Hex bolts, brass threaded inserts)',
      'Wiring Harness Guide & Battery Compartment',
      'Assembly Jig for Leg Alignment'
    ],
    dimensions: '260mm x 260mm x 115mm',
    materials: ['Tough PLA+ (Industrial Grade)', 'Carbon Fiber Nylon (Ultra-Rigid)'],
    colors: ['Cyberpunk Neon Orange & Slate', 'Tactical Stealth Black', 'Industrial Yellow & Dark Grey'],
    assemblyOptions: ['DIY Kit (Hardware & Prints Only)', 'Pre-Assembled Display Model (+₹1200)']
  },
  {
    id: 'prod-3',
    name: 'Artisan Kinetic Marble Rollercoaster',
    category: 'Wooden DIY Kits',
    price: 2799,
    originalPrice: 3499,
    rating: 5.0,
    reviewCount: 52,
    inStock: true,
    stockCount: 19,
    isCustomOption: false,
    badge: 'Staff Pick',
    shortDescription: 'Hand-cranked wooden mechanical marble run with stair lifts, spiral tracks, and switchbacks.',
    fullDescription: 'Laser cut to perfection from premium 5-ply Baltic Birch plywood. Turn the smooth ergonomic hand-crank to propel 10 steel balls up the stepped helical elevator, sending them cascading down split switchbacks, triple-loop descents, and funnel traps.',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1000&q=80'
    ],
    specifications: {
      'Wood Type': 'FSC Certified Baltic Birch (3mm & 4mm)',
      'Cut Method': 'Sub-millimeter CNC Laser Cut',
      'Number of Sheets': '6 High-Density Birch Sheets (248 Pieces)',
      'Assembly Time': '4 to 5 Hours (No Glue Required)'
    },
    billOfMaterials: [
      '248 Interlocking Laser-Cut Wood Components',
      '10 High-Polish Chrome Steel Bearing Balls (11mm)',
      'Specialized Beeswax Friction Lubricant Block',
      'Precision Sandpaper & Wooden Component Extractor Tool',
      'Step-by-Step Pictorial Instruction Manual'
    ],
    dimensions: '254mm x 232mm x 185mm',
    materials: ['Natural Baltic Birch', 'Warm Smoked Walnut Veneer'],
    colors: ['Natural Warm Birch', 'Two-Tone Vintage Walnut'],
    assemblyOptions: ['DIY Kit (Standard)', 'Pre-Assembled Gift Edition (+₹950)']
  },
  {
    id: 'prod-4',
    name: 'Victorian Mechanical Pendulum Clock',
    category: 'Wooden DIY Kits',
    price: 3899,
    originalPrice: 4799,
    rating: 4.9,
    reviewCount: 41,
    inStock: true,
    stockCount: 6,
    isCustomOption: false,
    badge: 'Best Seller',
    shortDescription: 'Gravity-driven escapement clock with counterweights, pendulum regulator, and working gear train.',
    fullDescription: 'A functional tribute to classical Renaissance horology. Operates entirely without batteries or electrical power — powered by gravity through a suspended lead/sand weight canister and ticking accurately via an adjustable counter-weighted pendulum.',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'
    ],
    specifications: {
      'Mechanism': 'Deadbeat Escapement with Weighted Pendulum',
      'Runtime': 'Up to 12 Hours per Weight Wind',
      'Pieces': '182 Laser-Profiled Precision Wooden Gears & Levers',
      'Wall Mount': 'Integrated Wall Anchor Bracket Included'
    },
    billOfMaterials: [
      'Laser-Etched Gear Train Wheels & Pinions',
      'Polished Brass Shafts & Spacers',
      'Braided Kevlar Suspension Line',
      'Weight Canister (Fill with sand or ball bearings)',
      'Escapement Calibration Gauge'
    ],
    dimensions: '350mm x 120mm x 480mm (Excl. Pendulum Drop)',
    materials: ['Baltic Birch & Sapele Hardwood Composite'],
    colors: ['Artisan Natural Wood', 'Antique Dark Stained Oak'],
    assemblyOptions: ['DIY Kit (Assembly Required)', 'Pre-Assembled & Bench-Tested (+₹1500)']
  },
  {
    id: 'prod-5',
    name: 'Custom Drone Frame & Gimbal Prototype Kit',
    category: 'Custom Prototypes',
    price: 5499,
    originalPrice: 6500,
    rating: 4.7,
    reviewCount: 16,
    inStock: true,
    stockCount: 10,
    isCustomOption: true,
    badge: 'Custom Option',
    shortDescription: 'Modular 250mm FPV quadcopter chassis with customizable vibration-damped camera bay.',
    fullDescription: 'Engineered for drone hobbyists, university robotics labs, and rapid hardware teams. Upload or specify custom mounting hole patterns, camera angle brackets, or antenna mounts during checkout for tailor-made CAD adaptation before printing.',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80'
    ],
    specifications: {
      'Wheelbase': '250mm Diagonal Motor-to-Motor',
      'Arm Strength': '100% Infill High-Impact Polycarbonate',
      'Flight Controller Mount': '30.5x30.5mm and 20x20mm dual pattern',
      'Weight': '112g (Frame Only)'
    },
    billOfMaterials: [
      '4 Reinforced Motor Arms with Crash Bumpers',
      'Top and Bottom Aerodynamic Fuselage Plates',
      'Silicone Vibration Isolation Dampers (x4)',
      'Titanium Screws & Anodized Aluminum Standoffs',
      'Custom 3D-Printed TPU Action-Cam Wedge (Angle of choice)'
    ],
    dimensions: '210mm x 195mm x 45mm',
    materials: ['Carbon Fiber Polycarbonate', 'Nylon PA12 SLS', 'Impact-Tough PETG'],
    colors: ['Racing Orange', 'Stealth Carbon Black', 'Signal Hi-Vis Green'],
    assemblyOptions: ['DIY Kit with Hardware', 'Pre-Built Frame Structure (+₹500)']
  },
  {
    id: 'prod-6',
    name: 'Bespoke IoT Enclosure & Sensor Rig Prototype',
    category: 'Custom Prototypes',
    price: 2199,
    originalPrice: 2899,
    rating: 4.8,
    reviewCount: 19,
    inStock: true,
    stockCount: 22,
    isCustomOption: true,
    badge: 'Custom Option',
    shortDescription: 'Parametric IP54 weatherproof enclosure for Raspberry Pi, ESP32, or Arduino project arrays.',
    fullDescription: 'Stop housing your innovative smart electronics in generic project boxes. Our custom prototyping service adjusts internal mounting bosses, external cable gland ports, OLED display bezels, and wall brackets to match your exact PCB gerber or dimensions.',
    images: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
    ],
    specifications: {
      'Environmental Rating': 'IP54 Splash & Dust Gasket Ready',
      'Internal Clearance': '120mm x 85mm x 40mm standard (customizable)',
      'Fastening': 'Heat-set Brass M3 Inserts on all Lid Points',
      'Wall Thickness': '2.8mm Rigid Shell'
    },
    billOfMaterials: [
      'Lower Base Enclosure with PCB Standoff Columns',
      'Interchangeable Faceplate (Blank or Pre-drilled for screen)',
      'O-ring Rubber Weather Gasket Ring',
      '8 Brass M3 Heat-Set Inserts + Black Oxide Screws',
      'DIN Rail & Drywall Mounting Clips'
    ],
    dimensions: '135mm x 100mm x 48mm',
    materials: ['UV-Resistant ASA Resin', 'Tough PETG', 'Flame-Retardant ABS'],
    colors: ['Industrial Light Grey (RAL 7035)', 'Matte Black', 'Terracotta Orange'],
    assemblyOptions: ['DIY Kit (Enclosure + Hardware)', 'Pre-Fitted Gasket & Threaded Inserts (+₹300)']
  },
  {
    id: 'prod-7',
    name: 'Miniature V8 Engine Mechanical Model Kit',
    category: '3D Printed Kits',
    price: 3999,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 64,
    inStock: true,
    stockCount: 11,
    isCustomOption: false,
    badge: 'Best Seller',
    shortDescription: 'Cutaway 32-valve overhead-cam V8 engine model with moving pistons, crankshaft, and timing belts.',
    fullDescription: 'A mechanic’s dream display piece. Features translucent cylinder blocks so you can watch each piston fire in proper firing sequence! Driven by a concealed electric micro-motor or manual crank wheel, showcasing valves, camshafts, and spinning flywheel in motion.',
    images: [
      'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80'
    ],
    specifications: {
      'Engine Architecture': '90-degree V8 Dual Overhead Cam (DOHC)',
      'Moving Parts': '8 Pistons, Crankshaft, 16 Rocker Arms, Timing Belt',
      'Power Source': 'Battery Powered 3V Motor + Hand Crank Mode',
      'Assembly Time': '5 to 6 Hours'
    },
    billOfMaterials: [
      'Engine Block & Clear Acrylic Inspection Windows',
      '8 Connected Pistons with Wrist Pins & Connecting Rods',
      'Multi-Journal Counterbalanced Crankshaft',
      'Toothed Timing Belts & Pulleys',
      'Micro Reduction Gearmotor & Battery Box',
      'Detailed Mechanical Assembly Manual'
    ],
    dimensions: '220mm x 165mm x 150mm',
    materials: ['High-Detail PLA & PETG', 'Clear SLA Resin Cylinders'],
    colors: ['Classic Red & Aluminum Silver', 'Racing Blue & Gunmetal', 'All-Black Performance Edition'],
    assemblyOptions: ['DIY Kit (Complete Unassembled)', 'Pre-Assembled & Running (+₹1400)']
  },
  {
    id: 'prod-8',
    name: 'Artisan Wooden Secret Cryptex Puzzle Box',
    category: 'Wooden DIY Kits',
    price: 1999,
    originalPrice: 2499,
    rating: 4.9,
    reviewCount: 47,
    inStock: true,
    stockCount: 25,
    isCustomOption: true,
    badge: 'Trending',
    shortDescription: 'Davinci-inspired laser-cut wooden cryptex vault with customizable 5-letter combination lock.',
    fullDescription: 'Keep your secret notes, jewelry, or flash drives securely hidden inside. Constructed with multi-layered birch wood rings that must be aligned to your personal secret password before the inner chamber slides open.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'
    ],
    specifications: {
      'Chamber Capacity': '110mm Length x 38mm Diameter',
      'Code Combinations': 'Over 11,881,376 Possible Letter Alignments',
      'Materials': 'Eco-Friendly Laser Cut Birch & Brass Rivets',
      'Difficulty': 'Challenging Build (Level 4/5)'
    },
    billOfMaterials: [
      '5 Rotating Letter Disc Rings',
      'Dual Key-way Inner Slide Core',
      'Brass Hardware Pins & Washers',
      'Customizable Reset Tool for changing password anytime',
      'Velvet Gift Pouch for Vault Chamber'
    ],
    dimensions: '190mm x 75mm x 75mm',
    materials: ['Baltic Birch & Sapele Veneer'],
    colors: ['Golden Birch Finish', 'Antique Teak Wood Finish'],
    assemblyOptions: ['DIY Kit (Assemble Your Own Vault)', 'Pre-Assembled & Code Configured (+₹400)']
  }
];

export const CATEGORIES = [
  {
    id: '3d-printed-kits',
    name: '3D Printed Kits',
    tagline: 'Precision engineered kinetic escapements, mechanical models & robotic links.',
    icon: 'Printer',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    count: 18
  },
  {
    id: 'wooden-diy-kits',
    name: 'Wooden DIY Kits',
    tagline: 'Artisan laser-crafted kinetic marble runs, pendulum clocks & mechanical vaults.',
    icon: 'Trees',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    count: 24
  },
  {
    id: 'custom-prototypes',
    name: 'Custom Prototypes',
    tagline: 'Tailored rapid prototyping, custom drone chassis, IoT enclosures & CAD specs.',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    count: 12
  }
];
