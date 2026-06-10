let sortState = {};
let tabelaAtual = "lidos";

function sortTable(tableId, columnIndex, headerElement) {
    const table = document.getElementById(tableId);
    const rows = Array.from(table.querySelectorAll("tbody tr"));

    if (!rows.length) return;

    const isNumeric = !isNaN(rows[0].cells[columnIndex].innerText);

    const key = tableId + "-" + columnIndex;
    sortState[key] = !sortState[key];

    rows.sort((a, b) => {
        let A = a.cells[columnIndex].innerText.trim();
        let B = b.cells[columnIndex].innerText.trim();

        if (isNumeric) {
            A = parseFloat(A) || 0;
            B = parseFloat(B) || 0;
        }

        return sortState[key]
            ? A > B ? 1 : -1
            : A < B ? 1 : -1;
    });

    rows.forEach(row => table.querySelector("tbody").appendChild(row));

    table.querySelectorAll(".arrow").forEach(a => a.innerText = "↕");

    const arrow = headerElement.querySelector(".arrow");
    if (arrow) arrow.innerText = sortState[key] ? "↑" : "↓";
}

function mostrarTabela(tipo) {
    tabelaAtual = tipo;
    const lidos = document.getElementById("tabela-lidos");
    const quero = document.getElementById("tabela-quero");
    const titulo = document.getElementById("section-title");

    const cardLidos = document.querySelectorAll(".card")[1];
    const cardQuero = document.querySelectorAll(".card")[0];

    // reset estilos
    cardLidos.classList.remove("active");
    cardQuero.classList.remove("active");

    if (tipo === "lidos") {
        lidos.style.display = "block";
        quero.style.display = "none";
        titulo.innerText = "📚 Livros Lidos";
        cardLidos.classList.add("active");
    } 
    if (tipo === "quero") {
        lidos.style.display = "none";
        quero.style.display = "block";
        titulo.innerText = "📖 Quero Ler";
        cardQuero.classList.add("active");
    }
    localStorage.setItem("tabelaAtual", tipo);
}

async function deletarLivro(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este livro?");

    if (!confirmar) return;

    try {
        const response = await fetch(`/deletar/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            // remove linha da tabela sem reload
            const row = document.querySelector(`button[onclick*="${id}"]`).closest("tr");
            if (row) row.remove();
        } else {
            alert("Erro ao deletar livro");
        }

    } catch (err) {
        console.error(err);
        alert("Erro de conexão");
    }
}