<template>
  <div class="group-list">
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
            placeholder="分组编码/名称"
            v-model.trim="paramsForm.keyword"
            clearable
            @keydown.enter.native="GET_GroupList(true)"
            @change="GET_GroupList(true)"
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
            @click="GET_GroupList(true)"
            size="mini"
          >搜索</el-button>
        </el-form-item>
        <el-form-item
          v-has="'group-action'"
          class="form-item-right"
        >
          <el-button
            type="primary"
            @click="handleAdd"
            size="mini"
          >新增分组</el-button>
        </el-form-item>

      </el-form>
      <el-table
        ref="table"
        id="list-table"
        :data="groupList"
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
          prop="group_code"
          label="分组编码"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="created_by"
          label="创建者"
          min-width="90"
        >
        </el-table-column>
        <el-table-column
          v-if="$_has('group-action')"
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
      :title="(isAdd ? `新增` : `编辑`) + `分组`"
      width="600px"
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
          label="分组编码"
        >
          <el-input
            v-model.trim="form.group_code"
            :disabled="!isAdd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="name"
          label="名称"
        >
          <el-input
            v-model.trim="form.name"
            autocomplete="off"
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
import * as API_Group from '@/api/group'
import { deepClone } from '@/utils'
export default {
  name: 'GroupList',
  data() {
    return {
      // 是否是新增
      isAdd: false,
      paramsForm: {
        keyword: '',
        page_index: 1,
        page_size: 10
      },
      // group总条数
      totalCount: 0,
      listLoading: false,
      groupList: [],
      // group状态弹窗
      dialogVisible: false,
      // 校验/新增表单
      form: {},
      // 初始化form
      initForm: {
        name: '',
        group_code: ''
      },
      // 修改/新增表单校验规则
      rules: {
        name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
        group_code: [
          { required: true, message: '请输入分组编码', trigger: 'blur' }
        ]
      },
      // 删除的分组名
      deleteName: '',
      // 删除的分组id
      deleteId: '',
      // 删除弹窗状态
      deleteDialogVisible: false,
      // 当前新建/编辑高亮id
      hoverId: ''
    }
  },
  mounted() {
    this.GET_GroupList(true)
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
    GET_GroupList(init) {
      this.listLoading = true
      if (!this.paramsForm.keyword) {
        delete this.paramsForm.keyword
      }
      if (init === true) {
        this.initPageData()
      }
      API_Group.getGroupList(this.paramsForm).then(res => {
        this.groupList = res.data.list
        this.totalCount = res.data.record_count
        this.paramsForm.page_index = res.data.page_index
        this.paramsForm.page_size = res.data.page_size
        // 本页之前的group条数
        let preNum =
          (this.paramsForm.page_index - 1) * this.paramsForm.page_size || 0
        this.groupList.forEach((group, index) => {
          group.index = preNum + index + 1
        })
        this.listLoading = false
      })
    },
    // 新建分组
    handleAdd() {
      this.isAdd = true
      this.dialogVisible = true
      this.form = deepClone(this.initForm)
    },
    // 编辑分组
    handleEdit(id) {
      this.isAdd = false
      this.form = deepClone(this.initForm)
      API_Group.getGroupDetail(id).then(res => {
        this.form.id = res.data.id
        this.form.name = res.data.name
        this.form.group_code = res.data.group_code
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
            API_Group.createGroup(this.form).then(res => {
              this.GET_GroupList(true)
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
            delete this.form.group_code
            API_Group.editGroup(this.form).then(res => {
              this.GET_GroupList()
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
    // 删除分组
    handleDelete(name, id) {
      this.deleteName = name
      this.deleteId = id
      this.deleteDialogVisible = true
    },
    // 确认删除
    handleConfirmDelete() {
      API_Group.deleteGroup(this.deleteId).then(res => {
        this.$message.success('删除成功')
        this.deleteDialogVisible = false
        this.GET_GroupList(true)
      })
    },
    // 初始化页面数据
    initPageData() {
      this.paramsForm.page_index = 1
      this.paramsForm.page_size = 10
    },
    handleSizeChange(val) {
      this.paramsForm.page_size = val
      this.GET_GroupList()
    },
    handleCurrentChange(val) {
      this.paramsForm.page_index = val
      this.GET_GroupList()
    }
  }
}
</script>

<style lang="scss" scoped>
.group-list {
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
