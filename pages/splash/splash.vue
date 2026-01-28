<template>
  <view class="splash-container">
    <image 
      src="https://workyean.oss-cn-beijing.aliyuncs.com/static/heropage.jpg" 
      class="splash-image"
      mode="aspectFit"
    ></image>
  </view>
</template>

<script>
export default {
  onLoad: function() {
    var self = this
    
    // 2.5秒后跳转到登录页
    setTimeout(function() {
      uni.redirectTo({
        url: '/pages/login/login'
      })
    }, 2500)
  }
}
</script>

<style lang="scss" scoped>
.splash-container {
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-image {
  width: 100%;
  height: 100%;
}
</style>

