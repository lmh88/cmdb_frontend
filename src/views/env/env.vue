<template>
  <div class="env-list">
    <div class="w">
      <el-form
        :model="form"
        label-width="0"
        :inline="true"
        size="mini"
        id="list-form"
      >
        <el-form-item class="form-input">
          <el-input
            placeholder="名称/地址"
            v-model.trim="paramsForm.keyword"
            clearable
            @keydown.enter.native="GET_EnvList(true)"
            @change="GET_EnvList(true)"
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
            @click="GET_EnvList(true)"
            size="mini"
          >搜索</el-button>
        </el-form-item>
        <el-form-item
          v-has="'env-action'"
          class="form-item-right"
        >
          <el-button
            type="primary"
            @click="handleAdd"
            size="mini"
          >新增环境</el-button>
        </el-form-item>

      </el-form>
      <el-table
        ref="table"
        id="list-table"
        :data="envList"
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
          prop="env"
          label="环境编码"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="环境名称"
          min-width="100"
        >
        </el-table-column>

        <el-table-column
          prop="config_service_addr"
          label="配置中心"
          min-width="150"
        >
        </el-table-column>
        <el-table-column
          prop="jenkins_name"
          label="Jenkins地址"
          min-width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.jenkins_name + '(' + scope.row.jenkins_host + ')' }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="publish_agent_addr"
          label="公共代理地址"
          min-width="90"
        >
        </el-table-column> -->
        <el-table-column
          v-if="$_has('env-action')"
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
      :title="(isAdd ? `新增` : `编辑`) + `环境`"
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
          prop="env"
          label="环境编码"
        >
          <el-input
            v-model.trim="form.env"
            placeholder="请输入环境英文名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="name"
          label="环境名称"
        >
          <el-input
            v-model.trim="form.name"
            placeholder="请输入环境名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="config_service_addr"
          label="配置中心"
        >
          <el-input
            v-model.trim="form.config_service_addr"
            placeholder="请输入配置中心meta server地址"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="jenkins_id"
          label="Jenkins"
        >
          <el-select
            v-model="form.jenkins_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in jenkinsList"
              :key="item.id"
              :label="item.name + '(' + item.jenkins_host + ')'"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
      <span>确认将 {{ deleteName }} 归档吗？</span>
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
import * as API_Env from '@/api/env'
import { deepClone } from '@/utils'
export default {
  name: 'EnvList',
  data() {
    return {
      // 是否是新增
      isAdd: false,
      paramsForm: {
        keyword: '',
        page_index: 1,
        page_size: 10
      },
      // env总条数
      totalCount: 0,
      listLoading: false,
      envList: [],
      // jenkins 列表
      jenkinsList: [],
      // env状态弹窗
      dialogVisible: false,
      // 校验/新增表单
      form: {},
      // 初始化form
      initForm: {
        env: '',
        name: '',
        config_service_addr: '',
        jenkins_id: '',
        remark: ''
      },
      // 修改/新增表单校验规则
      rules: {
        env: [
          { required: true, message: '请输入环境英文名', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              API_Env.checkEnv(value, this.form.id).then(res => {
                if (!res.data) {
                  callback(new Error('环境编码已存在，请重新输入'))
                } else {
                  callback()
                }
              })
            },
            trigger: 'blur'
          }
        ],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],

        config_service_addr: [
          {
            required: true,
            message: '请输入配置中心meta server地址',
            trigger: 'blur'
          }
        ],
        jenkins_id: [
          {
            required: true,
            message: '请选择Jenkins',
            trigger: 'blur'
          }
        ]
        // publish_agent_addr: [
        //   { required: true, message: '请输入公共代理地址', trigger: 'blur' }
        // ]
      },
      // 删除的环境名
      deleteName: '',
      // 删除的环境id
      deleteId: '',
      // 删除弹窗状态
      deleteDialogVisible: false,
      // 当前新建/编辑高亮id
      hoverId: ''
    }
  },
  mounted() {
    this.GET_EnvList(true)
    this.GET_JenkinsList()
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
    // 获取列表
    GET_EnvList(init) {
      this.listLoading = true
      if (!this.paramsForm.keyword) {
        delete this.paramsForm.keyword
      }
      if (init === true) {
        this.initPageData()
      }
      API_Env.getEnvList(this.paramsForm).then(res => {
        this.envList = res.data.list
        this.totalCount = res.data.record_count
        this.paramsForm.page_index = res.data.page_index
        this.paramsForm.page_size = res.data.page_size
        // 本页之前的env条数
        let preNum =
          (this.paramsForm.page_index - 1) * this.paramsForm.page_size || 0
        this.envList.forEach((env, index) => {
          env.index = preNum + index + 1
        })
        this.listLoading = false
      })
    },
    // 获取jenkins列表
    GET_JenkinsList() {
      API_Env.getJenkinsListAll().then(res => {
        this.jenkinsList = res.data.list
      })
    },
    // 新建环境
    handleAdd() {
      this.isAdd = true
      this.dialogVisible = true
      this.form = deepClone(this.initForm)
    },
    // 编辑环境
    handleEdit(id) {
      this.isAdd = false
      this.form = deepClone(this.initForm)
      API_Env.getEnvDetail(id).then(res => {
        this.form.id = res.data.id
        this.form.env = res.data.env
        this.form.name = res.data.name
        this.form.config_service_addr = res.data.config_service_addr
        this.form.jenkins_id = res.data.jenkins_id
        this.form.remark = res.data.remark
        this.dialogVisible = true
      })
    },
    // 弹窗的确定按钮，两种状况
    handleConfirm() {
      // 校验表单填写完全
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            // 提交
            API_Env.createEnv(this.form).then(res => {
              this.GET_EnvList(true)
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
            API_Env.editEnv(this.form).then(res => {
              this.GET_EnvList()
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
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    // 删除环境
    handleDelete(name, id) {
      this.deleteName = name
      this.deleteId = id
      this.deleteDialogVisible = true
    },
    // 确认删除
    handleConfirmDelete() {
      API_Env.deleteEnv(this.deleteId).then(res => {
        this.$message.success('删除成功')
        this.deleteDialogVisible = false
        this.GET_EnvList(true)
      })
    },
    // 初始化页面数据
    initPageData() {
      this.paramsForm.page_index = 1
      this.paramsForm.page_size = 10
    },
    handleSizeChange(val) {
      this.paramsForm.page_size = val
      this.GET_EnvList()
    },
    handleCurrentChange(val) {
      this.paramsForm.page_index = val
      this.GET_EnvList()
    }
  }
}
</script>

<style lang="scss" scoped>
.env-list {
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
  .edit-dialog {
    .el-select {
      width: 100%;
    }
  }
}
</style>
