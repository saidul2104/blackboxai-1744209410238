// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartOpen = false;

// DOM Elements
const cartIcon = document.querySelector('.fa-shopping-cart');
const cartCount = document.querySelector('.fa-shopping-cart + span');
const cartPanel = document.createElement('div');

// Create cart panel
function createCartPanel() {
    cartPanel.id = 'cart-panel';
    cartPanel.className = 'fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 translate-x-full';
    cartPanel.innerHTML = `
        <div class="p-6 h-full flex flex-col">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">Your Cart</h2>
                <button id="close-cart" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div id="cart-items" class="flex-1 overflow-y-auto mb-4">
                <!-- Cart items will be inserted here -->
            </div>
            <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between mb-2">
                    <span class="font-medium">Subtotal:</span>
                    <span id="cart-subtotal" class="font-bold">$0.00</span>
                </div>
                <button id="checkout-btn" class="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Checkout
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(cartPanel);
    
    // Event listeners
    cartIcon.closest('div').addEventListener('click', toggleCart);
    document.getElementById('close-cart').addEventListener('click', toggleCart);
    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('Proceeding to checkout!');
    });
}

// Update cart UI
function updateCart() {
    // Update count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update panel if open
    if (cartOpen) {
        const cartItemsEl = document.getElementById('cart-items');
        const subtotalEl = document.getElementById('cart-subtotal');
        
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
            subtotalEl.textContent = '$0.00';
            return;
        }
        
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="flex items-center py-4 border-b border-gray-100">
                <img src="https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg" 
                     alt="${item.name}" 
                     class="w-16 h-16 object-cover rounded-md mr-4">
                <div class="flex-1">
                    <h3 class="font-medium">${item.name}</h3>
                    <p class="text-gray-600 text-sm">$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="flex flex-col items-end">
                    <span class="font-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button onclick="removeFromCart(${item.id})" class="text-red-500 text-sm mt-1 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
}

// Toggle cart panel
function toggleCart() {
    cartOpen = !cartOpen;
    if (cartOpen) {
        cartPanel.classList.remove('translate-x-full');
        cartPanel.classList.add('translate-x-0');
        updateCart();
    } else {
        cartPanel.classList.remove('translate-x-0');
        cartPanel.classList.add('translate-x-full');
    }
}

// Add item to cart
function addToCart(productId, productName, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center';
    notification.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        <span>Added to cart</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    createCartPanel();
    updateCart();
    
    // Chatbot click handler
    document.querySelector('.fa-comment-dots').closest('div').addEventListener('click', () => {
        alert("Chatbot feature coming soon!");
    });
});
