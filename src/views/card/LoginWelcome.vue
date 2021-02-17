<template>
  <el-card class="box-card" shadow="never">
    <div slot="header">
      <span>💐 发帖</span>
    </div>

    <div v-if="token != null && token !== ''" class="has-text-centered">
      <b-button type="is-danger" tag="router-link" :to="{path:'/post/create'}" outlined>✍ 发表想法</b-button>
    </div>

    <div v-else class="has-text-centered">
      <b-button type="is-primary" tag="router-link" :to="{path:'/register'}" outlined>马上入驻</b-button>
      <b-button type="is-danger" tag="router-link" :to="{path:'/login'}" outlined class="ml-2"> 社区登入</b-button>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LoginWelcome',
  computed: {
    //...是es6语法，这里写之前在vuex存储的，要获取的数据
    //这样获取之后，就有了一个名为token的数据，可以直接使用
    ...mapGetters([
      'token'
    ])
  }
}
</script>

<style scoped>
</style>