
const express = require("express")
const {ApolloServer, gql} = require("apollo-server-express")
const {importSchema} = require('graphql-import')
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const resolvers = require('./resolvers')

const serviceAccount = require('./fiapbancographql-18368-firebase-adminsdk-kk1ha-0c90bdb082.json')

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://fiapbancographql-18368-default-rtdb.firebaseio.com/"
})

const app = express()

const server = new ApolloServer({
    typeDefs: importSchema('./schema/index.graphql'),
    resolvers: resolvers
})

server.applyMiddleware({app,path:"/",cors:true})

exports.graphql = functions.https.onRequest(app)


//const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
