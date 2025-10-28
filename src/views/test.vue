<template>
  <div class="test-root-view-css">
    <div style="width: 100px;height: 60px;background-color: #42b983;focus-background-color:red;"
    @click="onClick">
      <span style="width: 100px;height: 60px">点击</span>
    </div>
    <div style="width: 240px;height: 240px;padding-left: 20px;padding-top: 20px;margin:10px;
    background-color: greenyellow">
      <qt-qr-code style="width: 200px;height: 200px;"
                  :content="payUrl" :optimize="true" :focusable="false"/>
    </div>

    <div class="test-inner-css">
      <span ref="testText">{{text}}</span>
    </div>
    <div class="test-inner-css">
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from '@vue/runtime-core';
import {ref} from "vue";

import {
  HisensePayError,
  HisensePayState,
  HisenseTokenInfo,
  HisenseUserInfo,
  HisenseOrderInfo,
  HisenseListener,
  HisensePayInfo,
  ESPaymentInfo,
  InitCode,
  PayChannel,
  PayOpenType,
  useESHisensePayments
} from "@extscreen/es3-pay";
import {useESRouter} from "@extscreen/es3-router";


export default defineComponent({
  name: 'test',
  setup() {
    const TAG = "Pay"
    let text = ref("")
    let payUrl = ref("")
    const router = useESRouter()
    let clickCount = 0
    //天猫支付测试 Demo
    // const payUtil = useESPayments()
    // async function tMallPay(){
    //   const tMallPayInfo:ESPaymentInfo<TMallPayInfo> = {
    //     payChannel:PayChannel.T_MALL,
    //     payOpenType:PayOpenType.OPEN_TYPE_ACTIVITY,
    //     payInfo:{
    //       appKey:"34143430",
    //       appSecret:"5c58e70109e5cd53ea3171222eb8293d"
    //     }
    //   }
    //   const initCode:InitCode = await payUtil.initPay(tMallPayInfo)
    //   if (initCode !== InitCode.SUCCESS){
    //     console.log(TAG,`initCode ${initCode}`)
    //   }else{
    //     const tMallPayOrder:TMallOrderInfo = {
    //       buyer:"",
    //       orderNo:"202404251217280000",
    //       price:"1",
    //       productId:"2008072110260920",
    //       productName:"测试天猫渠道购买",
    //       url:"",
    //       orderType:"0",
    //       bizType:0
    //     }
    //     payUtil.createOrder(tMallPayOrder).then(res=>{
    //       console.log(TAG,`pay tMall ${JSON.stringify(res)}`)
    //       text.value = JSON.stringify(res)
    //     })
    //   }
    // }

    const hisensePayUtil = useESHisensePayments()

    const listener = {
      onUserInfo(userInfo: HisenseUserInfo): void {
       // text.value+=("user info "+clickCount+"\n"+JSON.stringify(userInfo)+"\n")
      },
      onPayResult(payState:HisensePayState): void {

      }
    }

    async function hisensePay() {
        const hisenseOrder:HisenseOrderInfo ={
          appName:'测试',
          body:"",
          flowType:1,
          goodsCount:"1",
          goodsName:"测试购买商品",
          goodsDesc:"测试购买",
          goodsPrice:"0.01",
          thirdUserId:"123456789",
          notifyUrl:"http://175.178.62.66/extend_api/api/v1/zero/paid/aliTvPay/callback",
          tradeNum:"202404251217280021",
          relationFlag:"0",
          planId:"",
          productNo:"",
          productAvailDays:"",
          isPoll:true,
        }
        setTimeout(()=>{
          hisensePayUtil.createOrder(hisenseOrder)
        },2000)
    }

    function initHisenseParams(){
      setTimeout(()=>{
        hisensePayUtil.isLoginState().then(res=>{
          if (res){
            console.log("XRG===12","已登录")
          //  hisensePay()

          }else{
            console.log("XRG===12","未登录")
            hisensePayUtil.loginDevice()
          }
        })

      },2000)
    }

    function  onESCreate(params) {
      // pay()
      hisensePayUtil.addListener(<HisenseListener>listener)
     initHisenseParams()
      // hisensePay()
    }

    function  onClick(e){
      clickCount ++
      console.log("XRG===onclick ",clickCount)
      // initHisenseParams()
      hisensePayUtil.removeListener(<HisenseListener>listener)
      router.push({name:'test2'})
    }
    function onESDestroy(){
      hisensePayUtil.removeListener(<HisenseListener>listener)
    }
    return {
      onESCreate,
      onClick,
      text,
      payUrl
    }
  },

});
</script>

<style scoped>

.test-root-view-css {
  width: 1920px;
  height: 1080px;
  background-color: teal;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.test-inner-css {
  width: 192px;
  height: 108px;
  background-color: yellowgreen;
}

</style>
