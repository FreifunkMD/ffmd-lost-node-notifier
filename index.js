const NodeWatcher = require('./src/NodeWatcher.js');

const nodeWatcher = new NodeWatcher();

setInterval(() => {
    nodeWatcher.checkNodes();
}, 3000);

