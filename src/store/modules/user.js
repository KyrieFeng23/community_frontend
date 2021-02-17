import { getUserInfo, login } from '@/api/auth/auth'
import {getToken, removeToken, setToken} from '@/utils/auth'


//定义全局数据
const state = {
    token: getToken(), // token
    user: '', // 用户对象
}


//store状态的改变必须通过mutation，进行赋值
//这里改变的是store里的state
const mutations = {
    SET_TOKEN_STATE: (state, token) => {
        state.token = token
    },
    SET_USER_STATE: (state, user) => {
        state.user = user
    }
}

const actions = {
    // 用户登录
    login({ commit }, userInfo) { //commit用来向mutation提交设置请求
        console.log(userInfo)
        const { name, pass, rememberMe } = userInfo
        //promise是es6的一个语法
        return new Promise((resolve, reject) => {
            //将前端的用户名、密码、是否记住发送到后端服务器，并获取返回的token
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
    // 获取用户信息
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getUserInfo().then(response => {
                const { data } = response
                if (!data) {
                    commit('SET_TOKEN_STATE', '')
                    commit('SET_USER_STATE', '')
                    removeToken()
                    resolve()
                    reject('Verification failed, please Login again.')
                }
                commit('SET_USER_STATE', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}