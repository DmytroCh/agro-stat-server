-- Database: agro-stat-db

-- DROP DATABASE "agro-stat-db";

CREATE DATABASE "agro-stat-db"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
    
-- Table: public.crops

-- DROP TABLE public.crops;

CREATE TABLE public.crops
(
    crop_id integer NOT NULL DEFAULT nextval('crops_crop_id_seq'::regclass),
    crop_name character varying(40) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT crops_pkey PRIMARY KEY (crop_id)
)

TABLESPACE pg_default;

ALTER TABLE public.crops
    OWNER to postgres;

-- Table: public.prices

-- DROP TABLE public.prices;

CREATE TABLE public.prices
(
    price_id integer NOT NULL DEFAULT nextval('prices_price_id_seq'::regclass),
    crop_name_id integer NOT NULL,
    data_date date NOT NULL,
    price numeric NOT NULL,
    country character varying(3) COLLATE pg_catalog."default" NOT NULL,
    currency character varying(3) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT prices_pkey PRIMARY KEY (price_id),
    CONSTRAINT prices_crop_name_id_fkey FOREIGN KEY (crop_name_id)
        REFERENCES public.crops (crop_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT price_value CHECK (price > 0::numeric),
    CONSTRAINT "country name length" CHECK (length(country::text) = 3),
    CONSTRAINT currency_standard CHECK (length(currency::text) = 3)
)

TABLESPACE pg_default;

ALTER TABLE public.prices
    OWNER to postgres;

COMMENT ON COLUMN public.prices.country
    IS 'In ISO 3166-1 Alpha-3 standard';

COMMENT ON COLUMN public.prices.currency
    IS 'in ISO4217 standard';

COMMENT ON CONSTRAINT price_value ON public.prices
    IS 'Price must be >= 0';
