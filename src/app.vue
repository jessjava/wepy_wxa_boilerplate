<style lang="less">
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
</style>

<script>
import wepy from 'wepy'
import 'wepy-async-function'

export default class extends wepy.app {
  config = {
    pages: [
      'pages/myindex',
      'pages/index'
    ],
    window: {
      backgroundTextStyle: 'drak',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'hello',
      navigationBarTextStyle: 'black'
    }
  }

  globalData = {
    appPrepare : true,
    getPrepareState: this.getPrepareState,
    get : this.Prequest('GET'),
    post : this.Prequest('POST'),
    userInfo: null,
    token: null
  }

  constructor () {
    super()
    this.use('requestfix')
    this.use('promisify')
  }

  async onLaunch() {
    let that = this;
    // this.testAsync()
    console.log("--- wxa onLaunch")
    that.globalData.appPrepare = true;
    await that.checktoken();
    that.globalData.appPrepare = false
    console.log("--- wxz launch ok")
  }
  
  async login(){
      console.log("into login method, we'll get token from server")
      let res1 = await wepy.login();
      let formdata = {code : res1.code}
      let res2 = await wepy.getUserInfo();
      formdata.userInfo = res2.userInfo;
      formdata.encryptedData = res2.encryptedData;
      formdata.iv = res2.iv;
      let token = "get from server use formdata";
      this.globalData.token = token ;
      wx.setStorageSync('user:token',token)
      
      return token
  }

  async checktoken(){
      let token = this.globalData.token || wx.getStorageSync('user:token');              
      if (!token){
          token = await this.login()
      }else{
          this.globalData.token = token
      }
      return token
  }

  Prequest(method) {
      let that = this;
      return function(url, data = {},header={}) {
          return new Promise(function(resolve, reject) {
              if(!that.globalData.token){
                  return reject('token is null')
              }
              //传递 token 信息
              let defaultheader = {
                'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${that.globalData.token}`
              };
              for (let key in header){
                  defaultheader[key] = header[key]
              }
              wx.request({
                  url,data,method,
                  header: defaultheader,
                  success: function(res) {
                      resolve(res.data)
                  },
                  fail: function(err) {
                      //TODO 可以考虑做服务端日志，统计失败情况
                      wx.hideLoading();
                      reject(err)
                  }
              });
          })
      }
  }

  getPrepareState(){
        return new Promise((resolve,reject)=>{
            let _inter 
            if (!this.appPrepare){
                console.log(">> ready to resolve prepare")
                resolve(true)
                return;
            }
            _inter = setInterval(()=>{
                if (!this.appPrepare){
                    console.log(">> ready to resolve prepare")
                    clearInterval(_inter)
                    resolve(true)
                    // return;
                }
            },50)            
        })
    }

  // sleep (s) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve('promise resolved')
  //     }, s * 1000)
  //   })
  // }

  // async testAsync () {
  //   const data = await this.sleep(3)
  //   console.log(data)
  // }

  // getUserInfo(cb) {
  //   const that = this
  //   if (this.globalData.userInfo) {
  //     return this.globalData.userInfo
  //   }
  //   wepy.getUserInfo({
  //     success (res) {
  //       that.globalData.userInfo = res.userInfo
  //       cb && cb(res.userInfo)
  //     }
  //   })
  // }
}
</script>
