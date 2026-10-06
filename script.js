// ===============================
// CUENTA REGRESIVA
// ===============================
const targetDate = new Date("2027-05-15T16:00:00").getTime(); // cambia la fecha si lo necesitas

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance > 0) {
        daysEl.textContent = String(days).padStart(2, "0");
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");
    } else {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();


// ===============================
// CONFETI
// ===============================
function crearConfeti() {
    const colores = ["#f59e0b", "#22c55e", "#3b82f6", "#ec4899", "#f97316"];

    for (let i = 0; i < 40; i++) {
        const confeti = document.createElement("div");
        confeti.classList.add("confeti");

        confeti.style.left = Math.random() * window.innerWidth + "px";
        confeti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        confeti.style.animationDuration = (Math.random() * 2 + 2) + "s";
        confeti.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(confeti);

        setTimeout(() => {
            confeti.remove();
        }, 4000);
    }
}


// ===============================
// FORMULARIO
// ===============================
const formulario = document.getElementById("formulario");

if (formulario) {
    formulario.addEventListener("submit", async function (e) {
        e.preventDefault();

        const boton = formulario.querySelector("button[type='submit']");
        const mensajeEnvio = document.getElementById("mensaje-envio");

        const nombre = document.getElementById("nombre").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const personas = document.getElementById("personas").value.trim();
        const asistencia = document.getElementById("asistencia").value;
        const mensaje = document.getElementById("mensaje").value.trim();

        if (!nombre || !telefono || !personas || !asistencia) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const datos = {
            nombre,
            telefono,
            personas,
            asistencia,
            mensaje
        };

        try {
            if (boton) boton.disabled = true;

            const respuesta = await fetch("https://script.google.com/macros/s/AKfycby6Hs79sEzyEue8hNE5bwuTcOvgt-1PPDxC1LutzfEix7IHreOA1nN11uO8Cn7I3aI/exec", {
                method: "POST",
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (resultado.status === "ok") {
                if (mensajeEnvio) {
                    mensajeEnvio.textContent = "Tu confirmación fue enviada correctamente.";
                    mensajeEnvio.classList.add("mostrar");
                }

                crearConfeti();
                formulario.reset();

                setTimeout(() => {
                    if (mensajeEnvio) {
                        mensajeEnvio.classList.remove("mostrar");
                        mensajeEnvio.textContent = "";
                    }
                }, 5000);
            } else {
                alert("Hubo un problema al enviar los datos.");
            }
        } catch (error) {
            console.error(error);
            alert("No se pudo conectar con Google Sheets.");
        } finally {
            if (boton) boton.disabled = false;
        }
    });
}