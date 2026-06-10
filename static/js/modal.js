function abrirModal(id, titulo, autor, ano, paginas, avaliacao) {
    const modal = document.getElementById("modal");

    modal.classList.add("show");

    document.getElementById("edit-id").value = id;
    document.getElementById("edit-titulo").value = titulo;
    document.getElementById("edit-autor").value = autor;
    document.getElementById("edit-ano").value = ano;
    document.getElementById("edit-paginas").value = paginas;
    document.getElementById("edit-avaliacao").value = avaliacao;
}

function fecharModal() {
    document.getElementById("modal").classList.remove("show");
}

function abrirModalFromButton(btn) {
    document.getElementById("form-mode").value = "edit";
    
    const id = btn.dataset.id;
    const titulo = btn.dataset.titulo;
    const autor = btn.dataset.autor;
    const ano = btn.dataset.ano;
    const paginas = btn.dataset.paginas;
    const avaliacao = btn.dataset.avaliacao;
    const status = btn.dataset.status;

    abrirModal(id, titulo, autor, ano, paginas, avaliacao);

    const notaField = document.getElementById("nota-field");

    if (status === "lido") {
        notaField.style.display = "block";
    } else {
        notaField.style.display = "none";
    }
}

function abrirModalAdicionar() {
    const modal = document.getElementById("modal");

    document.getElementById("form-mode").value = "create";
    document.getElementById("edit-id").value = "";

    document.getElementById("edit-titulo").value = "";
    document.getElementById("edit-autor").value = "";
    document.getElementById("edit-ano").value = "";
    document.getElementById("edit-paginas").value = "";
    document.getElementById("edit-avaliacao").value = "";

    modal.classList.add("show");
}

document.addEventListener("click", (e) => {
    const modal = document.getElementById("modal");
    if (e.target === modal) fecharModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharModal();
});