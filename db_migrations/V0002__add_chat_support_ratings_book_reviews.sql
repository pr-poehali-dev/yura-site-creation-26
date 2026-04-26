-- Чат сообщения
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  author_name VARCHAR(100) NOT NULL DEFAULT 'Аноним',
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Обращения в поддержку
CREATE TABLE support_tickets (
  id SERIAL PRIMARY KEY,
  author_name VARCHAR(100),
  contact VARCHAR(200),
  message TEXT NOT NULL,
  admin_reply TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Рейтинг оценок пользователей
CREATE TABLE grade_ratings (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  grade VARCHAR(1) NOT NULL CHECK (grade IN ('5','4','3','2','1')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Отзывы к учебникам
CREATE TABLE book_reviews (
  id SERIAL PRIMARY KEY,
  book_key VARCHAR(200) NOT NULL,
  author_name VARCHAR(100) DEFAULT 'Аноним',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_created ON chat_messages(created_at DESC);
CREATE INDEX idx_book_reviews_key ON book_reviews(book_key);
