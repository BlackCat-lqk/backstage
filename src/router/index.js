import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    // 所有的'/'路径都会重定向到'/login'路由
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../components/LoginView.vue')
  },
  {
    path: '/home',
    redirect: '/welcome',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
    children:[
      {
        path:'/welcome',
        name:'welcome',
        component:() => import(/* webpackChunkName: "welcome" */ '../views/WelcomeView.vue'),
      },
      {
        path:'/users',
        name:'users',
        component:() => import(/* webpackChunkName: "user" */ '../views/UsersView.vue'),
      },
      {
        path:'/rights',
        name:'rights',
        component:() => import(/* webpackChunkName: "user" */ '../views/RightsView.vue'),
      },
    ]
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from：代表从哪个路径过来
  // next：放行函数
  if(to.path === '/login') return next()
  // 判断token是否为空
  const tokenStr = window.sessionStorage.getItem('token')
  // 为空就重定向到登录页
  if(!tokenStr) return next('/login')
  next()
})

export default router
