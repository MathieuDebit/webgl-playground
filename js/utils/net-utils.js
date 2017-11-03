const NetUtils = {
  
    /**
     * Loads a json file
     *
     * @param url
     * @returns {Promise}
     */
    loadJson( url, shouldTryFromCache ) {
  
      let cache = ( shouldTryFromCache ) ? '' : '?' + Math.random()
      url += cache
  
      url += extension
  
      const headers = new Headers({ 'Content-Type': 'application/json' })
      const request = new Request( url, { headers: headers } )
  
      return fetch(request)
        .then( function(response) { return response.text() } )
        .catch( function( error ) { console.error( error ) } )
  
    },
  
    /**
     * Loads a text file
     *
     * @param url
     * @returns {Promise}
     */
    loadText( url, shouldTryFromCache = false ) {
  
      let cache = ( shouldTryFromCache ) ? '' : '?' + Math.random()
      url += cache
  
      const headers = new Headers({ 'Content-Type': 'text/plain' })
      const request = new Request( url, { headers: headers } )
  
      return fetch(request)
        .then( function(response) { return response.text() } )
        .catch( function( error ) { console.error( error ) } )
  
    },
  
    /**
     * Loads an image
     *
     * @param url
     * @returns {Promise}
     */
    loadImage( url ) {
  
      return new Promise( function( resolve, reject ){
  
        const image = new Image()
  
        image.onload = function() {
          resolve( image )
        };
        image.onerror = function() {
          console.error('[NetUtils] coundnt load image', url)
          reject('[NetUtils] coudnt load image')
        };
  
        image.src = url
  
      } )
  
    }
  
  };

  export default NetUtils
