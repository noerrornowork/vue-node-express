import Vue from "vue";
import Router from "vue-router";
// import HelloWorld from '@/components/HelloWorld'
// const Home = resolve => {
//   require(["@/components/Home.vue"], resolve);
// };
// const List = resolve => {
//   require(["@/components/List.vue"], resolve);
// };
// const Cart = resolve => {
//   require(["@/components/Cart.vue"], resolve);
// };
// const Add = resolve => {
//   require(["@/components/Home.vue"], resolve);
// };
const GoodsList = resolve => {
  require(["@/page/GoodsList.vue"], resolve);
};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "goodsList",
      component: GoodsList
    }
  ]
});
