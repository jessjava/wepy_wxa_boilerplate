import wepy from 'wepy';

export default class auth extends wepy.page {
    async onLoad(options) {
        //console.log('globalDataInfo',this.$parent.globalData)
        if (this.$parent.globalData.appPrepare){
            console.log("> super onload : waiting for app ready")
            await this.$parent.globalData.getPrepareState()
            console.log("> super onload : now app is ready")
        }
        return true;
    }
}