"""
Общий чат — получение и отправка сообщений. ИИ-модератор блокирует мат.
"""
import json, os, psycopg2

BAD_WORDS = [
    "блять","блядь","бляд","сука","суки","пиздец","пизда","пизд",
    "хуй","хуя","хуе","хуё","ёбаный","ебаный","ебать","ёбать",
    "еблан","мудак","мудила","залупа","залуп","ёб","еб",
    "fuck","shit","bitch","asshole","cunt","bastard","dick",
    "cock","pussy","whore",
]

def has_bad(text: str) -> bool:
    t = text.lower()
    return any(w in t for w in BAD_WORDS)

CORS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"}

def db(): return psycopg2.connect(os.environ["DATABASE_URL"])

SCHEMA = os.environ.get("MAIN_DB_SCHEMA","public")

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode":200,"headers":CORS,"body":""}

    method = event.get("httpMethod","GET")

    if method == "GET":
        conn = db(); cur = conn.cursor()
        cur.execute(f"SELECT id,author_name,message,is_admin,created_at FROM {SCHEMA}.chat_messages ORDER BY created_at DESC LIMIT 50")
        rows = cur.fetchall(); cur.close(); conn.close()
        msgs = [{"id":r[0],"author_name":r[1],"message":r[2],"is_admin":r[3],"created_at":r[4].isoformat()} for r in rows]
        return {"statusCode":200,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"messages":list(reversed(msgs))},ensure_ascii=False)}

    if method == "POST":
        raw = event.get("body") or "{}"
        body = json.loads(raw) if isinstance(raw, str) else raw
        author = (body.get("author_name") or "Аноним").strip()[:100]
        message = (body.get("message") or "").strip()
        if not message:
            return {"statusCode":400,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"error":"Сообщение пустое"},ensure_ascii=False)}
        if len(message) > 500:
            return {"statusCode":400,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"error":"Сообщение слишком длинное (макс. 500 символов)"},ensure_ascii=False)}
        if has_bad(message) or has_bad(author):
            return {"statusCode":400,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"error":"🚫 Сообщение содержит запрещённые слова. Администратор следит за чатом."},ensure_ascii=False)}
        conn = db(); cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.chat_messages (author_name,message) VALUES (%s,%s) RETURNING id,created_at",(author,message))
        row = cur.fetchone(); conn.commit(); cur.close(); conn.close()
        return {"statusCode":200,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"success":True,"message":{"id":row[0],"author_name":author,"message":message,"is_admin":False,"created_at":row[1].isoformat()}},ensure_ascii=False)}

    return {"statusCode":405,"headers":CORS,"body":""}
