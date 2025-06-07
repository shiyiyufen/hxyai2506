from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
import asyncio
import logging
from datetime import datetime

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('backend.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

@app.post("/chat")
async def chat(chat_message: ChatMessage):
    request_time = datetime.now().isoformat()
    logger.info(f"🔥 [后端] 收到聊天请求 - 时间: {request_time}")
    logger.info(f"📝 [后端] 用户消息: {chat_message.message}")
    
    try:
        # Deepseek API 配置
        api_key = os.getenv("DEEPSEEK_API_KEY")
        if not api_key:
            logger.error("❌ [后端] DEEPSEEK_API_KEY 环境变量未找到")
            raise HTTPException(status_code=500, detail="DEEPSEEK_API_KEY not found in environment variables")

        logger.info("🔑 [后端] API Key 已配置")

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": chat_message.message}]
        }

        logger.info(f"📡 [后端] 向 Deepseek API 发送请求")
        logger.info(f"🔧 [后端] 请求载荷: {payload}")

        async with httpx.AsyncClient(timeout=30.0) as client:
            api_start_time = datetime.now()
            response = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                json=payload,
                headers=headers
            )
            api_end_time = datetime.now()
            api_duration = (api_end_time - api_start_time).total_seconds()

            logger.info(f"📥 [后端] Deepseek API 响应状态: {response.status_code}")
            logger.info(f"⏱️ [后端] API 调用耗时: {api_duration:.2f} 秒")

            if response.status_code != 200:
                logger.error(f"❌ [后端] API 错误: {response.status_code} - {response.text}")
                raise HTTPException(status_code=response.status_code, detail=f"API Error: {response.text}")

            result = response.json()
            ai_response = result["choices"][0]["message"]["content"]
            
            logger.info(f"✅ [后端] AI 响应: {ai_response[:100]}...")  # 只记录前100个字符
            logger.info(f"🏁 [后端] 请求处理完成 - 总耗时: {(datetime.now() - datetime.fromisoformat(request_time)).total_seconds():.2f} 秒")
            
            return {"response": ai_response}

    except Exception as e:
        logger.error(f"💥 [后端] 处理请求时发生异常: {str(e)}")
        logger.error(f"⏰ [后端] 异常时间: {datetime.now().isoformat()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    logger.info("🏠 [后端] 根路径被访问")
    return {"message": "AI Chat Backend is running!"}

@app.get("/health")
async def health_check():
    logger.info("💊 [后端] 健康检查被调用")
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}