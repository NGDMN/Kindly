
INSERT INTO TB_Role (id, nome) VALUES (1, 'Responsavel');
INSERT INTO TB_Role (id, nome) VALUES (2, 'Administrador');

INSERT INTO TB_Status (id, nome) VALUES (1, 'Ativo');
INSERT INTO TB_Status (id, nome) VALUES (2, 'Inativo');
INSERT INTO TB_Status (id, nome) VALUES (3, 'Deletado');

INSERT INTO TB_Status_Inscricao (id, nome) VALUES (1, 'Inscrito');
INSERT INTO TB_Status_Inscricao (id, nome) VALUES (2, 'Realizado');
INSERT INTO TB_Status_Inscricao (id, nome) VALUES (3, 'Expirado');
INSERT INTO TB_Status_Inscricao (id, nome) VALUES (4, 'Cancelado');

INSERT INTO TB_Categoria (id, nome) VALUES (1, 'Distribuição de Alimentos');
INSERT INTO TB_Categoria (id, nome) VALUES (2, 'Educação e Ensino');
INSERT INTO TB_Categoria (id, nome) VALUES (3, 'Saúde e Bem-estar');
INSERT INTO TB_Categoria (id, nome) VALUES (4, 'Meio Ambiente');
INSERT INTO TB_Categoria (id, nome) VALUES (5, 'Assistência Social');
INSERT INTO TB_Categoria (id, nome) VALUES (6, 'Cultura e Arte');
INSERT INTO TB_Categoria (id, nome) VALUES (7, 'Esporte e Lazer');
INSERT INTO TB_Categoria (id, nome) VALUES (8, 'Apoio a Animais');
INSERT INTO TB_Categoria (id, nome) VALUES (9, 'Tecnologia e Inclusão Digital');
INSERT INTO TB_Categoria (id, nome) VALUES (10, 'Habitação e Moradia');

COMMIT;