//alert('Desde Buscador');
document.addEventListener('DOMContentLoaded', function() {

  iniciarApp();
});

function iniciarApp() {

  buscarPorFecha();
}

function buscarPorFecha() {
  //console.log('Desde Buscar Por Fecha');
  const fechaInput = document.querySelector('#fecha');
  fechaInput.addEventListener('input', function(e) {
     // console.log('Nueva Fecha');

     const fechaSeleccionada = e.target.value;
   
     window.location = `?fecha=${fechaSeleccionada}`;
  });
}