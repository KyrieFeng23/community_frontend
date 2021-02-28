<template>
  <article class="media">
    <figure class="media-left image is-48x48">
<!--      <img :src="`https://cn.gravatar.com/avatar/${comment.userId}?s=164&d=monsterid`">-->
      <img :src="`data:image/svg+xml;utf8,${generateImg(comment.userId)}`" style="border-radius: 5px;"/>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ comment.alias }}</strong>
          <small class="ml-2">{{ comment.createTime | date }}</small>
          <br />
          {{ comment.content }}
        </p>
      </div>
    </div>
    <div class="media-right" v-if="token && user.id === comment.userId">
      <a class="level-item">
              <span
                  class="tag"
                  @click="handleDelete(comment.id)"
              >删除</span>
      </a>
    </div>
  </article>
</template>

<script>
import {mapGetters} from "vuex";
import {deleteComment} from "@/api/comment";
import { generateFromString } from 'generate-avatar'

export default {
  name: 'LvCommentsItem',
  components: { generateFromString },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'token','user'
    ])
  },
  data() {
    return {
      flag: false,
      topic: {
        content: '',
        //请求路径里的id参数值
        id: this.$route.params.id
      },
      tags: [],
      topicUser: {}
    }
  },
  methods: {
    handleDelete(id) {
      deleteComment(id).then(value => {
        const { code, message } = value
        //alert(message)
        if (code === 200) {
          //通知父组件有删除评论，用来更新数据
          this.$emit('updateComments', this.comment.topicId)
          this.$message.success('删除成功')
        }
      })
    },
    generateImg(id){
      return generateFromString(id);
    }
  }
}
</script>