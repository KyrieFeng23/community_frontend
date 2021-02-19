import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/Register'),
    meta: {title: '注册'}
  },
  // 登录
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/auth/Login'),
    meta: { title: '登录' }
  },
  // 发布
  {
    name: 'post-create',
    path: '/post/create',
    component: () => import('@/views/post/Create'),
    meta: { title: '信息发布', requireAuth: true }
  },
  //404
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404'),
    meta: {title: '404-Notfound'}
  },
  //当输入不属于上述定义的地址时，进行重定向，跳转到404页面
  {
    path: '*',
    redirect: '/404',
    hidden:true
  }
]

//当在主页面退出登录时，因为是重定向到path为/，所以会报一个冗余警告，用下面的代码可以解决
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes
})

export default router
