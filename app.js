/**
 * jamal.khan@brotecs.com
 * bTl123085284
 * https://cloud.mongodb.com/user?signedOut=true
 */
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose')
const Event = require('./models/event');
const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
    type Event {
        _id:ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
        events: () => {
          return Event.find().then(events=>{
               return events.map(event=>{
                   return {...event._doc}
               });
           }).catch(err=> {
               throw err;
           });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event
            .save().then(resust => {
                //console.log(resust);
                //console.log(...resust._doc);
                var jamal = {...resust._doc};
                console.log(resust);
                return resust;

            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true
    /*     http://localhost:3000/graphq
    mutation{
            createEvent(eventInput:{title:"test titel",description:"Does it works is?",
              price:5.24,date:"2019-09-29T16:32:20.671Z"}){
              title
              description
            }
          } 
    ------------------
        query{
        events{
        _id
        description
      }
    }
          */
}));

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
