const menu = [
  {id:'espresso',name:'Espresso',price:45,img:'espresso.jpg',desc:'A short, intense shot with a rich aroma.'},
  {id:'cappuccino',name:'Cappuccino',price:65,img:'cappuccino.jpg',desc:'Espresso, steamed milk, and a soft foam top.'},
  {id:'house-special',name:'House Special',price:80,img:'house-special.jpg',desc:'A caramel iced coffee made for a cozy moment.'},
  {id:'coffee-beans',name:'Freshly Roasted Beans',price:150,img:'coffee-beans.jpg',desc:'Rich freshly roasted beans for home brewing.'},
  {id:'slow-brew',name:'Slow Brew',price:70,img:'slow-brew.jpg',desc:'Smooth pour-over coffee for a slow morning.'},
  {id:'daily-latte',name:'Daily Latte',price:75,img:'daily-latte.jpg',desc:'Comforting espresso and milk topped with latte art.'}
];

const CART = 'cozyCoffeeCart';

const getCart = () => JSON.parse(localStorage.getItem(CART) || '[]');
const saveCart = c => localStorage.setItem(CART, JSON.stringify(c));
const money = n => 'EGP ' + Number(n).toLocaleString('en');

// MENU
const menuContainer = document.querySelector('#menuProducts');
console.log("Menu script is working!");
console.log("Menu products:", menu.length);
console.log("Menu container:", menuContainer);

if (menuContainer) {
  menuContainer.innerHTML = menu.map(p => `
  <article class="card">
    <img src="${p.img}" alt="${p.name}">
    <div class="card-body">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <span class="price">${money(p.price)}</span>
      <button class="btn" data-add="${p.id}">
        Add to Cart
      </button>
    </div>
  </article>
   `).join('');

  menuContainer.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;

    let c = getCart();
    let p = menu.find(x => x.id === b.dataset.add);
    let item = c.find(x => x.id === p.id);

    item ? item.qty++ : c.push({...p, qty: 1});

    saveCart(c);
    b.textContent = 'Added ✓';

    setTimeout(() => {
      b.textContent = 'Add to Cart';
    }, 850);
  });
}

// CART
const cartNode = document.querySelector('#cartItems');

if (cartNode) {
  function render() {
    let c = getCart();

    cartNode.innerHTML = c.length ? c.map(p => 
      <article class="cart-row">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <strong>${p.name}</strong>
          <div>${money(p.price)} each</div>
          <div class="qty">
            <button data-qty="-1" data-id="${p.id}">−</button>
            <span>${p.qty}</span>
            <button data-qty="1" data-id="${p.id}">+</button>
          </div>
        </div>
        <div class="row-total">
          <strong>${money(p.price * p.qty)}</strong>
          <button class="remove" data-remove="${p.id}">Remove</button>
        </div>
      </article>
    ).join('') : 
      <div class="empty">
        <h3>Your cart is empty</h3>
        <a class="btn" href="menu.html">Browse menu</a>
      </div>
    ;

    let total = c.reduce((a, p) => a + p.price * p.qty, 0);

    document.querySelector('#subtotal').textContent = money(total);
    document.querySelector('#total').textContent = money(total);
  }

  cartNode.addEventListener('click', e => {
    let q = e.target.closest('[data-qty]');
    let r = e.target.closest('[data-remove]');
    let c = getCart();

    if (q) {
      let p = c.find(x => x.id === q.dataset.id);
      if (p) {
        p.qty += Number(q.dataset.qty);
        c = c.filter(x => x.qty > 0);
      }
    }

    if (r) {
      c = c.filter(x => x.id !== r.dataset.remove);
    }

    saveCart(c);
    render();
  });

  render();

  const checkout = document.querySelector('#checkout');

  if (checkout) {
    checkout.addEventListener('click', () => {
      document.querySelector('#checkoutMsg').textContent =
        getCart().length
          ? 'Checkout is a demo only; no real order/payment is submitted.'
          : 'Add products to your cart first.';
    });
  }
}

// MOBILE MENU
const toggle = document.querySelector('.menu-toggle');

if (toggle) {
  toggle.addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('open');
  });
}

// FOOTER YEAR
document.querySelectorAll('.year').forEach(
  x => x.textContent = new Date().getFullYear()
);

// CONTACT FORM
const form = document.querySelector('#contactForm');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    document.querySelector('#formMsg').textContent =
      'Thanks! This demo form is ready, but messages are not sent to a server.';

    form.reset();
  });
}
