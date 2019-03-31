/**
 * Модуль отрисовки - отрисовывает в div контейнере диаграмму по загруженному файлу.
 */

/**
 * Объект, содержащий текущую диаграмму.
 */
var graph = null

/**
 * Функция: showGraph(event)
 * 
 * Главная функция, которая вызывается из HTML 5 FileApi
 * В функции происходит загрузка и проверка JSON файла
 * и вызов функции отрисовки диаграммы
 * 
 * Параметры:
 * 
 * event - событие выбора файла
 */
function showGraph(event) {
    var preview = document.getElementById('preview')
    var title = document.getElementById('title')
    var graphContainer = document.getElementById('graphContainer')
    var loader = document.getElementById('loader')
    var promise = loadJson(event)
    promise.then(
        result => {
        preview.style.display = ""
        drawGraph(graphContainer, result)
    },
    error => {
        alert(error)
        preview.style.display = "none"
    }
    );
}

/**
 * Функция: drawGraph(graphContainer, usecase)
 * 
 * Функция отрисовки диаграммы
 * В функции происходит создание диаграммы и отрисовка ее компонентов
 * 
 * Параметры:
 * 
 * container - div-контейнер для диаграммы
 * usecase - js-объект диграммы
 */
function drawGraph(container, usecase) {
    createGraph(container)
    drawFirstLevel(usecase)
}

/**
 * Функция: createGraph(container)
 * 
 * Функция создания диаграммы
 * В функции происходит удаление предыдущей диаграаммы (если существует)
 * и создание новой диаграммы с необходимыми стилями
 * 
 * Параметры:
 * 
 * container - div-контейнер для диаграммы
 */
function createGraph(container) {
    if(graph != null) {
        graph.destroy()
    }
    graph = new mxGraph(container)
    graph.setCellsSelectable(false)
    graph.setCellsLocked(true)
    graph.isCellFoldable = function(cell)
	{
	    return false;
	};
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
 * Функция: drawFirstLevel(usecase)
 * 
 * Функция отрисовки первого уровня диаграммы
 * В функции происходит отрисовка объектов первого уровня: блока A0 и связей
 * 
 * Параметры:
 * 
 * usecase - js-объект диграммы
 */
function drawFirstLevel(usecase) {
    var parent = graph.getDefaultParent();
    var width = graph.container.offsetWidth
    var height = graph.container.offsetHeight
    graph.getModel().beginUpdate();
    try
    {
        var a0 = graph.insertVertex(parent, null, usecase.blocks[0].name, (width/10)*3, (height/10)*3, (width/10)*4, (height/10)*4);
        var index = graph.insertVertex(a0, null, usecase.blocks[0].index, 0.95, 0.95, 0, 0, null, true)
        var upConnector = graph.insertVertex(parent, null, null, (width/10)*3, 0, (width/10)*4, 0)
        var downConnector = graph.insertVertex(parent, null, null, (width/10)*3, height, (width/10)*4, 0)
        var leftConnector = graph.insertVertex(parent, null, null, 0, (height/10)*3, 0, (height/10)*4)
        var rightConnector = graph.insertVertex(parent, null, null, width, (height/10)*3, 0, (height/10)*4)
        var up = usecase.blocks[0].up
        var down = usecase.blocks[0].down
        var left = usecase.blocks[0].left
        var right = usecase.blocks[0].right
        var step = 1 / up.length
        var position = step/2
        for(var i in up){
            var connection = up[i]
            var startPoint = graph.insertVertex(upConnector, null, '', position, 0, 0, 0, null, true);
            var endPoint = graph.insertVertex(a0, null, '', position, 0, 0, 0, null, true);
            var edge = graph.insertEdge(parent, null, connection.name, startPoint, endPoint,
                        'startArrow=dash;startSize=12;endArrow=block;align=right;labelBackgroundColor=#FFFFFF;');
            position = position + step
        }
        step = 1 / down.length
        position = step/2
        for(var i in down){
            var connection = down[i]
            var startPoint = graph.insertVertex(downConnector, null, '', position, 0, 0, 0, null, true);
            var endPoint = graph.insertVertex(a0, null, '', position, 1, 0, 0, null, true);
            var edge = graph.insertEdge(parent, null, connection.name, startPoint, endPoint,
                        'startArrow=dash;startSize=12;endArrow=block;align=right;labelBackgroundColor=#FFFFFF;');
            position = position + step
        }
        step = 1 / left.length
        position = step/2
        for(var i in left){
            var connection = left[i]
            var startPoint = graph.insertVertex(leftConnector, null, '', 0, position, 0, 0, null, true);
            var endPoint = graph.insertVertex(a0, null, '', 0, position, 0, 0, null, true);
            var edge = graph.insertEdge(parent, null, connection.name, startPoint, endPoint,
                        'startArrow=dash;startSize=12;endArrow=block;align=top;labelBackgroundColor=#FFFFFF;');
            position = position + step
        }
        step = 1 / right.length
        position = step/2
        for(var i in right){
            var connection = right[i]
            var endPoint = graph.insertVertex(rightConnector, null, '', 1, position, 0, 0, null, true);
            var startPoint = graph.insertVertex(a0, null, '', 1, position, 0, 0, null, true);
            var edge = graph.insertEdge(parent, null, connection.name, startPoint, endPoint,
                        'startArrow=dash;startSize=12;endArrow=block;align=top;labelBackgroundColor=#FFFFFF;');
            position = position + step
        }
    }
    finally
    {
    graph.getModel().endUpdate();
    }
}