<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
<!--        <search id="header-search" class="right-menu-item" />-->

<!--        <error-log class="errLog-container right-menu-item hover-effect" />-->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img src="http://onlinefile.i1314i.com/logo1.png" width="20px" height="20px" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
<!--          <router-link to="/profile/index">-->
<!--            <el-dropdown-item>Profile</el-dropdown-item>-->
<!--          </router-link>-->
          <router-link to="/">
            <el-dropdown-item>返回首页</el-dropdown-item>
          </router-link>
          <a  href="javascript:void(0)" @click="changepasswordDialogVisible = true">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <a target="_blank" href="https://tracenature.github.io/redissyncer-docs/#/">
            <el-dropdown-item>使用文档</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dialog
        title="修改密码"
        :visible.sync="changepasswordDialogVisible"
        width="30%">
<!--        :before-close="handleClose">-->
        <div>
          <el-form
            label-width="80px"
          >

          <el-form-item label="旧密码">
            <el-input v-model="changeUser.password" placeholder="请输入旧密码"></el-input>
          </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="changeUser.newPassword" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="changeUser.newPassword2" placeholder="请再次输入旧密码"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="changepasswordDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="changePasswordSubbmit()">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>


</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import {changePassword} from "@/api/user";
import {getTaskListByPage, startTaskByIds} from "@/api/syncer/tasklist";

export default {
  data() {
    return {
      changepasswordDialogVisible: false,
      changeUser: {
        password: '',
        newPassword: '',
        newPassword2: ''
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    changePasswordSubbmit(){


      if(this.changeUser.password==null||this.changeUser.password==''){
        this.$message({
          message: '旧密码不能为空',
          type: 'error'
        })
        return
      }
      if(this.changeUser.newPassword==null||this.changeUser.newPassword==''){
        this.$message({
          message: '新密码不能为空',
          type: 'error'
        })
        return
      }
      if(this.changeUser.newPassword2==null||this.changeUser.newPassword2==''){
        this.$message({
          message: '新密码不能为空',
          type: 'error'
        })
        return
      }
      if(this.changeUser.newPassword!=this.changeUser.newPassword2){
        this.$message({
          message: '两次新密码输入不一致',
          type: 'error'
        })
        return
      }
      changePassword(this.changeUser).then(response => {
        if(response.code==='2000'){
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.changepasswordDialogVisible = false
        }
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
