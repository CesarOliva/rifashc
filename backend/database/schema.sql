--Create Rifas Table
CREATE TABLE IF NOT EXISTS rifas (
    IdRifa          INTEGER         PRIMARY KEY     AUTOINCREMENT,
    Nombre          TEXT            NOT NULL,
    Imagen          TEXT            NOT NULL,
    Descripcion     TEXT            NOT NULL        DEFAULT '',
    Fecha           DATETIME        NOT NULL,
    PrecioBoleto    REAL            NOT NULL,
    CantidadBoletos INT             NOT NULL,
    Activa          BOOLEAN         NOT NULL        DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS clientes (
    IdCliente       INTEGER         PRIMARY KEY     AUTOINCREMENT,
    Nombre          TEXT            NOT NULL,
    Telefono        TEXT            NOT NULL
);

CREATE TABLE IF NOT EXISTS boletos (
    IdBoleto        INTEGER         PRIMARY KEY     AUTOINCREMENT,
    IdRifa          INTEGER         NOT NULL,
    IdCliente       INTEGER         NOT NULL,
    Numero          INTEGER         NOT NULL,
    Pagado          BOOLEAN         NOT NULL        DEFAULT FALSE,
    FOREIGN KEY (IdRifa) REFERENCES rifas(IdRifa),
    FOREIGN KEY (IdCliente) REFERENCES clientes(IdCliente)
);

ALTER TABLE boletos ADD UNIQUE (IdRifa, Numero);
CREATE UNIQUE INDEX idx_rifa_numero
ON boletos (IdRifa, Numero);

CREATE TABLE IF NOT EXISTS premios_imagenes (
    IdPremioImagen  INTEGER         PRIMARY KEY     AUTOINCREMENT,
    Imagen          TEXT            NOT NULL,
    FechaCreacion   DATETIME        NOT NULL        DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ganadores_rifa (
    IdGanador       INTEGER         PRIMARY KEY     AUTOINCREMENT,
    IdRifa          INTEGER         NOT NULL,
    IdBoleto        INTEGER         NOT NULL,
    Numero          INTEGER         NOT NULL,
    Nombre          TEXT            NOT NULL,
    Telefono        TEXT            NOT NULL,
    FechaSorteo     DATETIME        NOT NULL        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdRifa) REFERENCES rifas(IdRifa),
    FOREIGN KEY (IdBoleto) REFERENCES boletos(IdBoleto)
);

CREATE UNIQUE INDEX idx_ganador_rifa_unico
ON ganadores_rifa (IdRifa);

--.\sqlite3 rifas.sqlite
--.read schema.sql