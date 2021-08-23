<template>
  <input type="file" @change="handleChange" name="" id="">
  <div>{{ me?.id }} - {{ me?.name }}</div>
  <!-- <ul v-for="book in books">
    <li>{{ book.author }}-{{ book.title }}</li>
  </ul> -->
  <input type="text" v-model="user.username" name="">
  <input type="password" v-model="user.password" name="">
  <button @click="login">login</button>
  <button @click="toFetch">toFetch</button>
  <button @click="createPost">createPost</button>
</template>

<script lang="ts">
import { useQuery, useMutation, useResult, useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineComponent, reactive, ref, watch } from 'vue'

interface UserForm {
  username: string
  password: string
}

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
    const user = reactive<UserForm>({
      username: '',
      password: ''
    })

    const enabled = ref<boolean>(false)
  
    const { result, refetch, subscribeToMore } = useQuery<IData>(gql`
      query me {
        me {
          id
          name
        }
      }
    `, null, () => ({
      enabled: enabled.value
    }))

    const me = useResult(result)

    const uploadMutate = useMutation(gql`
      mutation mu($file: Upload!) {
        singleUpload(file: $file) {
          filename
        }
      }
    `)

    const loginMutate = useMutation(gql`
      mutation login($user: UserInput!) {
        login(user: $user) {
          username
          token
        }
      }
    `)
    
    const createPostMutate = useMutation(gql`
      mutation m($comment: String, $author: String) {
        createPost(comment: $comment, author: $author) {
          author
          comment
        }
      }
    `)

    const handleChange = (e: Event) => {
      const file = (e.currentTarget as HTMLInputElement).files![0]
      uploadMutate.mutate({
        file
      })
    }

    const login = async () => {
      const data = await loginMutate.mutate({
        user
      })
      localStorage.setItem(data?.data.login.username, data?.data.login.token)
      toFetch()
    }

    const toFetch = async () => {
      enabled.value = true
      await createPost()
      await refetch()

      // subscribe query
      // subscribeToMore(() => ({
      //   document: gql`
      //     subscription s {
      //       postCreated {
      //         author
      //         comment
      //       }
      //     }
      //   `,
      //   updateQuery: (previousResult: any, { subscriptionData }: any) => {
      //     console.log(previousResult, subscriptionData)
      //     // previousResult.messages.push(subscriptionData.data.messageAdded)
      //     return previousResult
      //   }
      // }))
    }

    const sub = useSubscription(gql`
      subscription s {
        postCreated {
          author
          comment
        }
      }
    `)

    watch(sub.result, (res) => {
      console.log(res)
    }, {
      immediate: false
    })

    const createPost = async () => {
      await createPostMutate.mutate({
        comment: 'mazi created',
        author: 'mazi'
      })
    }

    return {
      me,
      user,
      handleChange,
      login,
      toFetch,
      createPost
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
