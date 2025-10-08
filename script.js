// Global variables
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const homepage = document.getElementById('homepage');
const cartModal = document.getElementById('cart-modal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    if (currentUser) {
        showHomepage();
    } else {
        showRegisterForm();
    }
    
    setupEventListeners();
    updateCartCount();
});

// Event listeners
function setupEventListeners() {
    // Form switching
    document.getElementById('show-login').addEventListener('click', showLoginForm);
    document.getElementById('show-register').addEventListener('click', showRegisterForm);
    
    // Form submissions
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Cart modal
    document.getElementById('cart-count').addEventListener('click', showCart);
    document.querySelector('.close').addEventListener('click', hideCart);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            hideCart();
        }
    });
}

// Registration handler
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        alert('User with this email already exists!');
        return;
    }


    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
     'event': 'user_registration',  // Custom event for registration
     'name': name,
     'email': email,
     'phone': phone
   });

    
    // Create new user
    const newUser = { name, email, phone, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! Please login.');
    showLoginForm();
}

// Login handler
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    window.dataLayer = window.dataLayer || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        
    window.dataLayer.push({
     'event': 'user_login',  // Custom event for registration
     'email': email
   });
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showHomepage();
    } else {
        alert('Invalid email or password!');
    }
}

// Logout handler
function handleLogout() {

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
     'event': 'logout',  // Custom event for registration
     'email': email
   });
    currentUser = null;
    cart = [];
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    updateCartCount();
    showRegisterForm();
}

// Add to cart handler
function addToCart(e) {
    const productName = e.target.getAttribute('data-product');
    const productPrice = parseFloat(e.target.getAttribute('data-price'));
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Visual feedback
    e.target.textContent = 'Added!';
    e.target.style.backgroundColor = '#2ecc71';
    
    setTimeout(() => {
        e.target.textContent = 'Add to Cart';
        e.target.style.backgroundColor = '#27ae60';
    }, 1000);
}

// Show/hide functions
function showRegisterForm() {
    registerForm.style.display = 'flex';
    loginForm.style.display = 'none';
    homepage.style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
}

function showLoginForm() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
    homepage.style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
}

function showHomepage() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'none';
    homepage.style.display = 'block';
    document.getElementById('logout-btn').style.display = 'block';
    
    // Update welcome message
    document.getElementById('welcome-message').textContent = 
        `Welcome, ${currentUser.name}!`;
}

// Cart functions
function showCart() {
    cartModal.style.display = 'block';
    displayCartItems();
}

function hideCart() {
    cartModal.style.display = 'none';
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = `Cart (${totalItems})`;
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    $${item.price} x ${item.quantity}
                </div>
                <div>
                    <strong>$${itemTotal.toFixed(2)}</strong>
                    <button onclick="removeFromCart(${index})" style="margin-left: 10px; background-color: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Clear forms
function clearForms() {
    document.getElementById('registerForm').reset();
    document.getElementById('loginForm').reset();
}