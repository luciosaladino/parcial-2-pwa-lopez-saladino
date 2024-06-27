// Se importa la Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxJIaCwa99X6qZYBXiwGs2djF7DAAZivQ",
  authDomain: "tragoapp-f02c6.firebaseapp.com",
  projectId: "tragoapp-f02c6",
  storageBucket: "tragoapp-f02c6.appspot.com",
  messagingSenderId: "1068470432198",
  appId: "1:1068470432198:web:0089d8422eef7a4ca102c7",
  measurementId: "G-G4M88XBP9B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


if(navigator.serviceWorker) {
  navigator.serviceWorker.register("worker.js")
  .then((registration) => {
      console.log("service worker registrado");
  })
  .catch((error) => {
      console.log("service worker no registrado");
  });
}

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a"

const info = async () => {
  const info = await fetch(url)
    .then(respuesta => respuesta.json())
    .then(data => {

      let contenedor = document.getElementById("container")
      data.drinks.forEach(trago => {
        contenedor.innerHTML += `  
            <div class="row">
            <div class="col s12 m7 ">
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
          `;
      });
        //Inicializa las modales, lo requiere si o si Materialize, es parte de su documentación.
        const elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);
    })
    .catch(error =>{
      console.error("Error al obtener datos de la API", error);
    });
};

info();
//Modal para el detalle del trago
async function modalDetalle(idDrink) {
  const detailUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`;

  fetch(detailUrl)
  .then(respuesta => {
    if (!respuesta.ok) {
      throw new Error('ID incorrecto, proba con otro!');
    }
    return respuesta.json();
  })
  .then(data => {
    if (!data.drinks || data.drinks.length === 0) {
      throw new Error('No encontramos ese trago');
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

      cargarComentario(idDrink);

      const formulario = document.getElementById('formulario')
      formulario.onsubmit = async (e) =>{
      e.preventDefault(); //Evita que se recargue la página al enviar el form
      const nombreUsuario = document.getElementById('nombreUsuario');
      const valoracion = document.getElementById('valoracion');
      const comentario = document.getElementById('elComentario');

    // Carga todos los datos el la base de datos de firestore
    await addDoc(collection(db, `cocktails/${idDrink}/reviews`),{
      nombreUsuario,
      valoracion: parseInt(valoracion), // Se parsea el valor del rating de string -> number
      comentario
    });

    formulario.reset() // Resetea el form una vez que se envia el comentario
    cargarComentario(idDrink);
  };

  const instance = M.Modal.getInstance(document.getElementById('modal1'));
  instance.open(); 
    }
  )}
)}

  async function cargarComentario(idDrink){
    const verComentario = document.getElementById('verComentario');
    verComentario.innerHTML = '';

    const consulta = query(collection(db `cocktails/${idDrink}/reviews`));
    const losComentarios = await getDocs(consulta);
    losComentarios.forEach((doc) =>{
      const comentario = doc.data();
      verComentario.innerHTML +=`
            <div class="review">
                <p>${review.userName} (${review.rating}/5): ${review.comment}</p>
            </div>
        `;
  })
}
