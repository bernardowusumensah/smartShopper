// results.js - Results page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update watchlist count in navigation
    updateWatchlistCount();

    // Get search parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const currency = urlParams.get('currency') || 'USD';

    // Fill in the search form with current values
    const productInput = document.getElementById('productInput');
    const currencySelect = document.getElementById('currencySelect');
    
    if (query) {
        productInput.value = query;
        currencySelect.value = currency;
        performSearch(query, currency);
    }

    // Handle new searches from the results page
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newQuery = productInput.value.trim();
        const newCurrency = currencySelect.value;
        
        if (!newQuery) {
            alert('Please enter a product to search for');
            return;
        }

        // Update URL and perform search
        const newUrl = `/results?query=${encodeURIComponent(newQuery)}&currency=${newCurrency}`;
        window.history.pushState({}, '', newUrl);
        performSearch(newQuery, newCurrency);
    });
});

async function performSearch(query, currency) {
    const searchInfo = document.getElementById('searchInfo');
    const searchQuery = document.getElementById('searchQuery');
    const selectedCurrency = document.getElementById('selectedCurrency');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const productsGrid = document.getElementById('productsGrid');
    const currencyInfo = document.getElementById('currencyInfo');
    const searchBtn = document.querySelector('.search-btn');
    const btnText = searchBtn.querySelector('.btn-text');
    const btnLoading = searchBtn.querySelector('.btn-loading');

    // Show loading state
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    productsGrid.innerHTML = '';
    searchInfo.style.display = 'none';
    currencyInfo.style.display = 'none';
    
    // Update button state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    searchBtn.disabled = true;

    try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&currency=${currency}`);
        const data = await response.json();

        // Hide loading
        loading.style.display = 'none';
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        searchBtn.disabled = false;

        if (!response.ok) {
            throw new Error(data.error || 'Failed to search products');
        }

        if (data.products && data.products.length > 0) {
            // Show search info
            searchQuery.textContent = query;
            selectedCurrency.textContent = currency;
            searchInfo.style.display = 'block';
            
            // Display products
            displayProducts(data.products, currency);
            
            // Show currency info if conversion was applied
            if (currency !== 'USD') {
                currencyInfo.style.display = 'block';
            }
        } else {
            errorMessage.style.display = 'block';
        }

    } catch (error) {
        console.error('Search error:', error);
        
        // Hide loading and show error
        loading.style.display = 'none';
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        searchBtn.disabled = false;
        
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayProducts(products, currency) {
    const productsGrid = document.getElementById('productsGrid');
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const isInWatchlist = watchlist.some(item => item.id === product.id);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZhNzM3ZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTRweCI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${product.price} ${product.currency}</div>
                <div class="product-actions">
                    ${isInWatchlist ? 
                        `<button class="remove-from-watchlist" onclick="removeFromWatchlist('${product.id}')">Remove from Watchlist</button>` :
                        `<button class="add-to-watchlist" onclick="addToWatchlist('${product.id}')">Add to Watchlist</button>`
                    }
                    <a href="${product.url}" target="_blank" class="view-product">View Product</a>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });

    // Store current products in memory for watchlist operations
    window.currentProducts = products;
}

function addToWatchlist(productId) {
    const product = window.currentProducts.find(p => p.id === productId);
    if (!product) return;

    let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    // Check if already in watchlist
    if (watchlist.some(item => item.id === productId)) {
        alert('Product is already in your watchlist');
        return;
    }

    // Add to watchlist with timestamp
    const watchlistItem = {
        ...product,
        dateAdded: new Date().toISOString()
    };
    
    watchlist.push(watchlistItem);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    
    // Update UI
    updateWatchlistCount();
    
    // Update button
    const button = document.querySelector(`button[onclick="addToWatchlist('${productId}')"]`);
    if (button) {
        button.outerHTML = `<button class="remove-from-watchlist" onclick="removeFromWatchlist('${productId}')">Remove from Watchlist</button>`;
    }
    
    // Show success message
    showNotification('Product added to watchlist!', 'success');
}

function removeFromWatchlist(productId) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    watchlist = watchlist.filter(item => item.id !== productId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    
    // Update UI
    updateWatchlistCount();
    
    // Update button
    const button = document.querySelector(`button[onclick="removeFromWatchlist('${productId}')"]`);
    if (button) {
        button.outerHTML = `<button class="add-to-watchlist" onclick="addToWatchlist('${productId}')">Add to Watchlist</button>`;
    }
    
    // Show success message
    showNotification('Product removed from watchlist!', 'info');
}

function updateWatchlistCount() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const countElement = document.getElementById('watchlist-count');
    if (countElement) {
        countElement.textContent = `(${watchlist.length})`;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);
