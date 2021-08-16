import { createApp } from 'vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

import App from './App.vue'

const httpLink = createHttpLink({
  uri: 'http://localhost:8899/graphql',
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

createApp(App).mount('#app')
