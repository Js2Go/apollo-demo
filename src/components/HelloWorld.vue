<template>
  <input type="file" @change="handleChange" name="" id="">
  <div>{{ me?.id }} - {{ me?.name }}</div>
  <!-- <ul v-for="book in books">
    <li>{{ book.author }}-{{ book.title }}</li>
  </ul> -->
</template>

<script lang="ts">
import { useQuery, useMutation, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineComponent } from 'vue'

interface IMe {
  id: number
  name: string
}

interface IData {
  me: IMe
}

export default defineComponent({
  name: 'App',
  setup() {
    const { result } = useQuery<IData>(gql`
      query me {
        me {
          id
          name
        }
      }
    `)

    const me = useResult(result)

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
      me,
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
