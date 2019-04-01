/**
 * Модуль unit тестирования модуля проверки.
 */

/**
 * Тестирование функции validateUsecase(usecase).
 */
describe("validateUsecase(usecase)", function() {

    it("should return true for valid json format", function() {
        var mock = mockJson("./test_data/validator_true.json")
        assert.equal(validateUsecase(mock), true);
    });

    it("should return false for invalid json format", function() {
        var mock = mockJson("./test_data/validator_false.json")
        assert.equal(validateUsecase(mock), false);
    });
  
});

/**
 * Функция: mockJson(path).
 * 
 * Функция для создания заглушки js-объекта.
 * 
 * Параметры:
 * 
 * path - путь к файлу с тестовыми данными
 * 
 * Вовзращаемый результат:
 * 
 * js-объект.
 */
function mockJson(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null)
    return JSON.parse(request.responseText);
}