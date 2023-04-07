<template>
  <div class="host-list">
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
        <el-form-item class="form-select">
          <el-select
            v-model="paramsForm.region_id"
            placeholder="请选择区域"
            clearable
            @change="changeGroup"
          >
            <el-option
              v-for="item in regionList"
              :key="item.region_id"
              :label="item.region_name"
              :value="item.region_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-input">
          <el-input
            placeholder="主机名称/实例ID/环境/IP"
            v-model.trim="paramsForm.keyword"
            clearable
            @keydown.enter.native="GET_HostList(true)"
            @change="GET_HostList(true)"
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
            @click="GET_HostList(true)"
            size="mini"
          >搜索</el-button>
        </el-form-item>
        <el-form-item
          v-has="'host-action'"
          class="form-item-right"
        >
          <el-button
            type="primary"
            @click="handleAdd"
            size="mini"
          >新增主机</el-button>
        </el-form-item>
        <el-form-item
          v-has="'host-import'"
          class="form-item-right"
        >
          <el-button
            type="primary"
            @click="handleImport"
            size="mini"
          >引入ECS</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="table"
        id="list-table"
        :data="hostList"
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
        <!-- <el-table-column
          prop="host_name"
          label="host_name"
          min-width="100"
        >
        </el-table-column> -->
        <el-table-column
          prop="env_name"
          label="所属环境"
          min-width="90"
        >
        </el-table-column>
        <el-table-column
          prop="region_name"
          label="所属区域"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="group_name"
          label="所属项目组"
          min-width="100"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.group_name.join('</br>')"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="主机名称"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="instance_name"
          label="实例名称"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="instance_id"
          label="实例ID"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="ssh用户"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="external_ip"
          label="外网IP"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="internal_ip"
          label="内网IP"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="port"
          label="管理端口"
          min-width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.port === 0 ? '-' : scope.row.port }}
          </template>
        </el-table-column>
        <el-table-column
          prop="type_name"
          label="主机分类"
          min-width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.type_name.join('</br>')"></span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$_has('host-action')"
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
      :title="(isAdd ? `新增` : `编辑`) + `主机`"
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
          prop="env_id"
          label="所属环境"
        >
          <el-select
            v-model="form.env_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in envList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="region_id"
          label="所属区域"
        >
          <el-select
            v-model="form.region_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in regionList"
              :key="item.region_id"
              :label="item.region_name"
              :value="item.region_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="group"
          label="分组"
        >
          <el-select
            v-model="form.group"
            multiple
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
          prop="name"
          label="主机名称"
        >
          <el-input
            v-model.trim="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="instance_name"
          label="实例名称"
        >
          <el-input
            v-model.trim="form.instance_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="instance_id"
          label="实例ID"
        >
          <el-input
            v-model.trim="form.instance_id"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="user_name"
          label="ssh用户"
        >
          <el-input
            v-model.trim="form.user_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="external_ip"
          label="外网IP"
        >
          <el-input
            v-model="form.external_ip"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="internal_ip"
          label="内网IP"
        >
          <el-input
            v-model.trim="form.internal_ip"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="port"
          label="管理端口"
        >
          <el-input
            v-model.trim="form.port"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="typeArray"
          label="主机分类"
        >
          <el-select
            v-model="form.typeArray"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
    <el-drawer
      title="引入ECS"
      :before-close="handleDrawerClose"
      :visible.sync="ecsVisible"
      :direction="direction"
      size="800px"
      class="ecs-drawer"
    >
      <div>
        <el-transfer
          filterable
          filter-placeholder="请输入区域"
          v-model="ecsSeletced"
          :data="regionList"
          :titles="['全部区域', '选中区域']"
          :props="{
          key: 'region_id',
          label: 'region_name'
        }"
          @change="handleImportList"
        >
        </el-transfer>
        <div class="esc-list-box">
          <el-table
            :data="escList"
            height="380"
            stripe
            class="esc-list"
          >
            <el-table-column
              prop="region_name"
              label="区域"
            >
            </el-table-column>
            <el-table-column
              prop="instance_name"
              label="主机名称"
            >

            </el-table-column>
            <el-table-column
              prop="instance_id"
              label="实例ID"
            >
            </el-table-column>
            <el-table-column
              prop="external_ip"
              label="外网IP"
            >
            </el-table-column>
            <el-table-column
              prop="internal_ip"
              label="内网IP"
            >
            </el-table-column>
          </el-table>
          <div class="count">共有{{escList.length}}台主机</div>
        </div>
        <div class="demo-drawer__footer">
          <el-button @click="handleDrawerClose">取 消</el-button>
          <el-button
            type="primary"
            @click="handleImportEcs()"
          >确 定</el-button>
        </div>
        <!-- <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleRefreshEcs">刷新区域</el-button>
        <el-button @click="ecsVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleImportEcs"
        >确 定</el-button>
      </div> -->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import * as API_Host from '@/api/host'
import * as API_Region from '@/api/region'
import { getGroupListAll } from '@/api/group'
import { getEnvListAll } from '@/api/env'
import { deepClone } from '@/utils'
export default {
  name: 'HostList',
  data() {
    return {
      // 主机分类
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
      // host总条数
      totalCount: 0,
      listLoading: false,
      hostList: [],
      // host状态弹窗
      dialogVisible: false,
      // 分组列表
      groupList: [],
      // 环境列表
      envList: [],
      // 校验/新增表单
      form: {},
      // 初始化form
      initForm: {
        env_id: '',
        region_id: '',
        name: '',
        // host_name: '',
        user_name: '',
        typeArray: [],
        type: '',
        instance_id: '',
        instance_name: '',
        internal_ip: '',
        external_ip: '',
        port: '',
        group: [],
        group_code: ''
      },
      // 修改/新增表单校验规则
      rules: {
        env_id: [
          { required: true, message: '请选择所属环境', trigger: 'blur' }
        ],
        // host_name: [
        //   { required: true, message: '请输入host_name', trigger: 'blur' }
        // ],
        user_name: [
          { required: true, message: '请输入ssh用户', trigger: 'blur' }
        ],
        region_id: [
          { required: true, message: '请输入所属区域', trigger: 'blur' }
        ],
        // typeArray: [{ required: true, message: '请选择主机分类', trigger: 'blur' }],
        name: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
        // instance_id: [
        //   { required: true, message: '请输入实例ID', trigger: 'blur' }
        // ],
        // instance_name: [
        //   { required: true, message: '请输入实例名称', trigger: 'blur' }
        // ],
        internal_ip: [
          { required: true, message: '请输入内网IP', trigger: 'blur' }
        ],
        // external_ip: [
        //   { required: true, message: '请输入外网IP', trigger: 'blur' }
        // ],
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value >= 1 && value <= 65535) {
                callback()
              } else {
                callback(new Error('请填写正确的端口，端口范围为 1 - 65535'))
              }
            },
            trigger: 'blur'
          }
        ],
        group: [{ required: true, message: '请选择分组', trigger: 'blur' }]
      },
      // 删除的主机名
      deleteName: '',
      // 删除的主机id
      deleteId: '',
      // 删除弹窗状态
      deleteDialogVisible: false,
      /** ecs相关 */
      ecsVisible: false,
      ecsSeletced: [],
      regionList: [],
      isRefresh: false,
      escLoading: false,
      escList: [],
      // 当前新建/编辑高亮id
      hoverId: '',
      // element抽屉抽出的方向
      direction: 'rtl'
    }
  },
  mounted() {
    this.GET_HostList(true)
    this.GET_EnvList()
    this.GET_GroupList()
    this.GET_RegionList()
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
      this.GET_HostList(true)
    },
    // 获取列表
    GET_HostList(init) {
      this.listLoading = true
      if (!this.paramsForm.keyword) {
        delete this.paramsForm.keyword
      }
      if (!this.paramsForm.group_code) {
        delete this.paramsForm.group_code
      }
      if (!this.paramsForm.region_id) {
        delete this.paramsForm.region_id
      }
      if (init === true) {
        this.initPageData()
      }
      API_Host.getHostList(this.paramsForm).then(res => {
        this.hostList = res.data.list
        this.totalCount = res.data.record_count
        this.paramsForm.page_index = res.data.page_index
        this.paramsForm.page_size = res.data.page_size
        // 本页之前的host条数
        let preNum =
          (this.paramsForm.page_index - 1) * this.paramsForm.page_size || 0
        this.hostList.forEach((host, index) => {
          host.index = preNum + index + 1
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
    // 获取环境列表
    GET_EnvList() {
      getEnvListAll().then(res => (this.envList = res.data.list))
    },
    // 获取区域列表
    GET_RegionList() {
      API_Region.getRegionList().then(res => {
        this.regionList = res.data.list
      })
    },
    // 引入ECS弹窗
    handleImport() {
      this.ecsVisible = true
    },
    // 更新区域列表
    handleRefreshEcs() {
      this.isRefresh = true
      API_Region.getRegionRefresh().then(res => {
        this.handleImport()
        this.isRefresh = false
      })
    },
    // 关闭抽屉
    handleDrawerClose() {
      // 把el-transfer右列表的数值清空
      this.ecsSeletced = []
      // 把主机名和区域列表清空
      this.escList = []
      this.ecsVisible = false
    },
    // 根据选中的区域展示主机
    handleImportList() {
      console.log(this.ecsSeletced)
      if (this.ecsSeletced.length === 0) {
        console.log('暂时无数据')
        this.escList = []
      } else {
        API_Host.importList(this.ecsSeletced.join(';')).then(res => {
          console.log('接口返回的数据', res)
          this.escList = res.data
          console.log('this.escList============>', this.escList)
        })
      }
    },
    // 引入ECS
    handleImportEcs() {
      this.ecsVisible = true
      if (this.ecsSeletced.length === 0) {
        this.$message.error('请选择区域')
        return
      }
      API_Host.importEcs(this.ecsSeletced.join(';')).then(res => {
        if (res.errcode === 0) {
          this.$message.success('引入成功')
          this.ecsSeletced = []
          // 把主机名和区域列表清空
          this.escList = []
        }
      })
    },
    // 新建主机
    handleAdd() {
      this.isAdd = true
      this.dialogVisible = true
      this.form = deepClone(this.initForm)
      this.GET_RegionList()
    },
    // 编辑主机
    handleEdit(id) {
      this.form = deepClone(this.initForm)
      this.GET_RegionList()
      this.isAdd = false
      API_Host.getHostDetail(id).then(res => {
        // this.form = { ...res.data }
        this.form.id = res.data.id
        // 因为后端env_id返回为空时会返回0，但是不能让它显示0，前端来做一次转换
        if (res.data.env_id === 0) {
          this.form.env_id = ''
        } else {
          this.form.env_id = res.data.env_id
        }
        this.form.external_ip = res.data.external_ip
        this.form.group = res.data.group_code
        // this.form.host_name = res.data.host_name
        this.form.user_name = res.data.user_name
        this.form.region_id = res.data.region_id
        this.form.instance_id = res.data.instance_id
        this.form.instance_name = res.data.instance_name
        this.form.internal_ip = res.data.internal_ip
        this.form.name = res.data.name
        this.form.port = res.data.port
        this.form.typeArray = res.data.type
        this.dialogVisible = true
      })
    },
    // 弹窗的确定按钮，两种状况
    handleConfirm() {
      // 校验表单填写完全
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.group_code = this.form.group.join()
          this.form.type = this.form.typeArray.join()
          if (this.isAdd) {
            // 提交
            API_Host.createHost(this.form).then(res => {
              this.GET_HostList(true)
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
            API_Host.editHost(this.form).then(res => {
              this.GET_HostList()
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
    // 删除主机
    handleDelete(name, id) {
      this.deleteName = name
      this.deleteId = id
      this.deleteDialogVisible = true
    },
    // 确认删除
    handleConfirmDelete() {
      API_Host.deleteHost(this.deleteId).then(res => {
        this.$message.success('删除成功')
        this.deleteDialogVisible = false
        this.GET_HostList(true)
      })
    },
    // 初始化页面数据
    initPageData() {
      this.paramsForm.page_index = 1
      this.paramsForm.page_size = 10
    },
    handleSizeChange(val) {
      this.paramsForm.page_size = val
      this.GET_HostList()
    },
    handleCurrentChange(val) {
      this.paramsForm.page_index = val
      this.GET_HostList()
    }
  }
}
</script>

<style lang="scss" scoped>
.host-list {
  max-width: 1300px;
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
    .el-table__header-wrapper {
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
.ecs-drawer {
  /deep/ .el-drawer {
    overflow-y: auto;
  }
  /deep/ .el-transfer {
    width: 88%;
    margin: 0 auto;
    .el-transfer-panel {
      width: 296px !important;
    }
  }
  .esc-list-box {
    margin: 40px auto;
    width: 87%;
    .esc-list {
      border: 1px #eee solid;
    }
    .count {
      width: 800px;
      margin: 16px auto;
      font-size: 14px;
      letter-spacing: 1px;
    }
  }
  .demo-drawer__footer {
    width: 500px;
    margin: 0 auto;
    text-align: center;
    .el-button {
      width: 200px;
      margin: 0 20px;
    }
  }
}
</style>
