

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
                 <a class="waves-effect waves-light btn modal-trigger" href="#modal1" onclick="modalDetalle('${trago.idDrink}')">Ver más del trago</a>
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
function modalDetalle(idDrink) {

  const detailUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`;

  fetch(detailUrl)
  .then(respuesta => {
    if (!respuesta.ok) {
      throw new Error('Network response was not ok');
    }
    return respuesta.json();
  })
  .then(data => {
    if (!data.drinks || data.drinks.length === 0) {
      throw new Error('No drinks found');
    }


    data.drinks.forEach(trago => {
      
       let ingredientesTrago= [];

      for (let i = 1; i <= 15; i++) {
        let ingredientes = trago[`strIngredient${i}`];
        if (ingredientes) {
            ingredientesTrago.push(ingredientes)
        }
    }

      document.getElementById('imagenModal').src = trago.strDrinkThumb;
      document.getElementById('tituloModal').textContent = trago.strDrink;
      document.getElementById('ingredientesModal').textContent = ingredientesTrago;

      document.getElementById('contenidoModal').textContent = trago.strInstructionsES;

    });


  });

  var instance = M.Modal.getInstance(document.getElementById('modal1'));
  instance.open();
}