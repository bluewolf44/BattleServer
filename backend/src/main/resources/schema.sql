DROP TABLE IF EXISTS player;

CREATE TABLE player (
    player_id SERIAL PRIMARY KEY,
    username text,
    password text,
    current_win_streak integer,
    highest_win_streak integer
);