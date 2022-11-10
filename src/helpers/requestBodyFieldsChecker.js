const client = require('../db/db.js');
const { getReaponse } = require('./responses.js');


exports.requestBodyFieldsChecker = async (req, res, tableName, skip = null) => {
    // skip - наименование поля, которое отфильтровывается (не учитывается)

    const body = req.body;

    if(!body) return null;

    let tableColumns;
    try {
        tableColumns = await client.query(
            `SELECT column_name, data_type
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE table_name = '${tableName}';`
        );
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message);
        return null;
    }

    let columns = tableColumns.rows.filter(column => (column.column_name !== 'id' && column.column_name !== skip));
    const bodyLen = Object.keys(body).length;
    const fieldsLen = columns.length;

    if (bodyLen !== fieldsLen) {
        const message = getReaponse('ERROR', 'Неверное количество параметров в теле запроса');
        res.status(message.statusCode).json(message);
        return null;
    }
        
    let counter = 0;
    for (const keyInBody in body) {
        columns.forEach(column => {        
            if ((keyInBody == column.column_name) && body[keyInBody]+'') counter++;
        })
    }

    if (counter !== columns.length) {
        const message = getReaponse('ERROR', 'Не верно заполнены поля в теле запроса');
        res.status(message.statusCode).json(message);
        return null;
    }

    return body;
}
