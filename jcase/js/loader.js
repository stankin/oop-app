/**
 * Модуль отрисовки - отрисовывает в div контейнере диаграмму по загруженному файлу.
 * 
 */

 /**
 * Функция: loadJson(event).
 * 
 * Функция, которая загружает и читает содержимое выбранного файла,
 * а также осуществляет проверку и парсинг содержимого.
 * <img src="test.png">
 *
 * @startuml test.png
 * start
if (Ссылка пустая) then (Да)
  :Отобразить ошибку "Поле для ссылки пусто";
  stop;
else (Нет)
endif;
if (Загрузить файл по ссылке) then (Успех)
else (Неудача)
  :Отобразить ошибку "Ссылка неверна";
  stop;
endif;
if(Десериализовать файл в js-объект) then (Успех)
else(Неудача)
  :Отобразить ошибку "Структура файла неверна";
  stop;
endif;
if(js-объект содержит все корректные поля) then (Да)
else(Нет)
  :Отобразить ошибку "Файл имеет неверный формат";
  stop;
endif;
:Отобразить блок A0;
while (Для каждой стороны блока A0)
  :Создать пустой объект на границе canvas;
  while (Для каждой связи)
  :Отобразить связь между блоком A0 и объектом на границе canvas;
  endwhile
endwhile;
if(js-объект содержит блоки A1..An) then (Да)
while (Для каждого блока Ai)
  :Отобразить блок Ai;
  while (Для каждой стороны блока Ai)
     while (Для каждой связи)
     :Отобразить связь;
     endwhile;
  endwhile;
endwhile;
else (Нет)
endif;
stop
 * @enduml
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