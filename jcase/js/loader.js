/**
 * Модуль отрисовки - отрисовывает в div контейнере диаграмму по загруженному файлу.
 */

 /**
 * Функция: loadJson(event).
 * 
 * Функция, которая загружает и читает содержимое выбранного файла,
 * а также осуществляет проверку и парсинг содержимого.
 * 
 * Параметры:
 * 
 * file - объект, описывающий файл.
 * 
 * Вовзращаемый результат:
 * 
 * promise - объект, содержащий состояние асинхронной загрузки файла.
 */
function loadJson(file) {
    var reader = new FileReader()
    var promise = new Promise((resolve, reject) => {
        reader.onload = function(evt) {
            try {
                var result = JSON.parse(evt.target.result)
                resolve(result)
            } catch (e) {
                reject('Загруженный файл не содержит структуру JSON')
            }
        }
        reader.readAsText(file)
    });
    return promise
}