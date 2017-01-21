// Registering ServiceWorker
if ( 'serviceWorker' in navigator ) {
  navigator.serviceWorker.register( 'sw.js' ).then(function(registration) {
  }).catch(function(err) {

    // Registration failed with error
    console.log( 'ServiceWorker registration failed. Error: ' + err);
  });
}