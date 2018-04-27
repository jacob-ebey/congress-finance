var vis
var queryGraph

function formatCurrency (value) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}

var candidatesByState = `
  query CandidateByState($stateCode: String!) {
    candidates(stateCode: $stateCode) {
      cid
      firstlast
      summary {
        total
      }
      industries {
        industry_code
        industry_name
        total
      }
    }
  }
`

var stateInput = document.getElementById('state-input')
var progress = document.getElementById('progress')
var container = document.getElementById('visualization')

var options = {
  autoResize: true,
  nodes: {
    borderWidth: 1
  },
  edges: {
    width: 2
  },
  physics: {
    forceAtlas2Based: {
      springLength: 100
    },
    minVelocity: 0.75,
    solver: 'forceAtlas2Based'
  },
  configure: {
    enabled: false
  }
}

var nodes = new vis.DataSet([])
var edges = new vis.DataSet([])

var network = new vis.Network(container, { nodes, edges }, options)

network.on('selectNode', function (params) {
  var id = params.nodes[0]
  var connectedIds = network.getConnectedNodes(id)

  nodes.forEach((node) => {
    if (node.id !== id && connectedIds.every((i) => node.id !== i)) {
      node.hidden = true
    } else {
      node.hidden = false
    }

    nodes.update(node)
  })
})

network.on('deselectNode', function (params) {
  nodes.forEach((node) => {
    node.hidden = false

    nodes.update(node)
  })
})

var loadingCount = 0

// eslint-disable-next-line no-unused-vars
function loadState () {
  var stateCode = stateInput.value

  if (!stateCode) {
    return
  }

  loadingCount++
  progress.style.visibility = 'visible'
  queryGraph(candidatesByState, { stateCode })
    .then(function (result) {
      result.data.candidates.forEach(function (candidate) {
        nodes.add({
          group: 0,
          id: candidate.cid,
          label: `${candidate.firstlast}\n${formatCurrency(candidate.summary.total)}`,
          size: 20
        })

        candidate.industries.forEach(function (industry) {
          if (!nodes.get(industry.industry_code)) {
            nodes.add({
              shape: 'dot',
              group: 1,
              id: industry.industry_code,
              label: industry.industry_name,
              size: 10
            })
          }

          edges.add({ from: industry.industry_code, to: candidate.cid, label: formatCurrency(industry.total) })
        })
      })
    })
    .catch(function (err) {
      console.error(err)
    })
    .then(function () {
      if (--loadingCount === 0) {
        progress.style.visibility = 'hidden'
      }
    })
}
