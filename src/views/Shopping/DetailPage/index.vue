<template>
  <div class="screen">
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
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

import db from '@/components/firebase/firebase'
import { AddProductModal } from '@/components/modal/modal'

import { collection, doc, getDocs, query, where, limit, updateDoc } from 'firebase/firestore'

const product = ref<any>({
  id: '',
  amount: 0,

  image: '',
  name: '',
  price: 0
})
const itemDetail = ref()

const myCart = ref()

const relatedProducts = ref()

const route = useRoute()
const isShowModal = ref(false)

const showModal = (item: object) => {
  itemDetail.value = item
  isShowModal.value = true
}

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

const getRelatedProduct = async () => {
  let listRelatedProduct: {
    id: any
    amount: any
    description: any
    image: any
    name: any
    price: any
    category: any
  }[] = []
  const querySnapshot = await getDocs(query(collection(db, 'products'), limit(4)))

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

    listRelatedProduct.push(data)
  })

  return listRelatedProduct
}

const goToDetailPage = (item: object) => {
  product.value = item
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
