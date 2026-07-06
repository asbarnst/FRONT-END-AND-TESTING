import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'products.json');

const categories = ['audio', 'wearables', 'workspace', 'smart-home'];

const imagePool = {
  audio: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80",
  ],
  wearables: [
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=600&q=80",
  ],
  workspace: [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
  ],
  'smart-home': [
    "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
  ]
};

const brands = ["Aether", "Apex", "Nova", "Stellar", "Core", "Vortex", "Zenith", "Quantum", "Pulse", "Titan", "Aero", "Sol", "Luna", "Matrix", "Krypton", "Spectre", "Vector", "Echo"];
const modifiers = ["Ultra", "Pro", "Max", "Lite", "Elite", "Active", "Classic", "Premium", "Prime", "Studio", "Signature", "Phantom", "Hybrid", "Carbon", "Titanium"];

const nouns = {
  audio: ["Headphones", "Earbuds", "Ambient Speaker", "Soundbar", "Subwoofer", "DAC Amplifier", "Studio Monitor", "Wireless Mic"],
  wearables: ["Smartwatch", "Health Ring", "Fitness Tracker", "Smart Eyewear", "Sport Bracelet", "Body Sensor", "Sleep Band"],
  workspace: ["Mechanical Keyboard", "Ergonomic Mouse", "Curved Monitor", "Desk Lamp", "Desk Mat", "Vertical Stand", "Wrist Rest", "Type-C Hub", "Laptop Dock"],
  'smart-home': ["Security Camera", "Smart Panel Set", "Home Controller", "Atmospheric Light", "Voice Hub", "Smart Doorlock", "Air Purifier", "Sensors Pack"]
};

const specPool = {
  audio: {
    "Battery Life": ["Up to 30 Hours", "Up to 40 Hours", "Up to 50 Hours", "8 Hours (32 w/ Case)", "10 Hours (40 w/ Case)", "AC Powered"],
    "Drivers": ["40mm Custom Dynamic", "50mm Beryllium", "11mm Dynamic", "Dual Balanced Armature", "Planar Magnetic"],
    "Bluetooth": ["Bluetooth 5.2", "Bluetooth 5.3", "Bluetooth 5.0", "Wi-Fi & BT Dual Connection"],
    "Weight": ["250g", "280g", "320g", "5.2g per earbud", "6.1g per earbud", "1.5kg"],
    "Water Resistance": ["IPX4 Splashproof", "IPX7 Waterproof", "IP68 Dustproof", "None"]
  },
  wearables: {
    "Battery Life": ["Up to 7 Days", "Up to 10 Days", "Up to 14 Days", "Up to 24 Hours", "Up to 6 Days"],
    "Display": ["1.43\" Always-On AMOLED", "1.28\" OLED", "No Screen (App Only)", "0.96\" Color LCD"],
    "Water Resistance": ["5 ATM (50m)", "IP68 Waterproof", "10 ATM (100m)", "3 ATM"],
    "Sensors": ["Heart Rate, SpO2, Accelerometer", "Heart Rate, Temp, Sleep Tracker", "ECG, Blood Oxygen, Accelerometer, Gyroscope", "Activity tracking only"],
    "Material": ["Titanium Alloy", "Ceramic & Glass", "Anodized Aluminum", "Hypoallergenic Polymer"]
  },
  workspace: {
    "Connectivity": ["USB-C Detachable Cable", "USB-C, Bluetooth & 2.4GHz", "Dual HDMI & DisplayPort", "USB-C 90W Pass-through"],
    "Weight": ["850g", "720g", "95g (Ultra-light)", "120g", "4.2kg", "350g", "15g"],
    "Interface": ["Standard ANSI", "Hot-swappable MX Switches", "Opto-Mechanical", "Plug & Play USB", "Bluetooth Multi-Device"],
    "Material": ["CNC Machined Aluminum", "Double-shot PBT Plastic", "Eco-friendly Bamboo", "Premium Felt", "Tempered Glass"]
  },
  'smart-home': {
    "Power Source": ["AC Wall Adapter", "Rechargeable Lithium Battery", "USB-C DC input", "Hardwired 12V"],
    "Connectivity": ["Wi-Fi 2.4GHz & 5GHz", "Zigbee & Matter Protocol", "Bluetooth LE", "Thread Mesh System"],
    "Compatibility": ["Alexa, Google Assistant, Apple HomeKit", "Google Home & Alexa", "Matter Certified Hubs", "Standalone App Control"],
    "Weight": ["450g", "180g", "220g", "90g", "1.1kg"]
  }
};

const users = [
  "Grace H.", "Alan T.", "Ada L.", "Linus T.", "Steve J.", "Bill G.", "Guido R.", "Tim B.", "Richard S.", 
  "Dennis R.", "Ken T.", "Bjarne S.", "Margaret H.", "James G.", "Donald K.", "John M.", "Claude S."
];

const comments = [
  "Absolute game changer! Extremely high build quality and sleek packaging.",
  "Decent performance but setup was slightly complicated. Still highly recommend.",
  "Exceeded all my expectations. Pricey, but definitely worth every penny.",
  "Very reliable. I have been using this daily for weeks now with zero issues.",
  "Excellent response times and integration with my other developer setups.",
  "Build materials feel incredibly premium. Aesthetically pleasing on my desk.",
  "Perfect addition to my hardware catalog collection. Seamless REST synchronization.",
  "A bit smaller than expected, but features are outstanding.",
  "Solid entry-level device. Offers everything you need at a budget-friendly price."
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice(category) {
  // Let workspace/audio have higher average prices
  const baseRange = {
    audio: [29, 399],
    wearables: [49, 299],
    workspace: [19, 699],
    'smart-home': [15, 249]
  };
  const [min, max] = baseRange[category];
  const price = Math.random() * (max - min) + min;
  return parseFloat(price.toFixed(2));
}

async function populate() {
  const products = [];
  const targetCount = 155; // To safely clear 150+ products

  console.log(`Generating ${targetCount} products...`);

  // Generate products
  for (let i = 1; i <= targetCount; i++) {
    const category = getRandomItem(categories);
    const brand = getRandomItem(brands);
    const mod = getRandomItem(modifiers);
    const noun = getRandomItem(nouns[category]);
    
    const name = `${brand} ${mod} ${noun}`;
    const price = getRandomPrice(category);
    
    // Choose a random image from the pool of the respective category
    const images = imagePool[category];
    const image = images[i % images.length];

    const rating = parseFloat((Math.random() * 0.9 + 4.1).toFixed(1)); // 4.1 to 5.0
    const reviewsCount = Math.floor(Math.random() * 280) + 15;

    // Pick 2-3 specifications randomly
    const specFields = specPool[category];
    const specs = {};
    Object.entries(specFields).forEach(([key, values]) => {
      // 80% chance of adding each spec
      if (Math.random() > 0.20) {
        specs[key] = getRandomItem(values);
      }
    });

    // Make sure at least 2 specs exist
    if (Object.keys(specs).length < 2) {
      Object.entries(specFields).forEach(([key, values]) => {
        specs[key] = getRandomItem(values);
      });
    }

    // Generate 1-2 reviews
    const reviews = [];
    const reviewCount = Math.floor(Math.random() * 2) + 1;
    for (let r = 1; r <= reviewCount; r++) {
      reviews.push({
        id: `rev-${i}-${r}`,
        user: getRandomItem(users),
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
        comment: getRandomItem(comments),
        date: `2026-06-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      });
    }

    products.push({
      id: `prod-${i}`,
      name,
      price,
      description: `The ${name} is engineered using top-grade elements specifically optimized for high durability, reliable telemetry, and peak performance. Features high-speed connectivity interfaces and integrates cleanly into existing environments.`,
      category,
      image,
      rating,
      reviewsCount,
      inStock: Math.random() > 0.12, // 88% in stock
      featured: Math.random() > 0.85, // 15% featured
      specs,
      reviews
    });
  }

  // Write file to DB path
  await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2), 'utf8');
  console.log(`Successfully generated and wrote ${products.length} products to ${DB_PATH}.`);
}

populate().catch(console.error);
