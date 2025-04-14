<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 引导 </el-breadcrumb-item>
        <el-breadcrumb-item>查看引导</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container message-container">
      <el-tabs>
        <div class="search-input">
          <el-input 
          v-model="checkHelpKey" 
          placeholder="请输入资源的key" 
          class="handle-input mr10" 
          clearable 
          @keyup.enter.native="handleSearch"
          @clear="clearSearch"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="toAddHelp">上传引导资源</el-button>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
          <el-table-column type="index" label="序号" align="center" width="80px">
            <template slot-scope="scope">
              <div>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="id" label="id" align="center"></el-table-column>
          <el-table-column prop="key" label="key" align="center"></el-table-column>
          <el-table-column prop="detail" label="资源描述" align="center" width="220" show-overflow-tooltip></el-table-column>
          <el-table-column prop="create_time" label="上传时间" align="center"></el-table-column>
          <el-table-column prop="file_path" label="资源路径" align="center"></el-table-column>
          <el-table-column label="预览" align="center">
            <template slot-scope="scope">
            <img style="cursor: pointer;" width="100%" :src="getRowImage(scope.row.file_path)" alt="" @click="showHelp(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
            <el-button type="text" icon="el-icon-refresh-left" @click="setHelp(scope.row)">修改资源 </el-button>
              <el-button type="text" icon="el-icon-delete" class="red" @click="deleteHelp(scope.row.key)">删除资源 </el-button>
            </template>
          </el-table-column>
          -->
        </el-table>
        <div class="pagination">
          <el-pagination background layout="total, prev, pager, next" :current-page="pageIndex" :page-size="pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
        </div>
      </el-tabs>
    </div>
<!-- 修改引导资源 -->
    <el-dialog title="详细内容" :visible.sync="setHelpVisible" width="50%">
      <el-form ref="form" :model="setHelpForm" label-width="80px">
        <el-form-item label="key">
          <el-input disabled v-model="setHelpForm.key"></el-input>
        </el-form-item>
        <el-form-item label="资源描述">
          <el-input type="textarea" v-model="setHelpForm.detail"></el-input>
        </el-form-item>
        <el-form-item label="上传资源">
          <input type="file" name="avatar" id="file" accept="image/gif,image/jpeg,image/jpg,image/png" @change="changeImage($event)" ref="avatarInput" class="file" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setHelpVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSendSetHelp">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 预览 -->
    <el-dialog title="详细内容" :visible.sync="previewVisible" width="50%">
      <div v-html="previewHtml"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="previewVisible = false">退 出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { 
  getAllSystemImages, 
  getSystemImagesByKey, 
  deleteSystemImagesByKey, 
  updateSystemImageByKey 
  } from '@/api/Help.js'

export default {
  name: 'messageList',
  components: {
    quillEditor,
  },
  data() {
    return {
      admin_id: localStorage.getItem('ms_user_id'),
      pageIndex: 1, //页码
      pageSize: 10, //页面大小
      pageTotal: 0, //总条数
      checkHelpKey: '', //key搜索输入框
      tableData: [], //消息列表
      setHelpVisible: false, //资源修改显隐
      previewVisible: false, //预览显隐
      previewHtml:'',//生成预览html
      setHelpForm: {
        admin_id: localStorage.getItem('ms_user_id'),
        key: '',
        detail: '',
        file_name: '',
      },
      editorOption: {
        theme: 'bubble',
      }, //富文本框样式
    }
  },
  watch: {
    //只要引导修改弹出框变化了,就清除修改组件所有输入框的内容
    setHelpVisible() {
      this.setHelpForm.file_name = ''
    },
    //输入框为空则请求所有引导资源
    checkHelpKey(newVlaue,oldVlaue){
      !newVlaue && this.clearSearch()
    }
  },
  created() {
    this.getHelpTable()
  },
  methods: {
    init() {
      this.checkHelpKey = '',
      this.setHelpForm.detail = '',
      this.file_name = ''
      this.pageIndex = 1
    },
    //查询管理员上传的资源
    getHelpTable() {
      let params = {
        admin_id: this.admin_id,
        page_index: this.pageIndex,
        page_size: this.pageSize,
      }
      getAllSystemImages(params)
        .then((res) => {
          let { status, msg, data ,total} = res
          if (status == 200) {
            this.tableData = data
            this.pageTotal = total;
          } else {
            this.$message.error(`获取资源列表失败:${msg}!`)
          }
        })
        .catch((error) => {
          this.$message.error('获取资源列表失败!')
        })
    },
    //通过key搜索资源
    getHelpTableByKey() {
      if(!this.checkHelpKey) return this.$message.error('请输入key')
      let params = {
        key: this.checkHelpKey,
      }
      getSystemImagesByKey(params)
        .then((res) => {
          let { status, msg, data } = res
          if (status == 200) {
            this.tableData = [data]
          } else {
            this.$message.error(`获取资源列表失败:${msg}!`)
          }
        })
        .catch((error) => {
          this.$message.error('获取资源列表失败!')
        })
    },
    //打开修改资源弹框
    setHelp(data) {
      this.setHelpVisible = true
      this.setHelpForm.key = data.key
      this.setHelpForm.detail=data.detail
    },
    //取消搜索
    clearSearch(){
      this.init()
      this.getHelpTable()
    },
    //保存修改的资源
    handleSendSetHelp() {
      let formData = new FormData()
      formData.append('admin_id', this.setHelpForm.admin_id)
      formData.append('key', this.setHelpForm.key)
      formData.append('detail', this.setHelpForm.detail)
      formData.append('file_name', this.setHelpForm.file_name)
      this.setHelpForm.file_name && formData.append('file', document.getElementById('file').files[0])

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      updateSystemImageByKey(formData)
        .then((res) => {
          let { data, status, msg } = res
          loading.close()
          if (status == 200) {
            this.$message.success(`修改成功！`)
            this.setHelpVisible = false
            this.init()
            this.getHelpTable()
          } else {
            this.$message.error(`图片修改失败:${msg}！`)
          }
        })
        .catch((error) => {
          this.$message.error('图片修改失败!')
        })
    },
    //选择图片
    changeImage(e) {
      let file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.setHelpForm.file_name = file.name
      }
    },
    //返回图片地址
    getRowImage(imgPath) {
      return `${this.$serverUrl}${imgPath}?${Math.random()}`
    },
    //查看引导详情
    showHelp(data) {
      this.previewVisible=true
      this.previewHtml=`<img width="100%" src=${this.$serverUrl}${data.file_path}>${data.detail}`
    },
    //删除消息
    deleteHelp(key) {
      // 二次确认删除
      this.$confirm('确定要删除该资源吗？', '提示', {
        type: 'warning',
      })
        .then(() => {
          let params = {
            key,
            admin_id: this.admin_id,
          }
          deleteSystemImagesByKey(params)
            .then((res) => {
              let { data, status, msg } = res
              if (status == 200) {
                this.$message.success('资源删除成功！')
                if (this.pageIndex > 1 && this.tableData.length == 1) {
                  this.pageIndex = this.pageIndex - 1
                }
                this.getHelpTable()
              } else {
                this.$message.error(`资源删除失败:${msg}！`)
              }
            })
            .catch((error) => {
              this.$message.error('消息删除失败!')
            })
        })
        .catch(() => {})
    },
    //路由跳转到添加资源
    toAddHelp() {
      this.$router.push('/admin_addHelp')
    },
    // 触发搜索按钮
    handleSearch() {
      this.pageIndex = 1
      this.getHelpTableByKey()
    },
    // 分页导航
    handlePageChange(val) {
      this.pageIndex = val
      this.getHelpTable()
    },
  },
}
</script>

<style scoped>
.message-container {
  position: relative;
}

.search-input {
  margin-bottom: 10px;
  display: flex;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}
.editor {
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  background-color: rgba(255, 255, 255, 0.247);
  border-radius: 4px;
  height: 200px;
  overflow: auto;
}
</style>
