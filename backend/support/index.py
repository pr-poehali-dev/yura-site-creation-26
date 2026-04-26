"""
Обращения в поддержку — отправка сообщений и получение ответов.
"""
import json, os, psycopg2

CORS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"}

def db(): return psycopg2.connect(os.environ["DATABASE_URL"])
SCHEMA = os.environ.get("MAIN_DB_SCHEMA","public")

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode":200,"headers":CORS,"body":""}
    method = event.get("httpMethod","GET")

    if method == "POST":
        raw = event.get("body") or "{}"
        body = json.loads(raw) if isinstance(raw, str) else raw
        author = (body.get("author_name") or "Аноним").strip()[:100]
        contact = (body.get("contact") or "").strip()[:200]
        message = (body.get("message") or "").strip()
        if not message:
            return {"statusCode":400,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"error":"Сообщение не может быть пустым"},ensure_ascii=False)}
        conn = db(); cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.support_tickets (author_name,contact,message) VALUES (%s,%s,%s) RETURNING id",(author,contact,message))
        row = cur.fetchone(); conn.commit(); cur.close(); conn.close()
        return {"statusCode":200,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"success":True,"id":row[0]},ensure_ascii=False)}

    return {"statusCode":405,"headers":CORS,"body":""}
