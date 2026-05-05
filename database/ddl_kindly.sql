BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TB_Streak';
    EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TB_Inscricao';
    EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TB_Oportunidade';
    EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TB_Usuario_ONG';

    EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TB_ONG';
    EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TB_Usuario';
    EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TB_Categoria';
    EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TB_Status_Inscricao';
    EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TB_Status';
    EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TB_Role';
    EXCEPTION WHEN OTHERS THEN NULL;
END;








CREATE TABLE TB_Role(
    id NUMBER(1) PRIMARY KEY,
    nome VARCHAR2(30) NOT NULL
);

CREATE TABLE TB_Status(
    id NUMBER(1) PRIMARY KEY,
    nome VARCHAR2(30) NOT NULL
);

CREATE TABLE TB_Status_Inscricao(
    id NUMBER(1) PRIMARY KEY,
    nome VARCHAR2(30) NOT NULL
);

CREATE TABLE TB_Categoria(
    id NUMBER(2) PRIMARY KEY,
    nome VARCHAR2(100) NOT NULL
);

CREATE TABLE TB_Usuario(
    id NUMBER(19,0) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR2(100) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    usuario VARCHAR2(50) UNIQUE NOT NULL,
    senha VARCHAR2(255) NOT NULL,
    motor CHAR(1),
    pontuacao_acumulada NUMBER(10,2) DEFAULT 0,
    id_status NUMBER DEFAULT 1 NOT NULL, 
    CONSTRAINT fk_Usuario_Status FOREIGN KEY (id_status) REFERENCES TB_Status(id),
    CONSTRAINT chk_Motor CHECK (motor in ('C','K','A')) -- 'C' competição | 'K' Kibo | 'A' ambos
);

CREATE TABLE TB_ONG(
    id NUMBER(19,0) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cnpj CHAR(14) UNIQUE NOT NULL,
    razao_social VARCHAR2(100) UNIQUE NOT NULL,
    nome_fantasia VARCHAR2(100) NOT NULL,
    id_status NUMBER DEFAULT 1 NOT NULL,
    CONSTRAINT fk_ONG_Status FOREIGN KEY (id_status) REFERENCES TB_Status(id)
);

CREATE TABLE TB_Usuario_ONG(
    id NUMBER(19,0) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario NUMBER NOT NULL,
    id_ong NUMBER NOT NULL,
    id_role NUMBER NOT NULL,
    id_status NUMBER DEFAULT 1 NOT NULL,
    CONSTRAINT fk_Usuario_ONG_Usuario FOREIGN KEY (id_usuario) REFERENCES TB_Usuario(id),
    CONSTRAINT fk_Usuario_ONG_ONG FOREIGN KEY (id_ong) REFERENCES TB_ONG(id),
    CONSTRAINT fk_Usuario_ONG_Role FOREIGN KEY (id_role) REFERENCES TB_Role(id),
    CONSTRAINT fk_Usuario_ONG_Status FOREIGN KEY (id_status) REFERENCES TB_Status(id)    
);

CREATE TABLE TB_Oportunidade(
    id NUMBER(19,0) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR2(100) NOT NULL,
    descricao VARCHAR2(200) NOT NULL,
    data_evento DATE NOT NULL,
    local_lat NUMBER(10,7) NOT NULL,
    local_long NUMBER(10,7) NOT NULL,
    vagas_total NUMBER NOT NULL,
    vagas_presente NUMBER DEFAULT 0 NOT NULL,
    vagas_noshow NUMBER DEFAULT 0 NOT NULL,
    id_ong NUMBER NOT NULL,
    id_categoria NUMBER NOT NULL,
    id_status NUMBER DEFAULT 1 NOT NULL,
    CONSTRAINT fk_Oportunidade_ONG FOREIGN KEY (id_ong) REFERENCES TB_ONG(id),
    CONSTRAINT fk_Oportunidade_Categoria FOREIGN KEY (id_categoria) REFERENCES TB_Categoria(id),
    CONSTRAINT fk_Oportunidade_Status FOREIGN KEY (id_status) REFERENCES TB_Status(id)
);

CREATE TABLE TB_Inscricao(
    id NUMBER(19,0) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pontuacao_snap NUMBER(10,2) NOT NULL,
    modificador_snap NUMBER(10,4) DEFAULT 1 NOT NULL,
    id_usuario NUMBER NOT NULL,
    id_oportunidade NUMBER NOT NULL,
    id_status_inscricao NUMBER DEFAULT 1 NOT NULL,
    CONSTRAINT fk_Inscricao_Usuario FOREIGN KEY (id_usuario) REFERENCES TB_Usuario(id),
    CONSTRAINT fk_Inscricao_Oportunidade FOREIGN KEY (id_oportunidade) REFERENCES TB_Oportunidade(id),
    CONSTRAINT fk_Inscricao_Status_Inscricao FOREIGN KEY (id_status_inscricao) REFERENCES TB_Status_Inscricao(id)
);

CREATE TABLE TB_Streak(
    id NUMBER(19,0) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    semana_referencia DATE NOT NULL,
    streak_mantida char(1) NOT NULL,
    total_streak NUMBER DEFAULT 0 NOT NULL,
    id_usuario NUMBER NOT NULL,
    CONSTRAINT fk_Streak_Usuario FOREIGN KEY (id_usuario) REFERENCES TB_Usuario(id),
    CONSTRAINT chk_streak CHECK (streak_mantida in ('T', 'F')) -- 'T' True | 'F' False  
);


CREATE INDEX idx_Oportunidade_ONG ON TB_Oportunidade(id_ong);
CREATE INDEX idx_Inscricao_Usuario ON TB_Inscricao(id_usuario);
CREATE INDEX idx_Inscricao_Oportunidade ON TB_Inscricao(id_oportunidade);
CREATE INDEX idx_Streak_Usuario ON TB_Streak(id_usuario);
CREATE INDEX idx_Usuario_ONG_Usuario ON TB_Usuario_ONG(id_usuario);