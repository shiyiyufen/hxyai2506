# AI聊天应用

这是一个基于Deepseek API的AI聊天应用，包含前端和后端实现。

## 功能特点

- 简洁美观的用户界面
- 实时聊天功能
- 聊天历史记录保存
- 响应式设计，适配不同设备
- 打字指示器，提供更好的用户体验

## 技术栈

### 前端
- React 18
- TypeScript 4.9
- CSS3
- React Scripts 5.0

### 后端
- FastAPI 0.83.0
- Python 3.7+
- Uvicorn 0.17.0
- HTTPX 0.22.0
- Pydantic 1.9.0
- Deepseek API

## 项目结构

```
ai-chat-app/
├── .vscode/            # VS Code 配置目录
├── app/                # 后端代码
│   ├── main.py        # FastAPI 应用主文件
│   └── __pycache__/   # Python 缓存文件
├── build/             # 前端构建输出目录
├── public/            # 静态资源目录
├── src/               # 前端源代码
│   ├── App.tsx        # 主应用组件
│   ├── App.css        # 主应用样式
│   ├── index.tsx      # 应用入口文件
│   ├── index.css      # 全局样式
│   ├── ErrorBoundary.tsx  # 错误边界处理组件
│   └── DebugPanel.tsx     # 调试面板组件
├── .env               # 环境变量配置
├── .gitignore        # Git 忽略配置
├── package.json      # Node.js 项目配置和依赖
├── package-lock.json # 依赖版本锁定文件
├── requirements.txt  # Python 依赖清单
├── tsconfig.json    # TypeScript 配置
├── start.sh         # 项目启动脚本
└── README.md        # 项目文档
```

### 目录说明

#### 前端部分 (/src)
- `App.tsx`: 应用的主要组件，包含路由和主要业务逻辑
- `ErrorBoundary.tsx`: React 错误边界组件，用于捕获和处理前端错误
- `DebugPanel.tsx`: 开发调试面板，帮助开发过程中的调试
- `index.tsx`: 应用的入口文件，负责React应用的初始化
- `*.css`: 相关组件的样式文件

#### 后端部分 (/app)
- `main.py`: FastAPI 应用主文件，包含所有API端点定义和业务逻辑

#### 配置文件
- `package.json`: 定义了前端项目的依赖和脚本命令
- `requirements.txt`: 列出了后端Python项目的所有依赖
- `tsconfig.json`: TypeScript编译器配置
- `.env`: 环境变量配置文件，包含API密钥等敏感信息

## 安装与运行

### 前提条件
- Python 3.7+
- Node.js 14+
- npm 6+
- Deepseek API密钥

### 安装步骤

1. 克隆仓库
\`\`\`bash
git clone <仓库地址>
cd ai-chat-app
\`\`\`

2. 设置环境变量
\`\`\`bash
# 编辑.env文件，填入您的Deepseek API密钥
nano .env
\`\`\`

3. 使用启动脚本运行应用
\`\`\`bash
./start.sh
\`\`\`

启动脚本会自动安装所需依赖并启动前后端服务。

### 手动安装与运行

如果您不想使用启动脚本，也可以手动安装和运行：

1. 安装后端依赖
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. 安装前端依赖
\`\`\`bash
npm install
\`\`\`

3. 启动后端服务
\`\`\`bash
cd app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

4. 启动前端服务（在新的终端窗口中）
\`\`\`bash
npm start
\`\`\`

## 使用方法

1. 打开浏览器，访问 http://localhost:3000
2. 在输入框中输入您的问题
3. 点击"发送"按钮或按Enter键发送消息
4. AI将会回复您的消息

## 注意事项

- 请确保您有有效的Deepseek API密钥
- 前端默认运行在3000端口，后端默认运行在8000端口
- 聊天历史记录保存在浏览器的本地存储中

## 许可证

MIT

