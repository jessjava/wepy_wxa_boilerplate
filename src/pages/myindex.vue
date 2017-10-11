<template>
  <view class="container">
      hello world
  </view>
</template>
<script>
    import wepy from 'wepy'
    import auth from '../interfaces/auth'

    export default class myIndex extends auth {
        config = {
            navigationBarTitleText: '测试首页'
        }

        async onLoad(){
            let sup_result = await super.onLoad();
            console.log("sup_result",sup_result)
            if (! sup_result) return;
            console.log("myindex Page is onload");
        }
    }
</script>
