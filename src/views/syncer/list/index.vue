<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.regulation"
        placeholder="查询规则"
        clearable
        style="width: 100px"
        class="filter-item"
        @change="showByRegulation(listQuery.regulation)"
      >
        <el-option
          v-for="item in regulationOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-input
        v-if="bynames"
        v-model="listQuery.tasknames"
        :placeholder="$t('table.taskName')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-if="byids"
        v-model="listQuery.taskids"
        :placeholder="$t('table.taskID')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-if="bystatus"
        v-model="listQuery.taskstatus"
        :placeholder="$t('table.taskStatus')"
        clearable
        style="width: 100px"
        class="filter-item"
      >
        <el-option v-for="item in taskStatusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.fromRedis') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleImportFile"
      >
        {{ $t('table.fromfile') }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t('table.export') }}
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        {{ $t('table.reviewer') }}
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tasklist"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        :label="$t('table.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="200"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.taskId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.groupid')" prop="groupid" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.groupId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.taskname')"
        prop="taskName"
        align="center"
        width="200"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.source')" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row | sourceFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.target')" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.targetRedisAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        fixed="right"
        width="290"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-popover
            placement="top-start"
            title="详情"
            width="20%"
            trigger="click"
          >
            <span>传输进度</span>
            <el-progress :text-inside="true" :stroke-width="26" :percentage="70" />
            <span />
            <el-card class="box-card">
              <el-input
                v-model="rowcontent"
                border-radius="0"
                type="textarea"
                style="margin: 0px auto 0px;max-width: 100%; text-align: center"
                rows="20"
                cols="60"
              />
            </el-card>

            <el-button slot="reference" type="info" size="mini" @click="handlePopcontent(row)">
              {{ $t('table.taskdetails') }}
            </el-button>
          </el-popover>
          <!--          <el-button type="info" size="mini" @click="handleUpdate(row)">-->
          <!--            {{ $t('table.taskdetails') }}-->
          <!--          </el-button>-->
          <el-button
            v-if="!IsRunningStatus(row.status)"
            size="mini"
            type="success"
            @click="handleStart(row,row.status)"
          >
            {{ $t('table.start') }}
          </el-button>
          <el-button v-if="IsRunningStatus(row.status)" size="mini" @click="handletaskStop(row)">
            {{ $t('table.stop') }}
          </el-button>
          <el-button v-if="!IsRunningStatus(row.status)" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogStartVisible"
      width="400px"
      center
    >
      <el-form
        ref="startForm"
        :model="startForm"
        :label-position="'center'"
        label-width="120px"
        label="是否重新开始任务"
      >
        <el-form-item prop="afresh">
          <el-switch v-model="startForm.afresh" active-text="重新开始" inactive-text="继续任务" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStartVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="startTask">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="400px">
      <!--      <el-row :gutter="20">-->
      <!--        <el-col :span="8" :offset="1">-->
      <el-form
        ref="taskForm"
        :model="taskForm"
        :rules="taskrules"
        :label-position="labelPosition"
        label-width="120px"
      >
        <el-form-item v-show="fromRedis" prop="tasktype" label="任务类型">
          <el-select
            v-model="taskForm.tasktype"
            placeholder="任务类型"
            @change="onSelectTasktype($event)"
          >
            <el-option
              v-for="item in tasktypeoptions"
              :key="item.lable"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="taskName" label="任务名称">
          <el-input
            v-model="taskForm.taskName"
            placeholder="任务名称"
          />
        </el-form-item>
        <el-form-item v-show="fromFile" prop="fileaddress" label="文件路径 ">
          <el-input
            v-model="taskForm.fileaddress"
            placeholder="http://127.0.0.1:8888/file/example.rdb"
          />
        </el-form-item>
        <el-form-item v-show="fromRedis" prop="sourceRedisAddress" label="源redis地址">
          <el-input
            v-model="taskForm.sourceRedisAddress"
            placeholder="127.0.0.1:6379"
          />
        </el-form-item>
        <el-form-item v-show="fromRedis" prop="sourcePassword" label="源redis密码">
          <el-input
            v-model="taskForm.sourcePassword"
            placeholder
          />
        </el-form-item>
        <el-form-item prop="targetRedisAddress" label="目标redis地址">
          <el-input
            v-model="taskForm.targetRedisAddress"
            placeholder="127.0.0.1:6379"
          />
        </el-form-item>
        <el-form-item prop="targetPassword" label="目标redi密码">
          <el-input
            v-model="taskForm.targetPassword"
            placeholder
          />
        </el-form-item>
        <el-form-item prop="targetRedisVersion" label="目标redis版本">
          <el-select v-model="taskForm.targetRedisVersion" placeholder @change="onSelectTasktype($event)">
            <el-option
              v-for="item in targetRedisVersionOptions"
              :key="item.lable"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="autostart" label="是否自动启动">
          <el-switch v-model="taskForm.autostart" active-text="自动启动" inactive-text="手动启动" />
        </el-form-item>
      </el-form>
      <el-button type="primary" size="mini" @click="ResettaskForm">重置</el-button>
      <el-popover
        placement="top-start"
        title="JSON"
        width="20%"
        trigger="click"
      >

        <el-card class="box-card">
          <el-input
            v-model="rowcontent"
            border-radius="0"
            type="textarea"
            style="margin: 0px auto 0px;max-width: 100%; text-align: center"
            rows="20"
            cols="60"
          />
        </el-card>
        <el-button slot="reference" type="info" size="mini" @click="onClickDrawer">JSON</el-button>
      </el-popover>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { fetchtaskList, createTask, stopTask, removeTaskByIds, startTask } from '@/api/taskhandler'
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
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    sourceFilter(row) {
      if (row.fileAddress != '') {
        return row.fileAddress
      }
      if (row.sourceRedisAddress != '') {
        return row.sourceRedisAddress
      }
      return ''
    },
    statusFilter(status) {
      const statusMap = {
        CREATING: 'info',
        CREATED: 'success',
        STOP: 'success',
        RUN: 'primary',
        PAUSE: 'success',
        BROKEN: 'warning',
        RDBRUNNING: 'primary',
        COMMANDRUNNING: 'primary'
      }
      return statusMap[status]
    },
    jsonPrettyFilter(row) {
      return JSON.stringify(row, undefined, '\t')
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      drawer: false,
      jsonstr: null,
      obj: null,
      labelPosition: 'left',
      taskForm: {
        autostart: true,
        fileaddress: undefined,
        tasktype: undefined,
        taskName: undefined,
        sourceRedisAddress: undefined,
        sourcePassword: undefined,
        targetRedisAddress: undefined,
        targetPassword: undefined,
        targetRedisVersion: undefined
      },
      startForm: { afresh: true },
      popStartVisible: false,
      fromRedis: false,
      fromFile: false,
      rowcontent: '',
      tasktypeoptions: [
        { value: 'total', label: '全量复制' },
        { value: 'stockonly', label: '存量导入' },
        { value: 'incrementonly', label: '增量导入' }
      ],
      targetRedisVersionOptions: [
        { value: '5.0', label: '5.0' },
        { value: '4.0', label: '4.0' },
        { value: '3.0', label: '3.0' }
      ],
      tableKey: 0,
      contentjson: 'json',
      tasklist: null,
      total: 0,
      listLoading: true,
      listQuery: {
        regulation: 'all',
        taskids: '',
        tasknames: '',
        taskstatus: '',
        page: 1,
        limit: 20,
        sort: '+id'
      },
      bynames: false,
      byids: false,
      bystatus: false,
      lineobject: {},
      importanceOptions: [1, 2, 3],
      regulationOptions: ['all', 'bynames', 'byids', 'bystatus'],
      taskStatusOptions: ['creating', 'created', 'stop', 'run', 'pause', 'broken', 'rdbrunning', 'commandrunning'],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStartVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        start: 'Start'
      },
      dialogPvVisible: false,
      pvData: [],
      taskrules: {
        fileaddress: [{ required: this.fromFile, message: '文件地址不能为空', trigger: 'blur' }],
        tasktype: [{ required: true, message: '请选择任务类型', trigger: 'blur' }],
        sourceRedisAddress: [{ required: this.fromRedis, message: '源地址不能为空', trigger: 'blur' }],
        targetRedisAddress: [{ required: true, message: '目标地址不能为空', trigger: 'blur' }]
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    // this.getList()
    this.gettaskList()
  },
  methods: {
    ResettaskForm() {
      this.$refs['taskForm'].resetFields()
      this.jsonstr = null
    },
    IsRunningStatus(status) {
      const runningstatus = ['COMMANDRUNNING', 'RDBRUNNING', 'STARTING']
      if (runningstatus.indexOf(status) == -1) {
        return false
      }
      return true
    },
    showByRegulation(regulation) {
      if (regulation === 'all') {
        this.bynames = false
        this.byids = false
        this.bystatus = false
      }
      if (regulation === 'bynames') {
        this.bynames = true
        this.byids = false
        this.bystatus = false
      }
      if (regulation === 'byids') {
        this.bynames = false
        this.byids = true
        this.bystatus = false
      }
      if (regulation === 'bystatus') {
        this.bynames = false
        this.byids = false
        this.bystatus = true
      }
    },
    onSelectTasktype(event) {
      this.$forceUpdate()
    },
    onClickDrawer() {
      this.drawer = true
      // this.jsonstr = JSON.stringify(object, undefined, 2);
      // this.jsonstr = object;
      this.rowcontent = JSON.stringify(this.taskForm, undefined, 2)
    },
    onSubmit() {
      // console.log(this.form.source);
      // axios.post("http://127.0.0.1:9090/hello").then(console.log(Response));
      // axios.get("http://127.0.0.1:9090/hello").then(function(response) {
      //   console.log(response);
      // });
      // this.$refs["taskForm"].validate();
      console.log(this.taskForm.autostart)
      console.log(this.taskForm.tasktype)
    },
    gettaskList() {
      this.listLoading = true
      const query = {}
      if (this.listQuery.regulation == 'all') {
        query['regulation'] = 'all'
      }
      if (this.listQuery.regulation == 'bynames') {
        query['regulation'] = 'bynames'
        query['tasknames'] = this.listQuery.tasknames.split(';')
      }
      if (this.listQuery.regulation == 'byids') {
        query['regulation'] = 'byids'
        query['taskids'] = this.listQuery.taskids.split(';')
      }
      if (this.listQuery.regulation == 'bystatus') {
        query['regulation'] = 'bystatus'
        query['taskstatus'] = this.listQuery.taskstatus
      }
      fetchtaskList(query).then(response => {
        this.tasklist = response.data
        this.total = response.data.length
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.gettaskList()
    },
    handletaskStop(row) {
      const taskids = []
      const query = {}
      taskids.push(row.taskId)
      query['taskids'] = taskids
      stopTask(query).then(response => {
        this.gettaskList()
      })
      const rowquery = {
        'regulation': 'byids',
        'taskids': taskids
      }
      fetchtaskList(rowquery).then(response => {
        row = response.data[0]
      })
      this.$message({
        message: '操作成功',
        type: 'success'
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleStart(row, status) {
      this.lineobject['row'] = row
      this.lineobject['status'] = status
      // this.visible = true
      this.dialogStartVisible = true
    },
    startTask() {
      const row = this.lineobject['row']
      const query = {}
      query['taskid'] = row.taskId
      query['afresh'] = this.startForm.afresh
      console.log(query)
      startTask(query).then(response => {
        this.gettaskList()
      })
      this.$notify({
        title: '成功',
        message: '启动成功',
        type: 'success',
        duration: 2000
      })
      this.dialogStartVisible = false
      this.startForm.afresh = true
    },
    handleImportFile() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.fromRedis = false
      this.fromFile = true
      this.$nextTick(() => {
        this.$refs['taskForm'].clearValidate()
        this.$refs['taskForm'].resetFields()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.fromRedis = true
      this.fromFile = false
      this.$nextTick(() => {
        this.$refs['taskForm'].clearValidate()
        this.$refs['taskForm'].resetFields()
      })
    },
    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },
    createData() {
      this.$refs['taskForm'].validate((valid) => {
        if (valid) {
          createTask(this.taskForm).then(response => {
            this.sleep(1500).then(() => {
              this.gettaskList()
            })
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
          this.dialogFormVisible = false
        }
      })
    },
    handlePopcontent(row) {
      this.rowcontent = JSON.stringify(row, undefined, 2)
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['taskForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['taskForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      const ids = []
      ids.push(row.taskId)
      removeTaskByIds(ids).then(response => {
        this.tasklist.splice(index, 1)
      })
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
