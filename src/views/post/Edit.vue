<template>
  <section>
    <div class="columns">
      <div class="column is-full">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span><i class="fa fa fa-book"> 主题 / 更新主题</i></span>
          </div>
          <div>
            <el-form :model="ruleForm.topic" ref="ruleForm" :rules="rules" class="demo-topic">
              <el-form-item prop="title">
                <el-input
                    v-model="ruleForm.topic.title"
                    placeholder="输入新的主题名称"
                ></el-input>
              </el-form-item>

              <!--Markdown-->
              <div id="vditor"></div>

              <b-taginput
                  v-model="ruleForm.tags"
                  class="my-3"
                  maxlength="15"
                  maxtags="3"
                  ellipsis
                  placeholder="请输入主题标签，限制为 15 个字符和 3 个标签"
              />
              <el-form-item class="mt-3">
                <el-button type="primary" @click="handleUpdate('ruleForm')"
                >更新
                </el-button>
                <el-button @click="resetForm('topic')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script>
import {getTopic, update} from "@/api/post";
import Vditor from "vditor";
import "vditor/dist/index.css";
export default {
  name: "TopicEdit",
  components: {},
  data() {
    return {
      // topic: {},
      // tags: [],
      ruleForm: {
        // title: '', // 标题
        topic:{},
        tags: [], // 标签
        // content: '' // 内容
      },
      rules: {
        title: [
          { required: true, message: '请输入话题名称', trigger: 'blur' },
          {
            min: 1,
            max: 25,
            message: '长度在 1 到 25 个字符',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    this.fetchTopic();
  },
  methods: {
    renderMarkdown(md) {
      this.contentEditor = new Vditor("vditor", {
        height: 460,
        placeholder: "输入要更新的内容",
        preview: {
          hljs: { style: "monokai" },
        },
        mode: "sv",
        after: () => {
          this.contentEditor.setValue(md);
        },
      });
    },
    fetchTopic() {
      getTopic(this.$route.params.id).then((value) => {
        this.ruleForm.topic = value.data.topic;
        this.ruleForm.tags = value.data.tags.map(tag => tag.name);
        this.renderMarkdown(this.ruleForm.topic.content);
      });
    },
    handleUpdate(formName){

      //this.topic.content = this.contentEditor.getValue();

      //先进行一些校验
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
              this.contentEditor.getValue().length === 1 ||
              this.contentEditor.getValue() == null ||
              this.contentEditor.getValue() === ''
          ) {
            alert('话题内容不可为空')
            return false
          }
          if (this.ruleForm.tags == null || this.ruleForm.tags.length === 0) {
            alert('标签不可以为空')
            return false
          }
          this.ruleForm.topic.content = this.contentEditor.getValue()
          //调用update接口
          update(this.ruleForm).then((response) => {
            const { data } = response;
            console.log(data);
            setTimeout(() => {
              this.$router.push({
                name: "post-detail",
                params: { id: data.id },
              });
            }, 800);
          });
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.contentEditor.setValue("");
      this.tags = "";
    },
  },
};
</script>

<style>
.vditor-reset pre > code {
  font-size: 100%;
}
</style>