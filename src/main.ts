import { createApp } from 'vue'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'
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
}) as any)

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: linkChain,
  cache,
})

const app = createApp(App)
app.use(ElementPlus)
app.provide(DefaultApolloClient, apolloClient)
app.mount('#app')
