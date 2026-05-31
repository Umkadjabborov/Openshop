# OpenShop - E-Commerce Platform

Modern e-commerce web application built with React and Node.js/Express.

## 📁 Project Structure

```
Openshop/
├── src/                      # Node.js Backend
│   ├── index.js             # Express server
│   ├── db.js                # PostgreSQL connection
│   └── routes/
│       └── products.js      # Products API endpoints
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── api.js           # API service
│   │   ├── index.css        # Styling
│   │   └── App.jsx          # Main app with routing
│   └── vite.config.js       # Vite configuration
├── .env                      # Environment variables
├── package.json             # Root scripts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v22+ 
- npm v10+
- PostgreSQL database (Neon)

### Installation

1. **Root dependencies** (already installed):
```bash
npm install
npm install -D concurrently
```

2. **Frontend dependencies** (already installed):
```bash
cd frontend
npm install
```

### Configuration

Create `.env` file in root directory:
```
DATABASE_URL=postgresql://neondb_owner:npg_kKtW2HFqxRm0@ep-curly-morning-aq7b07jm-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=4000
```

## 🏃 Running the Application

### Option 1: Run Frontend Only (Dev Mode)
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Option 2: Run Backend Only
```bash
npm run dev
# or
npm start
```
Backend runs on: `http://localhost:4000`

### Option 3: Run Both (Full Stack)
```bash
npm run fullstack
```
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

## 📦 Database Schema

The application uses 25+ tables including:
- **Products** - Main product catalog
- **Product Images** - Product photos
- **Categories** - Product categories
- **Cart Items** - Shopping cart
- **Orders** - Customer orders
- **Users** - Customer accounts

## 🔌 API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (with images)
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

All endpoints return JSON responses.

## 🎨 Features

✅ **Product Display**
- Grid layout with responsive design
- Product images with main image support
- Price with discount percentage
- Star ratings and review count
- Stock quantity display

✅ **Shopping Cart**
- Add/remove items
- Quantity adjustment
- Total price calculation
- LocalStorage persistence

✅ **Product Details**
- Full product information
- Multiple product images
- Specifications
- Warranty information
- Add to cart & wishlist

✅ **Navigation**
- Home page with featured products
- Product search functionality
- Category browsing
- Wishlist management

✅ **Design**
- Modern UI with CSS styling
- Responsive mobile/tablet/desktop
- Red accent color scheme
- Dark header/footer
- Smooth animations

## 🛠 Tech Stack

**Backend:**
- Express.js
- PostgreSQL (Neon)
- Node.js

**Frontend:**
- React 19
- Vite (build tool)
- React Router v7 (navigation)
- CSS3

## 📝 Available Scripts

**Root (`Openshop/`)**:
- `npm run dev` - Run backend in dev mode
- `npm start` - Run backend in production
- `npm run frontend` - Run frontend dev server
- `npm run fullstack` - Run both simultaneously

**Frontend (`Openshop/frontend/`)**:
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔄 Data Flow

1. Frontend makes requests to backend API
2. Backend queries PostgreSQL database
3. Backend returns JSON responses
4. Frontend renders data with React components
5. User interactions update state & localStorage

## 💾 LocalStorage

The app stores:
- `cart` - Shopping cart items
- `wishlist` - Favorited products

## 📱 Responsive Breakpoints

- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: 768px - 1024px
- Large: > 1024px

## 🐛 Troubleshooting

**Backend fails to connect to database:**
- Verify `.env` DATABASE_URL
- Ensure Neon database is active
- Check network connectivity

**Frontend can't reach API:**
- Ensure backend is running on port 4000
- Check CORS settings in backend
- Verify API endpoint in `src/api.js`

**Port conflicts:**
- Backend: Change PORT in `.env`
- Frontend: Run `npm run dev -- --port 5174`

## 📄 License

ISC
