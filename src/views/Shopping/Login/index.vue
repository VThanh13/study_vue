<template>
  <Teleport to="body">
    <Loading :isLoading="isLoading"></Loading>
    <Toast :message="message" :isShow="isShowToast" :type="type"></Toast>
  </Teleport>
  <div class="screen">
    <div
      class="form"
      :style="{
        height: isRegister ? '75%' : '60%'
      }"
    >
      <h1 v-if="isRegister">Register</h1>
      <h1 v-else>Login</h1>
      <form v-on:submit.prevent="authUser">
        <p v-if="isRegister">
          Name
          <input type="text" required placeholder="Enter your name.." v-model="name" />
        </p>
        <p>
          Email
          <input type="text" required placeholder=" Enter your email.." v-model="email" />
        </p>
        <p>
          Password
          <input type="password" required placeholder=" Enter your password.." v-model="password" />
        </p>
        <button type="submit" v-if="isRegister">Register</button>
        <button type="submit" v-else>Login</button>
        <div class="type" v-if="!isRegister">
          <p>Don't have an account?</p>
          <p @click="changeType()">Register</p>
        </div>
        <div class="type" v-else>
          <p>Already have an account?</p>
          <p @click="changeType()">Login</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import db from '@/components/firebase/firebase'
import router from '@/router'

import { ref, Teleport } from 'vue'
import { auth } from '@/components/firebase/firebase'
import { useAuthStore } from '@/stores/auth'
import { Loading, Toast } from '@/components/component'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

//VARIABLE
type User = {
  name: string
  email: string
  password: string
  id?: string
}

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const isRegister = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const message = ref<string>('')
const isShowToast = ref<boolean>(false)
const type = ref<string>()
const authStore = useAuthStore()

//FUNCTION
const showToast = (typeToast: string, messageToast: string) => {
  type.value = typeToast
  message.value = messageToast
  isShowToast.value = true
  setTimeout(() => {
    isShowToast.value = false
  }, 2000)
}

const authUser = () => {
  let user: User = {
    name: name.value,
    email: email.value,
    password: password.value
  }
  try {
    isLoading.value = true

    if (isRegister.value) {
      registerUser(user)
      isRegister.value = false
    } else {
      loginUser(user)
    }
    isLoading.value = false
  } catch (error) {
    console.log(error)
  }

  name.value = ''
  email.value = ''
  password.value = ''
}

const changeType = () => {
  isRegister.value = !isRegister.value
}

const registerUser = async (user: User) => {
  const listEmail = await getAllEmail()
  if (listEmail.includes(user.email)) {
    showToast('warning', 'Email already exists')
    return
  }
  try {
    await createUserWithEmailAndPassword(auth, user.email, user.password).then(
      async (userCredential) => {
        const userId = userCredential.user.uid
        //Add user to database
        await setDoc(doc(db, 'user', userId), {
          name: user.name,
          email: user.email,
          password: user.password,
          id: userId
        }).then(() => {
          showToast('success', 'Register user successfully')
        })
      }
    )
  } catch (error) {
    console.log(error)
    showToast('error', 'Register user failed')
  }
}

const loginUser = async (user: User) => {
  try {
    await signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        const userId = userCredential.user.uid
        authStore.setCurrentUser(userId)
      })
      .then(() => {
        router.replace('/shopping/home')
        showToast('success', 'Login successfully')
      })
  } catch (error) {
    console.log(error)
    showToast('error', 'Login failed')
  }
}

const getAllEmail = async () => {
  const listEmail: string[] = []
  const querySnapshot = await getDocs(collection(db, 'user'))
  querySnapshot.forEach((doc) => {
    listEmail.push(doc.data().email)
  })
  return listEmail
}
</script>

<style scoped lang="scss">
@import './styles.scss';
</style>
