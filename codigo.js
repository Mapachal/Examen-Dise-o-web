const productos = [
  { id: 1, nombre: "Auriculares Bluetooth", precio: 49.99, imagen: "https://promart.vteximg.com.br/arquivos/ids/7775371-1000-1000/image-e1edacb24ad847c6bb01941164d3e6f5.jpg?v=638410341459070000" },
  { id: 2, nombre: "Smartwatch", precio: 89.99, imagen: "https://mac-center.com.pe/cdn/shop/files/Apple_Watch_Series_10_46mm_GPS_Jet_Black_Aluminum_Sport_Band_Black_PDP_Image_Position_1__COES_866c9f50-c80a-4b5b-bf3a-9506b74b71ef.jpg?v=1726587280" },
  { id: 3, nombre: "Cámara Web HD", precio: 39.99, imagen: "https://dojiw2m9tvv09.cloudfront.net/48881/product/image3472.jpg" },
  { id: 4, nombre: "Teclado Mecánico", precio: 59.99, imagen: "https://phantom.pe/media/catalog/product/cache/c58c05327f55128aefac5642661cf3d1/m/e/meanico_1_.jpg" },
  { id: 5, nombre: "Mouse Inalámbrico", precio: 24.99, imagen: "https://phantom.pe/media/catalog/product/cache/c58c05327f55128aefac5642661cf3d1/g/5/g502x-plus-gallery-2-black.jpg" }
];

let carrito = [];

$(document).ready(function () {
  mostrarProductos(productos);

  // Modo oscuro toggle con Font Awesome
  $('#modo-btn').on('click', function () {
    $('body').toggleClass('oscuro');

    // Cambiar el icono según el modo activo
    const icon = $('body').hasClass('oscuro') ? 'fa fa-sun-o' : 'fa fa-moon-o';
    $('#modo-btn').html(`<i class="${icon}"></i>`);
  });


  // Buscador
  $('#busqueda').on('input', function () {
    const texto = $(this).val().toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    mostrarProductos(filtrados);
  });

  // Ver carrito con opción de eliminar
  $('#ver-carrito').on('click', function (e) {
    e.preventDefault();

    if (carrito.length === 0) {
      Swal.fire('Tu carrito está vacío');
      return;
    }

    let html = '<ul style="text-align:left;">';
    carrito.forEach((p, index) => {
      html += `
        <li style="margin-bottom: 10px;">
          ${p.nombre} - $${p.precio.toFixed(2)}
          <button class="boton eliminar" data-index="${index}" style="margin-left:10px;background:red;">Eliminar</button>
        </li>`;
    });
    html += '</ul>';

    Swal.fire({
      title: 'Carrito de compras',
      html: html,
      showConfirmButton: false,
      didOpen: () => {
        $('.eliminar').on('click', function () {
          const index = $(this).data('index');
          eliminarDelCarrito(index);
          Swal.close();
          $('#ver-carrito').trigger('click');
        });
      }
    });
    Swal.fire({
      title: 'Carrito de compras',
      html: html,
      showCancelButton: true,
      confirmButtonText: 'Pagar ahora',
      cancelButtonText: 'Seguir comprando',
      didOpen: () => {
        $('.eliminar').on('click', function () {
          const index = $(this).data('index');
          eliminarDelCarrito(index);
          Swal.close();
          $('#ver-carrito').trigger('click');
        });
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        mostrarSeccionPago();
      }
    });

  });

  // Formulario de contacto
  $('#formulario-contacto').on('submit', function (e) {
    e.preventDefault();
    const nombre = $('#nombre').val().trim();
    const email = $('#email').val().trim();
    const mensaje = $('#mensaje').val().trim();

    if (!nombre || !email || !mensaje) {
      Swal.fire('Completa todos los campos');
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Mensaje enviado',
        text: 'Gracias por escribirnos. Te contactaremos pronto.',
      });
      $(this)[0].reset();
    }
  });
});

function mostrarProductos(lista) {
  const $lista = $('#lista-productos');
  $lista.empty();
  lista.forEach(producto => {
    const card = $(`
      <div class="tarjeta">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="info">
          <h3>${producto.nombre}</h3>
          <p>$${producto.precio.toFixed(2)}</p>
          <button class="boton" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      </div>
    `);
    card.find('button').on('click', () => agregarAlCarrito(producto.id));
    $lista.append(card);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  actualizarCarrito();
  Swal.fire({
    icon: 'success',
    title: 'Producto añadido',
    text: `${producto.nombre} fue agregado al carrito`,
    timer: 1500,
    showConfirmButton: false
  });
}

function eliminarDelCarrito(index) {
  const eliminado = carrito[index];
  carrito.splice(index, 1);
  actualizarCarrito();
  Swal.fire({
    icon: 'info',
    title: 'Producto eliminado',
    text: `${eliminado.nombre} fue eliminado del carrito`,
    timer: 1200,
    showConfirmButton: false
  });
}

function actualizarCarrito() {
  $('#contador').text(carrito.length);
}

// Mostrar sección de pago si hay productos en el carrito
function mostrarSeccionPago() {
  if (carrito.length === 0) {
    Swal.fire('Agrega productos al carrito antes de pagar.');
    return;
  }

  $('#seccion-pago').slideDown('slow');
  $('html, body').animate({
    scrollTop: $('#seccion-pago').offset().top
  }, 600);
}

// Validación de formulario de pago
$('#formulario-pago').on('submit', function (e) {
  e.preventDefault();

  const nombre = $('#nombre-pago').val().trim();
  const email = $('#email-pago').val().trim();
  const tarjeta = $('#tarjeta').val().trim();
  const vencimiento = $('#vencimiento').val().trim();
  const cvv = $('#cvv').val().trim();

  if (!nombre || !email || !tarjeta || !vencimiento || !cvv) {
    Swal.fire('Completa todos los campos para continuar con el pago.');
    return;
  }

  // Validaciones básicas de tarjeta
  const tarjetaValida = /^\d{16,19}$/.test(tarjeta.replace(/\s/g, ''));
  const vencValido = /^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento);
  const cvvValido = /^\d{3,4}$/.test(cvv);

  if (!tarjetaValida || !vencValido || !cvvValido) {
    Swal.fire('Verifica que los datos de la tarjeta sean correctos.');
    return;
  }

  Swal.fire({
    icon: 'success',
    title: 'Pago procesado',
    text: '¡Gracias por tu compra en TechMart!',
  });

  carrito = [];
  actualizarCarrito();
  $('#formulario-pago')[0].reset();
  $('#seccion-pago').slideUp();
});

