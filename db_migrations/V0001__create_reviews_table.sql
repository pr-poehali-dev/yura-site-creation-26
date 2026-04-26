CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  author_name VARCHAR(100) NOT NULL DEFAULT 'Аноним',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
