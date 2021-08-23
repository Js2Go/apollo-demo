import { createApp } from 'vue'
import { ApolloClient, InMemoryCache, split } from '@apollo/client/core'
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createUploadLink } from 'apollo-upload-client'
import { sha256 } from 'crypto-hash'
import ElementPlus from 'element-plus'

import 'element-plus/lib/theme-chalk/index.css'

import App from './App.vue'

const linkChain = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true
}).concat(createUploadLink({
  uri: 'http://localhost:8899/graphql',
  headers: {
    authorization: localStorage.getItem('mazi')!
  }
}) as any)

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8899/graphql',
  options: {
    reconnect: true
  }
})

const cache = new InMemoryCache()

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  linkChain
)

const apolloClient = new ApolloClient({
  link,
  cache,
})

const app = createApp(App)
app.use(ElementPlus)
app.provide(DefaultApolloClient, apolloClient)
app.mount('#app')
