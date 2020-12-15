const {ApolloServer,gql} = require('apollo-server-lambda');
const faunadb=require('faunadb')
const query=faunadb.query;


const typeDefs = gql`
  type Query {
    message: String
    name:String
  }
`;

const resolvers = {
  Query: {
    message: (parent, args, context) => {
      return "Hello, world from Zia!";
    },
    name: (parent, args, context) => {
      return "Ahsan Shah!";
    }
  }
};

const server=new ApolloServer({
  typeDefs,
  resolvers,
  playground:true,
  introspection:true
});

exports.handler=server.createHandler();