/**
 * Модуль загрузки - осуществляет загрузку js-объекта диаграммы из файла или по ссылке
 * @module loader
 */

 /**
 * Класс, предназначенный для загрузки js-объекта
 * @constructor
 */
 function Loader() {}

 /**
 * Функция, которая загружает js-объект диаграммы из файла
 * 
 * @param {File} file - интерфейс, содержащий выбранный json файл
 * @returns {Promise} объект, содержащий состояние асинхронной загрузки файла
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

/**
 * Функция, которая загружает js-объект диаграммы по ссылке
 * 
 * @param {string} url - ссылка на json файл
 * @returns {Promise} объект, содержащий состояние асинхронной загрузки файла
 */
Loader.prototype.loadJsonFromUrl = function (url) {
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);
  var file = new File([request.responseText], url);
  return this.loadJsonFromFile(file);
}