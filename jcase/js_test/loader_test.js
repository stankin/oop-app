/**
 * Модуль unit тестирования модуля загрузки.
 */

/**
 * Тестирование функции loadJson(file).
 */
describe("loadJson(file)", function(done) {

    it('should return result for valid json file', function() {
        var mock = mockFile("./test_data/loader_true.json");
        return Loader.loadJsonFromFile(mock)
            .then(function(result) { assert(true) })
            .catch(function(error) { assert.fail('Error not expected') });
    });


    it('should return error for invalid json file', function() {
        var mock = mockFile("./test_data/loader_false.json");
        var expectedError = 'Загруженный файл не содержит структуру JSON';
        return Loader.loadJsonFromFile(mock)
            .then(function(result) { assert.fail('Successful result not expected') })
            .catch(function(error) { expect(error).to.equal(expectedError) });
    });
  
});

/**
 * Функция: mockFile(path).
 * 
 * Функция для создания заглушки файла.
 * 
 * Параметры:
 * 
 * path - путь к файлу с тестовыми данными
 * 
 * Вовзращаемый результат:
 * 
 * объект, описывающий файл.
 */
function mockFile(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);
    return new File([request.responseText], "test.json");
}