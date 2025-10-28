# QuickTV-Vue3 Framework

<p align="center">
  <img src="public/logo.png" width="120" alt="QuickTV-Vue3 Logo" />
</p>

<h1 align="center"><b>QuickTV-Vue3 Framework</b></h1>

<p align="center">
  A powerful, modular cross-platform framework based on Vue 3, Webpack and TypeScript.  
  Designed for Smart TVs, Embedded Systems and Next-Gen UI engines.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/vue-3.x-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/typescript-5.x-blue?style=flat-square" />
</p>

---

## 项目简介

**QuickTV-Vue3** 是一个基于 **Vue 3 + Webpack + TypeScript** 的跨端运行框架，  
为智能电视（Smart TV）、机顶盒、IoT 设备等提供高性能 UI 框架与原生模块集成能力。

项目具备以下特性：

- 模块化设计，支持多播放器、系统模块扩展
- 支持原生通信（Android / Harmony）
- 完整的 Vue 3 渲染与调试支持
- 可扩展组件库（ESComponent, ESCard 等）
- 内置多种播放器与服务模块

---

## 目录结构

```bash
es-vue3/
├── .husky/
├── .idea/
├── dist/
├── doc/
├── node_modules/
├── packages/
│   ├── ESCore/
│   ├── ESComponent/
│   ├── ESRouter/
│   ├── ESAxios/
│   ├── ESDebugServer/
│   ├── ESPlayerManager/
│   ├── ESSoundPoolPlayer/
│   ├── ESVueCssLoader/
│   ├── ESDynamicImportPlugin/
│   ├── ...
│
├── public/
├── scripts/
├── src/
│   ├── main.ts
│   ├── config/
│   ├── components/
│   └── pages/
│
├── webpack.config.js
├── vue.config.js
├── tsconfig.json
├── babel.config.js
├── package.json
└── README.md
```

---

## 安装与构建

### 环境要求

- Node.js >= 16
- Yarn 或 npm 或 pnpm
- Webpack 5
- Vue 3.4+
- TypeScript 5+

### 安装依赖

```bash
yarn install
```

### 启动开发模式

```bash
yarn dev
```

### 构建生产包

```bash
yarn build
```

构建产物默认输出至：

```
dist/
```

---

## 内置模块一览

| 模块名                                            | 说明                |
|:-----------------------------------------------|:------------------|
| **ESVue**                                      | Vue3.x 扩展         |
| **ESVueCssLoader / ESVueStyleParser**          | 样式加载与解析插件         |
| **ESCore**                                     | 核心框架模块，提供运行时管理与通信 |
| **ESComponent**                                | 通用组件库             |
| **ESRouter**                                   | 路由与导航控制           |
| **ESDebugServer**                              | 开发调试服务模块          |
| **ESAxios**                                    | 网络层封装，支持拦截器与日志    |
| **ESPlayer / ESPlayerManager / ESVideoPlayer** | 播放器支持             |
| **ESSoundPoolPlayer / ESAudioPlayer**          | 音频播放模块            |
| **ESDynamicImportPlugin**                      | 自定义动态导入支持（ES3 兼容） |
| **ESContentProvider**                          | 内容提供者模块           |
| **ESErrorHandler**                             | 错误处理              |

---

## License

This project is licensed under the **Apache2.0 License** — see the [LICENSE](https://opensource.org/licenses/apache-2-0)
file for details.

