#realizando as importacoes necessarias para esse arquivo chave para a pontuacao do projeto
from regras_pontuacao import (calcular_modificador_oferta_demanda,calcular_modificador_estagnacao)

#pontuação inicial padrão
pontuacao_base = 100

#revisao + teste com javinha aqui!!
def calcular_pontuacao(payload):

    campos = [
        "idOportunidade",
        "vagasTotal",
        "vagasPresente",
        "vagasNoShow",
        "quantidadeInscritosRecentesCategoria",
        "quantidadeOportunidadesRecentesCategoria"
    ]

    for campo in campos:
        if campo not in payload:
            raise Exception(
                f"Campo {campo} ausente.")

    id_oportunidade = payload["idOportunidade"]
    vagas_total = payload["vagasTotal"]
    vagas_presente = payload["vagasPresente"]
    inscritos_categoria = payload["quantidadeInscritosRecentesCategoria"]
    oportunidades_categoria = payload["quantidadeOportunidadesRecentesCategoria"]

#time, aqui utilizamos as funções criadas no arquivo de regras  para implementar de fato o cálculo das regras de pontuação aplicadas

    modificador_oferta_demanda = (calcular_modificador_oferta_demanda(vagas_total,vagas_presente))
    modificador_estagnacao = (calcular_modificador_estagnacao(inscritos_categoria,oportunidades_categoria))
    modificador_total = (modificador_oferta_demanda *modificador_estagnacao)
    pontuacao = pontuacao_base * modificador_total

    return {
        "idOportunidade": int(id_oportunidade),
        "pontuacao": pontuacao,
        "modificador": modificador_total
    }