
var defaultVertexStyle = 'fillColor=#FFFFFF;strokeColor=#000000;fontColor=#000000;fontStyle=1;'
var defaultEdgeStyle = 'strokeColor=#000000;fontColor=#000000;fontStyle=0;'

/** @namespace UMLShapes */
var UMLShapes = {

    Actor : function (graph, layer, name, x, y, size, fontSize) {
        var style = defaultVertexStyle + 'fontSize=' + fontSize +
        ';shape=image;image=images/actor.svg;verticalLabelPosition=bottom;verticalAlign=top';
        return graph.insertVertex(layer, null, name, x-size/2, y-size/2, size, size, style);
    },

    /**
    * Test child object with child namespace
    * @memberof UMLShapes
    * @type {object}
    * @constructor
    */
    UseCase : function (graph, layer, name, x, y, size, fontSize) {
        var style = defaultVertexStyle + 'fontSize=' + fontSize + 
        ';shape=ellipse;perimeter=ellipsePerimeter';
        return graph.insertVertex(layer, null, name, x-size, y-size/2, size*2, size, style);
    },

    Subject : function (graph, layer, name, x, y, width, height, fontSize) {
        var style = defaultVertexStyle + 'fontSize=' + fontSize;
        var subject = graph.insertVertex(layer, null, null, x, y, width, height, style);
        graph.insertVertex(subject, null, name, 0.5, 0.01, 0, 0, style, true);
        return subject;
    },

    Generalization : function (graph, layer, parent, child) {
        var style = defaultEdgeStyle + 'startArrow=dash;endArrow=block;endFill=0';
        return graph.insertEdge(layer, null, null, child, parent, style);
    },

    Association : function (graph, layer, actor, usecase) {
        var style = defaultEdgeStyle + 'startArrow=dash;endArrow=dash';
        return graph.insertEdge(layer, null, null, actor, usecase, style);
    }

}


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

UMLShapeFactory.prototype =
{
    constructor: UMLShapeFactory,

    drawActor: function (name, x, y) { 
        return new UMLShapes.Actor(this.graph, this.layer, name, x, y, this.actorSize, this.actorFontSize);
    },

    drawUseCase: function (name, x, y) { 
        return new UMLShapes.UseCase(this.graph, this.layer, name, x, y, this.useCaseSize, this.useCaseFontSize);
    },

    drawSubject: function (name, x, y, width, height) { 
        return new UMLShapes.Subject(this.graph, this.layer, name, x, y, width, height, this.subjectFontSize);
    },

    drawGeneralization: function (parent, child) { 
        return new UMLShapes.Generalization(this.graph, this.layer, parent, child);
    },

    drawAssociation: function (actor, usecase) { 
        return new UMLShapes.Association(this.graph, this.layer, actor, usecase);
    }
}