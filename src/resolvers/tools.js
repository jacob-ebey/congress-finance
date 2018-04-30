'use strict'

const fetch = require('node-fetch')
const xml2js = require('xml2js')

const Cache = require('../models/cache')

function parseXml (text) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(text, (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })
}

module.exports = {
  parseXml,

  cachedGet (url, format) {
    return new Promise((resolve, reject) => {
      Cache.findOne({ path: url }, (findErr, res) => {
        if (res) {
          return resolve(format(res.response))
        }

        fetch(url)
          .then((res) => res.text())
          .then((text) => parseXml(text))
          .then((json) => {
            const item = new Cache({
              path: url,
              response: json
            })

            item.save()

            return format(json)
          })
          .then((result) => {
            resolve(result)
          })
          .catch((err3) => {
            reject(err3)
          })
      })
    })
  }
}
