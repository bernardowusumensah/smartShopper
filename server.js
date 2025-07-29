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
        
        // Define image mappings based on search terms
        const imageMap = {
          'laptop': [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop'
          ],
          'headphones': [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop'
          ],
          'phone': [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=300&h=300&fit=crop'
          ],
          'watch': [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=300&h=300&fit=crop'
          ],
          'camera': [
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop'
          ],
          'keyboard': [
            'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300&h=300&fit=crop'
          ],
          'mouse': [
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop'
          ],
          'tablet': [
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1585789575418-16a7d4b5e82c?w=300&h=300&fit=crop'
          ],
          'speaker': [
            'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=300&h=300&fit=crop'
          ],
          'chair': [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1549497538-303791108f95?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop'
          ]
        };
        
        // Find matching category
        for (const [category, images] of Object.entries(imageMap)) {
          if (query.includes(category)) {
            return images;
          }
        }
        
        // Default generic product images if no match
        return [
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop'
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
