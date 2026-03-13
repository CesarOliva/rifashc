--Create Rifas Table
CREATE TABLE IF NOT EXISTS rifas (
    IdRifa          INTEGER         PRIMARY KEY   AUTOINCREMENT,
    Nombre          TEXT            NOT NULL,
    Imagen          TEXT            NOT NULL,
    Fecha           DATETIME        NOT NULL,
    PrecioBoleto    REAL            NOT NULL,
    CantidadBoletos INT             NOT NULL,
    Activa          BOOLEAN         NOT NULL DEFAULT TRUE
)

--.\sqlite3 rifas.sqlite
--.read schema.sql