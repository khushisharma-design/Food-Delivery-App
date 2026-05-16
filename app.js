const menuEl = document.getElementById('menu')
const cartListEl = document.getElementById('cartList')
const cartCountEl = document.getElementById('cartCount')
const cartSubtotalEl = document.getElementById('cartSubtotal')
const serviceFeeEl = document.getElementById('serviceFee')
const cartTotalEl = document.getElementById('cartTotal')
const checkoutBtn = document.getElementById('checkoutBtn')
const cartBtn = document.getElementById('cartBtn')
const cartEl = document.getElementById('cart')
const modal = document.getElementById('checkoutModal')
const closeModal = document.getElementById('closeModal')

const items = [
  {id:1,name:'Espresso',price:12.5,emoji:'☕',desc:'Rich, concentrated shot with a velvety crema.',image:'espresso.jpeg'},
  {id:2,name:'Cappuccino',price:18.0,emoji:'☕',desc:'Classic cappuccino with steamed milk and a dusting of cocoa.',image:'Cappuccino.webp'},
  {id:3,name:'Latte',price:19.5,emoji:'🥛',desc:'Smooth espresso with creamy milk and a delicate foam.',image:'latte.jpeg'},
  {id:4,name:'Cold Brew',price:20.0,emoji:'🧊',desc:'Slow-steeped coffee served chilled for a clean finish.',image:null},
  {id:5,name:'Matcha Latte',price:21.0,emoji:'🍵',desc:'Ceremonial matcha blended with silky milk and honey notes.',image:null},
  {id:6,name:'Almond Croissant',price:14.5,emoji:'🥐',desc:'Flaky croissant filled with almond cream and toasted almonds.',image:null}
]

const cart = []

function renderMenu(){
  menuEl.innerHTML = ''
  items.forEach(it=>{
    const el = document.createElement('article')
    el.className = it.image ? 'card featured' : 'card'
    const thumbContent = it.image ? `<img src="${it.image}" alt="${it.name}" style="width:100%;height:100%;object-fit:cover;border-radius:18px;">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f2e8e4;border-radius:18px;font-size:3rem;">${it.emoji}</div>`
    const badge = it.image ? '<div class="badge">Featured</div>' : ''
    el.innerHTML = `
      <div class="thumb">${thumbContent}</div>
      ${badge}
      <h3 class="item-name">${it.name}</h3>
      <p class="item-desc">${it.desc}</p>
      <div class="row">
        <div class="muted">AED ${it.price.toFixed(2)}</div>
        <button class="primary" data-id="${it.id}">Add</button>
      </div>`
    menuEl.appendChild(el)
  })
}

function formatAED(value){
  return `AED ${value.toFixed(2)}`
}

function updateCartUI(){
  cartListEl.innerHTML = ''
  let subtotal = 0
  cart.forEach(entry=>{
    const li = document.createElement('li')
    li.className = 'cart-item'
    li.dataset.id = entry.id
    li.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${entry.name}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="decrease">−</button>
          <span class="qty-display">${entry.qty}</span>
          <button class="qty-btn" data-action="increase">＋</button>
        </div>
      </div>
      <strong>${formatAED(entry.qty * entry.price)}</strong>`
    cartListEl.appendChild(li)
    subtotal += entry.qty * entry.price
  })

  const serviceFee = subtotal > 0 ? Math.max(2, subtotal * 0.05) : 0
  const total = subtotal + serviceFee

  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0)
  cartSubtotalEl.textContent = formatAED(subtotal)
  serviceFeeEl.textContent = formatAED(serviceFee)
  cartTotalEl.textContent = formatAED(total)
}

function addToCart(id){
  const item = items.find(i => i.id === id)
  if(!item) return
  const existing = cart.find(c => c.id === id)
  if(existing) existing.qty++
  else cart.push({id: item.id, name: item.name, price: item.price, qty: 1})
  updateCartUI()
}

function changeQuantity(id, delta){
  const item = cart.find(c => c.id === id)
  if(!item) return
  item.qty += delta
  if(item.qty <= 0){
    const index = cart.findIndex(c => c.id === id)
    cart.splice(index, 1)
  }
  updateCartUI()
}

menuEl.addEventListener('click', e => {
  const btn = e.target.closest('button')
  if(!btn || !btn.dataset.id) return
  addToCart(Number(btn.dataset.id))
})

cartListEl.addEventListener('click', e => {
  const btn = e.target.closest('button')
  if(!btn) return
  const itemEl = btn.closest('.cart-item')
  if(!itemEl) return
  const id = Number(itemEl.dataset.id)
  const action = btn.dataset.action
  if(action === 'increase') changeQuantity(id, 1)
  if(action === 'decrease') changeQuantity(id, -1)
})

cartBtn.addEventListener('click', () => {
  cartEl.scrollIntoView({behavior: 'smooth'})
})

checkoutBtn.addEventListener('click', () => {
  if(cart.length === 0) return alert('Your cart is empty')
  modal.setAttribute('aria-hidden', 'false')
  cart.length = 0
  updateCartUI()
})

closeModal.addEventListener('click', () => {
  modal.setAttribute('aria-hidden', 'true')
})

renderMenu()
updateCartUI()
