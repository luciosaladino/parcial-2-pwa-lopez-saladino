

const url= "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a"

const info = async () =>{

  const info = await fetch(url)
  .then(respuesta => respuesta.json())
  .then(data =>{

    console.log(data)

  })
}

info();