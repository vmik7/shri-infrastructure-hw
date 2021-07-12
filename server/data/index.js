const EventEmitter = require('events');

// текущие настройки CI сервера
const settings = {
    id: null,
    repoOwner: null,
    repoName: null,
    repoUrl: null,
    period: 1,
    buildCommand: null,
    mainBranch: null,
};

// Map с агентами
const agents = new Map();

// Ключ - BuildId, значение - url агнета
const agentByBuildId = new Map();

// Главная очередь билдов
// элементы массива: { id, commitHash }
const mainQueue = [];

// Очередь билдов на пересборку, их агенты перестали отвечать
// элементы массива: { id, commitHash }
const rebuildQueue = [];

// Date последнего коммита в формате ISO: YYYY-MM-DDTHH:MM:SSZ
const lastCommitDate = null;

// EventEmmiter для ассинзронной обработки событий
const eventEmmiter = new EventEmitter();

// Список actions для eventEmmiter
const actions = {
    settingsChanged: 'SETTINGS_CHANGED',

    buildRequested: 'BUILD_REQUESTED',
    buildStarted: 'BUILD_STARTED',
    buildFinished: 'BUILD_FINISHED',
    buildCanceled: 'BUILD_CANCELED',

    agentNotified: 'AGENT_NOTIFIED',
    agentFinished: 'AGENT_FINISHED',
    agentStarted: 'AGENT_STARTED',
};

module.exports = {
    settings,
    agents,
    agentByBuildId,
    mainQueue,
    rebuildQueue,
    lastCommitDate,
    eventEmmiter,
    actions,
};
