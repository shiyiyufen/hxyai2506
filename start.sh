#!/bin/bash

# 检查是否安装了必要的依赖
check_dependencies() {
  echo "检查依赖..."
  
  # 检查Python
  if ! command -v python3 &> /dev/null; then
    echo "未找到Python3，请安装Python3后再试"
    exit 1
  fi
  
  # 检查Node.js
  if ! command -v node &> /dev/null; then
    echo "未找到Node.js，请安装Node.js后再试"
    exit 1
  fi
  
  # 检查npm
  if ! command -v npm &> /dev/null; then
    echo "未找到npm，请安装npm后再试"
    exit 1
  fi
  
  echo "依赖检查完成"
}

# 安装后端依赖
install_backend_deps() {
  echo "安装后端依赖..."
  pip install -r requirements.txt
  echo "后端依赖安装完成"
}

# 安装前端依赖
install_frontend_deps() {
  echo "安装前端依赖..."
  npm install
  echo "前端依赖安装完成"
}

# 启动后端服务
start_backend() {
  echo "启动后端服务..."
  cd app
  python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
  BACKEND_PID=$!
  cd ..
  echo "后端服务已启动，PID: $BACKEND_PID"
}

# 启动前端服务
start_frontend() {
  echo "启动前端服务..."
  npm start &
  FRONTEND_PID=$!
  echo "前端服务已启动，PID: $FRONTEND_PID"
}

# 检查.env文件
check_env_file() {
  if [ ! -f .env ]; then
    echo "警告: 未找到.env文件，将创建一个示例文件"
    echo "DEEPSEEK_API_KEY=your_deepseek_api_key_here" > .env
    echo "请编辑.env文件，填入您的Deepseek API密钥"
  fi
  
  # 检查API密钥是否已设置
  if grep -q "your_deepseek_api_key_here" .env; then
    echo "警告: 请在.env文件中设置您的Deepseek API密钥"
  fi
}

# 清理函数
cleanup() {
  echo "正在关闭服务..."
  if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null
  fi
  if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null
  fi
  echo "服务已关闭"
  exit 0
}

# 设置清理钩子
trap cleanup SIGINT SIGTERM

# 主函数
main() {
  check_dependencies
  check_env_file
  install_backend_deps
  install_frontend_deps
  start_backend
  start_frontend
  
  echo "AI聊天应用已启动"
  echo "前端地址: http://localhost:3000"
  echo "后端地址: http://localhost:8000"
  echo "按Ctrl+C停止服务"
  
  # 保持脚本运行
  wait
}

# 执行主函数
main