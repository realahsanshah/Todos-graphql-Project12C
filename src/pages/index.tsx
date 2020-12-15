import * as React from "react"
import {useQuery} from '@apollo/client';
import gql from 'graphql-tag'


const APOLLO_QUERY=gql`
  {
    name
  }
`


const IndexPage = () => {
  const {loading,error,data}=useQuery(APOLLO_QUERY);
  
  return (
    <main>
      <title>Home Page</title>
      <h1>Todos</h1>
      {loading && <p>Loading Client Side Querry...</p>}
      {data &&<p>{data.name}</p>}
    </main>
  )
}

export default IndexPage
