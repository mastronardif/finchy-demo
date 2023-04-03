WITH foobar AS ( 
select ppp.*, aat.* from 
public."Products" ppp
 RIGHT join public.access_tokens aat ON aat.id = ppp.id
	)
 SELECT 
    row_to_json(foobar)
FROM 
    foobar 
 /*
 select * from 
 public.access_tokens
 
 WITH foobar AS ( 
select ppp.*, aat.* from 
public."Products" ppp
 RIGHT join public.access_tokens aat ON aat.id = ppp.id
	)
 SELECT 
    *
FROM 
    foobar 
 
 */

