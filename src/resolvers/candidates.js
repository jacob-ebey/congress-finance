'use strict'

const querystring = require('querystring')
const fetch = require('node-fetch')
const cache = require('memory-cache')

const tools = require('./tools')

const baseUrl = `https://www.opensecrets.org/api/?apikey=${process.env.OPENSECRETS_KEY}&output=xml`
const cacheExp = 1000 * 60 * 60 * 6

function getCandSummary (params) {
  const cacheId = `candSummary[${params.cid}]`
  const cached = cache.get(cacheId)
  if (cached) {
    return cached
  }

  const urlParams = querystring.stringify({
    method: 'candSummary',
    cycle: params.cycle,
    cid: params.cid
  })

  return fetch(`${baseUrl}&${urlParams}`)
    .then((res) => res.text())
    .then((text) => tools.parseXml(text))
    .then((result) => {
      const res = result.response.summary[0]['$']
      cache.put(cacheId, res, cacheExp)
      return res
    })
}

function getCandContrib (params) {
  const cacheId = `candContrib[${params.cid}]`
  const cached = cache.get(cacheId)
  if (cached) {
    return cached
  }

  const urlParams = querystring.stringify({
    method: 'candContrib',
    cid: params.cid,
    cycle: params.cycle
  })

  return fetch(`${baseUrl}&${urlParams}`)
    .then((res) => res.text())
    .then((text) => tools.parseXml(text))
    .then((result) => {
      const res = result.response.contributors.map((r) => r['contributor'])[0].map((r) => r['$'])
      cache.put(cacheId, res, cacheExp)
      return res
    })
}

function getCandIndustry (params) {
  const cacheId = `candIndustry[${params.cid}]`
  const cached = cache.get(cacheId)
  if (cached) {
    return cached
  }

  const urlParams = querystring.stringify({
    method: 'candIndustry',
    cid: params.cid,
    cycle: params.cycle
  })

  return fetch(`${baseUrl}&${urlParams}`)
    .then((res) => res.text())
    .then((text) => tools.parseXml(text))
    .then((result) => {
      const res = result.response.industries[0].industry.map((r) => r['$'])
      cache.put(cacheId, res, cacheExp)
      return res
    })
}

module.exports = {
  Query: {
    candidates: (_, { cycle, stateCode }) => {
      const cacheId = `candidates[${stateCode}]`
      const cached = cache.get(cacheId)
      if (cached) {
        return cached
      }

      const urlParams = querystring.stringify({
        method: 'getLegislators',
        id: stateCode
      })

      return fetch(`${baseUrl}&${urlParams}`)
        .then((res) => res.text())
        .then((text) => tools.parseXml(text))
        .then((result) => {
          const res = result.response.legislator.map((r) => r['$'])
          cache.put(cacheId, res, cacheExp)
          return res
        })
    },

    candidateSummary: (_, params) => {
      return getCandSummary(params)
    },

    candContrib: (_, params) => {
      return getCandContrib(params)
    },

    candIndustry: (_, params) => {
      return getCandIndustry(params)
    }
  },

  Candidate: {
    summary: (parent, _) => {
      return getCandSummary(parent)
    },

    contributions: (parent, _) => {
      return getCandContrib(parent)
    },

    industries: (parent, _) => {
      return getCandIndustry(parent)
    }
  }
}
