const graphElem = document.getElementById('idea-graph');
const Graph = ForceGraph3D()(graphElem)
displayGraph();

window.onclick = function (event) {
    if (event.target == document.getElementById("modal-idea-detail")) {
        document.getElementById("modal-idea-detail").style.display = "none";
    }
}

async function displayGraph() {
    let newData
    try {
        newData = await getData()
        Graph.graphData(newData)
            .nodeLabel('name')
            .onNodeHover(node => graphElem.style.cursor = node ? 'pointer' : null)
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
        console.log(error)
    }
}

function displayDetail(node) {
    const modal = document.getElementById("modal-idea-detail");
    const detailName = document.getElementById("detail-name");
    const detailTags = document.getElementById("detail-tags");
    const detailCreator = document.getElementById("detail-creator");
    const detailDescription = document.getElementById("detail-description");

    detailName.textContent = node.name;
    detailTags.textContent = [...node.tags].join(', ');
    detailCreator.textContent = node.creator;
    detailDescription.textContent = node.description;

    modal.style.top = event.pageY;
    modal.style.left = event.pageX;
    modal.style.display = 'block';
}

function onAddItemClick() {
    const modal = document.getElementById("modal-idea-new");
    modal.style.display = "block";
}

function onModalSubmitClick(event, form) {
    event.preventDefault();
    const modal = document.getElementById("modal-idea-new");
    modal.style.display = "none";

    const ideaName = form["idea-name"];
    const ideaTags = form["tags"];
    const ideaDescription = form["description"];
    const creatorName = form["creator-name"];

    const { nodes, links } = Graph.graphData();
    const id = nodes.length;

    const newIdea = {
        id: id,
        name: ideaName.value,
        tags: new Set(ideaTags.value.split(",").map(tag => tag.trim().toLowerCase())),
        creator: creatorName.value,
        description: ideaDescription.value,
    };
    const newLinks = matchTags(newIdea, nodes)

    Graph.graphData({
        nodes: [...nodes, { ...newIdea }],
        links: [...links, ...newLinks]
    });

    form.reset();
}

function onModalCloseClick(modal) {
    modal.parentElement.style.display = 'none';
}

function matchTags(newIdea, nodes) {
    var newLinks = [];
    for (idea of nodes) {
        var intersection = new Set([...idea.tags].filter(x => newIdea.tags.has(x)));
        if (intersection.size != 0) {
            newLinks = [...newLinks, { source: newIdea.id, target: idea.id }]
        }
    }
}