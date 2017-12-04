const NetUtils = {
    loadData(url, shouldTryFromCache = false) {
      const contentType = 'text/plain'

      if (url.endsWith('.json')) {
        contentType = 'application/json'
      }

      const cache = (shouldTryFromCache) ? '' : `?${Math.random()}`
      url += cache

      const headers = new Headers({ 'Content-Type': contentType })
      const request = new Request(url, { headers: headers })

      return fetch(request)
        .then(response => response.text())
        .catch(error => console.error(`[NetUtils] Load data error: ${error}`))
    },

    loadImage(url) {
      return new Promise((resolve, reject) => {
        const image = new Image()

        image.onload = () => resolve(image)

        image.onerror = () => {
          console.error('[NetUtils] couldn\'t load image', url)
          reject('[NetUtils] couldn\'t load image')
        }

        image.src = url

      })
    }
  }

  export default NetUtils
