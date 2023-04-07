<template>
  <div class="code-list">
    <div class="w">
      <el-form
        :model="form"
        label-width="0"
        :inline="true"
        size="mini"
        id="list-form"
      >
        <el-form-item class="form-select">
          <el-select
            v-model="paramsForm.group_code"
            placeholder="请选择所属组"
            clearable
            @change="changeGroup"
          >
            <el-option
              v-for="item in groupList"
              :key="item.group_code"
              :label="item.name"
              :value="item.group_code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-input">
          <el-input
            placeholder="名称/地址"
            v-model.trim="paramsForm.keyword"
            clearable
            @keydown.enter.native="GET_CodeList(true)"
            @change="GET_CodeList(true)"
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-search"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="GET_CodeList(true)"
            size="mini"
          >搜索</el-button>
        </el-form-item>
        <el-form-item
          v-has="'code-action'"
          class="form-item-right"
        >
          <el-button
            type="primary"
            @click="handleAdd"
            size="mini"
          >新增仓库</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="table"
        id="list-table"
        :data="codeList"
        style="width: 100%"
        v-loading="listLoading"
        :row-class-name="rowClassName"
      >
        <el-table-column
          prop="index"
          label="序号"
          width="60"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="代码仓库名称"
          min-width="100"
        >
          <template slot-scope="scope">
            <a
              class="id"
              :href="scope.row.web_url"
              target="_blank"
            >{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="代码仓库地址"
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="group_name"
          label="所属组"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="gitlab_project_id"
          label="gitlab项目id"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          v-if="$_has('code-action')"
          label="操作"
          min-width="80"
        >
          <template slot-scope="scope">
            <div
              class="operate"
              @click="handleEdit(scope.row.id)"
            ><i class="el-icon-edit"></i></div>
            <div
              class="operate"
              @click="handleDelete(scope.row.name, scope.row.id)"
            ><i class="el-icon-delete"></i></div>
          </template>
        </el-table-column>
      </el-table>
      <div id="list-pagi">
        <span class="pagi-total">共{{ totalCount }}条记录</span>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paramsForm.page_index"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="paramsForm.page_size"
          layout="prev, pager, next, sizes"
          :total="totalCount"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="(isAdd ? `新增` : `编辑`) + `仓库`"
      width="600px"
      :before-close="handleClose"
      class="edit-dialog"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        size="mini"
        label-width="100px"
      >
        <el-form-item
          prop="group_code"
          label="所属组"
        >
          <el-select
            v-model="form.group_code"
            placeholder="请选择"
          >
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.group_code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="gitlab_project_id"
          label="查找仓库"
        >
          <el-select
            v-model="form.git_type"
            placeholder="请选择"
            style="width: 20%;"
          >
            <el-option
              v-for="item in gitlabList"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="form.gitlab_project_id"
            filterable
            remote
            reserve-keyword
            placeholder="请输入gitlab项目（至少输入三个字符） "
            :remote-method="remoteMethod"
            :loading="gitLoading"
            style="width: 79%;"
            @change="changeGitlab"
          >
            <el-option
              v-for="item in gitList"
              :key="item.id"
              :label="item.name_with_namespace"
              :value="item.id"
            >
              <!-- <div @click="selectedItem(item)">{{item.name_with_namespace}}</div> -->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="name"
          label="仓库名称"
        >
          <el-input
            v-model.trim="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="web_url"
          label="仓库地址"
        >
          <el-input
            disabled
            v-model.trim="form.web_url"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="remark"
          label="备注"
        >
          <el-input
            v-model.trim="form.remark"
            autocomplete="off"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请填写备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="deleteDialogVisible"
      width="600px"
    >
      <span>确认删除 {{ deleteName }}
        吗？</span>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleConfirmDelete"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as API_Code from '@/api/code'
import { getGroupListAll } from '@/api/group'
import { getGitList, searchGitList } from '@/api/git'
import { deepClone } from '@/utils'
export default {
  name: 'CodeList',
  data() {
    return {
      // 是否是新增
      isAdd: false,
      paramsForm: {
        group_code: this.$store.getters.group_code || '',
        keyword: '',
        page_index: 1,
        page_size: 10
      },
      // code总条数
      totalCount: 0,
      listLoading: false,
      codeList: [],
      // code状态弹窗
      dialogVisible: false,
      // 分组列表
      groupList: [],
      // 校验/新增表单
      form: {},
      // 初始化form
      initForm: {
        group_code: '',
        web_url: '',
        address: '',
        http_url: '',
        name: '',
        remark: '',
        gitlab_project_id: '',
        git_type: ''
      },
      // 修改/新增表单校验规则
      rules: {
        name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
        web_url: [
          { required: true, message: '请输入仓库地址', trigger: 'blur' }
        ],
        group_code: [
          { required: true, message: '请选择分组编码', trigger: 'blur' }
        ],
        gitlab_project_id: [
          { required: true, message: '请输入gitlab项目', trigger: 'blur' }
        ]
      },
      // 删除的仓库名
      deleteName: '',
      // 删除的仓库id
      deleteId: '',
      // 删除弹窗状态
      deleteDialogVisible: false,
      // 当前新建/编辑高亮id
      hoverId: '',
      // git账号
      gitlabList: [],
      // 根据关键词和gitlab 的 id 远程获取git列表
      gitList: [],
      // 远程获取git的下拉窗口的loading
      gitLoading: false
    }
  },
  mounted() {
    this.GET_CodeList(true)
    this.GET_GroupList()
    this.GET_GitlabList()
  },
  methods: {
    // 鼠标移入table，则重置hoverId为 0 并移除mouseEnter事件
    handleMouseEnterTable() {
      this.hoverId = 0
      this.$refs.table.$el.removeEventListener(
        'mouseenter',
        this.handleMouseEnterTable
      )
    },
    // 针对hoverId对应的row添加hovered类
    rowClassName({ row, rowIndex }) {
      if (row.id == this.hoverId) {
        return 'hovered'
      }
      return ''
    },
    // 选择项目组回调
    changeGroup(value) {
      this.$store.dispatch('setGroupCode', value)
      this.GET_CodeList(true)
    },
    // 查找仓库的回调
    changeGitlab(value) {
      let gitListSelected = this.gitList.filter(git => git.id === value)
      console.log(value)
      if (gitListSelected.length > 0) {
        this.form.name = gitListSelected[0].name
        this.form.web_url = gitListSelected[0].web_url
        this.form.http_url = gitListSelected[0].http_url_to_repo
        this.form.address = gitListSelected[0].ssh_url_to_repo
        this.form.remark = gitListSelected[0].description
      }
    },
    // 获取列表
    GET_CodeList(init) {
      this.listLoading = true
      if (!this.paramsForm.keyword) {
        delete this.paramsForm.keyword
      }
      if (!this.paramsForm.group_code) {
        delete this.paramsForm.group_code
      }
      if (init === true) {
        this.initPageData()
      }
      API_Code.getCodeList(this.paramsForm).then(res => {
        console.log(res.data)
        this.codeList = res.data.list
        this.totalCount = res.data.record_count
        this.paramsForm.page_index = res.data.page_index
        this.paramsForm.page_size = res.data.page_size
        // 本页之前的code条数
        let preNum =
          (this.paramsForm.page_index - 1) * this.paramsForm.page_size || 0
        this.codeList.forEach((code, index) => {
          code.index = preNum + index + 1
        })
        this.listLoading = false
      })
    },
    // 获取分组列表
    GET_GroupList() {
      getGroupListAll().then(res => {
        this.groupList = res.data.list
      })
    },
    // 获取Git账号列表
    GET_GitlabList() {
      getGitList().then(res => {
        this.gitlabList = res.data.list
        this.form.git_type = this.gitlabList[0].id
      })
    },
    // 查找仓库接口
    remoteMethod(value) {
      if (value !== '') {
        this.gitLoading = true
        let form = {
          search: value,
          id: this.form.git_type
        }
        searchGitList(form).then(res => {
          this.gitList = res.data.list
          this.gitLoading = false
        })
      }
    },
    // 新建仓库
    handleAdd() {
      this.isAdd = true
      this.dialogVisible = true
      this.form = deepClone(this.initForm)
      this.form.group_code = this.paramsForm.group_code
    },
    // 编辑仓库
    handleEdit(id) {
      this.isAdd = false
      this.form = deepClone(this.initForm)
      API_Code.getCodeDetail(id).then(res => {
        this.form.id = res.data.id
        this.form.group_code = res.data.group_code
        this.form.web_url = res.data.web_url
        this.form.address = res.data.address
        this.form.http_url = res.data.http_url
        this.form.name = res.data.name
        this.form.remark = res.data.remark
        this.form.gitlab_project_id = res.data.gitlab_project_id
        this.form.git_type = res.data.git_type
        this.dialogVisible = true
      })
    },
    // 弹窗的确定按钮，两种状况
    handleConfirm() {
      // 校验表单填写完全
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            API_Code.createCode(this.form).then(res => {
              this.GET_CodeList(true)
              this.$message.success('新建成功')
              this.$refs.table.$el.addEventListener(
                'mouseenter',
                this.handleMouseEnterTable
              )
              this.$refs.form.resetFields()
              this.dialogVisible = false
            })
          } else {
            // 编辑
            delete this.form.env_name
            API_Code.editCode(this.form).then(res => {
              this.GET_CodeList()
              this.$message.success('编辑成功')
              this.hoverId = this.form.id
              this.$refs.table.$el.addEventListener(
                'mouseenter',
                this.handleMouseEnterTable
              )
              this.$refs.form.resetFields()
              this.dialogVisible = false
            })
          }
        }
      })
    },
    // 关闭弹窗
    handleClose() {
      this.gitList = []
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    // 删除仓库
    handleDelete(name, id) {
      this.deleteName = name
      this.deleteId = id
      this.deleteDialogVisible = true
    },
    // 确认删除
    handleConfirmDelete() {
      API_Code.deleteCode(this.deleteId).then(res => {
        this.$message.success('删除成功')
        this.deleteDialogVisible = false
        this.GET_CodeList(true)
      })
    },
    // 初始化页面数据
    initPageData() {
      this.paramsForm.page_index = 1
      this.paramsForm.page_size = 10
    },
    handleSizeChange(val) {
      this.paramsForm.page_size = val
      this.GET_CodeList()
    },
    handleCurrentChange(val) {
      this.paramsForm.page_index = val
      this.GET_CodeList()
    }
    // selectedItem(item) {
    //   console.log('select item ==> ', item)
    // }
  }
}
</script>

<style lang="scss" scoped>
.code-list {
  #list-form {
    .el-select {
      width: 100%;
    }
    .el-input {
      width: 300px;
    }
    .form-item-right {
      float: right;
    }
  }
  /deep/ #list-table {
    margin-top: 3px;
    font-size: 12px;
    overflow: visible;
    color: #222222;
    th {
      color: #222222;
      background-color: #f5f6fa;
      box-shadow: 0px -1px 0px 0px rgba(211, 217, 230, 1);
    }
    .hovered {
      box-shadow: 0px -1px 0px 0px rgba(235, 237, 243, 1);
      td {
        background-color: #e7f7ff;
      }
    }
    tbody tr:hover {
      box-shadow: 0px -1px 0px 0px rgba(235, 237, 243, 1);
      td {
        background-color: #e7f7ff;
      }
    }
    .cell {
      overflow: visible;
    }
    .el-table__body-wrapper.is-scrolling-left {
      overflow: visible;
    }
    .id {
      color: #1989fa;
    }
  }
  #list-pagi {
    margin-top: 12px;
    .pagi-total {
      float: left;
      padding-left: 18px;
      color: #333333;
      font-size: 12px;
      line-height: 32px;
    }
    /deep/.el-pagination {
      float: right;
      li,
      button {
        border: 1px solid #d3d9e6;
        font-weight: normal;
        color: #666666;
        background-color: #ffffff;
        &.active {
          color: #ffffff;
          background-color: #108ee9;
        }
      }
    }
  }
  /deep/ .edit-dialog {
    // .select-git {
    //   padding: 0 20px;
    // }
    .el-select {
      width: 100%;
    }
  }
}
// /deep/.el-select-dropdown__item {
//   padding: 0 !important;
// }
</style>
