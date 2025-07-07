const productos = [
  { id: 1, nombre: "Tagliatelle Clásico", precio: 1500, imagen: "img/taglia.jpg"},
  { id: 2, nombre: "Fettuccine Rústico", precio: 1670, imagen: "img/fetuche.jpg" },
  { id: 3, nombre: "Pappardelle con Hierbas", precio: 1800, imagen: "img/papa.png" },
  { id: 4, nombre: "Tortellini Rellenos", precio: 2500, imagen: "img/torte.jpg" },
  { id: 5, nombre: "Ravioli Artesanal", precio: 2000, imagen: "img/ravio.jpg" },
  { id: 6, nombre: "Gnocchi Casero", precio: 1200, imagen: "img/ñoqui.jpg" },
];

const productosList = document.getElementById("productos-list");
const carritoCount = document.getElementById("carrito-count");
const carritoPanel = document.getElementById("carrito-panel");
const carritoItemsContainer = document.getElementById("carrito-items");
const carritoTotal = document.getElementById("carrito-total");
const btnCarrito = document.getElementById("btn-carrito");
const btnCerrarCarrito = document.getElementById("cerrar-carrito");
const overlay = document.getElementById("overlay");
const btnVaciar = document.getElementById("vaciar-carrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarContador() {
  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  carritoCount.textContent = totalCantidad;
}

function calcularTotal() {
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  carritoTotal.textContent = total.toFixed(2);
}

function crearProductoCard(producto) {
  const card = document.createElement("div");
  card.classList.add("card-producto");

  card.innerHTML = `
    <img src="${producto.imagen}" alt="Foto de ${producto.nombre}" />
    <div class="card-body">
      <h3 class="card-title">${producto.nombre}</h3>
      <p class="card-price">$${producto.precio.toFixed(2)}</p>
      <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
    </div>
  `;

  return card;
}

function mostrarProductos() {
  productosList.innerHTML = "";
  productos.forEach((producto) => {
    const card = crearProductoCard(producto);
    productosList.appendChild(card);
  });
}

function abrirCarrito() {
  carritoPanel.classList.add("abierto");
  overlay.classList.add("visible");
}

function cerrarCarrito() {
  carritoPanel.classList.remove("abierto");
  overlay.classList.remove("visible");
}

function mostrarCarrito() {
  carritoItemsContainer.innerHTML = "";

  if (carrito.length === 0) {
    carritoItemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    carritoTotal.textContent = "0.00";
    return;
  }

  carrito.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("carrito-item");

    div.innerHTML = `
      <img src="${item.imagen}" alt="Foto de ${item.nombre}" />
      <div class="carrito-info">
        <h4>${item.nombre}</h4>
        <p>Precio: $${item.precio.toFixed(2)}</p>
      </div>
      <div class="carrito-cantidad">
        <input type="number" min="1" value="${item.cantidad}" data-id="${item.id}" />
      </div>
      <button class="btn-eliminar" data-id="${item.id}" aria-label="Eliminar ${item.nombre}">&times;</button>
    `;

    carritoItemsContainer.appendChild(div);
  });

  calcularTotal();
}

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const itemEnCarrito = carrito.find((item) => item.id === id);

  if (itemEnCarrito) {
    itemEnCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  actualizarContador();
  mostrarCarrito();
  abrirCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);
  guardarCarrito();
  actualizarContador();
  mostrarCarrito();
}

function cambiarCantidad(id, cantidad) {
  const item = carrito.find((item) => item.id === id);
  if (!item) return;

  if (cantidad <= 0) {
    eliminarDelCarrito(id);
  } else {
    item.cantidad = cantidad;
  }
  guardarCarrito();
  actualizarContador();
  mostrarCarrito();
}

// Event Listeners

// Cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  actualizarContador();
  mostrarCarrito();
});

// Click en "Agregar al carrito"
productosList.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-agregar")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    agregarAlCarrito(id);
  }
});

// Abrir carrito
btnCarrito.addEventListener("click", abrirCarrito);

// Cerrar carrito
btnCerrarCarrito.addEventListener("click", cerrarCarrito);
overlay.addEventListener("click", cerrarCarrito);

// Vaciar carrito
btnVaciar.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  actualizarContador();
  mostrarCarrito();
  cerrarCarrito();
});

// Cambiar cantidad en input
carritoItemsContainer.addEventListener("change", (e) => {
  if (e.target.tagName === "INPUT") {
    const id = parseInt(e.target.getAttribute("data-id"));
    const cantidad = parseInt(e.target.value);
    if (isNaN(cantidad) || cantidad < 1) {
      e.target.value = 1;
      return;
    }
    cambiarCantidad(id, cantidad);
  }
});

// Eliminar producto con botón
carritoItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    eliminarDelCarrito(id);
  }
});
