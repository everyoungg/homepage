from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)  # CORS 설정 추가

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_input = request.json["message"]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # gpt-4는 현재 비용이 많이 들 수 있어서 3.5-turbo로 설정
            messages=[
                {
                    "role": "system",
                    "content": "당신은 Fit Buddy라는 피트니스 트레이너 챗봇입니다. 사용자의 운동과 건강에 관한 질문에 답변해주세요. 답변은 친절하고 전문적이어야 합니다."
                },
                {"role": "user", "content": user_input}
            ]
        )
        return jsonify({"reply": response["choices"][0]["message"]["content"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000) 