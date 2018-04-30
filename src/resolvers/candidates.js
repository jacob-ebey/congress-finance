'use strict'

const querystring = require('querystring')

const tools = require('./tools')

const baseUrl = `https://www.opensecrets.org/api/?apikey=${process.env.OPENSECRETS_KEY}&output=xml`

function getCandSummary (params) {
  const urlParams = querystring.stringify({
    method: 'candSummary',
    cycle: params.cycle,
    cid: params.cid
  })

  return tools.cachedGet(`${baseUrl}&${urlParams}`, (result) => {
    const res = result.response.summary[0]['$']
    return res
  })
}

function getCandContrib (params) {
  const urlParams = querystring.stringify({
    method: 'candContrib',
    cid: params.cid,
    cycle: params.cycle
  })

  return tools.cachedGet(`${baseUrl}&${urlParams}`, (result) => {
    return result.response.contributors.map((r) => r['contributor'])[0].map((r) => r['$'])
  })
}

function getCandIndustry (params) {
  const urlParams = querystring.stringify({
    method: 'candIndustry',
    cid: params.cid,
    cycle: params.cycle
  })

  return tools.cachedGet(`${baseUrl}&${urlParams}`, (result) => {
    const res = result.response.industries[0].industry.map((r) => r['$'])
    return res
  })
}

module.exports = {
  Query: {
    candidates: (_, { cycle, stateCode }) => {
      const urlParams = querystring.stringify({
        method: 'getLegislators',
        id: stateCode
      })

      return tools.cachedGet(`${baseUrl}&${urlParams}`, (result) => {
        const res = result.response.legislator.map((r) => r['$'])
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
