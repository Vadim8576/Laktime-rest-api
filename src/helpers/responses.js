// 201 - Успешное выполнение PUT или POST. Объект успешно создан или обновлен
// 401 - Unauthorized — для доступа к запрашиваемому ресурсу требуется аутентификация.
// 403 - Возвращается, если передан недопустимый ключ api.
// 400 - Возвращается, если есть ошибка в URI запроса, заголовке и тексте. Текст ответа будет содержать сообщение об ошибке с описанием проблемы.

exports.getReaponse = (action, data = null) => {
    switch (action) {
        case 'OK':
            return { 'statusCode': 200, 'ok': true, message: 'Операция выполнена успешно!', 'data': data }

        case 'MAIL-OK':
            return { 'statusCode': 200, 'ok': true, message: 'Письмо успешно отправлено пользователю', 'data': data }

        case 'MAIL-ERROR':
            return { 'statusCode': 400, 'ok': false, message: 'Ошибка сервера! Письмо не отправлено!', 'data': data }

        case 'ERROR':
            return { 'statusCode': 400, 'ok': false, message: 'Ошибка! Операция не выполнена!', 'data': data }

        case 'NOT-FOUND':
            return { 'statusCode': 400, 'ok': false, message: 'Данные не найдены!', 'data': data }

        case 'API-KEY-WRONG':
            return { 'statusCode': 403, 'ok': false, message: 'Неверный API KEY!', 'data': data }

        case 'REFRESH-API-KEY-WRONG':
            return { 'statusCode': 403, 'ok': false, message: 'Неверный REFRESH API KEY!', 'data': data }

        case 'TOKEN-WRONG':
            return { 'statusCode': 403, 'ok': false, message: 'Неверный token!', 'data': data }

        case 'BODY-WRONG':
            return { 'statusCode': 400, 'ok': false, message: 'Неверное тело запроса!', 'data': data }

        case 'PARAMS-WRONG':
            return { 'statusCode': 400, 'ok': false, message: 'Неверные параметры!', 'data': data }

        case 'PASSWORD-WRONG':
            return { 'statusCode': 400, 'ok': false, message: 'Неверный e-mail или пароль!', 'data': data }

        case 'DB-ERROR':
            return { 'statusCode': 500, 'ok': false, message: 'Ошибка базы данных!', 'data': data }

        case 'SERVER-ERROR':
            return { 'statusCode': 500, 'ok': false, message: 'Ошибка сервера!', 'data': data }

        case 'TOKEN-UPDATE':
            return { 'statusCode': 200, 'ok': true, message: 'Токены обновлены!', 'data': data }

        case 'TOKEN-WRONG':
            return { 'statusCode': 500, 'ok': false, message: 'Неверный токен!', 'data': data }

        case 'EMAIL-ALREADY-EXISTS':
            return { 'statusCode': 400, 'ok': false, message: 'Email уже существует, регистрация отменена!', 'data': data }

        case 'EMAIL-NOT-FOUND':
            return { 'statusCode': 400, 'ok': false, message: 'Неверный e-mail или пароль!', 'data': data }

        case 'REGISTER-OK':
            return { 'statusCode': 200, 'ok': true, message: 'Регистрация прошла успешно!', 'data': data }

        case 'LOGIN-OK':
            return { 'statusCode': 200, 'ok': true, message: 'Успешный вход в личный кабинет!', 'data': data }

        case 'ACCESS-DENIED':
            return { 'statusCode': 403, 'ok': false, message: 'Нет доступа!', 'data': data }

        case 'EXTENSION-ERROR':
            return { 'statusCode': 500, 'ok': false, message: 'Неверный формат файла!', 'data': data }

        default:
            break;
    }
}
