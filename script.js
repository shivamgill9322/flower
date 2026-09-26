document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:8090/api';

    // Toast Notification helper
    function showToast(message) {
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    // Authentication token management
    function getToken() {
        return localStorage.getItem('flower_jwt_token');
    }
    function setToken(token) {
        localStorage.setItem('flower_jwt_token', token);
        updateUserUI();
        syncCartWithBackend();
    }
    function removeToken() {
        localStorage.removeItem('flower_jwt_token');
        updateUserUI();
    }

    function updateUserUI() {
        const userIcon = document.querySelector('header .icons .fa-user');
        if (!userIcon) return;

        if (getToken()) {
            userIcon.style.color = 'var(--pink)';
            userIcon.title = 'Logged in (Click to Logout)';
        } else {
            userIcon.style.color = '';
            userIcon.title = 'Click to Login / Register';
        }
    }

    // ----------------------------------------------------
    // CART STATE & DRAWER MANAGEMENT
    // ----------------------------------------------------
    let cartItems = JSON.parse(localStorage.getItem('flower_cart') || '[]');

    function saveLocalCart() {
        localStorage.setItem('flower_cart', JSON.stringify(cartItems));
        updateCartBadge();
        renderCartDrawer();
    }

    function updateCartBadge() {
        const cartIcon = document.querySelector('header .icons .fa-shopping-cart');
        if (!cartIcon) return;

        let badge = cartIcon.querySelector('.cart-badge');
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        if (totalCount > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                cartIcon.appendChild(badge);
            }
            badge.textContent = totalCount;
        } else if (badge) {
            badge.remove();
        }
    }

    function createCartDrawerUI() {
        if (document.getElementById('cartDrawerOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'cartDrawerOverlay';
        overlay.className = 'cart-drawer-overlay';

        const drawer = document.createElement('div');
        drawer.id = 'cartDrawer';
        drawer.className = 'cart-drawer';

        drawer.innerHTML = `
            <div class="cart-drawer-header">
                <h2>Your <span>Cart</span></h2>
                <span class="close-cart">&times;</span>
            </div>
            <div class="cart-drawer-body" id="cartDrawerBody">
                <!-- Cart items rendered here -->
            </div>
            <div class="cart-drawer-footer">
                <div class="cart-total-row">
                    <span>Total:</span>
                    <span class="amount" id="cartTotalAmount">$0.00</span>
                </div>
                <button class="checkout-btn" id="checkoutBtn">Proceed to Checkout 🌸</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        const closeBtn = drawer.querySelector('.close-cart');
        closeBtn.addEventListener('click', closeCartDrawer);
        overlay.addEventListener('click', closeCartDrawer);

        const checkoutBtn = drawer.querySelector('#checkoutBtn');
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    function openCartDrawer() {
        createCartDrawerUI();
        renderCartDrawer();
        document.getElementById('cartDrawerOverlay')?.classList.add('active');
        document.getElementById('cartDrawer')?.classList.add('active');
    }

    function closeCartDrawer() {
        document.getElementById('cartDrawerOverlay')?.classList.remove('active');
        document.getElementById('cartDrawer')?.classList.remove('active');
    }

    function renderCartDrawer() {
        const body = document.getElementById('cartDrawerBody');
        const totalAmountEl = document.getElementById('cartTotalAmount');
        if (!body) return;

        if (cartItems.length === 0) {
            body.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Your cart is empty!</p>
                    <span style="font-size: 1.4rem; color: #999;">Select flowers to add them here.</span>
                </div>
            `;
            if (totalAmountEl) totalAmountEl.textContent = '$0.00';
            return;
        }

        let total = 0;
        body.innerHTML = cartItems.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                <div class="cart-item-row" data-id="${item.id}">
                    <img src="${item.image || 'image/25.jpg'}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-qty">
                            <button class="cart-qty-btn decrease-qty" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="cart-qty-btn increase-qty" data-index="${index}">+</button>
                        </div>
                    </div>
                    <i class="fas fa-trash-alt cart-item-remove" data-index="${index}" title="Remove item"></i>
                </div>
            `;
        }).join('');

        if (totalAmountEl) totalAmountEl.textContent = `$${total.toFixed(2)}`;

        body.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cartItems[idx].quantity++;
                saveLocalCart();
            });
        });

        body.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                if (cartItems[idx].quantity > 1) {
                    cartItems[idx].quantity--;
                } else {
                    cartItems.splice(idx, 1);
                }
                saveLocalCart();
            });
        });

        body.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                const removedName = cartItems[idx].name;
                cartItems.splice(idx, 1);
                saveLocalCart();
                showToast(`Removed "${removedName}" from cart.`);
            });
        });
    }

    async function handleCheckout() {
        if (cartItems.length === 0) {
            showToast('⚠️ Your cart is empty!');
            return;
        }

        const token = getToken();
        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/order/checkout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ shippingAddress: 'Default Address' })
                });

                if (response.ok) {
                    showToast('🎉 Order placed successfully with Spring Boot Backend!');
                    cartItems = [];
                    saveLocalCart();
                    closeCartDrawer();
                    return;
                }
            } catch (e) {
                console.log('Backend checkout fallback');
            }
        }

        showToast('🌸 Thank you for your order! Your flowers will be delivered soon.');
        cartItems = [];
        saveLocalCart();
        closeCartDrawer();
    }

    async function syncCartWithBackend() {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(`${API_BASE_URL}/cart`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const backendCart = await res.json();
                if (backendCart && backendCart.length > 0) {
                    cartItems = backendCart.map(item => ({
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        image: item.product.image,
                        quantity: item.quantity
                    }));
                    saveLocalCart();
                }
            }
        } catch (err) {
            console.log('Backend cart sync failed, using local cart');
        }
    }

    const cartIcon = document.querySelector('header .icons .fa-shopping-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    }

    // ----------------------------------------------------
    // AUTH MODAL UI
    // ----------------------------------------------------
    function createAuthModal() {
        if (document.getElementById('authModal')) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'authModal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-card">
                <span class="close-btn">&times;</span>
                <h2 id="modalTitle">Login to Flower Shop</h2>
                <form id="authForm">
                    <input type="text" id="authName" placeholder="Full Name" style="display:none;">
                    <input type="email" id="authEmail" placeholder="Email Address" required>
                    <input type="password" id="authPassword" placeholder="Password" required>
                    <button type="submit" class="btn" id="authSubmitBtn">Login</button>
                </form>
                <div class="switch-mode">
                    <span id="switchText">Don't have an account?</span> 
                    <a id="switchBtn">Register</a>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        const closeBtn = modalOverlay.querySelector('.close-btn');
        const authForm = modalOverlay.querySelector('#authForm');
        const switchBtn = modalOverlay.querySelector('#switchBtn');
        const modalTitle = modalOverlay.querySelector('#modalTitle');
        const authName = modalOverlay.querySelector('#authName');
        const authSubmitBtn = modalOverlay.querySelector('#authSubmitBtn');
        const switchText = modalOverlay.querySelector('#switchText');

        let isRegister = false;

        closeBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.remove('active');
        });

        switchBtn.addEventListener('click', () => {
            isRegister = !isRegister;
            if (isRegister) {
                modalTitle.textContent = 'Register for Flower Shop';
                authName.style.display = 'block';
                authName.required = true;
                authSubmitBtn.textContent = 'Register';
                switchText.textContent = 'Already have an account?';
                switchBtn.textContent = 'Login';
            } else {
                modalTitle.textContent = 'Login to Flower Shop';
                authName.style.display = 'none';
                authName.required = false;
                authSubmitBtn.textContent = 'Login';
                switchText.textContent = "Don't have an account?";
                switchBtn.textContent = 'Register';
            }
        });

        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = modalOverlay.querySelector('#authEmail').value;
            const password = modalOverlay.querySelector('#authPassword').value;

            if (isRegister) {
                const name = authName.value;
                try {
                    const res = await fetch(`${API_BASE_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, password })
                    });
                    const data = await res.json();
                    if (res.ok) {
                        showToast(`✅ ${data.message || 'Registration successful! Please login.'}`);
                        switchBtn.click();
                    } else {
                        showToast(`⚠️ ${data.message || 'Registration failed'}`);
                    }
                } catch (err) {
                    showToast('⚠️ Could not connect to backend server');
                }
            } else {
                try {
                    const res = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setToken(data.accessToken);
                        showToast('🌸 Login successful! Welcome back.');
                        modalOverlay.classList.remove('active');
                    } else {
                        showToast('⚠️ Invalid email or password');
                    }
                } catch (err) {
                    showToast('⚠️ Could not connect to backend server');
                }
            }
        });
    }

    const userIcon = document.querySelector('header .icons .fa-user');
    if (userIcon) {
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            if (getToken()) {
                if (confirm('Do you want to logout?')) {
                    removeToken();
                    showToast('Logged out successfully.');
                }
            } else {
                createAuthModal();
                const modalOverlay = document.getElementById('authModal');
                if (modalOverlay) modalOverlay.classList.add('active');
            }
        });
    }

    // ----------------------------------------------------
    // FETCH & RENDER PRODUCTS FROM BACKEND OR STATIC
    // ----------------------------------------------------
    const productsContainer = document.querySelector('#products .box-container');

    async function loadProductsFromBackend() {
        if (!productsContainer) return;

        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (response.ok) {
                const products = await response.json();
                renderProducts(products);
                return;
            }
        } catch (error) {
            console.log('Using static frontend products fallback');
        }
        attachCartAndWishlistListeners();
    }

    function renderProducts(products) {
        if (!products || products.length === 0) return;
        productsContainer.innerHTML = products.map(product => {
            const priceVal = product.price ? Number(product.price).toFixed(2) : '0.00';
            const oldPriceVal = product.oldPrice ? `$${Number(product.oldPrice).toFixed(2)}` : '';
            return `
                <div class="box" data-id="${product.id}">
                    <span class="discount">${product.discount || ''}</span>
                    <div class="image">
                        <img src="${product.image || 'image/25.jpg'}" alt="${product.name}">
                        <div class="icons">
                            <a href="#" class="fas fa-heart wishlist-btn" data-id="${product.id}"></a>
                            <a href="#" class="cart-btn" data-id="${product.id}">add to cart</a>
                            <a href="#" class="fas fa-share share-btn"></a>
                        </div>
                    </div>
                    <div class="content">
                        <h3>${product.name}</h3>
                        <div class="price">$${priceVal} <span>${oldPriceVal}</span></div>
                    </div>
                </div>
            `;
        }).join('');

        attachCartAndWishlistListeners();
    }

    function attachCartAndWishlistListeners() {
        document.querySelectorAll('.cart-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const box = btn.closest('.box');
                const productId = btn.getAttribute('data-id') || Date.now();
                const productName = box.querySelector('h3').textContent.trim();
                const priceText = box.querySelector('.price').childNodes[0].textContent.replace('$', '').trim();
                const priceNum = parseFloat(priceText) || 12.99;
                const imageSrc = box.querySelector('.image img').getAttribute('src');

                const existingIndex = cartItems.findIndex(item => item.name === productName);
                if (existingIndex > -1) {
                    cartItems[existingIndex].quantity++;
                } else {
                    cartItems.push({
                        id: productId,
                        name: productName,
                        price: priceNum,
                        image: imageSrc,
                        quantity: 1
                    });
                }
                saveLocalCart();

                const token = getToken();
                if (token && productId) {
                    try {
                        await fetch(`${API_BASE_URL}/cart/add?productId=${productId}&quantity=1`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                    } catch (err) {
                        console.log('Backend sync fail');
                    }
                }

                showToast(`🌸 "${productName}" added to cart!`);
                openCartDrawer();
            });
        });

        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const productId = btn.getAttribute('data-id');
                const token = getToken();

                if (!token) {
                    showToast('🔑 Please login to save to your wishlist');
                    createAuthModal();
                    document.getElementById('authModal').classList.add('active');
                    return;
                }

                try {
                    const response = await fetch(`${API_BASE_URL}/wishlist/toggle/${productId}`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        showToast(`❤️ ${data.message || 'Wishlist updated!'}`);
                    } else {
                        showToast('❤️ Wishlist updated');
                    }
                } catch (err) {
                    showToast('❤️ Wishlist updated');
                }
            });
        });
    }

    // ----------------------------------------------------
    // REVIEWS MANAGEMENT (CHECK, EDIT & DELETE REVIEWS)
    // ----------------------------------------------------
    const reviewContainer = document.querySelector('#review .box-container');
    let reviewsList = [];

    const defaultReviews = [
        { id: 101, name: 'john deo', email: 'happy customer', message: 'Great service and beautiful flowers. The order process was easy and the delivery was on time.', rating: 5, avatar: 'image/31.jpg' },
        { id: 102, name: 'Lisa', email: 'happy customer', message: 'This flower shop has amazing quality flowers. The delivery was very fast and the flowers were fresh and beautiful. I will definitely order again!', rating: 5, avatar: 'image/32.jpg' },
        { id: 103, name: 'Roy', email: 'happy customer', message: 'I bought flowers for my friend\'s birthday and they looked wonderful. The packaging was nice and the service was great. Highly recommended!', rating: 5, avatar: 'image/33.jpg' }
    ];

    async function loadReviews() {
        const stored = localStorage.getItem('flower_reviews');
        if (stored) {
            reviewsList = JSON.parse(stored);
        } else {
            try {
                const res = await fetch(`${API_BASE_URL}/reviews`);
                if (res.ok) {
                    reviewsList = await res.json();
                } else {
                    reviewsList = [...defaultReviews];
                }
            } catch (err) {
                reviewsList = [...defaultReviews];
            }
            saveReviews();
        }
        renderReviews();
    }

    function saveReviews() {
        localStorage.setItem('flower_reviews', JSON.stringify(reviewsList));
        renderReviews();
    }

    function renderReviews() {
        if (!reviewContainer) return;

        if (reviewsList.length === 0) {
            reviewContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; font-size: 2rem; color: #777;">
                    No reviews yet. Submit a message in Contact Us to write a review!
                </div>
            `;
            return;
        }

        reviewContainer.innerHTML = reviewsList.map((rev, idx) => {
            const starsHTML = Array.from({ length: rev.rating || 5 })
                .map(() => '<i class="fas fa-star"></i>').join('');

            return `
                <div class="box" data-id="${rev.id || idx}">
                    <div class="review-actions">
                        <button class="edit-review-btn" data-index="${idx}" title="Edit Review"><i class="fas fa-pen"></i></button>
                        <button class="delete-review-btn" data-index="${idx}" title="Delete Review"><i class="fas fa-trash-alt"></i></button>
                    </div>
                    <div class="stars">
                        ${starsHTML}
                    </div>
                    <p>${escapeHtml(rev.message)}</p>
                    <div class="user">
                        <img src="${rev.avatar || 'image/31.jpg'}" alt="${escapeHtml(rev.name)}">
                        <div class="user-info">
                            <h3>${escapeHtml(rev.name)}</h3>
                            <span>${escapeHtml(rev.email || 'Customer')}</span>
                        </div>
                    </div>
                    <span class="fas fa-quote-right"></span>
                </div>
            `;
        }).join('');

        attachReviewActionListeners();
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

    function attachReviewActionListeners() {
        // Edit Review Button Listener
        document.querySelectorAll('.edit-review-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const index = parseInt(btn.getAttribute('data-index'));
                openEditReviewModal(index);
            });
        });

        // Delete Review Button Listener
        document.querySelectorAll('.delete-review-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const index = parseInt(btn.getAttribute('data-index'));
                const rev = reviewsList[index];

                if (confirm(`Are you sure you want to delete the review by "${rev.name}"?`)) {
                    if (rev.id) {
                        try {
                            await fetch(`${API_BASE_URL}/reviews/${rev.id}`, { method: 'DELETE' });
                        } catch (err) {
                            console.log('Backend review delete fallback');
                        }
                    }
                    reviewsList.splice(index, 1);
                    saveReviews();
                    showToast('🗑️ Review deleted successfully!');
                }
            });
        });
    }

    // Modal UI for Editing Reviews
    function openEditReviewModal(index) {
        const rev = reviewsList[index];
        if (!rev) return;

        let editModal = document.getElementById('editReviewModal');
        if (!editModal) {
            editModal = document.createElement('div');
            editModal.id = 'editReviewModal';
            editModal.className = 'modal-overlay';
            editModal.innerHTML = `
                <div class="modal-card">
                    <span class="close-btn">&times;</span>
                    <h2>Edit Customer Review ✏️</h2>
                    <form id="editReviewForm">
                        <input type="text" id="editRevName" placeholder="Customer Name" required>
                        <input type="number" id="editRevRating" min="1" max="5" placeholder="Rating Stars (1 to 5)" required>
                        <textarea id="editRevMessage" rows="5" placeholder="Review Text" style="padding: 1.2rem; font-size: 1.6rem; border: .1rem solid #ccc; border-radius: .5rem;" required></textarea>
                        <button type="submit" class="btn">Save Changes</button>
                    </form>
                </div>
            `;
            document.body.appendChild(editModal);

            const closeBtn = editModal.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => editModal.classList.remove('active'));
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) editModal.classList.remove('active');
            });
        }

        const nameInput = editModal.querySelector('#editRevName');
        const ratingInput = editModal.querySelector('#editRevRating');
        const messageInput = editModal.querySelector('#editRevMessage');
        const form = editModal.querySelector('#editReviewForm');

        nameInput.value = rev.name;
        ratingInput.value = rev.rating || 5;
        messageInput.value = rev.message;

        editModal.classList.add('active');

        form.onsubmit = async (e) => {
            e.preventDefault();
            rev.name = nameInput.value.trim();
            rev.rating = parseInt(ratingInput.value) || 5;
            rev.message = messageInput.value.trim();

            if (rev.id) {
                try {
                    await fetch(`${API_BASE_URL}/reviews/${rev.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(rev)
                    });
                } catch (err) {
                    console.log('Backend review edit fallback');
                }
            }

            saveReviews();
            editModal.classList.remove('active');
            showToast('✏️ Review updated successfully!');
        };
    }

    // Initialize UI, Cart Drawer, Reviews and load products
    createCartDrawerUI();
    updateUserUI();
    updateCartBadge();
    loadReviews();
    loadProductsFromBackend();
    syncCartWithBackend();

    // ----------------------------------------------------
    // CONTACT FORM SUBMISSION & EMAIL DISPATCH FEATURE
    // ----------------------------------------------------
    const contactForm = document.querySelector('#contact form');
    const sendGmailBtn = document.querySelector('#sendGmailBtn');

    function getContactFormData() {
        const nameInput = document.querySelector('#contactName') || contactForm?.querySelectorAll('.box')[0];
        const emailInput = document.querySelector('#contactEmail') || contactForm?.querySelectorAll('.box')[1];
        const recipientInput = document.querySelector('#contactRecipientEmail');
        const numberInput = document.querySelector('#contactNumber') || contactForm?.querySelectorAll('.box')[2];
        const messageInput = document.querySelector('#contactMessage') || contactForm?.querySelectorAll('.box')[3];

        return {
            name: nameInput ? nameInput.value.trim() : '',
            email: emailInput ? emailInput.value.trim() : '',
            recipientEmail: recipientInput ? recipientInput.value.trim() : 'shivamgill9322@gmail.com',
            number: numberInput ? numberInput.value.trim() : '',
            message: messageInput ? messageInput.value.trim() : ''
        };
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = getContactFormData();

            if (!data.name || !data.email || !data.message) {
                showToast('⚠️ Please fill out required fields (Name, Your Email, Message).');
                return;
            }

            const targetRecipient = data.recipientEmail || 'shivamgill9322@gmail.com';

            // 1. Send Contact Message to Spring Boot Backend API
            try {
                const res = await fetch(`${API_BASE_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    const resData = await res.json();
                    showToast(`📧 ${resData.message || 'Email sent to ' + targetRecipient}`);
                } else {
                    showToast(`📧 Email queued for ${targetRecipient}!`);
                }
            } catch (err) {
                showToast(`📧 Email message dispatched to ${targetRecipient}!`);
            }

            // 2. Add as dynamic Review in Customer Review section & send to backend API
            const sampleAvatars = ['image/31.jpg', 'image/32.jpg', 'image/33.jpg'];
            const randomAvatar = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
            const newReview = {
                name: data.name,
                email: data.email,
                message: data.message,
                rating: 5,
                avatar: randomAvatar,
                timestamp: Date.now()
            };

            try {
                const res = await fetch(`${API_BASE_URL}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newReview)
                });
                if (res.ok) {
                    const createdRev = await res.json();
                    reviewsList.unshift(createdRev);
                } else {
                    reviewsList.unshift(newReview);
                }
            } catch (err) {
                reviewsList.unshift(newReview);
            }

            saveReviews();
            contactForm.reset();

            // 3. Smooth scroll to Customer Review section
            const reviewSection = document.querySelector('#review');
            if (reviewSection) {
                reviewSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Direct Gmail Web Composer Button Listener
    if (sendGmailBtn) {
        sendGmailBtn.addEventListener('click', () => {
            const data = getContactFormData();
            if (!data.recipientEmail || !data.message) {
                showToast('⚠️ Please enter a Recipient Email and Message first.');
                return;
            }

            const subject = encodeURIComponent(`Flower Shop Message from ${data.name || 'Customer'}`);
            const bodyText = encodeURIComponent(`Hello,\n\n${data.message}\n\nSender Name: ${data.name}\nSender Email: ${data.email}\nPhone Number: ${data.number}\n\nSent from Flower Shop Web Application`);

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(data.recipientEmail)}&su=${subject}&body=${bodyText}`;
            window.open(gmailUrl, '_blank');

            showToast(`✉️ Opened Gmail composer to send email to ${data.recipientEmail}!`);
        });
    }
});
