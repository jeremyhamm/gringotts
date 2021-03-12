CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.transactions (
	id uuid DEFAULT uuid_generate_v4 (),
	transaction_id varchar(255) NOT NULL,
	"date" timestamp(0) NOT NULL,
	debit float8 NULL,
	credit float8 NULL,
	description varchar(255) NULL,
	category varchar(255) NULL,
	account varchar(255) NULL
);