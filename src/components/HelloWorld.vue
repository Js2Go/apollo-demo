<template>
  <input type="file" @change="handleChange" name="" id="">
  <ul v-for="book in books">
    <li>{{ book.author }}-{{ book.title }}</li>
  </ul>
</template>

<script lang="ts">
import { useQuery, useMutation, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const data = ref<FormData>(new FormData())
    const { result } = useQuery(gql`
      query books {
        books {
          author
          title
        }
      }
    `)

    const books = useResult(result, [], (data: { books: Array<any> }) => data.books)

    const { mutate } = useMutation(gql`
      mutation mu($file: Upload!) {
        singleUpload(file: $file) {
          filename
        }
      }
    `)

    const handleChange = (e: Event) => {
      const file = (e.currentTarget as HTMLInputElement).files![0]
      mutate({
        file
      })
    }

    return {
      books,
      handleChange
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
