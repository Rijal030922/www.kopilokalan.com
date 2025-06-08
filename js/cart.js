// Cart functionality
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    updateCartCount();
    
    // Checkout button functionality
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartItems.length > 0) {
                window.location.href = 'checkout.html';
            }
        });
    }
});

function addToCart(product) {
    // Check if product already exists in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: product.id || Date.now(),
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function updateQuantity(productId, newQuantity) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items-container');
    const emptyCart = document.getElementById('empty-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartContainer) return;
    
    if (cartItems.length === 0) {
        cartContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        cartContainer.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = false;
        
        cartContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">${formatPrice(item.price)}</p>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn minus" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn plus" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="item-total">
                    ${formatPrice(item.price * item.quantity)}
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
            </div>
        `).join('');
    }
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 15000 : 0;
    const total = subtotal + shipping;
    
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (shippingElement) shippingElement.textContent = formatPrice(shipping);
    if (totalElement) totalElement.textContent = formatPrice(total);
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

// Enhanced add to cart for product cards
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const product = {
                id: Date.now() + Math.random(),
                name: productCard.querySelector('h3').textContent,
                price: extractPrice(productCard.querySelector('.price').textContent),
                image: productCard.querySelector('img').src
            };
            
            addToCart(product);
            
            // Visual feedback
            e.target.textContent = 'Added!';
            e.target.style.backgroundColor = '#D4AF37';
            
            setTimeout(() => {
                e.target.textContent = 'Add to Cart';
                e.target.style.backgroundColor = '#8B8000';
            }, 1500);
            
            showNotification(`${product.name} ditambahkan ke keranjang!`);
        }
    }
});

function extractPrice(priceText) {
    // Extract numeric value from price text like "Mulai dari Rp 50.000"
    const match = priceText.match(/[\d.,]+/);
    if (match) {
        return parseInt(match[0].replace(/[.,]/g, ''));
    }
    return 50000; // Default price
}

// Cart icon click to go to cart page
document.addEventListener('click', function(e) {
    if (e.target.closest('.nav-cart')) {
        window.location.href = 'cart.html';
    }
});

