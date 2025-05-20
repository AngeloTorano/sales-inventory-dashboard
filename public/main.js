document.addEventListener('DOMContentLoaded', function() {
    // Set current date for "Last Updated"
    updateLastUpdated();
    
    // Fetch all dashboard data
    fetchDashboardData();
});

function updateLastUpdated() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('lastUpdated').textContent = now.toLocaleDateString('en-US', options);
}

async function fetchDashboardData() {
    try {
        // Fetch summary data
        const summaryResponse = await fetch('/api/dashboard/summary');
        if (!summaryResponse.ok) throw new Error('Failed to fetch summary data');
        const summaryData = await summaryResponse.json();
        
        // Update summary cards
        document.getElementById('totalRevenue').textContent = `$${summaryData.totalRevenue.toLocaleString()}`;
        document.getElementById('totalOrders').textContent = summaryData.totalOrders.toLocaleString();
        document.getElementById('totalProducts').textContent = summaryData.totalProducts.toLocaleString();
        document.getElementById('lowStockCount').textContent = summaryData.lowStockCount.toLocaleString();
        
        // Fetch and initialize all charts
        await Promise.all([
            fetchAndInitializeChart('/api/sales/monthly', 'initializeMonthlySalesChart'),
            fetchAndInitializeChart('/api/sales/by-category', 'initializeCategoryPieChart'),
            fetchAndInitializeChart('/api/products/top-selling', 'initializeTopProductsChart'),
            fetchAndInitializeChart('/api/sales/by-region', 'initializeRegionSalesChart'),
            fetchAndInitializeChart('/api/sales/growth', 'initializeSalesGrowthChart'),
            fetchAndInitializeChart('/api/inventory/status', 'initializeInventoryStatusChart'),
            fetchAndInitializeChart('/api/inventory/stock-level', 'initializeStockLevelChart'),
            fetchAndInitializeChart('/api/performance/metrics', 'initializePerformanceRadarChart')
        ]);
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Show error to user
        alert('Failed to load dashboard data. Please try again later.');
    }
}

async function fetchAndInitializeChart(endpoint, chartInitializer) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Failed to fetch data from ${endpoint}`);
        const data = await response.json();
        
        // Initialize the chart if the function exists
        if (window[chartInitializer] && typeof window[chartInitializer] === 'function') {
            window[chartInitializer](data);
        }
    } catch (error) {
        console.error(`Error with ${endpoint}:`, error);
        // Show error state for the specific chart
        showChartError(endpoint.split('/').pop());
    }
}

function showChartError(chartId) {
    const container = document.getElementById(chartId).parentElement;
    const errorElement = document.createElement('div');
    errorElement.className = 'text-red-500 text-center p-4';
    errorElement.textContent = 'Failed to load chart data';
    container.appendChild(errorElement);
    
    // Hide the loading spinner
    const spinner = container.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}