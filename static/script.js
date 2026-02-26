let sortState = {};

function sortTable(tableId, columnIndex, headerElement) {
    const table = document.getElementById(tableId);
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const isNumeric = !isNaN(rows[0].cells[columnIndex].innerText);

    const key = tableId + "-" + columnIndex;

    sortState[key] = !sortState[key];

    rows.sort((a, b) => {
        let A = a.cells[columnIndex].innerText.trim();
        let B = b.cells[columnIndex].innerText.trim();

        if (isNumeric) {
            A = parseFloat(A);
            B = parseFloat(B);
        }

        if (A < B) return sortState[key] ? -1 : 1;
        if (A > B) return sortState[key] ? 1 : -1;
        return 0;
    });

    const tbody = table.querySelector("tbody");
    rows.forEach(row => tbody.appendChild(row));

    // Resetar apenas setas da tabela atual
    table.querySelectorAll(".arrow").forEach(arrow => {
        arrow.innerText = "↕";
    });

    const arrow = headerElement.querySelector(".arrow");
    arrow.innerText = sortState[key] ? "↑" : "↓";
}

function mostrarTabela(tipo) {
    const tabelaLidos = document.getElementById("tabela-lidos");
    const tabelaQuero = document.getElementById("tabela-quero");
    const titulo = document.getElementById("section-title");

    if (tipo === "lidos") {
        tabelaLidos.style.display = "block";
        tabelaQuero.style.display = "none";
        titulo.innerText = "📚 Livros Lidos";
    } else {
        tabelaLidos.style.display = "none";
        tabelaQuero.style.display = "block";
        titulo.innerText = "📖 Quero Ler";
    }
}

async function abrirModal(row) {
    const isbn = row.dataset.isbn;
    const capa = document.getElementById("modalCapa");

    if (!isbn) {
        capa.src = "/static/sem-capa.png";
        return;
    }

    try {
        const response = await fetch(`/capa/${isbn}`);
        const data = await response.json();

        capa.src = data.url;

    } catch (error) {
        capa.src = "/static/sem-capa.png";
    }

    document.getElementById("modalLivro").style.display = "block";
}

function fecharModal() {
    document.getElementById("modalLivro").style.display = "none";
}
