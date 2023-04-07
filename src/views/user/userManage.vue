<template>
  <div class="user-list">
    <div class="user-organization">
      <div class="title">组织架构</div>
      <el-tree
        ref="tree"
        id="organization"
        :data="orgTree"
        highlight-current
        node-key="id"
        :default-expanded-keys="[topId]"
        :render-content="renderContent"
        @node-click="handleUserList"
      >

      </el-tree>
    </div>
    <div class="user-data">
      <div>
        <el-form
          ref="orgForm"
          :model="orgForm"
          label-width="0"
          :inline="true"
          size="mini"
          class="search"
          @submit.native.prevent
        >

          <!-- 根据域账号检索 -->
          <el-form-item>
            <el-input
              placeholder="姓名，域帐号检索"
              v-model="orgForm.keyword"
              clearable
              class="search-form"
              @keydown.enter.native="getSeachInfo"
              @change="getSeachInfo"
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-search"
              ></i>
            </el-input>
            <el-button
              type="primary"
              class="search-button"
              @click="getSeachInfo"
            >搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="userInfo"
        @row-click="getUserDetail"
        class="list-table"
      >
        <el-table-column
          prop="index"
          label="序号"
          min-width="50"
        >
        </el-table-column>
        <el-table-column
          prop="cn_name"
          label="姓名"
          min-width="75"
        >
        </el-table-column>
        <el-table-column
          prop="ad_name"
          label="账号"
          min-width="90"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          min-width="150"
        >
        </el-table-column>
      </el-table>
      <div id="list-pagi">
        <span class="pagi-total">共{{ recordCount }}条记录</span>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="orgForm.page_index"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="orgForm.page_size"
          layout="prev, pager, next, sizes"
          :total="recordCount"
        >
        </el-pagination>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        width="500px"
      >
        <div
          class=""
          style="text-align: center;"
        >暂无数据</div>
      </el-dialog>
    </div>
    <div>
      <el-drawer
        title="用户详情"
        size="24%"
        :append-to-body="true"
        :visible.sync="drawer"
        :direction="direction"
        class="user-info"
      >
        <div class="user-title">
          <h1>{{userDetail.cn_name}}</h1>
          <span>{{userDetail.ad_name}}</span>
        </div>
        <el-form
          ref="form"
          size="mini"
          label-position="left"
          class="user-info-form"
        >
          <el-form-item label="手机：">{{ userDetail.mobile }}</el-form-item>
          <el-form-item label="邮箱：">{{ userDetail.email }}</el-form-item>
          <el-form-item label="分组：">
            <div
              v-if="groups.length"
              class="group-tag"
            >
              <el-tag
                v-for="tag in userDetail.groups"
                :key="tag.name"
                size="small"
              >
                {{tag.name}}
              </el-tag>
            </div>
            <div v-else>-</div>
          </el-form-item>
          <el-form-item label="角色：">
            <div v-if="roles.length">
              <el-tag
                v-for="tag in userDetail.roles"
                :key="tag.name"
                size="small"
                type="success"
              >
                {{tag.name}}
              </el-tag>
            </div>
            <div v-else>-</div>
          </el-form-item>
        </el-form>
        <div class="user-info-button">
          <el-button
            type="primary"
            @click="handleGroup"
          >组授权</el-button>
          <el-button
            type="primary"
            @click="handleRole"
          >角色授权</el-button>
        </div>
      </el-drawer>
    </div>
    <!-- 组授权弹窗 -->
    <el-dialog
      class="group-dialog"
      title="组授权"
      :visible.sync="dialogGroup"
      :before-close="closeGroup"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="600px"
    >
      <template>
        <el-transfer
          v-model="groupAuthForm.group_codes"
          :data="groupList"
          :titles="['全部分组', '选中分组']"
          :props="{key: 'group_code', label: 'name'}"
        >
        </el-transfer>
      </template>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeGroup">取 消</el-button>
        <el-button
          type="primary"
          @click="changeUserGroupAuth"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色授权弹窗 -->
    <el-dialog
      class="role-dialog"
      title="角色授权"
      :visible.sync="dialogRole"
      :before-close="closeRole"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="600px"
    >
      <template>
        <el-table
          ref="roletable"
          :data="roleInfo"
          :header-cell-class-name="checkboxAllClass"
          class="role-table"
          style="width: 100%"
          @selection-change="handleRoleChange"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <div
                v-for="(item,index) in props"
                :key="index"
              >
                <div
                  v-for="(roleTitle,index) in item.menu_list"
                  :key="index"
                  class="role-person"
                >
                  <span class="first-role">{{roleTitle.name}}</span>
                  <el-tag
                    v-for="roleContent in roleTitle.action_list"
                    :key="roleContent"
                    size="small"
                    class="role-tag"
                  >
                    {{roleContent}}
                  </el-tag>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="name">
          </el-table-column>
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>
        </el-table>
      </template>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeRole">取 消</el-button>
        <el-button
          type="primary"
          @click="changeUserRoleAuth"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as API_User from '@/api/user'
export default {
  name: 'UserManage',
  data() {
    return {
      userDetail: {},
      groups: {},
      roles: {},
      recordCount: 0,
      orgTree: [],
      orgForm: {
        org_id: '02-明源集团', // 组织架构id
        keyword: '',
        page_index: 1,
        page_size: 10
      },
      topId: '',
      userInfo: [],
      roleInfo: [],
      activeNames: ['1'],
      groupList: [],
      groupAuthForm: {
        group_codes: [],
        ad_name: ''
      },
      drawer: false,
      direction: 'rtl',
      currentRow: {},
      dialogGroup: false,
      dialogRole: false,
      roleAuthForm: {
        role_ids: [],
        ad_name: ''
      },
      searchForm: {}
    }
  },
  created() {
    this.getOrgTree()
  },
  mounted() {
    this.getUserList(this.orgForm)
    this.getGroupList() // 获取用户的组列表
    this.getRoleAction() // 获取用户的权限列表
  },
  methods: {
    // 给树加上自定义图标
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <i class="el-icon-folder" />
          <span style="margin-left:5px;font-size:14px">{data.label}</span>
        </span>
      )
    },
    // 搜索
    getSeachInfo() {
      this.getUserList()
    },
    // 获取组织结构树
    getOrgTree() {
      API_User.getOrgTree().then(res => {
        this.orgTree = [res.data]
        this.topId = this.orgTree[0].id
      })
    },
    // 点击树结点会促发的方法,每次点击,要把page_index置为1
    handleUserList(data) {
      this.orgForm.page_index = 1
      this.orgForm.org_id = data.id
      this.getUserList()
    },
    // 获取用户列表接口
    getUserList() {
      API_User.getUserList(this.orgForm).then(res => {
        this.userInfo = res.data.list
        this.recordCount = res.data.record_count
        this.orgForm.page_index = res.data.page_index
        this.orgForm.page_size = res.data.page_size
        // // 本页之前的user条数
        let preNum = (this.orgForm.page_index - 1) * this.orgForm.page_size
        this.userInfo = res.data.list.map((userInfoIndex, index) => {
          // 给userInfo的每一行添加index属性
          userInfoIndex.index = preNum + index + 1
          return userInfoIndex
        })
      })
    },
    // 点击列表获取用户详情
    getUserDetail(row) {
      this.drawer = true
      this.groupAuthForm.ad_name = row.ad_name
      this.roleAuthForm.ad_name = row.ad_name
      console.log('账户名', this.groupAuthForm.ad_name)
      this.getUserDetailApi(this.groupAuthForm.ad_name)
    },
    // 发起获取用户详情的请求,把它单独分开的理由是因为,当组授权或角色授权时要用到这个接口,所有抽出来
    getUserDetailApi(adName) {
      API_User.getUserDetail(adName).then(res => {
        this.userDetail = res.data
        this.groups = res.data.groups
        this.roles = res.data.roles
      })
    },
    // 获取组授权的列表
    getGroupList() {
      API_User.getGroupList().then(res => {
        this.groupList = res.data
      })
    },
    // 修改组授权的组别
    changeUserGroupAuth() {
      API_User.changeUserGroupAuth(this.groupAuthForm).then(res => {
        console.log(res)
        this.dialogGroup = false
        this.getUserDetailApi(this.groupAuthForm.ad_name)
        this.groupAuthForm.group_codes = []
      })
    },
    // 获取角色权限的值
    getRoleAction() {
      API_User.getRoleAction().then(res => {
        console.log('角色权限的值', res)
        this.roleInfo = res.data
      })
    },
    // 修改角色checkbox触发的方法
    handleRoleChange(val) {
      if (val) {
        this.roleAuthForm.role_ids = val.map(valrole => valrole.id)
      }
    },
    // 修改角色权限
    changeUserRoleAuth() {
      API_User.changeUserRoleAuth(this.roleAuthForm).then(res => {
        this.dialogRole = false
        this.getUserDetailApi(this.roleAuthForm.ad_name)
        this.$refs.roletable.clearSelection() // 清除角色权限
      })
    },
    handleGroup() {
      this.groups.map(group => {
        this.groupAuthForm.group_codes.push(group.code)
      })
      this.dialogGroup = true
    },
    closeGroup() {
      this.dialogGroup = false
      this.groupAuthForm.group_codes = []
    },
    handleRole() {
      this.dialogRole = true
      // 添加nextTick，在数据加载完成后执行nextTick的内容
      this.$nextTick(() => {
        this.roleAuthForm.role_ids = this.roles.map(role => role.id)
        this.roleCheckbox()
      })
    },
    closeRole() {
      this.dialogRole = false
      this.$refs.roletable.clearSelection() // 清除角色权限
    },
    // 将获取到的身份同步到角色授权弹框
    roleCheckbox() {
      this.roleAuthForm.role_ids.forEach(roleid => {
        this.roleInfo.forEach(role => {
          if (role.id == roleid) {
            this.$refs.roletable.toggleRowSelection(role, true)
          }
        })
      })
    },
    handleChange(val) {
      console.log(val)
    },
    // 将role的全选按钮去掉
    checkboxAllClass(row) {
      if (row.columnIndex === 2) {
        return 'disableSelection'
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.orgForm.page_index = val
      this.getUserList(this.orgForm)
    },
    // 分页
    handleSizeChange(val) {
      this.orgForm.page_size = val
      this.getUserList(this.orgForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list {
  display: flex;
  justify-content: space-between;
  .user-organization {
    width: 300px;
    border: 1px solid #f5f5f5;
    .title {
      background: #f5f6fa;
      text-align: center;
      height: 46px;
      line-height: 46px;
      font-size: 14px;
    }
  }
  .user-data {
    .search {
      .el-form-item {
        margin-bottom: 6px;
      }
      .search-form {
        position: relative;
      }
      .search-button {
        position: absolute;
        left: 204px;
        top: 0px;
        border-radius: 6px;
      }
    }
    width: calc(100% - 360px);
  }
  /deep/ .list-table {
    font-size: 14px;
    .el-table__body-wrapper {
      overflow: visible;
      .el-table__body {
        // 使表格兼容safari，不错位
        width: 100%;
        table-layout: fixed !important;
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
}
.user-info {
  .user-title {
    margin-left: 22px;
    h1 {
      font-size: 30px;
      // font-weight: bold;
    }
    span {
      font-size: 14px;
      line-height: 30px;
      letter-spacing: 1px;
    }
  }
  /deep/ .user-info-form {
    margin: 22px 0 0 22px;
    .el-form-item {
      margin-right: 20px;
      // 将标签变为左对齐
      .el-form-item__content {
        margin-left: 54px;
      }
      .el-tag {
        margin: 0 5px 5px 0px;
      }
    }
  }
  .user-info-button {
    position: absolute;
    bottom: 50px;
    left: calc(50% - 130px);
    // 居中布局
    // text-align: center;
    // margin-top: 400px;
    .el-button {
      width: 120px;
    }
  }
}
.group-dialog {
  .el-transfer {
    width: 500px;
    margin: 0 auto;
  }
}
.role-dialog {
  /deep/ .el-dialog__body {
    max-height: 500px;
    overflow: auto;
  }
  /deep/ .disableSelection .cell .el-checkbox__inner {
    display: none;
  }
  /deep/.el-table th {
    display: none;
  }
  .role-table {
    /deep/ .el-table__expanded-cell {
      padding: 18px 14px;
    }
    .role-person {
      line-height: 36px;
      .first-role {
        font-size: 14px;
        font-weight: 600;
        height: 24px;
        line-height: 24px;
      }
      .role-tag {
        font-size: 12px;
        font-weight: 500;
        margin-left: 14px;
      }
    }
  }
}
</style>
