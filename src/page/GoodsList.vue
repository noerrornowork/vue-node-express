<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter('all')">All</a>
              </dd>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter('0')">0 - 100</a>
              </dd>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter('1')">100 - 500</a>
              </dd>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter('2')">500 - 1000</a>
              </dd>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter('3')">1000 - 2000</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#">
                      <img :src="'/static/' + item.productImage" alt>
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">{{ item.salePrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="40" class="loadMore">
                加载中...
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
  import "@/assets/css/base.css";
  import "@/assets/css/product.css";
  import NavHeader from "@/base/NavHeader.vue";
  import NavBread from "@/base/NavBread.vue";
  import NavFooter from "@/base/NavFooter.vue";
  import { getGoodsList, getCartDataByUserId } from '@/api'
  export default {
    created () {
      this.init(this.flag)
    },
    data() {
      return {
        goodsList: [],
        page: 1,
        pageSize: 5,
        sortFlag: true,
        busy: false,
        priceLevel: '',
        flag: false
      };
    },
    components: {
      NavHeader,
      NavBread,
      NavFooter
    },
    methods: {
      async init(flag) {
        let page = this.page
        let pageSize = this.pageSize
        let sort = this.sortFlag ? 1 : -1
        let priceLevel = this.priceLevel
        let res = await getGoodsList(page, pageSize, sort, priceLevel)
        if (res.status === '0') {
          if (flag) {
            this.goodsList = [...res.result.list, ...this.goodsList]
            if (res.result.count === 0) {
              this.busy = true
            } else {
              this.busy = false
            }
          } else {
            this.goodsList = res.result.list
          }
        } else {
          this.goodsList = []
        }
      },
      sortGoods () {
        this.sortFlag = !this.sortFlag
        this.page = 1
        this.init(false)
      },
      loadMore () {
        this.busy = true
        setTimeout(() =>{
          this.page++
          this.init(true)
        }, 500)
      },
      setPriceFilter (index) {
        this.priceLevel = index
        this.page = 1
        this.init(false)
      },
      async addCart (productId) {
        let res = await getCartDataByUserId(productId)
        console.log(res)
        if (res.status === "0") {
          alert('加入成功')
        } else {
          alert("msg:" + res.msg)
        }
      }
    }
  };
</script>
<style scoped>
  .loadMore {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
