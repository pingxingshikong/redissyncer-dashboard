<template>
  <div>
<!--  <remote-js src="https://cdn.bootcss.com/jquery/2.1.4/jquery.js"></remote-js>-->
<!--  <remote-js src="https://cdn.bootcss.com/sockjs-client/1.1.4/sockjs.min.js"></remote-js>-->
<!--  <remote-js src="https://cdn.bootcss.com/stomp.js/2.3.3/stomp.min.js"></remote-js>-->
  <button style="z-index: 99999" @click="openSocket()">开启日志</button><button style="z-index: 99999" onclick="closeSocket()">关闭日志</button>
  <div id="log-container" style="position:absolute;left:0;top:30px;width:100%;height:100%;height: 100%; overflow-y: scroll; background: #333; color: #aaa; padding: 10px;">
    <div v-for="log in logData" ref="chatMain">
      {{log}}<br/>
    </div>
  </div>
  </div>
</template>

<script>
  import SockJS from 'sockjs-client'
  import Stomp from 'stompjs'

  let stompClient=null

    export default {
      components: {
        'remote-js': {
          render(createElement) {
            return createElement('script', {attrs: {type: 'text/javascript', src: this.src}});
          },
          props: {
            src: { type: String, required: true}
          }
        }
      },
      name: "log",
      data(){
        return{
          // stompClient: null,
          logData: []
        }
      },
      methods: {
        openSocket(){
          if(stompClient==null){
            alert(JSON.stringify(this.logData))
            let socket = new SockJS('http://114.67.67.7:8080/websocket?token=kl')
            stompClient = Stomp.over(socket)
            var msgList=this.logData
            var dateFormat=this.dateFormat()
            stompClient.connect({token:"kl"}, function(frame) {
              stompClient.subscribe('/topic/pullLogger', function(event) {
                let content = JSON.parse(event.body)
                var msg = content.timestamp+" "+ content.level+" --- ["+ content.threadName+"] "+ content.className+"   :"+content.body
                msgList.push(msg)
              },{
                token:"kltoen"
              });
            });
          }
        },
         dateFormat(fmt, date) {
          let ret;
          const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
          };
          for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
              fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
          };
          return fmt;
        }
      },
      mounted(){
        this.$refs.chatMain.scrollTop = this.$refs.chatMain.scrollHeight
        // 监听window的resize事件
        window.onresize = () => {
          this.$refs.chatMain.scrollTop = this.$refs.chatMain.scrollHeight
        }
      }
    }
</script>

<style scoped>

</style>
