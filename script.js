

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a"

const info = async () => {

  const info = await fetch(url)
    .then(respuesta => respuesta.json())
    .then(data => {


      let contenedor = document.getElementById("container")


      data.drinks.forEach(trago => {


        contenedor.innerHTML += `  
            
            <div class="row">
            <div class="col s12 m7">
              <div class="card">
                <div class="card-image">
                  <img src="${trago.strDrinkThumb}">
                  <span class="card-title">${trago.strDrink}</span>
                </div>
                <div class="card-content">
                  <p>${trago.strCategory}</p>
                </div>
                <div class="card-action">
                  <a class="waves-effect waves-light btn modal-trigger" href="#modal1" onclick="modalDetalle('${trago.strDrink}', '${trago.strInstructionsES}')">Ver más del trago</a>
                </div>
              </div>
            </div>
          </div>
          
          `
        //Inicializa las modales, lo requiere si o si Materialize, es parte de su documentación.
        const elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);

        console.log(trago)
      });
    })
}

info();

//Modal para el detalle del trago
function modalDetalle(titulo, intrucciones, imagen, ingredientes) {
  document.getElementById('tituloModal').textContent = titulo;
  document.getElementById('contenidoModal').textContent = intrucciones;
  document.getElementById('imagenModal').src = imagen;

  var instance = M.Modal.getInstance(document.getElementById('modal1'));
  instance.open();
}