const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

app.use(bodyParser.json());

app.use('/graphql',graphqlHttp({
    schema:buildSchema(`
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
    rootValue:{
        events: () =>{
            return events;
        },
        createEvent:(args) => {
         const event = {
            _id:Math.random().toString(),
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date().toISOString()
         }
         events.push(event);
         return event;
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

app.get('/',(req,res,next)=>{
res.send('Hello World!');
});

app.listen(3000);