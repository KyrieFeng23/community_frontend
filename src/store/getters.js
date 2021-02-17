//定义一个getter对象
//这里对应的是user.js里的state
//通过getters来获取state里的数据
const getters = {
    token: state => state.user.token,   //token
    user: state => state.user.user,     //用户对象
}
export default getters