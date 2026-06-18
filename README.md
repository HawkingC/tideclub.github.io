# TIDE Club GitHub Pages 静态站点

这是从飞书妙搭导出的项目中整理出的 GitHub Pages 版本，已经去除了飞书妙搭平台运行时、Nest 服务端代码和 npm 构建依赖。

## 文件结构

```text
.
├── index.html          # 网站入口
├── 404.html            # GitHub Pages 直接访问子路径时的跳转兜底
├── .nojekyll           # 禁用 Jekyll 处理，避免静态资源路径问题
├── assets/
│   ├── favicon.svg
│   └── hero-bg.jpg
├── css/
│   └── style.css       # 全站样式
└── js/
    ├── data.js         # 网站内容数据，来自原 tide-club-data.json
    └── app.js          # 前端路由、渲染、搜索筛选逻辑
```

## 部署到 username.github.io

1. 创建或打开你的 `username.github.io` 仓库。
2. 把本文件夹中的所有文件上传到仓库根目录。
3. 进入 GitHub 仓库：`Settings` → `Pages`。
4. Source 选择 `Deploy from a branch`，Branch 选择 `main / root`。
5. 访问 `https://username.github.io/`。

## 修改内容

大多数文字内容都在：

```text
js/data.js
```

你可以直接修改其中的 `club`、`domains`、`projects`、`recruitment` 等字段。

## 修改样式

样式文件在：

```text
css/style.css
```

例如想修改主色，可以调整：

```css
:root {
  --primary: #1d4f91;
  --primary-dark: #123c70;
}
```

## 路由说明

本版本使用 hash 路由，适合 GitHub Pages：

```text
#/                      首页
#/projects              项目列表
#/projects/<projectId>  项目详情
#/projects/<projectId>/sub/<subId>  子项目详情
```

这样可以避免 GitHub Pages 在刷新子页面时出现 404。
