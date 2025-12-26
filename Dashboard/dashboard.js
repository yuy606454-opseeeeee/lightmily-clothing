// Dashboard JavaScript for Lightmily Club
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    loadDashboardData();
    loadOrders();
    
    // Setup event listeners
    setupEventListeners();
});

// Load dashboard statistics
async function loadDashboardData() {
    try {
        // In a real app, you would fetch from your API
        // For now, we'll use mock data
        
        // Mock data for demo
        const stats = {
            totalOrders: 42,
            totalRevenue: 2567.89,
            totalProducts: 6,
            totalCustomers: 38
        };
        
        // Update the UI
        document.getElementById('total-orders').textContent = stats.totalOrders;
        document.getElementById('total-revenue').textContent = `$${stats.totalRevenue.toFixed(2)}`;
        document.getElementById('total-products').textContent = stats.totalProducts;
        document.getElementById('total-customers').textContent = stats.totalCustomers;
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

// Load orders from backend API
async function loadOrders() {
    try {
        // Fetch orders from backend API
        const response = await fetch('http://localhost:3000/api/orders');
        const orders = await response.json();
        
        // Update the orders table
        updateOrdersTable(orders);
        
    } catch (error) {
        console.error('Error loading orders:', error);
        
        // For demo, use mock data if API is not available
        const mockOrders = getMockOrders();
        updateOrdersTable(mockOrders);
        
        showNotification('Using demo data - API not connected', 'warning');
    }
}

// Mock orders data for demonstration
function getMockOrders() {
    return [
        { id: 1001, customer: { name: 'John Doe', email: 'john@example.com' }, items: 3, total: 149.97, date: '2023-10-15', status: 'completed' },
        { id: 1002, customer: { name: 'Jane Smith', email: 'jane@example.com' }, items: 1, total: 59.99, date: '2023-10-14', status: 'processing' },
        { id: 1003, customer: { name: 'Bob Wilson', email: 'bob@example.com' }, items: 2, total: 109.98, date: '2023-10-13', status: 'pending' },
        { id: 1004, customer: { name: 'Alice Johnson', email: 'alice@example.com' }, items: 5, total: 199.95, date: '2023-10-12', status: 'completed' },
        { id: 1005, customer: { name: 'Charlie Brown', email: 'charlie@example.com' }, items: 1, total: 24.99, date: '2023-10-11', status: 'shipped' }
    ];
}

// Update orders table with data
function updateOrdersTable(orders) {
    const tbody = document.getElementById('orders-tbody');
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ddd; margin-bottom: 15px; display: block;"></i>
                    <p>No orders yet</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>
                <strong>${order.customer.name}</strong><br>
                <small>${order.customer.email}</small>
            </td>
            <td>${formatDate(order.date)}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <button class="btn-action view-order" data-id="${order.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action edit-order" data-id="${order.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action delete-order" data-id="${order.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.view-order').forEach(btn => {
        btn.addEventListener('click', viewOrderDetails);
    });
    
    document.querySelectorAll('.edit-order').forEach(btn => {
        btn.addEventListener('click', editOrder);
    });
    
    document.querySelectorAll('.delete-order').forEach(btn => {
        btn.addEventListener('click', deleteOrder);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.sidebar-nav a').forEach(l => {
                    l.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Show corresponding section
                const sectionId = this.getAttribute('href').substring(1);
                showSection(sectionId);
            }
        });
    });
    
    // Add Product button
    const addProductBtn = document.querySelector('.add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showAddProductModal);
    }
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

// View order details
function viewOrderDetails(e) {
    const orderId = e.currentTarget.getAttribute('data-id');
    showNotification(`Viewing order #${orderId}`, 'info');
    // In a real app, you would show a modal with order details
}

// Edit order
function editOrder(e) {
    const orderId = e.currentTarget.getAttribute('data-id');
    showNotification(`Editing order #${orderId}`, 'info');
    // In a real app, you would open an edit form
}

// Delete order
function deleteOrder(e) {
    const orderId = e.currentTarget.getAttribute('data-id');
    
    if (confirm(`Are you sure you want to delete order #${orderId}?`)) {
        // In a real app, you would send DELETE request to API
        showNotification(`Order #${orderId} deleted`, 'success');
        
        // Reload orders
        setTimeout(() => {
            loadOrders();
        }, 1000);
    }
}

// Show add product modal
function showAddProductModal() {
    const modal = document.getElementById('add-product-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.dashboard-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `dashboard-notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${getNotificationColor(type)};
        color: white;
        border-radius: 5px;
        z-index: 3000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Get notification color based on type
function getNotificationColor(type) {
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || colors.info;
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);