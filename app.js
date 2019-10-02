/**
 * jamal.khan@brotecs.com
 * bTl123085284
 * https://cloud.mongodb.com/user?signedOut=true
 * mutation{
  createUser(userInput:{email:"kamal@khan.com",password:"123123"}){
    email
    password
  }
}

 */
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
      schema: graphQlSchema,
      rootValue: graphQlResolvers,
      graphiql: true
    })
  );

app.get('/', (req, res, next) => {
    res.send('Hello World!');
});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-kupsy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() => {
    app.listen(3000);
    console.log('Connected');
}).catch(
    err => {
        console.log(err);
    }
);
