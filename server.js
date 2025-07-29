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

    // For testing - use mock data first, then try real API
    console.log(`Searching for: ${query} in currency: ${currency}`);
    
    try {
      // API Ninjas Amazon Product Search
      const amazonResponse = await axios.get('https://api.api-ninjas.com/v1/amazonsearch', {
        params: { query },
        headers: {
          'X-Api-Key': process.env.API_NINJAS_KEY || 'YOUR_API_KEY_HERE'
        },
        timeout: 5000 // 5 second timeout
      });

      const products = amazonResponse.data;
      console.log('API Response received:', products.length, 'products');
      
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

    } catch (apiError) {
      console.log('API Error, using mock data:', apiError.message);
      
      // Fallback to mock data if API fails
      const getRelevantImages = (searchQuery) => {
        const query = searchQuery.toLowerCase();
        
        // Define local image mappings based on search terms
        const imageMap = {
          'laptop': [
            '/images/laptop.svg',
            '/images/laptop.svg',
            '/images/laptop.svg'
          ],
          'headphones': [
            '/images/headphones.svg',
            '/images/headphones.svg',
            '/images/headphones.svg'
          ],
          'phone': [
            '/images/phone.svg',
            '/images/phone.svg',
            '/images/phone.svg'
          ],
          'watch': [
            '/images/phone.svg',
            '/images/phone.svg',
            '/images/phone.svg'
          ],
          'camera': [
            '/images/camera.svg',
            '/images/camera.svg',
            '/images/camera.svg'
          ],
          'keyboard': [
            '/placeholder.svg',
            '/placeholder.svg',
            '/placeholder.svg'
          ],
          'mouse': [
            '/placeholder.svg',
            '/placeholder.svg',
            '/placeholder.svg'
          ],
          'tablet': [
            '/images/phone.svg',
            '/images/phone.svg',
            '/images/phone.svg'
          ],
          'speaker': [
            '/images/headphones.svg',
            '/images/headphones.svg',
            '/images/headphones.svg'
          ],
          'chair': [
            '/placeholder.svg',
            '/placeholder.svg',
            '/placeholder.svg'
          ]
        };
        
        // Find matching category
        for (const [category, images] of Object.entries(imageMap)) {
          if (query.includes(category)) {
            return images;
          }
        }
        
        // Default to placeholder if no match
        return [
          '/placeholder.svg',
          '/placeholder.svg',
          '/placeholder.svg'
        ];
      };
      
      const relevantImages = getRelevantImages(query);
      
      const mockProducts = [
        {
          id: `mock-${Date.now()}-1`,
          name: `${query} - Premium Model`,
          price: '99.99',
          originalPrice: '$99.99',
          currency: currency,
          image: relevantImages[0],
          url: '#',
          vendor: 'Demo Store'
        },
        {
          id: `mock-${Date.now()}-2`,
          name: `${query} - Standard Edition`,
          price: '79.99',
          originalPrice: '$79.99',
          currency: currency,
          image: relevantImages[1],
          url: '#',
          vendor: 'Demo Store'
        },
        {
          id: `mock-${Date.now()}-3`,
          name: `${query} - Budget Option`,
          price: '49.99',
          originalPrice: '$49.99',
          currency: currency,
          image: relevantImages[2],
          url: '#',
          vendor: 'Demo Store'
        }
      ];

      // Convert mock prices to target currency
      let exchangeRate = 1;
      if (currency !== 'USD') {
        try {
          const exchangeResponse = await axios.get(`https://api.frankfurter.app/latest?from=USD&to=${currency}`);
          exchangeRate = exchangeResponse.data.rates[currency];
          
          // Update mock product prices
          mockProducts.forEach(product => {
            const usdPrice = parseFloat(product.price);
            product.price = (usdPrice * exchangeRate).toFixed(2);
            product.currency = currency;
          });
        } catch (exchangeError) {
          console.warn('Exchange rate API error:', exchangeError.message);
        }
      }

      res.json({
        products: mockProducts,
        currency: currency,
        exchangeRate: exchangeRate,
        note: 'Demo data - API key may need verification'
      });
    }

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
