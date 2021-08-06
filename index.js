const express = require('express')
const { v4: uuidv4 } = require('uuid');
var DOMParser = require('xmldom').DOMParser;

const app = express()
const port = 3000

var fs = require('fs');

app.get('/', (req, res) => {
    var file = fs.readFileSync('./fileOut.xml', {encoding: 'utf-8'});
    convert(file, 'TaskNodeData', 'phase', 'phase', res);
    convert(file, 'ActionPhaseNodeData', 'phase', 'phase', res);
    convert(file, 'ApprovalDecisionNodeData', 'decision', 'decision', res);
    convert(file, 'StartNodeData', 'start', 'start', res);
    

    res.send(readyfile)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


function convert(file, tag, type, cla, res) {
    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(file, "text/xml");

   // var mainXML = xmlDoc.getElementsByTagName("WorkflowDesigner");  
  //  fs.writeFileSync('./fileOut.xml', mainXML.toString());

  //  var nodes = xmlDoc.getElementsByTagName("TaskNodeData");
  //  fs.writeFileSync('./fileOutTaskNodeData.xml', nodes.toString());

    var nodes = xmlDoc.getElementsByTagName(tag);
    var readyNodes = [];
    for(var n = 0; n < nodes.length; n++) {
        try{
            readyNodes.push({
                id: uuidv4(),
                type: type,
                data: {
                label: nodes[n].getAttribute('Text').toString(),
                },
                position: { 
                    x: nodes[n]?.getAttribute('Location').toString().split(" ")[0], 
                    y: nodes[n]?.getAttribute('Location').toString().split(" ")[1] 
                },
                className: "diagram_element diagram_"+ cla, 
            });
        }catch{}
   }    

   var readyfile = JSON.stringify(readyNodes, null, '\t');

    fs.writeFileSync('./' + tag + '.json', readyfile.toString());
}