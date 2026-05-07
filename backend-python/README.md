# Backend Python — Kindly

Flask + Pandas. Módulo stateless de cálculo de pontuação.

## Responsável

Daniele Vargas de Lima

## Stack

- Python 
- Flask
- Pandas

## Responsabilidades

- Endpoint REST que recebe payload do Java e devolve pontuação calculada
- Cálculo do fator oferta/demanda (janela de 30 dias)
- Cálculo do fator estagnação (ranking interno de categorias)
- Stateless: não acessa banco, não persiste

## Como rodar

pip install -r requirements.txt
python app.py