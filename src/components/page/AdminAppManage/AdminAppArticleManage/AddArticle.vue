<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> app文章管理 </el-breadcrumb-item>
        <el-breadcrumb-item>添加文章</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container test-container">
      <div class="form-box" style="width: 90%">
        <el-form :rules="rules" ref="form" :model="articleForm" label-width="80px">
          <el-form-item label="文章标题" prop="articleTitle">
            <el-input clearable v-model="articleForm.articleTitle"></el-input>
          </el-form-item>
          <el-form-item label="文章标签" prop="articleTags">
            <el-input clearable v-model="articleForm.articleTags"></el-input>
          </el-form-item>
          <el-form-item label="文章摘要" prop="articleIntro">
            <el-input type="textarea" :rows="2" clearable v-model="articleForm.articleIntro"></el-input>
          </el-form-item>
          <el-form-item label="文章内容" prop="articleContent">
            <quill-editor v-model="articleForm.articleContent"></quill-editor>
          </el-form-item>
          <el-form-item prop="articleDate" label="文章日期">
            <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="articleForm.articleDate" style="width: 25%"></el-date-picker>
          </el-form-item>
          <el-form-item label="类型" prop="articleType">
            <el-radio-group v-model="articleForm.articleType">
              <el-radio label="1" value="1">
                <el-tag type="normal">文章</el-tag>
              </el-radio>
              <el-radio label="2" value="2">
                <el-tag type="warning">简介</el-tag>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传图片">
            <input type="file" name="avatar" id="file" accept="image/gif,image/jpeg,image/jpg,image/png" @change="changeImage($event)" class="file" />
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" @click="onSubmit">发布</el-button>
            <el-button size="medium" type="danger" @click="init">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { addAppArticle } from '@/api/AdminApp.js'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'AddArticle',
  components: {
    quillEditor,
  },
  data() {
    return {
      articleForm: {
        adminId: localStorage.getItem('ms_user_id'),
        articleTitle: '',
        articleIntro: '',
        articleTags: '',
        articleContent: '',
        articleDate: '',
        articleType: '1',
        fileName: '',
      },
      rules: {
        articleTitle: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' },
        ],
        articleIntro: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
        articleTags: [{ required: true, message: '请输入标签', trigger: 'blur' }],
        articleContent: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        articleDate: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        articleType: [{ required: true, message: '请选择类型', trigger: 'blur' }],
      },
    }
  },
  created() {},
  methods: {
    init() {
      this.articleForm.articleTitle = ''
      this.articleForm.articleIntro = ''
      this.articleForm.articleTags = ''
      this.articleForm.articleContent = ''
      this.articleForm.articleDate = ''
      this.articleForm.articleType = ''
      this.articleForm.fileName = ''
    },
    //提交检测图片
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = new FormData()
          formData.append('adminId', this.articleForm.adminId)
          formData.append('articleTitle', this.articleForm.articleTitle)
          formData.append('articleTags', this.articleForm.articleTags)
          formData.append('articleIntro', this.articleForm.articleIntro)
          formData.append('articleContent', this.articleForm.articleContent)
          formData.append('articleDate', this.articleForm.articleDate)
          formData.append('articleType', this.articleForm.articleType)
          formData.append('file', document.getElementById('file').files[0])
          formData.append('fileName', this.articleForm.fileName)

          if (!document.getElementById('file').files[0] || !this.articleForm.fileName) {
            this.$message.error('请选择上传的图片！')
            return
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          addAppArticle(formData)
            .then((res) => {
              let { data, status, msg } = res
              loading.close()
              if (status == 200) {
                this.$message.success('发布成功')
                this.init()
              } else {
                this.$message.error(`发布失败:${msg}！`)
              }
            })
            .catch((error) => {
              this.$message.error('发布失败!')
            })
        } else {
          this.$message.error('请填入必需项')
          return false
        }
      })
    },
    //选择图片
    changeImage(e) {
      let file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.articleForm.fileName = file.name
      }
    },
  },
}
</script>

<style scoped lang="less"></style>
