import * as React from "react"
import {useQuery} from '@apollo/client';
import gql from 'graphql-tag'


const getTodos=gql`
  {
    todos
  }
`

const addTask=gql`
  mutation CreateATodo($title:String!) {
   addTodo(title:$title){
    title
  }
}
`

const deleteTask=gql`
  mutation DeleteATodo($id:String!) {
   deleteTodo(id:$id){
    title
  }
}
`


const IndexPage = () => {
  const {loading,error,data}=useQuery(getTodos);
  
  return (
    <main>
      <title>Home Page</title>
      <h1>Todos</h1>
    </main>
  )
}

export default IndexPage
