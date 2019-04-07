/**
 * Модуль отрисовки - отрисовывает в div контейнере диаграмму по загруженному файлу.
 * 
 */

 function Loader() {}

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
Loader.prototype.loadJsonFromFile = function (file) {
  var reader = new FileReader();
  var promise = new Promise((resolve, reject) => {
    reader.onload = function(evt) {
      try {
        var result = JSON.parse(evt.target.result);
        resolve(result);
      } catch (e) {
        reject('Загруженный файл не содержит структуру JSON');
      }
    }
    reader.readAsText(file);
  });
  return promise;
}

Loader.prototype.loadJsonFromUrl = function (url) {
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);
  var file = new File([request.responseText], url);
  return this.loadJsonFromFile(file);
}