<template>
  <div class="git-list">
    <div class="w">
      <el-table
        id="list-table"
        :data="gitList"
        v-loading="listLoading"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="type_name"
          label="git名称"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="git地址"
          min-width="100"
        >
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import * as API_Git from '@/api/git'
import { getGroupList } from '@/api/group'
import { getEnvList } from '@/api/env'
export default {
  name: 'GitList',
  data() {
    return {
      listLoading: false,
      gitList: []
    }
  },
  mounted() {
    this.GET_GitList()
  },
  methods: {
    // 获取列表
    GET_GitList() {
      this.listLoading = true
      API_Git.getGitList().then(res => {
        this.gitList = res.data.list
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.git-list {
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
}
</style>
