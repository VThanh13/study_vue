<template>
  <Teleport to="body">
    <Loading :isLoading="isLoading"></Loading>

    <AddProductModal
      :item="itemDetail"
      :isShow="isShowModal"
      @cancel="isShowModal = false"
      @addCart="addToCart"
    ></AddProductModal>
    <Toast :message="message" :isShow="isShowToast" :type="type"></Toast>
  </Teleport>

  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />

  <div id="home">
    <div class="navbar">
      <p>VEGETABLES</p>
      <i id="myCart" class="fas fa-cart-plus" @click="goToCart()"></i>
    </div>
    <div class="banner">
      <img src="/src/assets/images/shopping/bg_1.jpg" alt="product image" />
    </div>
    <ul class="product-category">
      <p @click="getAllProduct()">All</p>
      <p @click="sortProducts('vegetable')">Vegetables</p>
      <p @click="sortProducts('fruits')">Fruits</p>
      <p @click="sortProducts('juice')">Juice</p>
      <p @click="sortProducts('dried')">Dried</p>
    </ul>

    <p id="sortType">{{ typeSort }}</p>

    <div class="products">
      <div class="item" v-for="(product, index) in products" :key="index">
        <img :src="product.image" alt="Product image" @click="goToDetailPage(product.id)" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }}$</p>
        <i id="iconCart" class="fas fa-cart-plus" @click="showModal(product)"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import db from '@/components/firebase/firebase'

import { ref, onBeforeMount } from 'vue'
import { collection, doc, getDocs, query, where, updateDoc } from 'firebase/firestore'
import { Loading, AddProductModal, Toast } from '@/components/component'
import { useAuthStore } from '@/stores/auth'

//VARIABLE
type productModel = {
  id: string
  amount: number
  description: string
  name: string
  price: number
  image: string
  category: string
}

const products = ref<productModel[]>([])
const typeSort = ref<string>()
const isShowModal = ref(false)
const isLoading = ref(false)
const itemDetail = ref<productModel>({
  id: '',
  amount: 0,
  description: '',
  name: '',
  price: 0,
  image: '',
  category: ''
})
const myCart = ref()
const message = ref<string>('')
const isShowToast = ref<boolean>(false)
const type = ref<string>()
const currentUser = ref<string>()
const authStore = useAuthStore()

//FUNCTION
onBeforeMount(async () => {
  await getAllProduct()
})

const showToast = (typeToast: string, messageToast: string) => {
  type.value = typeToast
  message.value = messageToast
  isShowToast.value = true
  setTimeout(() => {
    isShowToast.value = false
  }, 2000)
}

const showModal = (item: productModel) => {
  itemDetail.value = item
  isShowModal.value = true
}

const goToDetailPage = (id: string) => {
  router.push({ name: 'shoppingDetail', query: { id: id } })
}

const goToCart = () => {
  currentUser.value = authStore.getCurrentUser
  if (currentUser.value === 'no user') {
    router.push({ name: 'shoppingLogin' })
  } else {
    router.push({ name: 'shoppingCart' })
  }
}

const addToCart = async () => {
  try {
    isShowModal.value = false
    isLoading.value = true

    await getMyCart()
    myCart.value.push({
      id: itemDetail.value.id,
      amount: 5,
      productName: itemDetail.value.name,
      price: itemDetail.value.price,
      image: itemDetail.value.image
    })
    console.log(myCart.value)
    await updateDoc(doc(db, 'cart', 'PQOj2DIgq8GZiPGJzART'), {
      products: myCart.value
    })
    isLoading.value = false

    showToast('success', 'Add to cart successfully')
  } catch (error) {
    console.log(error)
    showToast('error', 'Add to cart failed')
  }
}

const getAllProduct = async () => {
  products.value = []
  typeSort.value = 'ALL PRODUCTS'
  const querySnapshot = await getDocs(collection(db, 'products'))
  querySnapshot.forEach((doc) => {
    const data = ref<productModel>({
      id: doc.data().id,
      amount: doc.data().amount,
      description: doc.data().description,
      image: doc.data().image,
      name: doc.data().name,
      price: doc.data().price,
      category: doc.data().category
    })

    products.value.push(data.value)
  })
}

const sortProducts = async (type: string) => {
  products.value = []
  typeSort.value = type.toUpperCase()

  const querySnapshot = await getDocs(
    query(collection(db, 'products'), where('category', '==', type))
  )
  querySnapshot.forEach((doc) => {
    const data = ref<productModel>({
      id: doc.data().id,
      amount: doc.data().amount,
      description: doc.data().description,
      image: doc.data().image,
      name: doc.data().name,
      price: doc.data().price,
      category: doc.data().category
    })
    products.value.push(data.value)
  })
}

const getMyCart = async () => {
  myCart.value = []
  let listProduct: any[] = []
  const querySnapshot = await getDocs(query(collection(db, 'cart'), where('id', '==', '1')))
  querySnapshot.forEach((doc) => {
    const data = doc.data().products
    listProduct.push(data)
  })

  for (let i = 0; i < listProduct[0].length; i++) {
    let data = {
      id: listProduct[0][i].id,
      amount: listProduct[0][i].amount,
      productName: listProduct[0][i].productName,
      price: listProduct[0][i].price,
      image: listProduct[0][i].image
    }
    myCart.value.push(data)
  }
}
</script>

<style scoped lang="scss">
@import './styles.scss';
</style>
