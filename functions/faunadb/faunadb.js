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

  type Mutation {
    addTodo(title:String):todo
  }

`;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

const resolvers = {
  
  Query: {
    todos:async (parent,args,context)=>{     
      try{
        
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
  },
  Mutation:{
    addTodo:async (_,{title})=>{
      const item = {
        data:{title:title}
      }
      console.log("title",item)
      /* construct the fauna query */
      try{
        const result=await client.query(query.Create(query.Collection('todos'), item))
        console.log("result",result);

        return {
          title:result.data.title,
          id:result.ref.id
        }
      }
      catch(error){
        console.log("Error",error);
        return {
          title:"error",
          id:"1"
        }
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