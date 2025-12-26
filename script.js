

document.addEventListener('DOMContentLoaded', function() {
    console.log('PhoneShop 2025 կայքը լիովին բեռնված է ✅');
    
    // Զամբյուղի օբյեկտ
    let cart = {
        items: [],
        total: 0,
        count: 0
    };
    
    // DOM էլեմենտներ
    const cartButton = document.getElementById('cartButton');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    const cartCountElement = document.getElementById('cartCount');
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const clearCartButton = document.querySelector('.btn-clear-cart');
    const checkoutButton = document.querySelector('.btn-checkout');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const preorderButton = document.querySelector('.btn-preorder');
    const contactForm = document.getElementById('contactForm2025');
    const loginButton = document.querySelector('.login-btn');
    const productSelect = document.getElementById('product2025');
    
    // Տվյալների բեռնում localStorage-ից
    loadCartFromStorage();
    updateStockDisplay();
    
    // Զամբյուղի բացում/փակում
    cartButton.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartModal);
    
    // Զամբյուղի արտաքին սեղմումը փակելու համար
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCartModal();
        }
    });
    
    // Ապրանքների ավելացում զամբյուղում
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            addToCart(productCard);
        });
    });
    
    // Ֆիլտրի կոճակներ
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Active կլասի թարմացում
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Ապրանքների ֆիլտրում
            filterProducts(filter);
        });
    });
    
    // Ապրանքների արագ դիտում
    document.querySelectorAll('.btn-quick-view').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            showQuickView(productCard);
        });
    });
    
    // Նախապատվերի կոճակ
    if (preorderButton) {
        preorderButton.addEventListener('click', function() {
            const modalHTML = `
                <div class="quick-view-modal">
                    <div class="quick-view-content">
                        <h3>📦 Նախապատվեր - Samsung Galaxy S25 Ultra</h3>
                        <p>Նախապատվերը հաջողությամբ ձևակերպված է։</p>
                        <p>Մենք կկապնվենք ձեզ հետ պաշտոնական թողարկումից 1 շաբաթ առաջ։</p>
                        <div class="modal-actions">
                            <button class="btn-confirm">Հաստատել</button>
                            <button class="btn-cancel">Փակել</button>
                        </div>
                    </div>
                </div>
            `;
            
            showModal(modalHTML, 'Նախապատվերի հաստատում');
        });
    }
    
    // Զամբյուղի դատարկում
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }
    
    // Առաքման ձևակերպում
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }
    
    // Կոնտակտային ձևի մշակում
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Սիմուլյացիա՝ ուղարկում սերվեր
            console.log('2025 Կոնտակտային ձևի տվյալներ:', data);
            
            showNotification('✅ Ձեր հաղորդագրությունը ուղարկված է 2025 թիմին', 'success');
            
            // Ձևի մաքրում
            this.reset();
        });
    }
    
    // Լոգինի կոճակ
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            showLoginModal();
        });
    }
    
    // Ֆունկցիաներ
    
    function addToCart(productCard) {
        const productId = productCard.getAttribute('data-id');
        const productName = productCard.getAttribute('data-name');
        const productPrice = parseFloat(productCard.getAttribute('data-price'));
        const productImage = productCard.getAttribute('data-image');
        const stockCountElement = productCard.querySelector('.stock-count');
        
        // Ստուգել առկայությունը պահեստում
        if (stockCountElement) {
            const stockCount = parseInt(stockCountElement.textContent);
            if (stockCount <= 0) {
                showNotification('⚠️ Ապրանքը չկա պահեստում', 'error');
                return;
            }
        }
        
        // Ստուգում՝ արդյոք ապրանքն արդեն կա զամբյուղում
        const existingItem = cart.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        // Զամբյուղի թարմացում
        updateCart();
        
        // Պահեստի թարմացում
        updateStock(productCard, -1);
        
        // Նորությունների ցուցադրում
        showNotification(`🛒 ${productName} ավելացվել է զամբյուղում`, 'success');
        
        // Կոճակի անիմացիա
        const addButton = productCard.querySelector('.btn-add-to-cart');
        const originalText = addButton.textContent;
        const originalBg = addButton.style.background;
        
        addButton.textContent = '✅ Ավելացված';
        addButton.style.background = 'linear-gradient(45deg, #27ae60, #219653)';
        addButton.disabled = true;
        
        setTimeout(() => {
            addButton.textContent = originalText;
            addButton.style.background = originalBg;
            addButton.disabled = false;
        }, 2000);
    }
    
    function updateCart() {
        // Ընդհանուր գումարի հաշվարկ
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // DOM թարմացում
        cartCountElement.textContent = cart.count;
        cartTotalElement.textContent = `$${cart.total.toFixed(2)}`;
        
        // Զամբյուղի ապրանքների ցուցադրում
        renderCartItems();
        
        // Պահպանել localStorage-ում
        saveCartToStorage();
        
        // Զամբյուղի կոճակի անիմացիա
        if (cart.count > 0) {
            cartButton.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                cartButton.style.animation = '';
            }, 500);
        }
    }
    
    function renderCartItems() {
        cartItemsElement.innerHTML = '';
        
        if (cart.items.length === 0) {
            cartItemsElement.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Զամբյուղը դատարկ է</p>
                    <p class="empty-cart-hint">Ավելացրեք ապրանքներ ձեր զամբյուղում</p>
                </div>
            `;
            return;
        }
        
        cart.items.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.style.animationDelay = `${index * 0.1}s`;
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsElement.appendChild(cartItemElement);
        });
        
        // Քանակի փոփոխման կոճակներ
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                updateQuantity(productId, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                updateQuantity(productId, 1);
            });
        });
        
        // Հեռացման կոճակներ
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
    }
    
    function updateQuantity(productId, change) {
        const item = cart.items.find(item => item.id === productId);
        
        if (item) {
            // Գտնել համապատասխան ապրանքը DOM-ում
            const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
            
            if (productCard && change > 0) {
                // Ստուգել առկայությունը պահեստում
                const stockCountElement = productCard.querySelector('.stock-count');
                if (stockCountElement) {
                    const stockCount = parseInt(stockCountElement.textContent);
                    if (stockCount <= 0) {
                        showNotification('⚠️ Ապրանքը չկա պահեստում', 'error');
                        return;
                    }
                    updateStock(productCard, -1);
                }
            }
            
            if (productCard && change < 0) {
                // Վերադարձնել պահեստ
                updateStock(productCard, 1);
            }
            
            item.quantity += change;
            
            if (item.quantity <= 0) {
                cart.items = cart.items.filter(item => item.id !== productId);
            }
            
            updateCart();
        }
    }
    
    function removeFromCart(productId) {
        const item = cart.items.find(item => item.id === productId);
        if (item) {
            // Վերադարձնել բոլոր ապրանքները պահեստ
            const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
            if (productCard) {
                updateStock(productCard, item.quantity);
            }
            
            cart.items = cart.items.filter(item => item.id !== productId);
            updateCart();
            showNotification('🗑️ Ապրանքը հեռացված է զամբյուղից', 'warning');
        }
    }
    
    function clearCart() {
        if (cart.items.length === 0) {
            showNotification('ℹ️ Զամբյուղն արդեն դատարկ է', 'info');
            return;
        }
        
        const modalHTML = `
            <div class="confirmation-modal">
                <h3>🧹 Դատարկել Զամբյուղը</h3>
                <p>Դուք համոզվա՞ծ եք, որ ցանկանում եք հեռացնել բոլոր ապրանքները զամբյուղից:</p>
                <p class="cart-summary-text">Ընդհանուր: $${cart.total.toFixed(2)} (${cart.count} ապրանք)</p>
                <div class="modal-actions">
                    <button class="btn-confirm">Այո, դատարկել</button>
                    <button class="btn-cancel">Չեղարկել</button>
                </div>
            </div>
        `;
        
        showModal(modalHTML, 'Դատարկել Զամբյուղը', function(confirmed) {
            if (confirmed) {
                // Վերադարձնել բոլոր ապրանքները պահեստ
                cart.items.forEach(item => {
                    const productCard = document.querySelector(`.product-card[data-id="${item.id}"]`);
                    if (productCard) {
                        updateStock(productCard, item.quantity);
                    }
                });
                
                cart.items = [];
                updateCart();
                showNotification('✅ Զամբյուղը դատարկված է', 'success');
            }
        });
    }
    
    function checkout() {
        if (cart.items.length === 0) {
            showNotification('⚠️ Զամբյուղը դատարկ է', 'error');
            return;
        }
        
        // Ստեղծել պատվերի տվյալներ
        const orderDetails = {
            items: [...cart.items],
            total: cart.total,
            date: new Date().toLocaleString('hy-AM'),
            orderId: 'ORD-' + Date.now().toString().slice(-8),
            status: 'pending'
        };
        
        console.log('Պատվերի տվյալներ:', orderDetails);
        
        // Ցուցադրել պատվերի ձև
        showOrderForm(orderDetails);
    }
    
    function showOrderForm(orderDetails) {
        const formHTML = `
            <div class="order-form">
                <h3>🚚 Առաքման Ձևակերպում</h3>
                <div class="order-summary">
                    <p><strong>Պատվերի համար:</strong> ${orderDetails.orderId}</p>
                    <p><strong>Ընդհանուր գումար:</strong> $${orderDetails.total.toFixed(2)}</p>
                    <p><strong>Ապրանքների քանակ:</strong> ${orderDetails.items.length}</p>
                </div>
                <div class="form-group">
                    <input type="text" id="orderName" placeholder="Անուն Ազգանուն" required>
                </div>
                <div class="form-group">
                    <input type="email" id="orderEmail" placeholder="Էլ. փոստ" required>
                </div>
                <div class="form-group">
                    <input type="tel" id="orderPhone" placeholder="Հեռախոսահամար (+374)" required>
                </div>
                <div class="form-group">
                    <textarea id="orderAddress" placeholder="Առաքման հասցե" rows="3" required></textarea>
                </div>
                <div class="form-group checkbox-group">
                    <label>
                        <input type="checkbox" id="orderAgreement" required>
                        Համաձայն եմ պայմաններին
                    </label>
                </div>
                <div class="modal-actions">
                    <button class="btn-confirm">✅ Հաստատել Պատվերը</button>
                    <button class="btn-cancel">❌ Չեղարկել</button>
                </div>
            </div>
        `;
        
        showModal(formHTML, 'Պատվերի ձևակերպում', function(confirmed, formData) {
            if (confirmed) {
                // Պատվերի ստեղծում
                const completeOrder = {
                    ...orderDetails,
                    customer: formData,
                    orderDate: new Date().toISOString()
                };
                
                // Պահպանել պատվերը
                saveOrder(completeOrder);
                
                // Զամբյուղի դատարկում
                cart.items = [];
                updateCart();
                
                // Հաջողության հաղորդագրություն
                showNotification(`✅ Պատվերը (#${completeOrder.orderId}) հաջողությամբ ընդունված է`, 'success');
                
                // Պատվերի մանրամասների ցուցադրում
                setTimeout(() => {
                    alert(`Շնորհակալություն ${formData.name}!\n\nՁեր պատվերը հաջողությամբ ընդունված է։\n\n📋 Պատվերի համար: ${completeOrder.orderId}\n💰 Ընդհանուր գումար: $${completeOrder.total.toFixed(2)}\n📦 Առաքում: ${formData.address}\n📞 Կապ: ${formData.phone}\n\nՄենք կկապնվենք ձեզ հետ մոտակա ժամերին։`);
                }, 1000);
            }
        });
    }
    
    function saveOrder(order) {
        // Սիմուլյացիա՝ պատվերի պահպանում
        const orders = JSON.parse(localStorage.getItem('phoneShopOrders') || '[]');
        orders.push(order);
        localStorage.setItem('phoneShopOrders', JSON.stringify(orders));
        
        console.log('Պատվերը պահպանված է:', order);
    }
    
    function openCart() {
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
    }
    
    function closeCartModal() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
    }
    
    function filterProducts(filter) {
        productCards.forEach(card => {
            card.style.display = 'none';
            card.style.animation = 'none';
            
            setTimeout(() => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                }
            }, 50);
        });
    }
    
    function showQuickView(productCard) {
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        const productDescription = productCard.querySelector('.product-description').textContent;
        const productImage = productCard.querySelector('img').src;
        const productSpecs = productCard.querySelector('.product-specs').innerHTML;
        
        const modalHTML = `
            <div class="quick-view-modal">
                <div class="quick-view-image">
                    <img src="${productImage}" alt="${productName}">
                </div>
                <div class="quick-view-details">
                    <h3>${productName}</h3>
                    <div class="quick-view-specs">
                        ${productSpecs}
                    </div>
                    <p class="quick-view-description">${productDescription}</p>
                    <div class="quick-view-price">${productPrice}</div>
                    <button class="btn-add-to-cart-quick">🛒 Ավելացնել Զամբյուղում</button>
                </div>
            </div>
        `;
        
        showModal(modalHTML, 'Արագ Դիտում', function(confirmed) {
            if (confirmed) {
                addToCart(productCard);
            }
        });
    }
    
    function showModal(content, title = '', callback = null) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // CSS ավելացում
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideUp 0.4s ease;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            }
            
            .modal-header {
                background: linear-gradient(135deg, #2c3e50, #1a2a3a);
                color: white;
                padding: 20px;
                border-radius: 20px 20px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 1.5rem;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                line-height: 1;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: rotate(90deg);
            }
            
            .modal-body {
                padding: 30px;
            }
            
            .modal-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .btn-confirm, .btn-cancel {
                flex: 1;
                padding: 15px;
                border: none;
                border-radius: 10px;
                font-weight: bold;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-confirm {
                background: linear-gradient(45deg, #2ecc71, #27ae60);
                color: white;
            }
            
            .btn-confirm:hover {
                background: linear-gradient(45deg, #27ae60, #219653);
                transform: translateY(-2px);
            }
            
            .btn-cancel {
                background: linear-gradient(45deg, #e74c3c, #c0392b);
                color: white;
            }
            
            .btn-cancel:hover {
                background: linear-gradient(45deg, #c0392b, #a93226);
                transform: translateY(-2px);
            }
            
            .quick-view-modal {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            @media (min-width: 768px) {
                .quick-view-modal {
                    flex-direction: row;
                }
            }
            
            .quick-view-image {
                flex: 1;
            }
            
            .quick-view-image img {
                width: 100%;
                border-radius: 10px;
            }
            
            .quick-view-details {
                flex: 1;
            }
            
            .btn-add-to-cart-quick {
                width: 100%;
                padding: 15px;
                background: linear-gradient(45deg, #2ecc71, #27ae60);
                color: white;
                border: none;
                border-radius: 10px;
                font-weight: bold;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 20px;
            }
            
            .btn-add-to-cart-quick:hover {
                background: linear-gradient(45deg, #27ae60, #219653);
                transform: translateY(-2px);
            }
            
            .confirmation-modal {
                text-align: center;
            }
            
            .cart-summary-text {
                font-size: 1.2rem;
                font-weight: bold;
                color: #e74c3c;
                margin: 15px 0;
            }
        `;
        document.head.appendChild(modalStyles);
        
        // Modal-ի փակում
        modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
            document.head.removeChild(modalStyles);
        });
        
        // Արտաքին սեղմում
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
                document.head.removeChild(modalStyles);
            }
        });
        
        // Callback կոճակների մշակում
        const confirmButtons = modalContent.querySelectorAll('.btn-confirm, .btn-add-to-cart-quick');
        const cancelButtons = modalContent.querySelectorAll('.btn-cancel');
        
        confirmButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (callback) {
                    // Հավաքել ձևի տվյալները
                    const formData = {
                        name: modalContent.querySelector('#orderName')?.value || '',
                        email: modalContent.querySelector('#orderEmail')?.value || '',
                        phone: modalContent.querySelector('#orderPhone')?.value || '',
                        address: modalContent.querySelector('#orderAddress')?.value || ''
                    };
                    
                    callback(true, formData);
                }
                document.body.removeChild(modalOverlay);
                document.head.removeChild(modalStyles);
            });
        });
        
        cancelButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (callback) callback(false);
                document.body.removeChild(modalOverlay);
                document.head.removeChild(modalStyles);
            });
        });
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        // CSS ավելացում
        const notificationStyles = document.createElement('style');
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 25px;
                right: 25px;
                background: white;
                padding: 20px 25px;
                border-radius: 15px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 1001;
                animation: slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                max-width: 400px;
                border-left: 5px solid #3498db;
            }
            
            .notification-success {
                border-left-color: #2ecc71;
            }
            
            .notification-error {
                border-left-color: #e74c3c;
            }
            
            .notification-warning {
                border-left-color: #f39c12;
            }
            
            .notification-info {
                border-left-color: #3498db;
            }
            
            .notification-icon {
                font-size: 1.5rem;
            }
            
            .notification-message {
                flex: 1;
                font-weight: 500;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #95a5a6;
                transition: color 0.3s ease;
            }
            
            .notification-close:hover {
                color: #e74c3c;
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            notificationStyles.id = 'notification-styles';
            document.head.appendChild(notificationStyles);
        }
        
        document.body.appendChild(notification);
        
        // Փակման կոճակ
        notification.querySelector('.notification-close').addEventListener('click', () => {
            closeNotification(notification);
        });
        
        // Ավտոմատ փակում
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
        
        function closeNotification(notif) {
            notif.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (notif.parentNode) {
                    document.body.removeChild(notif);
                }
            }, 500);
        }
    }
    
    function saveCartToStorage() {
        localStorage.setItem('phoneShopCart', JSON.stringify(cart));
    }
    
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('phoneShopCart');
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
                updateCart();
            } catch (e) {
                console.error('Error loading cart from storage:', e);
                cart = { items: [], total: 0, count: 0 };
            }
        }
    }
    
    function updateStock(productCard, change) {
        const stockCountElement = productCard.querySelector('.stock-count');
        if (stockCountElement) {
            let stockCount = parseInt(stockCountElement.textContent);
            stockCount += change;
            
            if (stockCount < 0) stockCount = 0;
            
            stockCountElement.textContent = stockCount;
            
            // Ստուգել եթե ապրանքը վերջացել է
            if (stockCount === 0) {
                const addButton = productCard.querySelector('.btn-add-to-cart');
                addButton.textContent = 'ՎԵՐՋԱՑԵԼ Է';
                addButton.style.background = 'linear-gradient(45deg, #95a5a6, #7f8c8d)';
                addButton.disabled = true;
                
                const stockText = productCard.querySelector('.product-stock');
                if (stockText) {
                    stockText.innerHTML = '<span style="color: #e74c3c;">⚠️ Վերջացել է պահեստում</span>';
                }
            } else if (stockCount <= 3) {
                const stockText = productCard.querySelector('.product-stock');
                if (stockText) {
                    stockText.innerHTML = `Վերջին ${stockCount} հատ`;
                }
            }
        }
    }
    
    function updateStockDisplay() {
        productCards.forEach(card => {
            const stockCountElement = card.querySelector('.stock-count');
            if (stockCountElement) {
                let stockCount = parseInt(stockCountElement.textContent);
                
                if (stockCount === 0) {
                    const addButton = card.querySelector('.btn-add-to-cart');
                    addButton.textContent = 'ՎԵՐՋԱՑԵԼ Է';
                    addButton.style.background = 'linear-gradient(45deg, #95a5a6, #7f8c8d)';
                    addButton.disabled = true;
                    
                    const stockText = card.querySelector('.product-stock');
                    if (stockText) {
                        stockText.innerHTML = '<span style="color: #e74c3c;">⚠️ Վերջացել է պահեստում</span>';
                    }
                }
            }
        });
    }
    
    function showLoginModal() {
        const modalHTML = `
            <div class="login-form">
                <h3>🔐 Մուտք Գործել</h3>
                <div class="form-group">
                    <input type="email" id="loginEmail" placeholder="Էլ. փոստ" required>
                </div>
                <div class="form-group">
                    <input type="password" id="loginPassword" placeholder="Գաղտնաբառ" required>
                </div>
                <div class="form-options">
                    <label>
                        <input type="checkbox" id="rememberMe">
                        Հիշել ինձ
                    </label>
                    <a href="#" class="forgot-password">Մոռացել եք գաղտնաբառը?</a>
                </div>
                <div class="modal-actions">
                    <button class="btn-confirm">Մուտք</button>
                    <button class="btn-cancel">Գրանցվել</button>
                </div>
                <div class="login-social">
                    <p>Կամ մուտք գործեք միջոցով</p>
                    <div class="social-buttons">
                        <button class="btn-facebook">Facebook</button>
                        <button class="btn-google">Google</button>
                    </div>
                </div>
            </div>
        `;
        
        showModal(modalHTML, 'Մուտք', function(confirmed) {
            if (confirmed) {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                if (email && password) {
                    showNotification('✅ Մուտքը հաջողությամբ կատարված է', 'success');
                    loginButton.innerHTML = '<i class="fas fa-user-check"></i> 2025 Հաշիվ';
                    console.log('Օգտատեր մուտք գործեց:', email);
                }
            }
        });
    }
    
    // Հարթ սկրոլինգ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Վիդեո և աուդիո կառավարում
    document.querySelectorAll('video').forEach(video => {
        video.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });
        
        // Ավտոմատ կանգ
        video.addEventListener('ended', function() {
            this.currentTime = 0;
        });
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter');
    if (newsletterForm) {
        const newsletterInput = newsletterForm.querySelector('input');
        const newsletterButton = newsletterForm.querySelector('.btn-newsletter');
        
        newsletterButton.addEventListener('click', function() {
            const email = newsletterInput.value;
            if (email && email.includes('@')) {
                showNotification('✅ Բաժանորդագրվել եք 2025 նորություններին', 'success');
                newsletterInput.value = '';
            } else {
                showNotification('⚠️ Մուտքագրեք վավեր էլ. փոստ', 'error');
            }
        });
    }
    
    // Տարեթիվ ցուցադրում
    const yearElement = document.querySelector('.footer-year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = `${currentYear} - Տեխնոլոգիաների Նոր Էրա`;
    }
    
    console.log(`📱 PhoneShop 2025 պատրաստ է: Զամբյուղում ${cart.count} ապրանք $${cart.total.toFixed(2)}`);
    
    // Add some fun animations
    setTimeout(() => {
        document.querySelector('.hero-badge').style.animation = 'pulse 2s infinite';
    }, 1000);
});