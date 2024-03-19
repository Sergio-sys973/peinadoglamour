"use strict";

//alert('Desde Buscador');
document.addEventListener('DOMContentLoaded', function () {
  iniciarApp();
});

function iniciarApp() {
  buscarPorFecha();
}

function buscarPorFecha() {
  //console.log('Desde Buscar Por Fecha');
  var fechaInput = document.querySelector('#fecha');
  fechaInput.addEventListener('input', function (e) {
    // console.log('Nueva Fecha');
    var fechaSeleccionada = e.target.value;
    window.location = "?fecha=".concat(fechaSeleccionada);
  });
}
//# sourceMappingURL=buscador.dev.js.map
