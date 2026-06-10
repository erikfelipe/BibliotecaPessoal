from main import app
from flask import render_template, jsonify, request
import pandas as pd

from services.book_services import get_books, update_book, delete_book, insert_book
from services.book_stats import build_stats


def carregar_dados():
    return pd.DataFrame(get_books())


@app.route("/")
def home():
    df = carregar_dados()

    df_lidos = df[df["status"] == "lido"]
    df_quero_ler = df[df["status"] == "quero_ler"]

    return render_template(
        "index.html",
        total_quero_ler=len(df_quero_ler),
        quero_ler=df_quero_ler.to_dict("records"),
        total_lidos=len(df_lidos),
        paginas=df_lidos["paginas"].sum(),
        livros_lidos=df_lidos.to_dict("records")
    )


@app.route("/estatisticas")
def estatisticas():
    df = carregar_dados()
    stats = build_stats(df)

    return render_template(
        "estatisticas.html",
        genero_mais_lido=stats["genero_mais_lido"],
        autor_mais_lido=stats["autor_mais_lido"],
        maior_livro=stats["maior_livro"],
        paginas_maior_livro=stats["paginas_maior_livro"],
        generos_labels=stats["generos_labels"],
        generos_values=stats["generos_values"]
    )


@app.route("/api/generos")
def api_generos():
    df = carregar_dados()
    df_lidos = df[df["status"] == "lido"]

    generos = df_lidos["genero"].value_counts()

    return jsonify({
        "labels": generos.index.tolist(),
        "values": generos.values.tolist()
    })


@app.route("/api/autores")
def api_autores():
    df = carregar_dados()
    df_lidos = df[df["status"] == "lido"]

    autores = df_lidos["autor"].value_counts()

    return jsonify({
        "labels": autores.index.tolist(),
        "values": autores.values.tolist()
    })


@app.route("/editar/<id>", methods=["POST"])
def editar(id):
    data = request.get_json()

    payload = {
        "titulo": data.get("titulo"),
        "autor": data.get("autor"),
        "ano_publicacao": safe_int(data.get("ano_publicacao")),
        "paginas": safe_int(data.get("paginas")),
        "avaliacao": float(data["avaliacao"]) if data.get("avaliacao") else None
    }

    update_book(id, payload)

    return jsonify({"success": True})

def safe_int(value):
    try:
        return int(value)
    except:
        return None
    
@app.route("/deletar/<id>", methods=["DELETE"])
def deletar(id):
    delete_book(id)
    return jsonify({"success": True})

@app.route("/adicionar", methods=["POST"])
def adicionar():
    data = request.get_json()
    insert_book(data)
    return jsonify({"success": True})