// watchlist.js - Watchlist page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update watchlist count in navigation
    updateWatchlistCount();
    
    // Load and display watchlist
    loadWatchlist();
    
    // Load saved budget
    loadBudget();
    
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Budget setting
    const setBudgetBtn = document.getElementById('setBudgetBtn');
    const budgetInput = document.getElementById('budgetInput');
    const budgetCurrency = document.getElementById('budgetCurrency');
    
    setBudgetBtn.addEventListener('click', function() {
        const amount = parseFloat(budgetInput.value);
        const currency = budgetCurrency.value;
        
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid budget amount');
            return;
        }
        
        setBudget(amount, currency);
    });
    
    // Clear watchlist
    const clearWatchlistBtn = document.getElementById('clearWatchlistBtn');
    clearWatchlistBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear your entire watchlist?')) {
            clearWatchlist();
        }
    });
    
    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', function() {
        sortWatchlist(this.value);
    });
}

function loadWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const emptyWatchlist = document.getElementById('emptyWatchlist');
    const watchlistGrid = document.getElementById('watchlistGrid');
    const watchlistSummary = document.getElementById('watchlistSummary');
    const itemCount = document.getElementById('itemCount');
    
    // Update item count
    itemCount.textContent = `${watchlist.length} item${watchlist.length !== 1 ? 's' : ''}`;
    
    if (watchlist.length === 0) {
        emptyWatchlist.style.display = 'block';
        watchlistGrid.style.display = 'none';
        watchlistSummary.style.display = 'none';
    } else {
        emptyWatchlist.style.display = 'none';
        watchlistGrid.style.display = 'grid';
        watchlistSummary.style.display = 'block';
        
        displayWatchlistItems(watchlist);
        updateSummary(watchlist);
    }
    
    // Update budget display if budget is set
    updateBudgetDisplay();
}

function displayWatchlistItems(watchlist) {
    const watchlistGrid = document.getElementById('watchlistGrid');
    watchlistGrid.innerHTML = '';
    
    watchlist.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'product-card';
        
        const dateAdded = new Date(item.dateAdded).toLocaleDateString();
        
        itemCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="product-image" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZhNzM3ZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTRweCI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='">
            <div class="product-info">
                <h3 class="product-name">${item.name}</h3>
                <div class="product-price">${item.price} ${item.currency}</div>
                <p style="font-size: 0.9rem; color: #7f8c8d; margin: 0.5rem 0;">Added: ${dateAdded}</p>
                <div class="product-actions">
                    <button class="remove-from-watchlist" onclick="removeFromWatchlist('${item.id}')">Remove</button>
                    <a href="${item.url}" target="_blank" class="view-product">View Product</a>
                </div>
            </div>
        `;
        
        watchlistGrid.appendChild(itemCard);
    });
}

function updateSummary(watchlist) {
    const summaryItems = document.getElementById('summaryItems');
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryAverage = document.getElementById('summaryAverage');
    
    // Calculate totals (convert all to USD for calculation)
    let totalValue = 0;
    let validItems = 0;
    
    watchlist.forEach(item => {
        const price = parseFloat(item.price);
        if (!isNaN(price)) {
            // For simplicity, we'll display in the currency of the first item
            // In a real app, you'd want to convert all to a base currency
            totalValue += price;
            validItems++;
        }
    });
    
    const currency = watchlist.length > 0 ? watchlist[0].currency : 'USD';
    const averagePrice = validItems > 0 ? totalValue / validItems : 0;
    
    summaryItems.textContent = watchlist.length;
    summaryTotal.textContent = `${totalValue.toFixed(2)} ${currency}`;
    summaryAverage.textContent = `${averagePrice.toFixed(2)} ${currency}`;
    
    // Store total for budget calculations
    window.watchlistTotal = { amount: totalValue, currency: currency };
}

function sortWatchlist(sortBy) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    switch (sortBy) {
        case 'name':
            watchlist.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price':
            watchlist.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-desc':
            watchlist.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'date':
            watchlist.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
    }
    
    displayWatchlistItems(watchlist);
}

function removeFromWatchlist(productId) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    watchlist = watchlist.filter(item => item.id !== productId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    
    // Reload the display
    loadWatchlist();
    updateWatchlistCount();
    
    showNotification('Product removed from watchlist!', 'info');
}

function clearWatchlist() {
    localStorage.setItem('watchlist', '[]');
    loadWatchlist();
    updateWatchlistCount();
    
    showNotification('Watchlist cleared!', 'info');
}

function setBudget(amount, currency) {
    const budget = {
        amount: amount,
        currency: currency,
        dateSet: new Date().toISOString()
    };
    
    localStorage.setItem('budget', JSON.stringify(budget));
    
    // Show budget display
    const budgetDisplay = document.getElementById('budgetDisplay');
    budgetDisplay.style.display = 'block';
    
    updateBudgetDisplay();
    showNotification(`Budget set to ${amount} ${currency}!`, 'success');
}

function loadBudget() {
    const savedBudget = localStorage.getItem('budget');
    if (savedBudget) {
        const budget = JSON.parse(savedBudget);
        const budgetInput = document.getElementById('budgetInput');
        const budgetCurrency = document.getElementById('budgetCurrency');
        
        budgetInput.value = budget.amount;
        budgetCurrency.value = budget.currency;
        
        const budgetDisplay = document.getElementById('budgetDisplay');
        budgetDisplay.style.display = 'block';
    }
}

function updateBudgetDisplay() {
    const savedBudget = localStorage.getItem('budget');
    if (!savedBudget) return;
    
    const budget = JSON.parse(savedBudget);
    const budgetAmount = document.getElementById('budgetAmount');
    const totalCost = document.getElementById('totalCost');
    const remainingBudget = document.getElementById('remainingBudget');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const budgetAlert = document.getElementById('budgetAlert');
    
    // Get current watchlist total
    const total = window.watchlistTotal || { amount: 0, currency: budget.currency };
    
    // For simplicity, assume same currency. In real app, convert currencies
    const totalAmount = total.currency === budget.currency ? total.amount : 0;
    const remaining = budget.amount - totalAmount;
    const percentage = Math.min((totalAmount / budget.amount) * 100, 100);
    
    budgetAmount.textContent = `${budget.amount} ${budget.currency}`;
    totalCost.textContent = `${totalAmount.toFixed(2)} ${budget.currency}`;
    remainingBudget.textContent = `${remaining.toFixed(2)} ${budget.currency}`;
    
    // Update progress bar
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage.toFixed(1)}% of budget used`;
    
    // Show alert if over budget
    if (totalAmount > budget.amount) {
        budgetAlert.style.display = 'block';
        remainingBudget.style.color = '#e74c3c';
        remainingBudget.textContent = `${Math.abs(remaining).toFixed(2)} ${budget.currency} over budget!`;
    } else {
        budgetAlert.style.display = 'none';
        remainingBudget.style.color = '#27ae60';
    }
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
