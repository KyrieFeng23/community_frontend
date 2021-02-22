# community_fronted

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# springboot+vue多用户社区项目笔记

## 一、前端技术栈

Vue

Vuex

Vue Router

Axios

Bulma

Buefy

Element

Vditor

DarkReader

### 前端项目地址

https://github.com/KyrieFeng23/community_frontend

https://github.com/songboriceman/doubao_community_frontend

## 二、后端技术栈

Spring Boot

Mysql

Mybatis

MyBatis-Plus

Spring Security

JWT

Lombok

### 后端项目地址

https://github.com/KyrieFeng23/community_backend

https://github.com/songboriceman/doubao_community_backend

## 三、笔记

#### 1、前后端分离原理及设置(跨域)

- 前后端分离，后端提供接口api，前端通过后端地址如127.0.0.1:8080/billboard/show 路径进行数据获取，得到返回的json数据，并通过vue获取数据data内相应的例如id、code、content等数据，将其显示在界面上。

- 前端设置后端地址URL：在根目录下创建.env文件，内容为

  ~~~
  VUE_APP_SERVER_URL = 'http://127.0.0.1:8080'
  ~~~

- 由于是前后端分离项目，前后端端口不一样，所以需要跨域，要配置后台允许跨域访问。

  **前端: 在src -> utils下的request.js里加入以下代码：**

  ~~~vue
  // 跨域：前后端端口不一样，需要进行跨域
  // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息,使用JWT可关闭
  service.defaults.withCredentials = false
  ~~~

  **后端**：**在包内新建config文件夹，在里面创建GlobalWebMvcConfigurer.java文件**

  代码：

  ~~~java  
  package com.community.config;
  
  import org.springframework.context.annotation.Bean;
  import org.springframework.context.annotation.Configuration;
  import org.springframework.web.cors.CorsConfiguration;
  import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
  import org.springframework.web.filter.CorsFilter;
  import org.springframework.web.servlet.config.annotation.CorsRegistry;
  import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
  
  
  @Configuration
  public class GlobalWebMvcConfigurer implements WebMvcConfigurer {
  
      /**
       * 跨域
       */
      @Override
      public void addCorsMappings(CorsRegistry registry) {
          registry.addMapping("/**")
                  .allowedOrigins("*")
                  .allowedMethods("GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS")
                  .allowCredentials(true)
                  .maxAge(3600)
                  .allowedHeaders("*");
      }
  
      @Bean
      public CorsFilter corsFilter() {
          CorsConfiguration config = new CorsConfiguration();
          //允许所有域名进行跨域调用
          config.addAllowedOrigin("*");
          //允许跨越发送cookie
          config.setAllowCredentials(true);
          //放行全部原始头信息
          config.addAllowedHeader("*");
          //允许所有请求方法跨域调用
          config.addAllowedMethod("*");
          UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
          source.registerCorsConfiguration("/**", config);
          return new CorsFilter(source);
      }
  }
  ~~~

#### 2、前端运行及安装组件命令

- 前端运行vue-cli代码：

  ```
  npm run serve
  ```

  前端安装组件代码：

  ~~~java
  npm install element-ui
  ~~~

#### 3、后端项目结构图及流程

- 后端项目结构图：

  <img src="https://img-blog.csdnimg.cn/20210216172438779.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQzNzA2OTY5,size_16,color_FFFFFF,t_70#pic_center" alt="后端项目结构图" style="zoom:50%;" />

    1. 首先在model中的entity中创建实体

       model层中的DTO，是用来与客户端返回的数据或者发送给客户端的数据进行一一对应，因为客户端不一定需要一个类的所有数据

    2. 然后是mapper层，在mapper文件夹中创建mapper接口，在里面定义一些数据库方面的方法，由于使用了mybatis-plus组件，所以一些简单的增删改查语句可以使用组件内置的方法进行快捷使用，mapper接口中无需写任何代码，直接在controller中调用即可。而涉及到复杂的业务逻辑时，简单的语句无法满足，需要在mapper中先定义方法名称，再在resources下创建一个mapper文件夹，在这里创建对应的xml文件，在里面写刚才mapper层里定义的相同方法名的sql语句。

       在启动类中需要写入以下注解，用来设定mapper包的路径

       ~~~Java  
       @MapperScan("com/community/mapper")
       ~~~



3. 接着是service层，如上图所示，service层中包含impl文件夹以及与他同层级的service接口。首先在service接口中定义方法，再在impl中创建对应的实现类，对其方法进行override重写，在这里进行mapper方法的调用，并返回数据给controller层。

4. 最后是controller层，这里是业务逻辑层，在这里调用service层的方法并对返回的数据进行处理，在该项目里，在最后返回数据时需要调用api处理类，将数据处理成json格式，供前端进行访问。

5. 其他还有common文件夹，这是公共层（？）这里面有api的文件夹以及exception文件夹。

   api文件夹中需要写api类，将c层处理好的处理进行json格式的处理，定义成功和失败等等的方法，并返回。

6. config文件夹，里面含有一些配置类，例如跨域配置类就存放在这里。

7. utils文件夹，放一些工具类

#### 4、JWT工作流程

- Java web token，放在请求头文件中，用户登录时，前端将用户名密码发送到后端，后端进行查询看密码是否正确，若正确，则将用户名密码进行加密为JWT并返回给客户端，存在浏览器的本地数据中，当用户每次进行需要登录的验证的访问时，会将JWT带着发送请求，服务器再进行decode，将用户名密码取出并查询，并且检查超期时间，如果超期则需要重新登录。

####  5、VUEX模块介绍及作用

- vue中组件之间的传值，会出现例如，父组件包含一个子组件，子组件又包含一个子组件，这里称最外面的组件为祖组件，最里面的组件为孙组件。当祖组件需要传值给孙组件时，就需要将数据先传给子组件，再由子组件传给孙组件，这里子组件只有一个过渡，传递的作用，如果这样的层级不止三层，有更多层，就会非常的繁琐且效率低。

- vuex作用：创建一个store类似于全局仓库，当祖组件获取到数据时，就直接把他存到store里，这样其他组件就可以直接从store中获取数据，无需进行层级传递。但由于全局仓库的数据会很容易被污染，所以vuex会有一个比较复杂的过程。（必须通过mutations使store改变）
- vuex的官方文档：[文档地址](https://vuex.vuejs.org/zh/guide/getters.html)

#### 6、js-cookie介绍

将获取到的token存在浏览器的storage中，通过键值对的方式进行存储和查询。

#### 7、用户登录前端实现

- 在路由中加入登录的路由Login

  ~~~vue
  // 登录
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/auth/Login'),
      meta: { title: '登录' }
    },
  ~~~

  意思是，当在浏览区输入login的地址时，就跳转到component中定义的组件。

- 在views--auth中创建登录组件Login.vue

  先校验表单是否符合规则，然后向vuex的store发送请求，将服务器返回的token存到vuex的state和浏览器的storage中

- 在store中创建modules文件夹，在其中创建user.js文件，

#### 8、前端侧边栏，马上入驻，社区登录功能

- 首先右边的发帖这个版块里，如果未登录，检测到没有token，就显示马上入驻和登录两个按钮，如果已经登录，则显示发表想法按钮。

- 要获取vuex的state里的数据，需要写一个getter来进行获取。在store文件夹下新建一个getters.js文件，代码如下：

  ~~~vue
  //定义一个getter对象
  //这里对应的是user.js里的state
  //通过getters来获取state里的数据
  const getters = {
      token: state => state.user.token,   //token
      user: state => state.user.user,     //用户对象
  }
  export default getters
  ~~~

  用这个方法来获取之前存在state里的token数据

- 在loginwelcome.vue组件中，添加compute，调用es6的方法...mapGetters来获取刚才存在vuex的store的数据

- 判断token是否为空，根据是否为空来显示不同的按钮，使用v-if，v-else

#### 9、前端在axios请求拦截器中在请求头中加入jwt

- 在有了token之后，每次前端向后端发送请求时，都需要把这个token带过去，

- axios就是负责向服务器发送各种HTTP请求的，需要添加一个请求拦截器，也就是在每一次发送HTTP请求之前进行拦截，就在这里把token加上，代码如下：

  ~~~vue
  // 2.请求拦截器request interceptor
  service.interceptors.request.use(
    config => {
      // 发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
      // 注意使用token的时候需要引入cookie方法或者用本地localStorage等方法，推荐js-cookie
      if (store.getters.token) {      //true表示登陆成功
        // config.params = {'token': token}    // 如果要求携带在参数中
        // config.headers.token = token;       // 如果要求携带在请求头中
        // bearer：w3c规范
        config.headers['Authorization'] = 'Bearer ' + getToken()
      }
      return config
    },
    error => {
      // do something with request error
      // console.log(error) // for debug
      return Promise.reject(error)
    }
  )
  ~~~

- 测试效果：

  <img src="https://i.loli.net/2021/02/18/XSCLfIaizty3e8B.png" alt="截屏2021-02-17 下午4.51.28" style="zoom:150%;" />



#### 10、后端设置请求拦截器检查用户头中是否包含jwt

- 新建一个请求过滤拦截器类，在这里进行校验、解析等操作，如果校验失败，就不让他进入controller，成功则放行。他定义了不会自动运行，需要在application里面加进去。

- TODO：为什么会有两条请求记录，一条是空的？

  因为一条是option请求，另一条才是真正的get或者是post请求。这是正常的，我看其他网站也是这样的。

#### 11、前端header实现

- 实现夜间模式，使用darkreader库

  ~~~vue
  npm install darkreader
  ~~~

- 在components文件夹下新建Layout文件夹，再在下面新建Header.vue因为所有页面的header都一样。

- 在一个vue页面的组件添加一个子组件有三步（在App.vue中添加该组件）：

    1. 引入组件，在<script></script>标签中import

       ~~~vue
       import Header from "@/components/Layout/Header";
       ~~~

    2. 在components里声明

       ~~~vue
       export default {
         name:"App",
         components:{ Header },
       };
       ~~~

    3. 在template里写标签

       ~~~html
       <div>
           <div class="mb-5">
             <Header></Header>
           </div>
         </div>
       ~~~

- 填写Header.vue内容，这里要注意导航栏的响应式，在移动端要隐藏或者改变一些东西。

- 这里也会用到token

- 但是发现每次一刷新，header里的用户名会消失，因为每次一刷新，state里的数据就会被初始化，而getinfo的位置放的不对，不应该在login的时候调用。所以在根目录新建一个permission.js文件，并在main.js里导入，使得每一次在进行页面跳转的时候，如果有token，已经登录，若是要跳转到登录页面，那么跳转至首页，如果已经登录，而且是其他页面，那么进行一次getInfo，获取user数据。如果没有token，那就先跳转到相应要去的页面，不进行操作，后续会增加其他操作。

#### 12、退出登录

- 清理state里的user、token，然后removetoken，把token从cookie删掉

- 当在主页面退出登录时，因为是重定向到path为/，所以会报一个冗余警告，用下面的代码可以解决

  ~~~vue
  const originalPush = VueRouter.prototype.push
  VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
  }
  ~~~

#### 13、前端footer页脚

- 用到了BackTop组件，把backtop放在footer，再把footer放到App里。

#### 14、帖子列表前端实现

- 安装第三方库，用来格式帖子的发表时间，安装dayjs

  ~~~js
  npm install dayjs --save
  ~~~

- 在main.js中引入day.js组件

- 在api下新建post.js文件，写getList方法

  ~~~js
  import request from '@/utils/request'
  
  // 列表
  export function getList(pageNo, size, tab) {
    return request(({
      url: '/post/list',
      method: 'get',
      params: { pageNo: pageNo, size: size, tab: tab }
    }))
  }
  ~~~

- 写post.vue前端页面，并在这里引入post.js的getList方法。

- post.vue里有两个标签，一个是最新主题一个是热门主题，通过点击事件来切换标签，并且在点击的时候发送获取数据的请求，并显示在页面上

#### 15、帖子列表后端实现

- 帖子和帖子的标签，是多对多的关系，这里涉及到数据库的设计

  三张表，一个是帖子表，一个是标签表，一个是帖子标签表

  上图

  <img src="https://tva1.sinaimg.cn/large/008eGmZEly1gns3rtxelpj30i60kywhp.jpg" alt="截屏2021-02-18 下午11.25.51" style="zoom:50%;" />

  <img src="https://tva1.sinaimg.cn/large/008eGmZEly1gns3rs9nkrj30mg0nswif.jpg" alt="截屏2021-02-18 下午11.26.01" style="zoom:50%;" />

  <img src="https://tva1.sinaimg.cn/large/008eGmZEly1gns3rt3zu7j311k0j2wj1.jpg" alt="截屏2021-02-18 下午11.26.20" style="zoom:50%;" />

- 请求来了调用controller，controller调用service，service调用mapper

- 三张表对应要有三个实体类和三个mapper，service合为post和topictag

- xml里的代码如下，注意里面我写的注释

  ~~~xml
  <?xml version="1.0" encoding="UTF-8" ?>
  <!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
  <mapper namespace="com.community.mapper.BmsTopicMapper">
      <resultMap id="topicVO" type="com.community.model.vo.PostVO">
  <!--        column代表数据库里字段名称，property代表实体类的字段名称-->
          <id column="id" property="id"/>
          <result column="title" property="title"/>
          <result column="user_id" property="userId"/>
          <result column="comments" property="comments"/>
          <result column="view" property="view"/>
          <result column="collects" property="collects"/>
          <result column="top" property="top"/>
          <result column="essence" property="essence"/>
          <result column="create_time" property="createTime"/>
          <result column="modify_time" property="modifyTime"/>
          <result column="username" property="username"/>
          <result column="alias" property="alias"/>
          <result column="avatar" property="avatar"/>
      </resultMap>
  
  
  <!--    这里的select结果得到后会存到上面的resultMap里，是通过下面这个resultMap="topicVO"这句话来找对应id的resultMap的-->
      <select id="selectListAndPage" resultMap="topicVO">
          SELECT
          t.id,t.title,t.user_id,t.comments,
          t.view,t.collects,t.top,t.essence,
          t.create_time ,t.modify_time ,
          u.username,u.alias, u.avatar
          FROM bms_post t
          LEFT JOIN ums_user u
          ON t.user_id = u.id
          <where>
            <!--             test里的内容是来自html或者jsp的，这里是来自controller -->
              <if test="tab == 'hot'">
  <!--             &lt; >=  gt;小于等于   这里必须要转义不然会报错    -->
                  date(t.create_time) &lt;= date_add(curdate(), interval 1 day)
                  and date(t.create_time) &gt;= date_sub(curdate(), interval 7 day)
              </if>
          </where>
          <if test="tab != 'hot'">
              order by t.create_time desc
          </if>
          <if test="tab == 'hot'">
              order by t.view desc, t.create_time desc
          </if>
      </select>
  </mapper>
  ~~~

- dto是客户端返回来的，vo是服务器发过去的

- Q:为什么不直接用BmsPost，而是要新建一个PostVO？

  A:因为实体层的BmsPost是和数据库一一对应的，而在这里需要返回的数据比数据库里Post表里多了一个tag字段，所以需要新建一个

- Q:需要注意的一个问题：我获取到了bmsPost的数据，现在我还需要一个tag，怎么做？

  A:获取bmspost数据后，遍历它，根据post的id找他的tag，再从Post_tag表里获取tagid，根据tagid从tag表里找tag实体类，最后添加到vo的taglist字段里。

#### 16、帖子分页

- 用element-ui实现分页样式
- 后端要添加一个config，让mybatisplus拦截一下，进行分页后放行从而达到分页效果

#### 17、发表帖子

- 添加vditor组件

  ~~~js 
  npm install vditor --save
  ~~~

- 事物处理注解

  ```
  //事物处理，确保几个表的操作要么同时成功，要么同时失败
  @Transactional(rollbackFor = Exception.class)
  ```

#### 18、帖子详情

- 前端发送getTopic请求，参数为帖子id，后端得到参数并将需要的帖子信息、用户信息、标签信息返回，并对其进行相应的操作。
- 前端得到返回的数据之后，将相应的数据显示到前端页面上

#### 19、帖子详情右侧边栏作者详情及用户关注

- 前端在api下新建follow.js文件，里面写三个方法，关注、取关、是否关注。

- 在views/post下新建名为Author的vue组件，编写作者的相关界面。页面加载完成时首先获取后端信息，判断是否关注该用户（用户已登录状态下），如果未登录，则直接显示关注按钮，并在点击关注时提示请先登录。其次编写关注和取关方法，调用follow.js里的方法。

- 在Detail.vue中添加author组件，并传值过去

- 关于关注数：首先是父组件，Detail.vue中，已经获取到了从后端传来的相关的各种数据，其中有一个User对象

  ```vue
  <div class="column">
    <!--作者-->
    <Author
        v-if="flag"
        :user="topicUser"
    />
  ```

  父组件把user传值给子组件author，这个user的值是服务器发来的data中的user。author子组件中，定义一个prop，如下

  ```javascript
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  ```

  然后就可以使用父组件传来的值，并进行关注、取关等等一系列操作。

- 后端：因为关注者和被关注者是多对多关系，所以需要有一张关系表，字段是id，parentid和followerid。因此创建BmsFollow实体类，并创建相关的Service和mapper

- 在controller里编写关注、取关、是否关注的相关方法。取消关注就是删除对应记录，用mybatisplus的remove函数

#### 20、随便看看功能

- 实际上需要涉及到复杂的算法，这里先就随便在数据库里找几条帖子展示，除该帖子之外即可

#### 21、评论列表

- Detail父组件传帖子id值给子组件comments，根据id查找该帖子的评论。
- 评论组件分为comments组件和commentsItem组件，comments组件把当前遍历的这条评论对象传给commentsItem。
- Comments获取到后台返回的评论数据，然后通过循环遍历CommentsItem组件来显示所有的评论。
- TODO：但是好像没有评论的回复功能？没有的话我自己到时候写一下。

#### 22、发表评论

- 前端新增一个CommentsForm组件，用来填写评论。
- 组件很简单，就是一个输入框和一个提交按钮。
- 在Comments父组件里添加入该子组件CommentsForm，并把帖子id作为参数传过去。前端要判断一下token是否存在，登录了才会显示评论框。
- 在进行提交评论操作之后，子组件CommentsForm发送一个emit通知，通知父组件有数据更新，让Comments组件更新数据，以显示刚刚评论的数据。

#### 23、帖子更新与删除

- 就是普通的增删操作，不详细展开。
- TODO：帖子删除之后相应的评论没删
- TODO：帖子更新中标签修改无效
- TODO：帖子点分页之后，再点击热门主题，帖子列表会空

#### 24、搜索帖子

- 对帖子标题进行模糊搜索

- Header父组件将keyword搜索关键字传到search子组件，在子组件中调用搜索方法进行数据获取并渲染

- Header传值给search：

  ```javascript
  //两种方法都可用，第二种更官方一些
  // this.$router.push({ path: '/search?key=' + this.searchKey })
  this.$router.push({ path: '/search' ,query:{key:this.searchKey }})
  ```

- search接收：

  ```javascript
  keyword: this.$route.query.key,
  ```

#### 25、个人中心

- 简单的查询操作，略

#### 26、个人信息修改

- 简单的修改操作，略，直接用mybatis-plus的update

#### 27、前端发帖、留言等页面登录权限验证

- 在permission.js中，设置需要权限才能访问的页面在跳转时要验证是否需要登录，如果已登录则正常跳转，未登录则跳转到登录页面。

  ```javascript
  else if (!to.meta.requireAuth)
  {
      next()
  }else {
  next('/login')
  }
  ```

- 在路由中将需要登录的页面添加如下代码

  ```javascript
  meta: { title: '信息发布', requireAuth: true }
  ```

