<template>
  <div class="application">
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
            placeholder="应用名称/应用编码/主仓库名称"
            v-model.trim="paramsForm.keyword"
            clearable
            @keydown.enter.native="GET_AppList(true)"
            @change="GET_AppList(true)"
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-search"
            ></i>
          </el-input>
          <el-button
            type="primary"
            @click="GET_AppList(true)"
            size="mini"
          >搜索</el-button>
        </el-form-item>
        <el-form-item
          v-has="'application-action'"
          class="form-item-right"
        >
          <el-button
            type="primary"
            @click="handleAdd"
            size="mini"
          >新增应用</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="table"
        id="list-table"
        :data="appList"
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
          prop="app_code"
          label="应用编码"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="config_app_id"
          label="配置APPID"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="app_name"
          label="应用名称"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="image_info.name"
          label="应用类型"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          label="代码仓库"
          min-width="150"
        >
          <template slot-scope="scope">
            <ul>
              <li
                v-for="repo in scope.row.repo_info"
                :key="repo.repo_id"
                :class="['repo', {'master': repo.is_master === 1}]"
              >{{ repo.repo_name }}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column
          prop="expose_port"
          label="端口"
          min-width="80"
        >
          <template slot-scope="scope">
            {{ scope.row.expose_port === 0 ? '-' : scope.row.expose_port }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="180"
        >
          <template slot-scope="scope">
            <el-tooltip
              :content="scope.row.remark"
              placement="bottom"
              effect="light"
            >
              <span class="remark-tip">{{scope.row.remark}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="group_name"
          label="所属组"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          v-if="$_has('application-action')"
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
              @click="handleDelete(scope.row.app_name, scope.row.id)"
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
      :title="(isAdd ? `新增` : `编辑`) + `应用`"
      width="650px"
      :before-close="handleClose"
      v-dialogDrag
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
          prop="app_code"
          label="应用编码"
        >
          <el-input
            :disabled="!isAdd"
            v-model.trim="form.app_code"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="config_app_id"
          label="配置APPID"
        >
          <el-input
            v-model.trim="form.config_app_id"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="app_name"
          label="应用名称"
        >
          <el-input
            v-model.trim="form.app_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="image_id"
          label="类型"
        >
          <el-select
            v-model="form.image_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in mirrorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="expose_port"
          label="端口"
        >
          <el-input
            v-model.trim="form.expose_port"
            placeholder="不能与其他应用端口重复"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="git"
          label="代码仓库"
        >
          <Transfer
            ref="transfer"
            v-model="valueList"
            :title="['所有仓库', '主仓库', '依赖仓库']"
            :props-data="{name: 'name', value: 'id'}"
            :show-search="[true, false, false]"
            :name="['all', 'one', 'two']"
            :selected='selectedList'
          />
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
import * as API_App from '@/api/application'
import { getGroupListAll } from '@/api/group'
import { getMirrorList } from '@/api/mirror'
import { getCodeListAll } from '@/api/code'
import Transfer from '@/components/Transfer/Index'
import { deepClone } from '@/utils'
export default {
  name: 'AppList',
  components: { Transfer },
  data() {
    return {
      // 应用类型
      typeList: [
        {
          name: 'Web服务器',
          value: 0
        },
        {
          name: '队列服务器',
          value: 1
        }
      ],
      // 是否是新增
      isAdd: false,
      paramsForm: {
        group_code: this.$store.getters.group_code || '',
        keyword: '',
        page_index: 1,
        page_size: 10
      },
      // app总条数
      totalCount: 0,
      listLoading: false,
      appList: [],
      // app状态弹窗
      dialogVisible: false,
      // 分组列表
      groupList: [],
      // 环境列表
      envList: [],
      // 镜像列表
      mirrorList: [],
      // 仓库列表
      gitList: [],
      // 校验/新增表单
      form: {},
      // 初始化form
      initForm: {
        app_name: '',
        group_code: '',
        config_app_id: '',
        app_code: '',
        image_id: '',
        expose_port: '',
        remark: ''
      },
      // 修改/新增表单校验规则
      rules: {
        group_code: [
          { required: true, message: '请输入分组编码', trigger: 'blur' }
        ],
        app_name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        config_app_id: [
          { required: true, message: '请输入配置APPID', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^(?!\d+$)[^0-9][\da-zA-Z_-]+$/.test(value)) {
                callback(new Error('只能为英文字母，最好与项目主仓库名称相同'))
              } else if (/[\u4E00-\u9FA5]/i.test(value)) {
                callback(new Error('应用编码禁止使用中文'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        app_code: [
          { required: true, message: '请输入应用编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^[a-z][a-z0-9-]*$/.test(value)) {
                callback(
                  new Error(
                    '可包含数字、小写英文字符，或"-"，且不能以-开头，最好与项目主仓库名称相关'
                  )
                )
              } else if (/[\u4E00-\u9FA5]/i.test(value)) {
                callback(new Error('应用编码禁止使用中文'))
              } else {
                let data = {
                  app_code: value
                }
                if (!this.isAdd) {
                  data.id = this.form.id
                }
                API_App.checkAppCode(data).then(res => {
                  if (!res.data) {
                    callback(new Error('该应用编码已存在'))
                  } else {
                    callback()
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ],
        image_id: [
          { required: true, message: '请选择应用类型', trigger: 'blur' }
        ],
        git: [
          {
            validator: (rule, value, callback) => {
              if (this.valueList.one.length !== 1) {
                callback(new Error('请选择正确的主仓库的数量'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        expose_port: [
          {
            validator: (rule, value, callback) => {
              if (value === '' || (value >= 1 && value <= 65535)) {
                callback()
              } else {
                callback(new Error('请填写正确的端口，端口范围为 1 - 65535'))
              }
            },
            trigger: 'blur'
          }
        ]
      },
      // 删除的应用名
      deleteName: '',
      // 删除的应用id
      deleteId: '',
      // 删除弹窗状态
      deleteDialogVisible: false,
      valueList: {},
      selectedList: [],
      // 当前新建/编辑高亮id
      hoverId: ''
    }
  },
  mounted() {
    this.GET_GroupList()
    this.GET_GitList()
    // this.handleEdit(1)
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
      if (row.id === this.hoverId) {
        return 'hovered'
      }
      return ''
    },
    // 选择项目组回调
    changeGroup(value) {
      this.$store.dispatch('setGroupCode', value)
      this.GET_AppList(true)
    },
    // 获取列表
    GET_AppList(init) {
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
      API_App.getAppList(this.paramsForm).then(res => {
        this.appList = res.data.list
        this.totalCount = res.data.record_count
        this.paramsForm.page_index = res.data.page_index
        this.paramsForm.page_size = res.data.page_size
        // 本页之前的app条数
        let preNum =
          (this.paramsForm.page_index - 1) * this.paramsForm.page_size || 0
        this.appList.forEach((app, index) => {
          app.index = preNum + index + 1
        })
        this.listLoading = false
      })
    },
    // 获取分组列表
    GET_GroupList() {
      getGroupListAll().then(res => {
        this.groupList = res.data.list
        // this.paramsForm.group_code = this.groupList[0].group_codeode
        this.GET_AppList(true)
      })
    },
    // 获取镜像列表
    GET_MirrorList() {
      getMirrorList().then(res => {
        this.mirrorList = res.data.list
        if (this.isAdd) {
          this.form.image_id = this.mirrorList[0].id
        }
      })
    },
    // 获取仓库列表
    GET_GitList() {
      getCodeListAll().then(res => {
        this.gitList = res.data.list
        console.log('仓库列表', res)
        this.valueList = {}
        this.initData()
      })
    },
    // 初始化数据
    initData() {
      this.$set(this.selectedList, 0, deepClone(this.gitList))
      this.$set(this.selectedList, 1, deepClone(this.gitList))
      this.$set(this.selectedList, 2, deepClone(this.gitList))
      this.valueList = {}
    },
    // 新建应用
    handleAdd() {
      this.isAdd = true
      this.dialogVisible = true
      this.form = deepClone(this.initForm)
      this.form.group_code = this.paramsForm.group_code
      this.GET_MirrorList()
    },
    // 编辑应用
    handleEdit(id) {
      this.form = deepClone(this.initForm)
      this.isAdd = false
      this.GET_MirrorList()
      API_App.getAppDetail(id).then(res => {
        this.form.id = res.data.id
        this.form.group_code = res.data.group_code
        this.form.app_name = res.data.app_name
        this.form.app_code = res.data.app_code
        this.form.config_app_id = res.data.config_app_id
        this.form.image_id = res.data.image_id
        console.log(res.data.image_id, 'res.data.image_id')
        console.log(this.form.image_id, 'this.form.image_id')
        this.form.expose_port = res.data.expose_port
        this.form.remark = res.data.remark
        res.data.repo_info.map(repo => {
          this.gitList.map((git, index) => {
            if (repo.repo_id === git.id) {
              if (repo.is_master === 1) {
                this.$set(this.selectedList[0][index], 'disabled', true)
                this.$set(this.selectedList[1][index], 'show', true)
              } else {
                this.$set(this.selectedList[0][index], 'disabled', true)
                this.$set(this.selectedList[2][index], 'show', true)
              }
            }
          })
        })
        this.dialogVisible = true
        // this.$refs.transfer.getValue()
        // console.log(this.$refs.transfer)
      })
    },
    // 弹窗的确定按钮，两种状况
    handleConfirm() {
      // 校验表单填写完全
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.master_repo_id = this.valueList.one[0].id
          this.form.repo = this.valueList.two.map(re => {
            return {
              repo_id: re.id
            }
          })
          if (this.isAdd) {
            // 提交
            API_App.createApp(this.form).then(res => {
              this.GET_AppList(true)
              this.$message.success('新建成功')
              this.$refs.table.$el.addEventListener(
                'mouseenter',
                this.handleMouseEnterTable
              )
              this.$refs.form.resetFields()
              this.dialogVisible = false
              this.initData()
            })
          } else {
            // 编辑
            delete this.form.env_name
            API_App.editApp(this.form).then(res => {
              this.GET_AppList()
              this.$message.success('编辑成功')
              this.hoverId = this.form.id
              this.$refs.table.$el.addEventListener(
                'mouseenter',
                this.handleMouseEnterTable
              )
              this.$refs.form.resetFields()
              this.dialogVisible = false
              this.initData()
            })
          }
        }
      })
    },
    // 关闭弹窗
    handleClose() {
      this.initData()
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    // 删除应用
    handleDelete(name, id) {
      this.deleteName = name
      this.deleteId = id
      this.deleteDialogVisible = true
    },
    // 确认删除
    handleConfirmDelete() {
      API_App.deleteApp(this.deleteId).then(res => {
        this.$message.success('删除成功')
        this.deleteDialogVisible = false
        this.GET_AppList(true)
      })
    },
    // 初始化页面数据
    initPageData() {
      this.paramsForm.page_index = 1
      this.paramsForm.page_size = 10
    },
    handleSizeChange(val) {
      this.paramsForm.page_size = val
      this.GET_AppList()
    },
    handleCurrentChange(val) {
      this.paramsForm.page_index = val
      this.GET_AppList()
    }
  }
}
</script>

<style lang="scss" scoped>
.application {
  #list-form {
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
    .remark-tip {
      overflow: hidden;
      width: 160px;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
    }
    .el-table__body-wrapper.is-scrolling-left {
      overflow: visible;
    }
    .repo {
      padding-left: 10px;
      &.master {
        font-weight: 600;
        position: relative;
        &::before {
          position: absolute;
          content: "*";
          font-weight: 600;
          font-size: 20px;
          line-height: 30px;
          top: 0px;
          left: 0px;
        }
      }
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
    /deep/ .el-dialog__body {
      height: 500px;
      overflow: auto;
    }

    .el-select {
      width: 100%;
    }
  }
}
</style>
