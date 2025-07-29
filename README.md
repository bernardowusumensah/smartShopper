# Smart Shopper - Global Price & Budget Assistant

Smart Shopper is a Node.js-based web application that allows users to search for products online and compare their prices across different currencies. The app helps travelers, freelancers, and international shoppers better understand the cost of items in their local currency and stay within budget.

## Features

- **Product Search**: Search for products from Amazon using the API Ninjas service
- **Currency Conversion**: Convert product prices to your preferred currency using live exchange rates
- **Watchlist**: Save products to track and manage your purchases
- **Budget Tracking**: Set a budget and monitor your spending with visual progress indicators
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Backend**: Node.js, Express.js
- **APIs**: 
  - API Ninjas Amazon Product Search API
  - Frankfurter Exchange Rates API
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: LocalStorage for client-side data persistence

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- API Ninjas account (free tier available)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd smartshopper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get API Key**
   - Sign up for a free account at [API Ninjas](https://api.api-ninjas.com/)
   - Get your API key from the dashboard

4. **Configure Environment Variables**
   - Open the `.env` file in the project root
   - Replace `YOUR_API_NINJAS_KEY_HERE` with your actual API key:
   ```
   API_NINJAS_KEY=your_actual_api_key_here
   ```

5. **Start the Server**
   ```bash
   npm start
   ```

6. **Access the Application**
   - Open your browser and go to `http://localhost:3000`
   - The Smart Shopper application should be running!

## Usage

### Searching for Products

1. On the home page, enter a product name (e.g., "wireless headphones", "laptop")
2. Select your preferred currency from the dropdown
3. Click "Search Products" to see results

### Managing Your Watchlist

1. From the search results, click "Add to Watchlist" on products you're interested in
2. Visit the Watchlist page to view all saved products
3. Sort products by name, price, or date added
4. Remove individual items or clear the entire watchlist

### Budget Tracking

1. Go to the Watchlist page
2. Set your budget by entering an amount and selecting a currency
3. The progress bar will show how much of your budget you've allocated
4. Get alerts when you exceed your budget

## API Information

### API Ninjas - Amazon Product Search
- **Endpoint**: `https://api.api-ninjas.com/v1/amazonsearch`
- **Purpose**: Fetch product details including name, price, image, and product links
- **Rate Limits**: Free tier includes 50,000 requests per month

### Frankfurter Exchange Rates API
- **Endpoint**: `https://api.frankfurter.app/`
- **Purpose**: Get live currency exchange rates for price conversion
- **Rate Limits**: No authentication required, reasonable usage expected

## Project Structure

```
smartshopper/
├── public/
│   ├── index.html          # Home page
│   ├── results.html        # Search results page
│   ├── watchlist.html      # Watchlist and budget page
│   ├── style.css           # Main stylesheet
│   ├── home.js            # Home page functionality
│   ├── results.js         # Search results functionality
│   └── watchlist.js       # Watchlist and budget functionality
├── server.js              # Express server and API routes
├── package.json           # Project dependencies and scripts
├── .env                   # Environment variables (API keys)
└── README.md             # This file
```

## Features Explained

### Currency Conversion
The app automatically converts product prices from USD (Amazon's base currency) to your selected currency using real-time exchange rates from the Frankfurter API.

### Local Storage
Your watchlist and budget preferences are stored locally in your browser, so they persist between sessions without requiring user accounts.

### Responsive Design
The application is fully responsive and works on desktop, tablet, and mobile devices.

## Troubleshooting

### Common Issues

1. **No search results**: 
   - Check your API key in the `.env` file
   - Ensure your API Ninjas account has remaining quota
   - Try different search terms

2. **Currency conversion not working**:
   - The Frankfurter API might be temporarily unavailable
   - Prices will default to USD if conversion fails

3. **Server won't start**:
   - Make sure port 3000 is not in use by another application
   - Check that all dependencies are installed with `npm install`

## Future Enhancements

- User authentication and cloud storage
- Price history tracking
- Email notifications for price drops
- Integration with more e-commerce APIs
- Advanced filtering and search options
- Export watchlist functionality

## License

This project is licensed under the ISC License.

## Support

For issues or questions, please check the troubleshooting section above or review the code comments for implementation details.
