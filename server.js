const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes for pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/results', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

app.get('/watchlist', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'watchlist.html'));
});

// API Routes
app.get('/api/search', async (req, res) => {
  try {
    const { query, currency = 'USD' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // API Ninjas Amazon Product Search
    const amazonResponse = await axios.get('https://api.api-ninjas.com/v1/amazonsearch', {
      params: { query },
      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY || 'YOUR_API_KEY_HERE'
      }
    });

    const products = amazonResponse.data;
    
    // Convert prices to target currency if not USD
    let exchangeRate = 1;
    if (currency !== 'USD') {
      try {
        const exchangeResponse = await axios.get(`https://api.frankfurter.app/latest?from=USD&to=${currency}`);
        exchangeRate = exchangeResponse.data.rates[currency];
      } catch (exchangeError) {
        console.warn('Exchange rate API error:', exchangeError.message);
      }
    }

    // Process products with currency conversion
    const processedProducts = products.map((product, index) => ({
      id: `${Date.now()}-${index}`,
      name: product.title || product.name || 'Unknown Product',
      price: product.price ? (parseFloat(product.price.replace('$', '')) * exchangeRate).toFixed(2) : 'N/A',
      originalPrice: product.price || 'N/A',
      currency: currency,
      image: product.image || '/placeholder-image.png',
      url: product.url || '#',
      vendor: 'Amazon'
    }));

    res.json({
      products: processedProducts,
      currency: currency,
      exchangeRate: exchangeRate
    });

  } catch (error) {
    console.error('Search API error:', error.message);
    res.status(500).json({ 
      error: 'Failed to search products',
      details: error.message 
    });
  }
});

// Currency conversion endpoint
app.get('/api/convert', async (req, res) => {
  try {
    const { from = 'USD', to = 'CAD', amount = 1 } = req.query;
    
    const response = await axios.get(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
    const rate = response.data.rates[to];
    const convertedAmount = (parseFloat(amount) * rate).toFixed(2);
    
    res.json({
      from,
      to,
      amount: parseFloat(amount),
      convertedAmount: parseFloat(convertedAmount),
      rate
    });
  } catch (error) {
    console.error('Currency conversion error:', error.message);
    res.status(500).json({ 
      error: 'Failed to convert currency',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access Smart Shopper`);
});
