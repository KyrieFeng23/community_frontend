<template>
  <div>
    <div class="box">
      🛎 {{billboard.content}}
    </div>
    <div class="columns">
      <div class="column is-three-quarters">
        <TopicList>
        </TopicList>

      </div>
      <div class="column">
        <!--侧边栏-->
        <CardBar>

        </CardBar>
      </div>
    </div>
  </div>
</template>

<script>

import { getBillboard } from "@/api/billboard";
import CardBar from "@/views/card/CardBar";
import PostList from "@/views/post";

export default {
  name: 'Home',
  components:{
    CardBar,
    TopicList: PostList
  },

  data() {
    return {
        billboard:{
          content:''
        }
    }
  },
  created(){    //创建时调用
    this.fetchBillboard()
  },
  methods:{
    async fetchBillboard(){
      getBillboard().then((value)=>{
        const { data } = value
        this.billboard = data
        }
      )
    }
  }
}
</script>
 