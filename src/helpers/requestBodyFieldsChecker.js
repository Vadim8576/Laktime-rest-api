const client = require('../db/db.js');
const { getReaponse } = require('./responses.js');


exports.requestBodyFieldsChecker = async (req, res, tableName, skip = null) => {
    // skip - наименование поля, которое отфильтровывается (не учитывается)

    const body = req.body || null;

    // console.log('requestBodyFieldsChecker, body', body)

    if(!body) return null

    let tableInfo;

    try {
        tableInfo = await client.query(
            `SELECT column_name, data_type
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE table_name = '${tableName}';`
        );
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message)
        return null
    }

    let fields = tableInfo.rows.filter(field => (field.column_name !== 'id' && field.column_name !== skip));

    console.log('body = ', body)
    console.log('fields = ', fields)

    const bodyLen = Object.keys(body).length;
    const fieldsLen = fields.length;

    if (bodyLen !== fieldsLen) {
        const message = getReaponse('ERROR', 'Неверное количество параметров в теле запроса');
        res.status(message.statusCode).json(message)
        return null
    }
        
    let counter = 0;

    for (const keyInBody in body) {
        fields.forEach(field => {        
            console.log(keyInBody) 
            if ((keyInBody == field.column_name) && body[keyInBody]+'') counter++;
        })
    }


    if (counter !== fields.length) {
        const message = getReaponse('ERROR', 'Не верно заполнены поля в теле запроса');
        res.status(message.statusCode).json(message)
        return null
    }

    return body;
}
