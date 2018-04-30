'use strict'
require('dotenv').config()

const express = require('express')
const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose')

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

mongoose.connect(process.env.MONGO_DB_CONNECTION)

server.start(
  {
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground'
  },
  () => console.log(`Server is running on http://localhost:4000`)
)
