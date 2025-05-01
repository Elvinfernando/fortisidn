// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
const shoppingCart = document.querySelector(".shopping-cart");
const cartContainer = document.querySelector(".shopping-cart");

// Create notification element
const notification = document.createElement('div');
notification.className = 'notification';
document.body.appendChild(notification);

// Add notification styles
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 1rem 2rem;
    border-radius: 4px;
    font-size: 1rem;
    z-index: 10000;
    opacity: 0;
    transform: translateY(100%);
    transition: all 0.3s ease;
  }
  .notification.show {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// Show notification function
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Initialize cart
cartContainer.innerHTML = `
  <button class="close-btn" aria-label="Close cart">
    <i data-feather="x"></i>
  </button>
  <div class="cart-items"></div>
  <div class="cart-total">Total: Rp 0</div>
  <div class="customer-form">
    <h3>Customer Detail</h3>
    <div class="form-group">
      <input type="text" id="cart-name" placeholder="Name" required>
    </div>
    <div class="form-group">
      <input type="email" id="cart-email" placeholder="Email" required>
    </div>
    <div class="form-group">
      <input type="tel" id="cart-phone" placeholder="Phone" required>
    </div>
    <button class="checkout-btn">Checkout</button>
  </div>
`;

// Initialize Feather Icons for the close button
feather.replace();

// Close cart when clicking the close button
document.querySelector(".shopping-cart .close-btn").onclick = (e) => {
  shoppingCart.classList.remove("active");
  e.preventDefault();
};

const cartItemsContainer = cartContainer.querySelector('.cart-items');
const totalDisplay = cartContainer.querySelector('.cart-total');
let cartItems = {};
let totalPrice = 0;

// Toggle functions
document.querySelector("#menu-toggle").onclick = () => {
  navbarNav.classList.toggle("active");
};

document.querySelector("#search-button").onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

document.querySelector("#shopping-cart-button").onclick = (e) => {
  shoppingCart.classList.toggle("active");
  e.preventDefault();
};

// Update cart display
function updateCart() {
  cartItemsContainer.innerHTML = '';
  totalPrice = 0;

  Object.values(cartItems).forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="item-detail">
        <h3>${item.name}</h3>
        <div class="item-price">Rp ${item.price.toLocaleString()}</div>
        <div class="quantity-controls">
          <button class="quantity-btn minus" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <i data-feather="trash-2" class="remove-item" data-id="${item.id}"></i>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  totalDisplay.innerHTML = `Total: Rp ${totalPrice.toLocaleString()}`;
  feather.replace();
}

// Add to cart
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const id = this.getAttribute('data-id');
    const name = this.getAttribute('data-name');
    const price = parseInt(this.getAttribute('data-price'));
    const img = this.getAttribute('data-img');

    if (cartItems[id]) {
      cartItems[id].quantity++;
      showNotification(`${name} ditambahkan ke keranjang (${cartItems[id].quantity}x)`);
    } else {
      cartItems[id] = { id, name, price, img, quantity: 1 };
      showNotification(`${name} ditambahkan ke keranjang`);
    }

    updateCart();
    shoppingCart.classList.add('active');
  });
});

// Cart controls
cartContainer.addEventListener('click', function(e) {
  const target = e.target;
  
  if (target.classList.contains('remove-item')) {
    const id = target.getAttribute('data-id');
    const name = cartItems[id].name;
    delete cartItems[id];
    updateCart();
    showNotification(`${name} dihapus dari keranjang`);
  }

  if (target.classList.contains('quantity-btn')) {
    const id = target.getAttribute('data-id');
    const name = cartItems[id].name;
    
    if (target.classList.contains('plus')) {
      cartItems[id].quantity++;
      showNotification(`${name} ditambahkan (${cartItems[id].quantity}x)`);
    } else if (target.classList.contains('minus')) {
      cartItems[id].quantity--;
      if (cartItems[id].quantity <= 0) {
        delete cartItems[id];
        showNotification(`${name} dihapus dari keranjang`);
      } else {
        showNotification(`${name} dikurangi (${cartItems[id].quantity}x)`);
      }
    }
    updateCart();
  }
});

// Checkout
document.querySelector('.checkout-btn').addEventListener('click', function() {
  const name = document.getElementById('cart-name').value.trim();
  const email = document.getElementById('cart-email').value.trim();
  const phone = document.getElementById('cart-phone').value.trim();

  if (!name || !email || !phone) {
    showNotification('Mohon lengkapi semua data customer');
    return;
  }

  if (Object.keys(cartItems).length === 0) {
    showNotification('Keranjang belanja masih kosong');
    return;
  }

  let message = `*New Order*\n\n`;
  message += `*Customer Details*\n`;
  message += `Name: ${name}\n`;
  message += `Email: ${email}\n`;
  message += `Phone: ${phone}\n\n`;
  message += `*Order Details*\n`;
  
  Object.values(cartItems).forEach(item => {
    message += `${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString()}\n`;
  });
  
  message += `\n*Total: Rp ${totalPrice.toLocaleString()}*`;

  window.open(`https://wa.me/6285886833128?text=${encodeURIComponent(message)}`, '_blank');

  cartItems = {};
  updateCart();
  shoppingCart.classList.remove('active');
  
  document.getElementById('cart-name').value = '';
  document.getElementById('cart-email').value = '';
  document.getElementById('cart-phone').value = '';
  
  showNotification('Pesanan berhasil dikirim via WhatsApp');
});

// Contact form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[placeholder="Nama"]').value.trim();
    const email = this.querySelector('input[placeholder="Email"]').value.trim();
    const phone = this.querySelector('input[placeholder="No hp"]').value.trim();

    if (!name || !email || !phone) {
      showNotification('Mohon lengkapi semua informasi');
      return;
    }

    const message = `Halo, saya ${name}. Saya tertarik dengan produk Fortis. Email saya: ${email}, No.Hp: ${phone}. Mohon informasi lebih lanjut.`;
    window.open(`https://wa.me/6285886833128?text=${encodeURIComponent(message)}`, '_blank');
    showNotification('Pesan berhasil dikirim via WhatsApp');
  });
}

// Click outside elements
document.addEventListener("click", function (e) {
  const menu = document.querySelector("#menu-toggle");
  const sb = document.querySelector("#search-button");
  const sc = document.querySelector("#shopping-cart-button");

  if (!menu.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});

// Prevent cart from closing when clicking inside
shoppingCart.addEventListener('click', function(e) {
  e.stopPropagation();
});

// Initialize Feather Icons
feather.replace();
