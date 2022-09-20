//导入router的路由模式
import {createRouter, createWebHistory} from 'vue-router'
//导入进度条组件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//导入整体布局Layout
import Layout from "@/layout/Layout"
//导入jwt token组件
import jwt from 'jsonwebtoken'

//路由规则
const routes = [
    {
        path: '/login',  //url路径
        component: () => import('@/views/login/Login.vue'),  //视图组件
        icon: "odometer",  //图标
        meta: {title: "登录", requireAuth: false},  //meta元信息
    },
    {
        path: '/',
        redirect: '/home' //重定向
    },
    {
        path: '/home',
        component: Layout,
        icon: "odometer",
        children: [
            {
                path: "/home",
                name: "概要",
                icon: "odometer",
                meta: {title: "概要", requireAuth: true},
                component: () => import('@/views/home/Home.vue'),
            }
        ]
    },
    {
        path: "/cluster",
        name: "集群",
        component: Layout,
        icon: "home-filled",
        meta: {title: "集群", requireAuth: true},
        children: [
            {
                path: "/cluster/node",
                name: "Node",
                icon: "el-icon-s-data",
                meta: {title: "Node", requireAuth: true},
                component: () => import("@/views/node/Node.vue")
            },
            {
                path: "/cluster/namespace",
                name: "Namespace",
                icon: "el-icon-document-add",
                meta: {title: "Namespace", requireAuth: true},
                component: () => import("@/views/namespace/Namespace.vue")
            },
            {
                path: "/cluster/persistentvolume",
                name: "PersistentVolume",
                icon: "el-icon-document-add",
                meta: {title: "PersistemtVolume", requireAuth: true},
                component: () => import("@/views/persistentvolume/PersistentVolume.vue")
            }
        ]
    },
    {
        path: "/workload",
        name: "工作负载",
        component: Layout,
        icon: "menu",
        meta: {title: "工作负载", requireAuth: true},
        children: [
            {
                path: "/workload/deployment",
                name: "Deployment",
                icon: "el-icon-s-data",
                meta: {title: "Deployment", requireAuth: true},
                component: () => import("@/views/deployment/Deployment.vue")
            },
            {
                path: "/workload/pod",
                name: "Pod",
                icon: "el-icon-document-add",
                meta: {title: "Pod", requireAuth: true},
                component: () => import("@/views/pod/Pod.vue")
            },
            {
                path: "/workload/deamonset",
                name: "DaemonSet",
                icon: "el-icon-document-add",
                meta: {title: "DaemonSet", requireAuth: true},
                component: () => import("@/views/daemonset/DaemonSet.vue")
            },
            {
                path: "/workload/statefulset",
                name: "StatefulSet",
                icon: "el-icon-document-add",
                meta: {title: "DaemonSets", requireAuth: true},
                component: () => import("@/views/statefulset/StatefulSet.vue")
            }
        ]
    },
    {
        path: "/loadbalance",
        name: "负载均衡",
        component: Layout,
        icon: "files",
        meta: {title: "负载均衡", requireAuth: true},
        children: [
            {
                path: "/loadbalance/service",
                name: "Service",
                icon: "el-icon-s-data",
                meta: {title: "Service", requireAuth: true},
                component: () => import("@/views/service/Service.vue")
            },
            {
                path: "/loadbalance/ingress",
                name: "Ingress",
                icon: "el-icon-document-add",
                meta: {title: "Ingress", requireAuth: true},
                component: () => import("@/views/ingress/Ingress.vue")
            }
        ]
    },
    {
        path: "/storage",
        name: "存储与配置",
        component: Layout,
        icon: "tickets",
        meta: {title: "存储与配置", requireAuth: true},
        children: [
            {
                path: "/storage/configmap",
                name: "Configmap",
                icon: "el-icon-document-add",
                meta: {title: "Configmap", requireAuth: true},
                component: () => import("@/views/configmap/ConfigMap.vue")
            },
            {
                path: "/storage/secret",
                name: "Secret",
                icon: "el-icon-document-add",
                meta: {title: "Secret", requireAuth: true},
                component: () => import("@/views/secret/Secret.vue")
            },
            {
                path: "/storage/persistentvolumeclaim",
                name: "PersistentVolumeClaim",
                icon: "el-icon-s-data",
                meta: {title: "PersistentVolumeClaim", requireAuth: true},
                component: () => import("@/views/persistentvolumeclaim/PersistentVolumeClaim.vue")
            },
        ]
    },
    {
        path: '/404',
        component: () => import('@/views/common/404.vue'),
        meta: {
            title: '404'
        }
    },
    {
        path: '/403',
        component: () => import('@/views/common/403.vue'),
        meta: {
            title: '403'
        }
    },
    //其他路径跳转至404页面
    {
        path: '/:pathMatch(.*)',
        redirect: '/404'
    },
]

// createRouter 创建路由实例
const router = createRouter({
    /**
     * hash模式：createWebHashHistory，
     * history模式：createWebHistory
     */
    history: createWebHistory(),
    routes
})

//递增进度条，这将获取当前状态值并添加0.2直到状态为0.994
NProgress.inc(100)
//easing 动画字符串
//speed 动画速度
//showSpinner 进度环显示隐藏
NProgress.configure({ easing: 'ease', speed: 600, showSpinner: false })

//router.beforeEach（）一般用来做一些进入页面的限制。比如没有登录，就不能进入某些
//页面，只有登录了之后才有权限查看某些页面。。。说白了就是路由拦截。
//to 要去到某个页面的属性
//from 从哪个页面来的属性
//next 处理路由跳转及放行
router.beforeEach((to, from, next) => {
    // 启动进度条
    NProgress.start()

    // 设置头部
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = "Kubernetes"
    }
    //放行
    next()
})

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    //验证jwt token是否合法
    jwt.verify(localStorage.getItem('token'), 'adoodevops', function (err) {
        if (to.path === '/login') {
            next()
        } else if (err) {
            next('/login');
        } else {
            next();
        }
    });
});

router.afterEach(() => {
    // 关闭进度条
    NProgress.done()
})

// 抛出路由实例, 在 main.js 中引用
export default router