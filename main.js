let carrito = [];

const almacenadorProductos = document.getElementById("almacenadorProductos");
const productosList = [];

const exhibirProductos = "json/productos.json";
fetch(exhibirProductos)
  .then((respuesta) => respuesta.json())
  .then((productos) => {
    productos.forEach((producto) => {
      productosList.push(producto);
      const card = document.createElement("div");
      card.classList.add("col-xl-2", "col-md-6", "col-xs-12");
      card.innerHTML = `
                <div class="card">
                  <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                  <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio}</p>
                    <button class="btn btn-success" id="" onclick="sumarAlCarrito(${producto.id})">Agregar a tu Compra</button>
                  </div>
                </div>
            `;

      almacenadorProductos.appendChild(card);
    });
  });

const barraBusqueda = document.getElementById("barraBusqueda");
const botonBusqueda = document.getElementById("botonBusqueda");

const filtrar = () => {
  almacenadorProductos.innerHTML = "";
  const texto = barraBusqueda.value.toLowerCase();
  for (let producto of productosList) {
    let nombre = producto.nombre.toLowerCase();
    if (nombre.indexOf(texto) !== -1) {
      const card = document.createElement("div");
      card.classList.add("col-xl-2", "col-md-6", "col-xs-12");
      card.innerHTML += `
              <div class="card">
                <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="card-body">
                  <h5 class="card-title">${producto.nombre}</h5>
                  <p class="card-text">$${producto.precio}</p>
                  <button class="btn btn-success" onclick="sumarAlCarrito(${producto.id})">Agregar a tu Compra</button>
                </div>
              </div>
      `;
      almacenadorProductos.appendChild(card);
    }
  }
  if (almacenadorProductos.innerHTML === "") {
    almacenadorProductos.innerHTML += `
    <div class="m-3">
    <h4> Producto no encontrado. Intente nuevamente. </h4>
    </div>
    `;
  }
};

barraBusqueda.addEventListener("keyup", filtrar);
botonBusqueda.addEventListener("click", filtrar);

const sumarAlCarrito = function (id) {
  const producto = productosList.find((producto) => producto.id === id);
  const productoEnCarrito = carrito.find((producto) => producto.id === id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push(producto);

    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  Toastify({
    text: `${producto.nombre} ha sido añadido al Carrito`,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    style: {
      background: "#90ee90",
      color: "#000000",
    },
  }).showToast();

  calcularTotal();
};

const almacenadorCarrito = document.getElementById("almacenadorCarrito");
const mostrarCarrito = document.getElementById("verCarrito");

mostrarCarrito.addEventListener("click", () => {
  verCarrito();
});

const verCarrito = () => {
  almacenadorCarrito.innerHTML = "";
  carrito.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add();
    card.innerHTML = `
            <div class="card mb-3" style="max-width: 540px;">
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="${producto.img}" class="img-fluid rounded-start mt-4" alt="${producto.nombre}">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio} c/u</p>
                    <p class="card-text"><small class="text-muted">Cantidad: ${producto.cantidad}</small></p>
                    <button class="btn btn-success" id="eliminar${producto.id}"> Eliminar Producto</button>
                  </div>
                </div>
              </div>
            </div>
        `;

    almacenadorCarrito.appendChild(card);

    const boton = document.getElementById(`eliminar${producto.id}`);
    boton.addEventListener("click", () => {
      sacarDelCarrito(producto.id);
    });
  });
  calcularTotal();
};

const sacarDelCarrito = (id) => {
  const producto = carrito.find((producto) => producto.id === id);
  const indice = carrito.indexOf(producto);
  carrito.splice(indice, 1);
  Toastify({
    text: `${producto.nombre} ha sido eliminado del Carrito`,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    style: {
      background: "#90ee90",
      color: "#000000",
    },
  }).showToast();

  verCarrito();

  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
  eliminarCarrito();
});

const eliminarCarrito = () => {
  carrito = [];
  Toastify({
    text: `Has vaciado completamente el Carrito`,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    style: {
      background: "#90ee90",
      color: "#000000",
    },
  }).showToast();
  verCarrito();

  localStorage.clear();
};

const total = document.getElementById("total");

const calcularTotal = () => {
  let totalCompra = 0;
  carrito.forEach((producto) => {
    totalCompra += producto.precio * producto.cantidad;
  });
  total.innerHTML = `$${totalCompra}`;
};
