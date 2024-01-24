<template>
  <div class="screen">
    <Teleport to="body">
      <AddProductModal
        :item="itemDetail"
        :isShow="isShowModal"
        @cancel="isShowModal = false"
        @addCart="addToCart, $emit('numberItem')"
      ></AddProductModal>
      <Loading :isLoading="isLoading"></Loading>
      <Toast :message="message" :isShow="isShowToast" :type="type"></Toast>
    </Teleport>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    />
    <div class="navbar">
      <p @click="goToHomePage()">VEGETABLES</p>
      <i id="myCart" class="fas fa-cart-plus" @click="goToCartPage()"></i>
    </div>
    <div class="banner">
      <p>Product Detail</p>
    </div>
    <div class="product">
      <div class="image">
        <img :src="product.image" alt="Product image" />
      </div>
      <div class="description">
        <h3>{{ product.name }}</h3>
        <p id="price">${{ product.price }}.00</p>
        <p id="description">Description: {{ product.description }}</p>
        <p>{{ product.amount }}kg available</p>

        <div class="add-to-cart" @click="showModal(product)">
          <p>Add to cart</p>
        </div>
      </div>
    </div>
    <div class="related">
      <p>Related Products</p>
      <div class="relatedProducts">
        <div class="item" v-for="(item, index) in relatedProducts" :key="index">
          <img :src="item.image" alt="Product image" @click="goToDetailPage(item)" />
          <h3 id="name">{{ item.name }}</h3>
          <p id="price">${{ item.price }}</p>
          <i id="iconCart" class="fas fa-cart-plus" @click="showModal(item)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import db from '@/components/firebase/firebase'
import router from '@/router'

import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { AddProductModal, Loading, Toast } from '@/components/component'
import { collection, doc, getDocs, query, where, limit, updateDoc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

type productModel = {
  id: string
  amount: number
  description: string
  name: string
  price: number
  image: string
  category: string
}

//VARIABLE
const route = useRoute()
const product = ref<productModel>({
  id: '',
  amount: 0,
  description: '',
  name: '',
  price: 0,
  image: '',
  category: ''
})
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
const relatedProducts = ref<productModel[]>([])
const message = ref<string>('')
const isShowToast = ref<boolean>(false)
const type = ref<string>()
const isShowModal = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const currentUser = ref<string>()
const isItemExist = ref<boolean>(false)
const authStore = useAuthStore()

//FUNCTION
onBeforeMount(async () => {
  let id = route.query.id
  const querySnapshot = await getDocs(query(collection(db, 'products'), where('id', '==', id)))

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

    product.value = data
  })
  relatedProducts.value = await getRelatedProduct()
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
  currentUser.value = authStore.getCurrentUser
  if (currentUser.value === 'no user') {
    router.push({ name: 'shoppingLogin' })
  } else {
    itemDetail.value = item
    isShowModal.value = true
  }
}

const getRelatedProduct = async () => {
  let listRelatedProduct = ref<productModel[]>([])
  const querySnapshot = await getDocs(query(collection(db, 'products'), limit(4)))

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

    listRelatedProduct.value.push(data.value)
  })

  return listRelatedProduct.value
}

const goToDetailPage = (item: productModel) => {
  product.value = item
}

const goToHomePage = () => {
  router.push({ name: 'shoppingHome' })
}

const goToCartPage = () => {
  currentUser.value = authStore.getCurrentUser
  if (authStore.currentUser === 'no user') {
    router.push({ name: 'shoppingLogin' })
  } else {
    router.push({ name: 'shoppingCart' })
  }
}

const addToCart = async () => {
  try {
    isShowModal.value = false
    isLoading.value = true

    await getMyCart().then(async () => {
      for (let i = 0; i < myCart.value.length; i++) {
        if (myCart.value[i].id === itemDetail.value.id) {
          myCart.value[i].amount += 5
          isItemExist.value = true
          break
        } else {
          isItemExist.value = false
        }
      }
      if (isItemExist.value === false) {
        myCart.value.push({
          id: itemDetail.value.id,
          amount: 5,
          productName: itemDetail.value.name,
          price: itemDetail.value.price,
          image: itemDetail.value.image
        })
      }
      await updateDoc(doc(db, 'cart', 'PQOj2DIgq8GZiPGJzART'), {
        products: myCart.value
      })
      isLoading.value = false
      showToast('success', 'Add to cart successfully')
    })
  } catch (error) {
    console.log(error)
    showToast('error', 'Add to cart failed')
  }
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
