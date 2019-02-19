
function updateDynamicCache(dynamic_cache, req, res) {
    if (res.ok) {
        return caches.open(dynamic_cache).then(cache => {
            // let newResToCache = res.clone();
            // cache.put(req, newResToCache);
            // return newResToCache;
            cache.put(req, res.clone());
            return res.clone();
        });
    } else {
        return res;
    }

}