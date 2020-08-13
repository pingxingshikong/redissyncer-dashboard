<template>
  <div class="app-container">

    <!--    <div class="filter-container">-->
    <!--      <el-input v-model="listParam.title" placeholder="任务信息" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
    <!--&lt;!&ndash;      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">&ndash;&gt;-->
    <!--&lt;!&ndash;        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />&ndash;&gt;-->
    <!--&lt;!&ndash;      </el-select>&ndash;&gt;-->
    <!--&lt;!&ndash;      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">&ndash;&gt;-->
    <!--&lt;!&ndash;        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />&ndash;&gt;-->
    <!--&lt;!&ndash;      </el-select>&ndash;&gt;-->
    <!--      <el-select v-model="listParam.regulation" style="width: 140px" class="filter-item" @change="handleFilter">-->
    <!--        <el-option v-for="item in regulationList" :key="item.key" :label="item.label" :value="item.key" />-->
    <!--      </el-select>-->
    <!--&lt;!&ndash;      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">&ndash;&gt;-->
    <!--&lt;!&ndash;        查询&ndash;&gt;-->
    <!--&lt;!&ndash;      </el-button>&ndash;&gt;-->
    <!--&lt;!&ndash;      @click="add.dialogFormVisible = true"&ndash;&gt;-->
    <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"   @click="handleCreate" >-->
    <!--        新建任务组-->
    <!--      </el-button>-->
    <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"   @click="handleCreate" >-->
    <!--        新建文件任务-->
    <!--      </el-button>-->
    <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"   @click="handleCreate" >-->
    <!--        导出任务信息-->
    <!--      </el-button>-->
    <!--    </div>-->
    <div class="filter-container">
      <el-select v-model="searchParam.regulation" placeholder="查询规则" clearable style="width: 200px"
                 class="filter-item" @change="showByRegulation(searchParam.regulation)">
        <el-option v-for="item in regulationOptions" :key="item" :label="item"
                   :value="item"/>
      </el-select>
      <el-input v-if="bynames" v-model="searchParam.tasknames"
                placeholder="任务名"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-if="byids" v-model="searchParam.taskids" placeholder="任务ID" style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-if="byGroupids" v-model="searchParam.groupIds" placeholder="任务组ID" style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-if="bystatus" v-model="searchParam.taskstatus" placeholder="任务状态" clearable
                 style="width: 200px"
                 class="filter-item">
        <el-option v-for="item in taskStatusOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <!--      <el-select v-model="listParam.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>-->
      <!--      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        创建同步任务
      </el-button>
<!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"-->
<!--                 @click="handleImportFile">-->
<!--        从文件导入-->
<!--      </el-button>-->
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
      <el-table-column label="任务ID" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.taskId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务组ID" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.groupId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="155px" align="center">
        <template slot-scope="{row}">
          <!--<span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.taskName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="源Redis节点地址" min-width="170px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.sourceRedisAddress }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Type" class-name="status-col" width="120">
        <template slot-scope="{row}">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="右上角百分比为[全量同步]进度">
            <el-badge :value="row.rate2Int+'%'" class="item" slot="reference" :type=" row.status| jinduFilter ">
              <el-tag type="success">
                {{ row.syncType | syncTypeFilter }}
              </el-tag>
            </el-badge>
          </el-popover>

        </template>
      </el-table-column>

      <el-table-column label="Status" class-name="status-col" width="130">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status| statusDataFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="startTaskFilter(row.status)" size="mini" type="success" @click="handleStartTask(row)">
            启动
          </el-button>
          <el-button v-if="stopTaskFilter(row.status)" size="mini" type="warning" @click="handleStopTask(row)">
            停止
          </el-button>
          <el-button type="primary" size="mini" @click="showTaskData(row)">
            详情
          </el-button>
          <!--          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">-->
          <!--            编辑-->
          <!--          </el-button>-->
          <!--          v-if="row.status!='deleted'"-->


          <el-button slot="reference" size="mini" :type="row.status | deleteTaskButtion"
                     :plain="row.status | deleteButtionStatus" :disabled="row.status | deleteButtionStatus"
                     @click="handleDelete(row)">
            删除
          </el-button>


        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listParam.currentPage" :limit.sync="listParam.pageSize"
                @pagination="getList"/>


    <el-dialog fullscreen :title="textMap[dialogStatus]" :visible.sync="add.dialogFormVisible" width="100%"
               height="100%" top="0px">
      <!--      <el-row :gutter="20">-->
      <!--        <el-col :span="8" :offset="1">-->
      <el-form
        ref="taskForm"
        :model="addTask.taskForm"
        :rules="addTask.taskrules"
        :label-position="labelPosition"
        label-width="120px"
      >
        <el-form-item>

          <strong style="color: red" v-show="addTask.fromRedis">*&nbsp;</strong><strong v-show="addTask.fromRedis">任务类型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
          <el-select
            v-model="addTask.taskForm.tasktype"
            v-show="addTask.fromRedis"
            placeholder="任务类型"
            pron="tasktype"
            @change="onSelectTasktype($event)"
          >
            <el-option
              v-for="item in addTask.tasktypeoptions"
              :key="item.lable"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <strong
            style="color: red">*&nbsp;</strong><strong>同步类型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
          <el-select
            v-model="addTask.taskForm.synctype"
            placeholder="同步类型"
            @change="onSelectSyncype($event)"
          >
            <el-option
              v-for="item in addTask.synctypeoptions"
              :key="item.lable"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

        </el-form-item>

        <el-form-item prop="taskName" >
          <label style="display:inline-block; width: 120px;" ><span style="color:red;">* </span>任务名称 </label>
          <el-input
            v-model="addTask.taskForm.taskName"
            placeholder="任务名称" style="width: 60%"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="addTask.fromFile" prop="fileaddress" >
          <label style="display:inline-block; width: 120px;"><span style="color:red;">* </span>文件路径</label>

          <el-input
            v-model="addTask.taskForm.fileAddress"
            placeholder="http://127.0.0.1:8888/file/example.rdb" style="width: 60%"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="addTask.fromRedis" prop="sourceRedisAddress">
          <label style="display:inline-block; width: 120px;"><span style="color:red;">* </span>源redis地址 </label>

          <el-input
            v-model="addTask.taskForm.sourceRedisAddress"
            placeholder="127.0.0.1:6379" style="width: 60%"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="addTask.fromRedis" prop="sourcePassword">
          <label style="display:inline-block; width: 120px;">&nbsp;&nbsp;&nbsp;源redis密码 </label>
          <el-input
            v-model="addTask.taskForm.sourcePassword"
            placeholder style="width: 60%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="targetRedisAddress">
          <label style="display:inline-block; width: 120px;"><span style="color:red;">* </span>目标redis地址 </label>
          <el-input
            v-model="addTask.taskForm.targetRedisAddress"
            placeholder="127.0.0.1:6379" style="width: 60%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="targetPassword" >
          <label style="display:inline-block; width: 120px;">&nbsp;&nbsp;&nbsp;目标redis密码 </label>
          <el-input
            v-model="addTask.taskForm.targetPassword"
            placeholder style="width: 60%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="targetRedisVersion" >

          <label style="display:inline-block; width: 120px;"><span style="color:red;">* </span>目标redis版本 </label>
          <el-select v-model="addTask.taskForm.targetRedisVersion" placeholder @change="onSelectTasktype($event)">
            <el-option
              v-for="item in addTask.targetRedisVersionOptions"
              :key="item.lable"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="autostart" >
          <label style="display:inline-block; width: 120px;"><span style="color:red;">* </span>是否自动启动 </label>

          <el-switch v-model="addTask.taskForm.autostart" active-text="自动启动" inactive-text="手动启动"></el-switch>
        </el-form-item>
      </el-form>
      <center>
      <el-button type="primary" size="mini" @click="ResettaskForm">重置</el-button>
      <el-popover
        placement="top-start"
        title="JSON"
        width="20%"
        trigger="click">

        <el-card class="box-card">
          <el-input
            border-radius="0"
            type="textarea"
            style="margin: 0px auto 0px;max-width: 100%; text-align: center"
            v-model="rowcontent"
            rows="20"
            cols="60"
          ></el-input>
        </el-card>
        <el-button @click="onClickDrawer" type="info" slot="reference" size="mini">JSON</el-button>
      </el-popover>
      </center>
      <div slot="footer" class="dialog-footer" style="margin-top: -20px">
        <el-button @click="add.dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addTask.dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="add.dialogStartVisible" width="400px"
               center>
      <el-form
        ref="startForm"
        :model="startForm"
        :label-position="'center'"
        label-width="120px"
        label="是否重新开始任务"
      >
        <el-form-item prop="afresh">
          <el-switch v-model="startForm.afresh" active-text="重新开始" inactive-text="继续任务"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add.dialogStartVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="startTaskByButton">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="showTask.dialogShowTaskFormVisible">
      <div>
        <div style="height:300px;">
          <el-scrollbar style="height:100%">
            <el-tag>全量同步进度:</el-tag>
            <el-progress type="circle" :percentage="showTask.temp.rate2Int"></el-progress>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>任务ID:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.taskId}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>任务组ID:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.groupId}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>任务名称:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.taskName}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>源Redis地址:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.sourceRedisAddress}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>目标Redis地址:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.targetRedisAddress}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>数据文件地址:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.fileAddress}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>创建任务后自动启动:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.autostart}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>数据当前非续传:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.afresh}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>数据提交批次大小:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.batchSize}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>任务信息:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.taskMsg}}</span>
            </div>

            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>offset记录值:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.offset}}</span>
            </div>

            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>replId记录值:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.replId}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>任务运行状态:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.status}}</span>
              <el-tag :type="showTask.temp.status | statusFilter">
                {{ showTask.temp.status| statusDataFilter }}
              </el-tag>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>目标Redis版本:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.redisVersion}}</span>
            </div>

            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>目标Redis RDB版本:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.rdbVersion}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>任务类型:</el-tag>
              <el-divider direction="vertical"></el-divider>
              <span>{{showTask.temp.syncType}}</span>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-tag>同步DB映射关系:</el-tag>
              <!--              <el-divider direction="vertical"></el-divider>-->
              <el-table
                :data="showTask.temp.dbMapper"
                border
                style="width: 100%">
                <el-table-column
                  fixed
                  prop="sourceRedis"
                  label="源RedisDB库"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="targetRedis"
                  label="目标RedisDB库"
                  width="120">
                </el-table-column>
              </el-table>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
              <el-divider direction="vertical"></el-divider>
              <span></span>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getTaskListByPage,
    createTask,
    getDataParam,
    removeTaskByIds,
    stopTaskByIds,
    startTaskByIds,
    createImportFileTask
  } from '@/api/syncer/tasklist'
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination'

  const calendarTypeOptions = [
    {key: 'CN', display_name: 'China'},
    {key: 'US', display_name: 'USA'},
    {key: 'JP', display_name: 'Japan'},
    {key: 'EU', display_name: 'Eurozone'}
  ]

  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    filters: {
      statusFilter(status) {
        const statusMap = {
          CREATING: 'info',
          CREATED: 'info',
          STOP: 'info',
          RDBRUNING: 'success',
          COMMANDRUNING: 'success',
          RUN: 'success',
          BROKEN: 'danger'
        }
        return statusMap[status]
      },
      statusDataFilter(status) {
        const statusMap = {
          CREATING: '正在创建',
          CREATED: '创建完成',
          STOP: '任务停止',
          RDBRUNING: '全量同步进行中',
          COMMANDRUNING: '增量同步进行中',
          RUN: '任务运行成功',
          BROKEN: '任务异常'
        }
        return statusMap[status]
      },
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
      jinduFilter(status) {
        const statusMap = {
          CREATING: 'info',
          CREATED: 'info',
          STOP: 'info',
          RDBRUNING: 'danger',
          COMMANDRUNING: 'info',
          RUN: 'info',
          BROKEN: 'info'
        }
        return statusMap[status]
      },
      deleteButtionStatus(status) {
        const statusMap = {
          CREATING: true,
          CREATED: true,
          STOP: false,
          RDBRUNING: true,
          COMMANDRUNING: true,
          RUN: true,
          BROKEN: false
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      },
      syncTypeFilter(syncType) {
        const syncTypeMap = {
          SYNC: '在线同步',
          RDB: 'RDB数据文件',
          AOF: 'AOF日志文件',
          ONLINERDB: '在线RDB数据文件',
          ONLINEAOF: '在线AOF日志文件',
          MIXED: '混合数据文件',
          ONLINEMIXED: '在线混合数据文件'
        }
        return syncTypeMap[syncType]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        searchParam: {
          regulation: 'all',
          taskids: null,
          tasknames: null,
          taskstatus: null,
          groupIds: null

        },
        listParam: {
          title: '查询参数',
          regulation: 'all',
          currentPage: 1,
          pageSize: 10,
          taskids: null,
          tasknames: null,
          taskstatus: null,
          groupIds: null
        },
        jsonstr: null,
        drawer: false,
        obj: null,
        bynames: false,
        byids: false,
        byGroupids: false,
        bystatus: false,
        labelPosition: 'left',
        importanceOptions: [1, 2, 3],

        visible: false,
        regulationList: [
          {label: '全部任务', key: 'all'},
          {label: '全量任务', key: 'total'},
          {label: '增量任务', key: 'wd'}],
        searchRegulation: {
          ALL: "all",
          NAME: "bynames",
          IDS: "byids",
          STATUS: "bystatus",
          GroupIDS: "byGroupIds"
        },
        rowcontent: "",
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        regulationOptions: ['all', 'bynames', 'byids', 'bystatus', 'byGroupIds'],
        taskStatusOptions: ['creating', 'created', 'stop', 'run', 'pause', 'broken', 'rdbrunning', 'commandrunning'],
        startForm: {
          afresh: true,
          rows: null
        },
        add: {
          dialogTableVisible: false,
          dialogFormVisible: false,
          dialogStartVisible: false,
          form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          },
          formLabelWidth: '120px'
        },
        addTask: {
          taskForm: {
            fileAddress: '',
            tasktype: '',
            synctype: '',
            taskName: '',
            sourceRedisAddress: '',
            sourcePassword: '',
            targetRedisAddress: '',
            targetPassword: '',
            targetRedisVersion: '',
            autostart: true,
            afresh: true,
            batchSize: 1500
          },
          fromRedis: true,
          fromFile: false,
          tasktypeoptions: [
            {value: 'total', label: '全部数据'},
            {value: 'stockonly', label: '全量数据'},
            {value: 'incrementonly', label: '增量实时数据'}
          ],
          synctypeoptions: [
            {value: 'SYNC', label: '在线同步'},
            {value: 'RDB', label: 'RDB数据文件导入'},
            {value: 'ONLINERDB', label: '在线RDB数据文件导入'},
            {value: 'AOF', label: 'AOF数据文件导入'},
            {value: 'ONLINEAOF', label: '在线AOF数据文件导入'},
            {value: 'MIXED', label: '混合数据文件导入'},
            {value: 'ONLINEMIXED', label: '在线混合数据文件导入'}
          ],
          targetRedisVersionOptions: [
            {value: '6.0', label: '6.0'},
            {value: '5.0', label: '5.0'},
            {value: '4.0', label: '4.0'},
            {value: '3.2', label: '3.2'},
            {value: '3.0', label: '3.0'},
            {value: '2.8', label: '2.8'},
            {value: '2.6', label: '2.6'}
          ],
          taskrules: {
            sourceFile: [{required: true, message: '文件地址不能为空', trigger: 'blur'}],
            tasktype: [{required: true, message: '请选择任务类型', trigger: 'blur'}],
            sourceaddr: [{required: true, message: '源地址不能为空', trigger: 'blur'}],
            targetaddr: [{required: true, message: '目标地址不能为空', trigger: 'blur'}]
          }
        },
        showTask: {
          dialogShowTaskFormVisible: false,
          temp: [{
            taskId: '',
            groupId: '',
            taskName: '',
            sourceRedisAddress: '',
            targetRedisAddress: '',
            fileAddress: '',
            autostart: true,
            afresh: true,
            batchSize: 1500,
            tasktype: '',
            offsetPlace: '',
            taskMsg: '',
            offset: -1,
            status: '',
            redisVersion: '',
            rdbVersion: '',
            syncType: '',
            dbMapper: [],
            createTime: '',
            updateTime: '',
            replId: '',
            rate: 0.0,
            rate2Int: 0
          }]
        },
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: '创建同步任务',
          showTaskData: '任务详情'
        }
      }
    },
    created() {
      // this.getList();
      this.getList()
      // alert('111')
      // getTaskList(this.listParam).then(response => alert(JSON.stringify(response.data))).catch(err => {
      //   console.warn(err.message)
      // })
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
      async getList() {
        this.listLoading = true
        getTaskListByPage(this.listParam).then(response => {
          this.list = response.data.items
          this.total = response.data.totalNum
        })
        this.listLoading = false
      },
      async getListWithOutLoading() {
        getTaskListByPage(this.listParam).then(response => {
          this.list = response.data.items
          this.total = response.data.totalNum
        })
      },
      timer() {
        return setTimeout(() => {
          this.getListWithOutLoading()
        }, 3000)
      },
      async deleteTask(ids) {
        this.listLoading = true
        const {data} = await removeTaskByIds(ids)
        if (getDataParam(data, ids[0]).msg === 'Delete successful') {
          this.$message({
            message: '删除任务成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '删除任务成功',
            type: 'error'
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
        // this.listLoading = false
      },
      async startTask(id, afresh) {
        this.listLoading = true

        const {data} = await startTaskByIds(id, afresh)
        if (getDataParam(data, id).msg === 'OK') {
          this.$message({
            message: '启动任务成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '启动任务失败',
            type: 'error'
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
        // this.listLoading = false
      },
      async stopTask(ids) {
        this.listLoading = true
        const {data} = await stopTaskByIds(ids)
        if (getDataParam(data, ids[0]).msg === 'Task stopped successfully') {
          this.$message({
            message: '停止任务成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '停止任务失败',
            type: 'error'
          })
        }
        this.listLoading = false
      },
      handleFilter() {
        // this.listQuery.page = 1
        // this.getList()

        if (this.searchParam.regulation == this.searchRegulation.NAME) {
          if (this.searchParam.tasknames == null || this.searchParam.tasknames == '') {
            this.$message({
              message: '任务名不能为空',
              type: 'error'
            })
            return
          } else {
            this.listParam.tasknames = [this.searchParam.tasknames]
          }

        } else if (this.searchParam.regulation == this.searchRegulation.IDS) {
          if (this.searchParam.taskids == null || this.searchParam.taskids == '') {
            this.$message({
              message: '任务ID不能为空',
              type: 'error'
            })
            return null
          } else {
            this.listParam.taskids = [this.searchParam.taskids]
          }

        } else if (this.searchParam.regulation == this.searchRegulation.STATUS) {
          if (this.searchParam.taskstatus == null || this.searchParam.taskstatus == '') {
            this.$message({
              message: '任务状态不能为空',
              type: 'error'
            })
            return null
          } else {
            this.listParam.taskstatus = this.searchParam.taskstatus
          }
        } else if (this.searchParam.regulation == this.searchRegulation.GroupIDS) {
          if (this.searchParam.groupIds == null || this.searchParam.groupIds == '') {
            this.$message({
              message: '任务组ID不能为空',
              type: 'error'
            })
            return null
          } else {
            this.listParam.groupIds = [this.searchParam.groupIds]
          }
        }

        this.listParam.regulation = this.searchParam.regulation
        this.getList()

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
      onSelectSyncype(event) {


        this.$forceUpdate()

        if (this.addTask.taskForm.synctype == "SYNC") {
          this.addTask.fromFile = false
          this.addTask.fromRedis = true
        } else {
          this.addTask.fromFile = true
          this.addTask.fromRedis = false
        }
      },
      getSortClass: function (key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      },
      ResettaskForm() {
        // 重置添加表单
        this.$refs['taskForm'].resetFields()
        this.jsonstr = null
      },
      onClickDrawer() {
        const object = {}
        object['tasktype'] = this.addTask.taskForm.tasktype
        object['taskname'] = this.addTask.taskForm.taskname
        object['sourceaddress'] = this.addTask.taskForm.sourceaddr
        object['sourcepassword'] = this.addTask.taskForm.sourcepassword
        object['targetaddress'] = this.addTask.taskForm.targetaddress
        object['targetpassword'] = this.addTask.taskForm.targetpassword
        object[
          'targetRedisVersionOptions'] = this.addTask.taskForm.targetRedisVersionOptions
        object['autostart'] = this.addTask.taskForm.autostart
        this.drawer = true
        this.rowcontent = JSON.stringify(object, undefined, 2)
        // this.jsonstr = object;
      },
      handleCreate() {
        this.addTask.taskForm.synctype = this.addTask.synctypeoptions[0].label
        this.addTask.taskForm.tasktype = this.addTask.tasktypeoptions[0].label

        this.addTask.dialogStatus = 'create'
        this.dialogStatus = 'create'
        this.add.dialogFormVisible = true
        this.addTask.fromRedis = true
        this.addTask.fromFile = false
        this.$nextTick(() => {
          this.$refs['taskForm'].clearValidate()
        })
      },
      startTaskFilter(status) {
        const statusMap = {
          CREATING: false,
          CREATED: false,
          STOP: true,
          RDBRUNING: false,
          COMMANDRUNING: false,
          RUN: false,
          BROKEN: true
        }
        return statusMap[status]
      },
      stopTaskFilter(status) {
        const statusMap = {
          CREATING: true,
          CREATED: true,
          STOP: false,
          RDBRUNING: true,
          COMMANDRUNING: true,
          RUN: true,
          BROKEN: false
        }
        return statusMap[status]
      },
      createData() {


        // alert(JSON.stringify(this.addTask.taskForm))

        if (this.addTask.fromRedis === true && this.addTask.fromFile === false) {
          this.$refs['taskForm'].validate((valid) => {
            if (valid) {

              if(this.addTask.taskForm.targetRedisVersion === ''||  this.addTask.taskForm.targetRedisVersion === null ){
                this.$message({
                  message: '目标Redis版本不能为空',
                  type: 'error'
                })
                return
              }else if(this.addTask.taskForm.targetRedisAddress === ''||  this.addTask.taskForm.targetRedisAddress === null ){
                this.$message({
                  message: '目标地址不能为空',
                  type: 'error'
                })
                return
              }

              createTask(this.addTask.taskForm).then(response => {
                this.sleep(1500).then(() => {
                  this.getListWithOutLoading()
                })
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.add.dialogFormVisible = false
                setTimeout(() => {
                  this.listLoading = false
                }, 1 * 1000)
              })

            }
          })


        } else if (this.addTask.fromRedis === false &&  this.addTask.fromFile === true) {
          if (this.addTask.taskForm.fileAddress === ''||  this.addTask.taskForm.fileAddress === null ){
            this.$message({
              message: '文件路径不能为空',
              type: 'error'
            })
            return
          }else if(this.addTask.taskForm.taskName === ''||  this.addTask.taskForm.taskName === null ){
            this.$message({
              message: '任务名称不能为空',
              type: 'error'
            })
            return
          }else if(this.addTask.taskForm.targetRedisAddress === '' ||  this.addTask.taskForm.targetRedisAddress === null ){
            this.$message({
              message: '目标地址不能为空',
              type: 'error'
            })
            return
          }else if(this.addTask.taskForm.targetRedisVersion === '' || this.addTask.taskForm.targetRedisVersion === null ){
            this.$message({
              message: '目标Redis版本不能为空',
              type: 'error'
            })
            return
          }

            createImportFileTask(this.addTask.taskForm).then(response => {
              this.sleep(1500).then(() => {
                this.getListWithOutLoading()
              })
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.add.dialogFormVisible = false
              setTimeout(() => {
                this.listLoading = false
              }, 1 * 1000)
            })
        }


        // this.$refs['taskForm'].validate((valid) => {
        //   if (valid) {
        //     this.taskForm.id = parseInt(Math.random() * 100) + 1024 // mock a id
        //     const row = {}
        //     row["id"] = parseInt(Math.random() * 100) + 1024
        //     row["timestamp"] = new Date().getTime()
        //     this.temp.author = 'vue-element-admin'
        //     createArticle(row).then(() => {
        //       // this.list.unshift(row)
        //       this.dialogFormVisible = false
        //       this.$notify({
        //         title: '成功',
        //         message: '创建成功',
        //         type: 'success',
        //         duration: 2000
        //       })
        //     })
        //   }
        // })
      },
      updateData() {
        // this.$refs['taskForm'].validate((valid) => {
        //   if (valid) {
        //     const tempData = Object.assign({}, this.temp)
        //     tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        //     updateArticle(tempData).then(() => {
        //       const index = this.list.findIndex(v => v.id === this.temp.id)
        //       this.list.splice(index, 1, this.temp)
        //       this.dialogFormVisible = false
        //       this.$notify({
        //         title: '成功',
        //         message: '更新成功',
        //         type: 'success',
        //         duration: 2000
        //       })
        //     })
        //   }
        // })
      },
      showTaskData(row) {
        // 展示任务详情
        this.showTask.temp = Object.assign({}, row) // copy obj
        this.showTask.temp.dbMapper = []
        for (var idata in row.dbMapper) {
          if (idata != null && idata !== '') {
            this.showTask.temp.dbMapper.push({sourceRedis: idata, targetRedis: row.dbMapper[idata]})
          }
        }
        this.dialogStatus = 'showTaskData'
        this.showTask.dialogShowTaskFormVisible = true
        // this.$nextTick(() => {
        //   this.$refs['showTaskForm'].clearValidate()
        // })
      },
      handleDelete(rows) {
        // 删除任务信息
        this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var data = []
          data.push(rows.taskId)
          this.deleteTask(data)
          this.getListWithOutLoading()
        }).catch(() => {
          //几点取消的提示
        })
      },
      handleStartTask(rows) {
        // 启动任务信息
        if (rows.offset > -1) {
          this.startForm.rows = rows
          this.startForm.afresh = rows.afresh
          this.add.dialogStartVisible = true
        } else {
          // 删除任务信息
          this.$confirm('此操作将启动该同步任务, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.startTask(rows.taskId, true)
            this.getListWithOutLoading()
          }).catch(() => {
            this.$message({
              message: '取消启动任务成功',
              type: 'success'
            })
            //几点取消的提示
          })

        }
      },
      handleStopTask(rows) {
        // 停止任务信息
        this.$confirm('此操作将停止该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var data = []
          data.push(rows.taskId)
          this.stopTask(data)
          this.getListWithOutLoading()
        }).catch(() => {
          //几点取消的提示
        })

      },
      showByRegulation(regulation) {
        if (regulation === 'all') {
          this.bynames = false
          this.byids = false
          this.bystatus = false
          this.byGroupids = false
        }
        if (regulation === 'bynames') {
          this.bynames = true
          this.byids = false
          this.bystatus = false
          this.byGroupids = false
        }
        if (regulation === 'byids') {
          this.bynames = false
          this.byids = true
          this.bystatus = false
          this.byGroupids = false
        }
        if (regulation === 'bystatus') {
          this.bynames = false
          this.byids = false
          this.bystatus = true
          this.byGroupids = false
        }
        if (regulation === 'byGroupIds') {
          this.bynames = false
          this.byids = false
          this.bystatus = false
          this.byGroupids = true
        }

      },
      handleImportFile() {
        // this.resetTemp()
        // this.dialogStatus = 'create'
        // this.dialogFormVisible = true
        // this.fromRedis = false
        // this.fromFile = true
        // this.$nextTick(() => {
        //   this.$refs['taskForm'].clearValidate()
        //   this.$refs["taskForm"].resetFields()
        // })
      },
      startTaskByButton() {

        this.startTask(this.startForm.rows.taskId, this.startForm.afresh)

        this.add.dialogStartVisible = false
      },
      sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time))
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
