/**
 * Модуль отрисовки - отрисовывает в div контейнере диаграмму по загруженному файлу
 * @module visualizer
 */

/**
 * Перечисление сторон блока или диаграммы
 * @enum {string}
 */
var Side = {

    /** @member {string} */
    /** Верх */
    TOP: 'top',

    /** @member {string} */
    /** Низ */
    BOTTOM: 'bottom',

    /** @member {string} */
    /** Лево */
    LEFT: 'left',

    /** @member {string} */
    /** Право */
    RIGHT: 'right'
}

/**
 * Класс, предназначенный для визуализации диаграммы
 * @constructor
 * @param {div} loader - контейнер индикатора загрузки
 * @param {div} resultText - контейнер для сообщений об ошибках
 * @param {div} container - контейнер диаграммы
 * @param {div} preview - контейнер заголовка диаграммы
 * @param {div} title - контейнер области диаграммы
 */
function Visualizer(loader, resultText, container, preview, title) {
    this.loader = loader;
    this.resultText = resultText;
    this.container = container;
    this.preview = preview;
    this.title = title;
}

/**
 * Объект, содержащий текущую диаграмму
 * @type {mxGraph}
 */
Visualizer.prototype.diagram = null
/**
 * Объект, содержащий модель текущей диаграммы
 * @type {mxGraphModel}
 */
Visualizer.prototype.model = null
/**
 * Объект, содержащий слой idef0
 * @type {mxCell}
 */
Visualizer.prototype.idef0 = null
/**
 * Объект, содержащий слой uml usecase
 * @type {mxCell}
 */
Visualizer.prototype.uml = null
/**
 * Объект, содержащий кнопку отображения слоя idef0
 * @type {div}
 */
Visualizer.prototype.idef0Button = null
/**
 * Объект, содержащий кнопку отображения слоя uml usecase
 * @type {div}
 */
Visualizer.prototype.umlButton = null

/**
 * Основная функция для начала визуализации диаграммы через HTML5 File API
 * 
 * @param {event} event - событие выбора файла
 * 
 * @startuml uml-activity.png
 * start
 * if (Ссылка пустая) then (Да)
 *   :Отобразить ошибку "Поле для ссылки пусто";
 *   stop;
 * else (Нет)
 *  endif;
 * if (Загрузить файл по ссылке) then (Успех)
 * else (Неудача)
 *  :Отобразить ошибку "Ссылка неверна";
 *  stop;
 * endif;
 * if(Десериализовать файл в js-объект) then (Успех)
 * else(Неудача)
 *   :Отобразить ошибку "Структура файла неверна";
 *   stop;
 * endif;
 * if(js-объект содержит все корректные поля) then (Да)
 * else(Нет)
 *  :Отобразить ошибку "Файл имеет неверный формат";
 *  stop;
 * endif;
 * :Отобразить блок A0;
 * while (Для каждой стороны блока A0)
 *  :Создать пустой объект в углу диаграммы;
 *  while (Для каждой связи)
 *  :Создать точку соединения для стороны;
 *  :Создать точку соединения в углу диаграммы;
 *  :Отобразить связь между точкой соединения блока и угла диаграммы;
 *  endwhile
 * endwhile;
 * while (Для каждого варианта использования)
 *  :Отобразить вариант использования;
 * endwhile;
 * :Отобразить актера person;
 * :Отобразить актера mechanism;
 * while (Для каждого дочернего актера из person и mechanism)
 *  :Отобразить актера;
 *  :Отобразить связь с родительским актером;
 *  while (Для каждого варианта использования)
 *     if(Вариант использования связан с дочерним актером) then(Да)
 *     :Отобразить связь дочернего актера с вариантом использования;
 *     else (Нет)
 *     endif;
 *   endwhile;
 * endwhile;
 * stop
 * @enduml
 */
Visualizer.prototype.showDiagramFromEvent = function(event) {
    this.loader.style.display = "";
    var file = event.target.files[0];
    var loader = new Loader();
    var promise = loader.loadJsonFromFile(file);
    this.processDiagram(promise);
}

/**
 * Основная функция для начала визуализации диаграммы через URL
 * 
 * @param {string} url - ссылка на json файл
 */
Visualizer.prototype.showDiagramFromPath = function(url) {
    this.loader.style.display = "";
    var loader = new Loader();
    var promise = loader.loadJsonFromUrl(url);
    this.processDiagram(promise);
}

/**
 * Функция для обработки и проверки содержимого json файла после асинхронной загрузки
 * 
 * @param {promise} promise - объект, содержащий состояние асинхронной загрузки файла
 */
Visualizer.prototype.processDiagram = function(promise) {
    promise.then( result => {
        var validator = new Validator();
        var valid = validator.validateJson(result);
        this.loader.style.display = "none";
        if(valid) {
            this.drawDiagram(result);
        }
        else {
            this.showError("JSON не соотвествует формату Usecase");
        }
    }, error => {
        this.loader.style.display = "none";
        this.showError(error);
    });
}

/**
 * Функция для отображения ошибки при неудаче в процессе загрузки или обработки json-файла
 * 
 * @param {string} message - описание ошибки
 * 
 */
Visualizer.prototype.showError = function(message) {
    this.preview.style.display = "none";
    this.resultText.style.display = "";
    this.resultText.innerText = message;
}

/**
 * Главная функция для создания диаграммы и отрисовки ее компонентов
 * 
 * @param {Object} data - js-объект диграммы
 * 
 */
Visualizer.prototype.drawDiagram = function(data) {
    this.preview.style.display = "";
    this.resultText.style.display = "none";
    this.title.innerText = data.package;
    this.clearDiagram();
    this.createDiagram();
    this.drawIDEFDiagram(data, this.idef0);
    this.drawUseCaseDiagram(data, this.uml);
}

/**
 * Функция для создания новой диаграммы с необходимыми настройками,
 * а также кнопок переключения между слоями диаграммы
 */
Visualizer.prototype.createDiagram = function() {
    var self = this;
    this.idef0Button = this.container.appendChild(mxUtils.button('IDEF0', function()
	{
        self.model.setVisible(self.idef0, true);
        self.model.setVisible(self.uml, false);
	}))			
    this.umlButton = this.container.appendChild(mxUtils.button('UML USECASE', function()
	{
        self.model.setVisible(self.idef0, false);
        self.model.setVisible(self.uml, true);
    }))
    var root = new mxCell();
	this.idef0 = root.insert(new mxCell());
    this.uml = root.insert(new mxCell());
    this.model = new mxGraphModel(root);
    this.diagram = new mxGraph(this.container, this.model);
    this.diagram.setCellsSelectable(false);
    this.diagram.setCellsLocked(true);
    this.diagram.isCellFoldable = function(cell)
	{
	    return false;
    };
    this.model.setVisible(this.idef0, true);
    this.model.setVisible(this.uml, false);
}

/**
 * Функция очистки контейнера диаграммы.
 * В функции происходит удаление предыдущей диаграаммы (если существует),
 * а также кнопок переключения между слоями диаграммы.
 */
Visualizer.prototype.clearDiagram = function() {
    if(this.diagram != null) {
        this.diagram.destroy();
    }
    if(this.idef0Button != null) {
        this.container.removeChild(this.idef0Button);
    }
    if(this.umlButton != null) {
        this.container.removeChild(this.umlButton);
    }
}

/**
 * Функция отрисовки дочерней диаграммы IDEF0
 * 
 * @param {Object} data - js-объект диграммы
 * @param {mxCell} layer - слой для отрисовки диаграммы
 * 
 */
Visualizer.prototype.drawIDEFDiagram = function(data, layer) {
    this.drawA0(data, layer);
}

/**
 * Функция отрисовки дочерней диаграммы IDEF0 Uml UseCase диаграммы
 * В функции происходит отрисовка объектов Uml Usecase: актеров, прецедентов и связей.
 * 
 * @param {Object} data - js-объект диграммы
 * @param {mxCell} layer - слой для отрисовки диаграммы
 * 
 */
Visualizer.prototype.drawUseCaseDiagram = function(data, layer) {
    var width = this.diagram.container.offsetWidth;
    var height = this.diagram.container.offsetHeight-20;
    var personPosition = (width/10)*0.75;
    var mechanismPosition = (width/10)*9.25;
    var personActorsPosition = (width/10)*2.5;
    var mechanismActorsPosition = (width/10)*7.5;
    var subject = data.activities[0];
    var mechanism = data.mechanism;
    var person = data.person;
    var activities = data.activities;
    var maxActorsCount = Math.max(mechanism.actors.length, person.actors.length);
    var maxActivitiesCount = activities.length - 1;
    var factory = new UMLShapeFactory(this.diagram, layer, maxActorsCount, maxActivitiesCount);
    this.model.beginUpdate();
    try{
        this.drawSubject(factory, width, height, subject);
        var usecasesShapes = this.drawUseCases(factory, width, height, activities);
        var personShape = this.drawParentActor(factory, height, personPosition, person);
        var mechanismShape = this.drawParentActor(factory, height, mechanismPosition, mechanism);
        this.drawChildActors(factory, height, personActorsPosition, personShape, person.actors, usecasesShapes);
        this.drawChildActors(factory, height, mechanismActorsPosition, mechanismShape, mechanism.actors, usecasesShapes);
    }
    finally
    {
        this.model.endUpdate();
    }
}

/**
* Функция отрисовки уровня A0 диаграммы IDEF0
 * В функции происходит отрисовка объектов первого уровня: блока A0 и связей.
 * 
 * @param {Object} data - js-объект диграммы
 * @param {mxCell} layer - слой для отрисовки диаграммы
 * 
 */
Visualizer.prototype.drawA0 = function(data, layer) {
    var width = this.diagram.container.offsetWidth;
    var height = this.diagram.container.offsetHeight-20;
    var a0 = data.activities[0];
    var control = data.control;
    var input = data.input;
    var output = data.output;
    var bootomConnections = [];
    bootomConnections.push(data.mechanism);
    bootomConnections.push(data.person);
    var factory = new IDEFShapeFactory(this.diagram, layer, 1);
    this.model.beginUpdate();
    try
    {
        var box = this.drawBox(factory, width/2, height/2, a0);
        this.drawBoxArrows(factory, width/2, height/2, box, Side.TOP, control);
        this.drawBoxArrows(factory, width/2, height/2, box, Side.BOTTOM, bootomConnections);
        this.drawBoxArrows(factory, width/2, height/2, box, Side.LEFT, input);
        this.drawBoxArrows(factory, width/2, height/2, box, Side.RIGHT, output);
    }
    finally
    {
        this.model.endUpdate();
    }
}

/**
 * Функция для отрисовки блока диаграммы IDEF0
 * 
 * @param {IDEFShapeFactory} factory - фабрика форм диаграммы IDEF0
 * @param {number} x - координата расположения блока по оси x
 * @param {number} y - координата расположения блока по оси y
 * @param {Object} activity - описание варианта использования
 * @returns {IDEFShapes.Box} блок диаграммы IDEF0
 * 
 */
Visualizer.prototype.drawBox = function(factory, x, y, activity) {
    return factory.drawBox(activity.value, activity.id, x, y);
}

/**
 * Функция для отрисовки стрелок блока диаграммы IDEF0
 * 
 * @param {IDEFShapeFactory} factory - фабрика форм диаграммы IDEF0
 * @param {number} x - координата расположения блока по оси x
 * @param {number} y - координата расположения блока по оси y
 * @param {IDEFShapes.Box} box - блок диаграммы
 * @param {string} side - сторона блока
 * @param {Object[]} connections - описание связей блока
 * 
 */
Visualizer.prototype.drawBoxArrows = function(factory, x, y, box, side, connections) {
    var step = 1 / connections.length;
    var position = step/2;
    var corner = factory.createCorner(side, x, y);
    for(var i in connections){
        var connection = connections[i];
        var cornerConnector = factory.createConnector(corner, side, position);
        var boxConnector = factory.createConnector(box, side, position);
        if(side == Side.RIGHT){
            factory.drawSolidLine(connection.value, boxConnector, cornerConnector);
        }
        else{
            factory.drawSolidLine(connection.value, cornerConnector, boxConnector);
        }
        position = position + step;
    }
}

/**
 * Функция для отрисовки субъекта диаграммы Uml UseCase
 * 
 * @param {UMLShapeFactory} factory - фабрика форм диаграммы Uml UseCase
 * @param {number} width - ширина диаграммы
 * @param {number} height - высота диаграммы
 * @param {Object} activity - описание главного варианта использования
 * @returns {UMLShapes.Subject} субъект диаграммы Uml UseCase
 * 
 */
Visualizer.prototype.drawSubject = function(factory, width, height, activity) {
    return factory.drawSubject(activity.value, width/2-width*0.15, 10, width*0.3, height-20);
}

/**
 * Функция для отрисовки вариантов использования (прецедентов) диаграммы Uml UseCase
 * 
 * @param {UMLShapeFactory} factory - фабрика форм диаграммы Uml UseCase
 * @param {number} width - ширина диаграммы
 * @param {number} height - высота диаграммы
 * @param {Object[]} activities - описание вариантов использования
 * @returns {UMLShapes.UseCase[]} массив вариантов использования (прецедентов) диаграммы Uml UseCase
 * 
 */
Visualizer.prototype.drawUseCases = function(factory, width, height, activities) {
    var usecasesShapes = [];
    var activitiesPosition = width/2;
    var step = 1 / (activities.length - 1);
    var position = step/2;
    for(var i = 1; i < activities.length; i++){
        var activity = activities[i];
        var usecaseShape = factory.drawUseCase(activity.value, activitiesPosition, (height * position));
        usecasesShapes.push(usecaseShape);
        position = position + step;
    }
    return usecasesShapes;
}

/**
 * Функция для отрисовки родительского актера диаграммы Uml UseCase
 * 
 * @param {UMLShapeFactory} factory - фабрика форм диаграммы Uml UseCase
 * @param {number} height - высота диаграммы
 * @param {number} x - координата расположения актера по оси x
 * @param {Object} actor - описание актера
 * @returns {UMLShapes.Actor} актер диаграммы Uml UseCase
 * 
 */
Visualizer.prototype.drawParentActor = function (factory, height, x, actor) {
    return factory.drawActor(actor.value, x, height/2);
}

/**
 * Функция для отрисовки дочерних актеров диаграммы Uml UseCase
 * 
 * @param {UMLShapeFactory} factory - фабрика форм диаграммы Uml UseCase
 * @param {number} height - высота диаграммы
 * @param {number} x - координата расположения актеров по оси x
 * @param {Object} parent - описание родительского актера
 * @param {Object} actors - описание дочерних актеров
 * @param {UMLShapes.UseCase[]} usecases - массив, содержащий ранее отрисованные варианты использования
 * 
 */
Visualizer.prototype.drawChildActors = function (factory, height, x, parent, actors, usecases) {
    var step = 1 / (actors.length + 1);
    var verticalPosition = step;
    for(var i in actors) {
        var actor = actors[i];
        var actorShape = factory.drawActor(actor.value, x, height * verticalPosition);
        factory.drawGeneralization(parent, actorShape);
        verticalPosition = verticalPosition + step;
        for(var j in actor.activities){
            var activityNumber = actor.activities[j];
            var usecase = usecases[activityNumber-1];
            factory.drawAssociation(actorShape, usecase);
        }
    }
}