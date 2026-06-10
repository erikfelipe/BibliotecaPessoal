import pandas as pd

def build_stats(df):
    df_lidos = df[df["status"] == "lido"].copy()

    df_lidos["paginas"] = pd.to_numeric(df_lidos["paginas"], errors="coerce")

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

    maior_livro = None
    paginas_maior_livro = None

    if not df_lidos.empty and df_lidos["paginas"].notna().any():
        linha = df_lidos.loc[df_lidos["paginas"].idxmax()]
        maior_livro = linha["titulo"]
        paginas_maior_livro = linha["paginas"]

    generos = df_lidos["genero"].value_counts()

    return {
        "genero_mais_lido": genero_mais_lido,
        "autor_mais_lido": autor_mais_lido,
        "maior_livro": maior_livro,
        "paginas_maior_livro": paginas_maior_livro,
        "generos_labels": generos.index.tolist(),
        "generos_values": generos.values.tolist(),
        "df_lidos": df_lidos
    }