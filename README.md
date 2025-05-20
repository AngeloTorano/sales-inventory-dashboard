# Sales & Inventory Dashboard

An interactive web-based dashboard that visualizes sales and inventory data using Chart.js for the front-end, powered by a Node.js backend with MySQL as the data source and a RESTful API.

## Overview

This project provides a comprehensive dashboard for monitoring sales performance and inventory status. It features multiple visualizations including line charts, bar charts, pie charts, and radar charts to present data in an intuitive and actionable format.

## Dataset

The project uses a product sales and inventory dataset with two related tables:
- **Products**: Contains information about products including name, category, price, and stock levels
- **Sales**: Contains transaction data including order details, quantities, prices, and regional information

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Installation Steps

1. Extract the zip file:
   \`\`\`
  Extract the downloaded zip file to your choosen directory
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     \`\`\`
     DB_HOST=localhost
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     DB_NAME=sales_dashboard
     PORT=3000
     NODE_ENV=development
     \`\`\`

4. Set up the database:
   \`\`\`
   npm run setup-db
   \`\`\`

5. Start the application:
   \`\`\`
   npm start
   \`\`\`

6. Access the dashboard at `http://localhost:3000`

## Dependencies

- express: ^4.18.2
- mysql2: ^3.2.0
- cors: ^2.8.5
- dotenv: ^16.0.3
- chart.js: ^4.2.1
- tailwindcss: ^2.2.19