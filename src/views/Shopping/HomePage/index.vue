<template>
  <Teleport to="body">
    <AddProductModal
      :item="itemDetail"
      :isShow="isShowModal"
      @cancel="isShowModal = false"
      @addCart="addToCart"
    ></AddProductModal>
  </Teleport>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <div id="home">
    <div class="selections">
      <p>Vegetables</p>
      <ul class="product-category">
        <p @click="getAllProduct()">All</p>
        <p @click="sortProducts('vegetable')">Vegetables</p>
        <p @click="sortProducts('fruits')">Fruits</p>
        <p @click="sortProducts('juice')">Juice</p>
        <p @click="sortProducts('dried')">Dried</p>
        <i id="myCart" class="fas fa-cart-plus" @click="goToCart()"></i>
      </ul>
    </div>
    <div class="banner">
      <img src="/src/assets/images/shopping/bg_1.jpg" alt="product image" />
    </div>

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
import { ref, onBeforeMount } from 'vue'
import db from '@/components/firebase/firebase'
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  where,
  updateDoc,
  limit
} from 'firebase/firestore'
import { AddProductModal } from '@/components/modal/modal'

const products = ref()
const typeSort = ref()
const isShowModal = ref(false)
const amount = ref()
const itemDetail = ref()
const myCart = ref()

const showModal = (item: object) => {
  itemDetail.value = item
  isShowModal.value = true
}

onBeforeMount(async () => {
  await getAllProduct()
})

const goToDetailPage = (id: string) => {
  router.push({ name: 'shoppingDetail', query: { id: id } })
}

const goToCart = () => {
  router.push({ name: 'shoppingCart' })
}

const addToCart = async () => {
  isShowModal.value = false

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
}

const getAllProduct = async () => {
  products.value = []
  typeSort.value = 'ALL PRODUCTS'
  const querySnapshot = await getDocs(collection(db, 'products'))
  querySnapshot.forEach((doc) => {
    const data = {
      id: doc.data().id,
      amount: doc.data().amount,
      description: doc.data().description,
      image: doc.data().image,
      name: doc.data().name,
      price: doc.data().price,
      category: doc.data().category
    }
    products.value.push(data)
  })
}

const sortProducts = async (type: string) => {
  products.value = []
  typeSort.value = type.toUpperCase()

  const querySnapshot = await getDocs(
    query(collection(db, 'products'), where('category', '==', type))
  )
  querySnapshot.forEach((doc) => {
    const data = {
      id: doc.data().id,
      amount: doc.data().amount,
      description: doc.data().description,
      image: doc.data().image,
      name: doc.data().name,
      price: doc.data().price,
      category: doc.data().category
    }
    products.value.push(data)
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
