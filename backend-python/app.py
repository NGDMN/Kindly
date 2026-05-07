#importações necessárias
from flask import Flask, request, jsonify
from pontuacao_service import calcular_pontuacao
app = Flask(__name__)

#definindo nossas rotas
@app.route("/")
def home():
    return "Kindly funcionando!"

@app.route("/calcular-pontuacao", methods=["POST"])
def calcular():

    data = request.get_json()

    if not data:
        return jsonify({
            "erro": "JSON não enviado."
        }), 400

    try:
        resultado = calcular_pontuacao(data)

        return jsonify(resultado)

    except KeyError:
        return jsonify({
            "Campo obrigatório ausente."
        }), 400

#aqui vamos rodar de fato a aplicação,time kindly, seria legal se vcs concordarem, configurarmos host e a porta futuramente também!
if __name__ == "__main__":
    app.run(debug=True)
