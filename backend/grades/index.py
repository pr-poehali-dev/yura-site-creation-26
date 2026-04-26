"""
Рейтинг оценок — голосование и получение статистики.
"""
import json, os, psycopg2

CORS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"}

def db(): return psycopg2.connect(os.environ["DATABASE_URL"])
SCHEMA = os.environ.get("MAIN_DB_SCHEMA","public")

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode":200,"headers":CORS,"body":""}
    method = event.get("httpMethod","GET")

    if method == "GET":
        conn = db(); cur = conn.cursor()
        cur.execute(f"SELECT grade, COUNT(*) FROM {SCHEMA}.grade_ratings GROUP BY grade")
        rows = cur.fetchall(); cur.close(); conn.close()
        stats = {"5":0,"4":0,"3":0,"2":0,"1":0}
        for r in rows:
            stats[r[0]] = int(r[1])
        total = sum(stats.values())
        return {"statusCode":200,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"stats":stats,"total":total},ensure_ascii=False)}

    if method == "POST":
        raw = event.get("body") or "{}"
        body = json.loads(raw) if isinstance(raw, str) else raw
        session_id = (body.get("session_id") or "anon").strip()[:100]
        grade = str(body.get("grade","5")).strip()
        if grade not in ["1","2","3","4","5"]:
            return {"statusCode":400,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"error":"Оценка должна быть от 1 до 5"},ensure_ascii=False)}
        conn = db(); cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.grade_ratings (session_id,grade) VALUES (%s,%s)",(session_id,grade))
        conn.commit(); cur.close(); conn.close()
        return {"statusCode":200,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"success":True},ensure_ascii=False)}

    return {"statusCode":405,"headers":CORS,"body":""}
