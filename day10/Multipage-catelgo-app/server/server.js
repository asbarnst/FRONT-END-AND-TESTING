import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'products.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper helper to load products
async function readProducts() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file, initializing empty array:', error);
    return [];
  }
}

// Helper helper to save products
async function writeProducts(products) {
  await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2), 'utf8');
}

// Get all categories with aggregated details
app.get('/api/categories', async (req, res) => {
  try {
    const products = await readProducts();
    const categoriesMap = {};
    
    // Default categories details
    const categoryDetails = {
      audio: { name: 'Audio', description: 'High-fidelity headphones, earbuds, and immersive sound systems.' },
      wearables: { name: 'Wearables', description: 'Smartwatches, rings, and health trackers for active lifestyles.' },
      workspace: { name: 'Workspace', description: 'Ergonomic furniture, mechanical keyboards, and displays.' },
      'smart-home': { name: 'Smart Home', description: 'Intelligent security cameras, ambient lights, and controllers.' }
    };

    // Count products per category
    products.forEach(p => {
      const cat = p.category || 'other';
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = {
          slug: cat,
          name: categoryDetails[cat]?.name || cat.charAt(0).toUpperCase() + cat.slice(1),
          description: categoryDetails[cat]?.description || `Products in ${cat} category.`,
          count: 0
        };
      }
      categoriesMap[cat].count += 1;
    });

    // Make sure all default categories are represented even if empty
    Object.keys(categoryDetails).forEach(cat => {
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = {
          slug: cat,
          name: categoryDetails[cat].name,
          description: categoryDetails[cat].description,
          count: 0
        };
      }
    });

    res.json(Object.values(categoriesMap));
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

// Get products with sorting and filtering
app.get('/api/products', async (req, res) => {
  try {
    const products = await readProducts();
    const { category, search, minPrice, maxPrice, rating, sort } = req.query;
    
    let filteredProducts = [...products];

    // Filter by Category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Filter by Search Query (matches name or description)
    if (search) {
      const query = search.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // Filter by Min Price
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filteredProducts = filteredProducts.filter(p => p.price >= min);
      }
    }

    // Filter by Max Price
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filteredProducts = filteredProducts.filter(p => p.price <= max);
      }
    }

    // Filter by Minimum Rating
    if (rating) {
      const rat = parseFloat(rating);
      if (!isNaN(rat)) {
        filteredProducts = filteredProducts.filter(p => p.rating >= rat);
      }
    }

    // Sorting logic
    if (sort) {
      switch (sort) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'featured':
          filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const products = await readProducts();
    const { name, price, description, category, image, specs, featured } = req.body;
    
    if (!name || !price || !category || !description) {
      return res.status(400).json({ error: 'Missing required product parameters' });
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      price: parseFloat(price),
      description,
      category,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      rating: 5.0, // New products start with a perfect score placeholder
      reviewsCount: 0,
      inStock: true,
      featured: !!featured,
      specs: specs || {},
      reviews: []
    };

    products.push(newProduct);
    await writeProducts(products);
    
    res.status(211).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingProduct = products[index];
    const { name, price, description, category, image, specs, featured, inStock } = req.body;

    const updatedProduct = {
      ...existingProduct,
      name: name !== undefined ? name : existingProduct.name,
      price: price !== undefined ? parseFloat(price) : existingProduct.price,
      description: description !== undefined ? description : existingProduct.description,
      category: category !== undefined ? category : existingProduct.category,
      image: image !== undefined ? image : existingProduct.image,
      specs: specs !== undefined ? specs : existingProduct.specs,
      featured: featured !== undefined ? !!featured : existingProduct.featured,
      inStock: inStock !== undefined ? !!inStock : existingProduct.inStock
    };

    products[index] = updatedProduct;
    await writeProducts(products);

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deleted = products.splice(index, 1)[0];
    await writeProducts(products);

    res.json({ message: 'Product successfully deleted', product: deleted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});
