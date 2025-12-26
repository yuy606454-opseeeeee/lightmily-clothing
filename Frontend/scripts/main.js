// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');
const productsGrid = document.getElementById('products-grid');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.querySelector('.checkout-btn');

// Cart state
let cart = JSON.parse(localStorage.getItem('lightmilyCart')) || [];

// Sample products data (in real app, this would come from backend)
const products = [
    { id: 1, name: "Classic Tee", price: 29.99, category: "Tops", image: "fas fa-tshirt" },
    { id: 2, name: "Premium Hoodie", price: 59.99, category: "Outerwear", image: "fas fa-vest" },
    { id: 3, name: "Designer Jeans", price: 79.99, category: "Bottoms", image: "fas fa-user" },
    { id: 4, name: "Summer Dress", price: 49.99, category: "Dresses", image: "fas fa-female" },
    { id: 5, name: "Sports Cap", price: 24.99, category: "Accessories", image: "fas fa-hat-cowboy" },
    { id: 6, name: "Comfy Sweatpants", price: 39.99, category: "Bottoms", image: "fas fa-socks" }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Setup mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Setup cart modal
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            cartModal.style.display = 'flex';
            renderCartItems();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Load products
    renderProducts();
    
    // Update cart count
    updateCartCount();
    
    // Setup contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Setup checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});

// Render products to the page
function renderProducts() {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <i class="${product.image}"></i>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add product to cart
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    // Save to localStorage
    localStorage.setItem('lightmilyCart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    
    // Show feedback
    showNotification(`${product.name} added to cart!`);
}

// Update cart count in navbar
function updateCartCount() {
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Render cart items in modal
function renderCartItems() {
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div>
                <p class="item-total">$${itemTotal.toFixed(2)}</p>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    // Save to localStorage
    localStorage.setItem('lightmilyCart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    renderCartItems();
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // In a real app, you would send this to your backend
    console.log('Contact form submitted:', {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    });
    
    // Show success message
    showNotification('Message sent successfully! We\'ll get back to you soon.');
    
    // Reset form
    form.reset();
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // In a real app, you would redirect to a checkout page
    showNotification('Proceeding to checkout...');
    
    // For demo, just clear the cart
    cart = [];
    localStorage.setItem('lightmilyCart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    
    // Close modal after a delay
    setTimeout(() => {
        cartModal.style.display = 'none';
    }, 1500);
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
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

// Add CSS for notification animations
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