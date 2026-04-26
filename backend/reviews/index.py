"""
Бэкенд для отзывов: получение и добавление. Фильтрация мата на русском и английском.
"""
import json
import os
import psycopg2

BAD_WORDS = [
    "блять", "блядь", "бляд", "сука", "суки", "пиздец", "пизда", "пизд",
    "хуй", "хуя", "хуе", "хуё", "ёбаный", "ебаный", "ебать", "ёбать",
    "еблан", "мудак", "мудила", "залупа", "залуп", "ёб", "еб",
    "fuck", "shit", "bitch", "asshole", "cunt", "bastard", "dick",
    "cock", "pussy", "whore", "damn", "crap",
]

def contains_bad_words(text: str) -> bool:
    lower = text.lower()
    for word in BAD_WORDS:
        if word in lower:
            return True
    return False

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "GET":
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, author_name, rating, comment, created_at FROM reviews ORDER BY created_at DESC LIMIT 100"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        reviews = [
            {
                "id": r[0],
                "author_name": r[1],
                "rating": r[2],
                "comment": r[3],
                "created_at": r[4].isoformat() if r[4] else None,
            }
            for r in rows
        ]
        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"reviews": reviews}, ensure_ascii=False),
        }

    if method == "POST":
        raw_body = event.get("body") or "{}"
        body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
        author_name = (body.get("author_name") or "Аноним").strip()[:100]
        rating = int(body.get("rating", 5))
        comment = (body.get("comment") or "").strip()

        if not comment:
            return {
                "statusCode": 400,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Комментарий не может быть пустым"}, ensure_ascii=False),
            }

        if len(comment) > 1000:
            return {
                "statusCode": 400,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Комментарий слишком длинный (максимум 1000 символов)"}, ensure_ascii=False),
            }

        if contains_bad_words(comment) or contains_bad_words(author_name):
            return {
                "statusCode": 400,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Отзыв содержит недопустимые слова. Пожалуйста, выразитесь культурно 🙏"}, ensure_ascii=False),
            }

        if rating < 1 or rating > 5:
            rating = 5

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO reviews (author_name, rating, comment) VALUES (%s, %s, %s) RETURNING id, created_at",
            (author_name, rating, comment),
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({
                "success": True,
                "review": {
                    "id": row[0],
                    "author_name": author_name,
                    "rating": rating,
                    "comment": comment,
                    "created_at": row[1].isoformat(),
                }
            }, ensure_ascii=False),
        }

    return {"statusCode": 405, "headers": CORS_HEADERS, "body": "Method not allowed"}