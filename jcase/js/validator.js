/**
 * Модуль проверки
 * Осуществляет проверку js-объекта на существования всех нужных полей, а также типов данных этих полей.
 * @module validator
 */

 /**
 * Класс, предназначенный для проверки js-объекта
 * @constructor
 */
function Validator() {}

 /**
 * Функция проверки содержимого js-объекта usecase.
 * В функции происходит отрисовка объектов Uml Usecase: актеров, прецедентов и связей.
 * 
 * @param {Object} data - js-объект диграммы.
 * @returns {boolean} true в случае если js-объект содержит все требуемые поля и семантически корректен,
 * во всех остальных случаях - false
 */
 Validator.prototype.validateJson = function(data) {
    try{
        if(data.activities.length < 1){
            return false
        }
        var ajv = new Ajv();
        var valid = ajv.validate(schema, data);
        return valid;
     }
    catch(e) {
        console.log(e)
        return false
    }
}

/**
 * Схема json файла
 * @type {Object}
 */
var schema = {
    "properties": {
        "package": { "type": "string" }
    },
    "additionalProperties": true
}