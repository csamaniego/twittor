var url = window.location.href;
var swLocation = '/twittor/sw.js';

// register service worker
if ( navigator.serviceWorker ) {
    if (url.includes('localhost')) {
        swLocation = '/sw.js';
    } 
    navigator.serviceWorker.register(swLocation)
    .then(reg => {
        console.log('ServiceWorker registration successful with scope: ', reg.scope);
    })
    .catch(err => {
        console.log('ServiceWorker registration fail: ', err)
    });
}

// checking estimate storage
if ('storage' in navigator && 'estimate' in navigator.storage) {
    navigator.storage.estimate()
        .then(function(estimate){

            console.log(`Using ${estimate.usage} out of ${estimate.quota} bytes.`);

        });
}

const taskStorageEstimate = function(){
    return new Promise((resolve, reject) => {
        if (navigator.storage && navigator.storage.estimate && $ && $('#header-fixed-msg')) {
        navigator.storage.estimate()
        .then((estimate) => {

            let mSize = (estimate.quota/(1024*1024)).toFixed(2);
            let uSize = (estimate.usage/(1024*1024)).toFixed(2);
            if (estimate.usage < 1024) {
                uSize = estimate.usage.toFixed(2);
                uSize = uSize + ' bytes';
            } else if (estimate.usage < (1024*1024)) {
                uSize = (estimate.usage/1024).toFixed(2);
                uSize = uSize + ' kbytes';
            }
            else {
                uSize = uSize + ' mbytes';
            }
            let msg = `Using ${uSize} out of ${mSize} Mbytes.`;
            $('#header-fixed-msg').empty().append(msg);
            console.log(msg);
            resolve('success');

        })
        .catch((e) => {
            reject('failure');
        });
        } else {
            resolve('success');
        }
    });
};

const taskResolution = (period) => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        taskStorageEstimate()
          .then((data) => {
            if (data === 'failure') {
                clearInterval(interval);
                reject(Error('fail'));
            } else if (data === 'success') {
                resolve('complete')
            }
         });
      }, period);
    });
  };

  taskResolution(10000);

// Referencias de jQuery
var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('.post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

// El usuario, contiene el ID del héroe seleccionado
var usuario;

// ===== Codigo de la aplicación
function crearMensajeHTML(mensaje, personaje) {
    var content =`
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();
}

// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.empty().append('<i class="fa fa-user"></i>&nbsp;Seleccione Personaje<p id="header-fixed-msg" class="notification-msg"></p>');
    }
}

// Seleccion de personaje
avatarBtns.on('click', function() {
    usuario = $(this).data('user');
    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});

// Boton de cancelar mensaje
cancelarBtn.on('click', function() {
   modal.animate({ 
       marginTop: '+=1000px',
       opacity: 0
    }, 200, function() {
        modal.addClass('oculto');
        txtMensaje.val('');
    });
});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    crearMensajeHTML( mensaje, usuario );

});