import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    //path设置成/就是默认显示的路由地址
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
  //详情
  {
    name: "post-detail",
    path: "/post/:id",
    component: () => import("@/views/post/Detail"),
  },
  // 编辑
  {
    name: 'topic-edit',
    path: '/topic/edit/:id',
    component: () => import('@/views/post/Edit'),
    meta: {
      title: '编辑'
    }
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
  //设置成history可以去掉路径里的#，但是配置到服务器会出404问题，比较麻烦，暂时先注释掉不用
  // mode:'history',
  routes
})

export default router
