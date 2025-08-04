# Smart Shopper - GitHub Pages Setup

Smart Shopper is now configured for GitHub Pages deployment! This repository contains both a Node.js/Express version (for local development) and a static GitHub Pages version.

## 🌐 Live Demo

Visit the live application: [https://yourusername.github.io/smartshopper](https://yourusername.github.io/smartshopper)

## 📁 Project Structure

```
smartshopper/
├── index.html          # GitHub Pages main file
├── app.js             # Client-side JavaScript
├── styles.css         # Main stylesheet
├── public/            # Assets and additional files
│   ├── images/        # Product category icons
│   ├── style.css      # Alternative stylesheet
│   └── ...
├── server.js          # Node.js server (for local development)
├── package.json       # Node.js dependencies
└── README.md         # This file
```

## 🚀 GitHub Pages Deployment

### Option 1: Automatic Deployment (Recommended)

1. **Fork/Clone this repository** to your GitHub account
2. **Go to your repository settings** on GitHub
3. **Navigate to Pages** section in the left sidebar
4. **Set Source** to "Deploy from a branch"
5. **Select Branch** as "main" or "master"
6. **Select Folder** as "/ (root)"
7. **Click Save**

Your site will be available at: `https://yourusername.github.io/repositoryname`

### Option 2: Manual Setup

If you're setting up a new repository:

1. **Create a new GitHub repository** named `smartshopper` (or any name you prefer)
2. **Clone the repository** locally:
   ```bash
   git clone https://github.com/yourusername/smartshopper.git
   cd smartshopper
   ```
3. **Copy these files** to your repository:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `public/` folder (entire directory)
4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add Smart Shopper GitHub Pages version"
   git push origin main
   ```
5. **Enable GitHub Pages** in repository settings (as described in Option 1)

## 🎯 Features (GitHub Pages Version)

- ✅ **Product Search** - Search with demo product data
- ✅ **Currency Conversion** - Convert prices using simulated exchange rates
- ✅ **Watchlist Management** - Save and track favorite products
- ✅ **Budget Tracking** - Set budgets and monitor spending
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Client-side Routing** - Smooth navigation between pages
- ✅ **Local Storage** - Persistent data storage in browser

## 🛠️ Local Development

### For GitHub Pages Version (Static Files)
Simply open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using Live Server (VS Code extension)
# Right-click index.html > "Open with Live Server"
```

### For Node.js Version (Full Stack)
```bash
# Install dependencies
npm install

# Start the server
npm start

# Development mode
npm run dev
```

## 📊 Demo Data

The GitHub Pages version uses sample data for demonstration:

- **Products**: Laptops, headphones, phones, cameras
- **Exchange Rates**: Simulated currency conversion rates
- **Reviews**: Sample ratings and review counts

## 🔧 Customization

### Adding New Products
Edit the `SAMPLE_PRODUCTS` object in `app.js`:

```javascript
const SAMPLE_PRODUCTS = {
  'category': [
    {
      id: 1,
      name: 'Product Name',
      price: 299,
      currency: 'USD',
      image: './public/images/icon.svg',
      description: 'Product description',
      rating: 4.5,
      reviews: 100
    }
  ]
};
```

### Updating Exchange Rates
Modify the `EXCHANGE_RATES` object in `app.js`:

```javascript
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.75,
  // Add more currencies...
};
```

### Styling Changes
Edit `styles.css` to customize the appearance:

- Colors: Update CSS custom properties
- Layout: Modify grid and flexbox properties
- Animations: Adjust transition and animation properties

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🔗 Links

- **Live Demo**: https://yourusername.github.io/smartshopper
- **Repository**: https://github.com/yourusername/smartshopper
- **Issues**: https://github.com/yourusername/smartshopper/issues

## 💡 Tips for GitHub Pages

1. **Custom Domain**: You can use a custom domain by adding a `CNAME` file
2. **HTTPS**: GitHub Pages provides free HTTPS
3. **Build Time**: Changes may take a few minutes to appear
4. **File Limits**: Keep individual files under 100MB
5. **Bandwidth**: 100GB per month soft limit

---

## 🚀 Quick Start Commands

```bash
# Clone the repository
git clone https://github.com/yourusername/smartshopper.git

# Navigate to directory
cd smartshopper

# Open in browser (or use any local server)
open index.html
```

That's it! Your Smart Shopper app is ready for GitHub Pages! 🎉
