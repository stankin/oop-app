/**
 * Модуль отрисовки - отрисовывает в div контейнере диаграмму по загруженному файлу.
 */

var VisualizerConstants = {
    TOP: 'top',

    BOTTOM: 'bottom',

    LEFT: 'left',

    RIGHT: 'right'
}

function Visualizer(loader, resultText, container, preview, title) {
    this.loader = loader;
    this.resultText = resultText;
    this.container = container;
    this.preview = preview;
    this.title = title;
}

/**
 * Объект, содержащий текущую диаграмму.
 */
Visualizer.prototype.diagram = null
/**
 * Объект, содержащий модель текущей диаграммы.
 */
Visualizer.prototype.model = null
/**
 * Объект, содержащий слой idef0.
 */
Visualizer.prototype.idef0 = null
/**
 * Объект, содержащий слой uml usecase.
 */
Visualizer.prototype.uml = null
/**
 * Объект, содержащий кнопку отображения слоя idef0.
 */
Visualizer.prototype.idef0Button = null
/**
 * Объект, содержащий кнопку отображения слоя uml usecase.
 */
Visualizer.prototype.umlButton = null

/**
 * Функция: showdiagram(event).
 * 
 * Главная функция, которая вызывается из HTML 5 FileApi.
 * В функции происходит загрузка и проверка JSON файла
 * и вызов функции отрисовки диаграммы.
 * 
 * Параметры:
 * 
 * event - событие выбора файла.
 */
Visualizer.prototype.showDiagramFromEvent = function(event) {
    this.loader.style.display = "";
    var file = event.target.files[0];
    var loader = new Loader();
    var promise = loader.loadJsonFromFile(file);
    this.processDiagram(promise);
}

Visualizer.prototype.showDiagramFromLink = function(url) {
    this.loader.style.display = "";
    var loader = new Loader();
    var promise = loader.loadJsonFromUrl(url);
    this.processDiagram(promise);
}

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
 * Функция: showError(message).
 * 
 * Функция отображения ошибки.
 * В функции происходит отображение ошибки при неудаче в процессе обработки файла JSON.
 * 
 * Параметры:
 * 
 * message - описание ошибки.
 */
Visualizer.prototype.showError = function(message) {
    this.preview.style.display = "none";
    this.resultText.style.display = "";
    this.resultText.innerText = message;
}

/**
 * Функция: drawdiagram(diagramContainer, usecase).
 * 
 * Функция отрисовки диаграммы.
 * В функции происходит создание диаграммы и отрисовка ее компонентов.
 * 
 * Параметры:
 * 
 * usecase - js-объект диграммы.
 */
Visualizer.prototype.drawDiagram = function(usecase) {
    this.preview.style.display = "";
    this.resultText.style.display = "none";
    this.title.innerText = usecase.package;
    this.clearDiagram();
    this.createDiagram();
    this.drawIDEFDiagram(usecase, this.idef0);
    this.drawUseCaseDiagram(usecase, this.uml);
}

/**
 * Функция: creatediagram(container).
 * 
 * Функция создания диаграммы.
 * В функции происходит создание новой диаграммы с необходимыми настройками и стилями,
 * а также кнопок переключения между слоями диаграммы.
 * 
 * Параметры:
 * 
 * container - div-контейнер для диаграммы.
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
 * Функция: cleardiagram(container).
 * 
 * Функция очистки контейнера диаграммы.
 * В функции происходит удаление предыдущей диаграаммы (если существует),
 * а также кнопок переключения между слоями диаграммы.
 * 
 * Параметры:
 * 
 * container - div-контейнер для диаграммы.
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

Visualizer.prototype.drawIDEFDiagram = function(data, layer) {
    this.drawA0(data, layer);
}

/**
 * Функция: drawUseCase(usecase, parent).
 * 
 * Функция отрисовки Uml Usecase диаграммы.
 * В функции происходит отрисовка объектов Uml Usecase: актеров, прецедентов и связей.
 * 
 * Параметры:
 * 
 * usecase - js-объект диграммы.
 * parent - родительский слой для диаграммы Uml Usecase.
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
 * Функция: drawFirstLevel(usecase).
 * 
 * Функция отрисовки уровня A0 диаграммы IDEF0
 * В функции происходит отрисовка объектов первого уровня: блока A0 и связей.
 * 
 * Параметры:
 * 
 * usecase - js-объект диграммы;
 * parent - родительский слой для диаграммы IDEF0.
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
        this.drawBoxArrows(factory, width/2, height/2, box, VisualizerConstants.TOP, control);
        this.drawBoxArrows(factory, width/2, height/2, box, VisualizerConstants.BOTTOM, bootomConnections);
        this.drawBoxArrows(factory, width/2, height/2, box, VisualizerConstants.LEFT, input);
        this.drawBoxArrows(factory, width/2, height/2, box, VisualizerConstants.RIGHT, output);
    }
    finally
    {
        this.model.endUpdate();
    }
}

Visualizer.prototype.drawBox = function(factory, x, y, activity) {
    return factory.drawBox(activity.value, activity.id, x, y);
}

Visualizer.prototype.drawBoxArrows = function(factory, x, y, box, side, connections) {
    var step = 1 / connections.length;
    var position = step/2;
    var corner = factory.createCorner(side, x, y);
    for(var i in connections){
        var connection = connections[i];
        var cornerConnector = factory.createConnector(corner, side, position);
        var boxConnector = factory.createConnector(box, side, position);
        if(side == VisualizerConstants.RIGHT){
            factory.drawSolidLine(connection.value, boxConnector, cornerConnector);
        }
        else{
            factory.drawSolidLine(connection.value, cornerConnector, boxConnector);
        }
        position = position + step;
    }
}

Visualizer.prototype.drawSubject = function(factory, width, height, activity) {
    return factory.drawSubject(activity.value, width/2-width*0.15, 10, width*0.3, height-20);
}

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

Visualizer.prototype.drawParentActor = function (factory, height, horisontalPosition, actor) {
    return factory.drawActor(actor.value, horisontalPosition, height/2);
}

Visualizer.prototype.drawChildActors = function (factory, height, horisontalPosition, parent, actors, usecases) {
    var step = 1 / (actors.length + 1);
    var verticalPosition = step;
    for(var i in actors) {
        var actor = actors[i];
        var actorShape = factory.drawActor(actor.value, horisontalPosition, height * verticalPosition);
        factory.drawGeneralization(parent, actorShape);
        verticalPosition = verticalPosition + step;
        for(var j in actor.activities){
            var activityNumber = actor.activities[j];
            var usecase = usecases[activityNumber-1];
            factory.drawAssociation(actorShape, usecase);
        }
    }
}