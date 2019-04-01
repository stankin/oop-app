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
    var preview = document.getElementById('preview')
    var resultText = document.getElementById('resultText')
    preview.style.display = "none"
    resultText.style.display = ""
    resultText.innerText = message
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
    var container = document.getElementById('graphContainer')
    var preview = document.getElementById('preview')
    var title = document.getElementById('title')
    preview.style.display = ""
    resultText.style.display = "none"
    title.innerText = usecase.package
    clearGraph(container)
    createGraph(container)
    drawA0(usecase, idef0)
    drawUseCase(usecase, uml)
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
    graph.setCellsSelectable(false)
    graph.setCellsLocked(true)
    graph.isCellFoldable = function(cell)
	{
	    return false;
    };
    model.setVisible(idef0, true);
    model.setVisible(uml, false);
    var style = graph.getStylesheet().getDefaultVertexStyle();
	style['fillColor'] = '#FFFFFF';
	style['strokeColor'] = '#000000';
	style['fontColor'] = '#000000';
    style['fontStyle'] = '1';
    style['fontSize'] = '16';	
	style = graph.getStylesheet().getDefaultEdgeStyle();
	style['strokeColor'] = '#000000';
	style['fontColor'] = '#000000';
	style['fontStyle'] = '0';
	style['fontStyle'] = '0';
	style['startSize'] = '8';
    style['endSize'] = '8';
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
        graph.destroy()
    }
    if(idef0Button != null) {
        container.removeChild(idef0Button)
    }
    if(umlButton != null) {
        container.removeChild(umlButton)
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
function drawA0(usecase, parent) {
    var width = graph.container.offsetWidth
    var height = graph.container.offsetHeight-20
    model.beginUpdate();
    try
    {
        var a0 = graph.insertVertex(parent, null, usecase.activities[0].value, (width/10)*3, (height/10)*3, (width/10)*4, (height/10)*4);
        var index = graph.insertVertex(a0, null, 'A' + usecase.activities[0].id, 0.95, 0.95, 0, 0, null, true)
        var upConnector = graph.insertVertex(parent, null, null, (width/10)*3, 0, (width/10)*4, 0)
        var downConnector = graph.insertVertex(parent, null, null, (width/10)*3, height, (width/10)*4, 0)
        var leftConnector = graph.insertVertex(parent, null, null, 0, (height/10)*3, 0, (height/10)*4)
        var rightConnector = graph.insertVertex(parent, null, null, width, (height/10)*3, 0, (height/10)*4)
        var control = usecase.control
        var input = usecase.input
        var output = usecase.output
        var step = 1 / control.length
        var position = step/2
        for(var i in control){
            var connection = control[i]
            var startPoint = graph.insertVertex(upConnector, null, '', position, 0, 0, 0, null, true);
            var endPoint = graph.insertVertex(a0, null, '', position, 0, 0, 0, null, true);
            var edge = graph.insertEdge(parent, null, connection.value, startPoint, endPoint,
                        'startArrow=dash;startSize=12;endArrow=block;align=right;labelBackgroundColor=#FFFFFF;');
            position = position + step
        }
        step = 1 / input.length
        position = step/2
        for(var i in input){
            var connection = input[i]
            var startPoint = graph.insertVertex(leftConnector, null, '', 0, position, 0, 0, null, true);
            var endPoint = graph.insertVertex(a0, null, '', 0, position, 0, 0, null, true);
            var edge = graph.insertEdge(parent, null, connection.value, startPoint, endPoint,
                        'startArrow=dash;startSize=12;endArrow=block;align=top;labelBackgroundColor=#FFFFFF;');
            position = position + step
        }
        step = 1 / output.length
        position = step/2
        for(var i in output){
            var connection = output[i]
            var endPoint = graph.insertVertex(rightConnector, null, '', 1, position, 0, 0, null, true);
            var startPoint = graph.insertVertex(a0, null, '', 1, position, 0, 0, null, true);
            var edge = graph.insertEdge(parent, null, connection.value, startPoint, endPoint,
                        'startArrow=dash;startSize=12;endArrow=block;align=top;labelBackgroundColor=#FFFFFF;');
            position = position + step
        }
        var mechanism = usecase.mechanism
        var person = usecase.person
        var startPoint = graph.insertVertex(downConnector, null, '', 0.25, 0, 0, 0, null, true);
        var endPoint = graph.insertVertex(a0, null, '', 0.25, 1, 0, 0, null, true);
        graph.insertEdge(parent, null, person.value, startPoint, endPoint,
                    'startArrow=dash;startSize=12;endArrow=block;align=right;labelBackgroundColor=#FFFFFF;');
        startPoint = graph.insertVertex(downConnector, null, '', 0.75, 0, 0, 0, null, true);
        endPoint = graph.insertVertex(a0, null, '', 0.75, 1, 0, 0, null, true);
        graph.insertEdge(parent, null, mechanism.value, startPoint, endPoint,
                    'startArrow=dash;startSize=12;endArrow=block;align=right;labelBackgroundColor=#FFFFFF;');
    }
    finally
    {
    model.endUpdate();
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
function drawUseCase(usecase, parent) {
    var width = graph.container.offsetWidth
    var height = graph.container.offsetHeight-20
    var personPosition = (width/10)*0.75
    var mechanismPosition = (width/10)*9.25
    var personActorsPosition = (width/10)*2.5
    var mechanismActorsPosition = (width/10)*7.5
    var activitiesPosition = width/2
    model.beginUpdate();
    try{
        var mechanism = usecase.mechanism
        var person = usecase.person
        var activities = usecase.activities
        var maxActorsCount = Math.max(mechanism.actors.length, person.actors.length)
        var actorSize = Math.min((height/maxActorsCount)/2.5, height/8)
        var activitiesCount = activities.length - 1
        var activitySize = Math.min((height/activitiesCount)/2.5, height/8)
        var actorFontSize = actorSize/8
        var activityFontSize = activitySize/8
        var packageNameFontSize = activitySize/7
        var actorStyle = 'fontSize='+actorFontSize+';shape=image;image=images/actor.svg;verticalLabelPosition=bottom;verticalAlign=top'
        var activityStyle = 'fontSize='+activityFontSize+';shape=ellipse;perimeter=ellipsePerimeter'
        var package = graph.insertVertex(parent, null, null, width/2-width*0.15, 10, width*0.3, height-20);
        var packageName = graph.insertVertex(package, null, usecase.activities[0].value, 0.5, 0.01, 0, 0, 'fontSize='+packageNameFontSize, true)
        var a = []
        var step = 1 / activitiesCount
        var position = step/2
        for(var i = 1; i < activities.length; i++){
            var activity = activities[i]
            var activityShape = graph.insertVertex(parent, null, activity.value, activitiesPosition-activitySize, (height * position)-activitySize/2, activitySize*2, activitySize, activityStyle);
            a.push(activityShape)
            position = position + step
        }
        var p0 = graph.insertVertex(parent, null, person.value, personPosition-actorSize/2, height/2-actorSize/2, actorSize, actorSize, actorStyle);
        var m0 = graph.insertVertex(parent, null, mechanism.value, mechanismPosition-actorSize/2, height/2-actorSize/2, actorSize, actorSize, actorStyle);
        var step = 1 / (person.actors.length + 1)
        var position = step
        for(var i in person.actors){
            var actor = person.actors[i]
            var p = graph.insertVertex(parent, null, actor.value, personActorsPosition-actorSize/2, (height * position)-actorSize/2, actorSize, actorSize, actorStyle);
            graph.insertEdge(parent, null, null, p, p0, 'startArrow=dash;endArrow=block');
            position = position + step
            for(var j in actor.activities){
                var activityNumber = actor.activities[j]
                var activityShape = a[activityNumber-1]
                graph.insertEdge(parent, null, null, p, activityShape, 'startArrow=dash;endArrow=dash');
            }
        }
        var step = 1 / (mechanism.actors.length + 1)
        var position = step
        for(var i in mechanism.actors){
            var actor = mechanism.actors[i]
            var m = graph.insertVertex(parent, null, actor.value, mechanismActorsPosition-actorSize/2, (height * position)-actorSize/2, actorSize, actorSize, actorStyle);
            graph.insertEdge(parent, null, null, m, m0, 'startArrow=dash;endArrow=block');
            position = position + step
            for(var j in actor.activities){
                var activityNumber = actor.activities[j]
                var activityShape = a[activityNumber-1]
                graph.insertEdge(parent, null, null, m, activityShape, 'startArrow=dash;endArrow=dash');
            }
        }
    }
    finally
    {
        model.endUpdate();
    }
}