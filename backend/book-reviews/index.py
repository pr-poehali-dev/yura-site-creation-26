"""
Отзывы к учебникам — получение и добавление по ключу книги.
"""
import json, os, psycopg2

BAD_WORDS = [
    "блять","блядь","бляд"," сука "," суки ","пиздец","пизда","пизд",
    "хуй","хуя","хуеc","хуён","ёбаный","ебаный","ебать","ёбать",
    "еблан","мудак","мудила","залупа","залуп",
    "fuck","shit","bitch","asshole","cunt","bastard","dick",
]

def has_bad(text: str) -> bool:
    t = " " + text.lower() + " "
    return any(w in t for w in BAD_WORDS)

CORS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"}

def db(): return psycopg2.connect(os.environ["DATABASE_URL"])
SCHEMA = os.environ.get("MAIN_DB_SCHEMA","public")

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode":200,"headers":CORS,"body":""}
    method = event.get("httpMethod","GET")
    params = event.get("queryStringParameters") or {}
    book_key = params.get("book_key","")

    if method == "GET":
        if not book_key:
            return {"statusCode":400,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"error":"book_key required"},ensure_ascii=False)}
        conn = db(); cur = conn.cursor()
        cur.execute(f"SELECT id,author_name,rating,comment,created_at FROM {SCHEMA}.book_reviews WHERE book_key=%s ORDER BY created_at DESC LIMIT 20",(book_key,))
        rows = cur.fetchall(); cur.close(); conn.close()
        reviews = [{"id":r[0],"author_name":r[1],"rating":r[2],"comment":r[3],"created_at":r[4].isoformat()} for r in rows]
        return {"statusCode":200,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"reviews":reviews},ensure_ascii=False)}

    if method == "POST":
        raw = event.get("body") or "{}"
        body = json.loads(raw) if isinstance(raw, str) else raw
        bk = (body.get("book_key") or "").strip()[:200]
        author = (body.get("author_name") or "Аноним").strip()[:100]
        rating = int(body.get("rating", 5))
        comment = (body.get("comment") or "").strip()
        if not bk or not comment:
            return {"statusCode":400,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"error":"book_key и comment обязательны"},ensure_ascii=False)}
        if has_bad(comment) or has_bad(author):
            return {"statusCode":400,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"error":"Отзыв содержит недопустимые слова 🙏"},ensure_ascii=False)}
        if rating < 1 or rating > 5: rating = 5
        conn = db(); cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.book_reviews (book_key,author_name,rating,comment) VALUES (%s,%s,%s,%s) RETURNING id,created_at",(bk,author,rating,comment))
        row = cur.fetchone(); conn.commit(); cur.close(); conn.close()
        return {"statusCode":200,"headers":{**CORS,"Content-Type":"application/json"},"body":json.dumps({"success":True,"review":{"id":row[0],"author_name":author,"rating":rating,"comment":comment,"created_at":row[1].isoformat()}},ensure_ascii=False)}

    return {"statusCode":405,"headers":CORS,"body":""}