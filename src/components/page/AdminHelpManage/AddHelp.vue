<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 引导 </el-breadcrumb-item>
        <el-breadcrumb-item>添加引导资源</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container test-container">
      <div class="form-box">
        <el-form :rules="rules" ref="form" :model="HelpForm" label-width="80px">
          <el-form-item label="key" prop="key">
            <el-input v-model="HelpForm.key"></el-input>
          </el-form-item>
          <el-form-item label="资源描述" prop="detail">
            <el-input type="textarea" v-model="HelpForm.detail"></el-input>
          </el-form-item>
          <el-form-item label="上传资源">
            <input type="file" name="avatar" id="file" accept="image/gif,image/jpeg,image/jpg,image/png" @change="changeImage($event)" class="file" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即上传</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { addSystemImage } from '@/api/Help.js'
export default {
  name: 'addHelp',
  data() {
    return {
      //提交引导资源form
      HelpForm: {
        admin_id: localStorage.getItem('ms_user_id'),
        key: '',
        detail: '',
        file_name: '',
      },
      rules: {
        key: [
          { required: true, message: '请输入key', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
        ],
        detail: [{ required: true, message: '请输入描述', trigger: 'blur' }],
      },
    }
  },
  methods: {
    init() {
      this.HelpForm.key = '';
      this.HelpForm.detail = '';
      this.HelpForm.file_name = '';
    },
    //提交图片
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = new FormData()
          formData.append('admin_id', this.HelpForm.admin_id)
          formData.append('key', this.HelpForm.key)
          formData.append('detail', this.HelpForm.detail)
          formData.append('file_name', this.HelpForm.file_name)
          formData.append('file', document.getElementById('file').files[0])

          if (!document.getElementById('file').files[0]) {
            this.$message.error('请选择上传的图片！')
            return
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          addSystemImage(formData)
            .then((res) => {
              let {status, msg } = res
              loading.close()
              if (status == 200) {
                this.$message.success(`图片上传成功！`)
                this.init()
              } else {
                this.$message.error(`图片检测失败:${msg}！`)
              }
            })
            .catch((error) => {
              this.$message.error('图片检测失败!')
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
        this.HelpForm.file_name = file.name
      }
    },
  },
}
</script>

<style scoped lang="less"></style>
