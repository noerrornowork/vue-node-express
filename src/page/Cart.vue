<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">My Cart</span>
    </nav-bread>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="(item, index) in cartList" :key="index">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" :class="{'check': item.checked === '1'}" @click="editCart('checked', item)">
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img :src="'/static/' + item.productImage" :alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{ item.productName }}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{ item.salePrice | priceFilter('$') }}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('minus', item)">-</a>
                        <p class="select-ipt">{{ item.productNum }}</p>
                        <a class="input-add" @click="editCart('add', item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{ (item.productNum*item.salePrice) | priceFilter('$') }}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn">
                      <button class="btn-del" @click="delCartConfirm(item.productId)">删除</button>
                      <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;" @click="toggleCheckAll">
                    <span class="checkbox-btn item-check-btn" :class="{'check': checkAllFlag}">
                        <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                    </span>
                  <span>Select all</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total: <span class="total-price">{{ totalPrice | priceFilter('$') }}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" :class="{'btn--dis': checkedCount===0}" @click="checkOut">Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <div v-transfer-dom>
      <x-dialog v-model="show" class="dialog-demo" hide-on-blur>
        <div class="img-box">
          <p>请确认删除该数据吗?</p>
        </div>
        <div class="btn-group">
          <button @click="delCart" class="confirmBtn">确认</button>
          <button @click="show=false" class="closeBtn">关闭</button>
        </div>
      </x-dialog>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import "@/assets/css/product.css";
  import NavHeader from "@/base/NavHeader.vue";
  import NavBread from "@/base/NavBread.vue";
  import NavFooter from "@/base/NavFooter.vue";
  import { getCartList, deleteCartByProductId, editCartCount, editChexkAll } from '@/api'
  import { XDialog, TransferDomDirective as TransferDom } from 'vux'
  export default {
    created () {
      this.init()
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
    data () {
      return {
        cartList: [],
        productId: '',
        show: false
      }
    },
    computed: {
      // checkAllFlag () {
      //   return this.checkedCount === this.cartList.length
      // },
      checkedCount () {
        let i = 0
        this.cartList.forEach(item => {
          if (item.checked === '1') i++
        })
        return i
      },
      checkAllFlag () {
        return this.cartList.every(item => {
          return item.checked === '1'
        })
      },
      totalPrice () {
        let money = 0
        this.cartList.forEach(item => {
          if (item.checked === '1') {
            money += parseFloat(item.salePrice) * parseFloat(item.productNum)
          }
        })
        return money
      }
    },
    methods: {
      async init() {
        let res = await getCartList()
        this.cartList = [...res.result]
        console.log(this.cartList)
      },
      async delCart () {
        let res = await deleteCartByProductId(this.productId)
        if (res.status === '0') {
          this.show = false
          this.init()
        }
      },
      delCartConfirm (productId) {
        this.productId = productId
        this.show = true
      },
      async editCart (flag, item) {
        if (flag === 'add') {
          item.productNum++
        } else if (flag === 'minus') {
          if (item.productNum <= 1) return
          item.productNum--
        } else {
          item.checked = item.checked === '1' ? '-1' : '1'
        }

        let res = await editCartCount(item.productId, item.productNum, item.checked)
        // if (res.status === '0') {
        //     this.$vux.toast.show({
        //     text: res.result
        //   })
        // } else {
        //   this.$vux.toast.show({
        //     text: res.msg
        //   })
        // }
      },
      async toggleCheckAll () {
        // computed是实时计算,在这里赋值不进去
        // this.checkAllFlag = !this.checkAllFlag
        let flag = !this.checkAllFlag
        this.cartList.forEach(item => {
          item.checked = flag ? '1' : '-1'
        })
        let res = await editChexkAll(flag)
      },
      checkOut () {
        if (this.checkedCount > 0) {
          this.$router.push({
            name: 'address'
          })
        }
      }
    }
  }
</script>
<style scoped lang="less">
.dialog-demo {
  .weui-dialog{
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    height: 350px;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
.btn-del {
  width: 60px;
  height: 40px;
  background-color: red;
  color: #ffffff;
  border-radius: 4px;
}
.btn-group {
  width: 100%;
  height: 40px;

  display: flex;
  button {
    flex: 1;
    border-radius: 4px;
  }
  .confirmBtn {
    background-color: #f00000;
    color: #f5f5f5;
  }
  .closeBtn:hover {
    background-color: #259bec;
    color: #cfcfcf;
  }
}
.select-self {
  display: block;
  width: 160px;
  height: 40px;
}
.select-self-area {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  a {
    width: 60px;
    background-color: #cfcfcf;
  }
} 
</style>