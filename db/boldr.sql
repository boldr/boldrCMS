--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS boldr;
--
-- Name: boldr; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE boldr WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE boldr OWNER TO postgres;

\connect boldr

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: action_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE action_type (
    id integer NOT NULL,
    type text NOT NULL,
    CONSTRAINT action_type_type_check CHECK ((type = ANY (ARRAY['create'::text, 'update'::text, 'delete'::text, 'register'::text])))
);


ALTER TABLE action_type OWNER TO postgres;

--
-- Name: action_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE action_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE action_type_id_seq OWNER TO postgres;

--
-- Name: action_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE action_type_id_seq OWNED BY action_type.id;


--
-- Name: activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE activity (
    id uuid DEFAULT uuid_generate_v1mc() NOT NULL,
    user_id uuid NOT NULL,
    action_type_id integer NOT NULL,
    activity_post uuid,
    activity_user uuid,
    activity_attachment uuid,
    activity_tag integer,
    activity_menu_detail integer,
    activity_template integer,
    activity_page uuid,
    activity_role integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE activity OWNER TO postgres;

--
-- Name: attachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE attachment (
    id uuid DEFAULT uuid_generate_v1mc() NOT NULL,
    file_name character varying(255) NOT NULL,
    original_name character varying(255),
    file_description character varying(255),
    file_type character varying(255),
    user_id uuid NOT NULL,
    url character varying(255) NOT NULL,
    s3_key character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    safe_name character varying(255)
);


ALTER TABLE attachment OWNER TO postgres;

--
-- Name: gallery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE gallery (
    id uuid DEFAULT uuid_generate_v1mc() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255),
    description character varying(255),
    restricted boolean DEFAULT false,
    status text DEFAULT 'draft'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    CONSTRAINT gallery_status_check CHECK ((status = ANY (ARRAY['published'::text, 'draft'::text, 'archived'::text])))
);


ALTER TABLE gallery OWNER TO postgres;

--
-- Name: menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE menu (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    label character varying(255) NOT NULL,
    attributes json,
    restricted boolean DEFAULT false,
    "order" integer NOT NULL
);


ALTER TABLE menu OWNER TO postgres;

--
-- Name: menu_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE menu_detail (
    id integer NOT NULL,
    label character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    attribute character varying(255),
    "position" integer,
    parent_id integer,
    link character varying(255) NOT NULL,
    icon character varying(255)
);


ALTER TABLE menu_detail OWNER TO postgres;

--
-- Name: menu_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE menu_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE menu_detail_id_seq OWNER TO postgres;

--
-- Name: menu_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE menu_detail_id_seq OWNED BY menu_detail.id;


--
-- Name: menu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE menu_id_seq OWNER TO postgres;

--
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE menu_id_seq OWNED BY menu.id;


--
-- Name: menu_menu_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE menu_menu_detail (
    menu_id integer NOT NULL,
    menu_detail_id integer NOT NULL
);


ALTER TABLE menu_menu_detail OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE migrations_id_seq OWNED BY migrations.id;


--
-- Name: migrations_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE migrations_lock (
    is_locked integer
);


ALTER TABLE migrations_lock OWNER TO postgres;

--
-- Name: page; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE page (
    id uuid DEFAULT uuid_generate_v1mc() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255),
    url character varying(255) NOT NULL,
    layout json,
    data json,
    status text DEFAULT 'draft'::text,
    restricted boolean DEFAULT false,
    meta json,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    CONSTRAINT page_status_check CHECK ((status = ANY (ARRAY['published'::text, 'draft'::text, 'archived'::text])))
);


ALTER TABLE page OWNER TO postgres;

--
-- Name: post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE post (
    id uuid DEFAULT uuid_generate_v1mc() NOT NULL,
    title character varying(140) NOT NULL,
    slug character varying(255) NOT NULL,
    feature_image character varying(255),
    attachments json,
    meta json,
    featured boolean DEFAULT false,
    content text NOT NULL,
    excerpt text NOT NULL,
    user_id uuid NOT NULL,
    published boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE post OWNER TO postgres;

--
-- Name: post_attachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE post_attachment (
    post_id uuid NOT NULL,
    attachment_id uuid NOT NULL
);


ALTER TABLE post_attachment OWNER TO postgres;

--
-- Name: post_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE post_tag (
    id integer NOT NULL,
    post_id uuid NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE post_tag OWNER TO postgres;

--
-- Name: post_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE post_tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE post_tag_id_seq OWNER TO postgres;

--
-- Name: post_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE post_tag_id_seq OWNED BY post_tag.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE role (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    image character varying(200),
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE role OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE role_id_seq OWNED BY role.id;


--
-- Name: setting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE setting (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    label character varying(100) NOT NULL,
    value character varying(255) NOT NULL,
    description character varying(255) NOT NULL
);


ALTER TABLE setting OWNER TO postgres;

--
-- Name: setting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE setting_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE setting_id_seq OWNER TO postgres;

--
-- Name: setting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE setting_id_seq OWNED BY setting.id;


--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE tag (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255)
);


ALTER TABLE tag OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tag_id_seq OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE tag_id_seq OWNED BY tag.id;


--
-- Name: template; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE template (
    id integer NOT NULL,
    uuid uuid,
    name character varying(100) NOT NULL,
    slug character varying(110) NOT NULL,
    meta json,
    content json,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE template OWNER TO postgres;

--
-- Name: template_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE template_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE template_id_seq OWNER TO postgres;

--
-- Name: template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE template_id_seq OWNED BY template.id;


--
-- Name: template_page; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE template_page (
    id integer NOT NULL,
    page_id uuid NOT NULL,
    template_id integer NOT NULL
);


ALTER TABLE template_page OWNER TO postgres;

--
-- Name: template_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE template_page_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE template_page_id_seq OWNER TO postgres;

--
-- Name: template_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE template_page_id_seq OWNED BY template_page.id;


--
-- Name: token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE token (
    id integer NOT NULL,
    user_verification_token character varying(255),
    reset_password_token character varying(255),
    reset_password_expiration timestamp with time zone,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE token OWNER TO postgres;

--
-- Name: token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE token_id_seq OWNER TO postgres;

--
-- Name: token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE token_id_seq OWNED BY token.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "user" (
    id uuid DEFAULT uuid_generate_v1mc() NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(64) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    username character varying(115) NOT NULL,
    avatar_url character varying(255) DEFAULT 'https://boldr.io/images/unknown-avatar.png'::character varying,
    profile_image character varying(255),
    location character varying(100),
    bio text,
    birthday date,
    website character varying(100),
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE "user" OWNER TO postgres;

--
-- Name: user_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE user_role (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE user_role OWNER TO postgres;

--
-- Name: user_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE user_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_role_id_seq OWNER TO postgres;

--
-- Name: user_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE user_role_id_seq OWNED BY user_role.id;


--
-- Name: action_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY action_type ALTER COLUMN id SET DEFAULT nextval('action_type_id_seq'::regclass);


--
-- Name: menu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY menu ALTER COLUMN id SET DEFAULT nextval('menu_id_seq'::regclass);


--
-- Name: menu_detail id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY menu_detail ALTER COLUMN id SET DEFAULT nextval('menu_detail_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY migrations ALTER COLUMN id SET DEFAULT nextval('migrations_id_seq'::regclass);


--
-- Name: post_tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post_tag ALTER COLUMN id SET DEFAULT nextval('post_tag_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY role ALTER COLUMN id SET DEFAULT nextval('role_id_seq'::regclass);


--
-- Name: setting id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY setting ALTER COLUMN id SET DEFAULT nextval('setting_id_seq'::regclass);


--
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tag ALTER COLUMN id SET DEFAULT nextval('tag_id_seq'::regclass);


--
-- Name: template id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY template ALTER COLUMN id SET DEFAULT nextval('template_id_seq'::regclass);


--
-- Name: template_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY template_page ALTER COLUMN id SET DEFAULT nextval('template_page_id_seq'::regclass);


--
-- Name: token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY token ALTER COLUMN id SET DEFAULT nextval('token_id_seq'::regclass);


--
-- Name: user_role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_role ALTER COLUMN id SET DEFAULT nextval('user_role_id_seq'::regclass);


--
-- Data for Name: action_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO action_type (id, type) VALUES (1, 'create');
INSERT INTO action_type (id, type) VALUES (2, 'update');
INSERT INTO action_type (id, type) VALUES (3, 'delete');
INSERT INTO action_type (id, type) VALUES (4, 'register');


--
-- Name: action_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('action_type_id_seq', 1, false);


--
-- Data for Name: activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('c1258927-4f1e-48a5-b28d-90f043d13c76', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, 'a0207b95-e7ee-4909-b258-1c2e89d1ba2c', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-27 05:08:50.792+00', '2017-01-27 05:08:50.792+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('939ceb0f-49bc-4cb1-820f-47d6136cf5ca', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, '8a41dcf1-d8db-4376-9b3f-48cc6fa676ad', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-27 05:11:34.041+00', '2017-01-27 05:11:34.041+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('5c6a0860-fd04-4ffc-a304-51021bd32df4', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-27 06:58:21.702+00', '2017-01-27 06:58:21.702+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('913d6a2f-8b71-4d22-8130-54e8b509d85c', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-27 07:03:16.222+00', '2017-01-27 07:03:16.222+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('f3009afd-3d2b-4621-bf6c-c1bde986b666', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-27 07:04:19.001+00', '2017-01-27 07:04:19.001+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('50a183e1-eab5-40c2-9e27-056f2c6becd0', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-27 07:04:59.594+00', '2017-01-27 07:04:59.594+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('47dc5aa6-82c2-4336-883c-877d7f6a7e61', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-27 22:05:40.378+00', '2017-01-27 22:05:40.378+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('51e97eaa-e721-11e6-b085-5fa37052be0b', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-30 19:44:24.898+00', '2017-01-30 19:44:24.898+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('96232bb6-e721-11e6-9491-3ba4c6f26896', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-30 19:46:19.366+00', '2017-01-30 19:46:19.366+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('d2104a32-e721-11e6-a6b5-4b9ef7ef50e5', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-30 19:47:59.899+00', '2017-01-30 19:47:59.899+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('e07d75e0-e721-11e6-a6b5-573ed7815ad1', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-30 19:48:24.11+00', '2017-01-30 19:48:24.11+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('a47ce18a-e72a-11e6-9b85-8b5a1c03acb9', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, 'a4770b66-e72a-11e6-bb8d-1f35ddfbff3b', NULL, NULL, NULL, NULL, NULL, '2017-01-30 20:28:22.418+00', '2017-01-30 20:28:22.418+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('41abccc0-e72e-11e6-9530-df83ecf603ed', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-30 20:54:13.755+00', '2017-01-30 20:54:13.756+00');
INSERT INTO activity (id, user_id, action_type_id, activity_post, activity_user, activity_attachment, activity_tag, activity_menu_detail, activity_template, activity_page, activity_role, created_at, updated_at) VALUES ('7d2f473e-e72b-11e6-b2a9-c3a89d04846e', '1b062e26-df71-48ce-b363-4ae9b966e7a0', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2017-01-30 20:34:25.974+00', '2017-01-30 20:34:25.974+00');


--
-- Data for Name: attachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO attachment (id, file_name, original_name, file_description, file_type, user_id, url, s3_key, created_at, updated_at, safe_name) VALUES ('a4770b66-e72a-11e6-bb8d-1f35ddfbff3b', 'r1A1M76Dl.jpg', 'fullsize.jpg', NULL, 'image/jpeg', '1b062e26-df71-48ce-b363-4ae9b966e7a0', '/files/r1A1M76Dl.jpg', NULL, '2017-01-30 20:28:22.379+00', '2017-01-30 20:28:22.379+00', 'r1A1M76Dl.jpg');


--
-- Data for Name: gallery; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO menu (id, name, label, attributes, restricted, "order") VALUES (1, 'Main', 'main', '{}', false, 0);


--
-- Data for Name: menu_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO menu_detail (id, label, name, attribute, "position", parent_id, link, icon) VALUES (1, 'about', 'About', NULL, 1, NULL, '/about', 'info');
INSERT INTO menu_detail (id, label, name, attribute, "position", parent_id, link, icon) VALUES (2, 'blog', 'Blog', NULL, 2, NULL, '/blog', 'info');


--
-- Name: menu_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('menu_detail_id_seq', 7, true);


--
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('menu_id_seq', 1, true);


--
-- Data for Name: menu_menu_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO menu_menu_detail (menu_id, menu_detail_id) VALUES (1, 1);
INSERT INTO menu_menu_detail (menu_id, menu_detail_id) VALUES (1, 2);


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO migrations (id, name, batch, migration_time) VALUES (1, '201701270219_initial.js', 1, '2017-01-27 02:51:40.674+00');


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('migrations_id_seq', 1, true);


--
-- Data for Name: migrations_lock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO migrations_lock (is_locked) VALUES (0);


--
-- Data for Name: page; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO page (id, name, slug, url, layout, data, status, restricted, meta, created_at, updated_at) VALUES ('87d1e9b3-b32e-474e-9246-6dce1b21a72d', 'Home', 'home', 'home', '{"showHero":true,"showPosts":true}', '{}', 'published', false, '{"title":"Home","description":"The home page"}', '2017-01-27 02:52:52.946434+00', NULL);
INSERT INTO page (id, name, slug, url, layout, data, status, restricted, meta, created_at, updated_at) VALUES ('0a277a50-b482-4b86-b0e7-83fdd3a372af', 'About', 'about', 'about', '{"showHero":true,"showPosts":true}', '{}', 'published', false, '{"title":"About","description":"The about page"}', '2017-01-27 02:52:52.949358+00', NULL);


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO post (id, title, slug, feature_image, attachments, meta, featured, content, excerpt, user_id, published, created_at, updated_at) VALUES ('cb61bbae-c91e-4014-b665-3485734b88fb', 'Nother One', 'nother-one', 'https://boldr.io/image3.jpg', NULL, '{}', false, '<h1>Lorem ipsum dolor sit amet.</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis sapien in est aliquam lacinia. Donec fringilla odio nulla, sagittis egestas dolor bibendum ut. Proin eget massa mattis, dictum enim vitae, facilisis eros. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum imperdiet varius ante. Maecenas sit amet luctus sapien, quis aliquet purus. Cras malesuada quam a dui pretium fermentum. Quisque tempor interdum quam, eu lacinia turpis interdum id. Curabitur non mauris lobortis, mattis nulla id, viverra nisi. Phasellus eget porttitor lorem. Quisque facilisis nec arcu eu fringilla. Vivamus elit ipsum, viverra eu maximus a, venenatis nec nibh.Suspendisse iaculis auctor fermentum. Sed suscipit ante nisl, nec iaculis magna consequat vel. Quisque viverra est a justo egestas, euismod egestas metus hendrerit.</p>
<p><br></p>
<blockquote>&nbsp;In ultricies sagittis ex a dapibus. Nunc feugiat lorem non tincidunt euismod. Duis quam nibh, volutpat sit amet enim non, eleifend ullamcorper diam. Etiam iaculis ante ut libero sollicitudin, eget eleifend nulla gravida. Pellentesque ut gravida augue. Donec nibh orci, rutrum nec sapien eu, lacinia pretium nulla. Nunc turpis sem, placerat ac velit sit amet, aliquet ultrices metus.Curabitur mollis venenatis lectus, at elementum felis dapibus non. Sed vel finibus mauris. Aenean semper arcu lectus, porta feugiat urna tincidunt congue. Ut euismod finibus massa quis condimentum. Vivamus interdum velit nec varius consectetur. Vivamus sodales commodo ante, vel fringilla nunc finibus et. Phasellus non sem finibus, congue nibh ut, ornare tortor.Curabitur sapien est, accumsan at justo a, porta malesuada risus. Integer facilisis viverra mauris condimentum finibus.</blockquote>
<p><br></p>
<p>&nbsp;Donec eget tortor id ipsum maximus commodo nec eu quam. Aliquam erat volutpat. Nunc tincidunt est sit amet justo placerat egestas. Vestibulum efficitur, neque tempor feugiat lacinia, turpis ex efficitur urna, ullamcorper porta ligula lorem id neque. Quisque interdum risus at nisl finibus varius. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.In euismod gravida tortor in placerat. Aenean blandit blandit efficitur. Cras a accumsan augue, at tincidunt massa. Vivamus eleifend sem sed nibh tempor laoreet. Quisque blandit turpis vitae bibendum mattis. Nulla sagittis quam eget diam feugiat ultricies. Aliquam varius tellus et turpis viverra tempus. Nam sit amet ex suscipit, convallis tortor at, malesuada felis. Vestibulum arcu eros, bibendum sit amet tempus placerat, pharetra nec tortor. Ut scelerisque quam non magna tincidunt, nec varius massa blandit.</p>
<p><br></p>', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, whenan unknown printer took a galley of type and scrambled it to make a type specimen book.', 'f11d3ebf-4ae6-4578-ba65-0c8f48b7f41f', false, '2017-01-27 02:52:52.686269+00', NULL);
INSERT INTO post (id, title, slug, feature_image, attachments, meta, featured, content, excerpt, user_id, published, created_at, updated_at) VALUES ('ab33a0ca-b349-4cf8-947f-94f415149492', 'Random Post Title', 'random-post-title', 'https://boldr.io/image2.jpg', NULL, '{}', false, '<h1>Lorem ipsum dolor sit amet.</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis sapien in est aliquam lacinia. Donec fringilla odio nulla, sagittis egestas dolor bibendum ut. Proin eget massa mattis, dictum enim vitae, facilisis eros. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum imperdiet varius ante. Maecenas sit amet luctus sapien, quis aliquet purus. Cras malesuada quam a dui pretium fermentum. Quisque tempor interdum quam, eu lacinia turpis interdum id. Curabitur non mauris lobortis, mattis nulla id, viverra nisi. Phasellus eget porttitor lorem. Quisque facilisis nec arcu eu fringilla. Vivamus elit ipsum, viverra eu maximus a, venenatis nec nibh.Suspendisse iaculis auctor fermentum. Sed suscipit ante nisl, nec iaculis magna consequat vel. Quisque viverra est a justo egestas, euismod egestas metus hendrerit.</p>
<p><br></p>
<blockquote>&nbsp;In ultricies sagittis ex a dapibus. Nunc feugiat lorem non tincidunt euismod. Duis quam nibh, volutpat sit amet enim non, eleifend ullamcorper diam. Etiam iaculis ante ut libero sollicitudin, eget eleifend nulla gravida. Pellentesque ut gravida augue. Donec nibh orci, rutrum nec sapien eu, lacinia pretium nulla. Nunc turpis sem, placerat ac velit sit amet, aliquet ultrices metus.Curabitur mollis venenatis lectus, at elementum felis dapibus non. Sed vel finibus mauris. Aenean semper arcu lectus, porta feugiat urna tincidunt congue. Ut euismod finibus massa quis condimentum. Vivamus interdum velit nec varius consectetur. Vivamus sodales commodo ante, vel fringilla nunc finibus et. Phasellus non sem finibus, congue nibh ut, ornare tortor.Curabitur sapien est, accumsan at justo a, porta malesuada risus. Integer facilisis viverra mauris condimentum finibus.</blockquote>
<p><br></p>
<p>&nbsp;Donec eget tortor id ipsum maximus commodo nec eu quam. Aliquam erat volutpat. Nunc tincidunt est sit amet justo placerat egestas. Vestibulum efficitur, neque tempor feugiat lacinia, turpis ex efficitur urna, ullamcorper porta ligula lorem id neque. Quisque interdum risus at nisl finibus varius. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.In euismod gravida tortor in placerat. Aenean blandit blandit efficitur. Cras a accumsan augue, at tincidunt massa. Vivamus eleifend sem sed nibh tempor laoreet. Quisque blandit turpis vitae bibendum mattis. Nulla sagittis quam eget diam feugiat ultricies. Aliquam varius tellus et turpis viverra tempus. Nam sit amet ex suscipit, convallis tortor at, malesuada felis. Vestibulum arcu eros, bibendum sit amet tempus placerat, pharetra nec tortor. Ut scelerisque quam non magna tincidunt, nec varius massa blandit.</p>
<p><br></p>', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, whenan unknown printer took a galley of type and scrambled it to make a type specimen book.', '1b062e26-df71-48ce-b363-4ae9b966e7a0', true, '2017-01-27 02:52:52.687899+00', NULL);
INSERT INTO post (id, title, slug, feature_image, attachments, meta, featured, content, excerpt, user_id, published, created_at, updated_at) VALUES ('a0207b95-e7ee-4909-b258-1c2e89d1ba2c', 'National Operations Manager', 'National-Operations-Manager', 'http://lorempixel.com/640/480', NULL, NULL, false, 'Impedit ut qui perferendis dolor aliquam consequatur tenetur. Ullam dolor ut dolor qui ut voluptas ut. Laborum quasi cumque quisquam qui qui omnis et. Qui a iste similique ut asperiores id esse et. Laboriosam labore consectetur ut et sed. Aliquam ut expedita.
 Pariatur id sunt. Eius sit nesciunt ea ipsum accusamus necessitatibus et. Possimus mollitia rerum reprehenderit non quia quia et. Omnis occaecati accusamus non dolores quis modi reiciendis. Ab voluptas commodi ullam velit enim et nostrum.
 Et architecto est vel enim enim. Voluptatem autem eaque esse aliquam. Sit explicabo quia sit animi. Ducimus saepe mollitia ullam dolorem.', 'Assumenda ratione quibusdam distinctio. Est ducimus perspiciatis delectus. Distinctio minima qui autem. Impedit fugit eaque molestias et ad. Quasi sed sint aperiam consequatur exercitationem blanditiis rem.', '1b062e26-df71-48ce-b363-4ae9b966e7a0', true, '2017-01-27 05:08:50.752+00', '2017-01-27 05:08:50.752+00');
INSERT INTO post (id, title, slug, feature_image, attachments, meta, featured, content, excerpt, user_id, published, created_at, updated_at) VALUES ('8a41dcf1-d8db-4376-9b3f-48cc6fa676ad', 'Chief Optimization Analyst', 'Chief-Optimization-Analyst', 'http://lorempixel.com/640/480', NULL, NULL, false, 'Rerum harum illum ipsum. Ipsam quia qui enim omnis quae. Dolores aliquam quis sapiente sint est. Veniam velit deleniti voluptates qui nostrum. Dolor dolores optio saepe. Et aliquam consequatur qui cum ut quis ea.
 Dolores qui et libero quas sit commodi. Et vero ipsa explicabo non aut eos sunt quam sint. Hic at nobis eius vel quisquam nisi enim ut.
 Illum rerum eligendi. Dolores rerum expedita pariatur. Voluptatem ut vel. Aut sunt eum.', 'Veniam omnis quis et sed et. Sit quo non autem illo nesciunt accusamus. Nam officia molestias laborum aut asperiores ipsa hic inventore. Vitae sed et architecto aut vitae.', '1b062e26-df71-48ce-b363-4ae9b966e7a0', true, '2017-01-27 05:11:33.993+00', '2017-01-27 05:11:33.993+00');


--
-- Data for Name: post_attachment; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: post_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO post_tag (id, post_id, tag_id) VALUES (2, 'cb61bbae-c91e-4014-b665-3485734b88fb', 1);
INSERT INTO post_tag (id, post_id, tag_id) VALUES (3, 'ab33a0ca-b349-4cf8-947f-94f415149492', 2);


--
-- Name: post_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('post_tag_id_seq', 8, true);


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO role (id, name, image, description, created_at, updated_at) VALUES (1, 'Member', NULL, 'A verified user without special privileges', '2017-01-27 02:52:52.555939+00', NULL);
INSERT INTO role (id, name, image, description, created_at, updated_at) VALUES (2, 'Staff', NULL, 'Allows access to the CMS dashboard.', '2017-01-27 02:52:52.557723+00', NULL);
INSERT INTO role (id, name, image, description, created_at, updated_at) VALUES (3, 'Admin', NULL, 'Complete control over the CMS', '2017-01-27 02:52:52.559689+00', NULL);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('role_id_seq', 3, true);


--
-- Data for Name: setting; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO setting (id, key, label, value, description) VALUES (1, 'site_name', 'Site Name', 'Boldr', 'The website name.');
INSERT INTO setting (id, key, label, value, description) VALUES (2, 'site_url', 'Site URL', 'http://localhost:3000', 'The address used to access your website.');
INSERT INTO setting (id, key, label, value, description) VALUES (3, 'site_logo', 'Site Logo', 'https://boldr.io/boldr.png', 'The logo is displayed in the header area.');
INSERT INTO setting (id, key, label, value, description) VALUES (4, 'site_description', 'Site Description', 'A modern CMS', 'Meta header for search results.');
INSERT INTO setting (id, key, label, value, description) VALUES (5, 'favicon', 'Favicon', 'https://boldr.io/favicon.ico', 'Favicon to use for your website.');
INSERT INTO setting (id, key, label, value, description) VALUES (6, 'google_analytics', 'Google Analytics ID', 'UA-323432', 'Google Analytics tracking code');
INSERT INTO setting (id, key, label, value, description) VALUES (7, 'allow_registration', 'Allow Registration', 'true', 'Toggle allowing user''s to register for accounts.');


--
-- Name: setting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('setting_id_seq', 7, true);


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO tag (id, name, description) VALUES (1, 'javascript', 'Something something JS');
INSERT INTO tag (id, name, description) VALUES (2, 'apple', 'Stuff about stuff.');
INSERT INTO tag (id, name, description) VALUES (3, 'Skiing', 'Skiing stuff');
INSERT INTO tag (id, name, description) VALUES (4, 'Snowboarding', 'skiing stuff');


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('tag_id_seq', 4, true);


--
-- Data for Name: template; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO template (id, uuid, name, slug, meta, content, created_at, updated_at) VALUES (1, 'c23891fb-88c2-4e91-b95d-c652f15eab0c', 'Base', 'base', '{}', '{}', '2017-01-27 02:52:52.909895+00', NULL);
INSERT INTO template (id, uuid, name, slug, meta, content, created_at, updated_at) VALUES (2, 'd42f91fb-88c2-4e91-b95d-c652f15eab0c', 'Content', 'content', '{}', '{}', '2017-01-27 02:52:52.912002+00', NULL);


--
-- Name: template_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('template_id_seq', 1, false);


--
-- Data for Name: template_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO template_page (id, page_id, template_id) VALUES (1, '87d1e9b3-b32e-474e-9246-6dce1b21a72d', 1);
INSERT INTO template_page (id, page_id, template_id) VALUES (2, '0a277a50-b482-4b86-b0e7-83fdd3a372af', 2);


--
-- Name: template_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('template_page_id_seq', 2, true);


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('token_id_seq', 3, true);


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "user" (id, email, password, first_name, last_name, username, avatar_url, profile_image, location, bio, birthday, website, verified, created_at, updated_at) VALUES ('1b062e26-df71-48ce-b363-4ae9b966e7a0', 'admin@boldr.io', '$2a$10$F3/Xx3hWEpTdaP4fE/dIhOb.FtxRiYMuc80nQFPkSrsBH4L6B5.Ka', 'Joe', 'Gray', 'Joey', 'https://boldr.io/images/unknown-avatar.png', 'https://boldr.io/images/unknown-avatar.png', 'Colorado', 'I am me.', '1988-01-01', 'https://boldr.io', true, '2017-01-27 02:52:52.60212+00', NULL);
INSERT INTO "user" (id, email, password, first_name, last_name, username, avatar_url, profile_image, location, bio, birthday, website, verified, created_at, updated_at) VALUES ('f11d3ebf-4ae6-4578-ba65-0c8f48b7f41f', 'demo@boldr.io', '$2a$10$F3/Xx3hWEpTdaP4fE/dIhOb.FtxRiYMuc80nQFPkSrsBH4L6B5.Ka', 'Sam', 'Hunt', 'Samus', 'https://boldr.io/images/unknown-avatar.png', 'https://boldr.io/images/unknown-avatar.png', 'California', 'Someone doing things.', '1988-01-01', 'https://boldr.io', true, '2017-01-27 02:52:52.605303+00', NULL);
INSERT INTO "user" (id, email, password, first_name, last_name, username, avatar_url, profile_image, location, bio, birthday, website, verified, created_at, updated_at) VALUES ('f4d869a6-1a75-469b-a9cc-965c552929e4', 'user@boldr.io', '$2a$10$F3/Xx3hWEpTdaP4fE/dIhOb.FtxRiYMuc80nQFPkSrsBH4L6B5.Ka', 'Jessica', 'Smith', 'Jess', 'https://boldr.io/images/unknown-avatar.png', 'https://boldr.io/images/unknown-avatar.png', 'Washington', 'She is a person.', '1988-01-01', 'https://boldr.io', true, '2017-01-27 02:52:52.603831+00', NULL);


--
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO user_role (id, user_id, role_id) VALUES (1, '1b062e26-df71-48ce-b363-4ae9b966e7a0', 3);
INSERT INTO user_role (id, user_id, role_id) VALUES (2, 'f11d3ebf-4ae6-4578-ba65-0c8f48b7f41f', 2);
INSERT INTO user_role (id, user_id, role_id) VALUES (8, 'f4d869a6-1a75-469b-a9cc-965c552929e4', 1);


--
-- Name: user_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('user_role_id_seq', 8, true);


--
-- Name: action_type action_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY action_type
    ADD CONSTRAINT action_type_pkey PRIMARY KEY (id);


--
-- Name: activity activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (id);


--
-- Name: attachment attachment_file_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY attachment
    ADD CONSTRAINT attachment_file_name_unique UNIQUE (file_name);


--
-- Name: attachment attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY attachment
    ADD CONSTRAINT attachment_pkey PRIMARY KEY (id);


--
-- Name: gallery gallery_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY gallery
    ADD CONSTRAINT gallery_name_unique UNIQUE (name);


--
-- Name: gallery gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY gallery
    ADD CONSTRAINT gallery_pkey PRIMARY KEY (id);


--
-- Name: menu_detail menu_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY menu_detail
    ADD CONSTRAINT menu_detail_pkey PRIMARY KEY (id);


--
-- Name: menu_menu_detail menu_menu_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY menu_menu_detail
    ADD CONSTRAINT menu_menu_detail_pkey PRIMARY KEY (menu_id, menu_detail_id);


--
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: page page_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY page
    ADD CONSTRAINT page_name_unique UNIQUE (name);


--
-- Name: page page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY page
    ADD CONSTRAINT page_pkey PRIMARY KEY (id);


--
-- Name: page page_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY page
    ADD CONSTRAINT page_slug_unique UNIQUE (slug);


--
-- Name: page page_url_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY page
    ADD CONSTRAINT page_url_unique UNIQUE (url);


--
-- Name: post_attachment post_attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post_attachment
    ADD CONSTRAINT post_attachment_pkey PRIMARY KEY (post_id, attachment_id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: post post_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post
    ADD CONSTRAINT post_slug_unique UNIQUE (slug);


--
-- Name: post_tag post_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post_tag
    ADD CONSTRAINT post_tag_pkey PRIMARY KEY (id);


--
-- Name: post_tag post_tag_post_id_tag_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post_tag
    ADD CONSTRAINT post_tag_post_id_tag_id_unique UNIQUE (post_id, tag_id);


--
-- Name: post post_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post
    ADD CONSTRAINT post_title_unique UNIQUE (title);


--
-- Name: role role_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY role
    ADD CONSTRAINT role_name_unique UNIQUE (name);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: setting setting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY setting
    ADD CONSTRAINT setting_pkey PRIMARY KEY (id);


--
-- Name: tag tag_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_name_unique UNIQUE (name);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: template template_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY template
    ADD CONSTRAINT template_name_unique UNIQUE (name);


--
-- Name: template_page template_page_page_id_template_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY template_page
    ADD CONSTRAINT template_page_page_id_template_id_unique UNIQUE (page_id, template_id);


--
-- Name: template_page template_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY template_page
    ADD CONSTRAINT template_page_pkey PRIMARY KEY (id);


--
-- Name: template template_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY template
    ADD CONSTRAINT template_pkey PRIMARY KEY (id);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_role user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);


--
-- Name: user_role user_role_user_id_role_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_role
    ADD CONSTRAINT user_role_user_id_role_id_unique UNIQUE (user_id, role_id);


--
-- Name: user user_username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_username_unique UNIQUE (username);


--
-- Name: action_type_type_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX action_type_type_index ON action_type USING btree (type);


--
-- Name: menu_detail_label_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX menu_detail_label_index ON menu_detail USING btree (label);


--
-- Name: menu_detail_link_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX menu_detail_link_index ON menu_detail USING btree (link);


--
-- Name: menu_label_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX menu_label_index ON menu USING btree (label);


--
-- Name: page_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX page_name_index ON page USING btree (name);


--
-- Name: post_created_at_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX post_created_at_index ON post USING btree (created_at);


--
-- Name: post_published_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX post_published_index ON post USING btree (published);


--
-- Name: post_slug_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX post_slug_index ON post USING btree (slug);


--
-- Name: role_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX role_name_index ON role USING btree (name);


--
-- Name: setting_key_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX setting_key_index ON setting USING btree (key);


--
-- Name: setting_value_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX setting_value_index ON setting USING btree (value);


--
-- Name: tag_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tag_name_index ON tag USING btree (name);


--
-- Name: template_slug_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX template_slug_index ON template USING btree (slug);


--
-- Name: template_uuid_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX template_uuid_index ON template USING btree (uuid);


--
-- Name: token_reset_password_token_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX token_reset_password_token_index ON token USING btree (reset_password_token);


--
-- Name: token_user_verification_token_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX token_user_verification_token_index ON token USING btree (user_verification_token);


--
-- Name: user_email_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_email_index ON "user" USING btree (email);


--
-- Name: user_username_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_username_index ON "user" USING btree (username);


--
-- Name: user_verified_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_verified_index ON "user" USING btree (verified);


--
-- Name: activity activity_action_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_action_type_id_foreign FOREIGN KEY (action_type_id) REFERENCES action_type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity activity_activity_attachment_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_activity_attachment_foreign FOREIGN KEY (activity_attachment) REFERENCES attachment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity activity_activity_menu_detail_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_activity_menu_detail_foreign FOREIGN KEY (activity_menu_detail) REFERENCES menu_detail(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity activity_activity_page_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_activity_page_foreign FOREIGN KEY (activity_page) REFERENCES page(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity activity_activity_post_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_activity_post_foreign FOREIGN KEY (activity_post) REFERENCES post(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity activity_activity_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_activity_role_foreign FOREIGN KEY (activity_role) REFERENCES role(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity activity_activity_tag_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_activity_tag_foreign FOREIGN KEY (activity_tag) REFERENCES tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity activity_activity_template_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_activity_template_foreign FOREIGN KEY (activity_template) REFERENCES template(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity activity_activity_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_activity_user_foreign FOREIGN KEY (activity_user) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity activity_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activity
    ADD CONSTRAINT activity_user_id_foreign FOREIGN KEY (user_id) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attachment attachment_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY attachment
    ADD CONSTRAINT attachment_user_id_foreign FOREIGN KEY (user_id) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_menu_detail menu_menu_detail_menu_detail_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY menu_menu_detail
    ADD CONSTRAINT menu_menu_detail_menu_detail_id_foreign FOREIGN KEY (menu_detail_id) REFERENCES menu_detail(id);


--
-- Name: menu_menu_detail menu_menu_detail_menu_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY menu_menu_detail
    ADD CONSTRAINT menu_menu_detail_menu_id_foreign FOREIGN KEY (menu_id) REFERENCES menu(id);


--
-- Name: post_attachment post_attachment_attachment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post_attachment
    ADD CONSTRAINT post_attachment_attachment_id_foreign FOREIGN KEY (attachment_id) REFERENCES attachment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_attachment post_attachment_post_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post_attachment
    ADD CONSTRAINT post_attachment_post_id_foreign FOREIGN KEY (post_id) REFERENCES post(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_tag post_tag_post_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post_tag
    ADD CONSTRAINT post_tag_post_id_foreign FOREIGN KEY (post_id) REFERENCES post(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_tag post_tag_tag_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post_tag
    ADD CONSTRAINT post_tag_tag_id_foreign FOREIGN KEY (tag_id) REFERENCES tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post post_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY post
    ADD CONSTRAINT post_user_id_foreign FOREIGN KEY (user_id) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: template_page template_page_page_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY template_page
    ADD CONSTRAINT template_page_page_id_foreign FOREIGN KEY (page_id) REFERENCES page(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: template_page template_page_template_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY template_page
    ADD CONSTRAINT template_page_template_id_foreign FOREIGN KEY (template_id) REFERENCES template(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: token token_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY token
    ADD CONSTRAINT token_user_id_foreign FOREIGN KEY (user_id) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_role user_role_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_role
    ADD CONSTRAINT user_role_role_id_foreign FOREIGN KEY (role_id) REFERENCES role(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_role user_role_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_role
    ADD CONSTRAINT user_role_user_id_foreign FOREIGN KEY (user_id) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

