// imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static_v2';
const DYNAMIC_CACHE = 'dynamic_v1';
const INMUTABLE_CACHE = 'inmutable_v1';

const CACHE_DYNAMIC_LIMIT = 50;

const APP_SHELL = [
    '/',
    'index.html',
    'img/favicon.ico',
    'css/style.css',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

// Install Service Worker
self.addEventListener('install', e => {
    const cache_static = caches.open( STATIC_CACHE )
        .then( cache => cache.addAll(APP_SHELL));

    const cache_inmutable = caches.open( INMUTABLE_CACHE )
        .then( cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil( Promise.all([cache_static, cache_inmutable]) );
});

// delete old caches
self.addEventListener('activate', e => {
    const response = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil( response );
});

// 2- Cache with Network Fallback
self.addEventListener('fetch', e => {
    const response = caches.match( e.request )
        .then( res => {
            if ( res ) return res;
            // the resource does not exist
            //console.log('No existe', e.request.url );
            return fetch( e.request ).then( newRes => {
                return updateDynamicCache(DYNAMIC_CACHE, e.request, newRes);
            });
        });
    e.respondWith( response );
});
