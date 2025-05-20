// Chart initialization functions
document.addEventListener('DOMContentLoaded', function() {
    // All charts will be initialized when their data is loaded
});

// Monthly Sales Chart (Line Chart)
window.initializeMonthlySalesChart = function(data) {
    const ctx = document.getElementById('monthlySalesChart');
    hideLoadingSpinner('monthlySalesChart');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Monthly Revenue',
                data: data.revenue,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: getChartOptions('$')
    });
};

// Category Pie Chart
window.initializeCategoryPieChart = function(data) {
    const ctx = document.getElementById('categoryPieChart');
    hideLoadingSpinner('categoryPieChart');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
};

// Top Products Chart (Bar Chart)
window.initializeTopProductsChart = function(data) {
    const ctx = document.getElementById('topProductsChart');
    hideLoadingSpinner('topProductsChart');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Units Sold',
                data: data.unitsSold,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: getChartOptions()
    });
};

// Region Sales Chart
window.initializeRegionSalesChart = function(data) {
    const ctx = document.getElementById('regionSalesChart');
    hideLoadingSpinner('regionSalesChart');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Revenue by Region',
                data: data.revenue,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: getChartOptions('$')
    });
};

// Sales Growth Chart
window.initializeSalesGrowthChart = function(data) {
    const ctx = document.getElementById('salesGrowthChart');
    hideLoadingSpinner('salesGrowthChart');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Sales Growth (%)',
                data: data.growthPercentages,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: getChartOptions('%')
    });
};

// Inventory Status Chart
window.initializeInventoryStatusChart = function(data) {
    const ctx = document.getElementById('inventoryStatusChart');
    hideLoadingSpinner('inventoryStatusChart');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)', // Good stock
                    'rgba(255, 206, 86, 0.7)', // Low stock
                    'rgba(255, 99, 132, 0.7)'  // Out of stock
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} products (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
};

// Stock Level Chart
window.initializeStockLevelChart = function(data) {
    const ctx = document.getElementById('stockLevelChart');
    hideLoadingSpinner('stockLevelChart');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Current Stock',
                    data: data.currentStock,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Reorder Level',
                    data: data.reorderLevel,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: getChartOptions()
    });
};

// Performance Radar Chart
window.initializePerformanceRadarChart = function(data) {
    const ctx = document.getElementById('performanceRadarChart');
    hideLoadingSpinner('performanceRadarChart');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Current Period',
                    data: data.currentPeriod,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                },
                {
                    label: 'Previous Period',
                    data: data.previousPeriod,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
};

// Helper functions
function getChartOptions(prefix = '') {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ${prefix}${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `${prefix}${value.toLocaleString()}`
                }
            }
        }
    };
}

function hideLoadingSpinner(chartId) {
    const container = document.getElementById(chartId).parentElement;
    const spinner = container.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}