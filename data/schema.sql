DROP TABLE IF EXISTS savedIdeas;

CREATE TABLE savedIdeas (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    creator_name VARCHAR(255),
    categories VARCHAR(255),
    source VARCHAR(255),
    source_URL VARCHAR(65535),
    description TEXT,
    saveDate DATE,
    notes TEXT,
    scoreOfTen NUMERIC(2)
  );
