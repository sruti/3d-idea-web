const graphElem = document.getElementById("idea-graph");
const Graph = ForceGraph3D()(graphElem)
var dataState = {}
displayGraph();

window.onclick = function (event) {
    if (event.target == document.getElementById("modal-idea-detail")) {
        document.getElementById("modal-idea-detail").style.display = "none";
    }
}

async function displayGraph() {
    try {
        dataState = await getData();
        Graph.graphData(JSON.parse(JSON.stringify(dataState)))
            .nodeLabel("name")
            .linkWidth(0.5)
            .onNodeHover(node => graphElem.style.cursor = node ? "pointer" : null)
            .onNodeClick(node => {
                // Aim at node from outside it
                const distance = 40;
                const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

                Graph.cameraPosition(
                    { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                    node, // lookAt ({ x, y, z })
                    3000  // ms transition duration
                );
                displayDetail(node);
            });
    }
    catch (error) {
        console.log(error);
    }
}

function displayDetail(node) {
    const modal = document.getElementById("modal-idea-detail");
    const detailName = document.getElementById("detail-name");
    const detailTags = document.getElementById("detail-tags");
    const detailCreator = document.getElementById("detail-creator");
    const detailDescription = document.getElementById("detail-description");

    detailName.textContent = node.name;
    detailTags.textContent = node.tags.filter(Boolean).toString();
    detailCreator.textContent = node.creator;
    detailDescription.textContent = node.description;
    
    modal.style.top = event.pageY + "px";
    modal.style.left = event.pageX + "px";
    modal.style.display = "block";  
}

function onAddItemClick() {
    const modal = document.getElementById("modal-idea-new");
    modal.style.display = "block";
}

function onModalSubmitClick(event, form) {
    event.preventDefault();
    const modal = document.getElementById("modal-idea-new");
    modal.style.display = "none";

    const ideaName = form["idea-name"].value;
    const ideaTags = form["tags"].value;
    const ideaDescription = form["description"].value ? form["description"].value : " ";
    const creatorName = form["creator-name"].value ? form["creator-name"].value : " ";

    const id = dataState.nodes.length;
    const newTags = new Set(ideaTags.split(",").map(tag => tag.trim().toLowerCase()));

    const newIdea = {
        id: id.toString(),
        name: ideaName,
        tags: Array.from(newTags),
        creator: creatorName,
        description: ideaDescription,
    };
    const newLinks = matchTags(newIdea, dataState.nodes)

    dataState.nodes = [...dataState.nodes, {...newIdea}]
    dataState.links = [...dataState.links, ...newLinks]

    Graph.graphData(JSON.parse(JSON.stringify(dataState)))
    form.reset();
    
    try {
        storeData(dataState);
    }
    catch (error) {
        console.log(error);
    }
}

function onModalCloseClick(modal) {
    modal.parentElement.style.display = "none";
}

function matchTags(newIdea, nodes) {
    var newLinks = [];
    for (idea of nodes) {
        var intersection = idea.tags.filter(x => newIdea.tags.includes(x));
        if (intersection.length != 0) {
            newLinks = [...newLinks, { source: newIdea.id, target: idea.id }]
        }
    }
    return newLinks
}