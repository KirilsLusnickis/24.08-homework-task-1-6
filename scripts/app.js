const products = [
  {
    id: 'aurora-lamp',
    name: 'Aurora Smart Lamp',
    description:
      'A Wi-Fi enabled lamp with ambient light modes to match your mood.',
    price: 129,
    image:
      'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=600&q=80',
    category: 'Home',
    badges: ['Best seller', 'Smart home']
  },
  {
    id: 'cloud-cushion',
    name: 'Cloud Comfort Cushion',
    description: 'Ergonomic memory foam cushion with breathable cover.',
    price: 89,
    image:
      'https://images.unsplash.com/photo-1542293787938-4d2226c9dc55?auto=format&fit=crop&w=600&q=80',
    category: 'Lifestyle',
    badges: ['New arrival']
  },
  {
    id: 'pulse-headphones',
    name: 'Pulse Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 30-hour battery life.',
    price: 219,
    image:
      'https://images.unsplash.com/photo-1518449031475-8157c56581d3?auto=format&fit=crop&w=600&q=80',
    category: 'Tech',
    badges: ['Top rated']
  },
  {
    id: 'brew-essentials',
    name: 'Brew Essentials Kit',
    description: 'Handcrafted pour-over coffee kit with double-walled mugs.',
    price: 159,
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    category: 'Kitchen',
    badges: ['Limited edition']
  },
  {
    id: 'zen-planter',
    name: 'Zen Ceramic Planter',
    description: 'Self-watering planter with minimalist matte finish.',
    price: 59,
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
    category: 'Home',
    badges: ['Eco friendly']
  },
  {
    id: 'stride-sneakers',
    name: 'Stride Everyday Sneakers',
    description: 'Lightweight sneakers designed for all-day comfort.',
    price: 145,
    image:
      'https://images.unsplash.com/photo-1542293787938-4d2226c9dc55?auto=format&fit=crop&w=600&q=80',
    category: 'Lifestyle',
    badges: ['Free shipping']
  }
];

const productGrid = document.querySelector('#product-grid');
const categorySelect = document.querySelector('#category-select');
const priceRange = document.querySelector('#price-range');
const priceValue = document.querySelector('#price-value');
const searchInput = document.querySelector('#search-input');
const filterForm = document.querySelector('#filter-form');
const yearEl = document.querySelector('#year');
const cart = document.querySelector('#cart');
const overlay = document.querySelector('#overlay');
const cartToggle = document.querySelector('#cart-toggle');
const cartClose = document.querySelector('#cart-close');
const cartItemsEl = document.querySelector('#cart-items');
const cartSubtotalEl = document.querySelector('#cart-subtotal');
const cartCountEl = document.querySelector('#cart-count');

const CART_STORAGE_KEY = 'shopswift-cart';
const PRICE_SLIDER_STEP = 10;

const cartState = {
  items: loadCart()
};

let lastFocusedElement = null;

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Unable to load cart from storage.', error);
    return [];
  }
}

function persistCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState.items));
  } catch (error) {
    console.warn('Unable to save cart to storage.', error);
  }
}

function calculateSliderMaxPrice() {
  if (!products.length) {
    return 0;
  }

  const maxProductPrice = products.reduce(
    (highest, product) => Math.max(highest, product.price),
    0
  );

  if (maxProductPrice === 0) {
    return 0;
  }

  return Math.max(
    PRICE_SLIDER_STEP,
    Math.ceil(maxProductPrice / PRICE_SLIDER_STEP) * PRICE_SLIDER_STEP
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function renderCategories() {
  if (!categorySelect) {
    return;
  }

  const categories = Array.from(new Set(products.map((product) => product.category)));
  categories.sort();
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  });
}

function renderProducts(list) {
  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = '';

  if (!list.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No products match your filters. Try adjusting the search.';
    productGrid.append(empty);
    return;
  }

  list.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('role', 'listitem');

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'product-card__image';
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    imageWrapper.append(image);

    if (product.badges?.length) {
      const badges = document.createElement('div');
      badges.className = 'badges';
      product.badges.forEach((badgeText) => {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = badgeText;
        badges.append(badge);
      });
      imageWrapper.append(badges);
    }

    const content = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = product.name;
    const description = document.createElement('p');
    description.textContent = product.description;

    const footer = document.createElement('div');
    footer.className = 'product-card__footer';

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = formatCurrency(product.price);

    const addButton = document.createElement('button');
    addButton.className = 'button button--primary';
    addButton.type = 'button';
    addButton.textContent = 'Add to cart';
    addButton.addEventListener('click', () => addToCart(product.id));

    footer.append(price, addButton);
    content.append(title, description, footer);

    card.append(imageWrapper, content);
    productGrid.append(card);
  });
}

function filterProducts() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const category = categorySelect ? categorySelect.value : 'all';

  const maxPrice = priceRange
    ? Number(
        priceRange.value ||
          priceRange.dataset.defaultValue ||
          priceRange.getAttribute('max') ||
          Infinity
      )
    : Infinity;

  const filtered = products.filter((product) => {
    const haystack = `${product.name} ${product.description}`.toLowerCase();
    const matchesQuery = haystack.includes(query);
    const matchesCategory = category === 'all' || product.category === category;
    const matchesPrice = product.price <= maxPrice;
    return matchesQuery && matchesCategory && matchesPrice;
  });

  renderProducts(filtered);
}

function addToCart(productId) {
  const existing = cartState.items.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartState.items.push({ id: productId, quantity: 1 });
  }
  persistCart();
  updateCartUI();
  openCart();
}

function removeFromCart(productId) {
  cartState.items = cartState.items.filter((item) => item.id !== productId);
  persistCart();
  updateCartUI();
}

function changeQuantity(productId, delta) {
  const item = cartState.items.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    persistCart();
    updateCartUI();
  }
}

function updateCartUI() {
  if (!cartItemsEl || !cartSubtotalEl || !cartCountEl) {
    return;
  }

  cartItemsEl.innerHTML = '';

  if (!cartState.items.length) {
    cartItemsEl.innerHTML =
      '<p class="empty">Your cart is empty. Start adding your favourite items!</p>';
    cartSubtotalEl.textContent = formatCurrency(0);
    cartCountEl.textContent = '0';
    return;
  }

  let subtotal = 0;

  cartState.items.forEach((item) => {
    const product = products.find((productItem) => productItem.id === item.id);
    if (!product) return;

    subtotal += product.price * item.quantity;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;

    const info = document.createElement('div');
    info.className = 'cart-item__info';

    const title = document.createElement('h4');
    title.textContent = product.name;

    const price = document.createElement('p');
    price.textContent = formatCurrency(product.price);

    info.append(title, price);

    const controls = document.createElement('div');
    controls.className = 'quantity-control';

    const decreaseButton = document.createElement('button');
    decreaseButton.type = 'button';
    decreaseButton.textContent = '−';
    decreaseButton.setAttribute('aria-label', `Decrease quantity of ${product.name}`);
    decreaseButton.addEventListener('click', () => changeQuantity(product.id, -1));

    const quantity = document.createElement('span');
    quantity.textContent = item.quantity;

    const increaseButton = document.createElement('button');
    increaseButton.type = 'button';
    increaseButton.textContent = '+';
    increaseButton.setAttribute('aria-label', `Increase quantity of ${product.name}`);
    increaseButton.addEventListener('click', () => changeQuantity(product.id, 1));

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'icon-button';
    removeButton.textContent = '×';
    removeButton.setAttribute('aria-label', `Remove ${product.name} from cart`);
    removeButton.addEventListener('click', () => removeFromCart(product.id));

    controls.append(decreaseButton, quantity, increaseButton);

    cartItem.append(image, info, controls, removeButton);
    cartItemsEl.append(cartItem);
  });

  cartSubtotalEl.textContent = formatCurrency(subtotal);
  cartCountEl.textContent = String(totalItems());
}

function totalItems() {
  return cartState.items.reduce((sum, item) => sum + item.quantity, 0);
}

function openCart() {
  if (!cart) {
    return;
  }

  if (document.activeElement instanceof HTMLElement) {
    lastFocusedElement = document.activeElement;
  } else {
    lastFocusedElement = null;
  }

  cart.dataset.open = 'true';
  cart.setAttribute('aria-hidden', 'false');

  if (overlay) {
    overlay.hidden = false;
    overlay.dataset.visible = 'true';
  }

  if (cartToggle) {
    cartToggle.setAttribute('aria-expanded', 'true');
  }

  window.requestAnimationFrame(() => {
    cart.focus();
  });
}

function closeCart() {
  if (!cart) {
    return;
  }

  cart.dataset.open = 'false';
  cart.setAttribute('aria-hidden', 'true');

  if (overlay) {
    overlay.dataset.visible = 'false';
  }

  if (cartToggle) {
    cartToggle.setAttribute('aria-expanded', 'false');
  }

  setTimeout(() => {
    if (overlay) {
      overlay.hidden = true;
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }, 300);
}

function toggleCart() {
  if (!cart) {
    return;
  }

  const isOpen = cart.dataset.open === 'true';
  if (isOpen) {
    closeCart();
  } else {
    openCart();
  }
}

function handleOutsideClick(event) {
  if (event.target === overlay) {
    closeCart();
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape' && cart && cart.dataset.open === 'true') {
    event.preventDefault();
    closeCart();
  }
}

function initialisePriceRange() {
  if (!priceRange || !priceValue) {
    return;
  }

  const sliderMaxPrice = calculateSliderMaxPrice();
  const defaultValue =
    sliderMaxPrice || Number(priceRange.getAttribute('max')) || Number(priceRange.max) || 0;

  const normalisedDefault = Number.isFinite(defaultValue) ? defaultValue : 0;

  priceRange.min = priceRange.min || '0';
  priceRange.step = priceRange.step || '1';
  priceRange.max = String(normalisedDefault);
  priceRange.value = String(normalisedDefault);
  priceRange.dataset.defaultValue = priceRange.value;

  priceValue.textContent = formatCurrency(Number(priceRange.value));
}

function init() {
  renderCategories();
  renderProducts(products);
  updateCartUI();
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  initialisePriceRange();
  filterProducts();

  if (priceRange && priceValue) {
    priceRange.addEventListener('input', () => {
      priceValue.textContent = formatCurrency(Number(priceRange.value));
      filterProducts();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', filterProducts);
  }

  if (filterForm) {
    filterForm.addEventListener('reset', () => {
      window.requestAnimationFrame(() => {
        if (priceRange && priceValue) {
          const defaultValue =
            priceRange.dataset.defaultValue || priceRange.getAttribute('max') || priceRange.max;
          priceRange.value = defaultValue;
          priceValue.textContent = formatCurrency(Number(priceRange.value));
        }
        filterProducts();
      });
    });
  }

  if (cartToggle) {
    cartToggle.addEventListener('click', toggleCart);
  }

  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  if (overlay) {
    overlay.addEventListener('click', handleOutsideClick);
  }

  document.addEventListener('keydown', handleKeydown);
}

init();
