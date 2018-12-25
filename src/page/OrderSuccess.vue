<template>
  <div>
    <nav-header></nav-header>
    <div>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{orderDetail.orderId}}</span>
              <span>Order total：{{orderDetail.orderTotal | priceFilter('$')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link href="javascript:;" class="btn btn--m" to="/cart">Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link href="javascript:;" class="btn btn--m" to="/">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import NavHeader from "@/base/NavHeader.vue";
  import NavBread from "@/base/NavBread.vue";
  import NavFooter from "@/base/NavFooter.vue";
  import { XDialog, TransferDomDirective as TransferDom } from 'vux'
  import { getOrderDetail } from '@/api'
  export default {
    created () {
      this.init()
      // console.log(this.$route.query.orderId)
    },
    directives: {
      TransferDom
    },
    components: {
      NavHeader,
      NavBread,
      NavFooter,
      XDialog
    },
    computed: {
      orderId () {
        if (!this.$route.query.orderId) return
        return this.$route.query.orderId
      }
    },
    data () {
      return {
        orderDetail: {}
      }
    },
    methods: {
      async init () {
        let res = await getOrderDetail(this.orderId)

        if (res.status === '0') {
          this.orderDetail = res.result
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  
</style>