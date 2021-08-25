import { createApp } from 'vue'
import { ApolloClient, InMemoryCache, split } from '@apollo/client/core'
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createUploadLink } from 'apollo-upload-client'
import { sha256 } from 'crypto-hash'
import ElementPlus from 'element-plus'

import 'element-plus/lib/theme-chalk/index.css'

import App from './App.vue'
import tokenUtil, { TOKEN_STR } from './util/token'

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(TOKEN_STR)
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ``,
    },
  }
})

const getUri = (isWs: boolean = false): string => {
  let protocol = `${import.meta.env.VITE_SERVER_PROTOCOL}://`;

  if (isWs) {
    protocol = `${import.meta.env.VITE_WS_SERVER_PROTOCOL}://`
  }

  const uri = protocol +
    `${import.meta.env.VITE_SERVER_HOST}:` +
    `${import.meta.env.VITE_SERVER_PORT}` +
    `${import.meta.env.VITE_SERVER_PATH}`
  
  console.log(uri)

  return uri
}

const linkChain = authLink.concat(createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true
})).concat(createUploadLink({
  uri: getUri(),
}) as any)

let wsLink = new WebSocketLink({
  uri: getUri(true),
  options: {
    reconnect: true,
    connectionParams: () => ({
      authorization: tokenUtil.getToken()
    })
  },
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
