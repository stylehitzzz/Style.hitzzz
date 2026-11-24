const storeName = document.getElementById("storeName");
const logoText = document.getElementById("logoText");
const tagline = document.getElementById("storeTagline");
const footerName = document.getElementById("footerName");
const categoriesEl = document.getElementById("categories");
const productsEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const moreButton = document.getElementById("moreButton");
const emptyMessage = document.getElementById("emptyMessage");

document.title = STORE.name;
storeName.textContent = STORE.name;
logoText.textContent = STORE.logoText;
tagline.textContent = STORE.tagline;
footerName.textContent = STORE.name;
document.documentElement.style.setProperty("--accent", STORE.accentColor);

let selectedCategory = "SEMUA";
let expanded = false;

function renderCategories() {
  categoriesEl.innerHTML = "";
  const visible = expanded ? CATEGORIES : CATEGORIES.slice(0, 4);
  const all = ["SEMUA", ...visible];
  all.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category" + (category === selectedCategory ? " active" : "") + (category === "SEMUA" ? " all" : "");
    button.textContent = category === "SEMUA" ? "SEMUA PRODUK" : category;
    button.addEventListener("click", () => {
      selectedCategory = category;
      renderCategories();
      renderProducts();
    });
    categoriesEl.appendChild(button);
  });
  moreButton.hidden = CATEGORIES.length <= 4;
  moreButton.textContent = expanded ? "Tutup⌃" : "Lebih Banyak⌄";
}

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === "SEMUA" || product.category === selectedCategory;
    const matchesSearch = `${product.number} ${product.name} ${product.category}`.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });
  productsEl.innerHTML = "";
  filtered.forEach(product => {
    const card = document.createElement("a");
    card.className = "product";
    card.href = product.link || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", `Beli ${product.name}`);

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image";
    if (product.image) {
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.name;
      img.loading = "lazy";
      img.onerror = () => { imageWrap.innerHTML = '<div class="image-placeholder">Foto produk belum tersedia</div>'; };
      imageWrap.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "image-placeholder";
      placeholder.textContent = "Tambahkan URL foto produk";
      imageWrap.appendChild(placeholder);
    }
    const info = document.createElement("div");
    info.className = "product-info";
    const name = document.createElement("p");
    name.className = "product-name";
    name.textContent = `No.${product.number} ${product.name}`;
    info.appendChild(name);
    if (product.price) {
      const price = document.createElement("p");
      price.className = "product-price";
      price.textContent = product.price;
      info.appendChild(price);
    }
    card.append(imageWrap, info);
    productsEl.appendChild(card);
  });
  emptyMessage.hidden = filtered.length !== 0;
}

searchInput.addEventListener("input", renderProducts);
moreButton.addEventListener("click", () => {
  expanded = !expanded;
  renderCategories();
});
renderCategories();
renderProducts();
