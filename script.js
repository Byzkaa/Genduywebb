// ===== Data menu (silakan ubah rasa/harga sesuai kebutuhan) =====
const MENU = [
  { id: 'menu-1', name: 'Coklat Ganache', desc: 'Lelehan coklat premium di atas donat empuk.', price: 'Rp 8.000' },
  { id: 'menu-2', name: 'Strawberry Cheese', desc: 'Manis asam stroberi ketemu gurihnya keju.', price: 'Rp 9.000' },
  { id: 'menu-3', name: 'Matcha Almond', desc: 'Pahit lembut matcha, renyah dari almond.', price: 'Rp 9.500' },
  { id: 'menu-4', name: 'Tiramisu Crunch', desc: 'Rasa kopi lembut dengan taburan crumble.', price: 'Rp 10.000' },
  { id: 'menu-5', name: 'Caramel Sea Salt', desc: 'Karamel legit dengan sentuhan asin gurih.', price: 'Rp 9.500' },
  { id: 'menu-6', name: 'Oreo Crumble', desc: 'Krim vanila dengan remahan biskuit oreo.', price: 'Rp 9.000' },
];

const GALLERY_SLOTS = 6;
const STORAGE_PREFIX = 'donatgenduy_photo_';

// ===== Render menu cards =====
const menuGrid = document.getElementById('menuGrid');
MENU.forEach(item => {
  const card = document.createElement('article');
  card.className = 'donut-card';
  card.innerHTML = `
    <div class="donut-card__photo" data-slot="${item.id}" role="button" tabindex="0" aria-label="Ganti foto ${item.name}">
      <span class="placeholder-ring"></span>
      <img alt="Foto ${item.name}" hidden>
      <span class="upload-hint">Klik untuk unggah foto</span>
    </div>
    <h3>${item.name}</h3>
    <p>${item.desc}</p>
    <span class="price-tag">${item.price}</span>
  `;
  menuGrid.appendChild(card);
});

// ===== Render gallery slots =====
const galleryGrid = document.getElementById('galleryGrid');
for (let i = 1; i <= GALLERY_SLOTS; i++) {
  const slotId = `gallery-${i}`;
  const slot = document.createElement('div');
  slot.className = 'gallery-slot';
  slot.dataset.slot = slotId;
  slot.setAttribute('role', 'button');
  slot.setAttribute('tabindex', '0');
  slot.setAttribute('aria-label', `Unggah foto galeri ${i}`);
  slot.innerHTML = `
    <span class="plus">+</span>
    <img alt="Foto galeri ${i}" hidden>
    <span class="upload-hint">Klik untuk unggah foto</span>
  `;
  galleryGrid.appendChild(slot);
}

// ===== Fitur upload foto (tersimpan di browser via localStorage) =====
const fileInput = document.getElementById('fileInput');
let activeSlotEl = null;

function loadSavedPhoto(el) {
  const slotId = el.dataset.slot;
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + slotId);
    if (saved) applyPhoto(el, saved);
  } catch (e) { /* localStorage tidak tersedia, lewati */ }
}

function applyPhoto(el, dataUrl) {
  const img = el.querySelector('img');
  img.src = dataUrl;
  img.hidden = false;
  const placeholder = el.querySelector('.placeholder-ring, .plus');
  if (placeholder) placeholder.style.display = 'none';
}

function openPicker(el) {
  activeSlotEl = el;
  fileInput.click();
}

document.querySelectorAll('[data-slot]').forEach(el => {
  loadSavedPhoto(el);
  el.addEventListener('click', () => openPicker(el));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker(el);
    }
  });
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file || !activeSlotEl) return;
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    applyPhoto(activeSlotEl, dataUrl);
    try {
      localStorage.setItem(STORAGE_PREFIX + activeSlotEl.dataset.slot, dataUrl);
    } catch (e) {
      console.warn('Gagal menyimpan foto ke localStorage (mungkin ukuran terlalu besar).');
    }
  };
  reader.readAsDataURL(file);
  fileInput.value = '';
});

// Logo memakai perilaku sama, tapi menampilkan/menyembunyikan ikon SVG bawaan
const logoSlot = document.querySelector('.logo-slot');
loadSavedPhoto(logoSlot);
const savedLogo = (() => {
  try { return localStorage.getItem(STORAGE_PREFIX + 'logo'); } catch (e) { return null; }
})();
if (savedLogo) {
  document.querySelector('.logo-mark:not(.logo-uploaded)').hidden = true;
}

// ===== Mobile nav toggle =====
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');
burger.addEventListener('click', () => {
  const expanded = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('nav__links--open');
});

// ===== Tahun footer =====
document.getElementById('year').textContent = new Date().getFullYear();
