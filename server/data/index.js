const EventEmitter = require('events');

/**
 * @typedef Settings
 * @property {string} id            Configuration ID
 * @property {string} repoOwner     Repository owner
 * @property {string} repoName      Repository name
 * @property {string} repoUrl       Repository url = https://github.com/{repoOwner}/{repoName}.git
 * @property {number} period        Sync interval for new commits (minutes)
 * @property {string} buildCommand  Bash command for build project
 * @property {string} mainBranch    Main branch
 */

/**
 * Текущие настройки CI сервера
 * @type {Settings}
 */
const settings = {};

/**
 * Map с агентами
 * @type {Map<string:object>} Key - agent URL, value - Agent object
 * */
const agents = new Map();

/**
 * Распределение сборок
 * @type {Map<string:string>} Key - build ID, value - agent URL
 * */
const agentByBuildId = new Map();

/**
 * @typedef Build
 * @property {string} id            Build ID
 * @property {string} commitHash    Hash of the commit
 */

/**
 * Главная очередь билдов
 * @type {Build[]}
 */
const mainQueue = [];

/**
 * Очередь билдов на пересборку, их агенты перестали отвечать
 * @type {Build[]}
 */
const rebuildQueue = [];

/**
 * Date последнего коммита
 * @type {string} формате ISO: YYYY-MM-DDTHH:MM:SSZ
 */
const lastCommitDate = null;

/**
 * EventEmmiter для ассинхронной обработки событий
 * @type {EventEmmiter}
 */
const eventEmmiter = new EventEmitter();

/**
 * Константы событий для EventEmmiter
 * @type {Object}
 */
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
