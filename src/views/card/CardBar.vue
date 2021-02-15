<template>
  <section>
    <!--是否登录-->
    <login-welcome />
    <!--今日赠言-->
    <tip-card></tip-card>

    <!--资源推介-->
    <promotion-card></promotion-card>
  </section>
</template>

<script>

import TipCard from '@/views/card/Tip'
import PromotionCard from "@/views/card/Promotion";
import LoginWelcome from "@/views/card/LoginWelcome";
export default {
  name: 'CardBar',
  components:{
    LoginWelcome, PromotionCard, TipCard
  },
  data() {
    return {
    }
  },
  created(){    //创建时调用
  },
  methods:{

  }
}
</script>
