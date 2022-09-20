<template>
    <!-- 路由占位符，会导入匹配到的$route.path的视图组件 -->
    <router-view></router-view>
</template>

<style>
    /*设置html和body*/
    html, body {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
    #nprogress .bar {
        /*自定义进度条颜色*/
        background: #2186c0 !important;
    }
</style>