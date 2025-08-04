// Smart Shopper - GitHub Pages Version
// Client-side routing and functionality

// Sample product data for demo purposes
const SAMPLE_PRODUCTS = {
  'laptop': [
    {
      id: 1,
      name: 'MacBook Air M2',
      price: 1199,
      currency: 'USD',
      image: './public/images/laptop.svg',
      description: '13-inch laptop with M2 chip, 8GB RAM, 256GB SSD',
      rating: 4.8,
      reviews: 1205
    },
    {
      id: 2,
      name: 'Dell XPS 13',
      price: 999,
      currency: 'USD',
      image: './public/images/laptop.svg',
      description: '13-inch ultrabook with Intel i7, 16GB RAM, 512GB SSD',
      rating: 4.6,
      reviews: 892
    },
    {
      id: 3,
      name: 'HP Spectre x360',
      price: 1149,
      currency: 'USD',
      image: './public/images/laptop.svg',
      description: '2-in-1 convertible laptop with touchscreen',
      rating: 4.5,
      reviews: 543
    }
  ],
  'headphones': [
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      price: 349,
      currency: 'USD',
      image: './public/images/headphones.svg',
      description: 'Premium noise-canceling wireless headphones',
      rating: 4.9,
      reviews: 2103
    },
    {
      id: 5,
      name: 'Bose QuietComfort 45',
      price: 329,
      currency: 'USD',
      image: './public/images/headphones.svg',
      description: 'World-class noise cancellation headphones',
      rating: 4.7,
      reviews: 1876
    },
    {
      id: 6,
      name: 'Apple AirPods Pro',
      price: 249,
      currency: 'USD',
      image: './public/images/headphones.svg',
      description: 'Active Noise Cancellation earbuds',
      rating: 4.6,
      reviews: 3241
    }
  ],
  'phone': [
    {
      id: 7,
      name: 'iPhone 15 Pro',
      price: 999,
      currency: 'USD',
      image: './public/images/phone.svg',
      description: 'Latest iPhone with titanium design and A17 Pro chip',
      rating: 4.8,
      reviews: 1543
    },
    {
      id: 8,
      name: 'Samsung Galaxy S24',
      price: 899,
      currency: 'USD',
      image: './public/images/phone.svg',
      description: 'Android flagship with AI features',
      rating: 4.7,
      reviews: 1287
    },
    {
      id: 9,
      name: 'Google Pixel 8',
      price: 699,
      currency: 'USD',
      image: './public/images/phone.svg',
      description: 'Pure Android experience with excellent camera',
      rating: 4.6,
      reviews: 956
    }
  ],
  'camera': [
    {
      id: 10,
      name: 'Canon EOS R8',
      price: 1499,
      currency: 'USD',
      image: './public/images/camera.svg',
      description: 'Full-frame mirrorless camera for enthusiasts',
      rating: 4.8,
      reviews: 432
    },
    {
      id: 11,
      name: 'Sony A7 IV',
      price: 2499,
      currency: 'USD',
      image: './public/images/camera.svg',
      description: 'Professional full-frame camera with 4K video',
      rating: 4.9,
      reviews: 687
    }
  ]
};

// Exchange rates for currency conversion (demo data)
const EXCHANGE_RATES = {
  USD: 1,
  CAD: 1.35,
  EUR: 0.85,
  GBP: 0.75,
  JPY: 110,
  AUD: 1.45,
  INR: 75
};

// Currency symbols
const CURRENCY_SYMBOLS = {
  USD: '$',
  CAD: 'C$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  INR: '₹'
};

// Navigation functionality
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetSection = this.getAttribute('data-section');
      showSection(targetSection);
    });
  });
}

// Show specific section
function showSection(sectionName) {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  sections.forEach(section => section.classList.remove('active'));
  navLinks.forEach(link => link.classList.remove('active'));

  const targetSection = document.getElementById(`${sectionName}-section`);
  const targetLink = document.querySelector(`[data-section="${sectionName}"]`);

  if (targetSection) targetSection.classList.add('active');
  if (targetLink) targetLink.classList.add('active');

  // Update URL hash
  window.location.hash = sectionName;
}

// Search functionality
function searchProducts(query, currency = 'USD') {
  const searchTerm = query.toLowerCase();
  let results = [];

  // Search through sample products
  Object.keys(SAMPLE_PRODUCTS).forEach(category => {
    const categoryProducts = SAMPLE_PRODUCTS[category].filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      category.includes(searchTerm)
    );
    results = results.concat(categoryProducts);
  });

  // If no specific matches, show products from related categories
  if (results.length === 0) {
    if (searchTerm.includes('wireless') || searchTerm.includes('audio')) {
      results = SAMPLE_PRODUCTS.headphones || [];
    } else if (searchTerm.includes('computer') || searchTerm.includes('macbook')) {
      results = SAMPLE_PRODUCTS.laptop || [];
    } else if (searchTerm.includes('mobile') || searchTerm.includes('smartphone')) {
      results = SAMPLE_PRODUCTS.phone || [];
    } else {
      // Show some random products
      results = SAMPLE_PRODUCTS.laptop.slice(0, 2).concat(SAMPLE_PRODUCTS.headphones.slice(0, 2));
    }
  }

  // Convert prices to selected currency
  results = results.map(product => ({
    ...product,
    convertedPrice: convertCurrency(product.price, 'USD', currency),
    displayCurrency: currency
  }));

  return results;
}

// Currency conversion
function convertCurrency(amount, fromCurrency, toCurrency) {
  const usdAmount = amount / EXCHANGE_RATES[fromCurrency];
  return usdAmount * EXCHANGE_RATES[toCurrency];
}

// Format price with currency symbol
function formatPrice(amount, currency) {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
}

// Display search results
function displayResults(results, query, currency) {
  const productsGrid = document.getElementById('productsGrid');
  const searchInfo = document.getElementById('searchInfo');
  const searchQuery = document.getElementById('searchQuery');
  const selectedCurrency = document.getElementById('selectedCurrency');
  const currencyInfo = document.getElementById('currencyInfo');
  const errorMessage = document.getElementById('errorMessage');

  if (results.length === 0) {
    errorMessage.style.display = 'block';
    searchInfo.style.display = 'none';
    currencyInfo.style.display = 'none';
    productsGrid.innerHTML = '';
    return;
  }

  errorMessage.style.display = 'none';
  searchInfo.style.display = 'block';
  currencyInfo.style.display = 'block';
  searchQuery.textContent = query;
  selectedCurrency.textContent = currency;

  productsGrid.innerHTML = results.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='./public/placeholder.svg'">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-rating">
          <span class="rating">★ ${product.rating}</span>
          <span class="reviews">(${product.reviews} reviews)</span>
        </div>
        <div class="product-price">
          <span class="price">${formatPrice(product.convertedPrice, currency)}</span>
        </div>
        <button class="add-to-watchlist-btn" onclick="addToWatchlist(${product.id}, '${product.name}', ${product.convertedPrice}, '${currency}', '${product.image}', '${product.description}')">
          Add to Watchlist
        </button>
      </div>
    </div>
  `).join('');
}

// Watchlist functionality
function addToWatchlist(id, name, price, currency, image, description) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  
  // Check if item already exists
  if (watchlist.find(item => item.id === id)) {
    alert('This item is already in your watchlist!');
    return;
  }

  const item = {
    id,
    name,
    price,
    currency,
    image,
    description,
    dateAdded: new Date().toISOString()
  };

  watchlist.push(item);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  
  updateWatchlistCount();
  alert('Item added to watchlist!');
}

function removeFromWatchlist(id) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  watchlist = watchlist.filter(item => item.id !== id);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  
  displayWatchlist();
  updateWatchlistCount();
}

function clearWatchlist() {
  if (confirm('Are you sure you want to clear your entire watchlist?')) {
    localStorage.removeItem('watchlist');
    displayWatchlist();
    updateWatchlistCount();
  }
}

function updateWatchlistCount() {
  const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  const countElement = document.getElementById('watchlist-count');
  if (countElement) {
    countElement.textContent = `(${watchlist.length})`;
  }
}

function displayWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  const watchlistGrid = document.getElementById('watchlistGrid');
  const emptyWatchlist = document.getElementById('emptyWatchlist');
  const watchlistSummary = document.getElementById('watchlistSummary');
  const itemCount = document.getElementById('itemCount');

  if (watchlist.length === 0) {
    emptyWatchlist.style.display = 'block';
    watchlistGrid.style.display = 'none';
    watchlistSummary.style.display = 'none';
    if (itemCount) itemCount.textContent = '0 items';
    return;
  }

  emptyWatchlist.style.display = 'none';
  watchlistGrid.style.display = 'grid';
  watchlistSummary.style.display = 'block';
  
  if (itemCount) itemCount.textContent = `${watchlist.length} item${watchlist.length !== 1 ? 's' : ''}`;

  watchlistGrid.innerHTML = watchlist.map(item => `
    <div class="watchlist-item">
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='./public/placeholder.svg'">
      </div>
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="item-price">${formatPrice(item.price, item.currency)}</div>
        <div class="item-date">Added: ${new Date(item.dateAdded).toLocaleDateString()}</div>
      </div>
      <button class="remove-btn" onclick="removeFromWatchlist(${item.id})">Remove</button>
    </div>
  `).join('');

  // Update summary
  const total = watchlist.reduce((sum, item) => sum + item.price, 0);
  const average = total / watchlist.length;
  
  document.getElementById('summaryItems').textContent = watchlist.length;
  document.getElementById('summaryTotal').textContent = formatPrice(total, watchlist.length > 0 ? watchlist[0].currency : 'USD');
  document.getElementById('summaryAverage').textContent = formatPrice(average, watchlist.length > 0 ? watchlist[0].currency : 'USD');
}

// Budget functionality
function setBudget() {
  const budgetInput = document.getElementById('budgetInput');
  const budgetCurrency = document.getElementById('budgetCurrency');
  const budget = parseFloat(budgetInput.value);
  const currency = budgetCurrency.value;

  if (isNaN(budget) || budget <= 0) {
    alert('Please enter a valid budget amount');
    return;
  }

  localStorage.setItem('budget', JSON.stringify({ amount: budget, currency }));
  updateBudgetDisplay();
}

function updateBudgetDisplay() {
  const budgetData = JSON.parse(localStorage.getItem('budget') || 'null');
  const budgetDisplay = document.getElementById('budgetDisplay');
  
  if (!budgetData) {
    budgetDisplay.style.display = 'none';
    return;
  }

  budgetDisplay.style.display = 'block';
  
  const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  const totalCost = watchlist.reduce((sum, item) => {
    // Convert item price to budget currency
    const convertedPrice = convertCurrency(item.price, item.currency, budgetData.currency);
    return sum + convertedPrice;
  }, 0);

  const remaining = budgetData.amount - totalCost;
  const percentage = Math.min((totalCost / budgetData.amount) * 100, 100);

  document.getElementById('budgetAmount').textContent = formatPrice(budgetData.amount, budgetData.currency);
  document.getElementById('totalCost').textContent = formatPrice(totalCost, budgetData.currency);
  document.getElementById('remainingBudget').textContent = formatPrice(remaining, budgetData.currency);
  document.getElementById('progressFill').style.width = `${percentage}%`;
  document.getElementById('progressText').textContent = `${percentage.toFixed(1)}% of budget used`;

  const budgetAlert = document.getElementById('budgetAlert');
  if (totalCost > budgetData.amount) {
    budgetAlert.style.display = 'block';
    document.getElementById('progressFill').style.backgroundColor = '#ff4444';
  } else {
    budgetAlert.style.display = 'none';
    document.getElementById('progressFill').style.backgroundColor = '#4CAF50';
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  updateWatchlistCount();
  
  // Handle URL hash on page load
  const hash = window.location.hash.slice(1);
  if (hash && ['home', 'results', 'watchlist'].includes(hash)) {
    showSection(hash);
  } else {
    showSection('home');
  }

  // Parse URL parameters for search results
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query');
  const currency = urlParams.get('currency') || 'USD';

  if (query && window.location.hash === '#results') {
    // Show loading
    document.getElementById('loading').style.display = 'block';
    
    // Simulate API delay
    setTimeout(() => {
      const results = searchProducts(query, currency);
      document.getElementById('loading').style.display = 'none';
      displayResults(results, query, currency);
    }, 1000);
  }

  // Home page search form
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = document.getElementById('productInput').value.trim();
      const currency = document.getElementById('currencySelect').value;
      
      if (!query) {
        alert('Please enter a product to search for');
        return;
      }

      // Update URL and show results
      const params = new URLSearchParams({ query, currency });
      window.history.pushState({}, '', `?${params.toString()}#results`);
      showSection('results');
      
      // Show loading
      document.getElementById('loading').style.display = 'block';
      
      // Simulate API delay
      setTimeout(() => {
        const results = searchProducts(query, currency);
        document.getElementById('loading').style.display = 'none';
        displayResults(results, query, currency);
      }, 1000);
    });
  }

  // Results page search form
  const searchFormResults = document.getElementById('searchFormResults');
  if (searchFormResults) {
    searchFormResults.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = document.getElementById('productInputResults').value.trim();
      const currency = document.getElementById('currencySelectResults').value;
      
      if (!query) return;

      document.getElementById('loading').style.display = 'block';
      
      setTimeout(() => {
        const results = searchProducts(query, currency);
        document.getElementById('loading').style.display = 'none';
        displayResults(results, query, currency);
      }, 1000);
    });
  }

  // Watchlist functionality
  const clearWatchlistBtn = document.getElementById('clearWatchlistBtn');
  if (clearWatchlistBtn) {
    clearWatchlistBtn.addEventListener('click', clearWatchlist);
  }

  const setBudgetBtn = document.getElementById('setBudgetBtn');
  if (setBudgetBtn) {
    setBudgetBtn.addEventListener('click', setBudget);
  }

  // Load watchlist and budget on watchlist page
  if (window.location.hash === '#watchlist') {
    displayWatchlist();
    updateBudgetDisplay();
  }

  // Update displays when switching to watchlist
  const watchlistLink = document.querySelector('[data-section="watchlist"]');
  if (watchlistLink) {
    watchlistLink.addEventListener('click', function() {
      setTimeout(() => {
        displayWatchlist();
        updateBudgetDisplay();
      }, 100);
    });
  }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
  const hash = window.location.hash.slice(1) || 'home';
  showSection(hash);
});