# ShopWave — React E-Commerce Store

ShopWave is a modern e-commerce storefront built with React, React Router, TanStack Query, Axios, and Tailwind CSS. It provides a smooth shopping experience with product browsing, filtering, cart management, checkout, and order history.

## Overview

This project simulates a complete online shopping flow for a retail web app. Users can:

- browse products from a live fake store API
- search and filter products by category
- view detailed product information
- add products to a cart and update quantities
- place orders and view order confirmation
- review previous orders from the order history page

## Tech Stack

- React 19
- React Router v7
- TanStack Query v5
- Axios
- Tailwind CSS v4
- React Hot Toast
- Vite

## Features

- Product listing page with search, category filtering, and pagination
- Product detail view with image and product information
- Persistent cart experience using localStorage
- Checkout form and order placement flow
- Order confirmation and order history pages
- Responsive UI for desktop and mobile screens

## Project Structure

```text
Ecommerce/
├── public/                  # Static assets
├── src/
│   ├── api/                 # API layer, Axios client, and storage helpers
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── cartStorage.js
│   │   ├── client.js
│   │   ├── orders.js
│   │   ├── ordersStorage.js
│   │   └── products.js
│   ├── assets/              # Images and other static files
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── FilterSidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── Spinner.jsx
│   │   └── icons.jsx
│   ├── context/             # Global app context
│   │   └── AuthContext.jsx
│   ├── features/            # Feature-based hooks and logic
│   │   ├── cart/
│   │   ├── orders/
│   │   └── products/
│   ├── pages/               # Route-level pages
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrderConfirmationPage.jsx
│   │   ├── OrderHistoryPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ProductsPage.jsx
│   │   └── SignInPage.jsx
│   ├── utils/               # Helper functions
│   │   └── currency.js
│   ├── App.jsx              # Main app and route configuration
│   ├── index.css            # Global styles
│   └── main.jsx             # Application entry point
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### State Management

- Server data such as products and categories is fetched and cached with TanStack Query.
- Cart and order data are stored in localStorage so they remain available after refresh.
- Short-lived UI state such as search input, page number, and form values is handled locally in component state.

### API Layer

- The app uses a centralized Axios client in [src/api/client.js](src/api/client.js).
- API calls are organized in the [src/api](src/api) folder for products, cart, orders, and authentication-related flows.

## API Notes

The app uses the Platzi Fake Store API for product and category data.API does not provide cart or order endpoints, cart and order data are managed on the client side using localStorage.