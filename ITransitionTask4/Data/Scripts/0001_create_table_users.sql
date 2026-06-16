create table users(
    id                          uuid not null primary key,
    first_name                  varchar(50) not null,
    last_name                   varchar(50) not null,
    password_hash               varchar(255) not null,
    occupation                  varchar(100) null,
    email                       varchar(100) not null,
    status                      smallint not null,
    previous_status             smallint null,
    joined_date                 timestamptz not null default now(),
    last_seen_time              timestamptz null,
    verification_token          uuid null,
    password_reset_token        uuid null,
    password_reset_token_expiry timestamptz null
);

-- Important: unique index enforces email uniqueness at DB level
-- Note: this is separate from the primary key
create unique index ux_user_email on users(email);