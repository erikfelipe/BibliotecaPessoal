from main import app
from flask import render_template, jsonify
import pandas as pd
import os
import requests

@app.route("/")
def home():
    df = pd.read_csv("./BibliotecaPessoal_v1.csv", sep=';', encoding='latin1')
    df.columns = df.columns.str.strip()
    
    df_lidos = df[df["Status"] == "concluido"]
    df_quero_ler = df[df["Status"] == "quero_ler"]

    total_quero_ler = len(df_quero_ler)
    total_lidos = len(df_lidos)
    paginas = df_lidos["paginas"].sum()

    livros_lidos = df_lidos.to_dict(orient="records")
    quero_ler = df_quero_ler.to_dict(orient="records")

    return render_template(
        "index.html",
        total_quero_ler=total_quero_ler,
        quero_ler=quero_ler,
        total_lidos=total_lidos,
        paginas=paginas,
        livros_lidos=livros_lidos
    )
API_KEY = ""

@app.route("/capa/<isbn>")
def buscar_capa(isbn):
    isbn_limpo = isbn.replace("-", "")

    caminho_imagem = f"static/covers/{isbn_limpo}.jpg"

    # 🔥 Se já existe, retorna caminho direto
    if os.path.exists(caminho_imagem):
        return jsonify({
            "url": f"/static/covers/{isbn_limpo}.jpg"
        })

    url_google = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn_limpo}&key={API_KEY}"

    response = requests.get(url_google)
    data = response.json()

    if data.get("totalItems", 0) > 0:
        book = data["items"][0]["volumeInfo"]
        image_url = book.get("imageLinks", {}).get("thumbnail")

        if image_url:
            image_response = requests.get(image_url)

            with open(caminho_imagem, "wb") as f:
                f.write(image_response.content)

            return jsonify({
                "url": f"/static/covers/{isbn_limpo}.jpg"
            })

    return jsonify({
        "url": "/static/sem-capa.png"
    })
