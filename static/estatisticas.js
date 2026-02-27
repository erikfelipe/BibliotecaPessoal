document.addEventListener("DOMContentLoaded", function () {

    function criarGrafico(canvasId, apiUrl, labelGrafico, limite = 10) {

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {

                const canvas = document.getElementById(canvasId);
                if (!canvas) return;

                const ctx = canvas.getContext("2d");

                const labels = data.labels.slice(0, limite);
                const values = data.values.slice(0, limite);

                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
                gradient.addColorStop(1, "rgba(59, 130, 246, 0.2)");

                new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: labels,
                        datasets: [{
                            label: labelGrafico,
                            data: values,
                            backgroundColor: gradient,
                            borderRadius: 8,
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        animation: {
                            duration: 1200,
                            easing: "easeOutQuart"
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                backgroundColor: "#111827",
                                titleColor: "#fff",
                                bodyColor: "#fff",
                                padding: 10,
                                cornerRadius: 6
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: "#f9fafb",
                                    font: { size: 12 }
                                },
                                grid: { display: false }
                            },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: "#f9fafb"
                                },
                                grid: {
                                    color: "rgba(255,255,255,0.05)"
                                }
                            }
                        }
                    }
                });

            })
            .catch(error => {
                console.error("Erro ao carregar dados:", error);
            });
    }
    criarGrafico("graficoGeneros", "/api/generos", "Livros por Gênero", 10);
    criarGrafico("graficoAutores", "/api/autores", "Livros por Autor", 10);

});
