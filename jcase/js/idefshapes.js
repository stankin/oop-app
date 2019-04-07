
const TOP = 'top';

const BOTTOM = 'bottom';

const LEFT = 'left';

const RIGHT = 'right';

var IDEFShapes = {

    Box : function(graph, layer, name, index, x, y, width, height, fontSize) {
        var style = 'fontSize='+fontSize + 
        ';fillColor=#FFFFFF;strokeColor=#000000;fontColor=#000000;fontStyle=1';
        var box = graph.insertVertex(layer, null, name, x-width/2, y-height/2, width, height, style);
        var index = graph.insertVertex(box, null, 'A' + index, 0.95, 0.95, 0, 0, style, true);
        return box;
    },

    Corner : function(graph, layer, width, height, side, boxX, boxY, boxWidth, boxHeight) {
        switch (side) {
            case TOP:
              return graph.insertVertex(layer, null, null, boxX-boxWidth/2, 0, boxWidth, 0);
            case BOTTOM:
              return graph.insertVertex(layer, null, null, boxX-boxWidth/2, height, boxWidth, 0);
            case LEFT:
              return graph.insertVertex(layer, null, null, 0, boxY-boxHeight/2, 0, boxHeight);
            case RIGHT:
              return graph.insertVertex(layer, null, null, width, boxY-boxHeight/2, 0, boxHeight);
        }
    },

    Connector : function(graph, box, side, position) {
        switch (side) {
            case TOP:
              return graph.insertVertex(box, null, '', position, 0, 0, 0, null, true);
            case BOTTOM:
              return graph.insertVertex(box, null, '', position, 1, 0, 0, null, true);
            case LEFT:
              return graph.insertVertex(box, null, '', 0, position, 0, 0, null, true);
            case RIGHT:
              return graph.insertVertex(box, null, '', 1, position, 0, 0, null, true);
        }
    },

    SolidLine : function(graph, layer, name, startConnector, endConnector) {
        var style = 'strokeColor=#000000;fontColor=#000000;fontStyle=0;' +  
        'startArrow=dash;startSize=12;endArrow=block;align=right;labelBackgroundColor=#FFFFFF;'
        return graph.insertEdge(layer, null, name, startConnector, endConnector, style);
    }

}

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

IDEFShapeFactory.prototype =
{
    constructor: IDEFShapeFactory,

    drawBox: function (name, index, x, y) { 
        return new IDEFShapes.Box(graph, this.layer, name, index, x, y, 
            this.boxWidth, this.boxHeight, this.BoxFontSize);
    },

    createCorner: function (side, boxX, boxY) { 
        return new IDEFShapes.Corner(graph, this.layer, this.width, this.height, 
            side, boxX, boxY, this.boxWidth, this.boxHeight);
    },

    createConnector: function (box, side, position) { 
        return new IDEFShapes.Connector(graph, box, side, position);
    },

    drawSolidLine: function (name, startConnector, endConnector) { 
        return new IDEFShapes.SolidLine(graph, this.layer, name, startConnector, endConnector);
    }

}