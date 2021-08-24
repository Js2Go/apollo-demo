export const TOKEN_STR = 'TOKEN'

interface Token {
  token: string
  getToken: () => void
  setToken: (token: string) => void
  removeToken: () => void
}

const tokenUtil: Token = {
  token: '',
  getToken() {
    if (localStorage.getItem(TOKEN_STR) === null) {
      this.token = ''
    } else {
      this.token = localStorage.getItem(TOKEN_STR)!
    }
    return this.token
  },
  setToken(token) {
    localStorage.setItem(TOKEN_STR, token)
  },
  removeToken() {
    localStorage.removeItem(TOKEN_STR)
  }
}

export default tokenUtil
