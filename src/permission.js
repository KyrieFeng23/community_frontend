import router from './router'
import store from './store'
import getPageTitle from '@/utils/get-page-title'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import {getToken} from "@/utils/auth"; // progress bar style

//进度条
NProgress.configure({showSpinner: false}) // NProgress Configuration

//当页面跳转时，beforeEach从每一次跳转前
router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()
    // set page title
    document.title = getPageTitle(to.meta.title)
    // determine whether the user has logged in
    const hasToken = getToken();

    if (hasToken) {
        if (to.path === '/login') {
            // 已经登录，又要去登录页面，跳转首页
            next({path: '/'})
            NProgress.done()
        } else {
            // 获取用户信息
            await store.dispatch('user/getInfo')
            next()
        }
    } else {
        next()
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})