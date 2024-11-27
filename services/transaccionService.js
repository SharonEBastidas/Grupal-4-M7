const client = require('../config/db');

const registrarTransaccion = async (descripcion, monto, cuenta) => {
    const fecha = new Date().toISOString().split('T')[0];

    try {
        await client.query('BEGIN');

        const res = await client.query('SELECT saldo FROM cuentas WHERE id = $1', [cuenta]);
        const saldoActual = res.rows[0].saldo;

        if (saldoActual < monto) {
            throw new Error('Saldo insuficiente para realizar la transacción');
        }

        await client.query(
            'INSERT INTO transacciones (descripcion, fecha, monto, cuenta) VALUES ($1, $2, $3, $4)',
            [descripcion, fecha, monto, cuenta]
        );

        await client.query('UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2', [monto, cuenta]);

        await client.query('COMMIT');

        const transacciones = await client.query(
            'SELECT * FROM transacciones WHERE cuenta = $1 ORDER BY fecha DESC LIMIT 1',
            [cuenta]
        );

        console.log('Última transacción registrada:', transacciones.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en la transacción:', error.message);
    }
}

const consultarTransacciones = async (cuentaId) => {
    try {
        await client.query('BEGIN');
        await client.query('DECLARE transacciones_cursor CURSOR FOR SELECT * FROM transacciones WHERE cuenta = $1', [cuentaId]);

        let transacciones = [];
        const limit = 10;
        let count = 0;

        while (count < limit) {
            const res = await client.query('FETCH NEXT FROM transacciones_cursor');
            if (res.rows.length === 0) break;
            transacciones = transacciones.concat(res.rows);
            count += res.rows.length;
        }

        await client.query('CLOSE transacciones_cursor');

        console.log('Transacciones:', transacciones);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al consultar las transacciones:', error.message);
    }
}

const consultarSaldo = async (cuentaId) => {
    try {
        await client.query('BEGIN');

        await client.query('DECLARE saldo_cursor CURSOR FOR SELECT saldo FROM cuentas WHERE id = $1', [cuentaId]);

        const res = await client.query('FETCH NEXT FROM saldo_cursor');
        if (res.rows.length === 0) {
            console.log('Cuenta no encontrada');
        } else {
            console.log('Saldo de la cuenta:', res.rows[0].saldo);
        }

        await client.query('CLOSE saldo_cursor');
        await client.query('COMMIT');

    } catch (error) {
        await client.query('ROLLBACK');

        console.error('Error al consultar el saldo:', error.message);
    }
}

module.exports = {
    registrarTransaccion,
    consultarTransacciones,
    consultarSaldo
}