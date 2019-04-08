/**
 * Модуль unit тестирования модуля проверки
 * @module validator_test
 */

/**
 * Тестирование функции validateUsecase(usecase)
 */
describe("validateUsecase(usecase)", function() {

    it("should return true for valid json format", function() {
        var mock = mockJson('./test_data/validator_true.json');
        var validator = new Validator();
        assert.equal(validator.validateJson(mock), true);
    });

    it("should return false for invalid json format", function() {
        var mock = mockJson('./test_data/validator_false.json');
        var validator = new Validator();
        assert.equal(validator.validateJson(mock), false);
    });
  
});

/**
 * Функция для создания заглушки js-объекта
 * 
 * @param {string} path - путь к файлу с тестовыми данными
 * @returns {Object} js-объект
 */
function mockJson(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null)
    return JSON.parse(request.responseText);
}