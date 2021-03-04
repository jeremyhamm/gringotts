CREATE TABLE public.transactions (
	id uuid NOT NULL,
	"date" timestamp(0) NOT NULL,
	debit float8 NULL,
	credit float8 NULL,
	description varchar(255) NULL,
	category varchar(255) NULL,
	account varchar(255) NULL
);