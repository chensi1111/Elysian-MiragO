import { createRouter, createWebHashHistory } from 'vue-router';
import { ref } from 'vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/man'
    },
    {
      path: '/man',
      component: () => import('@/views/man/ManPage.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/man/ManHome.vue')

        }
        , {
          path: 'clothes',
          component: () => import('@/views/man/ManClothes.vue')
        }
      ]
    },
    {
      path: '/woman',
      component: () => import('@/views/woman/WomanPage.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/woman/WomanHome.vue')
        }
        , {
          path: 'clothes',
          component: () => import('@/views/woman/WomanClothes.vue')
        }
      ]
    },
    {
      path: '/favorite',
      component: () => import('@/views/FavoritePage.vue')
    },
    {
      path: '/product',
      component: () => import('@/views/ProductPage.vue')
    },
    {
      path: '/shoppingCart',
      component: () => import('@/views/ShoppingCartPage.vue')
    },
    {
      path: '/confirm',
      component: () => import('@/views/confirm/ConfirmPage.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/confirm/ConfirmShipping.vue')
        },
        {
          path: 'payment',
          component: () => import('@/views/confirm/ConfirmPayment.vue')
        },
        {
          path: 'complete',
          component: () => import('@/views/confirm/ConfirmComplete.vue')
        },
      ]
    },
    {
      path:'/login',
      component: () =>import('@/views/LoginPage.vue'),
      children:[
        {
          path:'',
          component:()=>import('@/views/LoginHome.vue')
        },
        {
          path:'register',
          component:()=>import('@/views/LoginRegister.vue')
        }
      ]
    },
    {
      path:'/member',
      component:()=>import('@/views/MemberPage.vue')
    }
  ]
});




// 記錄上一個路由
const previousRoute = ref();
router.beforeEach((to, from, next) => {
  previousRoute.value = from.fullPath;
  next();
});


router.afterEach(() => {
  window.scrollTo(0, 0);
});
export default router;
export { previousRoute };