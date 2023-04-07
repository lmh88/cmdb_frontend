<template>
  <div class="mirror-list">
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
            @keydown.enter.native="GET_MirrorList(true)"
            @change="GET_MirrorList(true)"
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
            @click="GET_MirrorList(true)"
            size="mini"
          >搜索</el-button>
        </el-form-item>
        <el-form-item
          v-has="'mirror-action'"
          class="form-item-right"
        >
          <el-button
            type="primary"
            @click="handleAdd"
            size="mini"
          >新增镜像</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="table"
        id="list-table"
        :data="mirrorList"
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
          label="镜像名称"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="host"
          label="镜像地址"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="image_name"
          label="镜像包"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="tag"
          label="版本"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          v-if="$_has('mirror-action')"
          v-has="'mirror-action'"
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
      :title="(isAdd ? `新增` : `编辑`) + `镜像`"
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
          prop="name"
          label="镜像名称"
        >
          <el-input
            v-model.trim="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="host"
          label="镜像地址"
        >
          <el-input
            v-model.trim="form.host"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="image_name"
          label="镜像包"
        >
          <el-input
            v-model.trim="form.image_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="tag"
          label="版本"
        >
          <el-input
            v-model.trim="form.tag"
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
import * as API_Mirror from '@/api/mirror'
import { getGroupListAll } from '@/api/group'
import { getEnvListAll } from '@/api/env'
import { deepClone } from '@/utils'
export default {
  name: 'MirrorList',
  data() {
    return {
      // 是否是新增
      isAdd: false,
      paramsForm: {
        keyword: '',
        page_index: 1,
        page_size: 10
      },
      // mirror总条数
      totalCount: 0,
      listLoading: false,
      mirrorList: [],
      // mirror状态弹窗
      dialogVisible: false,
      // 分组列表
      groupList: [],
      // 环境列表
      envList: [],
      // 校验/新增表单
      form: {},
      // 初始化form
      initForm: {
        name: '',
        host: '',
        image_name: '',
        tag: '',
        remark: ''
      },
      // 修改/新增表单校验规则
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        image_name: [
          { required: true, message: '请输入镜像名称', trigger: 'blur' }
        ],
        host: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        tag: [{ required: true, message: '请选择标签/版本', trigger: 'blur' }]
      },
      // 删除的镜像名
      deleteName: '',
      // 删除的镜像id
      deleteId: '',
      // 删除弹窗状态
      deleteDialogVisible: false,
      // 当前新建/编辑高亮id
      hoverId: ''
    }
  },
  mounted() {
    this.GET_MirrorList(true)
    this.GET_EnvList()
    this.GET_GroupList()
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
      this.GET_MirrorList(true)
    },
    // 获取列表
    GET_MirrorList(init) {
      this.listLoading = true
      if (!this.paramsForm.keyword) {
        delete this.paramsForm.keyword
      }
      if (init === true) {
        this.initPageData()
      }
      API_Mirror.getMirrorList(this.paramsForm).then(res => {
        this.mirrorList = res.data.list
        this.totalCount = res.data.record_count
        this.paramsForm.page_index = res.data.page_index
        this.paramsForm.page_size = res.data.page_size
        // 本页之前的mirror条数
        let preNum =
          (this.paramsForm.page_index - 1) * this.paramsForm.page_size || 0
        this.mirrorList.forEach((mirror, index) => {
          mirror.index = preNum + index + 1
        })
        this.listLoading = false
      })
    },
    // 获取分组列表
    GET_GroupList() {
      getGroupListAll().then(res => (this.groupList = res.data.list))
    },
    // 获取环境列表
    GET_EnvList() {
      getEnvListAll().then(res => (this.envList = res.data.list))
    },
    // 新建镜像
    handleAdd() {
      this.isAdd = true
      this.dialogVisible = true
      this.form = deepClone(this.initForm)
    },
    // 编辑镜像
    handleEdit(id) {
      this.isAdd = false
      this.form = deepClone(this.initForm)
      API_Mirror.getMirrorDetail(id).then(res => {
        this.form.id = res.data.id
        this.form.name = res.data.name
        this.form.host = res.data.host
        this.form.image_name = res.data.image_name
        this.form.tag = res.data.tag
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
            API_Mirror.createMirror(this.form).then(res => {
              this.GET_MirrorList(true)
              this.$message.success('新建成功')
              this.hoverId = res.data.id
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
            API_Mirror.editMirror(this.form).then(res => {
              this.GET_MirrorList()
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
    // 删除镜像
    handleDelete(name, id) {
      this.deleteName = name
      this.deleteId = id
      this.deleteDialogVisible = true
    },
    // 确认删除
    handleConfirmDelete() {
      API_Mirror.deleteMirror(this.deleteId).then(res => {
        this.$message.success('删除成功')
        this.deleteDialogVisible = false
        this.GET_MirrorList(true)
      })
    },
    // 初始化页面数据
    initPageData() {
      this.paramsForm.page_index = 1
      this.paramsForm.page_size = 10
    },
    handleSizeChange(val) {
      this.paramsForm.page_size = val
      this.GET_MirrorList()
    },
    handleCurrentChange(val) {
      this.paramsForm.page_index = val
      this.GET_MirrorList()
    }
  }
}
</script>

<style lang="scss" scoped>
.mirror-list {
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
