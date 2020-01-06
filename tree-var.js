var p = function (text, arg) { console.log(text, arg) };

var data = {
    "onSubmitDialog": "Kündigung_Rechtsfolge",
    "variables": {
        "Q1": "Handelt es sich um eine Pauschalreise?",
        "Q2": "Liegt ein Reisemangel vor?",
        "Q3": "Wird die Pauschalreise durch den Reisemangel erheblich beeinträchtigt?",
        "Q4": "Hat der Reisende dem Reiseveranstalter eine angemessene Frist gesetzt?",
        "Q5": "Hat der Reiseveranstalter die ihm vom Reisenden gesetzte angemessene Frist verstreichen lassen, ohne Abhilfe zu leisten?",
        "EAVP1": "Der Reisende kann den Vertrag nach § 651 l BGB kündigen. Wird der Vertrag gekündigt, so behält der Reiseveranstalter hinsichtlich der erbrachten und nach Abs. 3 zur Beendigung der Pauschalreise noch zu erbringenden Reiseleistungen den Anspruch auf den vereinbarten Reisepreis; Ansprüche des Reisenden nach § 651i Abs. 3 Nr. 6 und 7 bleiben unberührt. Hinsichtlich der nicht mehr zu erbringenden Reiseleistungen entfällt der Anspruch des Reiseveranstalters auf den vereinbarten Reisepreis; insoweit bereits geleistete Zahlungen sind dem Reisenden vom Reiseveranstalter zu erstatten.",
        "EAVN1": "Der § 651 l BGB ist vorliegend nicht anwendbar.",
        "EAVN2": "Der Reisende kann den Vertrag nicht nach § 651 l BGB kündigen.",
        "EAVN3": "Der Reisende kann den Vertrag mangels Fristsetzung nicht nach § 651 l BGB kündigen."
    },
    "dialog":
    {
        "question": "#Q1",
        "type": "radio",
        "answerArray": ["Ja", "Nein"],
        "required": true,

        "if": [{
            "value": "Ja",
            "question": "#Q2",
            "type": "radio",
            "answerArray": ["Ja", "Nein"],
            "required": true,

            "if": [{
                "value": "Ja",
                "question": "#Q3",
                "type": "radio",
                "answerArray": ["Ja", "Nein"],
                "required": true,

                "if": [{
                    "value": "Ja",
                    "question": "#Q4",
                    "type": "radio",
                    "answerArray": ["Ja", "Nein"],
                    "required": true,

                    "if": [{
                        "value": "Ja",
                        "question": "#Q5",
                        "type": "radio",
                        "answerArray": ["Ja", "Nein"],
                        "required": true,

                        "if": [
                            {
                                "value": "Ja",
                                "question": "#EAVP1",
                                "variableName": "KündigungEnd"
                            },
                            {
                                "value": "Nein",
                                "question": "#EAVN2",
                                "variableName": "KündigungEnd"
                            }
                        ]
                    },
                    {
                        "value": "Nein",
                        "question": "#EAVN3",
                        "variableName": "KündigungEnd"

                    }
                    ]
                },
                {
                    "value": "Nein",
                    "question": "#EAVN2",
                    "variableName": "KündigungEnd"
                }
                ]
            },

            {
                "value": "Nein",
                "question": "#EAVN2",
                "variableName": "KündigungEnd"
            }
            ]
        },
        {
            "value": "Nein",
            "question": "#EAVN1",
            "variableName": "KündigungEnd"
        }
        ]
    }
};



function draw(data) {
    const mainData = data.dialog;
    var a = 0;
    var count = 1;
    var makeTreeData = function (d, name, children) {
        let obj = {};
        count = count + 1;
        obj.id = count;
        obj.name = d[name] + ": " + data.variables[d[name].substring(1)].substring(0, 10) + "...";
        obj.txt = data.variables[d[name].substring(1)]
        obj.value = d.value;
        obj.children = [];
        if (d[children] != undefined) {
            d[children].forEach(element => {
                obj.children.push(makeTreeData(element, name, children));
            });
        }
        return obj
    }
    var treeData = makeTreeData(mainData, "question", "if");
    var margin = { top: 40, right: 90, bottom: 50, left: 90 },
        width = 860 - margin.left - margin.right,
        height = 950 - margin.top - margin.bottom;
    var treemap = d3.tree()
        .size([width, height]);
    var nodes = d3.hierarchy(treeData);
    nodes = treemap(nodes);
    var svg = d3.select("#tree-div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom),
        g = svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    var link = g.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
            return "M" + d.x + "," + d.y
                + "C" + d.x + "," + (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
                + " " + (d.parent.x) + "," + d.parent.y;
        })
        .attr("transform", function (d) {
            return "translate(" + (0) + "," + (0) + ")";
        });
    var node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", function (d) {
            return "node" +
                (d.children ? " node--internal" : " node--leaf");
        })
        .attr("transform", function (d) {
            return "translate(" + (-5 + d.x) + "," + (0 + d.y) + ")";
        });
    var inTextNode = "";
    var rect = node.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("rx", 4)
        .attr("name", function (d) { return d.data.id; })
        .on("click", function (e) {
            document.getElementById("input-question").value="";
            document.getElementById("input-value").value="";
            document.getElementById("input-question-variable").value="";
            d3.select("#form").style("visibility", "visible")
                .style("top", (event.pageY - 40) + "px")
                .style("left", (event.pageX + 10) + "px");
            document.getElementById("node").value = e.data.id;

        });

    node.append("text")
        .attr("dy", "3em")
        .style("text-anchor", "middle")
        .text(function (d) { return d.data.name; })
        .on("mouseover", function () { return tooltip.style("visibility", "visible"); })
        .on("mousemove", function (d) {
            tooltip.style("top", (event.pageY - 40) + "px")
                .style("left", (event.pageX + 10) + "px")
                .style("background-color", "rgb(50, 113, 214)")
                .style("color", "rgb(214, 214, 214)")
                .text(d.data.txt);
        })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });
    node.append("text")
        .attr("dy", "-1em")
        .attr("dx", "1em")
        .attr("fill", "lightblue")
        .text(function (d) { return d.data.value; })
    btnAddANode = d3.select("#btnAddANode");
    btnAddANode.on("click", function () {
        d3.select("#form").style("visibility", "hidden")
        document.getElementById("tree-div").innerHTML = "";
        var newObj = {};
        newObj.question = "#"+document.getElementById("input-question").value;
        newObj.value = document.getElementById("input-value").value;
        newObj.id = document.getElementById("node").value;
        function addNode(newObj, treeDataNode, dataNode) {
            if (treeDataNode.id == newObj.id) {
                if (dataNode["if"] == undefined) {
                    dataNode.if=[];   
                }                
                dataNode.if.push(newObj);
            }
            else {
                if (treeDataNode["children"] != undefined) {
                    for (let index = 0; index < treeDataNode.children.length; index++) {
                        addNode(newObj, treeDataNode.children[index], dataNode.if[index])
                    }
                }
            }
        }
        addNode(newObj, treeData, data.dialog);
        data.variables[document.getElementById("input-question").value]=document.getElementById("input-question-variable").value;   
        draw(data);
    });
};
draw(data);
var tooltip = d3.select("body")
    .append("div")
    .attr("class","div-tooltip")
    .text("info");