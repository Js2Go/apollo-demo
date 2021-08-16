import { createApp } from 'vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

import App from './App.vue'

const httpLink = createHttpLink({
  uri: 'http://localhost:8899/graphql',
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

const app = createApp(App)
app.provide(DefaultApolloClient, apolloClient)
app.mount('#app')
