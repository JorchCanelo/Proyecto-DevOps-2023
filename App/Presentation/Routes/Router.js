function defineRouting(app) {
    const userManager = require('./userManager');
    const taskManager = require('./taskManager');
    const projectManager = require('./projectManager');
    const commentManager = require('./commentManager');
    const historyManager = require('./historyManager');

    app.use(userManager);
    app.use(taskManager);
    app.use(projectManager);
    app.use(commentManager);
    app.use(historyManager);

}

module.exports = defineRouting;