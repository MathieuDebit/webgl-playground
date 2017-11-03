const NetUtils = {
    loadJson(url, shouldTryFromCache = false) {
      const cache = (shouldTryFromCache) ? '' : `?${Math.random()}`
      url += cache

      const headers = new Headers({ 'Content-Type': 'application/json' })
      const request = new Request(url, { headers: headers })

      return fetch(request)
        .then(response => response.text())
        .catch(error => console.error('[NetUtils] Load Json error:', error))
    },

    loadText(url, shouldTryFromCache = false) {
      const cache = (shouldTryFromCache) ? '' : `?${Math.random()}`
      url += cache

      const headers = new Headers({ 'Content-Type': 'text/plain' })
      const request = new Request(url, { headers: headers })

      return fetch(request)
        .then(response => response.text())
        .catch(error => console.error('[NetUtils] Load Text error:', error))
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
