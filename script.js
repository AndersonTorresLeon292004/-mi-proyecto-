
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let username = document.getElementById("username").value.trim().toLowerCase();
    let password = document.getElementById("password").value.trim();

    const user = {
        username: "usuario1",
        password: "password1"
    };

    if (username === user.username && password === user.password) {
        document.getElementById("user-name").textContent = user.username;
        document.querySelector(".login-container").classList.add("hidden");
        document.getElementById("gastos-section").classList.remove("hidden");

        // Cargar los totales mensuales al iniciar sesión
        const storedTotalesMensuales = JSON.parse(localStorage.getItem('totalesMensuales')) || [];
        totalesMensuales = storedTotalesMensuales;
        displayStoredData(); // Mostrar datos almacenados al iniciar sesión
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});

let totalesMensuales = [];

document.getElementById("gastos-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let mes = document.getElementById("mes").value;
    let arriendo = parseFloat(document.getElementById("arriendo").value);
    let servicios = parseFloat(document.getElementById("servicios").value);
    let comida = parseFloat(document.getElementById("comida").value);

    console.log("Guardando gastos", mes, arriendo, servicios, comida);

    let totalSemanal = comida;
    let totalMensual = arriendo + servicios + (comida * 4);

    let gastos = {
        mes: mes,
        arriendo: arriendo,
        servicios: servicios,
        comida: comida,
        totalMensual: totalMensual
    };

    totalesMensuales.push(gastos);
    localStorage.setItem('totalesMensuales', JSON.stringify(totalesMensuales));
    displayStoredData();

    document.getElementById("result").innerHTML = `
        <h3>Gastos del mes de ${mes}</h3>
        <p>Arriendo: $${formatNumber(arriendo)}</p>
        <p>Servicios: $${formatNumber(servicios)}</p>
        <p>Comida (Semanal): $${formatNumber(totalSemanal)}</p>
        <p>Total mensual: $${formatNumber(totalMensual)}</p>
    `;
});

document.getElementById("logout-btn").addEventListener("click", function() {
    let totalAnual = totalesMensuales.reduce((acc, curr) => acc + curr.totalMensual, 0);
    document.getElementById("total-anual").innerHTML = `
        <h3>Total anual: $${formatNumber(totalAnual)}</h3>
    `;

    document.querySelector(".login-container").classList.remove("hidden");
    document.getElementById("gastos-section").classList.add("hidden");
    document.getElementById("totales-anuales").classList.remove("hidden");
});

function displayStoredData() {
    const storedTotalesMensuales = JSON.parse(localStorage.getItem('totalesMensuales')) || [];
    totalesMensuales = storedTotalesMensuales;
    let tableContent = `<table>
        <tr>
            <th>Mes</th>
            <th>Arriendo</th>
            <th>Servicios</th>
            <th>Comida</th>
            <th>Total Mensual</th>
            <th>Acciones</th>
        </tr>`;

    storedTotalesMensuales.forEach((gastos, index) => {
        tableContent += `
            <tr>
                <td>${gastos.mes}</td>
                <td>$${formatNumber(gastos.arriendo)}</td>
                <td>$${formatNumber(gastos.servicios)}</td>
                <td>$${formatNumber(gastos.comida)}</td>
                <td>$${formatNumber(gastos.totalMensual)}</td>
                <td>
                    <button class="edit-button" onclick="editData(${index})">Editar</button>
                    <button class="delete-button" onclick="deleteData(${index})">Eliminar</button>
                </td>
            </tr>`;
    });

    tableContent += `</table>`;
    document.getElementById("datos-registrados").innerHTML = tableContent;
}

function editData(index) {
    let gastos = totalesMensuales[index];
    document.getElementById("mes").value = gastos.mes;
    document.getElementById("arriendo").value = gastos.arriendo;
    document.getElementById("servicios").value = gastos.servicios;
    document.getElementById("comida").value = gastos.comida;
    deleteData(index);
}

function deleteData(index) {
    totalesMensuales.splice(index, 1);
    localStorage.setItem('totalesMensuales', JSON.stringify(totalesMensuales));
    displayStoredData();
}

function formatNumber(num) {
    return num.toLocaleString('es-CO', { minimumFractionDigits: 0 });
}
