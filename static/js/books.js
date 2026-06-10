/*document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("tabelaAtual") || "lidos";
    mostrarTabela(saved);
    
    const form = document.getElementById("formEditar");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = form.querySelector("button[type='submit']");

        btn.innerText = "Salvando...";
        btn.disabled = true;

        const id = document.getElementById("edit-id").value;

        const data = {
            titulo: document.getElementById("edit-titulo").value,
            autor: document.getElementById("edit-autor").value,
            ano_publicacao: document.getElementById("edit-ano").value,
            paginas: document.getElementById("edit-paginas").value,
            avaliacao: document.getElementById("edit-avaliacao").value
        };

        try {
            const response = await fetch(`/editar/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                fecharModal();
                location.reload();
            } else {
                alert("Erro ao salvar livro");
            }

        } catch (err) {
            console.error(err);
            alert("Erro de conexão");
        } finally {
            btn.innerText = "Salvar";
            btn.disabled = false;
        }
    });
});*/

// =========================
// STATE / INIT
// =========================

document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("tabelaAtual") || "lidos";
    mostrarTabela(saved);

    setupForm();
});


// =========================
// FORM HANDLER
// =========================

function setupForm() {
    const form = document.getElementById("formEditar");
    if (!form) return;

    form.addEventListener("submit", handleSubmit);
}


// =========================
// SUBMIT (CREATE + UPDATE)
// =========================

async function handleSubmit(e) {
    e.preventDefault();

    const btn = e.target.querySelector("button[type='submit']");

    setLoading(btn, true);

    const id = document.getElementById("edit-id").value;
    const mode = id ? "edit" : "create";

    const data = getFormData();

    try {
        const response = await saveBook(id, data, mode);

        if (!response.ok) {
            throw new Error("Erro ao salvar livro");
        }

        fecharModal();

        // mantém simples por enquanto (UX futura pode remover reload)
        location.reload();

    } catch (err) {
        console.error(err);
        alert("Erro ao salvar livro");

    } finally {
        setLoading(btn, false);
    }
}


// =========================
// API CALL
// =========================

async function saveBook(id, data, mode) {
    const url = mode === "edit"
        ? `/editar/${id}`
        : "/adicionar";

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}


// =========================
// HELPERS
// =========================

function getFormData() {
    return {
        titulo: document.getElementById("edit-titulo").value,
        autor: document.getElementById("edit-autor").value,
        ano_publicacao: document.getElementById("edit-ano").value,
        paginas: document.getElementById("edit-paginas").value,
        avaliacao: document.getElementById("edit-avaliacao").value
    };
}

function setLoading(btn, state) {
    if (!btn) return;

    btn.innerText = state ? "Salvando..." : "Salvar";
    btn.disabled = state;
}


// =========================
// OPTIONAL GLOBAL EXPORTS
// =========================

// (caso você use onclick no HTML)
window.salvarLivro = saveBook;