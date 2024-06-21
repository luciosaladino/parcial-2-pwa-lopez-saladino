let version = "version2"


self.addEventListener("install", e => {

    console.log("instalando service worker")
    caches.open(version).then(cache => {
        cache.addAll([
            "index.html",
            "script.js",
            "css/style.css",
            "http://127.0.0.1:5500/",
            "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
            
            "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"

        ]
        ).catch(e=>{
            console.log(e)
        })

    })
})



self.addEventListener("activate", () => {

    console.log("service worker activo")


   
    caches.keys().then(
        key=>{
            return Promise.all(
                key.map(cache=>{
                    if (cache !== version){
                        console.log("cache eliminado")
                        return caches.delete(cache)
                    }
                })
            )
        }
    )
})