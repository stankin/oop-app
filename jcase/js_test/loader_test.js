/**
 * Модуль unit тестирования модуля загрузки
 * @module loader_test
 */

/**
 * Тестирование функции loadJsonFromFile
 */
describe("loadJson(file)", function(done) {

    it('should return result for valid json file', function() {
        var mock = mockFile('./test_data/loader_true.json');
        var loader = new Loader();
        return loader.loadJsonFromFile(mock)
            .then(function(result) { assert(true) })
            .catch(function(error) { assert.fail('Error not expected') });
    });


    it('should return error for invalid json file', function() {
        var mock = mockFile('./test_data/loader_false.json');
        var expectedError = 'Загруженный файл не содержит структуру JSON';
        var loader = new Loader();
        return loader.loadJsonFromFile(mock)
            .then(function(result) { assert.fail('Successful result not expected') })
            .catch(function(error) { expect(error).to.equal(expectedError) });
    });
  
});

/**
 * Тестирование функции loadJsonFromUrl
 */
describe("loadJson(file)", function(done) {

    it('should return result for valid json file', function() {
        var url = './test_data/loader_true.json';
        var loader = new Loader();
        return loader.loadJsonFromUrl(url)
            .then(function(result) { assert(true) })
            .catch(function(error) { assert.fail('Error not expected') });
    });


    it('should return error for invalid json file', function() {
        var url = './test_data/loader_false.json';
        var loader = new Loader();
        var expectedError = 'Загруженный файл не содержит структуру JSON';
        return loader.loadJsonFromUrl(url)
            .then(function(result) { assert.fail('Successful result not expected') })
            .catch(function(error) { expect(error).to.equal(expectedError) });
    });
  
});

/**
 * Функция для создания заглушки файла
 * 
 * @param {string} path - путь к файлу с тестовыми данными 
 * @returns {File} объект, описывающий файл
 */
function mockFile(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);
    return new File([request.responseText], 'test.json');
}