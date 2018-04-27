'use strict'
require('dotenv').config()

const express = require('express')
const { GraphQLServer } = require('graphql-yoga')

const candidates = require('./resolvers/candidates')

const resolvers = {
  ...candidates,
  Query: {
    ...candidates.Query
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  cacheControl: true
})

server.express.use(express.static('./src/public'))

server.start(
  {
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground'
  },
  () => console.log(`Server is running on http://localhost:4000`)
)
