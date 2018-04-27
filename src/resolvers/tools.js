'use strict'

const xml2js = require('xml2js')

module.exports = {
  parseXml (text) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(text, (err, result) => {
        if (err) {
          reject(err)
        }

        resolve(result)
      })
    })
  }
}
