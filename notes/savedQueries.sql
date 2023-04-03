
-- Table: public.SavedQueries

-- DROP TABLE IF EXISTS public."SavedQueries";

CREATE TABLE IF NOT EXISTS public."SavedQueries"(
ID  SERIAL PRIMARY KEY,
NAME VARCHAR(32) NOT NULL,
QUERY VARCHAR(512) NOT NULL,
updatedAt timestamp default current_timestamp);

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."SavedQueries"
    OWNER to plsxuxik;