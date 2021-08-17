import { createApp } from 'vue'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createUploadLink } from 'apollo-upload-client'
import ElementPlus from 'element-plus'

import 'element-plus/lib/theme-chalk/index.css'

import App from './App.vue'

const httpLink: any = createUploadLink({
  uri: 'http://localhost:8899/graphql',
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

const app = createApp(App)
app.use(ElementPlus)
app.provide(DefaultApolloClient, apolloClient)
app.mount('#app')
