

select * from finchy.getuserinfo('f1aa3267a2ec7a6bd5641fe9457d1d2d9d8fd0ab');

DROP FUNCTION finchy.getuserinfo(character varying)
CREATE OR REPLACE FUNCTION finchy.getuserinfo(accessToken varchar)
RETURNS TABLE(username varchar, name varchar) AS $$
BEGIN
  RETURN QUERY
SELECT
    uu.username, uu."name"
FROM public."OAuthTokens" oat
JOIN public."OAuthClients" ac on ac."id" = oat."clientId"
JOIN public."OAuthUsers"   uu on uu.id = oat."userId"
WHERE oat."accessToken" = accessToken
AND oat."accessTokenExpiresAt" > NOW();
END;
$$ LANGUAGE plpgsql;
;
======================================================

 Get Disclaimer Content

"Get Current User"
INSERT INTO public."SavedQueries"
("name", description, query, updatedat)
VALUES('Get Current User', 'Get Current User',
'SELECT tablename as helpContent, ''Prefix '' || ROW_NUMBER() OVER (ORDER BY tablename) AS helpContent_fr
FROM pg_catalog.pg_tables
WHERE schemaname = ''public'' AND schemaname != ''information_schema'';',
CURRENT_TIMESTAMP);


======================================================

const result = await db.query('SELECT * FROM users WHERE id = :id', { id: 1 });
======================================================


CREATE PROCEDURE finchy.my_listsp()
AS $$
BEGIN
select n.nspname as function_schema,
       p.proname as function_name,
       l.lanname as function_language,
       case when l.lanname = 'internal' then p.prosrc
            else pg_get_functiondef(p.oid)
            end as definition,
       pg_get_function_arguments(p.oid) as function_arguments,
       t.typname as return_type
from pg_proc p
left join pg_namespace n on p.pronamespace = n.oid
left join pg_language l on p.prolang = l.oid
left join pg_type t on t.oid = p.prorettype
where n.nspname not in ('pg_catalog', 'information_schema')
order by function_schema,
         function_name;
END;
$$ LANGUAGE plpgsql;


CALL finchy.fmy_listsp()

SELECT * FROM
finchy.fmy_listsp('o')
where function_schema = 'finchy';



character varying(255)

CREATE OR REPLACE PROCEDURE finchy_get_user_data (accessToken VARCHAR)
AS $$
BEGIN
   SELECT  ac.id, ac."id" ,oat."clientId", uu.* --"userId", *
FROM public."OAuthTokens" oat
JOIN public."OAuthClients" ac on ac."id" = oat."clientId"
JOIN public."OAuthUsers"   uu on uu.id = oat."userId"
WHERE oat."accessToken" = accessToken

END;
$$ LANGUAGE plpgsql;

call finchy_get_user_data('accessToken');

CREATE OR REPLACE FUNCTION finchy_get_user_data (accessToken VARCHAR)
RETURNS TABLE (id INT, name VARCHAR, username VARCHAR)
AS $$
BEGIN
   RETURN QUERY SELECT  ac.id, ac."id" ,oat."clientId", uu.* --"userId", *
FROM public."OAuthTokens" oat
JOIN public."OAuthClients" ac on ac."id" = oat."clientId"
JOIN public."OAuthUsers"   uu on uu.id = oat."userId"
WHERE oat."accessToken" = accessToken;
END;
$$ LANGUAGE plpgsql;



-- GetUserByToken
SELECT  ac.id, ac."id" ,oat."clientId", uu.* --"userId", *
FROM public."OAuthTokens" oat
JOIN public."OAuthClients" ac on ac."id" = oat."clientId"
JOIN public."OAuthUsers"   uu on uu.id = oat."userId"
WHERE oat."accessToken" = $1
--  and

'd61408d82b8325e4666cc0e12c2253b70cabfadf'
select n.nspname as function_schema,
       p.proname as function_name,
       l.lanname as function_language,
       case when l.lanname = 'internal' then p.prosrc
            else pg_get_functiondef(p.oid)
            end as definition,
       pg_get_function_arguments(p.oid) as function_arguments,
       t.typname as return_type
from pg_proc p
left join pg_namespace n on p.pronamespace = n.oid
left join pg_language l on p.prolang = l.oid
left join pg_type t on t.oid = p.prorettype
where n.nspname not in ('pg_catalog', 'information_schema')
order by function_schema,
         function_name;


/*
INSERT INTO public."SavedQueries"(
	 name, query)
	VALUES ('access_tokens',  'SELECT *
FROM public."access_tokens"');

DELETE FROM public."SavedQueries"
	WHERE id=12;
*/
-- Table: public.Products

-- DROP TABLE IF EXISTS public."Products";

CREATE TABLE IF NOT EXISTS public."Products"
(
    id integer NOT NULL DEFAULT nextval('"OAuthTokens_id_seq"'::regclass),
    "accessToken" character varying(255) COLLATE pg_catalog."default",
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshToken" character varying(255) COLLATE pg_catalog."default",
    "refreshTokenExpiresAt" timestamp with time zone,
    "clientId" integer,
    "userId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "OAuthTokens_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Products"
    OWNER to plsxuxik;
