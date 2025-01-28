document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let username = document.getElementById("username").value.trim().toLowerCase();
    let password = document.getElementById("password").value.trim();

    // Datos del usuario
    const user = {
        username: "usuario1",
        password: "password1" // Aquí puedes establecer la contraseña para "usuario1"
    };

    console.log("Intentando iniciar sesión con:", username, password);

    if (username === user.username && password === user.password) {
        console.log("Inicio de sesión exitoso");
        document.getElementById("user-name").textContent = user.username;
        document.querySelector(".login-container").classList.add("hidden");
        document.getElementById("gastos-section").classList.remove("hidden");

        // Cargar totales mensuales desde localStorage
        const storedTotalesMensuales = JSON.parse(localStorage.getItem('totalesMensuales')) || [];
        if (storedTotalesMensuales.length > 0) {
            totalesMensuales = storedTotalesMensuales;
        }
    } else {
        console.log("Usuario o contraseña incorrectos");
        alert("Usuario o contraseña incorrectos");
    }
});

// Función para formatear números con puntos como separadores de miles
function formatNumber(num) {
    return num.toLocaleString('es-CO', { minimumFractionDigits: 3 });
}

// Función para descargar archivo de texto
function downloadFile(filename, content) {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Requerido para Firefox
    element.click();
}

// Almacenar los totales mensuales
let totalesMensuales = [];

// Guardar Gastos
document.getElementById("gastos-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let mes = document.getElementById("mes").value;
    let arriendo = parseFloat(document.getElementById("arriendo").value);
    let servicios = parseFloat(document.getElementById("servicios").value);
    let comida = parseFloat(document.getElementById("comida").value);

    console.log("Guardando gastos para el usuario actual");

    let totalSemanal = comida;
    let totalMensual = arriendo + servicios + (comida * 4); // Comida semanal * 4 para mensual

    totalesMensuales.push(totalMensual);

    let contenidoArchivo = `
        Gastos del mes de ${mes}\n
        Arriendo: $${formatNumber(arriendo)}\n
        Servicios: $${formatNumber(servicios)}\n
        Comida (Semanal): $${formatNumber(totalSemanal)}\n
        Total mensual: $${formatNumber(totalMensual)}
    `;

    downloadFile(`gastos_${mes}.txt`, contenidoArchivo);

    document.getElementById("result").innerHTML = `
        <h3>Gastos del mes de ${mes}</h3>
        <p>Arriendo: $${formatNumber(arriendo)}</p>
        <p>Servicios: $${formatNumber(servicios)}</p>
        <p>Comida (Semanal): $${formatNumber(totalSemanal)}</p>
        <p>Total mensual: $${formatNumber(totalMensual)}</p>
    `;

    // Guardar los totales mensuales en localStorage
    localStorage.setItem('totalesMensuales', JSON.stringify(totalesMensuales));
});

// Mostrar totales anuales
document.getElementById("logout-btn").addEventListener("click", function() {
    console.log("Cerrando sesión para el usuario actual");

    let totalAnual = totalesMensuales.reduce((acc, curr) => acc + curr, 0);
    document.getElementById("total-anual").innerHTML = `
        <h3>Total anual: $${formatNumber(totalAnual)}</h3>
    `;

    document.querySelector(".login-container").classList.remove("hidden");
    document.getElementById("gastos-section").classList.add("hidden");
    document.getElementById("totales-anuales").classList.remove("hidden");

    // Guardar los totales mensuales en localStorage
    localStorage.setItem('totalesMensuales', JSON.stringify(totalesMensuales));
});
