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
    
-- Table: public.countries

-- DROP TABLE public.countries;

CREATE TABLE public.countries
(
    country_id integer NOT NULL DEFAULT nextval('countries_country_id_seq'::regclass),
    country_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT countries_pkey PRIMARY KEY (country_id)
)

TABLESPACE pg_default;

ALTER TABLE public.countries
    OWNER to postgres;

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
    
-- Table: public.currencies

-- DROP TABLE public.currencies;

CREATE TABLE public.currencies
(
    currency_id integer NOT NULL DEFAULT nextval('currencies_currency_id_seq'::regclass),
    currency_name character varying(3) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT currencies_pkey PRIMARY KEY (currency_id),
    CONSTRAINT currency_standard CHECK (length(currency_name::text) = 3)
)

TABLESPACE pg_default;

ALTER TABLE public.currencies
    OWNER to postgres;

COMMENT ON CONSTRAINT currency_standard ON public.currencies
    IS 'Must be in ISO4217 standard';
    
-- Table: public.regions

-- DROP TABLE public.regions;

CREATE TABLE public.regions
(
    region_id integer NOT NULL DEFAULT nextval('regions_region_id_seq'::regclass),
    region_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT regions_pkey PRIMARY KEY (region_id)
)

TABLESPACE pg_default;

ALTER TABLE public.regions
    OWNER to postgres;
    
-- Table: public.prices

-- DROP TABLE public.prices;

CREATE TABLE public.prices
(
    price_id integer NOT NULL DEFAULT nextval('prices_price_id_seq'::regclass),
    crop_name_id integer NOT NULL,
    country_id integer NOT NULL,
    region_id integer,
    data_date date NOT NULL,
    price numeric NOT NULL,
    currency_id integer NOT NULL,
    CONSTRAINT prices_pkey PRIMARY KEY (price_id),
    CONSTRAINT prices_crop_name_id_country_id_region_id_data_date_key UNIQUE (crop_name_id, country_id, region_id, data_date),
    CONSTRAINT prices_country_id_fkey FOREIGN KEY (country_id)
        REFERENCES public.countries (country_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT prices_crop_name_id_fkey FOREIGN KEY (crop_name_id)
        REFERENCES public.crops (crop_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT prices_currency_id_fkey FOREIGN KEY (currency_id)
        REFERENCES public.currencies (currency_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT prices_region_id_fkey FOREIGN KEY (region_id)
        REFERENCES public.regions (region_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT price_value CHECK (price > 0::numeric)
)

TABLESPACE pg_default;

ALTER TABLE public.prices
    OWNER to postgres;

COMMENT ON CONSTRAINT price_value ON public.prices
    IS 'Price must be >= 0';
