const express = require("express")
const router = express.Router()
const db = require("../db")

// Dashboard summary endpoint
router.get("/dashboard/summary", async (req, res, next) => {
  try {
    // Get total revenue
    const revenueSql = "SELECT SUM(total_amount) as totalRevenue FROM sales"
    const revenueResult = await db.getOne(revenueSql)

    // Get total orders
    const ordersSql = "SELECT COUNT(DISTINCT order_id) as totalOrders FROM sales"
    const ordersResult = await db.getOne(ordersSql)

    // Get total products
    const productsSql = "SELECT COUNT(*) as totalProducts FROM products"
    const productsResult = await db.getOne(productsSql)

    // Get low stock count
    const lowStockSql = "SELECT COUNT(*) as lowStockCount FROM products WHERE stock_quantity <= reorder_level"
    const lowStockResult = await db.getOne(lowStockSql)

    res.json({
      totalRevenue: revenueResult.totalRevenue || 0,
      totalOrders: ordersResult.totalOrders || 0,
      totalProducts: productsResult.totalProducts || 0,
      lowStockCount: lowStockResult.lowStockCount || 0,
    })
  } catch (error) {
    next(error)
  }
})

// Monthly sales data endpoint
router.get("/sales/monthly", async (req, res, next) => {
  try {
    const sql = `
            SELECT 
                DATE_FORMAT(sale_date, '%Y-%m') as month,
                SUM(total_amount) as revenue,
                COUNT(DISTINCT order_id) as orders
            FROM sales
            WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY month
            ORDER BY month
        `

    const results = await db.getAll(sql)

    const labels = results.map((row) => {
      const [year, month] = row.month.split("-")
      return new Date(year, month - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    })

    const revenue = results.map((row) => row.revenue)
    const orders = results.map((row) => row.orders)

    res.json({
      labels,
      revenue,
      orders,
    })
  } catch (error) {
    next(error)
  }
})

// Sales by category endpoint
router.get("/sales/by-category", async (req, res, next) => {
  try {
    const sql = `
            SELECT 
                p.category,
                SUM(s.total_amount) as revenue
            FROM sales s
            JOIN products p ON s.product_id = p.id
            GROUP BY p.category
            ORDER BY revenue DESC
        `

    const results = await db.getAll(sql)

    const labels = results.map((row) => row.category)
    const values = results.map((row) => row.revenue)

    res.json({
      labels,
      values,
    })
  } catch (error) {
    next(error)
  }
})

// Top selling products endpoint
router.get("/products/top-selling", async (req, res, next) => {
  try {
    const sql = `
            SELECT 
                p.name,
                SUM(s.quantity) as units_sold,
                SUM(s.total_amount) as revenue
            FROM sales s
            JOIN products p ON s.product_id = p.id
            GROUP BY p.id
            ORDER BY units_sold DESC
            LIMIT 10
        `

    const results = await db.getAll(sql)

    const labels = results.map((row) => row.name)
    const unitsSold = results.map((row) => row.units_sold)
    const revenue = results.map((row) => row.revenue)

    res.json({
      labels,
      unitsSold,
      revenue,
    })
  } catch (error) {
    next(error)
  }
})

// Sales by region endpoint
router.get("/sales/by-region", async (req, res, next) => {
  try {
    const sql = `
            SELECT 
                region,
                SUM(total_amount) as revenue
            FROM sales
            GROUP BY region
            ORDER BY revenue DESC
        `

    const results = await db.getAll(sql)

    const labels = results.map((row) => row.region)
    const revenue = results.map((row) => row.revenue)

    res.json({
      labels,
      revenue,
    })
  } catch (error) {
    next(error)
  }
})

// Sales growth endpoint
router.get("/sales/growth", async (req, res, next) => {
  try {
    const sql = `
            SELECT 
                DATE_FORMAT(sale_date, '%Y-%m') as month,
                SUM(total_amount) as revenue
            FROM sales
            WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 24 MONTH)
            GROUP BY month
            ORDER BY month
        `

    const results = await db.getAll(sql)

    // Calculate year-over-year growth
    const monthlyData = {}
    results.forEach((row) => {
      monthlyData[row.month] = row.revenue
    })

    const growthData = []
    const months = Object.keys(monthlyData).sort()

    for (let i = 12; i < months.length; i++) {
      const currentMonth = months[i]
      const previousYearMonth = months[i - 12]

      const currentRevenue = monthlyData[currentMonth]
      const previousRevenue = monthlyData[previousYearMonth]

      const growthPercentage = ((currentRevenue - previousRevenue) / previousRevenue) * 100

      const [year, month] = currentMonth.split("-")
      const label = new Date(year, month - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" })

      growthData.push({
        month: currentMonth,
        label,
        growthPercentage,
      })
    }

    res.json({
      labels: growthData.map((item) => item.label),
      growthPercentages: growthData.map((item) => item.growthPercentage),
    })
  } catch (error) {
    next(error)
  }
})

// Inventory status endpoint
router.get("/inventory/status", async (req, res, next) => {
  try {
    const sql = `
            SELECT 
                CASE
                    WHEN stock_quantity > reorder_level THEN 'Good Stock'
                    WHEN stock_quantity > 0 AND stock_quantity <= reorder_level THEN 'Low Stock'
                    ELSE 'Out of Stock'
                END as status,
                COUNT(*) as count
            FROM products
            GROUP BY status
        `

    const results = await db.getAll(sql)

    const labels = results.map((row) => row.status)
    const values = results.map((row) => row.count)

    res.json({
      labels,
      values,
    })
  } catch (error) {
    next(error)
  }
})

// Stock level by category endpoint
router.get("/inventory/stock-level", async (req, res, next) => {
  try {
    const sql = `
            SELECT 
                category,
                SUM(stock_quantity) as current_stock,
                SUM(reorder_level) as reorder_level
            FROM products
            GROUP BY category
            ORDER BY category
        `

    const results = await db.getAll(sql)

    const labels = results.map((row) => row.category)
    const currentStock = results.map((row) => row.current_stock)
    const reorderLevel = results.map((row) => row.reorder_level)

    res.json({
      labels,
      currentStock,
      reorderLevel,
    })
  } catch (error) {
    next(error)
  }
})

// Performance metrics endpoint
router.get("/performance/metrics", async (req, res, next) => {
  try {
    // This would typically come from a more complex query or calculation
    // For demo purposes, we're returning sample data
    const performanceMetrics = {
      labels: [
        "Sales Growth",
        "Profit Margin",
        "Inventory Turnover",
        "Customer Satisfaction",
        "Order Fulfillment",
        "Return Rate",
      ],
      currentPeriod: [85, 70, 65, 90, 80, 75],
      previousPeriod: [70, 65, 60, 80, 70, 80],
    }

    res.json(performanceMetrics)
  } catch (error) {
    next(error)
  }
})

module.exports = router
