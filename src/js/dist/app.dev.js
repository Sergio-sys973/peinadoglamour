"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var paso = 1;
var pasoInicial = 1;
var pasoFinal = 3;
var cita = {
  id: '',
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
};
document.addEventListener('DOMContentLoaded', function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarSeccion(); //Muestra y oculta la seccion

  tabs(); // Cambia la seccion cuando se presionen los tabs

  botonesPaginador(); // Agrega o quita los botones del paginador

  paginaSiguiente();
  paginaAnterior();
  consultarAPI(); // Consulta la API en el backend de PHP

  idCliente(); //Añade el id del Cliente al objeto de cita.

  nombreCliente(); // Añade el nombre del Cliente al objeto de cita.

  seleccionarFecha(); // Añade la fecha de la cita en el objeto.

  seleccionarHora(); //Añade la hora de la cita en el objeto

  mostrarResumen(); // Muestra el Resumen de la Cita.  
}

function mostrarSeccion() {
  // Ocultar la seccion que tenga la clase de mostrar
  var seccionAnterior = document.querySelector('.mostrar');

  if (seccionAnterior) {
    seccionAnterior.classList.remove('mostrar');
  } // Seleccionar la Seccion con el paso...


  var pasoSelector = "#paso-".concat(paso);
  var seccion = document.querySelector(pasoSelector);
  seccion.classList.add('mostrar'); // Quita la  clase actual al tab anterior

  var tabAnterior = document.querySelector('.actual');

  if (tabAnterior) {
    tabAnterior.classList.remove('actual');
  } // Resalta el tab actual


  var tab = document.querySelector("[data-paso=\"".concat(paso, "\"]"));
  tab.classList.add('actual');
}

function tabs() {
  // Agrega y cambia la variable de paso segun el tab seleccionado
  var botones = document.querySelectorAll('.tabs button');
  botones.forEach(function (boton) {
    boton.addEventListener('click', function (e) {
      paso = parseInt(e.target.dataset.paso);
      mostrarSeccion();
      botonesPaginador();
    });
  });
}

function botonesPaginador() {
  var paginaAnterior = document.querySelector('#anterior');
  var paginaSiguiente = document.querySelector('#siguiente');

  if (paso === 1) {
    paginaAnterior.classList.add('ocultar');
    paginaSiguiente.classList.remove('ocultar');
  } else if (paso === 3) {
    paginaAnterior.classList.remove('ocultar');
    paginaSiguiente.classList.add('ocultar');
    mostrarResumen();
  } else {
    paginaAnterior.classList.remove('ocultar');
    paginaSiguiente.classList.remove('ocultar');
  }

  mostrarSeccion();
}

function paginaAnterior() {
  var paginaAnterior = document.querySelector('#anterior');
  paginaAnterior.addEventListener('click', function () {
    if (paso <= pasoInicial) return;
    paso--;
    botonesPaginador();
  });
}

function paginaSiguiente() {
  var paginaSiguiente = document.querySelector('#siguiente');
  paginaSiguiente.addEventListener('click', function () {
    if (paso >= pasoFinal) return;
    paso++;
    botonesPaginador();
  });
}

function consultarAPI() {
  var url, resultado, servicios;
  return regeneratorRuntime.async(function consultarAPI$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          //const url = 'http://localhost:3000/api/servicios';
          url = '/api/servicios';
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(url));

        case 4:
          resultado = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(resultado.json());

        case 7:
          servicios = _context.sent;
          mostrarServicios(servicios);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}

function mostrarServicios(servicios) {
  servicios.forEach(function (servicio) {
    var id = servicio.id,
        nombre = servicio.nombre,
        precio = servicio.precio;
    var nombreServicio = document.createElement('P');
    nombreServicio.classList.add('nombre-servicio');
    nombreServicio.textContent = nombre;
    var precioServicio = document.createElement('P');
    precioServicio.classList.add('precio-servicio');
    precioServicio.textContent = "$ ".concat(precio);
    var servicioDiv = document.createElement('DIV');
    servicioDiv.classList.add('servicio');
    servicioDiv.dataset.idServicio = id;

    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);
    document.querySelector('#servicios').appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  var id = servicio.id;
  var servicios = cita.servicios; // Identificar el elemento que se la da click

  var divServicio = document.querySelector("[data-id-servicio=\"".concat(id, "\"]")); // Comprobar si un servicio ya fue agregado

  if (servicios.some(function (agregado) {
    return agregado.id === id;
  })) {
    // Eliminarlo
    cita.servicios = servicios.filter(function (agregado) {
      return agregado.id !== id;
    });
    divServicio.classList.remove('seleccionado');
  } else {
    // Agregarlo
    cita.servicios = [].concat(_toConsumableArray(servicios), [servicio]);
    divServicio.classList.add('seleccionado');
  } //  console.log(cita);

}

function idCliente() {
  cita.id = document.querySelector('#id').value;
}

function nombreCliente() {
  cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
  var inputFecha = document.querySelector('#fecha');
  inputFecha.addEventListener('input', function (e) {
    var dia = new Date(e.target.value).getUTCDay();

    if ([0].includes(dia)) {
      e.target.value = '';
      mostrarAlerta('Fines de Semana No Permitidos', 'error', '.formulario');
    } else {
      cita.fecha = e.target.value;
    }
  });
}

function seleccionarHora() {
  var inputHora = document.querySelector('#hora');
  inputHora.addEventListener('input', function (e) {
    var horaCita = e.target.value;
    var hora = horaCita.split(":")[0];

    if (hora < 10 || hora > 21) {
      e.target.value = '';
      mostrarAlerta('Hora No Valida', 'error', '.formulario');
    } else {
      cita.hora = e.target.value;
      console.log(cita);
    }
  });
}

function mostrarAlerta(mensaje, tipo, elemento) {
  var desaparece = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  // Previene que se genere mas de un alerta
  var alertaPrevia = document.querySelector('.alerta');

  if (alertaPrevia) {
    alertaPrevia.remove();
  } //Scripting para crear la alerta


  var alerta = document.createElement('DIV');
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');
  alerta.classList.add(tipo);
  var referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  if (desaparece) {
    // Eliminar la alerta
    setTimeout(function () {
      alerta.remove();
    }, 3000);
  }
}

function mostrarResumen() {
  var resumen = document.querySelector('.contenido-resumen'); // Limpiar el contenido de Reumen

  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes('') || cita.servicios.length === 0) {
    mostrarAlerta('Faltan datos de Servicios, fecha u Hora', 'error', '.contenido-resumen', false);
    return;
  } // Formatear el div de resumen


  var nombre = cita.nombre,
      fecha = cita.fecha,
      hora = cita.hora,
      servicios = cita.servicios; // Heading para Servicios en Resumen

  var headingServicios = document.createElement('H3');
  headingServicios.textContent = 'RESUMEN DE SERVICIOS';
  resumen.appendChild(headingServicios); // Iterando y Mostrando los Servicios

  servicios.forEach(function (servicio) {
    var id = servicio.id,
        precio = servicio.precio,
        nombre = servicio.nombre;
    var contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('contenedor-servicio');
    var textoServicio = document.createElement('P');
    textoServicio.textContent = nombre;
    var precioServicio = document.createElement('P');
    precioServicio.innerHTML = "<span>Precio:</span> $".concat(precio, " ");
    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);
    resumen.appendChild(contenedorServicio);
  }); // Heading para Cita en Resumen

  var headingCita = document.createElement('H3');
  headingCita.textContent = 'Resumen de Cita';
  resumen.appendChild(headingCita);
  var nombreCliente = document.createElement('P');
  nombreCliente.innerHTML = "<span>Nombre:</span> ".concat(nombre); // Formatear la Fecha en Español

  var fechaObj = new Date(fecha);
  var mes = fechaObj.getMonth();
  var dia = fechaObj.getDate() + 2;
  var year = fechaObj.getFullYear();
  var fechaUTC = new Date(Date.UTC(year, mes, dia));
  var opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  var fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);
  var fechaCita = document.createElement('P');
  fechaCita.innerHTML = "<span>Fecha:</span> ".concat(fechaFormateada);
  console.log(cita);
  var horaCita = document.createElement('P');
  horaCita.innerHTML = "<span>Hora:</span> ".concat(hora, " Horas"); // Boton para Crear una Cita

  var botonReservar = document.createElement('BUTTON');
  botonReservar.classList.add('boton');
  botonReservar.textContent = 'Reservar Cita';
  botonReservar.onclick = reservarCita;
  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);
  resumen.appendChild(botonReservar);
}

function reservarCita() {
  var nombre, fecha, hora, servicios, id, idServicios, datos, url, respuesta, resultado;
  return regeneratorRuntime.async(function reservarCita$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          nombre = cita.nombre, fecha = cita.fecha, hora = cita.hora, servicios = cita.servicios, id = cita.id;
          idServicios = servicios.map(function (servicio) {
            return servicio.id;
          }); // console.log(idSservicios);

          datos = new FormData();
          datos.append('fecha', fecha);
          datos.append('hora', hora);
          datos.append('usuarioId', id);
          datos.append('servicios', idServicios); // console.log([...datos]);

          _context2.prev = 7;
          //Peticion hacia la API
          url = '/api/citas';
          _context2.next = 11;
          return regeneratorRuntime.awrap(fetch(url, {
            method: 'POST',
            body: datos
          }));

        case 11:
          respuesta = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(respuesta.json());

        case 14:
          resultado = _context2.sent;
          console.log(resultado.resultado);
          console.log(resultado);

          if (resultado.resultado) {
            Swal.fire({
              icon: "success",
              title: "Cita Creada",
              text: "Tu Cita fue Creada Correctamente",
              button: 'OK'
            }).then(function () {
              setTimeout(function () {
                window.location.reload();
              }, 3000);
            });
          }

          _context2.next = 23;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](7);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un Error al guardar la Cita"
          });

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 20]]);
}
//# sourceMappingURL=app.dev.js.map
