var XMLHttpRequest

// eslint-disable-next-line
function queryGraph (query, variables) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.responseType = 'json'
    xhr.open('POST', '/graphql')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.onload = function () {
      resolve(xhr.response)
    }
    xhr.onerror = function (err) {
      reject(err)
    }

    xhr.send(JSON.stringify({
      query,
      variables
    }))
  })
}

// eslint-disable-next-line
function raiseOnEnter (event, action) {
  if (event.keyCode === 13) {
    action()
    return false
  }
}
