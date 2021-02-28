<template>
  <section class="box comments">
    <hr />
    <h3 class="title is-5">Comments</h3>
    <lv-comments-form :slug="slug" v-if="token" @loadComments="fetchComments"/>

    <lv-comments-item
        v-for="comment in comments"
        :key="`comment-${comment.id}`"
        :comment="comment"
        @updateComments="fetchComments"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchCommentsByTopicId } from '@/api/comment'
import LvCommentsItem from './CommentsItem'
import LvCommentsForm from './CommentsForm'
export default {
  name: 'LvComments',
  components: {
    LvCommentsItem,
    LvCommentsForm
  },
  data() {
    return {
      comments: []
    }
  },
  props: {
    //帖子id
    slug: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  async mounted() {
    await this.fetchComments(this.slug)
  },
  methods: {
    // 初始化
    async fetchComments(topic_id) {
      fetchCommentsByTopicId(topic_id).then(response => {
        const { data } = response
        this.comments = data
      })
    }
  }
}
</script>