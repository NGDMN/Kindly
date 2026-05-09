import pandas as pd
#funcao para calcular qual vai ser o retorno de acordo com a taxa de ocupação, lembrando que, como 
# combinamos, quanto menor for a adesão, maior será a pontuação!
def calcular_modificador_oferta_demanda(inscritos_categoria, oportunidades_categoria):
    #só pra evitar erro de divisão por 0
    if oportunidades_categoria <= 0:
        return 1.0

    media_categoria = inscritos_categoria / oportunidades_categoria
#adesao baixa entao vale mais pontos!
    if media_categoria <= 0.10:
        return 1.8

    elif media_categoria <= 0.20:
        return 1.6

    elif media_categoria <= 0.30:
        return 1.5

    elif media_categoria <= 0.40:
        return 1.4

    elif media_categoria <= 0.50:
        return 1.3

    elif media_categoria <= 0.60:
        return 1.2

    elif media_categoria <= 0.70:
        return 1.1

    else:
        return 1

#já essa função, serve para que possamos medir o quanto uma categoria esta parada ou com pouco engajamento
#se poucas pessoas participam dessa categoria, vc ganha mais pontos
def calcular_modificador_estagnacao(inscritos_categoria,oportunidades_categoria):
    if oportunidades_categoria <= 0:
        return 1.4

    media_categoria = (inscritos_categoria /oportunidades_categoria)

    # categoria muito parada
    if media_categoria <= 1:
        return 1.8

    elif media_categoria <= 2:
        return 1.6

    elif media_categoria <= 4:
        return 1.4

    elif media_categoria <= 6:
        return 1.3

    elif media_categoria <= 8:
        return 1.1

    else:
        return 1
