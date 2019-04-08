/** 
 * Массив форм для фабрики диаграммы IDEF0
 * @namespace
 */
var IDEFShapes = {

    /**
    * Блок диаграммы
    * @constructor
    * @param {mxGraph} graph - объект диаграммы
    * @param {mxCell} layer - слой диаграммы
    * @param {string} name - название блока
    * @param {number} index - индекс блока
    * @param {number} x - расположение по оси x
    * @param {number} y - расположение по оси y
    * @param {number} width - ширина
    * @param {number} height - высота
    * @param {number} fontSize - размер шрифта
    * @returns {IDEFShapes.Box} блок диаграммы
    */
    Box : function(graph, layer, name, index, x, y, width, height, fontSize) {
        var style = 'fontSize='+fontSize + 
        ';fillColor=#FFFFFF;strokeColor=#000000;fontColor=#000000;fontStyle=1';
        var box = graph.insertVertex(layer, null, name, x-width/2, y-height/2, width, height, style);
        var index = graph.insertVertex(box, null, 'A' + index, 0.95, 0.95, 0, 0, style, true);
        return box;
    },

    /**
    * Угол диграммы для создания стрелок, ведущих к блоку
    * @constructor
    * @param {mxGraph} graph - объект диаграммы
    * @param {mxCell} layer - слой диаграммы
    * @param {number} width - ширина диаграммы
    * @param {number} height - высота диаграммы
    * @param {string} side - сторона блока
    * @param {number} boxX - расположение блока по оси x
    * @param {number} boxY - расположение блока по оси y
    * @param {number} boxWidth - ширина блока
    * @param {number} boxHeight - высота блока
    * @returns {IDEFShapes.Corner} угол диаграммы
    */
    Corner : function(graph, layer, width, height, side, boxX, boxY, boxWidth, boxHeight) {
        switch (side) {
            case Side.TOP:
              return graph.insertVertex(layer, null, null, boxX-boxWidth/2, 0, boxWidth, 0);
            case Side.BOTTOM:
              return graph.insertVertex(layer, null, null, boxX-boxWidth/2, height, boxWidth, 0);
            case Side.LEFT:
              return graph.insertVertex(layer, null, null, 0, boxY-boxHeight/2, 0, boxHeight);
            case Side.RIGHT:
              return graph.insertVertex(layer, null, null, width, boxY-boxHeight/2, 0, boxHeight);
        }
    },

    /**
    * Точка соединения для стрелки
    * @constructor
    * @param {mxGraph} graph - объект диаграммы
    * @param {IDEFShapes.Box} box - блок диаграммы
    * @param {string} side - сторона соединения
    * @param {number} position - локальная координата расположения точки соединения
    * @returns {IDEFShapes.Connector} точка соединения для стрелки
    */
    Connector : function(graph, box, side, position) {
        switch (side) {
            case Side.TOP:
              return graph.insertVertex(box, null, '', position, 0, 0, 0, null, true);
            case Side.BOTTOM:
              return graph.insertVertex(box, null, '', position, 1, 0, 0, null, true);
            case Side.LEFT:
              return graph.insertVertex(box, null, '', 0, position, 0, 0, null, true);
            case Side.RIGHT:
              return graph.insertVertex(box, null, '', 1, position, 0, 0, null, true);
        }
    },

    /**
    * Сплошная стрелка
    * @constructor
    * @param {mxGraph} graph - объект диаграммы
    * @param {mxCell} layer - слой диаграммы
    * @param {string} name - название стрелки
    * @param {mxCell} startConnector - начальная точка соединения
    * @param {mxCell} endConnector - конечная точка соединения
    * @returns {IDEFShapes.SolidLine} сплошная стрелка
    */
    SolidLine : function(graph, layer, name, startConnector, endConnector) {
        var style = 'strokeColor=#000000;fontColor=#000000;fontStyle=0;' +  
        'startArrow=dash;startSize=12;endArrow=block;align=right;labelBackgroundColor=#FFFFFF;'
        return graph.insertEdge(layer, null, name, startConnector, endConnector, style);
    }

}

/**
 * Фабрика форм для диаграммы IDEF0
 * @constructor
 * @param {mxGraph} graph - класс диаграммы
 * @param {mxCell} layer - слой диаграммы
 * @param {number} boxesCount - количество блоков на данном уровне
 */
function IDEFShapeFactory(graph, layer, boxesCount)
{
    this.width = graph.container.offsetWidth;
    this.height = graph.container.offsetHeight-20;
    this.graph = graph;
    this.layer = layer;
    this.boxWidth = this.width/2.5/boxesCount;
    this.boxHeight = this.height/2.5/boxesCount; 
    this.BoxFontSize = this.boxWidth/25;
}

/**
 * Прототип фабрики форм для диаграммы IDEF0
 */
IDEFShapeFactory.prototype =
{
    /**
    * Конструктор фабрики
    */
    constructor: IDEFShapeFactory,

    /**
    * Функция создания блока диаграммы
    * @param {string} name - название блока
    * @param {number} index - индекс блока
    * @param {number} x - расположение по оси x
    * @param {number} y - расположение по оси y 
    * @returns {IDEFShapes.Box} блок диаграммы
    */
    drawBox: function (name, index, x, y) { 
        return new IDEFShapes.Box(this.graph, this.layer, name, index, x, y, 
            this.boxWidth, this.boxHeight, this.BoxFontSize);
    },

    /**
    * Функция создания угла диаграммы для блока
    * @param {string} side - сторона блока
    * @param {number} boxX - расположение блока по оси x
    * @param {number} boxY - расположение блока по оси y
    * @returns {IDEFShapes.Corner} угол диаграммы
    */
    createCorner: function (side, boxX, boxY) { 
        return new IDEFShapes.Corner(this.graph, this.layer, this.width, this.height, 
            side, boxX, boxY, this.boxWidth, this.boxHeight);
    },

    /**
    * Функция создания точки соединения для стрелки
    * @param {IDEFShapes.Box} box - блок диаграммы
    * @param {string} side - сторона соединения
    * @param {number} position - локальная координата расположения точки соединения
    * @returns {IDEFShapes.Connector} точка соединения для стрелки
    */
    createConnector: function (box, side, position) { 
        return new IDEFShapes.Connector(this.graph, box, side, position);
    },

    /**
    * Функция создания сплошной стрелки
    * @param {string} name - название стрелки
    * @param {mxCell} startConnector - начальная точка соединения
    * @param {mxCell} endConnector - конечная точка соединения
    * @returns {IDEFShapes.SolidLine} сплошная стрелка
    */
    drawSolidLine: function (name, startConnector, endConnector) { 
        return new IDEFShapes.SolidLine(this.graph, this.layer, name, startConnector, endConnector);
    }

}