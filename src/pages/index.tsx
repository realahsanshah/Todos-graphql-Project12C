import * as React from "react"
import {useQuery} from '@apollo/client';
import gql from 'graphql-tag'
import Todos from '../components/Todos';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';




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
const updateTask=gql`
mutation UpdateteATodo($id:String!,$title:String) {
   updateTodo(id:$id,title:$title){
    title
  }
}
`

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            textAlign:'center',
        },
        parent:{
          textAlign:'center'
        }
    }),
);


const IndexPage = () => {  
  const classes=useStyles();
  return (
    <div className={classes.parent}>
      <title>Todos</title>
      <h1>Todos</h1>
      {/* <AddTodo/> */}
      <Todos/>
  
    </div>
  )
}

export default IndexPage
