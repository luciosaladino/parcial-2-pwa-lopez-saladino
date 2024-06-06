

const url= "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a"

const info = async () =>{

  const info = await fetch(url)
  .then(respuesta => respuesta.json())
  .then(data =>{


        let contenedor = document.getElementById("container")

     
        data.drinks.forEach(trago => {


            contenedor.innerHTML +=`  
            
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
                  <a href="#">Ver más del trago</a>
                </div>
              </div>
            </div>
          </div>
          
          `

         



            console.log(trago)
        });
  })
}

info();