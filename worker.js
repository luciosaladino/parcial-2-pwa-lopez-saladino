let version = "v1"


self.addEventListener("install", e => {

    console.log("instalando service worker")
    caches.open(version).then(cache => {
        cache.addAll([
            "/",
            "/index.html",
            "/script.js",
            "css/style.css",
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


/*self.addEventListener("fetch",e=>{

  e.respondWith(async function(){
        const respuestaCache = await caches.match(e.request)
        if(respuestaCache) return respuestaCache;
        return e.request
   });

})*/

self.addEventListener("fetch", e => {
   // console.log("Fetch event para:", e.request.url);

    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(e.request).then(networkResponse => {
                return caches.open(version).then(cache => {
                    cache.put(e.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(err => {
                console.log("Fetch error:", err);
                // Siempre devolvemos una Response, incluso en caso de error
                return caches.match('/index.html').then(offlineResponse => {
                    if (offlineResponse) {
                        return offlineResponse;
                    } else {
                        return new Response("Página offline no disponible", {
                            status: 404,
                            statusText: "Página offline no disponible"
                        });
                    }
                });
            });
        }).catch(async err => {
            console.log("Cache match error:", err);
         
            const offlineResponse = await caches.match('/index.html')
            if (offlineResponse) {
                return offlineResponse
            } else {
                return new Response("Página offline no disponible", {
                    status: 404,
                    statusText: "Página offline no disponible"
                })
            }
        })
    );
});

