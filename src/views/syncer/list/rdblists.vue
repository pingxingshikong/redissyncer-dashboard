<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"   @click="handleCreate" >
        新建映射关系
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"

    >
      <!--      @sort-change="sortChange"-->
      <el-table-column label="映射ID"  width="210px"  align="center" >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Redis版本" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.redis_version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="RDB版本" width="255px" align="center">
        <template slot-scope="{row}">
                    <!--<span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <span>{{ row.rdb_version }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">
            编辑
          </el-button>
          <el-button  size="mini" type="danger"  @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addRdbData.dialogFormVisible">
      <div>
        <div style="height:300px;">
            <el-form
              ref="taskForm"
              :model="addRdbData.taskForm"
              :rules="addRdbData.rdbrules"
              :label-position="labelPosition"
              label-width="100px"
            >
              <el-form-item prop="redis_version"  label="Redis版本">
                <el-input
                  v-model="addRdbData.taskForm.redis_version"
                  placeholder="Redis版本"
                ></el-input>
              </el-form-item>
              <el-form-item prop="rdb_version"   label="RDB版本">
                <el-input
                  v-model="addRdbData.taskForm.rdb_version" type="number"
                  placeholder="RDB版本"
                ></el-input>
              </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="ResettaskForm">重置</el-button>
            <el-button type="primary" @click="insertRdbData">提交</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {  deleteRdbList, updateRdbList, insertRdbList, getRdbListByPage } from '@/api/syncer/rdblist'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'RdbList',
  components: { Pagination },
  directives: { waves },
  filters: {
    deleteTaskButtion(status) {
      const statusMap = {
        CREATING: 'info',
        CREATED: 'info',
        STOP: 'danger',
        RDBRUNING: 'info',
        COMMANDRUNING: 'info',
        RUN: 'info',
        BROKEN: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      labelPosition: 'left',
      listQuery: {
        currentPage: 1,
        pageSize: 10
      },
      addRdbData: {
        dialogFormVisible: false,
        taskForm: {
          id: 0,
          redis_version: null,
          rdb_version: null
        },
        rdbrules: {
          redis_version: [{ required: true, message: 'Redis版本不能为空', trigger: 'blur' }],
          rdb_version: [{ required: true, message: 'Rdb版本不能为空', trigger: 'blur' }]
        }
      },
      showRdbTask: {
        dialogShowTaskFormVisible: false,
        temp: {
          id: '',
          redis_version: null,
          rdb_version: null
        }
      },
      dialogStatus: '',
      textMap: {
        update: '编辑映射关系',
        create: '创建映射关系',
        showTaskData: '任务详情'
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // 设置定时器，每3秒刷新一次
    // this.timer = setInterval(getListData,1000)
    // function getListData() {
    //   const { data } = getTaskList({ regulation: 'all' })
    //   // alert(JSON.stringify(data))
    //   this.list = data
    //   // this.getListWithOutLoading()
    // }
    // getListData()
  },
  watch: {
    list() {
      this.timer()
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  },
  methods: {
    getList() {
      this.listLoading = true
      getRdbListByPage(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalNum
      })
      // const { data } = await getRdbListByPage(this.listQuery)
      // alert(JSON.stringify(data))
      // this.list = data
      this.listLoading = false
    },
    async getListWithOutLoading() {
      getRdbListByPage(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalNum
      })
    },
    timer() {
      return setTimeout(() => {
        this.getListWithOutLoading()
      } ,3000)
    },
    async deleteRDBTask(row, index) {
      this.listLoading = true
      var object = {
        id: row.id,
        redis_version: row.redis_version,
        rdb_version: row.rdb_version
      }
      const res = await deleteRdbList(object)
      if (res.msg === 'success') {
        this.list.splice(index, 1)
        this.$message({
          message: '删除映射关系成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '删除映射关系失败[' + res.msg + ']',
          type: 'error'
        })
      }
      this.listLoading = false
    },
    async insertRDBTask(row) {
      this.listLoading = true
      const res = await insertRdbList(row)
      if (res.msg === 'success') {
        this.addRdbData.dialogFormVisible = false
        this.addRdbData.taskForm.rdb_version = null
        this.addRdbData.taskForm.redis_version = null
        this.$message({
          message: '添加映射关系成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '添加映射关系失败[' + res.msg + ']',
          type: 'error'
        })
      }
      this.listLoading = false
    },
    async updateRDBTask(row) {
      this.listLoading = true
      const res = await updateRdbList(row)
      if (res.msg === 'success') {
        this.addRdbData.dialogFormVisible = false
        this.addRdbData.taskForm.rdb_version = null
        this.addRdbData.taskForm.redis_version = null
        this.$message({
          message: '修改映射关系成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '修改映射关系失败[' + res.msg + ']',
          type: 'error'
        })
      }
      this.listLoading = false
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    onSelectTasktype(event) {
      this.$forceUpdate()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    ResettaskForm() {
      // 重置添加表单
      this.$refs['taskForm'].resetFields()
      this.addRdbData.taskForm.rdb_version = null
      this.addRdbData.taskForm.redis_version = null
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.addRdbData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['taskForm'].clearValidate()
      })
    },
    insertRdbData() {
      this.$refs['taskForm'].validate((valid) => {
        if (valid) {
          if( this.addRdbData.taskForm.redis_version == null ){
            this.$message({
              message: 'redis_version不能为空',
              type: 'error'
            })
            return null
          }else if( this.addRdbData.taskForm.rdb_version == null ){
            this.$message({
              message: 'rdb_version',
              type: 'error'
            })
            return null
          }
          if( this.dialogStatus === 'create' ) {
            this.insertRDBTask(this.addRdbData.taskForm)
          }else if( this.dialogStatus === 'update' ) {
            this.updateRDBTask(this.addRdbData.taskForm)
          }
          this.$nextTick(() => {
            this.$refs['taskForm'].clearValidate()
          })
        }
      })

    },
    handleDelete(rows, index) {
      // 删除任务信息

      this.deleteRDBTask(rows, index)
    },
    handleUpdate(rows, index) {
      // 删除任务信息
      this.dialogStatus = 'update'
      this.addRdbData.taskForm.id = rows.id
      this.addRdbData.taskForm.rdb_version = rows.rdb_version
      this.addRdbData.taskForm.redis_version = rows.redis_version
      this.addRdbData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['taskForm'].clearValidate()
      })
    }
  }
}
</script>
<style>
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
