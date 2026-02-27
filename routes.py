from main import app
from flask import render_template,jsonify
import pandas as pd

def carregar_dados():
    df = pd.read_csv("./BibliotecaPessoal_v1.csv", sep=';', encoding='latin1')
    df.columns = df.columns.str.strip()
    return df

@app.route("/")
def home():
    df = carregar_dados()
    
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

@app.route("/estatisticas")
def estatisticas():
    df = carregar_dados()
    df_lidos = df[df["Status"] == "concluido"].copy()

    df_lidos["paginas"] = pd.to_numeric(df_lidos["paginas"], errors="coerce")

    # Estatísticas já existentes
    genero_mais_lido = (
        df_lidos["genero"].mode()[0]
        if not df_lidos["genero"].mode().empty
        else "N/A"
    )

    autor_mais_lido = (
        df_lidos["autor"].mode()[0]
        if not df_lidos["autor"].mode().empty
        else "N/A"
    )

    if not df_lidos.empty and df_lidos["paginas"].notna().any():
        linha_maior = df_lidos.loc[df_lidos["paginas"].idxmax()]
        maior_livro = linha_maior["titulo"]
        paginas_maior_livro = linha_maior["paginas"]
    else:
        maior_livro = None
        paginas_maior_livro = None

    generos_count = df_lidos["genero"].value_counts()

    generos_labels = generos_count.index.tolist()
    generos_values = generos_count.values.tolist()

    return render_template(
        "estatisticas.html",
        genero_mais_lido=genero_mais_lido,
        autor_mais_lido=autor_mais_lido,
        maior_livro=maior_livro,
        paginas_maior_livro=paginas_maior_livro,
        generos_labels=generos_labels,
        generos_values=generos_values
    )

@app.route("/api/generos")
def api_generos():
    df = carregar_dados()

    df_lidos = df[df["Status"] == "concluido"]

    generos_count = df_lidos["genero"].value_counts()

    return jsonify({
        "labels": generos_count.index.tolist(),
        "values": generos_count.values.tolist()
    })

@app.route("/api/autores")
def api_autores():
    df = carregar_dados()

    df_lidos = df[df["Status"] == "concluido"]

    autores_count = df_lidos["autor"].value_counts()

    return jsonify({
        "labels": autores_count.index.tolist(),
        "values": autores_count.values.tolist()
    })
