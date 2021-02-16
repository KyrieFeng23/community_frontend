import { login } from '@/api/auth/auth'
import { getToken, setToken } from '@/utils/auth'


//定义全局数据
const state = {
    token: getToken(), // token
    user: '', // 用户对象
}


//state状态的改变必须通过mutation，进行赋值
const mutations = {
    SET_TOKEN_STATE: (state, token) => {
        state.token = token
    }
}

const actions = {
    // 用户登录
    login({ commit }, userInfo) { //commit用来向mutation提交设置请求
        console.log(userInfo)
        const { name, pass, rememberMe } = userInfo
        //promise是es6的一个语法
        return new Promise((resolve, reject) => {
            login({ username: name.trim(), password: pass, rememberMe: rememberMe }).then(response => {
                const { data } = response
                //把服务器返回的token存到state的token里了
                commit('SET_TOKEN_STATE', data.token)
                //保存到浏览器的storage里
                setToken(data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}