/**
 * Модуль отрисовки - отрисовывает в div контейнере диаграмму по загруженному файлу.
 */

/**
 * Объект, содержащий текущую диаграмму.
 */
var graph = null
/**
 * Объект, содержащий модель текущей диаграммы.
 */
var model = null
/**
 * Объект, содержащий слой idef0.
 */
var idef0 = null
/**
 * Объект, содержащий слой uml usecase.
 */
var uml = null
/**
 * Объект, содержащий кнопку отображения слоя idef0.
 */
var idef0Button = null
/**
 * Объект, содержащий кнопку отображения слоя uml usecase.
 */
var umlButton = null

/**
 * Функция: showGraph(event).
 * 
 * Главная функция, которая вызывается из HTML 5 FileApi.
 * В функции происходит загрузка и проверка JSON файла
 * и вызов функции отрисовки диаграммы.
 * 
 * Параметры:
 * 
 * event - событие выбора файла.
 */
function showGraph(event) {
    var loader = document.getElementById('loader')
    loader.style.display = ""
    var file = event.target.files[0]
    var promise = loadJson(file)
    promise.then(
        result => {
        var valid = validateUsecase(result)
        loader.style.display = "none"
        if(valid) {
            drawGraph(result)
        }
        else {
            showError("JSON не соотвествует формату Usecase")
        }
    },
    error => {
        loader.style.display = "none"
        showError(error)
    }
    );
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
function showError(message) {
    var preview = document.getElementById('preview');
    var resultText = document.getElementById('resultText');
    preview.style.display = "none";
    resultText.style.display = "";
    resultText.innerText = message;
}

/**
 * Функция: drawGraph(graphContainer, usecase).
 * 
 * Функция отрисовки диаграммы.
 * В функции происходит создание диаграммы и отрисовка ее компонентов.
 * 
 * Параметры:
 * 
 * usecase - js-объект диграммы.
 */
function drawGraph(usecase) {
    var container = document.getElementById('graphContainer');
    var preview = document.getElementById('preview');
    var title = document.getElementById('title');
    preview.style.display = "";
    resultText.style.display = "none";
    title.innerText = usecase.package;
    clearGraph(container);
    createGraph(container);
    drawIDEFDiagram(usecase, idef0);
    drawUseCase(usecase, uml);
}

/**
 * Функция: createGraph(container).
 * 
 * Функция создания диаграммы.
 * В функции происходит создание новой диаграммы с необходимыми настройками и стилями,
 * а также кнопок переключения между слоями диаграммы.
 * 
 * Параметры:
 * 
 * container - div-контейнер для диаграммы.
 */
function createGraph(container) {
    idef0Button = graphContainer.appendChild(mxUtils.button('IDEF0', function()
	{
        model.setVisible(idef0, true);
        model.setVisible(uml, false);
	}))			
    umlButton = graphContainer.appendChild(mxUtils.button('UML USECASE', function()
	{
        model.setVisible(idef0, false);
        model.setVisible(uml, true);
    }))
    var root = new mxCell();
	idef0 = root.insert(new mxCell());
    uml = root.insert(new mxCell());
    model = new mxGraphModel(root);
    graph = new mxGraph(container, model);
    graph.setCellsSelectable(false);
    graph.setCellsLocked(true);
    graph.isCellFoldable = function(cell)
	{
	    return false;
    };
    model.setVisible(idef0, true);
    model.setVisible(uml, false);
}

/**
 * Функция: clearGraph(container).
 * 
 * Функция очистки контейнера диаграммы.
 * В функции происходит удаление предыдущей диаграаммы (если существует),
 * а также кнопок переключения между слоями диаграммы.
 * 
 * Параметры:
 * 
 * container - div-контейнер для диаграммы.
 */
function clearGraph(container) {
    if(graph != null) {
        graph.destroy();
    }
    if(idef0Button != null) {
        container.removeChild(idef0Button);
    }
    if(umlButton != null) {
        container.removeChild(umlButton);
    }
}

function drawIDEFDiagram(data, layer) {
    drawA0(data, layer);
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
function drawA0(data, layer) {
    var width = graph.container.offsetWidth;
    var height = graph.container.offsetHeight-20;
    var a0 = data.activities[0];
    var control = data.control;
    var input = data.input;
    var output = data.output;
    var bootomConnections = [];
    bootomConnections.push(data.mechanism);
    bootomConnections.push(data.person);
    var factory = new IDEFShapeFactory(graph, layer, 1);
    model.beginUpdate();
    try
    {
        var box = drawBox(factory, width/2, height/2, a0);
        drawBoxArrows(factory, width/2, height/2, box, TOP, control);
        drawBoxArrows(factory, width/2, height/2, box, BOTTOM, bootomConnections);
        drawBoxArrows(factory, width/2, height/2, box, LEFT, input);
        drawBoxArrows(factory, width/2, height/2, box, RIGHT, output);
    }
    finally
    {
    model.endUpdate();
    }
}

function drawBox(factory, x, y, activity) {
    return factory.drawBox(activity.value, activity.id, x, y);
}

function drawBoxArrows(factory, x, y, box, side, connections) {
    var step = 1 / connections.length;
    var position = step/2;
    var corner = factory.createCorner(side, x, y);
    for(var i in connections){
        var connection = connections[i];
        var cornerConnector = factory.createConnector(corner, side, position);
        var boxConnector = factory.createConnector(box, side, position);
        if(side == RIGHT){
            factory.drawSolidLine(connection.value, boxConnector, cornerConnector);
        }
        else{
            factory.drawSolidLine(connection.value, cornerConnector, boxConnector);
        }
        position = position + step;
    }
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
function drawUseCase(data, layer) {
    var width = graph.container.offsetWidth;
    var height = graph.container.offsetHeight-20;
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
    var factory = new UMLShapeFactory(graph, layer, maxActorsCount, maxActivitiesCount);
    model.beginUpdate();
    try{
        drawSubject(factory, width, height, subject);
        var usecasesShapes = drawUseCases(factory, width, height, activities);
        var personShape = drawParentActor(factory, height, personPosition, person);
        var mechanismShape = drawParentActor(factory, height, mechanismPosition, mechanism);
        drawChildActors(factory, height, personActorsPosition, personShape, person.actors, usecasesShapes);
        drawChildActors(factory, height, mechanismActorsPosition, mechanismShape, mechanism.actors, usecasesShapes);
    }
    finally
    {
        model.endUpdate();
    }
}

function drawSubject(factory, width, height, activity) {
    return factory.drawSubject(activity.value, width/2-width*0.15, 10, width*0.3, height-20);
}

function drawUseCases(factory, width, height, activities) {
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

function drawParentActor(factory, height, horisontalPosition, actor) {
    return factory.drawActor(actor.value, horisontalPosition, height/2);
}

function drawChildActors(factory, height, horisontalPosition, parent, actors, usecases) {
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