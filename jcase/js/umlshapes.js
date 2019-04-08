/** 
 * Стандартные стили для форм
 * @type {string}
*/
var defaultVertexStyle = 'fillColor=#FFFFFF;strokeColor=#000000;fontColor=#000000;fontStyle=1;'

/** 
 * Стандартные стили для стрелок
 * @type {string}
*/
var defaultEdgeStyle = 'strokeColor=#000000;fontColor=#000000;fontStyle=0;'

/** 
 * Формы для фабрики диаграммы Uml UseCase
 * @namespace UMLShapes
*/
var UMLShapes = {

    /**
    * Актер
    * @constructor
    * @param {mxGraph} graph - объект диаграммы
    * @param {mxCell} layer - слой диаграммы
    * @param {string} name - название актера
    * @param {number} x - расположение по оси x
    * @param {number} y - расположение по оси y
    * @param {number} size - размер актера
    * @param {number} fontSize - размер шрифта
    * @returns {UMLShapes.Actor} актер
    */
    Actor : function (graph, layer, name, x, y, size, fontSize) {
        var style = defaultVertexStyle + 'fontSize=' + fontSize +
        ';shape=image;image=images/actor.svg;verticalLabelPosition=bottom;verticalAlign=top';
        return graph.insertVertex(layer, null, name, x-size/2, y-size/2, size, size, style);
    },

    /**
    * Прецедент
    * @constructor
    * @param {mxGraph} graph - объект диаграммы
    * @param {mxCell} layer - слой диаграммы
    * @param {string} name - название прецедента
    * @param {number} x - расположение по оси x
    * @param {number} y - расположение по оси y
    * @param {number} size - размер прецедента
    * @param {number} fontSize - размер шрифта
    * @returns {UMLShapes.UseCase} прецедент
    */
    UseCase : function (graph, layer, name, x, y, size, fontSize) {
        var style = defaultVertexStyle + 'fontSize=' + fontSize + 
        ';shape=ellipse;perimeter=ellipsePerimeter';
        return graph.insertVertex(layer, null, name, x-size, y-size/2, size*2, size, style);
    },

    /**
    * Субъект
    * @constructor
    * @param {mxGraph} graph - объект диаграммы
    * @param {mxCell} layer - слой диаграммы
    * @param {string} name - название субъекта
    * @param {number} x - расположение по оси x
    * @param {number} y - расположение по оси y
    * @param {number} width - ширина субъекта
    * @param {number} height - высота субъекта
    * @param {number} fontSize - размер шрифта
    * @returns {UMLShapes.Subject} субъект
    */
    Subject : function (graph, layer, name, x, y, width, height, fontSize) {
        var style = defaultVertexStyle + 'fontSize=' + fontSize;
        var subject = graph.insertVertex(layer, null, null, x, y, width, height, style);
        graph.insertVertex(subject, null, name, 0.5, 0.01, 0, 0, style, true);
        return subject;
    },

    /**
    * Стрелка обобщения
    * @constructor
    * @param {mxGraph} graph - объект диаграммы
    * @param {mxCell} layer - слой диаграммы
    * @param {UMLShapes.Actor} parent - родительский актер
    * @param {UMLShapes.Actor} child - дочерний актер
    * @returns {UMLShapes.Generalization} стрелка обобщения
    */
    Generalization : function (graph, layer, parent, child) {
        var style = defaultEdgeStyle + 'startArrow=dash;endArrow=block;endFill=0';
        return graph.insertEdge(layer, null, null, child, parent, style);
    },

    /**
    * Стрелка ассоциации
    * @constructor
    * @param {mxGraph} graph - объект диаграммы
    * @param {mxCell} layer - слой диаграммы
    * @param {UMLShapes.Actor} actor - актер
    * @param {UMLShapes.UseCase} usecase - прецедент
    * @returns {UMLShapes.Association} стрелка ассоциации
    */
    Association : function (graph, layer, actor, usecase) {
        var style = defaultEdgeStyle + 'startArrow=dash;endArrow=dash';
        return graph.insertEdge(layer, null, null, actor, usecase, style);
    }

}

/**
 * Фабрика форм для диаграммы Uml UseCase
 * @constructor
 * @param {mxGraph} graph - объект диаграммы
 * @param {mxCell} layer - слой диаграммы
 * @param {number} maxActorsCount - максимальное количество актеров
 * @param {number} maxUseCasesCount - максимальное количество прецедентов
 */
function UMLShapeFactory(graph, layer, maxActorsCount, maxUseCasesCount)
{
    var height = graph.container.offsetHeight-20;
    this.graph = graph;
    this.layer = layer;
    this.actorSize = Math.min((height/maxActorsCount)/2.5, height/8);
    this.useCaseSize = Math.min((height/maxUseCasesCount)/2.5, height/8);
    this.actorFontSize = this.actorSize/8;
    this.useCaseFontSize = this.useCaseSize/8;
    this.subjectFontSize = this.useCaseSize/7;
}

/**
 * Прототип фабрики форм для диаграммы Uml UseCase
 */
UMLShapeFactory.prototype =
{
    /**
    * Конструктор фабрики
    */
    constructor: UMLShapeFactory,

    /**
    * Функция создания актера
    * @param {string} name - название актера
    * @param {number} x - расположение по оси x
    * @param {number} y - расположение по оси y
    * @returns {UMLShapes.Actor} актер
    */
    drawActor: function (name, x, y) { 
        return new UMLShapes.Actor(this.graph, this.layer, name, x, y, this.actorSize, this.actorFontSize);
    },

    /**
    * Функция создания прецедента
    * @param {string} name - название прецедента
    * @param {number} x - расположение по оси x
    * @param {number} y - расположение по оси y
    * @returns {UMLShapes.UseCase} прецедент
    */
    drawUseCase: function (name, x, y) { 
        return new UMLShapes.UseCase(this.graph, this.layer, name, x, y, this.useCaseSize, this.useCaseFontSize);
    },

    /**
    * Функция создания субъекта
    * @param {string} name - название субъекта
    * @param {number} x - расположение по оси x
    * @param {number} y - расположение по оси y
    * @param {number} width - ширина субъекта
    * @param {number} height - высота субъекта
    * @returns {UMLShapes.Subject} субъект
    */
    drawSubject: function (name, x, y, width, height) { 
        return new UMLShapes.Subject(this.graph, this.layer, name, x, y, width, height, this.subjectFontSize);
    },

    /**
    * Функция создания стрелки обобщения
    * @param {UMLShapes.Actor} parent - родительский актер
    * @param {UMLShapes.Actor} child - дочерний актер
    * @returns {UMLShapes.Generalization} стрелка обобщения
    */
    drawGeneralization: function (parent, child) { 
        return new UMLShapes.Generalization(this.graph, this.layer, parent, child);
    },

    /**
    * Функция создания стрелки ассоциации
    * @param {UMLShapes.Actor} actor - актер
    * @param {UMLShapes.UseCase} usecase - прецедент
    * @returns {UMLShapes.Association} стрелка ассоциации
    */
    drawAssociation: function (actor, usecase) { 
        return new UMLShapes.Association(this.graph, this.layer, actor, usecase);
    }
}