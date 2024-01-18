import { defineStore } from 'pinia'

interface IState {
  currentUser: string
}

const initState: IState = {
  currentUser: 'no user'
}

export const useAuthStore = defineStore('auth', {
  state: (): IState => {
    return { ...initState }
  },
  getters: {
    getCurrentUser: (state) => state.currentUser
  },
  actions: {
    setCurrentUser(currentUser: string) {
      this.currentUser = currentUser
    }
  }
})
