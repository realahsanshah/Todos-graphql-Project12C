const {ApolloServer,gql} = require('apollo-server-lambda');
const faunadb=require('faunadb')
const query=faunadb.query;


const typeDefs = gql`
  type Query {
    message: String
    name:String
    todos:[todo]
  }
  type todo {
    title:String
    id:String
  }
  type todos {
    todos:[todo]
  }

`;

const resolvers = {
  Query: {
    message: (parent, args, context) => {
      return "Hello, world from Zia!";
    },
    name: (parent, args, context) => {
      return "Ahsan Shah!";
    },
    todos:async (parent,args,context)=>{     
      try{
        const client = new faunadb.Client({
          secret: process.env.FAUNADB_SERVER_SECRET,
        });
        var result = await client.query(
          query.Map(
            query.Paginate(query.Documents(query.Collection("todos"))),
            query.Lambda(x => query.Get(x))
          )
        )
        const todos=result.data.map(todo=>({id:todo.ref.id,title:todo.data.title}))
        return todos;
      }
        catch(error) {
          console.log('error', error)
          // return "error.errorMessage"
        }
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