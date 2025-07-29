// home.js - Home page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update watchlist count in navigation
    updateWatchlistCount();

    // Handle search form submission
    const searchForm = document.getElementById('searchForm');
    const productInput = document.getElementById('productInput');
    const currencySelect = document.getElementById('currencySelect');
    const searchBtn = searchForm.querySelector('.search-btn');
    const btnText = searchBtn.querySelector('.btn-text');
    const btnLoading = searchBtn.querySelector('.btn-loading');

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const query = productInput.value.trim();
        const currency = currencySelect.value;
        
        if (!query) {
            alert('Please enter a product to search for');
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        searchBtn.disabled = true;

        // Store search params and redirect to results page
        const searchParams = new URLSearchParams({
            query: query,
            currency: currency
        });
        
        window.location.href = `/results?${searchParams.toString()}`;
    });

    // Load user's preferred currency from localStorage
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency) {
        currencySelect.value = savedCurrency;
    }

    // Save currency preference when changed
    currencySelect.addEventListener('change', function() {
        localStorage.setItem('preferredCurrency', this.value);
    });
});

function updateWatchlistCount() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const countElement = document.getElementById('watchlist-count');
    if (countElement) {
        countElement.textContent = `(${watchlist.length})`;
    }
}
