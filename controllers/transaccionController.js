const transacciones = require('../services/transaccionService');
const { createInterface } = require('readline');

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const displayMenu = () => {
    console.log("Menú de Opciones");
    console.log("1. Registrar Transacción");
    console.log("2. Consultar Transacción");
    console.log("3. Consultar Saldo");
}

const registrarTransaccion = () => {
    rl.question("Ingresa una descripción: ", (descripcion) => {
        rl.question("Ingresa un monto: ", (monto) => {
            rl.question("Ingresa una cuenta: ", (cuenta) => {
                transacciones.registrarTransaccion(descripcion, parseInt(monto), cuenta)
                setTimeout(() => {
                    displayMenu();
                    chooseOption();
                }, 2000)
            })
        })
    });
}

const consultarTransacciones = () => {
    rl.question("Ingresa una cuenta: ", (cuenta) => {
        transacciones.consultarTransacciones(cuenta);
        setTimeout(() => {
            displayMenu();
            chooseOption();
        }, 2000)
    })
}

const consultarSaldo = () => {
    rl.question("Ingresa una cuenta: ", (cuenta) => {
        transacciones.consultarSaldo(cuenta);
        setTimeout(() => {
            displayMenu();
            chooseOption();
        }, 2000)
    })
}

const chooseOption = () => {
    rl.question("Digita el número de tu opción: ", (choice) => {
        switch(choice) {
            case "1":
                registrarTransaccion();
                break;
            case "2":
                consultarTransacciones();
                break;
            case "3":
                consultarSaldo();
                break;
            default:
                console.log("Opción Inválida, Intenta nuevamente\n");
                displayMenu();
                chooseOption();
                break;
        }
    })
}

module.exports = {
    displayMenu,
    registrarTransaccion,
    consultarTransacciones,
    consultarSaldo,
    chooseOption
}