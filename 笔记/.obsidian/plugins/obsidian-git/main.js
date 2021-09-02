'use strict';

var obsidian = require('obsidian');
var child_process_1 = require('child_process');
var fs_1 = require('fs');
var tty = require('tty');
var util$1 = require('util');
var os = require('os');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var child_process_1__default = /*#__PURE__*/_interopDefaultLegacy(child_process_1);
var fs_1__default = /*#__PURE__*/_interopDefaultLegacy(fs_1);
var tty__default = /*#__PURE__*/_interopDefaultLegacy(tty);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util$1);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var ChangedFilesModal = /** @class */ (function (_super) {
    __extends(ChangedFilesModal, _super);
    function ChangedFilesModal(plugin, changedFiles) {
        var _this = _super.call(this, plugin.app) || this;
        _this.plugin = plugin;
        _this.changedFiles = changedFiles;
        _this.setPlaceholder("Not supported files will be opened by default app!");
        return _this;
    }
    ChangedFilesModal.prototype.getItems = function () {
        return this.changedFiles;
    };
    ChangedFilesModal.prototype.getItemText = function (item) {
        if (item.index == "?" && item.working_dir == "?") {
            return "Untracked | " + item.path;
        }
        var working_dir = "";
        var index = "";
        if (item.working_dir != " ")
            working_dir = "Working dir: " + item.working_dir + " ";
        if (item.index != " ")
            index = "Index: " + item.index;
        return "" + working_dir + index + " | " + item.path;
    };
    ChangedFilesModal.prototype.onChooseItem = function (item, _) {
        if (this.plugin.app.metadataCache.getFirstLinkpathDest(item.path, "") == null) {
            this.app.openWithDefaultApp(item.path);
        }
        else {
            this.plugin.app.workspace.openLinkText(item.path, "/");
        }
    };
    return ChangedFilesModal;
}(obsidian.FuzzySuggestModal));

var CustomMessageModal = /** @class */ (function (_super) {
    __extends(CustomMessageModal, _super);
    function CustomMessageModal(plugin) {
        var _this = _super.call(this, plugin.app) || this;
        _this.plugin = plugin;
        _this.setPlaceholder("Type your message and select optional the version with the added date.");
        return _this;
    }
    CustomMessageModal.prototype.getSuggestions = function (query) {
        var date = window.moment().format(this.plugin.settings.commitDateFormat);
        if (query == "")
            query = "...";
        return [query, date + ": " + query, query + ": " + date];
    };
    CustomMessageModal.prototype.renderSuggestion = function (value, el) {
        el.innerText = value;
    };
    CustomMessageModal.prototype.onChooseSuggestion = function (item, _) {
        var _this = this;
        this.plugin.promiseQueue.addTask(function () { return _this.plugin.createBackup(false, item); });
    };
    return CustomMessageModal;
}(obsidian.SuggestModal));

var PromiseQueue = /** @class */ (function () {
    function PromiseQueue() {
        this.tasks = [];
    }
    PromiseQueue.prototype.addTask = function (task) {
        this.tasks.push(task);
        if (this.tasks.length === 1) {
            this.handleTask();
        }
    };
    PromiseQueue.prototype.handleTask = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.tasks.length > 0) {
                    this.tasks[0]().finally(function () {
                        _this.tasks.shift();
                        _this.handleTask();
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    return PromiseQueue;
}());

var ObsidianGitSettingsTab = /** @class */ (function (_super) {
    __extends(ObsidianGitSettingsTab, _super);
    function ObsidianGitSettingsTab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObsidianGitSettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        var plugin = this.plugin;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Git Backup settings" });
        new obsidian.Setting(containerEl)
            .setName("Vault backup interval (minutes)")
            .setDesc("Commit and push changes every X minutes. To disable automatic backup, specify negative value or zero (default)")
            .addText(function (text) {
            return text
                .setValue(String(plugin.settings.autoSaveInterval))
                .onChange(function (value) {
                if (!isNaN(Number(value))) {
                    plugin.settings.autoSaveInterval = Number(value);
                    plugin.saveSettings();
                    if (plugin.settings.autoSaveInterval > 0) {
                        plugin.clearAutoBackup();
                        plugin.startAutoBackup(plugin.settings.autoSaveInterval);
                        new obsidian.Notice("Automatic backup enabled! Every " + plugin.settings.autoSaveInterval + " minutes.");
                    }
                    else if (plugin.settings.autoSaveInterval <= 0 &&
                        plugin.timeoutIDBackup) {
                        plugin.clearAutoBackup() &&
                            new obsidian.Notice("Automatic backup disabled!");
                    }
                }
                else {
                    new obsidian.Notice("Please specify a valid number.");
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Auto pull interval (minutes)")
            .setDesc("Pull changes every X minutes. To disable automatic pull, specify negative value or zero (default)")
            .addText(function (text) {
            return text
                .setValue(String(plugin.settings.autoPullInterval))
                .onChange(function (value) {
                if (!isNaN(Number(value))) {
                    plugin.settings.autoPullInterval = Number(value);
                    plugin.saveSettings();
                    if (plugin.settings.autoPullInterval > 0) {
                        plugin.clearAutoPull();
                        plugin.startAutoPull(plugin.settings.autoPullInterval);
                        new obsidian.Notice("Automatic pull enabled! Every " + plugin.settings.autoPullInterval + " minutes.");
                    }
                    else if (plugin.settings.autoPullInterval <= 0 &&
                        plugin.timeoutIDPull) {
                        plugin.clearAutoPull() &&
                            new obsidian.Notice("Automatic pull disabled!");
                    }
                }
                else {
                    new obsidian.Notice("Please specify a valid number.");
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Commit message")
            .setDesc("Specify custom commit message. Available placeholders: {{date}}" +
            " (see below) and {{numFiles}} (number of changed files in the commit)")
            .addText(function (text) {
            return text
                .setPlaceholder("vault backup")
                .setValue(plugin.settings.commitMessage
                ? plugin.settings.commitMessage
                : "")
                .onChange(function (value) {
                plugin.settings.commitMessage = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("{{date}} placeholder format")
            .setDesc('Specify custom date format. E.g. "YYYY-MM-DD HH:mm:ss"')
            .addText(function (text) {
            return text
                .setPlaceholder(plugin.settings.commitDateFormat)
                .setValue(plugin.settings.commitDateFormat)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            plugin.settings.commitDateFormat = value;
                            return [4 /*yield*/, plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName("Preview commit message")
            .addButton(function (button) {
            return button.setButtonText("Preview").onClick(function () { return __awaiter(_this, void 0, void 0, function () {
                var commitMessagePreview;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, plugin.gitManager.formatCommitMessage()];
                        case 1:
                            commitMessagePreview = _a.sent();
                            new obsidian.Notice("" + commitMessagePreview);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName("List filenames affected by commit in the commit body")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.listChangedFilesInMessageBody)
                .onChange(function (value) {
                plugin.settings.listChangedFilesInMessageBody = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Current branch")
            .setDesc("Switch to a different branch")
            .addDropdown(function (dropdown) { return __awaiter(_this, void 0, void 0, function () {
            var branchInfo, _i, _a, branch;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, plugin.gitManager.branchInfo()];
                    case 1:
                        branchInfo = _b.sent();
                        for (_i = 0, _a = branchInfo.branches; _i < _a.length; _i++) {
                            branch = _a[_i];
                            dropdown.addOption(branch, branch);
                        }
                        dropdown.setValue(branchInfo.current);
                        dropdown.onChange(function (option) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, plugin.gitManager.checkout(option)];
                                    case 1:
                                        _a.sent();
                                        new obsidian.Notice("Checked out to " + option);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        }); });
        new obsidian.Setting(containerEl)
            .setName("Pull updates on startup")
            .setDesc("Automatically pull updates when Obsidian starts")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.autoPullOnBoot)
                .onChange(function (value) {
                plugin.settings.autoPullOnBoot = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Disable push")
            .setDesc("Do not push changes to the remote repository")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.disablePush)
                .onChange(function (value) {
                plugin.settings.disablePush = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Pull changes before push")
            .setDesc("Commit -> pull -> push (Only if pushing is enabled)")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.pullBeforePush)
                .onChange(function (value) {
                plugin.settings.pullBeforePush = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Update submodules")
            .setDesc('"Create backup" and "pull" takes care of submodules. Missing features: Conflicted files, count of pulled/pushed/committed files. Tracking branch needs to be set for each submodule')
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.updateSubmodules)
                .onChange(function (value) {
                plugin.settings.updateSubmodules = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Disable notifications")
            .setDesc("Disable notifications for git operations to minimize distraction (refer to status bar for updates)")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.disablePopups)
                .onChange(function (value) {
                plugin.settings.disablePopups = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Show status bar")
            .setDesc("Obsidian must be restarted for the changes to take affect")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.showStatusBar)
                .onChange(function (value) {
                plugin.settings.showStatusBar = value;
                plugin.saveSettings();
            });
        });
    };
    return ObsidianGitSettingsTab;
}(obsidian.PluginSettingTab));

var PluginState;
(function (PluginState) {
    PluginState[PluginState["idle"] = 0] = "idle";
    PluginState[PluginState["status"] = 1] = "status";
    PluginState[PluginState["pull"] = 2] = "pull";
    PluginState[PluginState["add"] = 3] = "add";
    PluginState[PluginState["commit"] = 4] = "commit";
    PluginState[PluginState["push"] = 5] = "push";
    PluginState[PluginState["conflicted"] = 6] = "conflicted";
})(PluginState || (PluginState = {}));

var StatusBar = /** @class */ (function () {
    function StatusBar(statusBarEl, plugin) {
        this.messages = [];
        this.statusBarEl = statusBarEl;
        this.plugin = plugin;
    }
    StatusBar.prototype.displayMessage = function (message, timeout) {
        this.messages.push({
            message: "git: " + message.slice(0, 100),
            timeout: timeout,
        });
        this.display();
    };
    StatusBar.prototype.display = function () {
        if (this.messages.length > 0 && !this.currentMessage) {
            this.currentMessage = this.messages.shift();
            this.statusBarEl.setText(this.currentMessage.message);
            this.lastMessageTimestamp = Date.now();
        }
        else if (this.currentMessage) {
            var messageAge = Date.now() - this.lastMessageTimestamp;
            if (messageAge >= this.currentMessage.timeout) {
                this.currentMessage = null;
                this.lastMessageTimestamp = null;
            }
        }
        else {
            this.displayState();
        }
    };
    StatusBar.prototype.displayState = function () {
        switch (this.plugin.state) {
            case PluginState.idle:
                this.displayFromNow(this.plugin.lastUpdate);
                break;
            case PluginState.status:
                this.statusBarEl.setText("git: checking repo status...");
                break;
            case PluginState.add:
                this.statusBarEl.setText("git: adding files to repo...");
                break;
            case PluginState.commit:
                this.statusBarEl.setText("git: committing changes...");
                break;
            case PluginState.push:
                this.statusBarEl.setText("git: pushing changes...");
                break;
            case PluginState.pull:
                this.statusBarEl.setText("git: pulling changes...");
                break;
            case PluginState.conflicted:
                this.statusBarEl.setText("git: you have conflict files...");
                break;
            default:
                this.statusBarEl.setText("git: failed on initialization!");
                break;
        }
    };
    StatusBar.prototype.displayFromNow = function (timestamp) {
        if (timestamp) {
            var moment_1 = window.moment;
            var fromNow = moment_1(timestamp).fromNow();
            this.statusBarEl.setText("git: last update " + fromNow);
        }
        else {
            this.statusBarEl.setText("git: ready");
        }
    };
    return StatusBar;
}());

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var gitError = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitError = void 0;
/**
 * The `GitError` is thrown when the underlying `git` process throws a
 * fatal exception (eg an `ENOENT` exception when attempting to use a
 * non-writable directory as the root for your repo), and acts as the
 * base class for more specific errors thrown by the parsing of the
 * git response or errors in the configuration of the task about to
 * be run.
 *
 * When an exception is thrown, pending tasks in the same instance will
 * not be executed. The recommended way to run a series of tasks that
 * can independently fail without needing to prevent future tasks from
 * running is to catch them individually:
 *
 * ```typescript
 import { gitP, SimpleGit, GitError, PullResult } from 'simple-git';

 function catchTask (e: GitError) {
   return e.
 }

 const git = gitP(repoWorkingDir);
 const pulled: PullResult | GitError = await git.pull().catch(catchTask);
 const pushed: string | GitError = await git.pushTags().catch(catchTask);
 ```
 */
class GitError extends Error {
    constructor(task, message) {
        super(message);
        this.task = task;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.GitError = GitError;

});

var gitResponseError = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitResponseError = void 0;

/**
 * The `GitResponseError` is the wrapper for a parsed response that is treated as
 * a fatal error, for example attempting a `merge` can leave the repo in a corrupted
 * state when there are conflicts so the task will reject rather than resolve.
 *
 * For example, catching the merge conflict exception:
 *
 * ```typescript
 import { gitP, SimpleGit, GitResponseError, MergeSummary } from 'simple-git';

 const git = gitP(repoRoot);
 const mergeOptions: string[] = ['--no-ff', 'other-branch'];
 const mergeSummary: MergeSummary = await git.merge(mergeOptions)
      .catch((e: GitResponseError<MergeSummary>) => e.git);

 if (mergeSummary.failed) {
   // deal with the error
 }
 ```
 */
class GitResponseError extends gitError.GitError {
    constructor(
    /**
     * `.git` access the parsed response that is treated as being an error
     */
    git, message) {
        super(undefined, message || String(git));
        this.git = git;
    }
}
exports.GitResponseError = GitResponseError;

});

var gitConstructError = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitConstructError = void 0;

/**
 * The `GitConstructError` is thrown when an error occurs in the constructor
 * of the `simple-git` instance itself. Most commonly as a result of using
 * a `baseDir` option that points to a folder that either does not exist,
 * or cannot be read by the user the node script is running as.
 *
 * Check the `.message` property for more detail including the properties
 * passed to the constructor.
 */
class GitConstructError extends gitError.GitError {
    constructor(config, message) {
        super(undefined, message);
        this.config = config;
    }
}
exports.GitConstructError = GitConstructError;

});

var gitPluginError = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitPluginError = void 0;

class GitPluginError extends gitError.GitError {
    constructor(task, plugin, message) {
        super(task, message);
        this.task = task;
        this.plugin = plugin;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.GitPluginError = GitPluginError;

});

var taskConfigurationError = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskConfigurationError = void 0;

/**
 * The `TaskConfigurationError` is thrown when a command was incorrectly
 * configured. An error of this kind means that no attempt was made to
 * run your command through the underlying `git` binary.
 *
 * Check the `.message` property for more detail on why your configuration
 * resulted in an error.
 */
class TaskConfigurationError extends gitError.GitError {
    constructor(message) {
        super(undefined, message);
    }
}
exports.TaskConfigurationError = TaskConfigurationError;

});

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = ms;
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

var common = setup;

var browser = createCommonjsModule(function (module, exports) {
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = common(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};
});

var hasFlag = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os__default['default'].release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty__default['default'].isatty(1))),
	stderr: translateLevel(supportsColor(true, tty__default['default'].isatty(2)))
};

var node = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util__default['default'].deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = supportsColor_1;

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty__default['default'].isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util__default['default'].format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = common(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util__default['default'].inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util__default['default'].inspect(v, this.inspectOpts);
};
});

var src$2 = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = browser;
} else {
	module.exports = node;
}
});

var src$1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const debug_1 = __importDefault(src$2);
const log = debug_1.default('@kwsites/file-exists');
function check(path, isFile, isDirectory) {
    log(`checking %s`, path);
    try {
        const stat = fs_1__default['default'].statSync(path);
        if (stat.isFile() && isFile) {
            log(`[OK] path represents a file`);
            return true;
        }
        if (stat.isDirectory() && isDirectory) {
            log(`[OK] path represents a directory`);
            return true;
        }
        log(`[FAIL] path represents something other than a file or directory`);
        return false;
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            log(`[FAIL] path is not accessible: %o`, e);
            return false;
        }
        log(`[FATAL] %o`, e);
        throw e;
    }
}
/**
 * Synchronous validation of a path existing either as a file or as a directory.
 *
 * @param {string} path The path to check
 * @param {number} type One or both of the exported numeric constants
 */
function exists(path, type = exports.READABLE) {
    return check(path, (type & exports.FILE) > 0, (type & exports.FOLDER) > 0);
}
exports.exists = exists;
/**
 * Constant representing a file
 */
exports.FILE = 1;
/**
 * Constant representing a folder
 */
exports.FOLDER = 2;
/**
 * Constant representing either a file or a folder
 */
exports.READABLE = exports.FILE + exports.FOLDER;

});

var dist$1 = createCommonjsModule(function (module, exports) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(src$1);

});

var util = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = exports.bufferToString = exports.prefixedArray = exports.asNumber = exports.asStringArray = exports.asArray = exports.objectToString = exports.remove = exports.including = exports.append = exports.folderExists = exports.forEachLineWithContent = exports.toLinesWithContent = exports.last = exports.first = exports.splitOn = exports.isUserFunction = exports.asFunction = exports.NOOP = void 0;

const NOOP = () => {
};
exports.NOOP = NOOP;
/**
 * Returns either the source argument when it is a `Function`, or the default
 * `NOOP` function constant
 */
function asFunction(source) {
    return typeof source === 'function' ? source : exports.NOOP;
}
exports.asFunction = asFunction;
/**
 * Determines whether the supplied argument is both a function, and is not
 * the `NOOP` function.
 */
function isUserFunction(source) {
    return (typeof source === 'function' && source !== exports.NOOP);
}
exports.isUserFunction = isUserFunction;
function splitOn(input, char) {
    const index = input.indexOf(char);
    if (index <= 0) {
        return [input, ''];
    }
    return [
        input.substr(0, index),
        input.substr(index + 1),
    ];
}
exports.splitOn = splitOn;
function first(input, offset = 0) {
    return isArrayLike(input) && input.length > offset ? input[offset] : undefined;
}
exports.first = first;
function last(input, offset = 0) {
    if (isArrayLike(input) && input.length > offset) {
        return input[input.length - 1 - offset];
    }
}
exports.last = last;
function isArrayLike(input) {
    return !!(input && typeof input.length === 'number');
}
function toLinesWithContent(input, trimmed = true, separator = '\n') {
    return input.split(separator)
        .reduce((output, line) => {
        const lineContent = trimmed ? line.trim() : line;
        if (lineContent) {
            output.push(lineContent);
        }
        return output;
    }, []);
}
exports.toLinesWithContent = toLinesWithContent;
function forEachLineWithContent(input, callback) {
    return toLinesWithContent(input, true).map(line => callback(line));
}
exports.forEachLineWithContent = forEachLineWithContent;
function folderExists(path) {
    return dist$1.exists(path, dist$1.FOLDER);
}
exports.folderExists = folderExists;
/**
 * Adds `item` into the `target` `Array` or `Set` when it is not already present and returns the `item`.
 */
function append(target, item) {
    if (Array.isArray(target)) {
        if (!target.includes(item)) {
            target.push(item);
        }
    }
    else {
        target.add(item);
    }
    return item;
}
exports.append = append;
/**
 * Adds `item` into the `target` `Array` when it is not already present and returns the `target`.
 */
function including(target, item) {
    if (Array.isArray(target) && !target.includes(item)) {
        target.push(item);
    }
    return target;
}
exports.including = including;
function remove(target, item) {
    if (Array.isArray(target)) {
        const index = target.indexOf(item);
        if (index >= 0) {
            target.splice(index, 1);
        }
    }
    else {
        target.delete(item);
    }
    return item;
}
exports.remove = remove;
exports.objectToString = Object.prototype.toString.call.bind(Object.prototype.toString);
function asArray(source) {
    return Array.isArray(source) ? source : [source];
}
exports.asArray = asArray;
function asStringArray(source) {
    return asArray(source).map(String);
}
exports.asStringArray = asStringArray;
function asNumber(source, onNaN = 0) {
    if (source == null) {
        return onNaN;
    }
    const num = parseInt(source, 10);
    return isNaN(num) ? onNaN : num;
}
exports.asNumber = asNumber;
function prefixedArray(input, prefix) {
    const output = [];
    for (let i = 0, max = input.length; i < max; i++) {
        output.push(prefix, input[i]);
    }
    return output;
}
exports.prefixedArray = prefixedArray;
function bufferToString(input) {
    return (Array.isArray(input) ? Buffer.concat(input) : input).toString('utf-8');
}
exports.bufferToString = bufferToString;
/**
 * Get a new object from a source object with only the listed properties.
 */
function pick(source, properties) {
    return Object.assign({}, ...properties.map((property) => property in source ? { [property]: source[property] } : {}));
}
exports.pick = pick;

});

var argumentFilters = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterHasLength = exports.filterFunction = exports.filterPlainObject = exports.filterStringOrStringArray = exports.filterStringArray = exports.filterString = exports.filterPrimitives = exports.filterArray = exports.filterType = void 0;

function filterType(input, filter, def) {
    if (filter(input)) {
        return input;
    }
    return (arguments.length > 2) ? def : undefined;
}
exports.filterType = filterType;
const filterArray = (input) => {
    return Array.isArray(input);
};
exports.filterArray = filterArray;
function filterPrimitives(input, omit) {
    return /number|string|boolean/.test(typeof input) && (!omit || !omit.includes((typeof input)));
}
exports.filterPrimitives = filterPrimitives;
const filterString = (input) => {
    return typeof input === 'string';
};
exports.filterString = filterString;
const filterStringArray = (input) => {
    return Array.isArray(input) && input.every(exports.filterString);
};
exports.filterStringArray = filterStringArray;
const filterStringOrStringArray = (input) => {
    return exports.filterString(input) || (Array.isArray(input) && input.every(exports.filterString));
};
exports.filterStringOrStringArray = filterStringOrStringArray;
function filterPlainObject(input) {
    return !!input && util.objectToString(input) === '[object Object]';
}
exports.filterPlainObject = filterPlainObject;
function filterFunction(input) {
    return typeof input === 'function';
}
exports.filterFunction = filterFunction;
const filterHasLength = (input) => {
    if (input == null || 'number|boolean|function'.includes(typeof input)) {
        return false;
    }
    return Array.isArray(input) || typeof input === 'string' || typeof input.length === 'number';
};
exports.filterHasLength = filterHasLength;

});

var exitCodes = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitCodes = void 0;
(function (ExitCodes) {
    ExitCodes[ExitCodes["SUCCESS"] = 0] = "SUCCESS";
    ExitCodes[ExitCodes["ERROR"] = 1] = "ERROR";
    ExitCodes[ExitCodes["UNCLEAN"] = 128] = "UNCLEAN";
})(exports.ExitCodes || (exports.ExitCodes = {}));

});

var gitOutputStreams = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitOutputStreams = void 0;
class GitOutputStreams {
    constructor(stdOut, stdErr) {
        this.stdOut = stdOut;
        this.stdErr = stdErr;
    }
    asStrings() {
        return new GitOutputStreams(this.stdOut.toString('utf8'), this.stdErr.toString('utf8'));
    }
}
exports.GitOutputStreams = GitOutputStreams;

});

var lineParser = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteLineParser = exports.LineParser = void 0;
class LineParser {
    constructor(regExp, useMatches) {
        this.matches = [];
        this.parse = (line, target) => {
            this.resetMatches();
            if (!this._regExp.every((reg, index) => this.addMatch(reg, index, line(index)))) {
                return false;
            }
            return this.useMatches(target, this.prepareMatches()) !== false;
        };
        this._regExp = Array.isArray(regExp) ? regExp : [regExp];
        if (useMatches) {
            this.useMatches = useMatches;
        }
    }
    // @ts-ignore
    useMatches(target, match) {
        throw new Error(`LineParser:useMatches not implemented`);
    }
    resetMatches() {
        this.matches.length = 0;
    }
    prepareMatches() {
        return this.matches;
    }
    addMatch(reg, index, line) {
        const matched = line && reg.exec(line);
        if (matched) {
            this.pushMatch(index, matched);
        }
        return !!matched;
    }
    pushMatch(_index, matched) {
        this.matches.push(...matched.slice(1));
    }
}
exports.LineParser = LineParser;
class RemoteLineParser extends LineParser {
    addMatch(reg, index, line) {
        return /^remote:\s/.test(String(line)) && super.addMatch(reg, index, line);
    }
    pushMatch(index, matched) {
        if (index > 0 || matched.length > 1) {
            super.pushMatch(index, matched);
        }
    }
}
exports.RemoteLineParser = RemoteLineParser;

});

var simpleGitOptions = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstanceConfig = void 0;
const defaultOptions = {
    binary: 'git',
    maxConcurrentProcesses: 5,
    config: [],
};
function createInstanceConfig(...options) {
    const baseDir = process.cwd();
    const config = Object.assign(Object.assign({ baseDir }, defaultOptions), ...(options.filter(o => typeof o === 'object' && o)));
    config.baseDir = config.baseDir || baseDir;
    return config;
}
exports.createInstanceConfig = createInstanceConfig;

});

var taskOptions = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.trailingFunctionArgument = exports.trailingOptionsArgument = exports.getTrailingOptions = exports.appendTaskOptions = void 0;


function appendTaskOptions(options, commands = []) {
    if (!argumentFilters.filterPlainObject(options)) {
        return commands;
    }
    return Object.keys(options).reduce((commands, key) => {
        const value = options[key];
        if (argumentFilters.filterPrimitives(value, ['boolean'])) {
            commands.push(key + '=' + value);
        }
        else {
            commands.push(key);
        }
        return commands;
    }, commands);
}
exports.appendTaskOptions = appendTaskOptions;
function getTrailingOptions(args, initialPrimitive = 0, objectOnly = false) {
    const command = [];
    for (let i = 0, max = initialPrimitive < 0 ? args.length : initialPrimitive; i < max; i++) {
        if ('string|number'.includes(typeof args[i])) {
            command.push(String(args[i]));
        }
    }
    appendTaskOptions(trailingOptionsArgument(args), command);
    if (!objectOnly) {
        command.push(...trailingArrayArgument(args));
    }
    return command;
}
exports.getTrailingOptions = getTrailingOptions;
function trailingArrayArgument(args) {
    const hasTrailingCallback = typeof util.last(args) === 'function';
    return argumentFilters.filterType(util.last(args, hasTrailingCallback ? 1 : 0), argumentFilters.filterArray, []);
}
/**
 * Given any number of arguments, returns the trailing options argument, ignoring a trailing function argument
 * if there is one. When not found, the return value is null.
 */
function trailingOptionsArgument(args) {
    const hasTrailingCallback = argumentFilters.filterFunction(util.last(args));
    return argumentFilters.filterType(util.last(args, hasTrailingCallback ? 1 : 0), argumentFilters.filterPlainObject);
}
exports.trailingOptionsArgument = trailingOptionsArgument;
/**
 * Returns either the source argument when it is a `Function`, or the default
 * `NOOP` function constant
 */
function trailingFunctionArgument(args, includeNoop = true) {
    const callback = util.asFunction(util.last(args));
    return includeNoop || util.isUserFunction(callback) ? callback : undefined;
}
exports.trailingFunctionArgument = trailingFunctionArgument;

});

var taskParser = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStringResponse = exports.callTaskParser = void 0;

function callTaskParser(parser, streams) {
    return parser(streams.stdOut, streams.stdErr);
}
exports.callTaskParser = callTaskParser;
function parseStringResponse(result, parsers, ...texts) {
    texts.forEach(text => {
        for (let lines = util.toLinesWithContent(text), i = 0, max = lines.length; i < max; i++) {
            const line = (offset = 0) => {
                if ((i + offset) >= max) {
                    return;
                }
                return lines[i + offset];
            };
            parsers.some(({ parse }) => parse(line, result));
        }
    });
    return result;
}
exports.parseStringResponse = parseStringResponse;

});

var utils = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(argumentFilters, exports);
__exportStar(exitCodes, exports);
__exportStar(gitOutputStreams, exports);
__exportStar(lineParser, exports);
__exportStar(simpleGitOptions, exports);
__exportStar(taskOptions, exports);
__exportStar(taskParser, exports);
__exportStar(util, exports);

});

var checkIsRepo = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsBareRepoTask = exports.checkIsRepoRootTask = exports.checkIsRepoTask = exports.CheckRepoActions = void 0;

var CheckRepoActions;
(function (CheckRepoActions) {
    CheckRepoActions["BARE"] = "bare";
    CheckRepoActions["IN_TREE"] = "tree";
    CheckRepoActions["IS_REPO_ROOT"] = "root";
})(CheckRepoActions = exports.CheckRepoActions || (exports.CheckRepoActions = {}));
const onError = ({ exitCode }, error, done, fail) => {
    if (exitCode === utils.ExitCodes.UNCLEAN && isNotRepoMessage(error)) {
        return done(Buffer.from('false'));
    }
    fail(error);
};
const parser = (text) => {
    return text.trim() === 'true';
};
function checkIsRepoTask(action) {
    switch (action) {
        case CheckRepoActions.BARE:
            return checkIsBareRepoTask();
        case CheckRepoActions.IS_REPO_ROOT:
            return checkIsRepoRootTask();
    }
    const commands = ['rev-parse', '--is-inside-work-tree'];
    return {
        commands,
        format: 'utf-8',
        onError,
        parser,
    };
}
exports.checkIsRepoTask = checkIsRepoTask;
function checkIsRepoRootTask() {
    const commands = ['rev-parse', '--git-dir'];
    return {
        commands,
        format: 'utf-8',
        onError,
        parser(path) {
            return /^\.(git)?$/.test(path.trim());
        },
    };
}
exports.checkIsRepoRootTask = checkIsRepoRootTask;
function checkIsBareRepoTask() {
    const commands = ['rev-parse', '--is-bare-repository'];
    return {
        commands,
        format: 'utf-8',
        onError,
        parser,
    };
}
exports.checkIsBareRepoTask = checkIsBareRepoTask;
function isNotRepoMessage(error) {
    return /(Not a git repository|Kein Git-Repository)/i.test(String(error));
}

});

var CleanSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanSummaryParser = exports.CleanResponse = void 0;

class CleanResponse {
    constructor(dryRun) {
        this.dryRun = dryRun;
        this.paths = [];
        this.files = [];
        this.folders = [];
    }
}
exports.CleanResponse = CleanResponse;
const removalRegexp = /^[a-z]+\s*/i;
const dryRunRemovalRegexp = /^[a-z]+\s+[a-z]+\s*/i;
const isFolderRegexp = /\/$/;
function cleanSummaryParser(dryRun, text) {
    const summary = new CleanResponse(dryRun);
    const regexp = dryRun ? dryRunRemovalRegexp : removalRegexp;
    utils.toLinesWithContent(text).forEach(line => {
        const removed = line.replace(regexp, '');
        summary.paths.push(removed);
        (isFolderRegexp.test(removed) ? summary.folders : summary.files).push(removed);
    });
    return summary;
}
exports.cleanSummaryParser = cleanSummaryParser;

});

var task = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyTask = exports.isBufferTask = exports.straightThroughBufferTask = exports.straightThroughStringTask = exports.configurationErrorTask = exports.adhocExecTask = exports.EMPTY_COMMANDS = void 0;

exports.EMPTY_COMMANDS = [];
function adhocExecTask(parser) {
    return {
        commands: exports.EMPTY_COMMANDS,
        format: 'empty',
        parser,
    };
}
exports.adhocExecTask = adhocExecTask;
function configurationErrorTask(error) {
    return {
        commands: exports.EMPTY_COMMANDS,
        format: 'empty',
        parser() {
            throw typeof error === 'string' ? new taskConfigurationError.TaskConfigurationError(error) : error;
        }
    };
}
exports.configurationErrorTask = configurationErrorTask;
function straightThroughStringTask(commands, trimmed = false) {
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return trimmed ? String(text).trim() : text;
        },
    };
}
exports.straightThroughStringTask = straightThroughStringTask;
function straightThroughBufferTask(commands) {
    return {
        commands,
        format: 'buffer',
        parser(buffer) {
            return buffer;
        },
    };
}
exports.straightThroughBufferTask = straightThroughBufferTask;
function isBufferTask(task) {
    return task.format === 'buffer';
}
exports.isBufferTask = isBufferTask;
function isEmptyTask(task) {
    return task.format === 'empty' || !task.commands.length;
}
exports.isEmptyTask = isEmptyTask;

});

var clean = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCleanOptionsArray = exports.cleanTask = exports.cleanWithOptionsTask = exports.CleanOptions = exports.CONFIG_ERROR_UNKNOWN_OPTION = exports.CONFIG_ERROR_MODE_REQUIRED = exports.CONFIG_ERROR_INTERACTIVE_MODE = void 0;



exports.CONFIG_ERROR_INTERACTIVE_MODE = 'Git clean interactive mode is not supported';
exports.CONFIG_ERROR_MODE_REQUIRED = 'Git clean mode parameter ("n" or "f") is required';
exports.CONFIG_ERROR_UNKNOWN_OPTION = 'Git clean unknown option found in: ';
/**
 * All supported option switches available for use in a `git.clean` operation
 */
var CleanOptions;
(function (CleanOptions) {
    CleanOptions["DRY_RUN"] = "n";
    CleanOptions["FORCE"] = "f";
    CleanOptions["IGNORED_INCLUDED"] = "x";
    CleanOptions["IGNORED_ONLY"] = "X";
    CleanOptions["EXCLUDING"] = "e";
    CleanOptions["QUIET"] = "q";
    CleanOptions["RECURSIVE"] = "d";
})(CleanOptions = exports.CleanOptions || (exports.CleanOptions = {}));
const CleanOptionValues = new Set(['i', ...utils.asStringArray(Object.values(CleanOptions))]);
function cleanWithOptionsTask(mode, customArgs) {
    const { cleanMode, options, valid } = getCleanOptions(mode);
    if (!cleanMode) {
        return task.configurationErrorTask(exports.CONFIG_ERROR_MODE_REQUIRED);
    }
    if (!valid.options) {
        return task.configurationErrorTask(exports.CONFIG_ERROR_UNKNOWN_OPTION + JSON.stringify(mode));
    }
    options.push(...customArgs);
    if (options.some(isInteractiveMode)) {
        return task.configurationErrorTask(exports.CONFIG_ERROR_INTERACTIVE_MODE);
    }
    return cleanTask(cleanMode, options);
}
exports.cleanWithOptionsTask = cleanWithOptionsTask;
function cleanTask(mode, customArgs) {
    const commands = ['clean', `-${mode}`, ...customArgs];
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return CleanSummary.cleanSummaryParser(mode === CleanOptions.DRY_RUN, text);
        }
    };
}
exports.cleanTask = cleanTask;
function isCleanOptionsArray(input) {
    return Array.isArray(input) && input.every(test => CleanOptionValues.has(test));
}
exports.isCleanOptionsArray = isCleanOptionsArray;
function getCleanOptions(input) {
    let cleanMode;
    let options = [];
    let valid = { cleanMode: false, options: true };
    input.replace(/[^a-z]i/g, '').split('').forEach(char => {
        if (isCleanMode(char)) {
            cleanMode = char;
            valid.cleanMode = true;
        }
        else {
            valid.options = valid.options && isKnownOption(options[options.length] = (`-${char}`));
        }
    });
    return {
        cleanMode,
        options,
        valid,
    };
}
function isCleanMode(cleanMode) {
    return cleanMode === CleanOptions.FORCE || cleanMode === CleanOptions.DRY_RUN;
}
function isKnownOption(option) {
    return /^-[a-z]$/i.test(option) && CleanOptionValues.has(option.charAt(1));
}
function isInteractiveMode(option) {
    if (/^-[^\-]/.test(option)) {
        return option.indexOf('i') > 0;
    }
    return option === '--interactive';
}

});

var ConfigList_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.configGetParser = exports.configListParser = exports.ConfigList = void 0;

class ConfigList {
    constructor() {
        this.files = [];
        this.values = Object.create(null);
    }
    get all() {
        if (!this._all) {
            this._all = this.files.reduce((all, file) => {
                return Object.assign(all, this.values[file]);
            }, {});
        }
        return this._all;
    }
    addFile(file) {
        if (!(file in this.values)) {
            const latest = utils.last(this.files);
            this.values[file] = latest ? Object.create(this.values[latest]) : {};
            this.files.push(file);
        }
        return this.values[file];
    }
    addValue(file, key, value) {
        const values = this.addFile(file);
        if (!values.hasOwnProperty(key)) {
            values[key] = value;
        }
        else if (Array.isArray(values[key])) {
            values[key].push(value);
        }
        else {
            values[key] = [values[key], value];
        }
        this._all = undefined;
    }
}
exports.ConfigList = ConfigList;
function configListParser(text) {
    const config = new ConfigList();
    for (const item of configParser(text)) {
        config.addValue(item.file, item.key, item.value);
    }
    return config;
}
exports.configListParser = configListParser;
function configGetParser(text, key) {
    let value = null;
    const values = [];
    const scopes = new Map();
    for (const item of configParser(text)) {
        if (item.key !== key) {
            continue;
        }
        values.push(value = item.value);
        if (!scopes.has(item.file)) {
            scopes.set(item.file, []);
        }
        scopes.get(item.file).push(value);
    }
    return {
        key,
        paths: Array.from(scopes.keys()),
        scopes,
        value,
        values
    };
}
exports.configGetParser = configGetParser;
function configFilePath(filePath) {
    return filePath.replace(/^(file):/, '');
}
function* configParser(text) {
    const lines = text.split('\0');
    for (let i = 0, max = lines.length - 1; i < max;) {
        const file = configFilePath(lines[i++]);
        const [key, value] = utils.splitOn(lines[i++], '\n');
        yield { file, key, value };
    }
}

});

var config = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitConfigScope = void 0;


var GitConfigScope;
(function (GitConfigScope) {
    GitConfigScope["system"] = "system";
    GitConfigScope["global"] = "global";
    GitConfigScope["local"] = "local";
    GitConfigScope["worktree"] = "worktree";
})(GitConfigScope = exports.GitConfigScope || (exports.GitConfigScope = {}));
function asConfigScope(scope, fallback) {
    if (typeof scope === 'string' && GitConfigScope.hasOwnProperty(scope)) {
        return scope;
    }
    return fallback;
}
function addConfigTask(key, value, append, scope) {
    const commands = ['config', `--${scope}`];
    if (append) {
        commands.push('--add');
    }
    commands.push(key, value);
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return text;
        }
    };
}
function getConfigTask(key, scope) {
    const commands = ['config', '--null', '--show-origin', '--get-all', key];
    if (scope) {
        commands.splice(1, 0, `--${scope}`);
    }
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return ConfigList_1.configGetParser(text, key);
        }
    };
}
function listConfigTask(scope) {
    const commands = ['config', '--list', '--show-origin', '--null'];
    if (scope) {
        commands.push(`--${scope}`);
    }
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return ConfigList_1.configListParser(text);
        },
    };
}
function default_1() {
    return {
        addConfig(key, value, ...rest) {
            return this._runTask(addConfigTask(key, value, rest[0] === true, asConfigScope(rest[1], GitConfigScope.local)), utils.trailingFunctionArgument(arguments));
        },
        getConfig(key, scope) {
            return this._runTask(getConfigTask(key, asConfigScope(scope, undefined)), utils.trailingFunctionArgument(arguments));
        },
        listConfig(...rest) {
            return this._runTask(listConfigTask(asConfigScope(rest[0], undefined)), utils.trailingFunctionArgument(arguments));
        },
    };
}
exports.default = default_1;

});

var reset = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResetMode = exports.resetTask = exports.ResetMode = void 0;

var ResetMode;
(function (ResetMode) {
    ResetMode["MIXED"] = "mixed";
    ResetMode["SOFT"] = "soft";
    ResetMode["HARD"] = "hard";
    ResetMode["MERGE"] = "merge";
    ResetMode["KEEP"] = "keep";
})(ResetMode = exports.ResetMode || (exports.ResetMode = {}));
const ResetModes = Array.from(Object.values(ResetMode));
function resetTask(mode, customArgs) {
    const commands = ['reset'];
    if (isValidResetMode(mode)) {
        commands.push(`--${mode}`);
    }
    commands.push(...customArgs);
    return task.straightThroughStringTask(commands);
}
exports.resetTask = resetTask;
function getResetMode(mode) {
    if (isValidResetMode(mode)) {
        return mode;
    }
    switch (typeof mode) {
        case 'string':
        case 'undefined':
            return ResetMode.SOFT;
    }
    return;
}
exports.getResetMode = getResetMode;
function isValidResetMode(mode) {
    return ResetModes.includes(mode);
}

});

var api_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });









const api = {
    CheckRepoActions: checkIsRepo.CheckRepoActions,
    CleanOptions: clean.CleanOptions,
    GitConfigScope: config.GitConfigScope,
    GitConstructError: gitConstructError.GitConstructError,
    GitError: gitError.GitError,
    GitPluginError: gitPluginError.GitPluginError,
    GitResponseError: gitResponseError.GitResponseError,
    ResetMode: reset.ResetMode,
    TaskConfigurationError: taskConfigurationError.TaskConfigurationError,
};
exports.default = api;

});

var commandConfigPrefixingPlugin_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandConfigPrefixingPlugin = void 0;

function commandConfigPrefixingPlugin(configuration) {
    const prefix = utils.prefixedArray(configuration, '-c');
    return {
        type: 'spawn.args',
        action(data) {
            return [...prefix, ...data];
        },
    };
}
exports.commandConfigPrefixingPlugin = commandConfigPrefixingPlugin;

});

var errorDetection_plugin = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorDetectionPlugin = exports.errorDetectionHandler = void 0;

function isTaskError(result) {
    return !!(result.exitCode && result.stdErr.length);
}
function getErrorMessage(result) {
    return Buffer.concat([...result.stdOut, ...result.stdErr]);
}
function errorDetectionHandler(overwrite = false, isError = isTaskError, errorMessage = getErrorMessage) {
    return (error, result) => {
        if ((!overwrite && error) || !isError(result)) {
            return error;
        }
        return errorMessage(result);
    };
}
exports.errorDetectionHandler = errorDetectionHandler;
function errorDetectionPlugin(config) {
    return {
        type: 'task.error',
        action(data, context) {
            const error = config(data.error, {
                stdErr: context.stdErr,
                stdOut: context.stdOut,
                exitCode: context.exitCode
            });
            if (Buffer.isBuffer(error)) {
                return { error: new gitError.GitError(undefined, error.toString('utf-8')) };
            }
            return {
                error
            };
        },
    };
}
exports.errorDetectionPlugin = errorDetectionPlugin;

});

var pluginStore = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginStore = void 0;

class PluginStore {
    constructor() {
        this.plugins = new Set();
    }
    add(plugin) {
        const plugins = [];
        utils.asArray(plugin).forEach(plugin => plugin && this.plugins.add(utils.append(plugins, plugin)));
        return () => {
            plugins.forEach(plugin => this.plugins.delete(plugin));
        };
    }
    exec(type, data, context) {
        let output = data;
        const contextual = Object.freeze(Object.create(context));
        for (const plugin of this.plugins) {
            if (plugin.type === type) {
                output = plugin.action(output, contextual);
            }
        }
        return output;
    }
}
exports.PluginStore = PluginStore;

});

var progressMonitorPlugin_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressMonitorPlugin = void 0;

function progressMonitorPlugin(progress) {
    const progressCommand = '--progress';
    const progressMethods = ['checkout', 'clone', 'fetch', 'pull', 'push'];
    const onProgress = {
        type: 'spawn.after',
        action(_data, context) {
            var _a;
            if (!context.commands.includes(progressCommand)) {
                return;
            }
            (_a = context.spawned.stderr) === null || _a === void 0 ? void 0 : _a.on('data', (chunk) => {
                const message = /^([a-zA-Z ]+):\s*(\d+)% \((\d+)\/(\d+)\)/.exec(chunk.toString('utf8'));
                if (!message) {
                    return;
                }
                progress({
                    method: context.method,
                    stage: progressEventStage(message[1]),
                    progress: utils.asNumber(message[2]),
                    processed: utils.asNumber(message[3]),
                    total: utils.asNumber(message[4]),
                });
            });
        }
    };
    const onArgs = {
        type: 'spawn.args',
        action(args, context) {
            if (!progressMethods.includes(context.method)) {
                return args;
            }
            return utils.including(args, progressCommand);
        }
    };
    return [onArgs, onProgress];
}
exports.progressMonitorPlugin = progressMonitorPlugin;
function progressEventStage(input) {
    return String(input.toLowerCase().split(' ', 1)) || 'unknown';
}

});

var simpleGitPlugin = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

var spawnOptionsPlugin_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnOptionsPlugin = void 0;

function spawnOptionsPlugin(spawnOptions) {
    const options = utils.pick(spawnOptions, ['uid', 'gid']);
    return {
        type: 'spawn.options',
        action(data) {
            return Object.assign(Object.assign({}, options), data);
        },
    };
}
exports.spawnOptionsPlugin = spawnOptionsPlugin;

});

var timoutPlugin = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutPlugin = void 0;

function timeoutPlugin({ block }) {
    if (block > 0) {
        return {
            type: 'spawn.after',
            action(_data, context) {
                var _a, _b;
                let timeout;
                function wait() {
                    timeout && clearTimeout(timeout);
                    timeout = setTimeout(kill, block);
                }
                function stop() {
                    var _a, _b;
                    (_a = context.spawned.stdout) === null || _a === void 0 ? void 0 : _a.off('data', wait);
                    (_b = context.spawned.stderr) === null || _b === void 0 ? void 0 : _b.off('data', wait);
                    context.spawned.off('exit', stop);
                    context.spawned.off('close', stop);
                }
                function kill() {
                    stop();
                    context.kill(new gitPluginError.GitPluginError(undefined, 'timeout', `block timeout reached`));
                }
                (_a = context.spawned.stdout) === null || _a === void 0 ? void 0 : _a.on('data', wait);
                (_b = context.spawned.stderr) === null || _b === void 0 ? void 0 : _b.on('data', wait);
                context.spawned.on('exit', stop);
                context.spawned.on('close', stop);
                wait();
            }
        };
    }
}
exports.timeoutPlugin = timeoutPlugin;

});

var plugins = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(commandConfigPrefixingPlugin_1, exports);
__exportStar(errorDetection_plugin, exports);
__exportStar(pluginStore, exports);
__exportStar(progressMonitorPlugin_1, exports);
__exportStar(simpleGitPlugin, exports);
__exportStar(spawnOptionsPlugin_1, exports);
__exportStar(timoutPlugin, exports);

});

var gitLogger = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitLogger = exports.createLogger = void 0;


src$2.default.formatters.L = (value) => String(utils.filterHasLength(value) ? value.length : '-');
src$2.default.formatters.B = (value) => {
    if (Buffer.isBuffer(value)) {
        return value.toString('utf8');
    }
    return utils.objectToString(value);
};
function createLog() {
    return src$2.default('simple-git');
}
function prefixedLogger(to, prefix, forward) {
    if (!prefix || !String(prefix).replace(/\s*/, '')) {
        return !forward ? to : (message, ...args) => {
            to(message, ...args);
            forward(message, ...args);
        };
    }
    return (message, ...args) => {
        to(`%s ${message}`, prefix, ...args);
        if (forward) {
            forward(message, ...args);
        }
    };
}
function childLoggerName(name, childDebugger, { namespace: parentNamespace }) {
    if (typeof name === 'string') {
        return name;
    }
    const childNamespace = childDebugger && childDebugger.namespace || '';
    if (childNamespace.startsWith(parentNamespace)) {
        return childNamespace.substr(parentNamespace.length + 1);
    }
    return childNamespace || parentNamespace;
}
function createLogger(label, verbose, initialStep, infoDebugger = createLog()) {
    const labelPrefix = label && `[${label}]` || '';
    const spawned = [];
    const debugDebugger = (typeof verbose === 'string') ? infoDebugger.extend(verbose) : verbose;
    const key = childLoggerName(utils.filterType(verbose, utils.filterString), debugDebugger, infoDebugger);
    return step(initialStep);
    function sibling(name, initial) {
        return utils.append(spawned, createLogger(label, key.replace(/^[^:]+/, name), initial, infoDebugger));
    }
    function step(phase) {
        const stepPrefix = phase && `[${phase}]` || '';
        const debug = debugDebugger && prefixedLogger(debugDebugger, stepPrefix) || utils.NOOP;
        const info = prefixedLogger(infoDebugger, `${labelPrefix} ${stepPrefix}`, debug);
        return Object.assign(debugDebugger ? debug : info, {
            label,
            sibling,
            info,
            step,
        });
    }
}
exports.createLogger = createLogger;
/**
 * The `GitLogger` is used by the main `SimpleGit` runner to handle logging
 * any warnings or errors.
 */
class GitLogger {
    constructor(_out = createLog()) {
        this._out = _out;
        this.error = prefixedLogger(_out, '[ERROR]');
        this.warn = prefixedLogger(_out, '[WARN]');
    }
    silent(silence = false) {
        if (silence !== this._out.enabled) {
            return;
        }
        const { namespace } = this._out;
        const env = (process.env.DEBUG || '').split(',').filter(s => !!s);
        const hasOn = env.includes(namespace);
        const hasOff = env.includes(`-${namespace}`);
        // enabling the log
        if (!silence) {
            if (hasOff) {
                utils.remove(env, `-${namespace}`);
            }
            else {
                env.push(namespace);
            }
        }
        else {
            if (hasOn) {
                utils.remove(env, namespace);
            }
            else {
                env.push(`-${namespace}`);
            }
        }
        src$2.default.enable(env.join(','));
    }
}
exports.GitLogger = GitLogger;

});

var tasksPendingQueue = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksPendingQueue = void 0;


class TasksPendingQueue {
    constructor(logLabel = 'GitExecutor') {
        this.logLabel = logLabel;
        this._queue = new Map();
    }
    withProgress(task) {
        return this._queue.get(task);
    }
    createProgress(task) {
        const name = TasksPendingQueue.getName(task.commands[0]);
        const logger = gitLogger.createLogger(this.logLabel, name);
        return {
            task,
            logger,
            name,
        };
    }
    push(task) {
        const progress = this.createProgress(task);
        progress.logger('Adding task to the queue, commands = %o', task.commands);
        this._queue.set(task, progress);
        return progress;
    }
    fatal(err) {
        for (const [task, { logger }] of Array.from(this._queue.entries())) {
            if (task === err.task) {
                logger.info(`Failed %o`, err);
                logger(`Fatal exception, any as-yet un-started tasks run through this executor will not be attempted`);
            }
            else {
                logger.info(`A fatal exception occurred in a previous task, the queue has been purged: %o`, err.message);
            }
            this.complete(task);
        }
        if (this._queue.size !== 0) {
            throw new Error(`Queue size should be zero after fatal: ${this._queue.size}`);
        }
    }
    complete(task) {
        const progress = this.withProgress(task);
        if (progress) {
            this._queue.delete(task);
        }
    }
    attempt(task) {
        const progress = this.withProgress(task);
        if (!progress) {
            throw new gitError.GitError(undefined, 'TasksPendingQueue: attempt called for an unknown task');
        }
        progress.logger('Starting task');
        return progress;
    }
    static getName(name = 'empty') {
        return `task:${name}:${++TasksPendingQueue.counter}`;
    }
}
exports.TasksPendingQueue = TasksPendingQueue;
TasksPendingQueue.counter = 0;

});

var gitExecutorChain = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitExecutorChain = void 0;





class GitExecutorChain {
    constructor(_executor, _scheduler, _plugins) {
        this._executor = _executor;
        this._scheduler = _scheduler;
        this._plugins = _plugins;
        this._chain = Promise.resolve();
        this._queue = new tasksPendingQueue.TasksPendingQueue();
    }
    get binary() {
        return this._executor.binary;
    }
    get cwd() {
        return this._cwd || this._executor.cwd;
    }
    set cwd(cwd) {
        this._cwd = cwd;
    }
    get env() {
        return this._executor.env;
    }
    get outputHandler() {
        return this._executor.outputHandler;
    }
    chain() {
        return this;
    }
    push(task) {
        this._queue.push(task);
        return this._chain = this._chain.then(() => this.attemptTask(task));
    }
    attemptTask(task$1) {
        return __awaiter(this, void 0, void 0, function* () {
            const onScheduleComplete = yield this._scheduler.next();
            const onQueueComplete = () => this._queue.complete(task$1);
            try {
                const { logger } = this._queue.attempt(task$1);
                return yield (task.isEmptyTask(task$1)
                    ? this.attemptEmptyTask(task$1, logger)
                    : this.attemptRemoteTask(task$1, logger));
            }
            catch (e) {
                throw this.onFatalException(task$1, e);
            }
            finally {
                onQueueComplete();
                onScheduleComplete();
            }
        });
    }
    onFatalException(task, e) {
        const gitError$1 = (e instanceof gitError.GitError) ? Object.assign(e, { task }) : new gitError.GitError(task, e && String(e));
        this._chain = Promise.resolve();
        this._queue.fatal(gitError$1);
        return gitError$1;
    }
    attemptRemoteTask(task$1, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = this._plugins.exec('spawn.args', [...task$1.commands], pluginContext(task$1, task$1.commands));
            const raw = yield this.gitResponse(task$1, this.binary, args, this.outputHandler, logger.step('SPAWN'));
            const outputStreams = yield this.handleTaskData(task$1, args, raw, logger.step('HANDLE'));
            logger(`passing response to task's parser as a %s`, task$1.format);
            if (task.isBufferTask(task$1)) {
                return utils.callTaskParser(task$1.parser, outputStreams);
            }
            return utils.callTaskParser(task$1.parser, outputStreams.asStrings());
        });
    }
    attemptEmptyTask(task, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger(`empty task bypassing child process to call to task's parser`);
            return task.parser(this);
        });
    }
    handleTaskData(task, args, result, logger) {
        const { exitCode, rejection, stdOut, stdErr } = result;
        return new Promise((done, fail) => {
            logger(`Preparing to handle process response exitCode=%d stdOut=`, exitCode);
            const { error } = this._plugins.exec('task.error', { error: rejection }, Object.assign(Object.assign({}, pluginContext(task, args)), result));
            if (error && task.onError) {
                logger.info(`exitCode=%s handling with custom error handler`);
                return task.onError(result, error, (newStdOut) => {
                    logger.info(`custom error handler treated as success`);
                    logger(`custom error returned a %s`, utils.objectToString(newStdOut));
                    done(new utils.GitOutputStreams(Array.isArray(newStdOut) ? Buffer.concat(newStdOut) : newStdOut, Buffer.concat(stdErr)));
                }, fail);
            }
            if (error) {
                logger.info(`handling as error: exitCode=%s stdErr=%s rejection=%o`, exitCode, stdErr.length, rejection);
                return fail(error);
            }
            logger.info(`retrieving task output complete`);
            done(new utils.GitOutputStreams(Buffer.concat(stdOut), Buffer.concat(stdErr)));
        });
    }
    gitResponse(task, command, args, outputHandler, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputLogger = logger.sibling('output');
            const spawnOptions = this._plugins.exec('spawn.options', {
                cwd: this.cwd,
                env: this.env,
                windowsHide: true,
            }, pluginContext(task, task.commands));
            return new Promise((done) => {
                const stdOut = [];
                const stdErr = [];
                let attempted = false;
                let rejection;
                function attemptClose(exitCode, event = 'retry') {
                    // closing when there is content, terminate immediately
                    if (attempted || stdErr.length || stdOut.length) {
                        logger.info(`exitCode=%s event=%s rejection=%o`, exitCode, event, rejection);
                        done({
                            stdOut,
                            stdErr,
                            exitCode,
                            rejection,
                        });
                        attempted = true;
                    }
                    // first attempt at closing but no content yet, wait briefly for the close/exit that may follow
                    if (!attempted) {
                        attempted = true;
                        setTimeout(() => attemptClose(exitCode, 'deferred'), 50);
                        logger('received %s event before content on stdOut/stdErr', event);
                    }
                }
                logger.info(`%s %o`, command, args);
                logger('%O', spawnOptions);
                const spawned = child_process_1__default['default'].spawn(command, args, spawnOptions);
                spawned.stdout.on('data', onDataReceived(stdOut, 'stdOut', logger, outputLogger.step('stdOut')));
                spawned.stderr.on('data', onDataReceived(stdErr, 'stdErr', logger, outputLogger.step('stdErr')));
                spawned.on('error', onErrorReceived(stdErr, logger));
                spawned.on('close', (code) => attemptClose(code, 'close'));
                spawned.on('exit', (code) => attemptClose(code, 'exit'));
                if (outputHandler) {
                    logger(`Passing child process stdOut/stdErr to custom outputHandler`);
                    outputHandler(command, spawned.stdout, spawned.stderr, [...args]);
                }
                this._plugins.exec('spawn.after', undefined, Object.assign(Object.assign({}, pluginContext(task, args)), { spawned, kill(reason) {
                        if (spawned.killed) {
                            return;
                        }
                        rejection = reason;
                        spawned.kill('SIGINT');
                    } }));
            });
        });
    }
}
exports.GitExecutorChain = GitExecutorChain;
function pluginContext(task, commands) {
    return {
        method: utils.first(task.commands) || '',
        commands,
    };
}
function onErrorReceived(target, logger) {
    return (err) => {
        logger(`[ERROR] child process exception %o`, err);
        target.push(Buffer.from(String(err.stack), 'ascii'));
    };
}
function onDataReceived(target, name, logger, output) {
    return (buffer) => {
        logger(`%s received %L bytes`, name, buffer);
        output(`%B`, buffer);
        target.push(buffer);
    };
}

});

var gitExecutor = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitExecutor = void 0;

class GitExecutor {
    constructor(binary = 'git', cwd, _scheduler, _plugins) {
        this.binary = binary;
        this.cwd = cwd;
        this._scheduler = _scheduler;
        this._plugins = _plugins;
        this._chain = new gitExecutorChain.GitExecutorChain(this, this._scheduler, this._plugins);
    }
    chain() {
        return new gitExecutorChain.GitExecutorChain(this, this._scheduler, this._plugins);
    }
    push(task) {
        return this._chain.push(task);
    }
}
exports.GitExecutor = GitExecutor;

});

var taskCallback_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskCallback = void 0;


function taskCallback(task, response, callback = utils.NOOP) {
    const onSuccess = (data) => {
        callback(null, data);
    };
    const onError = (err) => {
        if ((err === null || err === void 0 ? void 0 : err.task) === task) {
            callback((err instanceof gitResponseError.GitResponseError) ? addDeprecationNoticeToError(err) : err, undefined);
        }
    };
    response.then(onSuccess, onError);
}
exports.taskCallback = taskCallback;
function addDeprecationNoticeToError(err) {
    let log = (name) => {
        console.warn(`simple-git deprecation notice: accessing GitResponseError.${name} should be GitResponseError.git.${name}, this will no longer be available in version 3`);
        log = utils.NOOP;
    };
    return Object.create(err, Object.getOwnPropertyNames(err.git).reduce(descriptorReducer, {}));
    function descriptorReducer(all, name) {
        if (name in err) {
            return all;
        }
        all[name] = {
            enumerable: false,
            configurable: false,
            get() {
                log(name);
                return err.git[name];
            },
        };
        return all;
    }
}

});

var changeWorkingDirectory = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeWorkingDirectoryTask = void 0;


function changeWorkingDirectoryTask(directory, root) {
    return task.adhocExecTask((instance) => {
        if (!utils.folderExists(directory)) {
            throw new Error(`Git.cwd: cannot change to non-directory "${directory}"`);
        }
        return ((root || instance).cwd = directory);
    });
}
exports.changeWorkingDirectoryTask = changeWorkingDirectoryTask;

});

var hashObject = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashObjectTask = void 0;

/**
 * Task used by `git.hashObject`
 */
function hashObjectTask(filePath, write) {
    const commands = ['hash-object', filePath];
    if (write) {
        commands.push('-w');
    }
    return task.straightThroughStringTask(commands, true);
}
exports.hashObjectTask = hashObjectTask;

});

var InitSummary_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInit = exports.InitSummary = void 0;
class InitSummary {
    constructor(bare, path, existing, gitDir) {
        this.bare = bare;
        this.path = path;
        this.existing = existing;
        this.gitDir = gitDir;
    }
}
exports.InitSummary = InitSummary;
const initResponseRegex = /^Init.+ repository in (.+)$/;
const reInitResponseRegex = /^Rein.+ in (.+)$/;
function parseInit(bare, path, text) {
    const response = String(text).trim();
    let result;
    if ((result = initResponseRegex.exec(response))) {
        return new InitSummary(bare, path, false, result[1]);
    }
    if ((result = reInitResponseRegex.exec(response))) {
        return new InitSummary(bare, path, true, result[1]);
    }
    let gitDir = '';
    const tokens = response.split(' ');
    while (tokens.length) {
        const token = tokens.shift();
        if (token === 'in') {
            gitDir = tokens.join(' ');
            break;
        }
    }
    return new InitSummary(bare, path, /^re/i.test(response), gitDir);
}
exports.parseInit = parseInit;

});

var init = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTask = void 0;

const bareCommand = '--bare';
function hasBareCommand(command) {
    return command.includes(bareCommand);
}
function initTask(bare = false, path, customArgs) {
    const commands = ['init', ...customArgs];
    if (bare && !hasBareCommand(commands)) {
        commands.splice(1, 0, bareCommand);
    }
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return InitSummary_1.parseInit(commands.includes('--bare'), path, text);
        }
    };
}
exports.initTask = initTask;

});

var DiffSummary_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffSummary = void 0;
/***
 * The DiffSummary is returned as a response to getting `git().status()`
 */
class DiffSummary {
    constructor() {
        this.changed = 0;
        this.deletions = 0;
        this.insertions = 0;
        this.files = [];
    }
}
exports.DiffSummary = DiffSummary;

});

var parseDiffSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDiffResult = void 0;

function parseDiffResult(stdOut) {
    const lines = stdOut.trim().split('\n');
    const status = new DiffSummary_1.DiffSummary();
    readSummaryLine(status, lines.pop());
    for (let i = 0, max = lines.length; i < max; i++) {
        const line = lines[i];
        textFileChange(line, status) || binaryFileChange(line, status);
    }
    return status;
}
exports.parseDiffResult = parseDiffResult;
function readSummaryLine(status, summary) {
    (summary || '')
        .trim()
        .split(', ')
        .forEach(function (text) {
        const summary = /(\d+)\s([a-z]+)/.exec(text);
        if (!summary) {
            return;
        }
        summaryType(status, summary[2], parseInt(summary[1], 10));
    });
}
function summaryType(status, key, value) {
    const match = (/([a-z]+?)s?\b/.exec(key));
    if (!match || !statusUpdate[match[1]]) {
        return;
    }
    statusUpdate[match[1]](status, value);
}
const statusUpdate = {
    file(status, value) {
        status.changed = value;
    },
    deletion(status, value) {
        status.deletions = value;
    },
    insertion(status, value) {
        status.insertions = value;
    }
};
function textFileChange(input, { files }) {
    const line = input.trim().match(/^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/);
    if (line) {
        var alterations = (line[3] || '').trim();
        files.push({
            file: line[1].trim(),
            changes: parseInt(line[2], 10),
            insertions: alterations.replace(/-/g, '').length,
            deletions: alterations.replace(/\+/g, '').length,
            binary: false
        });
        return true;
    }
    return false;
}
function binaryFileChange(input, { files }) {
    const line = input.match(/^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)$/);
    if (line) {
        files.push({
            file: line[1].trim(),
            before: +line[2],
            after: +line[3],
            binary: true
        });
        return true;
    }
    return false;
}

});

var parseListLogSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListLogSummaryParser = exports.SPLITTER = exports.COMMIT_BOUNDARY = exports.START_BOUNDARY = void 0;


exports.START_BOUNDARY = 'òòòòòò ';
exports.COMMIT_BOUNDARY = ' òò';
exports.SPLITTER = ' ò ';
const defaultFieldNames = ['hash', 'date', 'message', 'refs', 'author_name', 'author_email'];
function lineBuilder(tokens, fields) {
    return fields.reduce((line, field, index) => {
        line[field] = tokens[index] || '';
        return line;
    }, Object.create({ diff: null }));
}
function createListLogSummaryParser(splitter = exports.SPLITTER, fields = defaultFieldNames) {
    return function (stdOut) {
        const all = utils.toLinesWithContent(stdOut, true, exports.START_BOUNDARY)
            .map(function (item) {
            const lineDetail = item.trim().split(exports.COMMIT_BOUNDARY);
            const listLogLine = lineBuilder(lineDetail[0].trim().split(splitter), fields);
            if (lineDetail.length > 1 && !!lineDetail[1].trim()) {
                listLogLine.diff = parseDiffSummary.parseDiffResult(lineDetail[1]);
            }
            return listLogLine;
        });
        return {
            all,
            latest: all.length && all[0] || null,
            total: all.length,
        };
    };
}
exports.createListLogSummaryParser = createListLogSummaryParser;

});

var log = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTask = exports.parseLogOptions = void 0;



var excludeOptions;
(function (excludeOptions) {
    excludeOptions[excludeOptions["--pretty"] = 0] = "--pretty";
    excludeOptions[excludeOptions["max-count"] = 1] = "max-count";
    excludeOptions[excludeOptions["maxCount"] = 2] = "maxCount";
    excludeOptions[excludeOptions["n"] = 3] = "n";
    excludeOptions[excludeOptions["file"] = 4] = "file";
    excludeOptions[excludeOptions["format"] = 5] = "format";
    excludeOptions[excludeOptions["from"] = 6] = "from";
    excludeOptions[excludeOptions["to"] = 7] = "to";
    excludeOptions[excludeOptions["splitter"] = 8] = "splitter";
    excludeOptions[excludeOptions["symmetric"] = 9] = "symmetric";
    excludeOptions[excludeOptions["multiLine"] = 10] = "multiLine";
    excludeOptions[excludeOptions["strictDate"] = 11] = "strictDate";
})(excludeOptions || (excludeOptions = {}));
function prettyFormat(format, splitter) {
    const fields = [];
    const formatStr = [];
    Object.keys(format).forEach((field) => {
        fields.push(field);
        formatStr.push(String(format[field]));
    });
    return [
        fields, formatStr.join(splitter)
    ];
}
function userOptions(input) {
    const output = Object.assign({}, input);
    Object.keys(input).forEach(key => {
        if (key in excludeOptions) {
            delete output[key];
        }
    });
    return output;
}
function parseLogOptions(opt = {}, customArgs = []) {
    const splitter = opt.splitter || parseListLogSummary.SPLITTER;
    const format = opt.format || {
        hash: '%H',
        date: opt.strictDate === false ? '%ai' : '%aI',
        message: '%s',
        refs: '%D',
        body: opt.multiLine ? '%B' : '%b',
        author_name: '%aN',
        author_email: '%ae'
    };
    const [fields, formatStr] = prettyFormat(format, splitter);
    const suffix = [];
    const command = [
        `--pretty=format:${parseListLogSummary.START_BOUNDARY}${formatStr}${parseListLogSummary.COMMIT_BOUNDARY}`,
        ...customArgs,
    ];
    const maxCount = opt.n || opt['max-count'] || opt.maxCount;
    if (maxCount) {
        command.push(`--max-count=${maxCount}`);
    }
    if (opt.from && opt.to) {
        const rangeOperator = (opt.symmetric !== false) ? '...' : '..';
        suffix.push(`${opt.from}${rangeOperator}${opt.to}`);
    }
    if (opt.file) {
        suffix.push('--follow', opt.file);
    }
    utils.appendTaskOptions(userOptions(opt), command);
    return {
        fields,
        splitter,
        commands: [
            ...command,
            ...suffix,
        ],
    };
}
exports.parseLogOptions = parseLogOptions;
function logTask(splitter, fields, customArgs) {
    return {
        commands: ['log', ...customArgs],
        format: 'utf-8',
        parser: parseListLogSummary.createListLogSummaryParser(splitter, fields),
    };
}
exports.logTask = logTask;
function default_1() {
    return {
        log(...rest) {
            const next = utils.trailingFunctionArgument(arguments);
            const task = rejectDeprecatedSignatures(...rest) ||
                createLogTask(parseLogOptions(utils.trailingOptionsArgument(arguments), utils.filterType(arguments[0], utils.filterArray)));
            return this._runTask(task, next);
        }
    };
    function createLogTask(options) {
        return logTask(options.splitter, options.fields, options.commands);
    }
    function rejectDeprecatedSignatures(from, to) {
        return (utils.filterString(from) &&
            utils.filterString(to) &&
            task.configurationErrorTask(`git.log(string, string) should be replaced with git.log({ from: string, to: string })`));
    }
}
exports.default = default_1;

});

var MergeSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeSummaryDetail = exports.MergeSummaryConflict = void 0;
class MergeSummaryConflict {
    constructor(reason, file = null, meta) {
        this.reason = reason;
        this.file = file;
        this.meta = meta;
    }
    toString() {
        return `${this.file}:${this.reason}`;
    }
}
exports.MergeSummaryConflict = MergeSummaryConflict;
class MergeSummaryDetail {
    constructor() {
        this.conflicts = [];
        this.merges = [];
        this.result = 'success';
    }
    get failed() {
        return this.conflicts.length > 0;
    }
    get reason() {
        return this.result;
    }
    toString() {
        if (this.conflicts.length) {
            return `CONFLICTS: ${this.conflicts.join(', ')}`;
        }
        return 'OK';
    }
}
exports.MergeSummaryDetail = MergeSummaryDetail;

});

var PullSummary_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullSummary = void 0;
class PullSummary {
    constructor() {
        this.remoteMessages = {
            all: [],
        };
        this.created = [];
        this.deleted = [];
        this.files = [];
        this.deletions = {};
        this.insertions = {};
        this.summary = {
            changes: 0,
            deletions: 0,
            insertions: 0,
        };
    }
}
exports.PullSummary = PullSummary;

});

var parseRemoteObjects = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.remoteMessagesObjectParsers = void 0;

function objectEnumerationResult(remoteMessages) {
    return (remoteMessages.objects = remoteMessages.objects || {
        compressing: 0,
        counting: 0,
        enumerating: 0,
        packReused: 0,
        reused: { count: 0, delta: 0 },
        total: { count: 0, delta: 0 }
    });
}
function asObjectCount(source) {
    const count = /^\s*(\d+)/.exec(source);
    const delta = /delta (\d+)/i.exec(source);
    return {
        count: utils.asNumber(count && count[1] || '0'),
        delta: utils.asNumber(delta && delta[1] || '0'),
    };
}
exports.remoteMessagesObjectParsers = [
    new utils.RemoteLineParser(/^remote:\s*(enumerating|counting|compressing) objects: (\d+),/i, (result, [action, count]) => {
        const key = action.toLowerCase();
        const enumeration = objectEnumerationResult(result.remoteMessages);
        Object.assign(enumeration, { [key]: utils.asNumber(count) });
    }),
    new utils.RemoteLineParser(/^remote:\s*(enumerating|counting|compressing) objects: \d+% \(\d+\/(\d+)\),/i, (result, [action, count]) => {
        const key = action.toLowerCase();
        const enumeration = objectEnumerationResult(result.remoteMessages);
        Object.assign(enumeration, { [key]: utils.asNumber(count) });
    }),
    new utils.RemoteLineParser(/total ([^,]+), reused ([^,]+), pack-reused (\d+)/i, (result, [total, reused, packReused]) => {
        const objects = objectEnumerationResult(result.remoteMessages);
        objects.total = asObjectCount(total);
        objects.reused = asObjectCount(reused);
        objects.packReused = utils.asNumber(packReused);
    }),
];

});

var parseRemoteMessages_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteMessageSummary = exports.parseRemoteMessages = void 0;


const parsers = [
    new utils.RemoteLineParser(/^remote:\s*(.+)$/, (result, [text]) => {
        result.remoteMessages.all.push(text.trim());
        return false;
    }),
    ...parseRemoteObjects.remoteMessagesObjectParsers,
    new utils.RemoteLineParser([/create a (?:pull|merge) request/i, /\s(https?:\/\/\S+)$/], (result, [pullRequestUrl]) => {
        result.remoteMessages.pullRequestUrl = pullRequestUrl;
    }),
    new utils.RemoteLineParser([/found (\d+) vulnerabilities.+\(([^)]+)\)/i, /\s(https?:\/\/\S+)$/], (result, [count, summary, url]) => {
        result.remoteMessages.vulnerabilities = {
            count: utils.asNumber(count),
            summary,
            url,
        };
    }),
];
function parseRemoteMessages(_stdOut, stdErr) {
    return utils.parseStringResponse({ remoteMessages: new RemoteMessageSummary() }, parsers, stdErr);
}
exports.parseRemoteMessages = parseRemoteMessages;
class RemoteMessageSummary {
    constructor() {
        this.all = [];
    }
}
exports.RemoteMessageSummary = RemoteMessageSummary;

});

var parsePull = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePullResult = exports.parsePullDetail = void 0;



const FILE_UPDATE_REGEX = /^\s*(.+?)\s+\|\s+\d+\s*(\+*)(-*)/;
const SUMMARY_REGEX = /(\d+)\D+((\d+)\D+\(\+\))?(\D+(\d+)\D+\(-\))?/;
const ACTION_REGEX = /^(create|delete) mode \d+ (.+)/;
const parsers = [
    new utils.LineParser(FILE_UPDATE_REGEX, (result, [file, insertions, deletions]) => {
        result.files.push(file);
        if (insertions) {
            result.insertions[file] = insertions.length;
        }
        if (deletions) {
            result.deletions[file] = deletions.length;
        }
    }),
    new utils.LineParser(SUMMARY_REGEX, (result, [changes, , insertions, , deletions]) => {
        if (insertions !== undefined || deletions !== undefined) {
            result.summary.changes = +changes || 0;
            result.summary.insertions = +insertions || 0;
            result.summary.deletions = +deletions || 0;
            return true;
        }
        return false;
    }),
    new utils.LineParser(ACTION_REGEX, (result, [action, file]) => {
        utils.append(result.files, file);
        utils.append((action === 'create') ? result.created : result.deleted, file);
    }),
];
const parsePullDetail = (stdOut, stdErr) => {
    return utils.parseStringResponse(new PullSummary_1.PullSummary(), parsers, stdOut, stdErr);
};
exports.parsePullDetail = parsePullDetail;
const parsePullResult = (stdOut, stdErr) => {
    return Object.assign(new PullSummary_1.PullSummary(), exports.parsePullDetail(stdOut, stdErr), parseRemoteMessages_1.parseRemoteMessages(stdOut, stdErr));
};
exports.parsePullResult = parsePullResult;

});

var parseMerge = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMergeDetail = exports.parseMergeResult = void 0;



const parsers = [
    new utils.LineParser(/^Auto-merging\s+(.+)$/, (summary, [autoMerge]) => {
        summary.merges.push(autoMerge);
    }),
    new utils.LineParser(/^CONFLICT\s+\((.+)\): Merge conflict in (.+)$/, (summary, [reason, file]) => {
        summary.conflicts.push(new MergeSummary.MergeSummaryConflict(reason, file));
    }),
    new utils.LineParser(/^CONFLICT\s+\((.+\/delete)\): (.+) deleted in (.+) and/, (summary, [reason, file, deleteRef]) => {
        summary.conflicts.push(new MergeSummary.MergeSummaryConflict(reason, file, { deleteRef }));
    }),
    new utils.LineParser(/^CONFLICT\s+\((.+)\):/, (summary, [reason]) => {
        summary.conflicts.push(new MergeSummary.MergeSummaryConflict(reason, null));
    }),
    new utils.LineParser(/^Automatic merge failed;\s+(.+)$/, (summary, [result]) => {
        summary.result = result;
    }),
];
/**
 * Parse the complete response from `git.merge`
 */
const parseMergeResult = (stdOut, stdErr) => {
    return Object.assign(exports.parseMergeDetail(stdOut, stdErr), parsePull.parsePullResult(stdOut, stdErr));
};
exports.parseMergeResult = parseMergeResult;
/**
 * Parse the merge specific detail (ie: not the content also available in the pull detail) from `git.mnerge`
 * @param stdOut
 */
const parseMergeDetail = (stdOut) => {
    return utils.parseStringResponse(new MergeSummary.MergeSummaryDetail(), parsers, stdOut);
};
exports.parseMergeDetail = parseMergeDetail;

});

var merge = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeTask = void 0;



function mergeTask(customArgs) {
    if (!customArgs.length) {
        return task.configurationErrorTask('Git.merge requires at least one option');
    }
    return {
        commands: ['merge', ...customArgs],
        format: 'utf-8',
        parser(stdOut, stdErr) {
            const merge = parseMerge.parseMergeResult(stdOut, stdErr);
            if (merge.failed) {
                throw new gitResponseError.GitResponseError(merge);
            }
            return merge;
        }
    };
}
exports.mergeTask = mergeTask;

});

var parsePush = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePushDetail = exports.parsePushResult = void 0;


function pushResultPushedItem(local, remote, status) {
    const deleted = status.includes('deleted');
    const tag = status.includes('tag') || /^refs\/tags/.test(local);
    const alreadyUpdated = !status.includes('new');
    return {
        deleted,
        tag,
        branch: !tag,
        new: !alreadyUpdated,
        alreadyUpdated,
        local,
        remote,
    };
}
const parsers = [
    new utils.LineParser(/^Pushing to (.+)$/, (result, [repo]) => {
        result.repo = repo;
    }),
    new utils.LineParser(/^updating local tracking ref '(.+)'/, (result, [local]) => {
        result.ref = Object.assign(Object.assign({}, (result.ref || {})), { local });
    }),
    new utils.LineParser(/^[*-=]\s+([^:]+):(\S+)\s+\[(.+)]$/, (result, [local, remote, type]) => {
        result.pushed.push(pushResultPushedItem(local, remote, type));
    }),
    new utils.LineParser(/^Branch '([^']+)' set up to track remote branch '([^']+)' from '([^']+)'/, (result, [local, remote, remoteName]) => {
        result.branch = Object.assign(Object.assign({}, (result.branch || {})), { local,
            remote,
            remoteName });
    }),
    new utils.LineParser(/^([^:]+):(\S+)\s+([a-z0-9]+)\.\.([a-z0-9]+)$/, (result, [local, remote, from, to]) => {
        result.update = {
            head: {
                local,
                remote,
            },
            hash: {
                from,
                to,
            },
        };
    }),
];
const parsePushResult = (stdOut, stdErr) => {
    const pushDetail = exports.parsePushDetail(stdOut, stdErr);
    const responseDetail = parseRemoteMessages_1.parseRemoteMessages(stdOut, stdErr);
    return Object.assign(Object.assign({}, pushDetail), responseDetail);
};
exports.parsePushResult = parsePushResult;
const parsePushDetail = (stdOut, stdErr) => {
    return utils.parseStringResponse({ pushed: [] }, parsers, stdOut, stdErr);
};
exports.parsePushDetail = parsePushDetail;

});

var push = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushTask = exports.pushTagsTask = void 0;


function pushTagsTask(ref = {}, customArgs) {
    utils.append(customArgs, '--tags');
    return pushTask(ref, customArgs);
}
exports.pushTagsTask = pushTagsTask;
function pushTask(ref = {}, customArgs) {
    const commands = ['push', ...customArgs];
    if (ref.branch) {
        commands.splice(1, 0, ref.branch);
    }
    if (ref.remote) {
        commands.splice(1, 0, ref.remote);
    }
    utils.remove(commands, '-v');
    utils.append(commands, '--verbose');
    utils.append(commands, '--porcelain');
    return {
        commands,
        format: 'utf-8',
        parser: parsePush.parsePushResult,
    };
}
exports.pushTask = pushTask;

});

var FileStatusSummary_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStatusSummary = exports.fromPathRegex = void 0;
exports.fromPathRegex = /^(.+) -> (.+)$/;
class FileStatusSummary {
    constructor(path, index, working_dir) {
        this.path = path;
        this.index = index;
        this.working_dir = working_dir;
        if ('R' === (index + working_dir)) {
            const detail = exports.fromPathRegex.exec(path) || [null, path, path];
            this.from = detail[1] || '';
            this.path = detail[2] || '';
        }
    }
}
exports.FileStatusSummary = FileStatusSummary;

});

var StatusSummary_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStatusSummary = exports.StatusSummary = void 0;


/**
 * The StatusSummary is returned as a response to getting `git().status()`
 */
class StatusSummary {
    constructor() {
        this.not_added = [];
        this.conflicted = [];
        this.created = [];
        this.deleted = [];
        this.modified = [];
        this.renamed = [];
        /**
         * All files represented as an array of objects containing the `path` and status in `index` and
         * in the `working_dir`.
         */
        this.files = [];
        this.staged = [];
        /**
         * Number of commits ahead of the tracked branch
         */
        this.ahead = 0;
        /**
         *Number of commits behind the tracked branch
         */
        this.behind = 0;
        /**
         * Name of the current branch
         */
        this.current = null;
        /**
         * Name of the branch being tracked
         */
        this.tracking = null;
    }
    /**
     * Gets whether this StatusSummary represents a clean working branch.
     */
    isClean() {
        return !this.files.length;
    }
}
exports.StatusSummary = StatusSummary;
var PorcelainFileStatus;
(function (PorcelainFileStatus) {
    PorcelainFileStatus["ADDED"] = "A";
    PorcelainFileStatus["DELETED"] = "D";
    PorcelainFileStatus["MODIFIED"] = "M";
    PorcelainFileStatus["RENAMED"] = "R";
    PorcelainFileStatus["COPIED"] = "C";
    PorcelainFileStatus["UNMERGED"] = "U";
    PorcelainFileStatus["UNTRACKED"] = "?";
    PorcelainFileStatus["IGNORED"] = "!";
    PorcelainFileStatus["NONE"] = " ";
})(PorcelainFileStatus || (PorcelainFileStatus = {}));
function renamedFile(line) {
    const detail = /^(.+) -> (.+)$/.exec(line);
    if (!detail) {
        return {
            from: line, to: line
        };
    }
    return {
        from: String(detail[1]),
        to: String(detail[2]),
    };
}
function parser(indexX, indexY, handler) {
    return [`${indexX}${indexY}`, handler];
}
function conflicts(indexX, ...indexY) {
    return indexY.map(y => parser(indexX, y, (result, file) => utils.append(result.conflicted, file)));
}
const parsers = new Map([
    parser(PorcelainFileStatus.NONE, PorcelainFileStatus.ADDED, (result, file) => utils.append(result.created, file)),
    parser(PorcelainFileStatus.NONE, PorcelainFileStatus.DELETED, (result, file) => utils.append(result.deleted, file)),
    parser(PorcelainFileStatus.NONE, PorcelainFileStatus.MODIFIED, (result, file) => utils.append(result.modified, file)),
    parser(PorcelainFileStatus.ADDED, PorcelainFileStatus.NONE, (result, file) => utils.append(result.created, file) && utils.append(result.staged, file)),
    parser(PorcelainFileStatus.ADDED, PorcelainFileStatus.MODIFIED, (result, file) => utils.append(result.created, file) && utils.append(result.staged, file) && utils.append(result.modified, file)),
    parser(PorcelainFileStatus.DELETED, PorcelainFileStatus.NONE, (result, file) => utils.append(result.deleted, file) && utils.append(result.staged, file)),
    parser(PorcelainFileStatus.MODIFIED, PorcelainFileStatus.NONE, (result, file) => utils.append(result.modified, file) && utils.append(result.staged, file)),
    parser(PorcelainFileStatus.MODIFIED, PorcelainFileStatus.MODIFIED, (result, file) => utils.append(result.modified, file) && utils.append(result.staged, file)),
    parser(PorcelainFileStatus.RENAMED, PorcelainFileStatus.NONE, (result, file) => {
        utils.append(result.renamed, renamedFile(file));
    }),
    parser(PorcelainFileStatus.RENAMED, PorcelainFileStatus.MODIFIED, (result, file) => {
        const renamed = renamedFile(file);
        utils.append(result.renamed, renamed);
        utils.append(result.modified, renamed.to);
    }),
    parser(PorcelainFileStatus.UNTRACKED, PorcelainFileStatus.UNTRACKED, (result, file) => utils.append(result.not_added, file)),
    ...conflicts(PorcelainFileStatus.ADDED, PorcelainFileStatus.ADDED, PorcelainFileStatus.UNMERGED),
    ...conflicts(PorcelainFileStatus.DELETED, PorcelainFileStatus.DELETED, PorcelainFileStatus.UNMERGED),
    ...conflicts(PorcelainFileStatus.UNMERGED, PorcelainFileStatus.ADDED, PorcelainFileStatus.DELETED, PorcelainFileStatus.UNMERGED),
    ['##', (result, line) => {
            const aheadReg = /ahead (\d+)/;
            const behindReg = /behind (\d+)/;
            const currentReg = /^(.+?(?=(?:\.{3}|\s|$)))/;
            const trackingReg = /\.{3}(\S*)/;
            const onEmptyBranchReg = /\son\s([\S]+)$/;
            let regexResult;
            regexResult = aheadReg.exec(line);
            result.ahead = regexResult && +regexResult[1] || 0;
            regexResult = behindReg.exec(line);
            result.behind = regexResult && +regexResult[1] || 0;
            regexResult = currentReg.exec(line);
            result.current = regexResult && regexResult[1];
            regexResult = trackingReg.exec(line);
            result.tracking = regexResult && regexResult[1];
            regexResult = onEmptyBranchReg.exec(line);
            result.current = regexResult && regexResult[1] || result.current;
        }]
]);
const parseStatusSummary = function (text) {
    const lines = text.trim().split('\n');
    const status = new StatusSummary();
    for (let i = 0, l = lines.length; i < l; i++) {
        splitLine(status, lines[i]);
    }
    return status;
};
exports.parseStatusSummary = parseStatusSummary;
function splitLine(result, lineStr) {
    const trimmed = lineStr.trim();
    switch (' ') {
        case trimmed.charAt(2):
            return data(trimmed.charAt(0), trimmed.charAt(1), trimmed.substr(3));
        case trimmed.charAt(1):
            return data(PorcelainFileStatus.NONE, trimmed.charAt(0), trimmed.substr(2));
        default:
            return;
    }
    function data(index, workingDir, path) {
        const raw = `${index}${workingDir}`;
        const handler = parsers.get(raw);
        if (handler) {
            handler(result, path);
        }
        if (raw !== '##') {
            result.files.push(new FileStatusSummary_1.FileStatusSummary(path, index, workingDir));
        }
    }
}

});

var status = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusTask = void 0;

function statusTask(customArgs) {
    return {
        format: 'utf-8',
        commands: ['status', '--porcelain', '-b', '-u', ...customArgs],
        parser(text) {
            return StatusSummary_1.parseStatusSummary(text);
        }
    };
}
exports.statusTask = statusTask;

});

var simpleGitApi = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleGitApi = void 0;











class SimpleGitApi {
    constructor(_executor) {
        this._executor = _executor;
    }
    _runTask(task, then) {
        const chain = this._executor.chain();
        const promise = chain.push(task);
        if (then) {
            taskCallback_1.taskCallback(task, promise, then);
        }
        return Object.create(this, {
            then: { value: promise.then.bind(promise) },
            catch: { value: promise.catch.bind(promise) },
            _executor: { value: chain },
        });
    }
    add(files) {
        return this._runTask(task.straightThroughStringTask(['add', ...utils.asArray(files)]), utils.trailingFunctionArgument(arguments));
    }
    cwd(directory) {
        const next = utils.trailingFunctionArgument(arguments);
        if (typeof directory === 'string') {
            return this._runTask(changeWorkingDirectory.changeWorkingDirectoryTask(directory, this._executor), next);
        }
        if (typeof (directory === null || directory === void 0 ? void 0 : directory.path) === 'string') {
            return this._runTask(changeWorkingDirectory.changeWorkingDirectoryTask(directory.path, directory.root && this._executor || undefined), next);
        }
        return this._runTask(task.configurationErrorTask('Git.cwd: workingDirectory must be supplied as a string'), next);
    }
    hashObject(path, write) {
        return this._runTask(hashObject.hashObjectTask(path, write === true), utils.trailingFunctionArgument(arguments));
    }
    init(bare) {
        return this._runTask(init.initTask(bare === true, this._executor.cwd, utils.getTrailingOptions(arguments)), utils.trailingFunctionArgument(arguments));
    }
    merge() {
        return this._runTask(merge.mergeTask(utils.getTrailingOptions(arguments)), utils.trailingFunctionArgument(arguments));
    }
    mergeFromTo(remote, branch) {
        if (!(utils.filterString(remote) && utils.filterString(branch))) {
            return this._runTask(task.configurationErrorTask(`Git.mergeFromTo requires that the 'remote' and 'branch' arguments are supplied as strings`));
        }
        return this._runTask(merge.mergeTask([remote, branch, ...utils.getTrailingOptions(arguments)]), utils.trailingFunctionArgument(arguments, false));
    }
    outputHandler(handler) {
        this._executor.outputHandler = handler;
        return this;
    }
    push() {
        const task = push.pushTask({
            remote: utils.filterType(arguments[0], utils.filterString),
            branch: utils.filterType(arguments[1], utils.filterString),
        }, utils.getTrailingOptions(arguments));
        return this._runTask(task, utils.trailingFunctionArgument(arguments));
    }
    stash() {
        return this._runTask(task.straightThroughStringTask(['stash', ...utils.getTrailingOptions(arguments)]), utils.trailingFunctionArgument(arguments));
    }
    status() {
        return this._runTask(status.statusTask(utils.getTrailingOptions(arguments)), utils.trailingFunctionArgument(arguments));
    }
}
exports.SimpleGitApi = SimpleGitApi;
Object.assign(SimpleGitApi.prototype, config.default(), log.default());

});

var dist = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeferred = exports.deferred = void 0;
/**
 * Creates a new `DeferredPromise`
 *
 * ```typescript
 import {deferred} from '@kwsites/promise-deferred`;
 ```
 */
function deferred() {
    let done;
    let fail;
    let status = 'pending';
    const promise = new Promise((_done, _fail) => {
        done = _done;
        fail = _fail;
    });
    return {
        promise,
        done(result) {
            if (status === 'pending') {
                status = 'resolved';
                done(result);
            }
        },
        fail(error) {
            if (status === 'pending') {
                status = 'rejected';
                fail(error);
            }
        },
        get fulfilled() {
            return status !== 'pending';
        },
        get status() {
            return status;
        },
    };
}
exports.deferred = deferred;
/**
 * Alias of the exported `deferred` function, to help consumers wanting to use `deferred` as the
 * local variable name rather than the factory import name, without needing to rename on import.
 *
 * ```typescript
 import {createDeferred} from '@kwsites/promise-deferred`;
 ```
 */
exports.createDeferred = deferred;
/**
 * Default export allows use as:
 *
 * ```typescript
 import deferred from '@kwsites/promise-deferred`;
 ```
 */
exports.default = deferred;

});

var scheduler = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;



const createScheduledTask = (() => {
    let id = 0;
    return () => {
        id++;
        const { promise, done } = dist.createDeferred();
        return {
            promise,
            done,
            id,
        };
    };
})();
class Scheduler {
    constructor(concurrency = 2) {
        this.concurrency = concurrency;
        this.logger = gitLogger.createLogger('', 'scheduler');
        this.pending = [];
        this.running = [];
        this.logger(`Constructed, concurrency=%s`, concurrency);
    }
    schedule() {
        if (!this.pending.length || this.running.length >= this.concurrency) {
            this.logger(`Schedule attempt ignored, pending=%s running=%s concurrency=%s`, this.pending.length, this.running.length, this.concurrency);
            return;
        }
        const task = utils.append(this.running, this.pending.shift());
        this.logger(`Attempting id=%s`, task.id);
        task.done(() => {
            this.logger(`Completing id=`, task.id);
            utils.remove(this.running, task);
            this.schedule();
        });
    }
    next() {
        const { promise, id } = utils.append(this.pending, createScheduledTask());
        this.logger(`Scheduling id=%s`, id);
        this.schedule();
        return promise;
    }
}
exports.Scheduler = Scheduler;

});

var applyPatch = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPatchTask = void 0;

function applyPatchTask(patches, customArgs) {
    return task.straightThroughStringTask(['apply', ...customArgs, ...patches]);
}
exports.applyPatchTask = applyPatchTask;

});

var BranchDeleteSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSingleBranchDeleteFailure = exports.branchDeletionFailure = exports.branchDeletionSuccess = exports.BranchDeletionBatch = void 0;
class BranchDeletionBatch {
    constructor() {
        this.all = [];
        this.branches = {};
        this.errors = [];
    }
    get success() {
        return !this.errors.length;
    }
}
exports.BranchDeletionBatch = BranchDeletionBatch;
function branchDeletionSuccess(branch, hash) {
    return {
        branch, hash, success: true,
    };
}
exports.branchDeletionSuccess = branchDeletionSuccess;
function branchDeletionFailure(branch) {
    return {
        branch, hash: null, success: false,
    };
}
exports.branchDeletionFailure = branchDeletionFailure;
function isSingleBranchDeleteFailure(test) {
    return test.success;
}
exports.isSingleBranchDeleteFailure = isSingleBranchDeleteFailure;

});

var parseBranchDelete = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBranchDeletionError = exports.parseBranchDeletions = void 0;


const deleteSuccessRegex = /(\S+)\s+\(\S+\s([^)]+)\)/;
const deleteErrorRegex = /^error[^']+'([^']+)'/m;
const parsers = [
    new utils.LineParser(deleteSuccessRegex, (result, [branch, hash]) => {
        const deletion = BranchDeleteSummary.branchDeletionSuccess(branch, hash);
        result.all.push(deletion);
        result.branches[branch] = deletion;
    }),
    new utils.LineParser(deleteErrorRegex, (result, [branch]) => {
        const deletion = BranchDeleteSummary.branchDeletionFailure(branch);
        result.errors.push(deletion);
        result.all.push(deletion);
        result.branches[branch] = deletion;
    }),
];
const parseBranchDeletions = (stdOut, stdErr) => {
    return utils.parseStringResponse(new BranchDeleteSummary.BranchDeletionBatch(), parsers, stdOut, stdErr);
};
exports.parseBranchDeletions = parseBranchDeletions;
function hasBranchDeletionError(data, processExitCode) {
    return processExitCode === utils.ExitCodes.ERROR && deleteErrorRegex.test(data);
}
exports.hasBranchDeletionError = hasBranchDeletionError;

});

var BranchSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchSummaryResult = void 0;
class BranchSummaryResult {
    constructor() {
        this.all = [];
        this.branches = {};
        this.current = '';
        this.detached = false;
    }
    push(current, detached, name, commit, label) {
        if (current) {
            this.detached = detached;
            this.current = name;
        }
        this.all.push(name);
        this.branches[name] = {
            current: current,
            name: name,
            commit: commit,
            label: label
        };
    }
}
exports.BranchSummaryResult = BranchSummaryResult;

});

var parseBranch = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBranchSummary = void 0;


const parsers = [
    new utils.LineParser(/^(\*\s)?\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/, (result, [current, name, commit, label]) => {
        result.push(!!current, true, name, commit, label);
    }),
    new utils.LineParser(/^(\*\s)?(\S+)\s+([a-z0-9]+)\s(.*)$/s, (result, [current, name, commit, label]) => {
        result.push(!!current, false, name, commit, label);
    })
];
function parseBranchSummary(stdOut) {
    return utils.parseStringResponse(new BranchSummary.BranchSummaryResult(), parsers, stdOut);
}
exports.parseBranchSummary = parseBranchSummary;

});

var branch = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranchTask = exports.deleteBranchesTask = exports.branchLocalTask = exports.branchTask = exports.containsDeleteBranchCommand = void 0;




function containsDeleteBranchCommand(commands) {
    const deleteCommands = ['-d', '-D', '--delete'];
    return commands.some(command => deleteCommands.includes(command));
}
exports.containsDeleteBranchCommand = containsDeleteBranchCommand;
function branchTask(customArgs) {
    const isDelete = containsDeleteBranchCommand(customArgs);
    const commands = ['branch', ...customArgs];
    if (commands.length === 1) {
        commands.push('-a');
    }
    if (!commands.includes('-v')) {
        commands.splice(1, 0, '-v');
    }
    return {
        format: 'utf-8',
        commands,
        parser(stdOut, stdErr) {
            if (isDelete) {
                return parseBranchDelete.parseBranchDeletions(stdOut, stdErr).all[0];
            }
            return parseBranch.parseBranchSummary(stdOut);
        },
    };
}
exports.branchTask = branchTask;
function branchLocalTask() {
    const parser = parseBranch.parseBranchSummary;
    return {
        format: 'utf-8',
        commands: ['branch', '-v'],
        parser,
    };
}
exports.branchLocalTask = branchLocalTask;
function deleteBranchesTask(branches, forceDelete = false) {
    return {
        format: 'utf-8',
        commands: ['branch', '-v', forceDelete ? '-D' : '-d', ...branches],
        parser(stdOut, stdErr) {
            return parseBranchDelete.parseBranchDeletions(stdOut, stdErr);
        },
        onError({ exitCode, stdOut }, error, done, fail) {
            if (!parseBranchDelete.hasBranchDeletionError(String(error), exitCode)) {
                return fail(error);
            }
            done(stdOut);
        },
    };
}
exports.deleteBranchesTask = deleteBranchesTask;
function deleteBranchTask(branch, forceDelete = false) {
    const task = {
        format: 'utf-8',
        commands: ['branch', '-v', forceDelete ? '-D' : '-d', branch],
        parser(stdOut, stdErr) {
            return parseBranchDelete.parseBranchDeletions(stdOut, stdErr).branches[branch];
        },
        onError({ exitCode, stdErr, stdOut }, error, _, fail) {
            if (!parseBranchDelete.hasBranchDeletionError(String(error), exitCode)) {
                return fail(error);
            }
            throw new gitResponseError.GitResponseError(task.parser(utils.bufferToString(stdOut), utils.bufferToString(stdErr)), String(error));
        },
    };
    return task;
}
exports.deleteBranchTask = deleteBranchTask;

});

var CheckIgnore = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCheckIgnore = void 0;
/**
 * Parser for the `check-ignore` command - returns each file as a string array
 */
const parseCheckIgnore = (text) => {
    return text.split(/\n/g)
        .map(line => line.trim())
        .filter(file => !!file);
};
exports.parseCheckIgnore = parseCheckIgnore;

});

var checkIgnore = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIgnoreTask = void 0;

function checkIgnoreTask(paths) {
    return {
        commands: ['check-ignore', ...paths],
        format: 'utf-8',
        parser: CheckIgnore.parseCheckIgnore,
    };
}
exports.checkIgnoreTask = checkIgnoreTask;

});

var clone = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneMirrorTask = exports.cloneTask = void 0;


function cloneTask(repo, directory, customArgs) {
    const commands = ['clone', ...customArgs];
    if (typeof repo === 'string') {
        commands.push(repo);
    }
    if (typeof directory === 'string') {
        commands.push(directory);
    }
    return task.straightThroughStringTask(commands);
}
exports.cloneTask = cloneTask;
function cloneMirrorTask(repo, directory, customArgs) {
    utils.append(customArgs, '--mirror');
    return cloneTask(repo, directory, customArgs);
}
exports.cloneMirrorTask = cloneMirrorTask;

});

var parseCommit = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommitResult = void 0;

const parsers = [
    new utils.LineParser(/^\[([^\s]+)( \([^)]+\))? ([^\]]+)/, (result, [branch, root, commit]) => {
        result.branch = branch;
        result.commit = commit;
        result.root = !!root;
    }),
    new utils.LineParser(/\s*Author:\s(.+)/i, (result, [author]) => {
        const parts = author.split('<');
        const email = parts.pop();
        if (!email || !email.includes('@')) {
            return;
        }
        result.author = {
            email: email.substr(0, email.length - 1),
            name: parts.join('<').trim()
        };
    }),
    new utils.LineParser(/(\d+)[^,]*(?:,\s*(\d+)[^,]*)(?:,\s*(\d+))/g, (result, [changes, insertions, deletions]) => {
        result.summary.changes = parseInt(changes, 10) || 0;
        result.summary.insertions = parseInt(insertions, 10) || 0;
        result.summary.deletions = parseInt(deletions, 10) || 0;
    }),
    new utils.LineParser(/^(\d+)[^,]*(?:,\s*(\d+)[^(]+\(([+-]))?/, (result, [changes, lines, direction]) => {
        result.summary.changes = parseInt(changes, 10) || 0;
        const count = parseInt(lines, 10) || 0;
        if (direction === '-') {
            result.summary.deletions = count;
        }
        else if (direction === '+') {
            result.summary.insertions = count;
        }
    }),
];
function parseCommitResult(stdOut) {
    const result = {
        author: null,
        branch: '',
        commit: '',
        root: false,
        summary: {
            changes: 0,
            insertions: 0,
            deletions: 0,
        },
    };
    return utils.parseStringResponse(result, parsers, stdOut);
}
exports.parseCommitResult = parseCommitResult;

});

var commit = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitTask = void 0;

function commitTask(message, files, customArgs) {
    const commands = ['commit'];
    message.forEach((m) => commands.push('-m', m));
    commands.push(...files, ...customArgs);
    return {
        commands,
        format: 'utf-8',
        parser: parseCommit.parseCommitResult,
    };
}
exports.commitTask = commitTask;

});

var diff = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffSummaryTask = void 0;

function diffSummaryTask(customArgs) {
    return {
        commands: ['diff', '--stat=4096', ...customArgs],
        format: 'utf-8',
        parser(stdOut) {
            return parseDiffSummary.parseDiffResult(stdOut);
        }
    };
}
exports.diffSummaryTask = diffSummaryTask;

});

var parseFetch = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFetchResult = void 0;

const parsers = [
    new utils.LineParser(/From (.+)$/, (result, [remote]) => {
        result.remote = remote;
    }),
    new utils.LineParser(/\* \[new branch]\s+(\S+)\s*-> (.+)$/, (result, [name, tracking]) => {
        result.branches.push({
            name,
            tracking,
        });
    }),
    new utils.LineParser(/\* \[new tag]\s+(\S+)\s*-> (.+)$/, (result, [name, tracking]) => {
        result.tags.push({
            name,
            tracking,
        });
    })
];
function parseFetchResult(stdOut, stdErr) {
    const result = {
        raw: stdOut,
        remote: null,
        branches: [],
        tags: [],
    };
    return utils.parseStringResponse(result, parsers, stdOut, stdErr);
}
exports.parseFetchResult = parseFetchResult;

});

var fetch = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTask = void 0;

function fetchTask(remote, branch, customArgs) {
    const commands = ['fetch', ...customArgs];
    if (remote && branch) {
        commands.push(remote, branch);
    }
    return {
        commands,
        format: 'utf-8',
        parser: parseFetch.parseFetchResult,
    };
}
exports.fetchTask = fetchTask;

});

var parseMove = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMoveResult = void 0;

const parsers = [
    new utils.LineParser(/^Renaming (.+) to (.+)$/, (result, [from, to]) => {
        result.moves.push({ from, to });
    }),
];
function parseMoveResult(stdOut) {
    return utils.parseStringResponse({ moves: [] }, parsers, stdOut);
}
exports.parseMoveResult = parseMoveResult;

});

var move = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveTask = void 0;


function moveTask(from, to) {
    return {
        commands: ['mv', '-v', ...utils.asArray(from), to],
        format: 'utf-8',
        parser: parseMove.parseMoveResult,
    };
}
exports.moveTask = moveTask;

});

var pull = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullTask = void 0;

function pullTask(remote, branch, customArgs) {
    const commands = ['pull', ...customArgs];
    if (remote && branch) {
        commands.splice(1, 0, remote, branch);
    }
    return {
        commands,
        format: 'utf-8',
        parser(stdOut, stdErr) {
            return parsePull.parsePullResult(stdOut, stdErr);
        }
    };
}
exports.pullTask = pullTask;

});

var GetRemoteSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGetRemotesVerbose = exports.parseGetRemotes = void 0;

function parseGetRemotes(text) {
    const remotes = {};
    forEach(text, ([name]) => remotes[name] = { name });
    return Object.values(remotes);
}
exports.parseGetRemotes = parseGetRemotes;
function parseGetRemotesVerbose(text) {
    const remotes = {};
    forEach(text, ([name, url, purpose]) => {
        if (!remotes.hasOwnProperty(name)) {
            remotes[name] = {
                name: name,
                refs: { fetch: '', push: '' },
            };
        }
        if (purpose && url) {
            remotes[name].refs[purpose.replace(/[^a-z]/g, '')] = url;
        }
    });
    return Object.values(remotes);
}
exports.parseGetRemotesVerbose = parseGetRemotesVerbose;
function forEach(text, handler) {
    utils.forEachLineWithContent(text, (line) => handler(line.split(/\s+/)));
}

});

var remote = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRemoteTask = exports.remoteTask = exports.listRemotesTask = exports.getRemotesTask = exports.addRemoteTask = void 0;


function addRemoteTask(remoteName, remoteRepo, customArgs = []) {
    return task.straightThroughStringTask(['remote', 'add', ...customArgs, remoteName, remoteRepo]);
}
exports.addRemoteTask = addRemoteTask;
function getRemotesTask(verbose) {
    const commands = ['remote'];
    if (verbose) {
        commands.push('-v');
    }
    return {
        commands,
        format: 'utf-8',
        parser: verbose ? GetRemoteSummary.parseGetRemotesVerbose : GetRemoteSummary.parseGetRemotes,
    };
}
exports.getRemotesTask = getRemotesTask;
function listRemotesTask(customArgs = []) {
    const commands = [...customArgs];
    if (commands[0] !== 'ls-remote') {
        commands.unshift('ls-remote');
    }
    return task.straightThroughStringTask(commands);
}
exports.listRemotesTask = listRemotesTask;
function remoteTask(customArgs = []) {
    const commands = [...customArgs];
    if (commands[0] !== 'remote') {
        commands.unshift('remote');
    }
    return task.straightThroughStringTask(commands);
}
exports.remoteTask = remoteTask;
function removeRemoteTask(remoteName) {
    return task.straightThroughStringTask(['remote', 'remove', remoteName]);
}
exports.removeRemoteTask = removeRemoteTask;

});

var stashList = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.stashListTask = void 0;


function stashListTask(opt = {}, customArgs) {
    const options = log.parseLogOptions(opt);
    const parser = parseListLogSummary.createListLogSummaryParser(options.splitter, options.fields);
    return {
        commands: ['stash', 'list', ...options.commands, ...customArgs],
        format: 'utf-8',
        parser,
    };
}
exports.stashListTask = stashListTask;

});

var subModule = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubModuleTask = exports.subModuleTask = exports.initSubModuleTask = exports.addSubModuleTask = void 0;

function addSubModuleTask(repo, path) {
    return subModuleTask(['add', repo, path]);
}
exports.addSubModuleTask = addSubModuleTask;
function initSubModuleTask(customArgs) {
    return subModuleTask(['init', ...customArgs]);
}
exports.initSubModuleTask = initSubModuleTask;
function subModuleTask(customArgs) {
    const commands = [...customArgs];
    if (commands[0] !== 'submodule') {
        commands.unshift('submodule');
    }
    return task.straightThroughStringTask(commands);
}
exports.subModuleTask = subModuleTask;
function updateSubModuleTask(customArgs) {
    return subModuleTask(['update', ...customArgs]);
}
exports.updateSubModuleTask = updateSubModuleTask;

});

var TagList_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTagList = exports.TagList = void 0;
class TagList {
    constructor(all, latest) {
        this.all = all;
        this.latest = latest;
    }
}
exports.TagList = TagList;
const parseTagList = function (data, customSort = false) {
    const tags = data
        .split('\n')
        .map(trimmed)
        .filter(Boolean);
    if (!customSort) {
        tags.sort(function (tagA, tagB) {
            const partsA = tagA.split('.');
            const partsB = tagB.split('.');
            if (partsA.length === 1 || partsB.length === 1) {
                return singleSorted(toNumber(partsA[0]), toNumber(partsB[0]));
            }
            for (let i = 0, l = Math.max(partsA.length, partsB.length); i < l; i++) {
                const diff = sorted(toNumber(partsA[i]), toNumber(partsB[i]));
                if (diff) {
                    return diff;
                }
            }
            return 0;
        });
    }
    const latest = customSort ? tags[0] : [...tags].reverse().find((tag) => tag.indexOf('.') >= 0);
    return new TagList(tags, latest);
};
exports.parseTagList = parseTagList;
function singleSorted(a, b) {
    const aIsNum = isNaN(a);
    const bIsNum = isNaN(b);
    if (aIsNum !== bIsNum) {
        return aIsNum ? 1 : -1;
    }
    return aIsNum ? sorted(a, b) : 0;
}
function sorted(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
}
function trimmed(input) {
    return input.trim();
}
function toNumber(input) {
    if (typeof input === 'string') {
        return parseInt(input.replace(/^\D+/g, ''), 10) || 0;
    }
    return 0;
}

});

var tag = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAnnotatedTagTask = exports.addTagTask = exports.tagListTask = void 0;

/**
 * Task used by `git.tags`
 */
function tagListTask(customArgs = []) {
    const hasCustomSort = customArgs.some((option) => /^--sort=/.test(option));
    return {
        format: 'utf-8',
        commands: ['tag', '-l', ...customArgs],
        parser(text) {
            return TagList_1.parseTagList(text, hasCustomSort);
        },
    };
}
exports.tagListTask = tagListTask;
/**
 * Task used by `git.addTag`
 */
function addTagTask(name) {
    return {
        format: 'utf-8',
        commands: ['tag', name],
        parser() {
            return { name };
        }
    };
}
exports.addTagTask = addTagTask;
/**
 * Task used by `git.addTag`
 */
function addAnnotatedTagTask(name, tagMessage) {
    return {
        format: 'utf-8',
        commands: ['tag', '-a', '-m', tagMessage, name],
        parser() {
            return { name };
        }
    };
}
exports.addAnnotatedTagTask = addAnnotatedTagTask;

});

const {GitExecutor} = gitExecutor;
const {SimpleGitApi} = simpleGitApi;

const {Scheduler} = scheduler;
const {GitLogger} = gitLogger;
const {configurationErrorTask} = task;
const {
   asArray,
   filterArray,
   filterPrimitives,
   filterString,
   filterStringOrStringArray,
   filterType,
   getTrailingOptions,
   trailingFunctionArgument,
   trailingOptionsArgument
} = utils;
const {applyPatchTask} = applyPatch;
const {branchTask, branchLocalTask, deleteBranchesTask, deleteBranchTask} = branch;
const {checkIgnoreTask} = checkIgnore;
const {checkIsRepoTask} = checkIsRepo;
const {cloneTask, cloneMirrorTask} = clone;
const {cleanWithOptionsTask, isCleanOptionsArray} = clean;
const {commitTask} = commit;
const {diffSummaryTask} = diff;
const {fetchTask} = fetch;
const {moveTask} = move;
const {pullTask} = pull;
const {pushTagsTask} = push;
const {addRemoteTask, getRemotesTask, listRemotesTask, remoteTask, removeRemoteTask} = remote;
const {getResetMode, resetTask} = reset;
const {stashListTask} = stashList;
const {addSubModuleTask, initSubModuleTask, subModuleTask, updateSubModuleTask} = subModule;
const {addAnnotatedTagTask, addTagTask, tagListTask} = tag;
const {straightThroughBufferTask, straightThroughStringTask} = task;

function Git (options, plugins) {
   this._executor = new GitExecutor(
      options.binary, options.baseDir,
      new Scheduler(options.maxConcurrentProcesses), plugins,
   );
   this._logger = new GitLogger();
}

(Git.prototype = Object.create(SimpleGitApi.prototype)).constructor = Git;

/**
 * Logging utility for printing out info or error messages to the user
 * @type {GitLogger}
 * @private
 */
Git.prototype._logger = null;

/**
 * Sets the path to a custom git binary, should either be `git` when there is an installation of git available on
 * the system path, or a fully qualified path to the executable.
 *
 * @param {string} command
 * @returns {Git}
 */
Git.prototype.customBinary = function (command) {
   this._executor.binary = command;
   return this;
};

/**
 * Sets an environment variable for the spawned child process, either supply both a name and value as strings or
 * a single object to entirely replace the current environment variables.
 *
 * @param {string|Object} name
 * @param {string} [value]
 * @returns {Git}
 */
Git.prototype.env = function (name, value) {
   if (arguments.length === 1 && typeof name === 'object') {
      this._executor.env = name;
   } else {
      (this._executor.env = this._executor.env || {})[name] = value;
   }

   return this;
};

/**
 * List the stash(s) of the local repo
 */
Git.prototype.stashList = function (options) {
   return this._runTask(
      stashListTask(
         trailingOptionsArgument(arguments) || {},
         filterArray(options) && options || []
      ),
      trailingFunctionArgument(arguments),
   );
};

function createCloneTask (api, task, repoPath, localPath) {
   if (typeof repoPath !== 'string') {
      return configurationErrorTask(`git.${ api }() requires a string 'repoPath'`);
   }

   return task(repoPath, filterType(localPath, filterString), getTrailingOptions(arguments));
}


/**
 * Clone a git repo
 */
Git.prototype.clone = function () {
   return this._runTask(
      createCloneTask('clone', cloneTask, ...arguments),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Mirror a git repo
 */
Git.prototype.mirror = function () {
   return this._runTask(
      createCloneTask('mirror', cloneMirrorTask, ...arguments),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Moves one or more files to a new destination.
 *
 * @see https://git-scm.com/docs/git-mv
 *
 * @param {string|string[]} from
 * @param {string} to
 */
Git.prototype.mv = function (from, to) {
   return this._runTask(moveTask(from, to), trailingFunctionArgument(arguments));
};

/**
 * Internally uses pull and tags to get the list of tags then checks out the latest tag.
 *
 * @param {Function} [then]
 */
Git.prototype.checkoutLatestTag = function (then) {
   var git = this;
   return this.pull(function () {
      git.tags(function (err, tags) {
         git.checkout(tags.latest, then);
      });
   });
};

/**
 * Commits changes in the current working directory - when specific file paths are supplied, only changes on those
 * files will be committed.
 *
 * @param {string|string[]} message
 * @param {string|string[]} [files]
 * @param {Object} [options]
 * @param {Function} [then]
 */
Git.prototype.commit = function (message, files, options, then) {
   const next = trailingFunctionArgument(arguments);
   const messages = [];

   if (filterStringOrStringArray(message)) {
      messages.push(...asArray(message));
   } else {
      console.warn('simple-git deprecation notice: git.commit: requires the commit message to be supplied as a string/string[], this will be an error in version 3');
   }

   return this._runTask(
      commitTask(
         messages,
         asArray(filterType(files, filterStringOrStringArray, [])),
         [...filterType(options, filterArray, []), ...getTrailingOptions(arguments, 0, true)]
      ),
      next
   );
};

/**
 * Pull the updated contents of the current repo
 */
Git.prototype.pull = function (remote, branch, options, then) {
   return this._runTask(
      pullTask(filterType(remote, filterString), filterType(branch, filterString), getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Fetch the updated contents of the current repo.
 *
 * @example
 *   .fetch('upstream', 'master') // fetches from master on remote named upstream
 *   .fetch(function () {}) // runs fetch against default remote and branch and calls function
 *
 * @param {string} [remote]
 * @param {string} [branch]
 */
Git.prototype.fetch = function (remote, branch) {
   return this._runTask(
      fetchTask(filterType(remote, filterString), filterType(branch, filterString), getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Disables/enables the use of the console for printing warnings and errors, by default messages are not shown in
 * a production environment.
 *
 * @param {boolean} silence
 * @returns {Git}
 */
Git.prototype.silent = function (silence) {
   console.warn('simple-git deprecation notice: git.silent: logging should be configured using the `debug` library / `DEBUG` environment variable, this will be an error in version 3');
   this._logger.silent(!!silence);
   return this;
};

/**
 * List all tags. When using git 2.7.0 or above, include an options object with `"--sort": "property-name"` to
 * sort the tags by that property instead of using the default semantic versioning sort.
 *
 * Note, supplying this option when it is not supported by your Git version will cause the operation to fail.
 *
 * @param {Object} [options]
 * @param {Function} [then]
 */
Git.prototype.tags = function (options, then) {
   return this._runTask(
      tagListTask(getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Rebases the current working copy. Options can be supplied either as an array of string parameters
 * to be sent to the `git rebase` command, or a standard options object.
 */
Git.prototype.rebase = function () {
   return this._runTask(
      straightThroughStringTask(['rebase', ...getTrailingOptions(arguments)]),
      trailingFunctionArgument(arguments)
   );
};

/**
 * Reset a repo
 */
Git.prototype.reset = function (mode) {
   return this._runTask(
      resetTask(getResetMode(mode), getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Revert one or more commits in the local working copy
 */
Git.prototype.revert = function (commit) {
   const next = trailingFunctionArgument(arguments);

   if (typeof commit !== 'string') {
      return this._runTask(
         configurationErrorTask('Commit must be a string'),
         next,
      );
   }

   return this._runTask(
      straightThroughStringTask(['revert', ...getTrailingOptions(arguments, 0, true), commit]),
      next
   );
};

/**
 * Add a lightweight tag to the head of the current branch
 */
Git.prototype.addTag = function (name) {
   const task = (typeof name === 'string')
      ? addTagTask(name)
      : configurationErrorTask('Git.addTag requires a tag name');

   return this._runTask(task, trailingFunctionArgument(arguments));
};

/**
 * Add an annotated tag to the head of the current branch
 */
Git.prototype.addAnnotatedTag = function (tagName, tagMessage) {
   return this._runTask(
      addAnnotatedTagTask(tagName, tagMessage),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Check out a tag or revision, any number of additional arguments can be passed to the `git checkout` command
 * by supplying either a string or array of strings as the first argument.
 */
Git.prototype.checkout = function () {
   const commands = ['checkout', ...getTrailingOptions(arguments, true)];
   return this._runTask(
      straightThroughStringTask(commands),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Check out a remote branch
 *
 * @param {string} branchName name of branch
 * @param {string} startPoint (e.g origin/development)
 * @param {Function} [then]
 */
Git.prototype.checkoutBranch = function (branchName, startPoint, then) {
   return this.checkout(['-b', branchName, startPoint], trailingFunctionArgument(arguments));
};

/**
 * Check out a local branch
 */
Git.prototype.checkoutLocalBranch = function (branchName, then) {
   return this.checkout(['-b', branchName], trailingFunctionArgument(arguments));
};

/**
 * Delete a local branch
 */
Git.prototype.deleteLocalBranch = function (branchName, forceDelete, then) {
   return this._runTask(
      deleteBranchTask(branchName, typeof forceDelete === "boolean" ? forceDelete : false),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Delete one or more local branches
 */
Git.prototype.deleteLocalBranches = function (branchNames, forceDelete, then) {
   return this._runTask(
      deleteBranchesTask(branchNames, typeof forceDelete === "boolean" ? forceDelete : false),
      trailingFunctionArgument(arguments),
   );
};

/**
 * List all branches
 *
 * @param {Object | string[]} [options]
 * @param {Function} [then]
 */
Git.prototype.branch = function (options, then) {
   return this._runTask(
      branchTask(getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Return list of local branches
 *
 * @param {Function} [then]
 */
Git.prototype.branchLocal = function (then) {
   return this._runTask(
      branchLocalTask(),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Executes any command against the git binary.
 */
Git.prototype.raw = function (commands) {
   const createRestCommands = !Array.isArray(commands);
   const command = [].slice.call(createRestCommands ? arguments : commands, 0);

   for (let i = 0; i < command.length && createRestCommands; i++) {
      if (!filterPrimitives(command[i])) {
         command.splice(i, command.length - i);
         break;
      }
   }

   command.push(
      ...getTrailingOptions(arguments, 0, true),
   );

   var next = trailingFunctionArgument(arguments);

   if (!command.length) {
      return this._runTask(
         configurationErrorTask('Raw: must supply one or more command to execute'),
         next,
      );
   }

   return this._runTask(straightThroughStringTask(command), next);
};

Git.prototype.submoduleAdd = function (repo, path, then) {
   return this._runTask(
      addSubModuleTask(repo, path),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.submoduleUpdate = function (args, then) {
   return this._runTask(
      updateSubModuleTask(getTrailingOptions(arguments, true)),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.submoduleInit = function (args, then) {
   return this._runTask(
      initSubModuleTask(getTrailingOptions(arguments, true)),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.subModule = function (options, then) {
   return this._runTask(
      subModuleTask(getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.listRemote = function () {
   return this._runTask(
      listRemotesTask(getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Adds a remote to the list of remotes.
 */
Git.prototype.addRemote = function (remoteName, remoteRepo, then) {
   return this._runTask(
      addRemoteTask(remoteName, remoteRepo, getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Removes an entry by name from the list of remotes.
 */
Git.prototype.removeRemote = function (remoteName, then) {
   return this._runTask(
      removeRemoteTask(remoteName),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Gets the currently available remotes, setting the optional verbose argument to true includes additional
 * detail on the remotes themselves.
 */
Git.prototype.getRemotes = function (verbose, then) {
   return this._runTask(
      getRemotesTask(verbose === true),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Call any `git remote` function with arguments passed as an array of strings.
 *
 * @param {string[]} options
 * @param {Function} [then]
 */
Git.prototype.remote = function (options, then) {
   return this._runTask(
      remoteTask(getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Call any `git tag` function with arguments passed as an array of strings.
 *
 * @param {string[]} options
 * @param {Function} [then]
 */
Git.prototype.tag = function (options, then) {
   const command = getTrailingOptions(arguments);

   if (command[0] !== 'tag') {
      command.unshift('tag');
   }

   return this._runTask(
      straightThroughStringTask(command),
      trailingFunctionArgument(arguments)
   );
};

/**
 * Updates repository server info
 *
 * @param {Function} [then]
 */
Git.prototype.updateServerInfo = function (then) {
   return this._runTask(
      straightThroughStringTask(['update-server-info']),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Pushes the current tag changes to a remote which can be either a URL or named remote. When not specified uses the
 * default configured remote spec.
 *
 * @param {string} [remote]
 * @param {Function} [then]
 */
Git.prototype.pushTags = function (remote, then) {
   const task = pushTagsTask({remote: filterType(remote, filterString)}, getTrailingOptions(arguments));

   return this._runTask(task, trailingFunctionArgument(arguments));
};

/**
 * Removes the named files from source control.
 */
Git.prototype.rm = function (files) {
   return this._runTask(
      straightThroughStringTask(['rm', '-f', ...asArray(files)]),
      trailingFunctionArgument(arguments)
   );
};

/**
 * Removes the named files from source control but keeps them on disk rather than deleting them entirely. To
 * completely remove the files, use `rm`.
 *
 * @param {string|string[]} files
 */
Git.prototype.rmKeepLocal = function (files) {
   return this._runTask(
      straightThroughStringTask(['rm', '--cached', ...asArray(files)]),
      trailingFunctionArgument(arguments)
   );
};

/**
 * Returns a list of objects in a tree based on commit hash. Passing in an object hash returns the object's content,
 * size, and type.
 *
 * Passing "-p" will instruct cat-file to determine the object type, and display its formatted contents.
 *
 * @param {string[]} [options]
 * @param {Function} [then]
 */
Git.prototype.catFile = function (options, then) {
   return this._catFile('utf-8', arguments);
};

Git.prototype.binaryCatFile = function () {
   return this._catFile('buffer', arguments);
};

Git.prototype._catFile = function (format, args) {
   var handler = trailingFunctionArgument(args);
   var command = ['cat-file'];
   var options = args[0];

   if (typeof options === 'string') {
      return this._runTask(
         configurationErrorTask('Git.catFile: options must be supplied as an array of strings'),
         handler,
      );
   }

   if (Array.isArray(options)) {
      command.push.apply(command, options);
   }

   const task = format === 'buffer'
      ? straightThroughBufferTask(command)
      : straightThroughStringTask(command);

   return this._runTask(task, handler);
};

Git.prototype.diff = function (options, then) {
   const command = ['diff', ...getTrailingOptions(arguments)];

   if (typeof options === 'string') {
      command.splice(1, 0, options);
      this._logger.warn('Git#diff: supplying options as a single string is now deprecated, switch to an array of strings');
   }

   return this._runTask(
      straightThroughStringTask(command),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.diffSummary = function () {
   return this._runTask(
      diffSummaryTask(getTrailingOptions(arguments, 1)),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.applyPatch = function (patches) {
   const task = !filterStringOrStringArray(patches)
      ? configurationErrorTask(`git.applyPatch requires one or more string patches as the first argument`)
      : applyPatchTask(asArray(patches), getTrailingOptions([].slice.call(arguments, 1)));

   return this._runTask(
      task,
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.revparse = function () {
   const commands = ['rev-parse', ...getTrailingOptions(arguments, true)];
   return this._runTask(
      straightThroughStringTask(commands, true),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Show various types of objects, for example the file at a certain commit
 *
 * @param {string[]} [options]
 * @param {Function} [then]
 */
Git.prototype.show = function (options, then) {
   return this._runTask(
      straightThroughStringTask(['show', ...getTrailingOptions(arguments, 1)]),
      trailingFunctionArgument(arguments)
   );
};

/**
 */
Git.prototype.clean = function (mode, options, then) {
   const usingCleanOptionsArray = isCleanOptionsArray(mode);
   const cleanMode = usingCleanOptionsArray && mode.join('') || filterType(mode, filterString) || '';
   const customArgs = getTrailingOptions([].slice.call(arguments, usingCleanOptionsArray ? 1 : 0));

   return this._runTask(
      cleanWithOptionsTask(cleanMode, customArgs),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.exec = function (then) {
   const task = {
      commands: [],
      format: 'utf-8',
      parser () {
         if (typeof then === 'function') {
            then();
         }
      }
   };

   return this._runTask(task);
};

/**
 * Clears the queue of pending commands and returns the wrapper instance for chaining.
 *
 * @returns {Git}
 */
Git.prototype.clearQueue = function () {
   // TODO:
   // this._executor.clear();
   return this;
};

/**
 * Check if a pathname or pathnames are excluded by .gitignore
 *
 * @param {string|string[]} pathnames
 * @param {Function} [then]
 */
Git.prototype.checkIgnore = function (pathnames, then) {
   return this._runTask(
      checkIgnoreTask(asArray((filterType(pathnames, filterStringOrStringArray, [])))),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.checkIsRepo = function (checkType, then) {
   return this._runTask(
      checkIsRepoTask(filterType(checkType, filterString)),
      trailingFunctionArgument(arguments),
   );
};

var git = Git;

var gitFactory = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitInstanceFactory = exports.gitExportFactory = exports.esModuleFactory = void 0;




/**
 * Adds the necessary properties to the supplied object to enable it for use as
 * the default export of a module.
 *
 * Eg: `module.exports = esModuleFactory({ something () {} })`
 */
function esModuleFactory(defaultExport) {
    return Object.defineProperties(defaultExport, {
        __esModule: { value: true },
        default: { value: defaultExport },
    });
}
exports.esModuleFactory = esModuleFactory;
function gitExportFactory(factory, extra) {
    return Object.assign(function (...args) {
        return factory.apply(null, args);
    }, api_1.default, extra || {});
}
exports.gitExportFactory = gitExportFactory;
function gitInstanceFactory(baseDir, options) {
    const plugins$1 = new plugins.PluginStore();
    const config = utils.createInstanceConfig(baseDir && (typeof baseDir === 'string' ? { baseDir } : baseDir) || {}, options);
    if (!utils.folderExists(config.baseDir)) {
        throw new api_1.default.GitConstructError(config, `Cannot use simple-git on a directory that does not exist`);
    }
    if (Array.isArray(config.config)) {
        plugins$1.add(plugins.commandConfigPrefixingPlugin(config.config));
    }
    config.progress && plugins$1.add(plugins.progressMonitorPlugin(config.progress));
    config.timeout && plugins$1.add(plugins.timeoutPlugin(config.timeout));
    config.spawnOptions && plugins$1.add(plugins.spawnOptionsPlugin(config.spawnOptions));
    plugins$1.add(plugins.errorDetectionPlugin(plugins.errorDetectionHandler(true)));
    config.errors && plugins$1.add(plugins.errorDetectionPlugin(config.errors));
    return new git(config, plugins$1);
}
exports.gitInstanceFactory = gitInstanceFactory;

});

var promiseWrapped = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitP = void 0;


const functionNamesBuilderApi = [
    'customBinary', 'env', 'outputHandler', 'silent',
];
const functionNamesPromiseApi = [
    'add',
    'addAnnotatedTag',
    'addConfig',
    'addRemote',
    'addTag',
    'applyPatch',
    'binaryCatFile',
    'branch',
    'branchLocal',
    'catFile',
    'checkIgnore',
    'checkIsRepo',
    'checkout',
    'checkoutBranch',
    'checkoutLatestTag',
    'checkoutLocalBranch',
    'clean',
    'clone',
    'commit',
    'cwd',
    'deleteLocalBranch',
    'deleteLocalBranches',
    'diff',
    'diffSummary',
    'exec',
    'fetch',
    'getRemotes',
    'init',
    'listConfig',
    'listRemote',
    'log',
    'merge',
    'mergeFromTo',
    'mirror',
    'mv',
    'pull',
    'push',
    'pushTags',
    'raw',
    'rebase',
    'remote',
    'removeRemote',
    'reset',
    'revert',
    'revparse',
    'rm',
    'rmKeepLocal',
    'show',
    'stash',
    'stashList',
    'status',
    'subModule',
    'submoduleAdd',
    'submoduleInit',
    'submoduleUpdate',
    'tag',
    'tags',
    'updateServerInfo'
];
function gitP(...args) {
    let git;
    let chain = Promise.resolve();
    try {
        git = gitFactory.gitInstanceFactory(...args);
    }
    catch (e) {
        chain = Promise.reject(e);
    }
    function builderReturn() {
        return promiseApi;
    }
    function chainReturn() {
        return chain;
    }
    const promiseApi = [...functionNamesBuilderApi, ...functionNamesPromiseApi].reduce((api, name) => {
        const isAsync = functionNamesPromiseApi.includes(name);
        const valid = isAsync ? asyncWrapper(name, git) : syncWrapper(name, git, api);
        const alternative = isAsync ? chainReturn : builderReturn;
        Object.defineProperty(api, name, {
            enumerable: false,
            configurable: false,
            value: git ? valid : alternative,
        });
        return api;
    }, {});
    return promiseApi;
    function asyncWrapper(fn, git) {
        return function (...args) {
            if (typeof args[args.length] === 'function') {
                throw new TypeError('Promise interface requires that handlers are not supplied inline, ' +
                    'trailing function not allowed in call to ' + fn);
            }
            return chain.then(function () {
                return new Promise(function (resolve, reject) {
                    const callback = (err, result) => {
                        if (err) {
                            return reject(toError(err));
                        }
                        resolve(result);
                    };
                    args.push(callback);
                    git[fn].apply(git, args);
                });
            });
        };
    }
    function syncWrapper(fn, git, api) {
        return (...args) => {
            git[fn](...args);
            return api;
        };
    }
}
exports.gitP = gitP;
function toError(error) {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === 'string') {
        return new Error(error);
    }
    return new gitResponseError.GitResponseError(error);
}

});

const {gitP} = promiseWrapped;
const {esModuleFactory, gitInstanceFactory, gitExportFactory} = gitFactory;

var src = esModuleFactory(
   gitExportFactory(gitInstanceFactory, {gitP})
);

var GitManager = /** @class */ (function () {
    function GitManager(plugin) {
        this.plugin = plugin;
        this.app = plugin.app;
    }
    GitManager.prototype.formatCommitMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var template, status_1, numFiles, status_2, changeset_1, chunks, _i, _a, _b, action, files_1, files, moment, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        template = this.plugin.settings.commitMessage;
                        if (!template.includes("{{numFiles}}")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.status()];
                    case 1:
                        status_1 = _d.sent();
                        numFiles = status_1.changed.length;
                        template = template.replace("{{numFiles}}", String(numFiles));
                        _d.label = 2;
                    case 2:
                        if (!template.includes("{{files}}")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.status()];
                    case 3:
                        status_2 = _d.sent();
                        changeset_1 = {};
                        status_2.changed.forEach(function (value) {
                            if (value.index in changeset_1) {
                                changeset_1[value.index].push(value.path);
                            }
                            else {
                                changeset_1[value.index] = [value.path];
                            }
                        });
                        chunks = [];
                        for (_i = 0, _a = Object.entries(changeset_1); _i < _a.length; _i++) {
                            _b = _a[_i], action = _b[0], files_1 = _b[1];
                            chunks.push(action + " " + files_1.join(" "));
                        }
                        files = chunks.join(", ");
                        template = template.replace("{{files}}", files);
                        _d.label = 4;
                    case 4:
                        moment = window.moment;
                        template = template.replace("{{date}}", moment().format(this.plugin.settings.commitDateFormat));
                        if (!this.plugin.settings.listChangedFilesInMessageBody) return [3 /*break*/, 6];
                        _c = template + "\n\n" + "Affected files:" + "\n";
                        return [4 /*yield*/, this.status()];
                    case 5:
                        template = _c + (_d.sent()).staged.join("\n");
                        _d.label = 6;
                    case 6: return [2 /*return*/, template];
                }
            });
        });
    };
    return GitManager;
}());

var SimpleGit = /** @class */ (function (_super) {
    __extends(SimpleGit, _super);
    function SimpleGit(plugin) {
        var _this = _super.call(this, plugin) || this;
        var adapter = _this.app.vault.adapter;
        var path = adapter.getBasePath();
        if (_this.isGitInstalled()) {
            _this.git = src(path);
        }
        return _this;
    }
    SimpleGit.prototype.status = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.plugin.setState(PluginState.status);
                        return [4 /*yield*/, this.git.status()];
                    case 1:
                        status = _a.sent();
                        return [2 /*return*/, {
                                changed: status.files,
                                staged: status.staged,
                                conflicted: status.conflicted,
                            }];
                }
            });
        });
    };
    SimpleGit.prototype.commitAll = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var _this = this;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        if (!this.plugin.settings.updateSubmodules) return [3 /*break*/, 5];
                        this.plugin.setState(PluginState.commit);
                        _b = (_a = this.git).subModule;
                        _c = ["foreach", "--recursive"];
                        _d = "git add -A && if [ ! -z \"$(git status --porcelain)\" ]; then git commit -m \"";
                        if (!(message !== null && message !== void 0)) return [3 /*break*/, 1];
                        _e = message;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.formatCommitMessage()];
                    case 2:
                        _e = _j.sent();
                        _j.label = 3;
                    case 3: return [4 /*yield*/, _b.apply(_a, [_c.concat([_d + (_e) + "\"; fi"]), function (err) { return _this.onError(err); }])];
                    case 4:
                        _j.sent();
                        _j.label = 5;
                    case 5:
                        this.plugin.setState(PluginState.add);
                        return [4 /*yield*/, this.git.add("./*", function (err) { return _this.onError(err); })];
                    case 6:
                        _j.sent();
                        this.plugin.setState(PluginState.commit);
                        _g = (_f = this.git).commit;
                        if (!(message !== null && message !== void 0)) return [3 /*break*/, 7];
                        _h = message;
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.formatCommitMessage()];
                    case 8:
                        _h = _j.sent();
                        _j.label = 9;
                    case 9: return [4 /*yield*/, _g.apply(_f, [_h])];
                    case 10: return [2 /*return*/, (_j.sent()).summary.changes];
                }
            });
        });
    };
    SimpleGit.prototype.pull = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pullResult;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.plugin.setState(PluginState.pull);
                        if (!this.plugin.settings.updateSubmodules) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.git.subModule(["update", "--remote", "--merge", "--recursive"], function (err) { return _this.onError(err); })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.git.pull(["--no-rebase"], function (err) { return __awaiter(_this, void 0, void 0, function () {
                            var status_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!err) return [3 /*break*/, 2];
                                        this.plugin.displayError("Pull failed " + err.message);
                                        return [4 /*yield*/, this.git.status()];
                                    case 1:
                                        status_1 = _a.sent();
                                        if (status_1.conflicted.length > 0) {
                                            this.plugin.handleConflict(status_1.conflicted);
                                        }
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 3:
                        pullResult = _a.sent();
                        return [2 /*return*/, pullResult.files.length];
                }
            });
        });
    };
    SimpleGit.prototype.push = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status, trackingBranch, currentBranch, remoteChangedFiles;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.plugin.setState(PluginState.status);
                        return [4 /*yield*/, this.git.status()];
                    case 1:
                        status = _a.sent();
                        trackingBranch = status.tracking;
                        currentBranch = status.current;
                        return [4 /*yield*/, this.git.diffSummary([currentBranch, trackingBranch])];
                    case 2:
                        remoteChangedFiles = (_a.sent()).changed;
                        this.plugin.setState(PluginState.push);
                        if (!this.plugin.settings.updateSubmodules) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.git.env(__assign(__assign({}, process.env), { "OBSIDIAN_GIT": 1 })).subModule(["foreach", "--recursive", "tracking=$(git for-each-ref --format='%(upstream:short)' \"$(git symbolic-ref -q HEAD)\"); echo $tracking; if [ ! -z \"$(git diff --shortstat $tracking)\" ]; then git push; fi"], function (err) { return _this.onError(err); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.git.env(__assign(__assign({}, process.env), { "OBSIDIAN_GIT": 1 })).push(function (err) { return _this.onError(err); })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, remoteChangedFiles];
                }
            });
        });
    };
    SimpleGit.prototype.canPush = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status, trackingBranch, currentBranch, remoteChangedFiles;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // allow pushing in submodules even if the root has no changes.
                        if (this.plugin.settings.updateSubmodules === true) {
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, this.git.status(function (err) { return _this.onError(err); })];
                    case 1:
                        status = _a.sent();
                        trackingBranch = status.tracking;
                        currentBranch = status.current;
                        return [4 /*yield*/, this.git.diffSummary([currentBranch, trackingBranch])];
                    case 2:
                        remoteChangedFiles = (_a.sent()).changed;
                        return [2 /*return*/, remoteChangedFiles !== 0];
                }
            });
        });
    };
    SimpleGit.prototype.checkRequirements = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isGitInstalled()) {
                            return [2 /*return*/, "missing-git"];
                        }
                        return [4 /*yield*/, this.git.checkIsRepo()];
                    case 1:
                        if (!(_a.sent())) {
                            return [2 /*return*/, "missing-repo"];
                        }
                        return [2 /*return*/, "valid"];
                }
            });
        });
    };
    SimpleGit.prototype.branchInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status, branches;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.status(function (err) { return _this.onError(err); })];
                    case 1:
                        status = _a.sent();
                        return [4 /*yield*/, this.git.branch(["--no-color"], function (err) { return _this.onError(err); })];
                    case 2:
                        branches = _a.sent();
                        return [2 /*return*/, {
                                current: status.current,
                                tracking: status.tracking,
                                branches: branches.all,
                            }];
                }
            });
        });
    };
    SimpleGit.prototype.checkout = function (branch) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.checkout(branch, function (err) { return _this.onError(err); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SimpleGit.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.init(false)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SimpleGit.prototype.setConfig = function (path, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.addConfig(path, value, function (err) { return _this.onError(err); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SimpleGit.prototype.getConfig = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.listConfig(function (err) { return _this.onError(err); })];
                    case 1:
                        config = _a.sent();
                        return [2 /*return*/, config.all[path]];
                }
            });
        });
    };
    SimpleGit.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.fetch(function (err) { return _this.onError(err); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SimpleGit.prototype.isGitInstalled = function () {
        // https://github.com/steveukx/git-js/issues/402
        var command = child_process_1.spawnSync('git', ['--version'], {
            stdio: 'ignore'
        });
        if (command.error) {
            console.error(command.error);
            return false;
        }
        return true;
    };
    SimpleGit.prototype.onError = function (error) {
        if (error) {
            this.plugin.displayError(error.message);
        }
    };
    return SimpleGit;
}(GitManager));

var DEFAULT_SETTINGS = {
    commitMessage: "vault backup: {{date}}",
    commitDateFormat: "YYYY-MM-DD HH:mm:ss",
    autoSaveInterval: 0,
    autoPullInterval: 0,
    autoPullOnBoot: false,
    disablePush: false,
    pullBeforePush: true,
    disablePopups: false,
    listChangedFilesInMessageBody: false,
    showStatusBar: true,
    updateSubmodules: false,
};
var ObsidianGit = /** @class */ (function (_super) {
    __extends(ObsidianGit, _super);
    function ObsidianGit() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gitReady = false;
        _this.promiseQueue = new PromiseQueue();
        _this.conflictOutputFile = "conflict-files-obsidian-git.md";
        return _this;
    }
    ObsidianGit.prototype.setState = function (state) {
        var _a;
        this.state = state;
        (_a = this.statusBar) === null || _a === void 0 ? void 0 : _a.display();
    };
    ObsidianGit.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var statusBarEl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('loading ' + this.manifest.name + " plugin");
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new ObsidianGitSettingsTab(this.app, this));
                        this.addCommand({
                            id: "pull",
                            name: "Pull from remote repository",
                            callback: function () { return _this.promiseQueue.addTask(function () { return _this.pullChangesFromRemote(); }); },
                        });
                        this.addCommand({
                            id: "push",
                            name: "Create backup",
                            callback: function () { return _this.promiseQueue.addTask(function () { return _this.createBackup(false); }); }
                        });
                        this.addCommand({
                            id: "commit-push-specified-message",
                            name: "Create backup with specified message",
                            callback: function () { return new CustomMessageModal(_this).open(); }
                        });
                        this.addCommand({
                            id: "list-changed-files",
                            name: "List changed files",
                            callback: function () { return __awaiter(_this, void 0, void 0, function () {
                                var status;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.gitManager.status()];
                                        case 1:
                                            status = _a.sent();
                                            new ChangedFilesModal(this, status.changed).open();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }
                        });
                        if (this.settings.showStatusBar) {
                            statusBarEl = this.addStatusBarItem();
                            this.statusBar = new StatusBar(statusBarEl, this);
                            this.registerInterval(window.setInterval(function () { return _this.statusBar.display(); }, 1000));
                        }
                        this.app.workspace.onLayoutReady(function () { return _this.init(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.onunload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                window.clearTimeout(this.timeoutIDBackup);
                window.clearTimeout(this.timeoutIDPull);
                console.log('unloading ' + this.manifest.name + " plugin");
                return [2 /*return*/];
            });
        });
    };
    ObsidianGit.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [{}, DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.saveLastAuto = function (date, mode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (mode === "backup") {
                    window.localStorage.setItem(this.manifest.id + ":lastAutoBackup", date.toString());
                }
                else if (mode === "pull") {
                    window.localStorage.setItem(this.manifest.id + ":lastAutoPull", date.toString());
                }
                return [2 /*return*/];
            });
        });
    };
    ObsidianGit.prototype.loadLastAuto = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                return [2 /*return*/, {
                        "backup": new Date((_a = window.localStorage.getItem(this.manifest.id + ":lastAutoBackup")) !== null && _a !== void 0 ? _a : ""),
                        "pull": new Date((_b = window.localStorage.getItem(this.manifest.id + ":lastAutoPull")) !== null && _b !== void 0 ? _b : "")
                    }];
            });
        });
    };
    ObsidianGit.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, lastAutos, now, diff, now, diff, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        this.gitManager = new SimpleGit(this);
                        return [4 /*yield*/, this.gitManager.checkRequirements()];
                    case 1:
                        result = _b.sent();
                        _a = result;
                        switch (_a) {
                            case "missing-git": return [3 /*break*/, 2];
                            case "missing-repo": return [3 /*break*/, 3];
                            case "valid": return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        this.displayError("Cannot run git command");
                        return [3 /*break*/, 7];
                    case 3:
                        new obsidian.Notice("Can't find a valid git repository. Please create one");
                        return [3 /*break*/, 7];
                    case 4:
                        this.gitReady = true;
                        this.setState(PluginState.idle);
                        if (this.settings.autoPullOnBoot) {
                            this.promiseQueue.addTask(function () { return _this.pullChangesFromRemote(); });
                        }
                        return [4 /*yield*/, this.loadLastAuto()];
                    case 5:
                        lastAutos = _b.sent();
                        if (this.settings.autoSaveInterval > 0) {
                            now = new Date();
                            diff = this.settings.autoSaveInterval - (Math.round(((now.getTime() - lastAutos.backup.getTime()) / 1000) / 60));
                            this.startAutoBackup(diff <= 0 ? 0 : diff);
                        }
                        if (this.settings.autoPullInterval > 0) {
                            now = new Date();
                            diff = this.settings.autoPullInterval - (Math.round(((now.getTime() - lastAutos.pull.getTime()) / 1000) / 60));
                            this.startAutoPull(diff <= 0 ? 0 : diff);
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        console.log("Something weird happened. The 'checkRequirements' result is " + result);
                        _b.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_1 = _b.sent();
                        this.displayError(error_1);
                        console.error(error_1);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.pullChangesFromRemote = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filesUpdated, status_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.gitReady) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.gitReady)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.gitManager.pull()];
                    case 3:
                        filesUpdated = _a.sent();
                        if (filesUpdated > 0) {
                            this.displayMessage("Pulled new changes. " + filesUpdated + " files updated");
                        }
                        else {
                            this.displayMessage("Everything is up-to-date");
                        }
                        if (!(this.gitManager instanceof SimpleGit)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.gitManager.status()];
                    case 4:
                        status_1 = _a.sent();
                        if (status_1.conflicted.length > 0) {
                            this.displayError("You have " + status_1.conflicted.length + " conflict files");
                        }
                        _a.label = 5;
                    case 5:
                        this.setState(PluginState.idle);
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.createBackup = function (fromAutoBackup, commitMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var file, status_2, changedFiles, commitedFiles, pulledFilesLength, status_3, _a, pushedFiles;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.gitReady) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!this.gitReady)
                            return [2 /*return*/];
                        if (!!fromAutoBackup) return [3 /*break*/, 4];
                        file = this.app.vault.getAbstractFileByPath(this.conflictOutputFile);
                        return [4 /*yield*/, this.app.vault.delete(file)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        if (!(this.gitManager instanceof SimpleGit)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.gitManager.status()];
                    case 5:
                        status_2 = _b.sent();
                        // check for conflict files on auto backup
                        if (fromAutoBackup && status_2.conflicted.length > 0) {
                            this.setState(PluginState.idle);
                            this.displayError("Did not commit, because you have " + status_2.conflicted.length + " conflict files. Please resolve them and commit per command.");
                            this.handleConflict(status_2.conflicted);
                            return [2 /*return*/];
                        }
                        _b.label = 6;
                    case 6: return [4 /*yield*/, this.gitManager.status()];
                    case 7:
                        changedFiles = (_b.sent()).changed;
                        if (!(changedFiles.length !== 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.gitManager.commitAll(commitMessage)];
                    case 8:
                        commitedFiles = _b.sent();
                        this.displayMessage("Committed " + commitedFiles + " files");
                        return [3 /*break*/, 10];
                    case 9:
                        this.displayMessage("No changes to commit");
                        _b.label = 10;
                    case 10:
                        if (!!this.settings.disablePush) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.gitManager.branchInfo()];
                    case 11:
                        if (!(_b.sent()).tracking) {
                            this.displayError("Did not push. No tracking branch is set! Please set one in the settings", 10000);
                            this.setState(PluginState.idle);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.gitManager.canPush()];
                    case 12:
                        if (!_b.sent()) return [3 /*break*/, 20];
                        if (!this.settings.pullBeforePush) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.gitManager.pull()];
                    case 13:
                        pulledFilesLength = _b.sent();
                        if (pulledFilesLength > 0) {
                            this.displayMessage("Pulled " + pulledFilesLength + " files from remote");
                        }
                        _b.label = 14;
                    case 14:
                        _a = this.gitManager instanceof SimpleGit;
                        if (!_a) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.gitManager.status()];
                    case 15:
                        _a = (status_3 = _b.sent()).conflicted.length > 0;
                        _b.label = 16;
                    case 16:
                        if (!_a) return [3 /*break*/, 17];
                        this.displayError("Cannot push. You have " + status_3.conflicted.length + " conflict files");
                        this.handleConflict(status_3.conflicted);
                        return [2 /*return*/];
                    case 17: return [4 /*yield*/, this.gitManager.push()];
                    case 18:
                        pushedFiles = _b.sent();
                        this.displayMessage("Pushed " + pushedFiles + " files to remote");
                        _b.label = 19;
                    case 19: return [3 /*break*/, 21];
                    case 20:
                        this.displayMessage("No changes to push");
                        _b.label = 21;
                    case 21:
                        this.setState(PluginState.idle);
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.startAutoBackup = function (minutes) {
        var _this = this;
        this.timeoutIDBackup = window.setTimeout(function () {
            _this.promiseQueue.addTask(function () { return _this.createBackup(true); });
            _this.saveLastAuto(new Date(), "backup");
            _this.saveSettings();
            _this.startAutoBackup();
        }, (minutes !== null && minutes !== void 0 ? minutes : this.settings.autoSaveInterval) * 60000);
    };
    ObsidianGit.prototype.startAutoPull = function (minutes) {
        var _this = this;
        this.timeoutIDPull = window.setTimeout(function () {
            _this.promiseQueue.addTask(function () { return _this.pullChangesFromRemote(); });
            _this.saveLastAuto(new Date(), "pull");
            _this.saveSettings();
            _this.startAutoPull();
        }, (minutes !== null && minutes !== void 0 ? minutes : this.settings.autoPullInterval) * 60000);
    };
    ObsidianGit.prototype.clearAutoBackup = function () {
        if (this.timeoutIDBackup) {
            window.clearTimeout(this.timeoutIDBackup);
            return true;
        }
        return false;
    };
    ObsidianGit.prototype.clearAutoPull = function () {
        if (this.timeoutIDPull) {
            window.clearTimeout(this.timeoutIDPull);
            return true;
        }
        return false;
    };
    ObsidianGit.prototype.handleConflict = function (conflicted) {
        return __awaiter(this, void 0, void 0, function () {
            var lines;
            var _this = this;
            return __generator(this, function (_a) {
                this.setState(PluginState.conflicted);
                lines = __spreadArray([
                    "# Conflict files",
                    "Please resolve them and commit per command (This file will be deleted before the commit)."
                ], conflicted.map(function (e) {
                    var file = _this.app.vault.getAbstractFileByPath(e);
                    if (file instanceof obsidian.TFile) {
                        var link = _this.app.metadataCache.fileToLinktext(file, "/");
                        return "- [[" + link + "]]";
                    }
                    else {
                        return "- Not a file: " + e;
                    }
                }));
                this.writeAndOpenFile(lines.join("\n"));
                return [2 /*return*/];
            });
        });
    };
    ObsidianGit.prototype.writeAndOpenFile = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var fileIsAlreadyOpened;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.app.vault.adapter.write(this.conflictOutputFile, text)];
                    case 1:
                        _a.sent();
                        fileIsAlreadyOpened = false;
                        this.app.workspace.iterateAllLeaves(function (leaf) {
                            if (leaf.getDisplayText() != "" && _this.conflictOutputFile.startsWith(leaf.getDisplayText())) {
                                fileIsAlreadyOpened = true;
                            }
                        });
                        if (!fileIsAlreadyOpened) {
                            this.app.workspace.openLinkText(this.conflictOutputFile, "/", true);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // region: displaying / formatting messages
    ObsidianGit.prototype.displayMessage = function (message, timeout) {
        var _a;
        if (timeout === void 0) { timeout = 4 * 1000; }
        (_a = this.statusBar) === null || _a === void 0 ? void 0 : _a.displayMessage(message.toLowerCase(), timeout);
        if (!this.settings.disablePopups) {
            new obsidian.Notice(message);
        }
        console.log("git obsidian message: " + message);
    };
    ObsidianGit.prototype.displayError = function (message, timeout) {
        var _a;
        if (timeout === void 0) { timeout = 0; }
        new obsidian.Notice(message);
        console.log("git obsidian error: " + message);
        (_a = this.statusBar) === null || _a === void 0 ? void 0 : _a.displayMessage(message.toLowerCase(), timeout);
    };
    return ObsidianGit;
}(obsidian.Plugin));

module.exports = ObsidianGit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9tb2RhbHMvY2hhbmdlZEZpbGVzTW9kYWwudHMiLCJzcmMvbW9kYWxzL2N1c3RvbU1lc3NhZ2VNb2RhbC50cyIsInNyYy9wcm9taXNlUXVldWUudHMiLCJzcmMvc2V0dGluZ3MudHMiLCJzcmMvdHlwZXMudHMiLCJzcmMvc3RhdHVzQmFyLnRzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9lcnJvcnMvZ2l0LWVycm9yLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9lcnJvcnMvZ2l0LXJlc3BvbnNlLWVycm9yLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9lcnJvcnMvZ2l0LWNvbnN0cnVjdC1lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvZXJyb3JzL2dpdC1wbHVnaW4tZXJyb3IuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL2Vycm9ycy90YXNrLWNvbmZpZ3VyYXRpb24tZXJyb3IuanMiLCJub2RlX21vZHVsZXMvbXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVidWcvc3JjL2NvbW1vbi5qcyIsIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9oYXMtZmxhZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBwb3J0cy1jb2xvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvbm9kZS5qcyIsIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvQGt3c2l0ZXMvZmlsZS1leGlzdHMvZGlzdC9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvQGt3c2l0ZXMvZmlsZS1leGlzdHMvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdXRpbHMvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdXRpbHMvYXJndW1lbnQtZmlsdGVycy5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdXRpbHMvZXhpdC1jb2Rlcy5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdXRpbHMvZ2l0LW91dHB1dC1zdHJlYW1zLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi91dGlscy9saW5lLXBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdXRpbHMvc2ltcGxlLWdpdC1vcHRpb25zLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi91dGlscy90YXNrLW9wdGlvbnMuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3V0aWxzL3Rhc2stcGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi91dGlscy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvY2hlY2staXMtcmVwby5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcmVzcG9uc2VzL0NsZWFuU3VtbWFyeS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvY2xlYW4uanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Jlc3BvbnNlcy9Db25maWdMaXN0LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9jb25maWcuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Rhc2tzL3Jlc2V0LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9hcGkuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3BsdWdpbnMvY29tbWFuZC1jb25maWctcHJlZml4aW5nLXBsdWdpbi5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGx1Z2lucy9lcnJvci1kZXRlY3Rpb24ucGx1Z2luLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wbHVnaW5zL3BsdWdpbi1zdG9yZS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGx1Z2lucy9wcm9ncmVzcy1tb25pdG9yLXBsdWdpbi5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGx1Z2lucy9zaW1wbGUtZ2l0LXBsdWdpbi5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGx1Z2lucy9zcGF3bi1vcHRpb25zLXBsdWdpbi5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGx1Z2lucy90aW1vdXQtcGx1Z2luLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wbHVnaW5zL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9naXQtbG9nZ2VyLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9ydW5uZXJzL3Rhc2tzLXBlbmRpbmctcXVldWUuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3J1bm5lcnMvZ2l0LWV4ZWN1dG9yLWNoYWluLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9ydW5uZXJzL2dpdC1leGVjdXRvci5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFzay1jYWxsYmFjay5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvY2hhbmdlLXdvcmtpbmctZGlyZWN0b3J5LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9oYXNoLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcmVzcG9uc2VzL0luaXRTdW1tYXJ5LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9pbml0LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvRGlmZlN1bW1hcnkuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3BhcnNlcnMvcGFyc2UtZGlmZi1zdW1tYXJ5LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLWxpc3QtbG9nLXN1bW1hcnkuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Rhc2tzL2xvZy5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcmVzcG9uc2VzL01lcmdlU3VtbWFyeS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcmVzcG9uc2VzL1B1bGxTdW1tYXJ5LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLXJlbW90ZS1vYmplY3RzLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLXJlbW90ZS1tZXNzYWdlcy5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGFyc2Vycy9wYXJzZS1wdWxsLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLW1lcmdlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9tZXJnZS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGFyc2Vycy9wYXJzZS1wdXNoLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9wdXNoLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvRmlsZVN0YXR1c1N1bW1hcnkuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Jlc3BvbnNlcy9TdGF0dXNTdW1tYXJ5LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9zdGF0dXMuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3NpbXBsZS1naXQtYXBpLmpzIiwibm9kZV9tb2R1bGVzL0Brd3NpdGVzL3Byb21pc2UtZGVmZXJyZWQvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcnVubmVycy9zY2hlZHVsZXIuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Rhc2tzL2FwcGx5LXBhdGNoLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvQnJhbmNoRGVsZXRlU3VtbWFyeS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGFyc2Vycy9wYXJzZS1icmFuY2gtZGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvQnJhbmNoU3VtbWFyeS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGFyc2Vycy9wYXJzZS1icmFuY2guanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Rhc2tzL2JyYW5jaC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcmVzcG9uc2VzL0NoZWNrSWdub3JlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9jaGVjay1pZ25vcmUuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Rhc2tzL2Nsb25lLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLWNvbW1pdC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvY29tbWl0LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9kaWZmLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLWZldGNoLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9mZXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGFyc2Vycy9wYXJzZS1tb3ZlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9tb3ZlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9wdWxsLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvR2V0UmVtb3RlU3VtbWFyeS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvcmVtb3RlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9zdGFzaC1saXN0LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9zdWItbW9kdWxlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvVGFnTGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvdGFnLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2dpdC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvZ2l0LWZhY3RvcnkuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3J1bm5lcnMvcHJvbWlzZS13cmFwcGVkLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2luZGV4LmpzIiwic3JjL2dpdE1hbmFnZXIudHMiLCJzcmMvc2ltcGxlR2l0LnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG4iLCJpbXBvcnQgeyBGdXp6eVN1Z2dlc3RNb2RhbCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IE9ic2lkaWFuR2l0IGZyb20gXCJzcmMvbWFpblwiO1xuaW1wb3J0IHsgRmlsZVN0YXR1c1Jlc3VsdCB9IGZyb20gXCJzcmMvdHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIENoYW5nZWRGaWxlc01vZGFsIGV4dGVuZHMgRnV6enlTdWdnZXN0TW9kYWw8RmlsZVN0YXR1c1Jlc3VsdD4ge1xuICAgIHBsdWdpbjogT2JzaWRpYW5HaXQ7XG4gICAgY2hhbmdlZEZpbGVzOiBGaWxlU3RhdHVzUmVzdWx0W107XG5cbiAgICBjb25zdHJ1Y3RvcihwbHVnaW46IE9ic2lkaWFuR2l0LCBjaGFuZ2VkRmlsZXM6IEZpbGVTdGF0dXNSZXN1bHRbXSkge1xuICAgICAgICBzdXBlcihwbHVnaW4uYXBwKTtcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgICAgIHRoaXMuY2hhbmdlZEZpbGVzID0gY2hhbmdlZEZpbGVzO1xuICAgICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKFwiTm90IHN1cHBvcnRlZCBmaWxlcyB3aWxsIGJlIG9wZW5lZCBieSBkZWZhdWx0IGFwcCFcIik7XG4gICAgfVxuXG4gICAgZ2V0SXRlbXMoKTogRmlsZVN0YXR1c1Jlc3VsdFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlZEZpbGVzO1xuICAgIH1cblxuICAgIGdldEl0ZW1UZXh0KGl0ZW06IEZpbGVTdGF0dXNSZXN1bHQpOiBzdHJpbmcge1xuICAgICAgICBpZiAoaXRlbS5pbmRleCA9PSBcIj9cIiAmJiBpdGVtLndvcmtpbmdfZGlyID09IFwiP1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gYFVudHJhY2tlZCB8ICR7aXRlbS5wYXRofWA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgd29ya2luZ19kaXIgPSBcIlwiO1xuICAgICAgICBsZXQgaW5kZXggPSBcIlwiO1xuXG4gICAgICAgIGlmIChpdGVtLndvcmtpbmdfZGlyICE9IFwiIFwiKSB3b3JraW5nX2RpciA9IGBXb3JraW5nIGRpcjogJHtpdGVtLndvcmtpbmdfZGlyfSBgO1xuICAgICAgICBpZiAoaXRlbS5pbmRleCAhPSBcIiBcIikgaW5kZXggPSBgSW5kZXg6ICR7aXRlbS5pbmRleH1gO1xuXG4gICAgICAgIHJldHVybiBgJHt3b3JraW5nX2Rpcn0ke2luZGV4fSB8ICR7aXRlbS5wYXRofWA7XG4gICAgfVxuXG4gICAgb25DaG9vc2VJdGVtKGl0ZW06IEZpbGVTdGF0dXNSZXN1bHQsIF86IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChpdGVtLnBhdGgsIFwiXCIpID09IG51bGwpIHtcbiAgICAgICAgICAgICh0aGlzLmFwcCBhcyBhbnkpLm9wZW5XaXRoRGVmYXVsdEFwcChpdGVtLnBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5vcGVuTGlua1RleHQoaXRlbS5wYXRoLCBcIi9cIik7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgU3VnZ2VzdE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgT2JzaWRpYW5HaXQgZnJvbSBcInNyYy9tYWluXCI7XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21NZXNzYWdlTW9kYWwgZXh0ZW5kcyBTdWdnZXN0TW9kYWw8c3RyaW5nPiB7XG4gICAgcGx1Z2luOiBPYnNpZGlhbkdpdDtcblxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogT2JzaWRpYW5HaXQpIHtcbiAgICAgICAgc3VwZXIocGx1Z2luLmFwcCk7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKFwiVHlwZSB5b3VyIG1lc3NhZ2UgYW5kIHNlbGVjdCBvcHRpb25hbCB0aGUgdmVyc2lvbiB3aXRoIHRoZSBhZGRlZCBkYXRlLlwiKTtcbiAgICB9XG5cblxuICAgIGdldFN1Z2dlc3Rpb25zKHF1ZXJ5OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSAod2luZG93IGFzIGFueSkubW9tZW50KCkuZm9ybWF0KHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1pdERhdGVGb3JtYXQpO1xuICAgICAgICBpZiAocXVlcnkgPT0gXCJcIikgcXVlcnkgPSBcIi4uLlwiO1xuICAgICAgICByZXR1cm4gW3F1ZXJ5LCBgJHtkYXRlfTogJHtxdWVyeX1gLCBgJHtxdWVyeX06ICR7ZGF0ZX1gXTtcbiAgICB9XG5cbiAgICByZW5kZXJTdWdnZXN0aW9uKHZhbHVlOiBzdHJpbmcsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBlbC5pbm5lclRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBvbkNob29zZVN1Z2dlc3Rpb24oaXRlbTogc3RyaW5nLCBfOiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBsdWdpbi5wcm9taXNlUXVldWUuYWRkVGFzaygoKSA9PiB0aGlzLnBsdWdpbi5jcmVhdGVCYWNrdXAoZmFsc2UsIGl0ZW0pKTtcbiAgICB9XG5cbn0iLCJcbmV4cG9ydCBjbGFzcyBQcm9taXNlUXVldWUge1xuICAgIHRhc2tzOiAoKCkgPT4gUHJvbWlzZTxhbnk+KVtdID0gW107XG5cbiAgICBhZGRUYXNrKHRhc2s6ICgpID0+IFByb21pc2U8YW55Pikge1xuICAgICAgICB0aGlzLnRhc2tzLnB1c2godGFzayk7XG4gICAgICAgIGlmICh0aGlzLnRhc2tzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVUYXNrKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgaGFuZGxlVGFzaygpIHtcbiAgICAgICAgaWYgKHRoaXMudGFza3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy50YXNrc1swXSgpLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGFza3Muc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVRhc2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IE5vdGljZSwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IE9ic2lkaWFuR2l0IGZyb20gXCIuL21haW5cIjtcblxuZXhwb3J0IGNsYXNzIE9ic2lkaWFuR2l0U2V0dGluZ3NUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgcGx1Z2luOiBPYnNpZGlhbkdpdCA9ICh0aGlzIGFzIGFueSkucGx1Z2luO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkdpdCBCYWNrdXAgc2V0dGluZ3NcIiB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiVmF1bHQgYmFja3VwIGludGVydmFsIChtaW51dGVzKVwiKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgXCJDb21taXQgYW5kIHB1c2ggY2hhbmdlcyBldmVyeSBYIG1pbnV0ZXMuIFRvIGRpc2FibGUgYXV0b21hdGljIGJhY2t1cCwgc3BlY2lmeSBuZWdhdGl2ZSB2YWx1ZSBvciB6ZXJvIChkZWZhdWx0KVwiXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShTdHJpbmcocGx1Z2luLnNldHRpbmdzLmF1dG9TYXZlSW50ZXJ2YWwpKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKE51bWJlcih2YWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmF1dG9TYXZlSW50ZXJ2YWwgPSBOdW1iZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbHVnaW4uc2V0dGluZ3MuYXV0b1NhdmVJbnRlcnZhbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLmNsZWFyQXV0b0JhY2t1cCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc3RhcnRBdXRvQmFja3VwKHBsdWdpbi5zZXR0aW5ncy5hdXRvU2F2ZUludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBBdXRvbWF0aWMgYmFja3VwIGVuYWJsZWQhIEV2ZXJ5ICR7cGx1Z2luLnNldHRpbmdzLmF1dG9TYXZlSW50ZXJ2YWx9IG1pbnV0ZXMuYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5hdXRvU2F2ZUludGVydmFsIDw9IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnRpbWVvdXRJREJhY2t1cFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uY2xlYXJBdXRvQmFja3VwKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJBdXRvbWF0aWMgYmFja3VwIGRpc2FibGVkIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIG51bWJlci5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiQXV0byBwdWxsIGludGVydmFsIChtaW51dGVzKVwiKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgXCJQdWxsIGNoYW5nZXMgZXZlcnkgWCBtaW51dGVzLiBUbyBkaXNhYmxlIGF1dG9tYXRpYyBwdWxsLCBzcGVjaWZ5IG5lZ2F0aXZlIHZhbHVlIG9yIHplcm8gKGRlZmF1bHQpXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKFN0cmluZyhwbHVnaW4uc2V0dGluZ3MuYXV0b1B1bGxJbnRlcnZhbCkpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4oTnVtYmVyKHZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuYXV0b1B1bGxJbnRlcnZhbCA9IE51bWJlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBsdWdpbi5zZXR0aW5ncy5hdXRvUHVsbEludGVydmFsID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uY2xlYXJBdXRvUHVsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc3RhcnRBdXRvUHVsbChwbHVnaW4uc2V0dGluZ3MuYXV0b1B1bGxJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgQXV0b21hdGljIHB1bGwgZW5hYmxlZCEgRXZlcnkgJHtwbHVnaW4uc2V0dGluZ3MuYXV0b1B1bGxJbnRlcnZhbH0gbWludXRlcy5gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmF1dG9QdWxsSW50ZXJ2YWwgPD0gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4udGltZW91dElEUHVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uY2xlYXJBdXRvUHVsbCgpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiQXV0b21hdGljIHB1bGwgZGlzYWJsZWQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlBsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgbnVtYmVyLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIkNvbW1pdCBtZXNzYWdlXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICBcIlNwZWNpZnkgY3VzdG9tIGNvbW1pdCBtZXNzYWdlLiBBdmFpbGFibGUgcGxhY2Vob2xkZXJzOiB7e2RhdGV9fVwiICtcbiAgICAgICAgICAgICAgICBcIiAoc2VlIGJlbG93KSBhbmQge3tudW1GaWxlc319IChudW1iZXIgb2YgY2hhbmdlZCBmaWxlcyBpbiB0aGUgY29tbWl0KVwiXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcInZhdWx0IGJhY2t1cFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY29tbWl0TWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcGx1Z2luLnNldHRpbmdzLmNvbW1pdE1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY29tbWl0TWVzc2FnZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwie3tkYXRlfX0gcGxhY2Vob2xkZXIgZm9ybWF0XCIpXG4gICAgICAgICAgICAuc2V0RGVzYygnU3BlY2lmeSBjdXN0b20gZGF0ZSBmb3JtYXQuIEUuZy4gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCInKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIocGx1Z2luLnNldHRpbmdzLmNvbW1pdERhdGVGb3JtYXQpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuY29tbWl0RGF0ZUZvcm1hdClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmNvbW1pdERhdGVGb3JtYXQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlByZXZpZXcgY29tbWl0IG1lc3NhZ2VcIilcbiAgICAgICAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT5cbiAgICAgICAgICAgICAgICBidXR0b24uc2V0QnV0dG9uVGV4dChcIlByZXZpZXdcIikub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21taXRNZXNzYWdlUHJldmlldyA9IGF3YWl0IHBsdWdpbi5naXRNYW5hZ2VyLmZvcm1hdENvbW1pdE1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShgJHtjb21taXRNZXNzYWdlUHJldmlld31gKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiTGlzdCBmaWxlbmFtZXMgYWZmZWN0ZWQgYnkgY29tbWl0IGluIHRoZSBjb21taXQgYm9keVwiKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmxpc3RDaGFuZ2VkRmlsZXNJbk1lc3NhZ2VCb2R5KVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MubGlzdENoYW5nZWRGaWxlc0luTWVzc2FnZUJvZHkgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIkN1cnJlbnQgYnJhbmNoXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIlN3aXRjaCB0byBhIGRpZmZlcmVudCBicmFuY2hcIilcbiAgICAgICAgICAgIC5hZGREcm9wZG93bihhc3luYyAoZHJvcGRvd24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBicmFuY2hJbmZvID0gYXdhaXQgcGx1Z2luLmdpdE1hbmFnZXIuYnJhbmNoSW5mbygpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYnJhbmNoIG9mIGJyYW5jaEluZm8uYnJhbmNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKGJyYW5jaCwgYnJhbmNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUoYnJhbmNoSW5mby5jdXJyZW50KTtcbiAgICAgICAgICAgICAgICBkcm9wZG93bi5vbkNoYW5nZShhc3luYyAob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHBsdWdpbi5naXRNYW5hZ2VyLmNoZWNrb3V0KG9wdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoYENoZWNrZWQgb3V0IHRvICR7b3B0aW9ufWApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlB1bGwgdXBkYXRlcyBvbiBzdGFydHVwXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIkF1dG9tYXRpY2FsbHkgcHVsbCB1cGRhdGVzIHdoZW4gT2JzaWRpYW4gc3RhcnRzXCIpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuYXV0b1B1bGxPbkJvb3QpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5hdXRvUHVsbE9uQm9vdCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiRGlzYWJsZSBwdXNoXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIkRvIG5vdCBwdXNoIGNoYW5nZXMgdG8gdGhlIHJlbW90ZSByZXBvc2l0b3J5XCIpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuZGlzYWJsZVB1c2gpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5kaXNhYmxlUHVzaCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiUHVsbCBjaGFuZ2VzIGJlZm9yZSBwdXNoXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIkNvbW1pdCAtPiBwdWxsIC0+IHB1c2ggKE9ubHkgaWYgcHVzaGluZyBpcyBlbmFibGVkKVwiKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLnB1bGxCZWZvcmVQdXNoKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MucHVsbEJlZm9yZVB1c2ggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlVwZGF0ZSBzdWJtb2R1bGVzXCIpXG4gICAgICAgICAgICAuc2V0RGVzYygnXCJDcmVhdGUgYmFja3VwXCIgYW5kIFwicHVsbFwiIHRha2VzIGNhcmUgb2Ygc3VibW9kdWxlcy4gTWlzc2luZyBmZWF0dXJlczogQ29uZmxpY3RlZCBmaWxlcywgY291bnQgb2YgcHVsbGVkL3B1c2hlZC9jb21taXR0ZWQgZmlsZXMuIFRyYWNraW5nIGJyYW5jaCBuZWVkcyB0byBiZSBzZXQgZm9yIGVhY2ggc3VibW9kdWxlJylcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy51cGRhdGVTdWJtb2R1bGVzKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MudXBkYXRlU3VibW9kdWxlcyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiRGlzYWJsZSBub3RpZmljYXRpb25zXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICBcIkRpc2FibGUgbm90aWZpY2F0aW9ucyBmb3IgZ2l0IG9wZXJhdGlvbnMgdG8gbWluaW1pemUgZGlzdHJhY3Rpb24gKHJlZmVyIHRvIHN0YXR1cyBiYXIgZm9yIHVwZGF0ZXMpXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5kaXNhYmxlUG9wdXBzKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuZGlzYWJsZVBvcHVwcyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiU2hvdyBzdGF0dXMgYmFyXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIk9ic2lkaWFuIG11c3QgYmUgcmVzdGFydGVkIGZvciB0aGUgY2hhbmdlcyB0byB0YWtlIGFmZmVjdFwiKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLnNob3dTdGF0dXNCYXIpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5zaG93U3RhdHVzQmFyID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgIH1cbn0iLCJleHBvcnQgaW50ZXJmYWNlIE9ic2lkaWFuR2l0U2V0dGluZ3Mge1xuICAgIGNvbW1pdE1lc3NhZ2U6IHN0cmluZztcbiAgICBjb21taXREYXRlRm9ybWF0OiBzdHJpbmc7XG4gICAgYXV0b1NhdmVJbnRlcnZhbDogbnVtYmVyO1xuICAgIGF1dG9QdWxsSW50ZXJ2YWw6IG51bWJlcjtcbiAgICBhdXRvUHVsbE9uQm9vdDogYm9vbGVhbjtcbiAgICBkaXNhYmxlUHVzaDogYm9vbGVhbjtcbiAgICBwdWxsQmVmb3JlUHVzaDogYm9vbGVhbjtcbiAgICBkaXNhYmxlUG9wdXBzOiBib29sZWFuO1xuICAgIGxpc3RDaGFuZ2VkRmlsZXNJbk1lc3NhZ2VCb2R5OiBib29sZWFuO1xuICAgIHN0YW5kYWxvbmVNb2RlOiBib29sZWFuO1xuICAgIHByb3h5VVJMOiBzdHJpbmc7XG4gICAgc2hvd1N0YXR1c0JhcjogYm9vbGVhbjtcbiAgICBsYXN0QXV0b0JhY2tVcDogc3RyaW5nO1xuICAgIGxhc3RBdXRvUHVsbDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhvciB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGVtYWlsOiBzdHJpbmc7XG59XG5leHBvcnQgaW50ZXJmYWNlIFN0YXR1cyB7XG4gICAgY2hhbmdlZDogRmlsZVN0YXR1c1Jlc3VsdFtdO1xuICAgIHN0YWdlZDogc3RyaW5nW107XG59XG5leHBvcnQgaW50ZXJmYWNlIEZpbGVTdGF0dXNSZXN1bHQge1xuICAgIHBhdGg6IHN0cmluZztcbiAgICBpbmRleDogc3RyaW5nO1xuICAgIHdvcmtpbmdfZGlyOiBzdHJpbmc7XG59XG5leHBvcnQgaW50ZXJmYWNlIERpZmZSZXN1bHQge1xuICAgIHBhdGg6IHN0cmluZztcbiAgICB0eXBlOiBcImVxdWFsXCIgfCBcIm1vZGlmeVwiIHwgXCJhZGRcIiB8IFwicmVtb3ZlXCI7XG59XG5cbmV4cG9ydCBlbnVtIFBsdWdpblN0YXRlIHtcbiAgICBpZGxlLFxuICAgIHN0YXR1cyxcbiAgICBwdWxsLFxuICAgIGFkZCxcbiAgICBjb21taXQsXG4gICAgcHVzaCxcbiAgICBjb25mbGljdGVkLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJyYW5jaEluZm8ge1xuICAgIGN1cnJlbnQ6IHN0cmluZztcbiAgICB0cmFja2luZzogc3RyaW5nO1xuICAgIGJyYW5jaGVzOiBzdHJpbmdbXTtcbn0iLCJpbXBvcnQgT2JzaWRpYW5HaXQgZnJvbSBcIi4vbWFpblwiO1xuaW1wb3J0IHsgUGx1Z2luU3RhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgU3RhdHVzQmFyTWVzc2FnZSB7XG4gICAgbWVzc2FnZTogc3RyaW5nO1xuICAgIHRpbWVvdXQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFN0YXR1c0JhciB7XG4gICAgcHVibGljIG1lc3NhZ2VzOiBTdGF0dXNCYXJNZXNzYWdlW10gPSBbXTtcbiAgICBwdWJsaWMgY3VycmVudE1lc3NhZ2U6IFN0YXR1c0Jhck1lc3NhZ2U7XG4gICAgcHVibGljIGxhc3RNZXNzYWdlVGltZXN0YW1wOiBudW1iZXI7XG5cbiAgICBwcml2YXRlIHN0YXR1c0JhckVsOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHBsdWdpbjogT2JzaWRpYW5HaXQ7XG5cbiAgICBjb25zdHJ1Y3RvcihzdGF0dXNCYXJFbDogSFRNTEVsZW1lbnQsIHBsdWdpbjogT2JzaWRpYW5HaXQpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJFbCA9IHN0YXR1c0JhckVsO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGlzcGxheU1lc3NhZ2UobWVzc2FnZTogc3RyaW5nLCB0aW1lb3V0OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBnaXQ6ICR7bWVzc2FnZS5zbGljZSgwLCAxMDApfWAsXG4gICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRpc3BsYXkoKSB7XG4gICAgICAgIGlmICh0aGlzLm1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgIXRoaXMuY3VycmVudE1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VzLnNoaWZ0KCk7XG4gICAgICAgICAgICB0aGlzLnN0YXR1c0JhckVsLnNldFRleHQodGhpcy5jdXJyZW50TWVzc2FnZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubGFzdE1lc3NhZ2VUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudE1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VBZ2UgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0TWVzc2FnZVRpbWVzdGFtcDtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlQWdlID49IHRoaXMuY3VycmVudE1lc3NhZ2UudGltZW91dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdE1lc3NhZ2VUaW1lc3RhbXAgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5U3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGlzcGxheVN0YXRlKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMucGx1Z2luLnN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFBsdWdpblN0YXRlLmlkbGU6XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RnJvbU5vdyh0aGlzLnBsdWdpbi5sYXN0VXBkYXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUGx1Z2luU3RhdGUuc3RhdHVzOlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzQmFyRWwuc2V0VGV4dChcImdpdDogY2hlY2tpbmcgcmVwbyBzdGF0dXMuLi5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFBsdWdpblN0YXRlLmFkZDpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0JhckVsLnNldFRleHQoXCJnaXQ6IGFkZGluZyBmaWxlcyB0byByZXBvLi4uXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBQbHVnaW5TdGF0ZS5jb21taXQ6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXJFbC5zZXRUZXh0KFwiZ2l0OiBjb21taXR0aW5nIGNoYW5nZXMuLi5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFBsdWdpblN0YXRlLnB1c2g6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXJFbC5zZXRUZXh0KFwiZ2l0OiBwdXNoaW5nIGNoYW5nZXMuLi5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFBsdWdpblN0YXRlLnB1bGw6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXJFbC5zZXRUZXh0KFwiZ2l0OiBwdWxsaW5nIGNoYW5nZXMuLi5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFBsdWdpblN0YXRlLmNvbmZsaWN0ZWQ6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXJFbC5zZXRUZXh0KFwiZ2l0OiB5b3UgaGF2ZSBjb25mbGljdCBmaWxlcy4uLlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXJFbC5zZXRUZXh0KFwiZ2l0OiBmYWlsZWQgb24gaW5pdGlhbGl6YXRpb24hXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkaXNwbGF5RnJvbU5vdyh0aW1lc3RhbXA6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAodGltZXN0YW1wKSB7XG4gICAgICAgICAgICBsZXQgbW9tZW50ID0gKHdpbmRvdyBhcyBhbnkpLm1vbWVudDtcbiAgICAgICAgICAgIGxldCBmcm9tTm93ID0gbW9tZW50KHRpbWVzdGFtcCkuZnJvbU5vdygpO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXJFbC5zZXRUZXh0KGBnaXQ6IGxhc3QgdXBkYXRlICR7ZnJvbU5vd31gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzQmFyRWwuc2V0VGV4dChgZ2l0OiByZWFkeWApO1xuICAgICAgICB9XG4gICAgfVxufSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5HaXRFcnJvciA9IHZvaWQgMDtcbi8qKlxuICogVGhlIGBHaXRFcnJvcmAgaXMgdGhyb3duIHdoZW4gdGhlIHVuZGVybHlpbmcgYGdpdGAgcHJvY2VzcyB0aHJvd3MgYVxuICogZmF0YWwgZXhjZXB0aW9uIChlZyBhbiBgRU5PRU5UYCBleGNlcHRpb24gd2hlbiBhdHRlbXB0aW5nIHRvIHVzZSBhXG4gKiBub24td3JpdGFibGUgZGlyZWN0b3J5IGFzIHRoZSByb290IGZvciB5b3VyIHJlcG8pLCBhbmQgYWN0cyBhcyB0aGVcbiAqIGJhc2UgY2xhc3MgZm9yIG1vcmUgc3BlY2lmaWMgZXJyb3JzIHRocm93biBieSB0aGUgcGFyc2luZyBvZiB0aGVcbiAqIGdpdCByZXNwb25zZSBvciBlcnJvcnMgaW4gdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHRhc2sgYWJvdXQgdG9cbiAqIGJlIHJ1bi5cbiAqXG4gKiBXaGVuIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24sIHBlbmRpbmcgdGFza3MgaW4gdGhlIHNhbWUgaW5zdGFuY2Ugd2lsbFxuICogbm90IGJlIGV4ZWN1dGVkLiBUaGUgcmVjb21tZW5kZWQgd2F5IHRvIHJ1biBhIHNlcmllcyBvZiB0YXNrcyB0aGF0XG4gKiBjYW4gaW5kZXBlbmRlbnRseSBmYWlsIHdpdGhvdXQgbmVlZGluZyB0byBwcmV2ZW50IGZ1dHVyZSB0YXNrcyBmcm9tXG4gKiBydW5uaW5nIGlzIHRvIGNhdGNoIHRoZW0gaW5kaXZpZHVhbGx5OlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiBpbXBvcnQgeyBnaXRQLCBTaW1wbGVHaXQsIEdpdEVycm9yLCBQdWxsUmVzdWx0IH0gZnJvbSAnc2ltcGxlLWdpdCc7XG5cbiBmdW5jdGlvbiBjYXRjaFRhc2sgKGU6IEdpdEVycm9yKSB7XG4gICByZXR1cm4gZS5cbiB9XG5cbiBjb25zdCBnaXQgPSBnaXRQKHJlcG9Xb3JraW5nRGlyKTtcbiBjb25zdCBwdWxsZWQ6IFB1bGxSZXN1bHQgfCBHaXRFcnJvciA9IGF3YWl0IGdpdC5wdWxsKCkuY2F0Y2goY2F0Y2hUYXNrKTtcbiBjb25zdCBwdXNoZWQ6IHN0cmluZyB8IEdpdEVycm9yID0gYXdhaXQgZ2l0LnB1c2hUYWdzKCkuY2F0Y2goY2F0Y2hUYXNrKTtcbiBgYGBcbiAqL1xuY2xhc3MgR2l0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IodGFzaywgbWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy50YXNrID0gdGFzaztcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIG5ldy50YXJnZXQucHJvdG90eXBlKTtcbiAgICB9XG59XG5leHBvcnRzLkdpdEVycm9yID0gR2l0RXJyb3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1naXQtZXJyb3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdpdFJlc3BvbnNlRXJyb3IgPSB2b2lkIDA7XG5jb25zdCBnaXRfZXJyb3JfMSA9IHJlcXVpcmUoXCIuL2dpdC1lcnJvclwiKTtcbi8qKlxuICogVGhlIGBHaXRSZXNwb25zZUVycm9yYCBpcyB0aGUgd3JhcHBlciBmb3IgYSBwYXJzZWQgcmVzcG9uc2UgdGhhdCBpcyB0cmVhdGVkIGFzXG4gKiBhIGZhdGFsIGVycm9yLCBmb3IgZXhhbXBsZSBhdHRlbXB0aW5nIGEgYG1lcmdlYCBjYW4gbGVhdmUgdGhlIHJlcG8gaW4gYSBjb3JydXB0ZWRcbiAqIHN0YXRlIHdoZW4gdGhlcmUgYXJlIGNvbmZsaWN0cyBzbyB0aGUgdGFzayB3aWxsIHJlamVjdCByYXRoZXIgdGhhbiByZXNvbHZlLlxuICpcbiAqIEZvciBleGFtcGxlLCBjYXRjaGluZyB0aGUgbWVyZ2UgY29uZmxpY3QgZXhjZXB0aW9uOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiBpbXBvcnQgeyBnaXRQLCBTaW1wbGVHaXQsIEdpdFJlc3BvbnNlRXJyb3IsIE1lcmdlU3VtbWFyeSB9IGZyb20gJ3NpbXBsZS1naXQnO1xuXG4gY29uc3QgZ2l0ID0gZ2l0UChyZXBvUm9vdCk7XG4gY29uc3QgbWVyZ2VPcHRpb25zOiBzdHJpbmdbXSA9IFsnLS1uby1mZicsICdvdGhlci1icmFuY2gnXTtcbiBjb25zdCBtZXJnZVN1bW1hcnk6IE1lcmdlU3VtbWFyeSA9IGF3YWl0IGdpdC5tZXJnZShtZXJnZU9wdGlvbnMpXG4gICAgICAuY2F0Y2goKGU6IEdpdFJlc3BvbnNlRXJyb3I8TWVyZ2VTdW1tYXJ5PikgPT4gZS5naXQpO1xuXG4gaWYgKG1lcmdlU3VtbWFyeS5mYWlsZWQpIHtcbiAgIC8vIGRlYWwgd2l0aCB0aGUgZXJyb3JcbiB9XG4gYGBgXG4gKi9cbmNsYXNzIEdpdFJlc3BvbnNlRXJyb3IgZXh0ZW5kcyBnaXRfZXJyb3JfMS5HaXRFcnJvciB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgLyoqXG4gICAgICogYC5naXRgIGFjY2VzcyB0aGUgcGFyc2VkIHJlc3BvbnNlIHRoYXQgaXMgdHJlYXRlZCBhcyBiZWluZyBhbiBlcnJvclxuICAgICAqL1xuICAgIGdpdCwgbWVzc2FnZSkge1xuICAgICAgICBzdXBlcih1bmRlZmluZWQsIG1lc3NhZ2UgfHwgU3RyaW5nKGdpdCkpO1xuICAgICAgICB0aGlzLmdpdCA9IGdpdDtcbiAgICB9XG59XG5leHBvcnRzLkdpdFJlc3BvbnNlRXJyb3IgPSBHaXRSZXNwb25zZUVycm9yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2l0LXJlc3BvbnNlLWVycm9yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5HaXRDb25zdHJ1Y3RFcnJvciA9IHZvaWQgMDtcbmNvbnN0IGdpdF9lcnJvcl8xID0gcmVxdWlyZShcIi4vZ2l0LWVycm9yXCIpO1xuLyoqXG4gKiBUaGUgYEdpdENvbnN0cnVjdEVycm9yYCBpcyB0aHJvd24gd2hlbiBhbiBlcnJvciBvY2N1cnMgaW4gdGhlIGNvbnN0cnVjdG9yXG4gKiBvZiB0aGUgYHNpbXBsZS1naXRgIGluc3RhbmNlIGl0c2VsZi4gTW9zdCBjb21tb25seSBhcyBhIHJlc3VsdCBvZiB1c2luZ1xuICogYSBgYmFzZURpcmAgb3B0aW9uIHRoYXQgcG9pbnRzIHRvIGEgZm9sZGVyIHRoYXQgZWl0aGVyIGRvZXMgbm90IGV4aXN0LFxuICogb3IgY2Fubm90IGJlIHJlYWQgYnkgdGhlIHVzZXIgdGhlIG5vZGUgc2NyaXB0IGlzIHJ1bm5pbmcgYXMuXG4gKlxuICogQ2hlY2sgdGhlIGAubWVzc2FnZWAgcHJvcGVydHkgZm9yIG1vcmUgZGV0YWlsIGluY2x1ZGluZyB0aGUgcHJvcGVydGllc1xuICogcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAqL1xuY2xhc3MgR2l0Q29uc3RydWN0RXJyb3IgZXh0ZW5kcyBnaXRfZXJyb3JfMS5HaXRFcnJvciB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnLCBtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKHVuZGVmaW5lZCwgbWVzc2FnZSk7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIH1cbn1cbmV4cG9ydHMuR2l0Q29uc3RydWN0RXJyb3IgPSBHaXRDb25zdHJ1Y3RFcnJvcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdpdC1jb25zdHJ1Y3QtZXJyb3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdpdFBsdWdpbkVycm9yID0gdm9pZCAwO1xuY29uc3QgZ2l0X2Vycm9yXzEgPSByZXF1aXJlKFwiLi9naXQtZXJyb3JcIik7XG5jbGFzcyBHaXRQbHVnaW5FcnJvciBleHRlbmRzIGdpdF9lcnJvcl8xLkdpdEVycm9yIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXNrLCBwbHVnaW4sIG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIodGFzaywgbWVzc2FnZSk7XG4gICAgICAgIHRoaXMudGFzayA9IHRhc2s7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgbmV3LnRhcmdldC5wcm90b3R5cGUpO1xuICAgIH1cbn1cbmV4cG9ydHMuR2l0UGx1Z2luRXJyb3IgPSBHaXRQbHVnaW5FcnJvcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdpdC1wbHVnaW4tZXJyb3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlRhc2tDb25maWd1cmF0aW9uRXJyb3IgPSB2b2lkIDA7XG5jb25zdCBnaXRfZXJyb3JfMSA9IHJlcXVpcmUoXCIuL2dpdC1lcnJvclwiKTtcbi8qKlxuICogVGhlIGBUYXNrQ29uZmlndXJhdGlvbkVycm9yYCBpcyB0aHJvd24gd2hlbiBhIGNvbW1hbmQgd2FzIGluY29ycmVjdGx5XG4gKiBjb25maWd1cmVkLiBBbiBlcnJvciBvZiB0aGlzIGtpbmQgbWVhbnMgdGhhdCBubyBhdHRlbXB0IHdhcyBtYWRlIHRvXG4gKiBydW4geW91ciBjb21tYW5kIHRocm91Z2ggdGhlIHVuZGVybHlpbmcgYGdpdGAgYmluYXJ5LlxuICpcbiAqIENoZWNrIHRoZSBgLm1lc3NhZ2VgIHByb3BlcnR5IGZvciBtb3JlIGRldGFpbCBvbiB3aHkgeW91ciBjb25maWd1cmF0aW9uXG4gKiByZXN1bHRlZCBpbiBhbiBlcnJvci5cbiAqL1xuY2xhc3MgVGFza0NvbmZpZ3VyYXRpb25FcnJvciBleHRlbmRzIGdpdF9lcnJvcl8xLkdpdEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKHVuZGVmaW5lZCwgbWVzc2FnZSk7XG4gICAgfVxufVxuZXhwb3J0cy5UYXNrQ29uZmlndXJhdGlvbkVycm9yID0gVGFza0NvbmZpZ3VyYXRpb25FcnJvcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhc2stY29uZmlndXJhdGlvbi1lcnJvci5qcy5tYXAiLCIvKipcbiAqIEhlbHBlcnMuXG4gKi9cblxudmFyIHMgPSAxMDAwO1xudmFyIG0gPSBzICogNjA7XG52YXIgaCA9IG0gKiA2MDtcbnZhciBkID0gaCAqIDI0O1xudmFyIHcgPSBkICogNztcbnZhciB5ID0gZCAqIDM2NS4yNTtcblxuLyoqXG4gKiBQYXJzZSBvciBmb3JtYXQgdGhlIGdpdmVuIGB2YWxgLlxuICpcbiAqIE9wdGlvbnM6XG4gKlxuICogIC0gYGxvbmdgIHZlcmJvc2UgZm9ybWF0dGluZyBbZmFsc2VdXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSB2YWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEB0aHJvd3Mge0Vycm9yfSB0aHJvdyBhbiBlcnJvciBpZiB2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIG51bWJlclxuICogQHJldHVybiB7U3RyaW5nfE51bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbDtcbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHBhcnNlKHZhbCk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsKSkge1xuICAgIHJldHVybiBvcHRpb25zLmxvbmcgPyBmbXRMb25nKHZhbCkgOiBmbXRTaG9ydCh2YWwpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAndmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSB2YWxpZCBudW1iZXIuIHZhbD0nICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KHZhbClcbiAgKTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgaWYgKHN0ci5sZW5ndGggPiAxMDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG1hdGNoID0gL14oLT8oPzpcXGQrKT9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHdlZWtzP3x3fHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKFxuICAgIHN0clxuICApO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gIHZhciB0eXBlID0gKG1hdGNoWzJdIHx8ICdtcycpLnRvTG93ZXJDYXNlKCk7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3llYXJzJzpcbiAgICBjYXNlICd5ZWFyJzpcbiAgICBjYXNlICd5cnMnOlxuICAgIGNhc2UgJ3lyJzpcbiAgICBjYXNlICd5JzpcbiAgICAgIHJldHVybiBuICogeTtcbiAgICBjYXNlICd3ZWVrcyc6XG4gICAgY2FzZSAnd2Vlayc6XG4gICAgY2FzZSAndyc6XG4gICAgICByZXR1cm4gbiAqIHc7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtaW5zJzpcbiAgICBjYXNlICdtaW4nOlxuICAgIGNhc2UgJ20nOlxuICAgICAgcmV0dXJuIG4gKiBtO1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogcztcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRTaG9ydChtcykge1xuICB2YXIgbXNBYnMgPSBNYXRoLmFicyhtcyk7XG4gIGlmIChtc0FicyA+PSBkKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBkKSArICdkJztcbiAgfVxuICBpZiAobXNBYnMgPj0gaCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gIH1cbiAgaWYgKG1zQWJzID49IG0pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nO1xuICB9XG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBzKSArICdzJztcbiAgfVxuICByZXR1cm4gbXMgKyAnbXMnO1xufVxuXG4vKipcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10TG9uZyhtcykge1xuICB2YXIgbXNBYnMgPSBNYXRoLmFicyhtcyk7XG4gIGlmIChtc0FicyA+PSBkKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGQsICdkYXknKTtcbiAgfVxuICBpZiAobXNBYnMgPj0gaCkge1xuICAgIHJldHVybiBwbHVyYWwobXMsIG1zQWJzLCBoLCAnaG91cicpO1xuICB9XG4gIGlmIChtc0FicyA+PSBtKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIG0sICdtaW51dGUnKTtcbiAgfVxuICBpZiAobXNBYnMgPj0gcykge1xuICAgIHJldHVybiBwbHVyYWwobXMsIG1zQWJzLCBzLCAnc2Vjb25kJyk7XG4gIH1cbiAgcmV0dXJuIG1zICsgJyBtcyc7XG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBtc0FicywgbiwgbmFtZSkge1xuICB2YXIgaXNQbHVyYWwgPSBtc0FicyA+PSBuICogMS41O1xuICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG4pICsgJyAnICsgbmFtZSArIChpc1BsdXJhbCA/ICdzJyA6ICcnKTtcbn1cbiIsIlxuLyoqXG4gKiBUaGlzIGlzIHRoZSBjb21tb24gbG9naWMgZm9yIGJvdGggdGhlIE5vZGUuanMgYW5kIHdlYiBicm93c2VyXG4gKiBpbXBsZW1lbnRhdGlvbnMgb2YgYGRlYnVnKClgLlxuICovXG5cbmZ1bmN0aW9uIHNldHVwKGVudikge1xuXHRjcmVhdGVEZWJ1Zy5kZWJ1ZyA9IGNyZWF0ZURlYnVnO1xuXHRjcmVhdGVEZWJ1Zy5kZWZhdWx0ID0gY3JlYXRlRGVidWc7XG5cdGNyZWF0ZURlYnVnLmNvZXJjZSA9IGNvZXJjZTtcblx0Y3JlYXRlRGVidWcuZGlzYWJsZSA9IGRpc2FibGU7XG5cdGNyZWF0ZURlYnVnLmVuYWJsZSA9IGVuYWJsZTtcblx0Y3JlYXRlRGVidWcuZW5hYmxlZCA9IGVuYWJsZWQ7XG5cdGNyZWF0ZURlYnVnLmh1bWFuaXplID0gcmVxdWlyZSgnbXMnKTtcblx0Y3JlYXRlRGVidWcuZGVzdHJveSA9IGRlc3Ryb3k7XG5cblx0T2JqZWN0LmtleXMoZW52KS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0Y3JlYXRlRGVidWdba2V5XSA9IGVudltrZXldO1xuXHR9KTtcblxuXHQvKipcblx0KiBUaGUgY3VycmVudGx5IGFjdGl2ZSBkZWJ1ZyBtb2RlIG5hbWVzLCBhbmQgbmFtZXMgdG8gc2tpcC5cblx0Ki9cblxuXHRjcmVhdGVEZWJ1Zy5uYW1lcyA9IFtdO1xuXHRjcmVhdGVEZWJ1Zy5za2lwcyA9IFtdO1xuXG5cdC8qKlxuXHQqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cblx0KlxuXHQqIFZhbGlkIGtleSBuYW1lcyBhcmUgYSBzaW5nbGUsIGxvd2VyIG9yIHVwcGVyLWNhc2UgbGV0dGVyLCBpLmUuIFwiblwiIGFuZCBcIk5cIi5cblx0Ki9cblx0Y3JlYXRlRGVidWcuZm9ybWF0dGVycyA9IHt9O1xuXG5cdC8qKlxuXHQqIFNlbGVjdHMgYSBjb2xvciBmb3IgYSBkZWJ1ZyBuYW1lc3BhY2Vcblx0KiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlIFRoZSBuYW1lc3BhY2Ugc3RyaW5nIGZvciB0aGUgZm9yIHRoZSBkZWJ1ZyBpbnN0YW5jZSB0byBiZSBjb2xvcmVkXG5cdCogQHJldHVybiB7TnVtYmVyfFN0cmluZ30gQW4gQU5TSSBjb2xvciBjb2RlIGZvciB0aGUgZ2l2ZW4gbmFtZXNwYWNlXG5cdCogQGFwaSBwcml2YXRlXG5cdCovXG5cdGZ1bmN0aW9uIHNlbGVjdENvbG9yKG5hbWVzcGFjZSkge1xuXHRcdGxldCBoYXNoID0gMDtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXNwYWNlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBuYW1lc3BhY2UuY2hhckNvZGVBdChpKTtcblx0XHRcdGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNyZWF0ZURlYnVnLmNvbG9yc1tNYXRoLmFicyhoYXNoKSAlIGNyZWF0ZURlYnVnLmNvbG9ycy5sZW5ndGhdO1xuXHR9XG5cdGNyZWF0ZURlYnVnLnNlbGVjdENvbG9yID0gc2VsZWN0Q29sb3I7XG5cblx0LyoqXG5cdCogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG5cdCpcblx0KiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG5cdCogQHJldHVybiB7RnVuY3Rpb259XG5cdCogQGFwaSBwdWJsaWNcblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlRGVidWcobmFtZXNwYWNlKSB7XG5cdFx0bGV0IHByZXZUaW1lO1xuXHRcdGxldCBlbmFibGVPdmVycmlkZSA9IG51bGw7XG5cdFx0bGV0IG5hbWVzcGFjZXNDYWNoZTtcblx0XHRsZXQgZW5hYmxlZENhY2hlO1xuXG5cdFx0ZnVuY3Rpb24gZGVidWcoLi4uYXJncykge1xuXHRcdFx0Ly8gRGlzYWJsZWQ/XG5cdFx0XHRpZiAoIWRlYnVnLmVuYWJsZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzZWxmID0gZGVidWc7XG5cblx0XHRcdC8vIFNldCBgZGlmZmAgdGltZXN0YW1wXG5cdFx0XHRjb25zdCBjdXJyID0gTnVtYmVyKG5ldyBEYXRlKCkpO1xuXHRcdFx0Y29uc3QgbXMgPSBjdXJyIC0gKHByZXZUaW1lIHx8IGN1cnIpO1xuXHRcdFx0c2VsZi5kaWZmID0gbXM7XG5cdFx0XHRzZWxmLnByZXYgPSBwcmV2VGltZTtcblx0XHRcdHNlbGYuY3VyciA9IGN1cnI7XG5cdFx0XHRwcmV2VGltZSA9IGN1cnI7XG5cblx0XHRcdGFyZ3NbMF0gPSBjcmVhdGVEZWJ1Zy5jb2VyY2UoYXJnc1swXSk7XG5cblx0XHRcdGlmICh0eXBlb2YgYXJnc1swXSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0Ly8gQW55dGhpbmcgZWxzZSBsZXQncyBpbnNwZWN0IHdpdGggJU9cblx0XHRcdFx0YXJncy51bnNoaWZ0KCclTycpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuXHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdGFyZ3NbMF0gPSBhcmdzWzBdLnJlcGxhY2UoLyUoW2EtekEtWiVdKS9nLCAobWF0Y2gsIGZvcm1hdCkgPT4ge1xuXHRcdFx0XHQvLyBJZiB3ZSBlbmNvdW50ZXIgYW4gZXNjYXBlZCAlIHRoZW4gZG9uJ3QgaW5jcmVhc2UgdGhlIGFycmF5IGluZGV4XG5cdFx0XHRcdGlmIChtYXRjaCA9PT0gJyUlJykge1xuXHRcdFx0XHRcdHJldHVybiAnJSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0Y29uc3QgZm9ybWF0dGVyID0gY3JlYXRlRGVidWcuZm9ybWF0dGVyc1tmb3JtYXRdO1xuXHRcdFx0XHRpZiAodHlwZW9mIGZvcm1hdHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNvbnN0IHZhbCA9IGFyZ3NbaW5kZXhdO1xuXHRcdFx0XHRcdG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTtcblxuXHRcdFx0XHRcdC8vIE5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcblx0XHRcdFx0XHRhcmdzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdFx0aW5kZXgtLTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcblx0XHRcdGNyZWF0ZURlYnVnLmZvcm1hdEFyZ3MuY2FsbChzZWxmLCBhcmdzKTtcblxuXHRcdFx0Y29uc3QgbG9nRm4gPSBzZWxmLmxvZyB8fCBjcmVhdGVEZWJ1Zy5sb2c7XG5cdFx0XHRsb2dGbi5hcHBseShzZWxmLCBhcmdzKTtcblx0XHR9XG5cblx0XHRkZWJ1Zy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG5cdFx0ZGVidWcudXNlQ29sb3JzID0gY3JlYXRlRGVidWcudXNlQ29sb3JzKCk7XG5cdFx0ZGVidWcuY29sb3IgPSBjcmVhdGVEZWJ1Zy5zZWxlY3RDb2xvcihuYW1lc3BhY2UpO1xuXHRcdGRlYnVnLmV4dGVuZCA9IGV4dGVuZDtcblx0XHRkZWJ1Zy5kZXN0cm95ID0gY3JlYXRlRGVidWcuZGVzdHJveTsgLy8gWFhYIFRlbXBvcmFyeS4gV2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuXG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVidWcsICdlbmFibGVkJywge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRnZXQ6ICgpID0+IHtcblx0XHRcdFx0aWYgKGVuYWJsZU92ZXJyaWRlICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVuYWJsZU92ZXJyaWRlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChuYW1lc3BhY2VzQ2FjaGUgIT09IGNyZWF0ZURlYnVnLm5hbWVzcGFjZXMpIHtcblx0XHRcdFx0XHRuYW1lc3BhY2VzQ2FjaGUgPSBjcmVhdGVEZWJ1Zy5uYW1lc3BhY2VzO1xuXHRcdFx0XHRcdGVuYWJsZWRDYWNoZSA9IGNyZWF0ZURlYnVnLmVuYWJsZWQobmFtZXNwYWNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBlbmFibGVkQ2FjaGU7XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiB2ID0+IHtcblx0XHRcdFx0ZW5hYmxlT3ZlcnJpZGUgPSB2O1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gRW52LXNwZWNpZmljIGluaXRpYWxpemF0aW9uIGxvZ2ljIGZvciBkZWJ1ZyBpbnN0YW5jZXNcblx0XHRpZiAodHlwZW9mIGNyZWF0ZURlYnVnLmluaXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGNyZWF0ZURlYnVnLmluaXQoZGVidWcpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZWJ1Zztcblx0fVxuXG5cdGZ1bmN0aW9uIGV4dGVuZChuYW1lc3BhY2UsIGRlbGltaXRlcikge1xuXHRcdGNvbnN0IG5ld0RlYnVnID0gY3JlYXRlRGVidWcodGhpcy5uYW1lc3BhY2UgKyAodHlwZW9mIGRlbGltaXRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnOicgOiBkZWxpbWl0ZXIpICsgbmFtZXNwYWNlKTtcblx0XHRuZXdEZWJ1Zy5sb2cgPSB0aGlzLmxvZztcblx0XHRyZXR1cm4gbmV3RGVidWc7XG5cdH1cblxuXHQvKipcblx0KiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG5cdCogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cblx0KlxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG5cdCogQGFwaSBwdWJsaWNcblx0Ki9cblx0ZnVuY3Rpb24gZW5hYmxlKG5hbWVzcGFjZXMpIHtcblx0XHRjcmVhdGVEZWJ1Zy5zYXZlKG5hbWVzcGFjZXMpO1xuXHRcdGNyZWF0ZURlYnVnLm5hbWVzcGFjZXMgPSBuYW1lc3BhY2VzO1xuXG5cdFx0Y3JlYXRlRGVidWcubmFtZXMgPSBbXTtcblx0XHRjcmVhdGVEZWJ1Zy5za2lwcyA9IFtdO1xuXG5cdFx0bGV0IGk7XG5cdFx0Y29uc3Qgc3BsaXQgPSAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnID8gbmFtZXNwYWNlcyA6ICcnKS5zcGxpdCgvW1xccyxdKy8pO1xuXHRcdGNvbnN0IGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKCFzcGxpdFtpXSkge1xuXHRcdFx0XHQvLyBpZ25vcmUgZW1wdHkgc3RyaW5nc1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0bmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG5cblx0XHRcdGlmIChuYW1lc3BhY2VzWzBdID09PSAnLScpIHtcblx0XHRcdFx0Y3JlYXRlRGVidWcuc2tpcHMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMuc3Vic3RyKDEpICsgJyQnKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjcmVhdGVEZWJ1Zy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcyArICckJykpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuXHQqXG5cdCogQHJldHVybiB7U3RyaW5nfSBuYW1lc3BhY2VzXG5cdCogQGFwaSBwdWJsaWNcblx0Ki9cblx0ZnVuY3Rpb24gZGlzYWJsZSgpIHtcblx0XHRjb25zdCBuYW1lc3BhY2VzID0gW1xuXHRcdFx0Li4uY3JlYXRlRGVidWcubmFtZXMubWFwKHRvTmFtZXNwYWNlKSxcblx0XHRcdC4uLmNyZWF0ZURlYnVnLnNraXBzLm1hcCh0b05hbWVzcGFjZSkubWFwKG5hbWVzcGFjZSA9PiAnLScgKyBuYW1lc3BhY2UpXG5cdFx0XS5qb2luKCcsJyk7XG5cdFx0Y3JlYXRlRGVidWcuZW5hYmxlKCcnKTtcblx0XHRyZXR1cm4gbmFtZXNwYWNlcztcblx0fVxuXG5cdC8qKlxuXHQqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cblx0KlxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG5cdCogQHJldHVybiB7Qm9vbGVhbn1cblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBlbmFibGVkKG5hbWUpIHtcblx0XHRpZiAobmFtZVtuYW1lLmxlbmd0aCAtIDFdID09PSAnKicpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGxldCBpO1xuXHRcdGxldCBsZW47XG5cblx0XHRmb3IgKGkgPSAwLCBsZW4gPSBjcmVhdGVEZWJ1Zy5za2lwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKGNyZWF0ZURlYnVnLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IGNyZWF0ZURlYnVnLm5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoY3JlYXRlRGVidWcubmFtZXNbaV0udGVzdChuYW1lKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0KiBDb252ZXJ0IHJlZ2V4cCB0byBuYW1lc3BhY2Vcblx0KlxuXHQqIEBwYXJhbSB7UmVnRXhwfSByZWd4ZXBcblx0KiBAcmV0dXJuIHtTdHJpbmd9IG5hbWVzcGFjZVxuXHQqIEBhcGkgcHJpdmF0ZVxuXHQqL1xuXHRmdW5jdGlvbiB0b05hbWVzcGFjZShyZWdleHApIHtcblx0XHRyZXR1cm4gcmVnZXhwLnRvU3RyaW5nKClcblx0XHRcdC5zdWJzdHJpbmcoMiwgcmVnZXhwLnRvU3RyaW5nKCkubGVuZ3RoIC0gMilcblx0XHRcdC5yZXBsYWNlKC9cXC5cXCpcXD8kLywgJyonKTtcblx0fVxuXG5cdC8qKlxuXHQqIENvZXJjZSBgdmFsYC5cblx0KlxuXHQqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuXHQqIEByZXR1cm4ge01peGVkfVxuXHQqIEBhcGkgcHJpdmF0ZVxuXHQqL1xuXHRmdW5jdGlvbiBjb2VyY2UodmFsKSB7XG5cdFx0aWYgKHZhbCBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdFx0XHRyZXR1cm4gdmFsLnN0YWNrIHx8IHZhbC5tZXNzYWdlO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsO1xuXHR9XG5cblx0LyoqXG5cdCogWFhYIERPIE5PVCBVU0UuIFRoaXMgaXMgYSB0ZW1wb3Jhcnkgc3R1YiBmdW5jdGlvbi5cblx0KiBYWFggSXQgV0lMTCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuXG5cdCovXG5cdGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdFx0Y29uc29sZS53YXJuKCdJbnN0YW5jZSBtZXRob2QgYGRlYnVnLmRlc3Ryb3koKWAgaXMgZGVwcmVjYXRlZCBhbmQgbm8gbG9uZ2VyIGRvZXMgYW55dGhpbmcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uIG9mIGBkZWJ1Z2AuJyk7XG5cdH1cblxuXHRjcmVhdGVEZWJ1Zy5lbmFibGUoY3JlYXRlRGVidWcubG9hZCgpKTtcblxuXHRyZXR1cm4gY3JlYXRlRGVidWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dXA7XG4iLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSB3ZWIgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLnN0b3JhZ2UgPSBsb2NhbHN0b3JhZ2UoKTtcbmV4cG9ydHMuZGVzdHJveSA9ICgoKSA9PiB7XG5cdGxldCB3YXJuZWQgPSBmYWxzZTtcblxuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdGlmICghd2FybmVkKSB7XG5cdFx0XHR3YXJuZWQgPSB0cnVlO1xuXHRcdFx0Y29uc29sZS53YXJuKCdJbnN0YW5jZSBtZXRob2QgYGRlYnVnLmRlc3Ryb3koKWAgaXMgZGVwcmVjYXRlZCBhbmQgbm8gbG9uZ2VyIGRvZXMgYW55dGhpbmcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uIG9mIGBkZWJ1Z2AuJyk7XG5cdFx0fVxuXHR9O1xufSkoKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbXG5cdCcjMDAwMENDJyxcblx0JyMwMDAwRkYnLFxuXHQnIzAwMzNDQycsXG5cdCcjMDAzM0ZGJyxcblx0JyMwMDY2Q0MnLFxuXHQnIzAwNjZGRicsXG5cdCcjMDA5OUNDJyxcblx0JyMwMDk5RkYnLFxuXHQnIzAwQ0MwMCcsXG5cdCcjMDBDQzMzJyxcblx0JyMwMENDNjYnLFxuXHQnIzAwQ0M5OScsXG5cdCcjMDBDQ0NDJyxcblx0JyMwMENDRkYnLFxuXHQnIzMzMDBDQycsXG5cdCcjMzMwMEZGJyxcblx0JyMzMzMzQ0MnLFxuXHQnIzMzMzNGRicsXG5cdCcjMzM2NkNDJyxcblx0JyMzMzY2RkYnLFxuXHQnIzMzOTlDQycsXG5cdCcjMzM5OUZGJyxcblx0JyMzM0NDMDAnLFxuXHQnIzMzQ0MzMycsXG5cdCcjMzNDQzY2Jyxcblx0JyMzM0NDOTknLFxuXHQnIzMzQ0NDQycsXG5cdCcjMzNDQ0ZGJyxcblx0JyM2NjAwQ0MnLFxuXHQnIzY2MDBGRicsXG5cdCcjNjYzM0NDJyxcblx0JyM2NjMzRkYnLFxuXHQnIzY2Q0MwMCcsXG5cdCcjNjZDQzMzJyxcblx0JyM5OTAwQ0MnLFxuXHQnIzk5MDBGRicsXG5cdCcjOTkzM0NDJyxcblx0JyM5OTMzRkYnLFxuXHQnIzk5Q0MwMCcsXG5cdCcjOTlDQzMzJyxcblx0JyNDQzAwMDAnLFxuXHQnI0NDMDAzMycsXG5cdCcjQ0MwMDY2Jyxcblx0JyNDQzAwOTknLFxuXHQnI0NDMDBDQycsXG5cdCcjQ0MwMEZGJyxcblx0JyNDQzMzMDAnLFxuXHQnI0NDMzMzMycsXG5cdCcjQ0MzMzY2Jyxcblx0JyNDQzMzOTknLFxuXHQnI0NDMzNDQycsXG5cdCcjQ0MzM0ZGJyxcblx0JyNDQzY2MDAnLFxuXHQnI0NDNjYzMycsXG5cdCcjQ0M5OTAwJyxcblx0JyNDQzk5MzMnLFxuXHQnI0NDQ0MwMCcsXG5cdCcjQ0NDQzMzJyxcblx0JyNGRjAwMDAnLFxuXHQnI0ZGMDAzMycsXG5cdCcjRkYwMDY2Jyxcblx0JyNGRjAwOTknLFxuXHQnI0ZGMDBDQycsXG5cdCcjRkYwMEZGJyxcblx0JyNGRjMzMDAnLFxuXHQnI0ZGMzMzMycsXG5cdCcjRkYzMzY2Jyxcblx0JyNGRjMzOTknLFxuXHQnI0ZGMzNDQycsXG5cdCcjRkYzM0ZGJyxcblx0JyNGRjY2MDAnLFxuXHQnI0ZGNjYzMycsXG5cdCcjRkY5OTAwJyxcblx0JyNGRjk5MzMnLFxuXHQnI0ZGQ0MwMCcsXG5cdCcjRkZDQzMzJ1xuXTtcblxuLyoqXG4gKiBDdXJyZW50bHkgb25seSBXZWJLaXQtYmFzZWQgV2ViIEluc3BlY3RvcnMsIEZpcmVmb3ggPj0gdjMxLFxuICogYW5kIHRoZSBGaXJlYnVnIGV4dGVuc2lvbiAoYW55IEZpcmVmb3ggdmVyc2lvbikgYXJlIGtub3duXG4gKiB0byBzdXBwb3J0IFwiJWNcIiBDU1MgY3VzdG9taXphdGlvbnMuXG4gKlxuICogVE9ETzogYWRkIGEgYGxvY2FsU3RvcmFnZWAgdmFyaWFibGUgdG8gZXhwbGljaXRseSBlbmFibGUvZGlzYWJsZSBjb2xvcnNcbiAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuXHQvLyBOQjogSW4gYW4gRWxlY3Ryb24gcHJlbG9hZCBzY3JpcHQsIGRvY3VtZW50IHdpbGwgYmUgZGVmaW5lZCBidXQgbm90IGZ1bGx5XG5cdC8vIGluaXRpYWxpemVkLiBTaW5jZSB3ZSBrbm93IHdlJ3JlIGluIENocm9tZSwgd2UnbGwganVzdCBkZXRlY3QgdGhpcyBjYXNlXG5cdC8vIGV4cGxpY2l0bHlcblx0aWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wcm9jZXNzICYmICh3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInIHx8IHdpbmRvdy5wcm9jZXNzLl9fbndqcykpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIEludGVybmV0IEV4cGxvcmVyIGFuZCBFZGdlIGRvIG5vdCBzdXBwb3J0IGNvbG9ycy5cblx0aWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC8oZWRnZXx0cmlkZW50KVxcLyhcXGQrKS8pKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gSXMgd2Via2l0PyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjQ1OTYwNi8zNzY3NzNcblx0Ly8gZG9jdW1lbnQgaXMgdW5kZWZpbmVkIGluIHJlYWN0LW5hdGl2ZTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0LW5hdGl2ZS9wdWxsLzE2MzJcblx0cmV0dXJuICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLldlYmtpdEFwcGVhcmFuY2UpIHx8XG5cdFx0Ly8gSXMgZmlyZWJ1Zz8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzk4MTIwLzM3Njc3M1xuXHRcdCh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuY29uc29sZSAmJiAod2luZG93LmNvbnNvbGUuZmlyZWJ1ZyB8fCAod2luZG93LmNvbnNvbGUuZXhjZXB0aW9uICYmIHdpbmRvdy5jb25zb2xlLnRhYmxlKSkpIHx8XG5cdFx0Ly8gSXMgZmlyZWZveCA+PSB2MzE/XG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Ub29scy9XZWJfQ29uc29sZSNTdHlsaW5nX21lc3NhZ2VzXG5cdFx0KHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9maXJlZm94XFwvKFxcZCspLykgJiYgcGFyc2VJbnQoUmVnRXhwLiQxLCAxMCkgPj0gMzEpIHx8XG5cdFx0Ly8gRG91YmxlIGNoZWNrIHdlYmtpdCBpbiB1c2VyQWdlbnQganVzdCBpbiBjYXNlIHdlIGFyZSBpbiBhIHdvcmtlclxuXHRcdCh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvYXBwbGV3ZWJraXRcXC8oXFxkKykvKSk7XG59XG5cbi8qKlxuICogQ29sb3JpemUgbG9nIGFyZ3VtZW50cyBpZiBlbmFibGVkLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0QXJncyhhcmdzKSB7XG5cdGFyZ3NbMF0gPSAodGhpcy51c2VDb2xvcnMgPyAnJWMnIDogJycpICtcblx0XHR0aGlzLm5hbWVzcGFjZSArXG5cdFx0KHRoaXMudXNlQ29sb3JzID8gJyAlYycgOiAnICcpICtcblx0XHRhcmdzWzBdICtcblx0XHQodGhpcy51c2VDb2xvcnMgPyAnJWMgJyA6ICcgJykgK1xuXHRcdCcrJyArIG1vZHVsZS5leHBvcnRzLmh1bWFuaXplKHRoaXMuZGlmZik7XG5cblx0aWYgKCF0aGlzLnVzZUNvbG9ycykge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGMgPSAnY29sb3I6ICcgKyB0aGlzLmNvbG9yO1xuXHRhcmdzLnNwbGljZSgxLCAwLCBjLCAnY29sb3I6IGluaGVyaXQnKTtcblxuXHQvLyBUaGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuXHQvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG5cdC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuXHRsZXQgaW5kZXggPSAwO1xuXHRsZXQgbGFzdEMgPSAwO1xuXHRhcmdzWzBdLnJlcGxhY2UoLyVbYS16QS1aJV0vZywgbWF0Y2ggPT4ge1xuXHRcdGlmIChtYXRjaCA9PT0gJyUlJykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpbmRleCsrO1xuXHRcdGlmIChtYXRjaCA9PT0gJyVjJykge1xuXHRcdFx0Ly8gV2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG5cdFx0XHQvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuXHRcdFx0bGFzdEMgPSBpbmRleDtcblx0XHR9XG5cdH0pO1xuXG5cdGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbn1cblxuLyoqXG4gKiBJbnZva2VzIGBjb25zb2xlLmRlYnVnKClgIHdoZW4gYXZhaWxhYmxlLlxuICogTm8tb3Agd2hlbiBgY29uc29sZS5kZWJ1Z2AgaXMgbm90IGEgXCJmdW5jdGlvblwiLlxuICogSWYgYGNvbnNvbGUuZGVidWdgIGlzIG5vdCBhdmFpbGFibGUsIGZhbGxzIGJhY2tcbiAqIHRvIGBjb25zb2xlLmxvZ2AuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0cy5sb2cgPSBjb25zb2xlLmRlYnVnIHx8IGNvbnNvbGUubG9nIHx8ICgoKSA9PiB7fSk7XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcblx0dHJ5IHtcblx0XHRpZiAobmFtZXNwYWNlcykge1xuXHRcdFx0ZXhwb3J0cy5zdG9yYWdlLnNldEl0ZW0oJ2RlYnVnJywgbmFtZXNwYWNlcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGV4cG9ydHMuc3RvcmFnZS5yZW1vdmVJdGVtKCdkZWJ1ZycpO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHQvLyBTd2FsbG93XG5cdFx0Ly8gWFhYIChAUWl4LSkgc2hvdWxkIHdlIGJlIGxvZ2dpbmcgdGhlc2U/XG5cdH1cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gbG9hZCgpIHtcblx0bGV0IHI7XG5cdHRyeSB7XG5cdFx0ciA9IGV4cG9ydHMuc3RvcmFnZS5nZXRJdGVtKCdkZWJ1ZycpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdC8vIFN3YWxsb3dcblx0XHQvLyBYWFggKEBRaXgtKSBzaG91bGQgd2UgYmUgbG9nZ2luZyB0aGVzZT9cblx0fVxuXG5cdC8vIElmIGRlYnVnIGlzbid0IHNldCBpbiBMUywgYW5kIHdlJ3JlIGluIEVsZWN0cm9uLCB0cnkgdG8gbG9hZCAkREVCVUdcblx0aWYgKCFyICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAnZW52JyBpbiBwcm9jZXNzKSB7XG5cdFx0ciA9IHByb2Nlc3MuZW52LkRFQlVHO1xuXHR9XG5cblx0cmV0dXJuIHI7XG59XG5cbi8qKlxuICogTG9jYWxzdG9yYWdlIGF0dGVtcHRzIHRvIHJldHVybiB0aGUgbG9jYWxzdG9yYWdlLlxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICogd2hlbiBhIHVzZXIgZGlzYWJsZXMgY29va2llcy9sb2NhbHN0b3JhZ2VcbiAqIGFuZCB5b3UgYXR0ZW1wdCB0byBhY2Nlc3MgaXQuXG4gKlxuICogQHJldHVybiB7TG9jYWxTdG9yYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9jYWxzdG9yYWdlKCkge1xuXHR0cnkge1xuXHRcdC8vIFRWTUxLaXQgKEFwcGxlIFRWIEpTIFJ1bnRpbWUpIGRvZXMgbm90IGhhdmUgYSB3aW5kb3cgb2JqZWN0LCBqdXN0IGxvY2FsU3RvcmFnZSBpbiB0aGUgZ2xvYmFsIGNvbnRleHRcblx0XHQvLyBUaGUgQnJvd3NlciBhbHNvIGhhcyBsb2NhbFN0b3JhZ2UgaW4gdGhlIGdsb2JhbCBjb250ZXh0LlxuXHRcdHJldHVybiBsb2NhbFN0b3JhZ2U7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Ly8gU3dhbGxvd1xuXHRcdC8vIFhYWCAoQFFpeC0pIHNob3VsZCB3ZSBiZSBsb2dnaW5nIHRoZXNlP1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9jb21tb24nKShleHBvcnRzKTtcblxuY29uc3Qge2Zvcm1hdHRlcnN9ID0gbW9kdWxlLmV4cG9ydHM7XG5cbi8qKlxuICogTWFwICVqIHRvIGBKU09OLnN0cmluZ2lmeSgpYCwgc2luY2Ugbm8gV2ViIEluc3BlY3RvcnMgZG8gdGhhdCBieSBkZWZhdWx0LlxuICovXG5cbmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uICh2KSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiAnW1VuZXhwZWN0ZWRKU09OUGFyc2VFcnJvcl06ICcgKyBlcnJvci5tZXNzYWdlO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmbGFnLCBhcmd2ID0gcHJvY2Vzcy5hcmd2KSA9PiB7XG5cdGNvbnN0IHByZWZpeCA9IGZsYWcuc3RhcnRzV2l0aCgnLScpID8gJycgOiAoZmxhZy5sZW5ndGggPT09IDEgPyAnLScgOiAnLS0nKTtcblx0Y29uc3QgcG9zaXRpb24gPSBhcmd2LmluZGV4T2YocHJlZml4ICsgZmxhZyk7XG5cdGNvbnN0IHRlcm1pbmF0b3JQb3NpdGlvbiA9IGFyZ3YuaW5kZXhPZignLS0nKTtcblx0cmV0dXJuIHBvc2l0aW9uICE9PSAtMSAmJiAodGVybWluYXRvclBvc2l0aW9uID09PSAtMSB8fCBwb3NpdGlvbiA8IHRlcm1pbmF0b3JQb3NpdGlvbik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuY29uc3QgdHR5ID0gcmVxdWlyZSgndHR5Jyk7XG5jb25zdCBoYXNGbGFnID0gcmVxdWlyZSgnaGFzLWZsYWcnKTtcblxuY29uc3Qge2Vudn0gPSBwcm9jZXNzO1xuXG5sZXQgZm9yY2VDb2xvcjtcbmlmIChoYXNGbGFnKCduby1jb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ25vLWNvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPWZhbHNlJykgfHxcblx0aGFzRmxhZygnY29sb3I9bmV2ZXInKSkge1xuXHRmb3JjZUNvbG9yID0gMDtcbn0gZWxzZSBpZiAoaGFzRmxhZygnY29sb3InKSB8fFxuXHRoYXNGbGFnKCdjb2xvcnMnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj10cnVlJykgfHxcblx0aGFzRmxhZygnY29sb3I9YWx3YXlzJykpIHtcblx0Zm9yY2VDb2xvciA9IDE7XG59XG5cbmlmICgnRk9SQ0VfQ09MT1InIGluIGVudikge1xuXHRpZiAoZW52LkZPUkNFX0NPTE9SID09PSAndHJ1ZScpIHtcblx0XHRmb3JjZUNvbG9yID0gMTtcblx0fSBlbHNlIGlmIChlbnYuRk9SQ0VfQ09MT1IgPT09ICdmYWxzZScpIHtcblx0XHRmb3JjZUNvbG9yID0gMDtcblx0fSBlbHNlIHtcblx0XHRmb3JjZUNvbG9yID0gZW52LkZPUkNFX0NPTE9SLmxlbmd0aCA9PT0gMCA/IDEgOiBNYXRoLm1pbihwYXJzZUludChlbnYuRk9SQ0VfQ09MT1IsIDEwKSwgMyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpIHtcblx0aWYgKGxldmVsID09PSAwKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRsZXZlbCxcblx0XHRoYXNCYXNpYzogdHJ1ZSxcblx0XHRoYXMyNTY6IGxldmVsID49IDIsXG5cdFx0aGFzMTZtOiBsZXZlbCA+PSAzXG5cdH07XG59XG5cbmZ1bmN0aW9uIHN1cHBvcnRzQ29sb3IoaGF2ZVN0cmVhbSwgc3RyZWFtSXNUVFkpIHtcblx0aWYgKGZvcmNlQ29sb3IgPT09IDApIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGlmIChoYXNGbGFnKCdjb2xvcj0xNm0nKSB8fFxuXHRcdGhhc0ZsYWcoJ2NvbG9yPWZ1bGwnKSB8fFxuXHRcdGhhc0ZsYWcoJ2NvbG9yPXRydWVjb2xvcicpKSB7XG5cdFx0cmV0dXJuIDM7XG5cdH1cblxuXHRpZiAoaGFzRmxhZygnY29sb3I9MjU2JykpIHtcblx0XHRyZXR1cm4gMjtcblx0fVxuXG5cdGlmIChoYXZlU3RyZWFtICYmICFzdHJlYW1Jc1RUWSAmJiBmb3JjZUNvbG9yID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGNvbnN0IG1pbiA9IGZvcmNlQ29sb3IgfHwgMDtcblxuXHRpZiAoZW52LlRFUk0gPT09ICdkdW1iJykge1xuXHRcdHJldHVybiBtaW47XG5cdH1cblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuXHRcdC8vIFdpbmRvd3MgMTAgYnVpbGQgMTA1ODYgaXMgdGhlIGZpcnN0IFdpbmRvd3MgcmVsZWFzZSB0aGF0IHN1cHBvcnRzIDI1NiBjb2xvcnMuXG5cdFx0Ly8gV2luZG93cyAxMCBidWlsZCAxNDkzMSBpcyB0aGUgZmlyc3QgcmVsZWFzZSB0aGF0IHN1cHBvcnRzIDE2bS9UcnVlQ29sb3IuXG5cdFx0Y29uc3Qgb3NSZWxlYXNlID0gb3MucmVsZWFzZSgpLnNwbGl0KCcuJyk7XG5cdFx0aWYgKFxuXHRcdFx0TnVtYmVyKG9zUmVsZWFzZVswXSkgPj0gMTAgJiZcblx0XHRcdE51bWJlcihvc1JlbGVhc2VbMl0pID49IDEwNTg2XG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gTnVtYmVyKG9zUmVsZWFzZVsyXSkgPj0gMTQ5MzEgPyAzIDogMjtcblx0XHR9XG5cblx0XHRyZXR1cm4gMTtcblx0fVxuXG5cdGlmICgnQ0knIGluIGVudikge1xuXHRcdGlmIChbJ1RSQVZJUycsICdDSVJDTEVDSScsICdBUFBWRVlPUicsICdHSVRMQUJfQ0knLCAnR0lUSFVCX0FDVElPTlMnLCAnQlVJTERLSVRFJ10uc29tZShzaWduID0+IHNpZ24gaW4gZW52KSB8fCBlbnYuQ0lfTkFNRSA9PT0gJ2NvZGVzaGlwJykge1xuXHRcdFx0cmV0dXJuIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1pbjtcblx0fVxuXG5cdGlmICgnVEVBTUNJVFlfVkVSU0lPTicgaW4gZW52KSB7XG5cdFx0cmV0dXJuIC9eKDlcXC4oMCpbMS05XVxcZCopXFwufFxcZHsyLH1cXC4pLy50ZXN0KGVudi5URUFNQ0lUWV9WRVJTSU9OKSA/IDEgOiAwO1xuXHR9XG5cblx0aWYgKGVudi5DT0xPUlRFUk0gPT09ICd0cnVlY29sb3InKSB7XG5cdFx0cmV0dXJuIDM7XG5cdH1cblxuXHRpZiAoJ1RFUk1fUFJPR1JBTScgaW4gZW52KSB7XG5cdFx0Y29uc3QgdmVyc2lvbiA9IHBhcnNlSW50KChlbnYuVEVSTV9QUk9HUkFNX1ZFUlNJT04gfHwgJycpLnNwbGl0KCcuJylbMF0sIDEwKTtcblxuXHRcdHN3aXRjaCAoZW52LlRFUk1fUFJPR1JBTSkge1xuXHRcdFx0Y2FzZSAnaVRlcm0uYXBwJzpcblx0XHRcdFx0cmV0dXJuIHZlcnNpb24gPj0gMyA/IDMgOiAyO1xuXHRcdFx0Y2FzZSAnQXBwbGVfVGVybWluYWwnOlxuXHRcdFx0XHRyZXR1cm4gMjtcblx0XHRcdC8vIE5vIGRlZmF1bHRcblx0XHR9XG5cdH1cblxuXHRpZiAoLy0yNTYoY29sb3IpPyQvaS50ZXN0KGVudi5URVJNKSkge1xuXHRcdHJldHVybiAyO1xuXHR9XG5cblx0aWYgKC9ec2NyZWVufF54dGVybXxednQxMDB8XnZ0MjIwfF5yeHZ0fGNvbG9yfGFuc2l8Y3lnd2lufGxpbnV4L2kudGVzdChlbnYuVEVSTSkpIHtcblx0XHRyZXR1cm4gMTtcblx0fVxuXG5cdGlmICgnQ09MT1JURVJNJyBpbiBlbnYpIHtcblx0XHRyZXR1cm4gMTtcblx0fVxuXG5cdHJldHVybiBtaW47XG59XG5cbmZ1bmN0aW9uIGdldFN1cHBvcnRMZXZlbChzdHJlYW0pIHtcblx0Y29uc3QgbGV2ZWwgPSBzdXBwb3J0c0NvbG9yKHN0cmVhbSwgc3RyZWFtICYmIHN0cmVhbS5pc1RUWSk7XG5cdHJldHVybiB0cmFuc2xhdGVMZXZlbChsZXZlbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdXBwb3J0c0NvbG9yOiBnZXRTdXBwb3J0TGV2ZWwsXG5cdHN0ZG91dDogdHJhbnNsYXRlTGV2ZWwoc3VwcG9ydHNDb2xvcih0cnVlLCB0dHkuaXNhdHR5KDEpKSksXG5cdHN0ZGVycjogdHJhbnNsYXRlTGV2ZWwoc3VwcG9ydHNDb2xvcih0cnVlLCB0dHkuaXNhdHR5KDIpKSlcbn07XG4iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxuY29uc3QgdHR5ID0gcmVxdWlyZSgndHR5Jyk7XG5jb25zdCB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIE5vZGUuanMgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICovXG5cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuZXhwb3J0cy5kZXN0cm95ID0gdXRpbC5kZXByZWNhdGUoXG5cdCgpID0+IHt9LFxuXHQnSW5zdGFuY2UgbWV0aG9kIGBkZWJ1Zy5kZXN0cm95KClgIGlzIGRlcHJlY2F0ZWQgYW5kIG5vIGxvbmdlciBkb2VzIGFueXRoaW5nLiBJdCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvbiBvZiBgZGVidWdgLidcbik7XG5cbi8qKlxuICogQ29sb3JzLlxuICovXG5cbmV4cG9ydHMuY29sb3JzID0gWzYsIDIsIDMsIDQsIDUsIDFdO1xuXG50cnkge1xuXHQvLyBPcHRpb25hbCBkZXBlbmRlbmN5IChhcyBpbiwgZG9lc24ndCBuZWVkIHRvIGJlIGluc3RhbGxlZCwgTk9UIGxpa2Ugb3B0aW9uYWxEZXBlbmRlbmNpZXMgaW4gcGFja2FnZS5qc29uKVxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5cdGNvbnN0IHN1cHBvcnRzQ29sb3IgPSByZXF1aXJlKCdzdXBwb3J0cy1jb2xvcicpO1xuXG5cdGlmIChzdXBwb3J0c0NvbG9yICYmIChzdXBwb3J0c0NvbG9yLnN0ZGVyciB8fCBzdXBwb3J0c0NvbG9yKS5sZXZlbCA+PSAyKSB7XG5cdFx0ZXhwb3J0cy5jb2xvcnMgPSBbXG5cdFx0XHQyMCxcblx0XHRcdDIxLFxuXHRcdFx0MjYsXG5cdFx0XHQyNyxcblx0XHRcdDMyLFxuXHRcdFx0MzMsXG5cdFx0XHQzOCxcblx0XHRcdDM5LFxuXHRcdFx0NDAsXG5cdFx0XHQ0MSxcblx0XHRcdDQyLFxuXHRcdFx0NDMsXG5cdFx0XHQ0NCxcblx0XHRcdDQ1LFxuXHRcdFx0NTYsXG5cdFx0XHQ1Nyxcblx0XHRcdDYyLFxuXHRcdFx0NjMsXG5cdFx0XHQ2OCxcblx0XHRcdDY5LFxuXHRcdFx0NzQsXG5cdFx0XHQ3NSxcblx0XHRcdDc2LFxuXHRcdFx0NzcsXG5cdFx0XHQ3OCxcblx0XHRcdDc5LFxuXHRcdFx0ODAsXG5cdFx0XHQ4MSxcblx0XHRcdDkyLFxuXHRcdFx0OTMsXG5cdFx0XHQ5OCxcblx0XHRcdDk5LFxuXHRcdFx0MTEyLFxuXHRcdFx0MTEzLFxuXHRcdFx0MTI4LFxuXHRcdFx0MTI5LFxuXHRcdFx0MTM0LFxuXHRcdFx0MTM1LFxuXHRcdFx0MTQ4LFxuXHRcdFx0MTQ5LFxuXHRcdFx0MTYwLFxuXHRcdFx0MTYxLFxuXHRcdFx0MTYyLFxuXHRcdFx0MTYzLFxuXHRcdFx0MTY0LFxuXHRcdFx0MTY1LFxuXHRcdFx0MTY2LFxuXHRcdFx0MTY3LFxuXHRcdFx0MTY4LFxuXHRcdFx0MTY5LFxuXHRcdFx0MTcwLFxuXHRcdFx0MTcxLFxuXHRcdFx0MTcyLFxuXHRcdFx0MTczLFxuXHRcdFx0MTc4LFxuXHRcdFx0MTc5LFxuXHRcdFx0MTg0LFxuXHRcdFx0MTg1LFxuXHRcdFx0MTk2LFxuXHRcdFx0MTk3LFxuXHRcdFx0MTk4LFxuXHRcdFx0MTk5LFxuXHRcdFx0MjAwLFxuXHRcdFx0MjAxLFxuXHRcdFx0MjAyLFxuXHRcdFx0MjAzLFxuXHRcdFx0MjA0LFxuXHRcdFx0MjA1LFxuXHRcdFx0MjA2LFxuXHRcdFx0MjA3LFxuXHRcdFx0MjA4LFxuXHRcdFx0MjA5LFxuXHRcdFx0MjE0LFxuXHRcdFx0MjE1LFxuXHRcdFx0MjIwLFxuXHRcdFx0MjIxXG5cdFx0XTtcblx0fVxufSBjYXRjaCAoZXJyb3IpIHtcblx0Ly8gU3dhbGxvdyAtIHdlIG9ubHkgY2FyZSBpZiBgc3VwcG9ydHMtY29sb3JgIGlzIGF2YWlsYWJsZTsgaXQgZG9lc24ndCBoYXZlIHRvIGJlLlxufVxuXG4vKipcbiAqIEJ1aWxkIHVwIHRoZSBkZWZhdWx0IGBpbnNwZWN0T3B0c2Agb2JqZWN0IGZyb20gdGhlIGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAqXG4gKiAgICQgREVCVUdfQ09MT1JTPW5vIERFQlVHX0RFUFRIPTEwIERFQlVHX1NIT1dfSElEREVOPWVuYWJsZWQgbm9kZSBzY3JpcHQuanNcbiAqL1xuXG5leHBvcnRzLmluc3BlY3RPcHRzID0gT2JqZWN0LmtleXMocHJvY2Vzcy5lbnYpLmZpbHRlcihrZXkgPT4ge1xuXHRyZXR1cm4gL15kZWJ1Z18vaS50ZXN0KGtleSk7XG59KS5yZWR1Y2UoKG9iaiwga2V5KSA9PiB7XG5cdC8vIENhbWVsLWNhc2Vcblx0Y29uc3QgcHJvcCA9IGtleVxuXHRcdC5zdWJzdHJpbmcoNilcblx0XHQudG9Mb3dlckNhc2UoKVxuXHRcdC5yZXBsYWNlKC9fKFthLXpdKS9nLCAoXywgaykgPT4ge1xuXHRcdFx0cmV0dXJuIGsudG9VcHBlckNhc2UoKTtcblx0XHR9KTtcblxuXHQvLyBDb2VyY2Ugc3RyaW5nIHZhbHVlIGludG8gSlMgdmFsdWVcblx0bGV0IHZhbCA9IHByb2Nlc3MuZW52W2tleV07XG5cdGlmICgvXih5ZXN8b258dHJ1ZXxlbmFibGVkKSQvaS50ZXN0KHZhbCkpIHtcblx0XHR2YWwgPSB0cnVlO1xuXHR9IGVsc2UgaWYgKC9eKG5vfG9mZnxmYWxzZXxkaXNhYmxlZCkkL2kudGVzdCh2YWwpKSB7XG5cdFx0dmFsID0gZmFsc2U7XG5cdH0gZWxzZSBpZiAodmFsID09PSAnbnVsbCcpIHtcblx0XHR2YWwgPSBudWxsO1xuXHR9IGVsc2Uge1xuXHRcdHZhbCA9IE51bWJlcih2YWwpO1xuXHR9XG5cblx0b2JqW3Byb3BdID0gdmFsO1xuXHRyZXR1cm4gb2JqO1xufSwge30pO1xuXG4vKipcbiAqIElzIHN0ZG91dCBhIFRUWT8gQ29sb3JlZCBvdXRwdXQgaXMgZW5hYmxlZCB3aGVuIGB0cnVlYC5cbiAqL1xuXG5mdW5jdGlvbiB1c2VDb2xvcnMoKSB7XG5cdHJldHVybiAnY29sb3JzJyBpbiBleHBvcnRzLmluc3BlY3RPcHRzID9cblx0XHRCb29sZWFuKGV4cG9ydHMuaW5zcGVjdE9wdHMuY29sb3JzKSA6XG5cdFx0dHR5LmlzYXR0eShwcm9jZXNzLnN0ZGVyci5mZCk7XG59XG5cbi8qKlxuICogQWRkcyBBTlNJIGNvbG9yIGVzY2FwZSBjb2RlcyBpZiBlbmFibGVkLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0QXJncyhhcmdzKSB7XG5cdGNvbnN0IHtuYW1lc3BhY2U6IG5hbWUsIHVzZUNvbG9yc30gPSB0aGlzO1xuXG5cdGlmICh1c2VDb2xvcnMpIHtcblx0XHRjb25zdCBjID0gdGhpcy5jb2xvcjtcblx0XHRjb25zdCBjb2xvckNvZGUgPSAnXFx1MDAxQlszJyArIChjIDwgOCA/IGMgOiAnODs1OycgKyBjKTtcblx0XHRjb25zdCBwcmVmaXggPSBgICAke2NvbG9yQ29kZX07MW0ke25hbWV9IFxcdTAwMUJbMG1gO1xuXG5cdFx0YXJnc1swXSA9IHByZWZpeCArIGFyZ3NbMF0uc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbicgKyBwcmVmaXgpO1xuXHRcdGFyZ3MucHVzaChjb2xvckNvZGUgKyAnbSsnICsgbW9kdWxlLmV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKSArICdcXHUwMDFCWzBtJyk7XG5cdH0gZWxzZSB7XG5cdFx0YXJnc1swXSA9IGdldERhdGUoKSArIG5hbWUgKyAnICcgKyBhcmdzWzBdO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldERhdGUoKSB7XG5cdGlmIChleHBvcnRzLmluc3BlY3RPcHRzLmhpZGVEYXRlKSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cdHJldHVybiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgKyAnICc7XG59XG5cbi8qKlxuICogSW52b2tlcyBgdXRpbC5mb3JtYXQoKWAgd2l0aCB0aGUgc3BlY2lmaWVkIGFyZ3VtZW50cyBhbmQgd3JpdGVzIHRvIHN0ZGVyci5cbiAqL1xuXG5mdW5jdGlvbiBsb2coLi4uYXJncykge1xuXHRyZXR1cm4gcHJvY2Vzcy5zdGRlcnIud3JpdGUodXRpbC5mb3JtYXQoLi4uYXJncykgKyAnXFxuJyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcblx0aWYgKG5hbWVzcGFjZXMpIHtcblx0XHRwcm9jZXNzLmVudi5ERUJVRyA9IG5hbWVzcGFjZXM7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gSWYgeW91IHNldCBhIHByb2Nlc3MuZW52IGZpZWxkIHRvIG51bGwgb3IgdW5kZWZpbmVkLCBpdCBnZXRzIGNhc3QgdG8gdGhlXG5cdFx0Ly8gc3RyaW5nICdudWxsJyBvciAndW5kZWZpbmVkJy4gSnVzdCBkZWxldGUgaW5zdGVhZC5cblx0XHRkZWxldGUgcHJvY2Vzcy5lbnYuREVCVUc7XG5cdH1cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2FkKCkge1xuXHRyZXR1cm4gcHJvY2Vzcy5lbnYuREVCVUc7XG59XG5cbi8qKlxuICogSW5pdCBsb2dpYyBmb3IgYGRlYnVnYCBpbnN0YW5jZXMuXG4gKlxuICogQ3JlYXRlIGEgbmV3IGBpbnNwZWN0T3B0c2Agb2JqZWN0IGluIGNhc2UgYHVzZUNvbG9yc2AgaXMgc2V0XG4gKiBkaWZmZXJlbnRseSBmb3IgYSBwYXJ0aWN1bGFyIGBkZWJ1Z2AgaW5zdGFuY2UuXG4gKi9cblxuZnVuY3Rpb24gaW5pdChkZWJ1Zykge1xuXHRkZWJ1Zy5pbnNwZWN0T3B0cyA9IHt9O1xuXG5cdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhleHBvcnRzLmluc3BlY3RPcHRzKTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0ZGVidWcuaW5zcGVjdE9wdHNba2V5c1tpXV0gPSBleHBvcnRzLmluc3BlY3RPcHRzW2tleXNbaV1dO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9jb21tb24nKShleHBvcnRzKTtcblxuY29uc3Qge2Zvcm1hdHRlcnN9ID0gbW9kdWxlLmV4cG9ydHM7XG5cbi8qKlxuICogTWFwICVvIHRvIGB1dGlsLmluc3BlY3QoKWAsIGFsbCBvbiBhIHNpbmdsZSBsaW5lLlxuICovXG5cbmZvcm1hdHRlcnMubyA9IGZ1bmN0aW9uICh2KSB7XG5cdHRoaXMuaW5zcGVjdE9wdHMuY29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG5cdHJldHVybiB1dGlsLmluc3BlY3QodiwgdGhpcy5pbnNwZWN0T3B0cylcblx0XHQuc3BsaXQoJ1xcbicpXG5cdFx0Lm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcblx0XHQuam9pbignICcpO1xufTtcblxuLyoqXG4gKiBNYXAgJU8gdG8gYHV0aWwuaW5zcGVjdCgpYCwgYWxsb3dpbmcgbXVsdGlwbGUgbGluZXMgaWYgbmVlZGVkLlxuICovXG5cbmZvcm1hdHRlcnMuTyA9IGZ1bmN0aW9uICh2KSB7XG5cdHRoaXMuaW5zcGVjdE9wdHMuY29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG5cdHJldHVybiB1dGlsLmluc3BlY3QodiwgdGhpcy5pbnNwZWN0T3B0cyk7XG59O1xuIiwiLyoqXG4gKiBEZXRlY3QgRWxlY3Ryb24gcmVuZGVyZXIgLyBud2pzIHByb2Nlc3MsIHdoaWNoIGlzIG5vZGUsIGJ1dCB3ZSBzaG91bGRcbiAqIHRyZWF0IGFzIGEgYnJvd3Nlci5cbiAqL1xuXG5pZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnIHx8IHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJyB8fCBwcm9jZXNzLmJyb3dzZXIgPT09IHRydWUgfHwgcHJvY2Vzcy5fX253anMpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Jyb3dzZXIuanMnKTtcbn0gZWxzZSB7XG5cdG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9ub2RlLmpzJyk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZzXzEgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCBkZWJ1Z18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkZWJ1Z1wiKSk7XG5jb25zdCBsb2cgPSBkZWJ1Z18xLmRlZmF1bHQoJ0Brd3NpdGVzL2ZpbGUtZXhpc3RzJyk7XG5mdW5jdGlvbiBjaGVjayhwYXRoLCBpc0ZpbGUsIGlzRGlyZWN0b3J5KSB7XG4gICAgbG9nKGBjaGVja2luZyAlc2AsIHBhdGgpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHN0YXQgPSBmc18xLnN0YXRTeW5jKHBhdGgpO1xuICAgICAgICBpZiAoc3RhdC5pc0ZpbGUoKSAmJiBpc0ZpbGUpIHtcbiAgICAgICAgICAgIGxvZyhgW09LXSBwYXRoIHJlcHJlc2VudHMgYSBmaWxlYCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpICYmIGlzRGlyZWN0b3J5KSB7XG4gICAgICAgICAgICBsb2coYFtPS10gcGF0aCByZXByZXNlbnRzIGEgZGlyZWN0b3J5YCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBsb2coYFtGQUlMXSBwYXRoIHJlcHJlc2VudHMgc29tZXRoaW5nIG90aGVyIHRoYW4gYSBmaWxlIG9yIGRpcmVjdG9yeWApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICAgICAgICBsb2coYFtGQUlMXSBwYXRoIGlzIG5vdCBhY2Nlc3NpYmxlOiAlb2AsIGUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxvZyhgW0ZBVEFMXSAlb2AsIGUpO1xuICAgICAgICB0aHJvdyBlO1xuICAgIH1cbn1cbi8qKlxuICogU3luY2hyb25vdXMgdmFsaWRhdGlvbiBvZiBhIHBhdGggZXhpc3RpbmcgZWl0aGVyIGFzIGEgZmlsZSBvciBhcyBhIGRpcmVjdG9yeS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVja1xuICogQHBhcmFtIHtudW1iZXJ9IHR5cGUgT25lIG9yIGJvdGggb2YgdGhlIGV4cG9ydGVkIG51bWVyaWMgY29uc3RhbnRzXG4gKi9cbmZ1bmN0aW9uIGV4aXN0cyhwYXRoLCB0eXBlID0gZXhwb3J0cy5SRUFEQUJMRSkge1xuICAgIHJldHVybiBjaGVjayhwYXRoLCAodHlwZSAmIGV4cG9ydHMuRklMRSkgPiAwLCAodHlwZSAmIGV4cG9ydHMuRk9MREVSKSA+IDApO1xufVxuZXhwb3J0cy5leGlzdHMgPSBleGlzdHM7XG4vKipcbiAqIENvbnN0YW50IHJlcHJlc2VudGluZyBhIGZpbGVcbiAqL1xuZXhwb3J0cy5GSUxFID0gMTtcbi8qKlxuICogQ29uc3RhbnQgcmVwcmVzZW50aW5nIGEgZm9sZGVyXG4gKi9cbmV4cG9ydHMuRk9MREVSID0gMjtcbi8qKlxuICogQ29uc3RhbnQgcmVwcmVzZW50aW5nIGVpdGhlciBhIGZpbGUgb3IgYSBmb2xkZXJcbiAqL1xuZXhwb3J0cy5SRUFEQUJMRSA9IGV4cG9ydHMuRklMRSArIGV4cG9ydHMuRk9MREVSO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuX19leHBvcnQocmVxdWlyZShcIi4vc3JjXCIpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5waWNrID0gZXhwb3J0cy5idWZmZXJUb1N0cmluZyA9IGV4cG9ydHMucHJlZml4ZWRBcnJheSA9IGV4cG9ydHMuYXNOdW1iZXIgPSBleHBvcnRzLmFzU3RyaW5nQXJyYXkgPSBleHBvcnRzLmFzQXJyYXkgPSBleHBvcnRzLm9iamVjdFRvU3RyaW5nID0gZXhwb3J0cy5yZW1vdmUgPSBleHBvcnRzLmluY2x1ZGluZyA9IGV4cG9ydHMuYXBwZW5kID0gZXhwb3J0cy5mb2xkZXJFeGlzdHMgPSBleHBvcnRzLmZvckVhY2hMaW5lV2l0aENvbnRlbnQgPSBleHBvcnRzLnRvTGluZXNXaXRoQ29udGVudCA9IGV4cG9ydHMubGFzdCA9IGV4cG9ydHMuZmlyc3QgPSBleHBvcnRzLnNwbGl0T24gPSBleHBvcnRzLmlzVXNlckZ1bmN0aW9uID0gZXhwb3J0cy5hc0Z1bmN0aW9uID0gZXhwb3J0cy5OT09QID0gdm9pZCAwO1xuY29uc3QgZmlsZV9leGlzdHNfMSA9IHJlcXVpcmUoXCJAa3dzaXRlcy9maWxlLWV4aXN0c1wiKTtcbmNvbnN0IE5PT1AgPSAoKSA9PiB7XG59O1xuZXhwb3J0cy5OT09QID0gTk9PUDtcbi8qKlxuICogUmV0dXJucyBlaXRoZXIgdGhlIHNvdXJjZSBhcmd1bWVudCB3aGVuIGl0IGlzIGEgYEZ1bmN0aW9uYCwgb3IgdGhlIGRlZmF1bHRcbiAqIGBOT09QYCBmdW5jdGlvbiBjb25zdGFudFxuICovXG5mdW5jdGlvbiBhc0Z1bmN0aW9uKHNvdXJjZSkge1xuICAgIHJldHVybiB0eXBlb2Ygc291cmNlID09PSAnZnVuY3Rpb24nID8gc291cmNlIDogZXhwb3J0cy5OT09QO1xufVxuZXhwb3J0cy5hc0Z1bmN0aW9uID0gYXNGdW5jdGlvbjtcbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzdXBwbGllZCBhcmd1bWVudCBpcyBib3RoIGEgZnVuY3Rpb24sIGFuZCBpcyBub3RcbiAqIHRoZSBgTk9PUGAgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGlzVXNlckZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIHJldHVybiAodHlwZW9mIHNvdXJjZSA9PT0gJ2Z1bmN0aW9uJyAmJiBzb3VyY2UgIT09IGV4cG9ydHMuTk9PUCk7XG59XG5leHBvcnRzLmlzVXNlckZ1bmN0aW9uID0gaXNVc2VyRnVuY3Rpb247XG5mdW5jdGlvbiBzcGxpdE9uKGlucHV0LCBjaGFyKSB7XG4gICAgY29uc3QgaW5kZXggPSBpbnB1dC5pbmRleE9mKGNoYXIpO1xuICAgIGlmIChpbmRleCA8PSAwKSB7XG4gICAgICAgIHJldHVybiBbaW5wdXQsICcnXTtcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgICAgaW5wdXQuc3Vic3RyKDAsIGluZGV4KSxcbiAgICAgICAgaW5wdXQuc3Vic3RyKGluZGV4ICsgMSksXG4gICAgXTtcbn1cbmV4cG9ydHMuc3BsaXRPbiA9IHNwbGl0T247XG5mdW5jdGlvbiBmaXJzdChpbnB1dCwgb2Zmc2V0ID0gMCkge1xuICAgIHJldHVybiBpc0FycmF5TGlrZShpbnB1dCkgJiYgaW5wdXQubGVuZ3RoID4gb2Zmc2V0ID8gaW5wdXRbb2Zmc2V0XSA6IHVuZGVmaW5lZDtcbn1cbmV4cG9ydHMuZmlyc3QgPSBmaXJzdDtcbmZ1bmN0aW9uIGxhc3QoaW5wdXQsIG9mZnNldCA9IDApIHtcbiAgICBpZiAoaXNBcnJheUxpa2UoaW5wdXQpICYmIGlucHV0Lmxlbmd0aCA+IG9mZnNldCkge1xuICAgICAgICByZXR1cm4gaW5wdXRbaW5wdXQubGVuZ3RoIC0gMSAtIG9mZnNldF07XG4gICAgfVxufVxuZXhwb3J0cy5sYXN0ID0gbGFzdDtcbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKGlucHV0KSB7XG4gICAgcmV0dXJuICEhKGlucHV0ICYmIHR5cGVvZiBpbnB1dC5sZW5ndGggPT09ICdudW1iZXInKTtcbn1cbmZ1bmN0aW9uIHRvTGluZXNXaXRoQ29udGVudChpbnB1dCwgdHJpbW1lZCA9IHRydWUsIHNlcGFyYXRvciA9ICdcXG4nKSB7XG4gICAgcmV0dXJuIGlucHV0LnNwbGl0KHNlcGFyYXRvcilcbiAgICAgICAgLnJlZHVjZSgob3V0cHV0LCBsaW5lKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpbmVDb250ZW50ID0gdHJpbW1lZCA/IGxpbmUudHJpbSgpIDogbGluZTtcbiAgICAgICAgaWYgKGxpbmVDb250ZW50KSB7XG4gICAgICAgICAgICBvdXRwdXQucHVzaChsaW5lQ29udGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LCBbXSk7XG59XG5leHBvcnRzLnRvTGluZXNXaXRoQ29udGVudCA9IHRvTGluZXNXaXRoQ29udGVudDtcbmZ1bmN0aW9uIGZvckVhY2hMaW5lV2l0aENvbnRlbnQoaW5wdXQsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRvTGluZXNXaXRoQ29udGVudChpbnB1dCwgdHJ1ZSkubWFwKGxpbmUgPT4gY2FsbGJhY2sobGluZSkpO1xufVxuZXhwb3J0cy5mb3JFYWNoTGluZVdpdGhDb250ZW50ID0gZm9yRWFjaExpbmVXaXRoQ29udGVudDtcbmZ1bmN0aW9uIGZvbGRlckV4aXN0cyhwYXRoKSB7XG4gICAgcmV0dXJuIGZpbGVfZXhpc3RzXzEuZXhpc3RzKHBhdGgsIGZpbGVfZXhpc3RzXzEuRk9MREVSKTtcbn1cbmV4cG9ydHMuZm9sZGVyRXhpc3RzID0gZm9sZGVyRXhpc3RzO1xuLyoqXG4gKiBBZGRzIGBpdGVtYCBpbnRvIHRoZSBgdGFyZ2V0YCBgQXJyYXlgIG9yIGBTZXRgIHdoZW4gaXQgaXMgbm90IGFscmVhZHkgcHJlc2VudCBhbmQgcmV0dXJucyB0aGUgYGl0ZW1gLlxuICovXG5mdW5jdGlvbiBhcHBlbmQodGFyZ2V0LCBpdGVtKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICBpZiAoIXRhcmdldC5pbmNsdWRlcyhpdGVtKSkge1xuICAgICAgICAgICAgdGFyZ2V0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRhcmdldC5hZGQoaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtO1xufVxuZXhwb3J0cy5hcHBlbmQgPSBhcHBlbmQ7XG4vKipcbiAqIEFkZHMgYGl0ZW1gIGludG8gdGhlIGB0YXJnZXRgIGBBcnJheWAgd2hlbiBpdCBpcyBub3QgYWxyZWFkeSBwcmVzZW50IGFuZCByZXR1cm5zIHRoZSBgdGFyZ2V0YC5cbiAqL1xuZnVuY3Rpb24gaW5jbHVkaW5nKHRhcmdldCwgaXRlbSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgIXRhcmdldC5pbmNsdWRlcyhpdGVtKSkge1xuICAgICAgICB0YXJnZXQucHVzaChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbmV4cG9ydHMuaW5jbHVkaW5nID0gaW5jbHVkaW5nO1xuZnVuY3Rpb24gcmVtb3ZlKHRhcmdldCwgaXRlbSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0YXJnZXQuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgIHRhcmdldC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0YXJnZXQuZGVsZXRlKGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbTtcbn1cbmV4cG9ydHMucmVtb3ZlID0gcmVtb3ZlO1xuZXhwb3J0cy5vYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcpO1xuZnVuY3Rpb24gYXNBcnJheShzb3VyY2UpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShzb3VyY2UpID8gc291cmNlIDogW3NvdXJjZV07XG59XG5leHBvcnRzLmFzQXJyYXkgPSBhc0FycmF5O1xuZnVuY3Rpb24gYXNTdHJpbmdBcnJheShzb3VyY2UpIHtcbiAgICByZXR1cm4gYXNBcnJheShzb3VyY2UpLm1hcChTdHJpbmcpO1xufVxuZXhwb3J0cy5hc1N0cmluZ0FycmF5ID0gYXNTdHJpbmdBcnJheTtcbmZ1bmN0aW9uIGFzTnVtYmVyKHNvdXJjZSwgb25OYU4gPSAwKSB7XG4gICAgaWYgKHNvdXJjZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBvbk5hTjtcbiAgICB9XG4gICAgY29uc3QgbnVtID0gcGFyc2VJbnQoc291cmNlLCAxMCk7XG4gICAgcmV0dXJuIGlzTmFOKG51bSkgPyBvbk5hTiA6IG51bTtcbn1cbmV4cG9ydHMuYXNOdW1iZXIgPSBhc051bWJlcjtcbmZ1bmN0aW9uIHByZWZpeGVkQXJyYXkoaW5wdXQsIHByZWZpeCkge1xuICAgIGNvbnN0IG91dHB1dCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwLCBtYXggPSBpbnB1dC5sZW5ndGg7IGkgPCBtYXg7IGkrKykge1xuICAgICAgICBvdXRwdXQucHVzaChwcmVmaXgsIGlucHV0W2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cbmV4cG9ydHMucHJlZml4ZWRBcnJheSA9IHByZWZpeGVkQXJyYXk7XG5mdW5jdGlvbiBidWZmZXJUb1N0cmluZyhpbnB1dCkge1xuICAgIHJldHVybiAoQXJyYXkuaXNBcnJheShpbnB1dCkgPyBCdWZmZXIuY29uY2F0KGlucHV0KSA6IGlucHV0KS50b1N0cmluZygndXRmLTgnKTtcbn1cbmV4cG9ydHMuYnVmZmVyVG9TdHJpbmcgPSBidWZmZXJUb1N0cmluZztcbi8qKlxuICogR2V0IGEgbmV3IG9iamVjdCBmcm9tIGEgc291cmNlIG9iamVjdCB3aXRoIG9ubHkgdGhlIGxpc3RlZCBwcm9wZXJ0aWVzLlxuICovXG5mdW5jdGlvbiBwaWNrKHNvdXJjZSwgcHJvcGVydGllcykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCAuLi5wcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IHByb3BlcnR5IGluIHNvdXJjZSA/IHsgW3Byb3BlcnR5XTogc291cmNlW3Byb3BlcnR5XSB9IDoge30pKTtcbn1cbmV4cG9ydHMucGljayA9IHBpY2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5maWx0ZXJIYXNMZW5ndGggPSBleHBvcnRzLmZpbHRlckZ1bmN0aW9uID0gZXhwb3J0cy5maWx0ZXJQbGFpbk9iamVjdCA9IGV4cG9ydHMuZmlsdGVyU3RyaW5nT3JTdHJpbmdBcnJheSA9IGV4cG9ydHMuZmlsdGVyU3RyaW5nQXJyYXkgPSBleHBvcnRzLmZpbHRlclN0cmluZyA9IGV4cG9ydHMuZmlsdGVyUHJpbWl0aXZlcyA9IGV4cG9ydHMuZmlsdGVyQXJyYXkgPSBleHBvcnRzLmZpbHRlclR5cGUgPSB2b2lkIDA7XG5jb25zdCB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gZmlsdGVyVHlwZShpbnB1dCwgZmlsdGVyLCBkZWYpIHtcbiAgICBpZiAoZmlsdGVyKGlucHV0KSkge1xuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuICAgIHJldHVybiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpID8gZGVmIDogdW5kZWZpbmVkO1xufVxuZXhwb3J0cy5maWx0ZXJUeXBlID0gZmlsdGVyVHlwZTtcbmNvbnN0IGZpbHRlckFycmF5ID0gKGlucHV0KSA9PiB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoaW5wdXQpO1xufTtcbmV4cG9ydHMuZmlsdGVyQXJyYXkgPSBmaWx0ZXJBcnJheTtcbmZ1bmN0aW9uIGZpbHRlclByaW1pdGl2ZXMoaW5wdXQsIG9taXQpIHtcbiAgICByZXR1cm4gL251bWJlcnxzdHJpbmd8Ym9vbGVhbi8udGVzdCh0eXBlb2YgaW5wdXQpICYmICghb21pdCB8fCAhb21pdC5pbmNsdWRlcygodHlwZW9mIGlucHV0KSkpO1xufVxuZXhwb3J0cy5maWx0ZXJQcmltaXRpdmVzID0gZmlsdGVyUHJpbWl0aXZlcztcbmNvbnN0IGZpbHRlclN0cmluZyA9IChpbnB1dCkgPT4ge1xuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnO1xufTtcbmV4cG9ydHMuZmlsdGVyU3RyaW5nID0gZmlsdGVyU3RyaW5nO1xuY29uc3QgZmlsdGVyU3RyaW5nQXJyYXkgPSAoaW5wdXQpID0+IHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShpbnB1dCkgJiYgaW5wdXQuZXZlcnkoZXhwb3J0cy5maWx0ZXJTdHJpbmcpO1xufTtcbmV4cG9ydHMuZmlsdGVyU3RyaW5nQXJyYXkgPSBmaWx0ZXJTdHJpbmdBcnJheTtcbmNvbnN0IGZpbHRlclN0cmluZ09yU3RyaW5nQXJyYXkgPSAoaW5wdXQpID0+IHtcbiAgICByZXR1cm4gZXhwb3J0cy5maWx0ZXJTdHJpbmcoaW5wdXQpIHx8IChBcnJheS5pc0FycmF5KGlucHV0KSAmJiBpbnB1dC5ldmVyeShleHBvcnRzLmZpbHRlclN0cmluZykpO1xufTtcbmV4cG9ydHMuZmlsdGVyU3RyaW5nT3JTdHJpbmdBcnJheSA9IGZpbHRlclN0cmluZ09yU3RyaW5nQXJyYXk7XG5mdW5jdGlvbiBmaWx0ZXJQbGFpbk9iamVjdChpbnB1dCkge1xuICAgIHJldHVybiAhIWlucHV0ICYmIHV0aWxfMS5vYmplY3RUb1N0cmluZyhpbnB1dCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuZXhwb3J0cy5maWx0ZXJQbGFpbk9iamVjdCA9IGZpbHRlclBsYWluT2JqZWN0O1xuZnVuY3Rpb24gZmlsdGVyRnVuY3Rpb24oaW5wdXQpIHtcbiAgICByZXR1cm4gdHlwZW9mIGlucHV0ID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5maWx0ZXJGdW5jdGlvbiA9IGZpbHRlckZ1bmN0aW9uO1xuY29uc3QgZmlsdGVySGFzTGVuZ3RoID0gKGlucHV0KSA9PiB7XG4gICAgaWYgKGlucHV0ID09IG51bGwgfHwgJ251bWJlcnxib29sZWFufGZ1bmN0aW9uJy5pbmNsdWRlcyh0eXBlb2YgaW5wdXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoaW5wdXQpIHx8IHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGlucHV0Lmxlbmd0aCA9PT0gJ251bWJlcic7XG59O1xuZXhwb3J0cy5maWx0ZXJIYXNMZW5ndGggPSBmaWx0ZXJIYXNMZW5ndGg7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcmd1bWVudC1maWx0ZXJzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FeGl0Q29kZXMgPSB2b2lkIDA7XG4vKipcbiAqIEtub3duIHByb2Nlc3MgZXhpdCBjb2RlcyB1c2VkIGJ5IHRoZSB0YXNrIHBhcnNlcnMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYW4gZXJyb3JcbiAqIHdhcyBvbmUgdGhleSBjYW4gYXV0b21hdGljYWxseSBoYW5kbGVcbiAqL1xudmFyIEV4aXRDb2RlcztcbihmdW5jdGlvbiAoRXhpdENvZGVzKSB7XG4gICAgRXhpdENvZGVzW0V4aXRDb2Rlc1tcIlNVQ0NFU1NcIl0gPSAwXSA9IFwiU1VDQ0VTU1wiO1xuICAgIEV4aXRDb2Rlc1tFeGl0Q29kZXNbXCJFUlJPUlwiXSA9IDFdID0gXCJFUlJPUlwiO1xuICAgIEV4aXRDb2Rlc1tFeGl0Q29kZXNbXCJVTkNMRUFOXCJdID0gMTI4XSA9IFwiVU5DTEVBTlwiO1xufSkoRXhpdENvZGVzID0gZXhwb3J0cy5FeGl0Q29kZXMgfHwgKGV4cG9ydHMuRXhpdENvZGVzID0ge30pKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4aXQtY29kZXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdpdE91dHB1dFN0cmVhbXMgPSB2b2lkIDA7XG5jbGFzcyBHaXRPdXRwdXRTdHJlYW1zIHtcbiAgICBjb25zdHJ1Y3RvcihzdGRPdXQsIHN0ZEVycikge1xuICAgICAgICB0aGlzLnN0ZE91dCA9IHN0ZE91dDtcbiAgICAgICAgdGhpcy5zdGRFcnIgPSBzdGRFcnI7XG4gICAgfVxuICAgIGFzU3RyaW5ncygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBHaXRPdXRwdXRTdHJlYW1zKHRoaXMuc3RkT3V0LnRvU3RyaW5nKCd1dGY4JyksIHRoaXMuc3RkRXJyLnRvU3RyaW5nKCd1dGY4JykpO1xuICAgIH1cbn1cbmV4cG9ydHMuR2l0T3V0cHV0U3RyZWFtcyA9IEdpdE91dHB1dFN0cmVhbXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1naXQtb3V0cHV0LXN0cmVhbXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlJlbW90ZUxpbmVQYXJzZXIgPSBleHBvcnRzLkxpbmVQYXJzZXIgPSB2b2lkIDA7XG5jbGFzcyBMaW5lUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvcihyZWdFeHAsIHVzZU1hdGNoZXMpIHtcbiAgICAgICAgdGhpcy5tYXRjaGVzID0gW107XG4gICAgICAgIHRoaXMucGFyc2UgPSAobGluZSwgdGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0TWF0Y2hlcygpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9yZWdFeHAuZXZlcnkoKHJlZywgaW5kZXgpID0+IHRoaXMuYWRkTWF0Y2gocmVnLCBpbmRleCwgbGluZShpbmRleCkpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZU1hdGNoZXModGFyZ2V0LCB0aGlzLnByZXBhcmVNYXRjaGVzKCkpICE9PSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fcmVnRXhwID0gQXJyYXkuaXNBcnJheShyZWdFeHApID8gcmVnRXhwIDogW3JlZ0V4cF07XG4gICAgICAgIGlmICh1c2VNYXRjaGVzKSB7XG4gICAgICAgICAgICB0aGlzLnVzZU1hdGNoZXMgPSB1c2VNYXRjaGVzO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB1c2VNYXRjaGVzKHRhcmdldCwgbWF0Y2gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMaW5lUGFyc2VyOnVzZU1hdGNoZXMgbm90IGltcGxlbWVudGVkYCk7XG4gICAgfVxuICAgIHJlc2V0TWF0Y2hlcygpIHtcbiAgICAgICAgdGhpcy5tYXRjaGVzLmxlbmd0aCA9IDA7XG4gICAgfVxuICAgIHByZXBhcmVNYXRjaGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaGVzO1xuICAgIH1cbiAgICBhZGRNYXRjaChyZWcsIGluZGV4LCBsaW5lKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoZWQgPSBsaW5lICYmIHJlZy5leGVjKGxpbmUpO1xuICAgICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICAgICAgdGhpcy5wdXNoTWF0Y2goaW5kZXgsIG1hdGNoZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhIW1hdGNoZWQ7XG4gICAgfVxuICAgIHB1c2hNYXRjaChfaW5kZXgsIG1hdGNoZWQpIHtcbiAgICAgICAgdGhpcy5tYXRjaGVzLnB1c2goLi4ubWF0Y2hlZC5zbGljZSgxKSk7XG4gICAgfVxufVxuZXhwb3J0cy5MaW5lUGFyc2VyID0gTGluZVBhcnNlcjtcbmNsYXNzIFJlbW90ZUxpbmVQYXJzZXIgZXh0ZW5kcyBMaW5lUGFyc2VyIHtcbiAgICBhZGRNYXRjaChyZWcsIGluZGV4LCBsaW5lKSB7XG4gICAgICAgIHJldHVybiAvXnJlbW90ZTpcXHMvLnRlc3QoU3RyaW5nKGxpbmUpKSAmJiBzdXBlci5hZGRNYXRjaChyZWcsIGluZGV4LCBsaW5lKTtcbiAgICB9XG4gICAgcHVzaE1hdGNoKGluZGV4LCBtYXRjaGVkKSB7XG4gICAgICAgIGlmIChpbmRleCA+IDAgfHwgbWF0Y2hlZC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBzdXBlci5wdXNoTWF0Y2goaW5kZXgsIG1hdGNoZWQpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5SZW1vdGVMaW5lUGFyc2VyID0gUmVtb3RlTGluZVBhcnNlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmUtcGFyc2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVJbnN0YW5jZUNvbmZpZyA9IHZvaWQgMDtcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGJpbmFyeTogJ2dpdCcsXG4gICAgbWF4Q29uY3VycmVudFByb2Nlc3NlczogNSxcbiAgICBjb25maWc6IFtdLFxufTtcbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlQ29uZmlnKC4uLm9wdGlvbnMpIHtcbiAgICBjb25zdCBiYXNlRGlyID0gcHJvY2Vzcy5jd2QoKTtcbiAgICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oeyBiYXNlRGlyIH0sIGRlZmF1bHRPcHRpb25zKSwgLi4uKG9wdGlvbnMuZmlsdGVyKG8gPT4gdHlwZW9mIG8gPT09ICdvYmplY3QnICYmIG8pKSk7XG4gICAgY29uZmlnLmJhc2VEaXIgPSBjb25maWcuYmFzZURpciB8fCBiYXNlRGlyO1xuICAgIHJldHVybiBjb25maWc7XG59XG5leHBvcnRzLmNyZWF0ZUluc3RhbmNlQ29uZmlnID0gY3JlYXRlSW5zdGFuY2VDb25maWc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaW1wbGUtZ2l0LW9wdGlvbnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudCA9IGV4cG9ydHMudHJhaWxpbmdPcHRpb25zQXJndW1lbnQgPSBleHBvcnRzLmdldFRyYWlsaW5nT3B0aW9ucyA9IGV4cG9ydHMuYXBwZW5kVGFza09wdGlvbnMgPSB2b2lkIDA7XG5jb25zdCBhcmd1bWVudF9maWx0ZXJzXzEgPSByZXF1aXJlKFwiLi9hcmd1bWVudC1maWx0ZXJzXCIpO1xuY29uc3QgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmZ1bmN0aW9uIGFwcGVuZFRhc2tPcHRpb25zKG9wdGlvbnMsIGNvbW1hbmRzID0gW10pIHtcbiAgICBpZiAoIWFyZ3VtZW50X2ZpbHRlcnNfMS5maWx0ZXJQbGFpbk9iamVjdChvcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gY29tbWFuZHM7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qua2V5cyhvcHRpb25zKS5yZWR1Y2UoKGNvbW1hbmRzLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgICAgIGlmIChhcmd1bWVudF9maWx0ZXJzXzEuZmlsdGVyUHJpbWl0aXZlcyh2YWx1ZSwgWydib29sZWFuJ10pKSB7XG4gICAgICAgICAgICBjb21tYW5kcy5wdXNoKGtleSArICc9JyArIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbW1hbmRzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tbWFuZHM7XG4gICAgfSwgY29tbWFuZHMpO1xufVxuZXhwb3J0cy5hcHBlbmRUYXNrT3B0aW9ucyA9IGFwcGVuZFRhc2tPcHRpb25zO1xuZnVuY3Rpb24gZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3MsIGluaXRpYWxQcmltaXRpdmUgPSAwLCBvYmplY3RPbmx5ID0gZmFsc2UpIHtcbiAgICBjb25zdCBjb21tYW5kID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIG1heCA9IGluaXRpYWxQcmltaXRpdmUgPCAwID8gYXJncy5sZW5ndGggOiBpbml0aWFsUHJpbWl0aXZlOyBpIDwgbWF4OyBpKyspIHtcbiAgICAgICAgaWYgKCdzdHJpbmd8bnVtYmVyJy5pbmNsdWRlcyh0eXBlb2YgYXJnc1tpXSkpIHtcbiAgICAgICAgICAgIGNvbW1hbmQucHVzaChTdHJpbmcoYXJnc1tpXSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFwcGVuZFRhc2tPcHRpb25zKHRyYWlsaW5nT3B0aW9uc0FyZ3VtZW50KGFyZ3MpLCBjb21tYW5kKTtcbiAgICBpZiAoIW9iamVjdE9ubHkpIHtcbiAgICAgICAgY29tbWFuZC5wdXNoKC4uLnRyYWlsaW5nQXJyYXlBcmd1bWVudChhcmdzKSk7XG4gICAgfVxuICAgIHJldHVybiBjb21tYW5kO1xufVxuZXhwb3J0cy5nZXRUcmFpbGluZ09wdGlvbnMgPSBnZXRUcmFpbGluZ09wdGlvbnM7XG5mdW5jdGlvbiB0cmFpbGluZ0FycmF5QXJndW1lbnQoYXJncykge1xuICAgIGNvbnN0IGhhc1RyYWlsaW5nQ2FsbGJhY2sgPSB0eXBlb2YgdXRpbF8xLmxhc3QoYXJncykgPT09ICdmdW5jdGlvbic7XG4gICAgcmV0dXJuIGFyZ3VtZW50X2ZpbHRlcnNfMS5maWx0ZXJUeXBlKHV0aWxfMS5sYXN0KGFyZ3MsIGhhc1RyYWlsaW5nQ2FsbGJhY2sgPyAxIDogMCksIGFyZ3VtZW50X2ZpbHRlcnNfMS5maWx0ZXJBcnJheSwgW10pO1xufVxuLyoqXG4gKiBHaXZlbiBhbnkgbnVtYmVyIG9mIGFyZ3VtZW50cywgcmV0dXJucyB0aGUgdHJhaWxpbmcgb3B0aW9ucyBhcmd1bWVudCwgaWdub3JpbmcgYSB0cmFpbGluZyBmdW5jdGlvbiBhcmd1bWVudFxuICogaWYgdGhlcmUgaXMgb25lLiBXaGVuIG5vdCBmb3VuZCwgdGhlIHJldHVybiB2YWx1ZSBpcyBudWxsLlxuICovXG5mdW5jdGlvbiB0cmFpbGluZ09wdGlvbnNBcmd1bWVudChhcmdzKSB7XG4gICAgY29uc3QgaGFzVHJhaWxpbmdDYWxsYmFjayA9IGFyZ3VtZW50X2ZpbHRlcnNfMS5maWx0ZXJGdW5jdGlvbih1dGlsXzEubGFzdChhcmdzKSk7XG4gICAgcmV0dXJuIGFyZ3VtZW50X2ZpbHRlcnNfMS5maWx0ZXJUeXBlKHV0aWxfMS5sYXN0KGFyZ3MsIGhhc1RyYWlsaW5nQ2FsbGJhY2sgPyAxIDogMCksIGFyZ3VtZW50X2ZpbHRlcnNfMS5maWx0ZXJQbGFpbk9iamVjdCk7XG59XG5leHBvcnRzLnRyYWlsaW5nT3B0aW9uc0FyZ3VtZW50ID0gdHJhaWxpbmdPcHRpb25zQXJndW1lbnQ7XG4vKipcbiAqIFJldHVybnMgZWl0aGVyIHRoZSBzb3VyY2UgYXJndW1lbnQgd2hlbiBpdCBpcyBhIGBGdW5jdGlvbmAsIG9yIHRoZSBkZWZhdWx0XG4gKiBgTk9PUGAgZnVuY3Rpb24gY29uc3RhbnRcbiAqL1xuZnVuY3Rpb24gdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3MsIGluY2x1ZGVOb29wID0gdHJ1ZSkge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gdXRpbF8xLmFzRnVuY3Rpb24odXRpbF8xLmxhc3QoYXJncykpO1xuICAgIHJldHVybiBpbmNsdWRlTm9vcCB8fCB1dGlsXzEuaXNVc2VyRnVuY3Rpb24oY2FsbGJhY2spID8gY2FsbGJhY2sgOiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLnRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudCA9IHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhc2stb3B0aW9ucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VTdHJpbmdSZXNwb25zZSA9IGV4cG9ydHMuY2FsbFRhc2tQYXJzZXIgPSB2b2lkIDA7XG5jb25zdCB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gY2FsbFRhc2tQYXJzZXIocGFyc2VyLCBzdHJlYW1zKSB7XG4gICAgcmV0dXJuIHBhcnNlcihzdHJlYW1zLnN0ZE91dCwgc3RyZWFtcy5zdGRFcnIpO1xufVxuZXhwb3J0cy5jYWxsVGFza1BhcnNlciA9IGNhbGxUYXNrUGFyc2VyO1xuZnVuY3Rpb24gcGFyc2VTdHJpbmdSZXNwb25zZShyZXN1bHQsIHBhcnNlcnMsIC4uLnRleHRzKSB7XG4gICAgdGV4dHMuZm9yRWFjaCh0ZXh0ID0+IHtcbiAgICAgICAgZm9yIChsZXQgbGluZXMgPSB1dGlsXzEudG9MaW5lc1dpdGhDb250ZW50KHRleHQpLCBpID0gMCwgbWF4ID0gbGluZXMubGVuZ3RoOyBpIDwgbWF4OyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSAob2Zmc2V0ID0gMCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgoaSArIG9mZnNldCkgPj0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmVzW2kgKyBvZmZzZXRdO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHBhcnNlcnMuc29tZSgoeyBwYXJzZSB9KSA9PiBwYXJzZShsaW5lLCByZXN1bHQpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLnBhcnNlU3RyaW5nUmVzcG9uc2UgPSBwYXJzZVN0cmluZ1Jlc3BvbnNlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFzay1wYXJzZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9hcmd1bWVudC1maWx0ZXJzXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9leGl0LWNvZGVzXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9naXQtb3V0cHV0LXN0cmVhbXNcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2xpbmUtcGFyc2VyXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9zaW1wbGUtZ2l0LW9wdGlvbnNcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3Rhc2stb3B0aW9uc1wiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdGFzay1wYXJzZXJcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3V0aWxcIiksIGV4cG9ydHMpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNoZWNrSXNCYXJlUmVwb1Rhc2sgPSBleHBvcnRzLmNoZWNrSXNSZXBvUm9vdFRhc2sgPSBleHBvcnRzLmNoZWNrSXNSZXBvVGFzayA9IGV4cG9ydHMuQ2hlY2tSZXBvQWN0aW9ucyA9IHZvaWQgMDtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG52YXIgQ2hlY2tSZXBvQWN0aW9ucztcbihmdW5jdGlvbiAoQ2hlY2tSZXBvQWN0aW9ucykge1xuICAgIENoZWNrUmVwb0FjdGlvbnNbXCJCQVJFXCJdID0gXCJiYXJlXCI7XG4gICAgQ2hlY2tSZXBvQWN0aW9uc1tcIklOX1RSRUVcIl0gPSBcInRyZWVcIjtcbiAgICBDaGVja1JlcG9BY3Rpb25zW1wiSVNfUkVQT19ST09UXCJdID0gXCJyb290XCI7XG59KShDaGVja1JlcG9BY3Rpb25zID0gZXhwb3J0cy5DaGVja1JlcG9BY3Rpb25zIHx8IChleHBvcnRzLkNoZWNrUmVwb0FjdGlvbnMgPSB7fSkpO1xuY29uc3Qgb25FcnJvciA9ICh7IGV4aXRDb2RlIH0sIGVycm9yLCBkb25lLCBmYWlsKSA9PiB7XG4gICAgaWYgKGV4aXRDb2RlID09PSB1dGlsc18xLkV4aXRDb2Rlcy5VTkNMRUFOICYmIGlzTm90UmVwb01lc3NhZ2UoZXJyb3IpKSB7XG4gICAgICAgIHJldHVybiBkb25lKEJ1ZmZlci5mcm9tKCdmYWxzZScpKTtcbiAgICB9XG4gICAgZmFpbChlcnJvcik7XG59O1xuY29uc3QgcGFyc2VyID0gKHRleHQpID0+IHtcbiAgICByZXR1cm4gdGV4dC50cmltKCkgPT09ICd0cnVlJztcbn07XG5mdW5jdGlvbiBjaGVja0lzUmVwb1Rhc2soYWN0aW9uKSB7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgY2FzZSBDaGVja1JlcG9BY3Rpb25zLkJBUkU6XG4gICAgICAgICAgICByZXR1cm4gY2hlY2tJc0JhcmVSZXBvVGFzaygpO1xuICAgICAgICBjYXNlIENoZWNrUmVwb0FjdGlvbnMuSVNfUkVQT19ST09UOlxuICAgICAgICAgICAgcmV0dXJuIGNoZWNrSXNSZXBvUm9vdFRhc2soKTtcbiAgICB9XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ3Jldi1wYXJzZScsICctLWlzLWluc2lkZS13b3JrLXRyZWUnXTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kcyxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBvbkVycm9yLFxuICAgICAgICBwYXJzZXIsXG4gICAgfTtcbn1cbmV4cG9ydHMuY2hlY2tJc1JlcG9UYXNrID0gY2hlY2tJc1JlcG9UYXNrO1xuZnVuY3Rpb24gY2hlY2tJc1JlcG9Sb290VGFzaygpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsncmV2LXBhcnNlJywgJy0tZ2l0LWRpciddO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIG9uRXJyb3IsXG4gICAgICAgIHBhcnNlcihwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gL15cXC4oZ2l0KT8kLy50ZXN0KHBhdGgudHJpbSgpKTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZXhwb3J0cy5jaGVja0lzUmVwb1Jvb3RUYXNrID0gY2hlY2tJc1JlcG9Sb290VGFzaztcbmZ1bmN0aW9uIGNoZWNrSXNCYXJlUmVwb1Rhc2soKSB7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ3Jldi1wYXJzZScsICctLWlzLWJhcmUtcmVwb3NpdG9yeSddO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIG9uRXJyb3IsXG4gICAgICAgIHBhcnNlcixcbiAgICB9O1xufVxuZXhwb3J0cy5jaGVja0lzQmFyZVJlcG9UYXNrID0gY2hlY2tJc0JhcmVSZXBvVGFzaztcbmZ1bmN0aW9uIGlzTm90UmVwb01lc3NhZ2UoZXJyb3IpIHtcbiAgICByZXR1cm4gLyhOb3QgYSBnaXQgcmVwb3NpdG9yeXxLZWluIEdpdC1SZXBvc2l0b3J5KS9pLnRlc3QoU3RyaW5nKGVycm9yKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jaGVjay1pcy1yZXBvLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jbGVhblN1bW1hcnlQYXJzZXIgPSBleHBvcnRzLkNsZWFuUmVzcG9uc2UgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY2xhc3MgQ2xlYW5SZXNwb25zZSB7XG4gICAgY29uc3RydWN0b3IoZHJ5UnVuKSB7XG4gICAgICAgIHRoaXMuZHJ5UnVuID0gZHJ5UnVuO1xuICAgICAgICB0aGlzLnBhdGhzID0gW107XG4gICAgICAgIHRoaXMuZmlsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5mb2xkZXJzID0gW107XG4gICAgfVxufVxuZXhwb3J0cy5DbGVhblJlc3BvbnNlID0gQ2xlYW5SZXNwb25zZTtcbmNvbnN0IHJlbW92YWxSZWdleHAgPSAvXlthLXpdK1xccyovaTtcbmNvbnN0IGRyeVJ1blJlbW92YWxSZWdleHAgPSAvXlthLXpdK1xccytbYS16XStcXHMqL2k7XG5jb25zdCBpc0ZvbGRlclJlZ2V4cCA9IC9cXC8kLztcbmZ1bmN0aW9uIGNsZWFuU3VtbWFyeVBhcnNlcihkcnlSdW4sIHRleHQpIHtcbiAgICBjb25zdCBzdW1tYXJ5ID0gbmV3IENsZWFuUmVzcG9uc2UoZHJ5UnVuKTtcbiAgICBjb25zdCByZWdleHAgPSBkcnlSdW4gPyBkcnlSdW5SZW1vdmFsUmVnZXhwIDogcmVtb3ZhbFJlZ2V4cDtcbiAgICB1dGlsc18xLnRvTGluZXNXaXRoQ29udGVudCh0ZXh0KS5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgICBjb25zdCByZW1vdmVkID0gbGluZS5yZXBsYWNlKHJlZ2V4cCwgJycpO1xuICAgICAgICBzdW1tYXJ5LnBhdGhzLnB1c2gocmVtb3ZlZCk7XG4gICAgICAgIChpc0ZvbGRlclJlZ2V4cC50ZXN0KHJlbW92ZWQpID8gc3VtbWFyeS5mb2xkZXJzIDogc3VtbWFyeS5maWxlcykucHVzaChyZW1vdmVkKTtcbiAgICB9KTtcbiAgICByZXR1cm4gc3VtbWFyeTtcbn1cbmV4cG9ydHMuY2xlYW5TdW1tYXJ5UGFyc2VyID0gY2xlYW5TdW1tYXJ5UGFyc2VyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2xlYW5TdW1tYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0VtcHR5VGFzayA9IGV4cG9ydHMuaXNCdWZmZXJUYXNrID0gZXhwb3J0cy5zdHJhaWdodFRocm91Z2hCdWZmZXJUYXNrID0gZXhwb3J0cy5zdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrID0gZXhwb3J0cy5jb25maWd1cmF0aW9uRXJyb3JUYXNrID0gZXhwb3J0cy5hZGhvY0V4ZWNUYXNrID0gZXhwb3J0cy5FTVBUWV9DT01NQU5EUyA9IHZvaWQgMDtcbmNvbnN0IHRhc2tfY29uZmlndXJhdGlvbl9lcnJvcl8xID0gcmVxdWlyZShcIi4uL2Vycm9ycy90YXNrLWNvbmZpZ3VyYXRpb24tZXJyb3JcIik7XG5leHBvcnRzLkVNUFRZX0NPTU1BTkRTID0gW107XG5mdW5jdGlvbiBhZGhvY0V4ZWNUYXNrKHBhcnNlcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzOiBleHBvcnRzLkVNUFRZX0NPTU1BTkRTLFxuICAgICAgICBmb3JtYXQ6ICdlbXB0eScsXG4gICAgICAgIHBhcnNlcixcbiAgICB9O1xufVxuZXhwb3J0cy5hZGhvY0V4ZWNUYXNrID0gYWRob2NFeGVjVGFzaztcbmZ1bmN0aW9uIGNvbmZpZ3VyYXRpb25FcnJvclRhc2soZXJyb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kczogZXhwb3J0cy5FTVBUWV9DT01NQU5EUyxcbiAgICAgICAgZm9ybWF0OiAnZW1wdHknLFxuICAgICAgICBwYXJzZXIoKSB7XG4gICAgICAgICAgICB0aHJvdyB0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnID8gbmV3IHRhc2tfY29uZmlndXJhdGlvbl9lcnJvcl8xLlRhc2tDb25maWd1cmF0aW9uRXJyb3IoZXJyb3IpIDogZXJyb3I7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5jb25maWd1cmF0aW9uRXJyb3JUYXNrID0gY29uZmlndXJhdGlvbkVycm9yVGFzaztcbmZ1bmN0aW9uIHN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soY29tbWFuZHMsIHRyaW1tZWQgPSBmYWxzZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcih0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJpbW1lZCA/IFN0cmluZyh0ZXh0KS50cmltKCkgOiB0ZXh0O1xuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnRzLnN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2sgPSBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrO1xuZnVuY3Rpb24gc3RyYWlnaHRUaHJvdWdoQnVmZmVyVGFzayhjb21tYW5kcykge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICdidWZmZXInLFxuICAgICAgICBwYXJzZXIoYnVmZmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnRzLnN0cmFpZ2h0VGhyb3VnaEJ1ZmZlclRhc2sgPSBzdHJhaWdodFRocm91Z2hCdWZmZXJUYXNrO1xuZnVuY3Rpb24gaXNCdWZmZXJUYXNrKHRhc2spIHtcbiAgICByZXR1cm4gdGFzay5mb3JtYXQgPT09ICdidWZmZXInO1xufVxuZXhwb3J0cy5pc0J1ZmZlclRhc2sgPSBpc0J1ZmZlclRhc2s7XG5mdW5jdGlvbiBpc0VtcHR5VGFzayh0YXNrKSB7XG4gICAgcmV0dXJuIHRhc2suZm9ybWF0ID09PSAnZW1wdHknIHx8ICF0YXNrLmNvbW1hbmRzLmxlbmd0aDtcbn1cbmV4cG9ydHMuaXNFbXB0eVRhc2sgPSBpc0VtcHR5VGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhc2suanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzQ2xlYW5PcHRpb25zQXJyYXkgPSBleHBvcnRzLmNsZWFuVGFzayA9IGV4cG9ydHMuY2xlYW5XaXRoT3B0aW9uc1Rhc2sgPSBleHBvcnRzLkNsZWFuT3B0aW9ucyA9IGV4cG9ydHMuQ09ORklHX0VSUk9SX1VOS05PV05fT1BUSU9OID0gZXhwb3J0cy5DT05GSUdfRVJST1JfTU9ERV9SRVFVSVJFRCA9IGV4cG9ydHMuQ09ORklHX0VSUk9SX0lOVEVSQUNUSVZFX01PREUgPSB2b2lkIDA7XG5jb25zdCBDbGVhblN1bW1hcnlfMSA9IHJlcXVpcmUoXCIuLi9yZXNwb25zZXMvQ2xlYW5TdW1tYXJ5XCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IHRhc2tfMSA9IHJlcXVpcmUoXCIuL3Rhc2tcIik7XG5leHBvcnRzLkNPTkZJR19FUlJPUl9JTlRFUkFDVElWRV9NT0RFID0gJ0dpdCBjbGVhbiBpbnRlcmFjdGl2ZSBtb2RlIGlzIG5vdCBzdXBwb3J0ZWQnO1xuZXhwb3J0cy5DT05GSUdfRVJST1JfTU9ERV9SRVFVSVJFRCA9ICdHaXQgY2xlYW4gbW9kZSBwYXJhbWV0ZXIgKFwiblwiIG9yIFwiZlwiKSBpcyByZXF1aXJlZCc7XG5leHBvcnRzLkNPTkZJR19FUlJPUl9VTktOT1dOX09QVElPTiA9ICdHaXQgY2xlYW4gdW5rbm93biBvcHRpb24gZm91bmQgaW46ICc7XG4vKipcbiAqIEFsbCBzdXBwb3J0ZWQgb3B0aW9uIHN3aXRjaGVzIGF2YWlsYWJsZSBmb3IgdXNlIGluIGEgYGdpdC5jbGVhbmAgb3BlcmF0aW9uXG4gKi9cbnZhciBDbGVhbk9wdGlvbnM7XG4oZnVuY3Rpb24gKENsZWFuT3B0aW9ucykge1xuICAgIENsZWFuT3B0aW9uc1tcIkRSWV9SVU5cIl0gPSBcIm5cIjtcbiAgICBDbGVhbk9wdGlvbnNbXCJGT1JDRVwiXSA9IFwiZlwiO1xuICAgIENsZWFuT3B0aW9uc1tcIklHTk9SRURfSU5DTFVERURcIl0gPSBcInhcIjtcbiAgICBDbGVhbk9wdGlvbnNbXCJJR05PUkVEX09OTFlcIl0gPSBcIlhcIjtcbiAgICBDbGVhbk9wdGlvbnNbXCJFWENMVURJTkdcIl0gPSBcImVcIjtcbiAgICBDbGVhbk9wdGlvbnNbXCJRVUlFVFwiXSA9IFwicVwiO1xuICAgIENsZWFuT3B0aW9uc1tcIlJFQ1VSU0lWRVwiXSA9IFwiZFwiO1xufSkoQ2xlYW5PcHRpb25zID0gZXhwb3J0cy5DbGVhbk9wdGlvbnMgfHwgKGV4cG9ydHMuQ2xlYW5PcHRpb25zID0ge30pKTtcbmNvbnN0IENsZWFuT3B0aW9uVmFsdWVzID0gbmV3IFNldChbJ2knLCAuLi51dGlsc18xLmFzU3RyaW5nQXJyYXkoT2JqZWN0LnZhbHVlcyhDbGVhbk9wdGlvbnMpKV0pO1xuZnVuY3Rpb24gY2xlYW5XaXRoT3B0aW9uc1Rhc2sobW9kZSwgY3VzdG9tQXJncykge1xuICAgIGNvbnN0IHsgY2xlYW5Nb2RlLCBvcHRpb25zLCB2YWxpZCB9ID0gZ2V0Q2xlYW5PcHRpb25zKG1vZGUpO1xuICAgIGlmICghY2xlYW5Nb2RlKSB7XG4gICAgICAgIHJldHVybiB0YXNrXzEuY29uZmlndXJhdGlvbkVycm9yVGFzayhleHBvcnRzLkNPTkZJR19FUlJPUl9NT0RFX1JFUVVJUkVEKTtcbiAgICB9XG4gICAgaWYgKCF2YWxpZC5vcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0YXNrXzEuY29uZmlndXJhdGlvbkVycm9yVGFzayhleHBvcnRzLkNPTkZJR19FUlJPUl9VTktOT1dOX09QVElPTiArIEpTT04uc3RyaW5naWZ5KG1vZGUpKTtcbiAgICB9XG4gICAgb3B0aW9ucy5wdXNoKC4uLmN1c3RvbUFyZ3MpO1xuICAgIGlmIChvcHRpb25zLnNvbWUoaXNJbnRlcmFjdGl2ZU1vZGUpKSB7XG4gICAgICAgIHJldHVybiB0YXNrXzEuY29uZmlndXJhdGlvbkVycm9yVGFzayhleHBvcnRzLkNPTkZJR19FUlJPUl9JTlRFUkFDVElWRV9NT0RFKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsZWFuVGFzayhjbGVhbk1vZGUsIG9wdGlvbnMpO1xufVxuZXhwb3J0cy5jbGVhbldpdGhPcHRpb25zVGFzayA9IGNsZWFuV2l0aE9wdGlvbnNUYXNrO1xuZnVuY3Rpb24gY2xlYW5UYXNrKG1vZGUsIGN1c3RvbUFyZ3MpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsnY2xlYW4nLCBgLSR7bW9kZX1gLCAuLi5jdXN0b21BcmdzXTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kcyxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXIodGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIENsZWFuU3VtbWFyeV8xLmNsZWFuU3VtbWFyeVBhcnNlcihtb2RlID09PSBDbGVhbk9wdGlvbnMuRFJZX1JVTiwgdGV4dCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5jbGVhblRhc2sgPSBjbGVhblRhc2s7XG5mdW5jdGlvbiBpc0NsZWFuT3B0aW9uc0FycmF5KGlucHV0KSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoaW5wdXQpICYmIGlucHV0LmV2ZXJ5KHRlc3QgPT4gQ2xlYW5PcHRpb25WYWx1ZXMuaGFzKHRlc3QpKTtcbn1cbmV4cG9ydHMuaXNDbGVhbk9wdGlvbnNBcnJheSA9IGlzQ2xlYW5PcHRpb25zQXJyYXk7XG5mdW5jdGlvbiBnZXRDbGVhbk9wdGlvbnMoaW5wdXQpIHtcbiAgICBsZXQgY2xlYW5Nb2RlO1xuICAgIGxldCBvcHRpb25zID0gW107XG4gICAgbGV0IHZhbGlkID0geyBjbGVhbk1vZGU6IGZhbHNlLCBvcHRpb25zOiB0cnVlIH07XG4gICAgaW5wdXQucmVwbGFjZSgvW15hLXpdaS9nLCAnJykuc3BsaXQoJycpLmZvckVhY2goY2hhciA9PiB7XG4gICAgICAgIGlmIChpc0NsZWFuTW9kZShjaGFyKSkge1xuICAgICAgICAgICAgY2xlYW5Nb2RlID0gY2hhcjtcbiAgICAgICAgICAgIHZhbGlkLmNsZWFuTW9kZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWxpZC5vcHRpb25zID0gdmFsaWQub3B0aW9ucyAmJiBpc0tub3duT3B0aW9uKG9wdGlvbnNbb3B0aW9ucy5sZW5ndGhdID0gKGAtJHtjaGFyfWApKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNsZWFuTW9kZSxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgdmFsaWQsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGlzQ2xlYW5Nb2RlKGNsZWFuTW9kZSkge1xuICAgIHJldHVybiBjbGVhbk1vZGUgPT09IENsZWFuT3B0aW9ucy5GT1JDRSB8fCBjbGVhbk1vZGUgPT09IENsZWFuT3B0aW9ucy5EUllfUlVOO1xufVxuZnVuY3Rpb24gaXNLbm93bk9wdGlvbihvcHRpb24pIHtcbiAgICByZXR1cm4gL14tW2Etel0kL2kudGVzdChvcHRpb24pICYmIENsZWFuT3B0aW9uVmFsdWVzLmhhcyhvcHRpb24uY2hhckF0KDEpKTtcbn1cbmZ1bmN0aW9uIGlzSW50ZXJhY3RpdmVNb2RlKG9wdGlvbikge1xuICAgIGlmICgvXi1bXlxcLV0vLnRlc3Qob3B0aW9uKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9uLmluZGV4T2YoJ2knKSA+IDA7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb24gPT09ICctLWludGVyYWN0aXZlJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNsZWFuLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jb25maWdHZXRQYXJzZXIgPSBleHBvcnRzLmNvbmZpZ0xpc3RQYXJzZXIgPSBleHBvcnRzLkNvbmZpZ0xpc3QgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY2xhc3MgQ29uZmlnTGlzdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmlsZXMgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIH1cbiAgICBnZXQgYWxsKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2FsbCkge1xuICAgICAgICAgICAgdGhpcy5fYWxsID0gdGhpcy5maWxlcy5yZWR1Y2UoKGFsbCwgZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFsbCwgdGhpcy52YWx1ZXNbZmlsZV0pO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGw7XG4gICAgfVxuICAgIGFkZEZpbGUoZmlsZSkge1xuICAgICAgICBpZiAoIShmaWxlIGluIHRoaXMudmFsdWVzKSkge1xuICAgICAgICAgICAgY29uc3QgbGF0ZXN0ID0gdXRpbHNfMS5sYXN0KHRoaXMuZmlsZXMpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZXNbZmlsZV0gPSBsYXRlc3QgPyBPYmplY3QuY3JlYXRlKHRoaXMudmFsdWVzW2xhdGVzdF0pIDoge307XG4gICAgICAgICAgICB0aGlzLmZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2ZpbGVdO1xuICAgIH1cbiAgICBhZGRWYWx1ZShmaWxlLCBrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuYWRkRmlsZShmaWxlKTtcbiAgICAgICAgaWYgKCF2YWx1ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdmFsdWVzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlc1trZXldKSkge1xuICAgICAgICAgICAgdmFsdWVzW2tleV0ucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZXNba2V5XSA9IFt2YWx1ZXNba2V5XSwgdmFsdWVdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FsbCA9IHVuZGVmaW5lZDtcbiAgICB9XG59XG5leHBvcnRzLkNvbmZpZ0xpc3QgPSBDb25maWdMaXN0O1xuZnVuY3Rpb24gY29uZmlnTGlzdFBhcnNlcih0ZXh0KSB7XG4gICAgY29uc3QgY29uZmlnID0gbmV3IENvbmZpZ0xpc3QoKTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgY29uZmlnUGFyc2VyKHRleHQpKSB7XG4gICAgICAgIGNvbmZpZy5hZGRWYWx1ZShpdGVtLmZpbGUsIGl0ZW0ua2V5LCBpdGVtLnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZztcbn1cbmV4cG9ydHMuY29uZmlnTGlzdFBhcnNlciA9IGNvbmZpZ0xpc3RQYXJzZXI7XG5mdW5jdGlvbiBjb25maWdHZXRQYXJzZXIodGV4dCwga2V5KSB7XG4gICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICBjb25zdCB2YWx1ZXMgPSBbXTtcbiAgICBjb25zdCBzY29wZXMgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGNvbmZpZ1BhcnNlcih0ZXh0KSkge1xuICAgICAgICBpZiAoaXRlbS5rZXkgIT09IGtleSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzLnB1c2godmFsdWUgPSBpdGVtLnZhbHVlKTtcbiAgICAgICAgaWYgKCFzY29wZXMuaGFzKGl0ZW0uZmlsZSkpIHtcbiAgICAgICAgICAgIHNjb3Blcy5zZXQoaXRlbS5maWxlLCBbXSk7XG4gICAgICAgIH1cbiAgICAgICAgc2NvcGVzLmdldChpdGVtLmZpbGUpLnB1c2godmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBrZXksXG4gICAgICAgIHBhdGhzOiBBcnJheS5mcm9tKHNjb3Blcy5rZXlzKCkpLFxuICAgICAgICBzY29wZXMsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICB2YWx1ZXNcbiAgICB9O1xufVxuZXhwb3J0cy5jb25maWdHZXRQYXJzZXIgPSBjb25maWdHZXRQYXJzZXI7XG5mdW5jdGlvbiBjb25maWdGaWxlUGF0aChmaWxlUGF0aCkge1xuICAgIHJldHVybiBmaWxlUGF0aC5yZXBsYWNlKC9eKGZpbGUpOi8sICcnKTtcbn1cbmZ1bmN0aW9uKiBjb25maWdQYXJzZXIodGV4dCkge1xuICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFwwJyk7XG4gICAgZm9yIChsZXQgaSA9IDAsIG1heCA9IGxpbmVzLmxlbmd0aCAtIDE7IGkgPCBtYXg7KSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBjb25maWdGaWxlUGF0aChsaW5lc1tpKytdKTtcbiAgICAgICAgY29uc3QgW2tleSwgdmFsdWVdID0gdXRpbHNfMS5zcGxpdE9uKGxpbmVzW2krK10sICdcXG4nKTtcbiAgICAgICAgeWllbGQgeyBmaWxlLCBrZXksIHZhbHVlIH07XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q29uZmlnTGlzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2l0Q29uZmlnU2NvcGUgPSB2b2lkIDA7XG5jb25zdCBDb25maWdMaXN0XzEgPSByZXF1aXJlKFwiLi4vcmVzcG9uc2VzL0NvbmZpZ0xpc3RcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xudmFyIEdpdENvbmZpZ1Njb3BlO1xuKGZ1bmN0aW9uIChHaXRDb25maWdTY29wZSkge1xuICAgIEdpdENvbmZpZ1Njb3BlW1wic3lzdGVtXCJdID0gXCJzeXN0ZW1cIjtcbiAgICBHaXRDb25maWdTY29wZVtcImdsb2JhbFwiXSA9IFwiZ2xvYmFsXCI7XG4gICAgR2l0Q29uZmlnU2NvcGVbXCJsb2NhbFwiXSA9IFwibG9jYWxcIjtcbiAgICBHaXRDb25maWdTY29wZVtcIndvcmt0cmVlXCJdID0gXCJ3b3JrdHJlZVwiO1xufSkoR2l0Q29uZmlnU2NvcGUgPSBleHBvcnRzLkdpdENvbmZpZ1Njb3BlIHx8IChleHBvcnRzLkdpdENvbmZpZ1Njb3BlID0ge30pKTtcbmZ1bmN0aW9uIGFzQ29uZmlnU2NvcGUoc2NvcGUsIGZhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBzY29wZSA9PT0gJ3N0cmluZycgJiYgR2l0Q29uZmlnU2NvcGUuaGFzT3duUHJvcGVydHkoc2NvcGUpKSB7XG4gICAgICAgIHJldHVybiBzY29wZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbGxiYWNrO1xufVxuZnVuY3Rpb24gYWRkQ29uZmlnVGFzayhrZXksIHZhbHVlLCBhcHBlbmQsIHNjb3BlKSB7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ2NvbmZpZycsIGAtLSR7c2NvcGV9YF07XG4gICAgaWYgKGFwcGVuZCkge1xuICAgICAgICBjb21tYW5kcy5wdXNoKCctLWFkZCcpO1xuICAgIH1cbiAgICBjb21tYW5kcy5wdXNoKGtleSwgdmFsdWUpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcih0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBnZXRDb25maWdUYXNrKGtleSwgc2NvcGUpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsnY29uZmlnJywgJy0tbnVsbCcsICctLXNob3ctb3JpZ2luJywgJy0tZ2V0LWFsbCcsIGtleV07XG4gICAgaWYgKHNjb3BlKSB7XG4gICAgICAgIGNvbW1hbmRzLnNwbGljZSgxLCAwLCBgLS0ke3Njb3BlfWApO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kcyxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXIodGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZ0xpc3RfMS5jb25maWdHZXRQYXJzZXIodGV4dCwga2V5KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBsaXN0Q29uZmlnVGFzayhzY29wZSkge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWydjb25maWcnLCAnLS1saXN0JywgJy0tc2hvdy1vcmlnaW4nLCAnLS1udWxsJ107XG4gICAgaWYgKHNjb3BlKSB7XG4gICAgICAgIGNvbW1hbmRzLnB1c2goYC0tJHtzY29wZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHMsXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgcGFyc2VyKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWdMaXN0XzEuY29uZmlnTGlzdFBhcnNlcih0ZXh0KTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZnVuY3Rpb24gZGVmYXVsdF8xKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFkZENvbmZpZyhrZXksIHZhbHVlLCAuLi5yZXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhhZGRDb25maWdUYXNrKGtleSwgdmFsdWUsIHJlc3RbMF0gPT09IHRydWUsIGFzQ29uZmlnU2NvcGUocmVzdFsxXSwgR2l0Q29uZmlnU2NvcGUubG9jYWwpKSwgdXRpbHNfMS50cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbmZpZyhrZXksIHNjb3BlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhnZXRDb25maWdUYXNrKGtleSwgYXNDb25maWdTY29wZShzY29wZSwgdW5kZWZpbmVkKSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xuICAgICAgICB9LFxuICAgICAgICBsaXN0Q29uZmlnKC4uLnJlc3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ydW5UYXNrKGxpc3RDb25maWdUYXNrKGFzQ29uZmlnU2NvcGUocmVzdFswXSwgdW5kZWZpbmVkKSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25maWcuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldFJlc2V0TW9kZSA9IGV4cG9ydHMucmVzZXRUYXNrID0gZXhwb3J0cy5SZXNldE1vZGUgPSB2b2lkIDA7XG5jb25zdCB0YXNrXzEgPSByZXF1aXJlKFwiLi90YXNrXCIpO1xudmFyIFJlc2V0TW9kZTtcbihmdW5jdGlvbiAoUmVzZXRNb2RlKSB7XG4gICAgUmVzZXRNb2RlW1wiTUlYRURcIl0gPSBcIm1peGVkXCI7XG4gICAgUmVzZXRNb2RlW1wiU09GVFwiXSA9IFwic29mdFwiO1xuICAgIFJlc2V0TW9kZVtcIkhBUkRcIl0gPSBcImhhcmRcIjtcbiAgICBSZXNldE1vZGVbXCJNRVJHRVwiXSA9IFwibWVyZ2VcIjtcbiAgICBSZXNldE1vZGVbXCJLRUVQXCJdID0gXCJrZWVwXCI7XG59KShSZXNldE1vZGUgPSBleHBvcnRzLlJlc2V0TW9kZSB8fCAoZXhwb3J0cy5SZXNldE1vZGUgPSB7fSkpO1xuY29uc3QgUmVzZXRNb2RlcyA9IEFycmF5LmZyb20oT2JqZWN0LnZhbHVlcyhSZXNldE1vZGUpKTtcbmZ1bmN0aW9uIHJlc2V0VGFzayhtb2RlLCBjdXN0b21BcmdzKSB7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ3Jlc2V0J107XG4gICAgaWYgKGlzVmFsaWRSZXNldE1vZGUobW9kZSkpIHtcbiAgICAgICAgY29tbWFuZHMucHVzaChgLS0ke21vZGV9YCk7XG4gICAgfVxuICAgIGNvbW1hbmRzLnB1c2goLi4uY3VzdG9tQXJncyk7XG4gICAgcmV0dXJuIHRhc2tfMS5zdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKGNvbW1hbmRzKTtcbn1cbmV4cG9ydHMucmVzZXRUYXNrID0gcmVzZXRUYXNrO1xuZnVuY3Rpb24gZ2V0UmVzZXRNb2RlKG1vZGUpIHtcbiAgICBpZiAoaXNWYWxpZFJlc2V0TW9kZShtb2RlKSkge1xuICAgICAgICByZXR1cm4gbW9kZTtcbiAgICB9XG4gICAgc3dpdGNoICh0eXBlb2YgbW9kZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICAgICAgcmV0dXJuIFJlc2V0TW9kZS5TT0ZUO1xuICAgIH1cbiAgICByZXR1cm47XG59XG5leHBvcnRzLmdldFJlc2V0TW9kZSA9IGdldFJlc2V0TW9kZTtcbmZ1bmN0aW9uIGlzVmFsaWRSZXNldE1vZGUobW9kZSkge1xuICAgIHJldHVybiBSZXNldE1vZGVzLmluY2x1ZGVzKG1vZGUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVzZXQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBnaXRfY29uc3RydWN0X2Vycm9yXzEgPSByZXF1aXJlKFwiLi9lcnJvcnMvZ2l0LWNvbnN0cnVjdC1lcnJvclwiKTtcbmNvbnN0IGdpdF9lcnJvcl8xID0gcmVxdWlyZShcIi4vZXJyb3JzL2dpdC1lcnJvclwiKTtcbmNvbnN0IGdpdF9wbHVnaW5fZXJyb3JfMSA9IHJlcXVpcmUoXCIuL2Vycm9ycy9naXQtcGx1Z2luLWVycm9yXCIpO1xuY29uc3QgZ2l0X3Jlc3BvbnNlX2Vycm9yXzEgPSByZXF1aXJlKFwiLi9lcnJvcnMvZ2l0LXJlc3BvbnNlLWVycm9yXCIpO1xuY29uc3QgdGFza19jb25maWd1cmF0aW9uX2Vycm9yXzEgPSByZXF1aXJlKFwiLi9lcnJvcnMvdGFzay1jb25maWd1cmF0aW9uLWVycm9yXCIpO1xuY29uc3QgY2hlY2tfaXNfcmVwb18xID0gcmVxdWlyZShcIi4vdGFza3MvY2hlY2staXMtcmVwb1wiKTtcbmNvbnN0IGNsZWFuXzEgPSByZXF1aXJlKFwiLi90YXNrcy9jbGVhblwiKTtcbmNvbnN0IGNvbmZpZ18xID0gcmVxdWlyZShcIi4vdGFza3MvY29uZmlnXCIpO1xuY29uc3QgcmVzZXRfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL3Jlc2V0XCIpO1xuY29uc3QgYXBpID0ge1xuICAgIENoZWNrUmVwb0FjdGlvbnM6IGNoZWNrX2lzX3JlcG9fMS5DaGVja1JlcG9BY3Rpb25zLFxuICAgIENsZWFuT3B0aW9uczogY2xlYW5fMS5DbGVhbk9wdGlvbnMsXG4gICAgR2l0Q29uZmlnU2NvcGU6IGNvbmZpZ18xLkdpdENvbmZpZ1Njb3BlLFxuICAgIEdpdENvbnN0cnVjdEVycm9yOiBnaXRfY29uc3RydWN0X2Vycm9yXzEuR2l0Q29uc3RydWN0RXJyb3IsXG4gICAgR2l0RXJyb3I6IGdpdF9lcnJvcl8xLkdpdEVycm9yLFxuICAgIEdpdFBsdWdpbkVycm9yOiBnaXRfcGx1Z2luX2Vycm9yXzEuR2l0UGx1Z2luRXJyb3IsXG4gICAgR2l0UmVzcG9uc2VFcnJvcjogZ2l0X3Jlc3BvbnNlX2Vycm9yXzEuR2l0UmVzcG9uc2VFcnJvcixcbiAgICBSZXNldE1vZGU6IHJlc2V0XzEuUmVzZXRNb2RlLFxuICAgIFRhc2tDb25maWd1cmF0aW9uRXJyb3I6IHRhc2tfY29uZmlndXJhdGlvbl9lcnJvcl8xLlRhc2tDb25maWd1cmF0aW9uRXJyb3IsXG59O1xuZXhwb3J0cy5kZWZhdWx0ID0gYXBpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBpLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jb21tYW5kQ29uZmlnUHJlZml4aW5nUGx1Z2luID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmZ1bmN0aW9uIGNvbW1hbmRDb25maWdQcmVmaXhpbmdQbHVnaW4oY29uZmlndXJhdGlvbikge1xuICAgIGNvbnN0IHByZWZpeCA9IHV0aWxzXzEucHJlZml4ZWRBcnJheShjb25maWd1cmF0aW9uLCAnLWMnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnc3Bhd24uYXJncycsXG4gICAgICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLnByZWZpeCwgLi4uZGF0YV07XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydHMuY29tbWFuZENvbmZpZ1ByZWZpeGluZ1BsdWdpbiA9IGNvbW1hbmRDb25maWdQcmVmaXhpbmdQbHVnaW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21tYW5kLWNvbmZpZy1wcmVmaXhpbmctcGx1Z2luLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5lcnJvckRldGVjdGlvblBsdWdpbiA9IGV4cG9ydHMuZXJyb3JEZXRlY3Rpb25IYW5kbGVyID0gdm9pZCAwO1xuY29uc3QgZ2l0X2Vycm9yXzEgPSByZXF1aXJlKFwiLi4vZXJyb3JzL2dpdC1lcnJvclwiKTtcbmZ1bmN0aW9uIGlzVGFza0Vycm9yKHJlc3VsdCkge1xuICAgIHJldHVybiAhIShyZXN1bHQuZXhpdENvZGUgJiYgcmVzdWx0LnN0ZEVyci5sZW5ndGgpO1xufVxuZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKHJlc3VsdCkge1xuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KFsuLi5yZXN1bHQuc3RkT3V0LCAuLi5yZXN1bHQuc3RkRXJyXSk7XG59XG5mdW5jdGlvbiBlcnJvckRldGVjdGlvbkhhbmRsZXIob3ZlcndyaXRlID0gZmFsc2UsIGlzRXJyb3IgPSBpc1Rhc2tFcnJvciwgZXJyb3JNZXNzYWdlID0gZ2V0RXJyb3JNZXNzYWdlKSB7XG4gICAgcmV0dXJuIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmICgoIW92ZXJ3cml0ZSAmJiBlcnJvcikgfHwgIWlzRXJyb3IocmVzdWx0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvck1lc3NhZ2UocmVzdWx0KTtcbiAgICB9O1xufVxuZXhwb3J0cy5lcnJvckRldGVjdGlvbkhhbmRsZXIgPSBlcnJvckRldGVjdGlvbkhhbmRsZXI7XG5mdW5jdGlvbiBlcnJvckRldGVjdGlvblBsdWdpbihjb25maWcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAndGFzay5lcnJvcicsXG4gICAgICAgIGFjdGlvbihkYXRhLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IGNvbmZpZyhkYXRhLmVycm9yLCB7XG4gICAgICAgICAgICAgICAgc3RkRXJyOiBjb250ZXh0LnN0ZEVycixcbiAgICAgICAgICAgICAgICBzdGRPdXQ6IGNvbnRleHQuc3RkT3V0LFxuICAgICAgICAgICAgICAgIGV4aXRDb2RlOiBjb250ZXh0LmV4aXRDb2RlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG5ldyBnaXRfZXJyb3JfMS5HaXRFcnJvcih1bmRlZmluZWQsIGVycm9yLnRvU3RyaW5nKCd1dGYtOCcpKSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlcnJvclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZXhwb3J0cy5lcnJvckRldGVjdGlvblBsdWdpbiA9IGVycm9yRGV0ZWN0aW9uUGx1Z2luO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXJyb3ItZGV0ZWN0aW9uLnBsdWdpbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGx1Z2luU3RvcmUgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY2xhc3MgUGx1Z2luU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBsdWdpbnMgPSBuZXcgU2V0KCk7XG4gICAgfVxuICAgIGFkZChwbHVnaW4pIHtcbiAgICAgICAgY29uc3QgcGx1Z2lucyA9IFtdO1xuICAgICAgICB1dGlsc18xLmFzQXJyYXkocGx1Z2luKS5mb3JFYWNoKHBsdWdpbiA9PiBwbHVnaW4gJiYgdGhpcy5wbHVnaW5zLmFkZCh1dGlsc18xLmFwcGVuZChwbHVnaW5zLCBwbHVnaW4pKSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBwbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHRoaXMucGx1Z2lucy5kZWxldGUocGx1Z2luKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGV4ZWModHlwZSwgZGF0YSwgY29udGV4dCkge1xuICAgICAgICBsZXQgb3V0cHV0ID0gZGF0YTtcbiAgICAgICAgY29uc3QgY29udGV4dHVhbCA9IE9iamVjdC5mcmVlemUoT2JqZWN0LmNyZWF0ZShjb250ZXh0KSk7XG4gICAgICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHRoaXMucGx1Z2lucykge1xuICAgICAgICAgICAgaWYgKHBsdWdpbi50eXBlID09PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gcGx1Z2luLmFjdGlvbihvdXRwdXQsIGNvbnRleHR1YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxufVxuZXhwb3J0cy5QbHVnaW5TdG9yZSA9IFBsdWdpblN0b3JlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGx1Z2luLXN0b3JlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wcm9ncmVzc01vbml0b3JQbHVnaW4gPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuZnVuY3Rpb24gcHJvZ3Jlc3NNb25pdG9yUGx1Z2luKHByb2dyZXNzKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3NDb21tYW5kID0gJy0tcHJvZ3Jlc3MnO1xuICAgIGNvbnN0IHByb2dyZXNzTWV0aG9kcyA9IFsnY2hlY2tvdXQnLCAnY2xvbmUnLCAnZmV0Y2gnLCAncHVsbCcsICdwdXNoJ107XG4gICAgY29uc3Qgb25Qcm9ncmVzcyA9IHtcbiAgICAgICAgdHlwZTogJ3NwYXduLmFmdGVyJyxcbiAgICAgICAgYWN0aW9uKF9kYXRhLCBjb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBpZiAoIWNvbnRleHQuY29tbWFuZHMuaW5jbHVkZXMocHJvZ3Jlc3NDb21tYW5kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChfYSA9IGNvbnRleHQuc3Bhd25lZC5zdGRlcnIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAvXihbYS16QS1aIF0rKTpcXHMqKFxcZCspJSBcXCgoXFxkKylcXC8oXFxkKylcXCkvLmV4ZWMoY2h1bmsudG9TdHJpbmcoJ3V0ZjgnKSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3Moe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IGNvbnRleHQubWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICBzdGFnZTogcHJvZ3Jlc3NFdmVudFN0YWdlKG1lc3NhZ2VbMV0pLFxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogdXRpbHNfMS5hc051bWJlcihtZXNzYWdlWzJdKSxcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2VkOiB1dGlsc18xLmFzTnVtYmVyKG1lc3NhZ2VbM10pLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdXRpbHNfMS5hc051bWJlcihtZXNzYWdlWzRdKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBvbkFyZ3MgPSB7XG4gICAgICAgIHR5cGU6ICdzcGF3bi5hcmdzJyxcbiAgICAgICAgYWN0aW9uKGFyZ3MsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICghcHJvZ3Jlc3NNZXRob2RzLmluY2x1ZGVzKGNvbnRleHQubWV0aG9kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHV0aWxzXzEuaW5jbHVkaW5nKGFyZ3MsIHByb2dyZXNzQ29tbWFuZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBbb25BcmdzLCBvblByb2dyZXNzXTtcbn1cbmV4cG9ydHMucHJvZ3Jlc3NNb25pdG9yUGx1Z2luID0gcHJvZ3Jlc3NNb25pdG9yUGx1Z2luO1xuZnVuY3Rpb24gcHJvZ3Jlc3NFdmVudFN0YWdlKGlucHV0KSB7XG4gICAgcmV0dXJuIFN0cmluZyhpbnB1dC50b0xvd2VyQ2FzZSgpLnNwbGl0KCcgJywgMSkpIHx8ICd1bmtub3duJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByb2dyZXNzLW1vbml0b3ItcGx1Z2luLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2ltcGxlLWdpdC1wbHVnaW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNwYXduT3B0aW9uc1BsdWdpbiA9IHZvaWQgMDtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5mdW5jdGlvbiBzcGF3bk9wdGlvbnNQbHVnaW4oc3Bhd25PcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHV0aWxzXzEucGljayhzcGF3bk9wdGlvbnMsIFsndWlkJywgJ2dpZCddKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnc3Bhd24ub3B0aW9ucycsXG4gICAgICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgZGF0YSk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydHMuc3Bhd25PcHRpb25zUGx1Z2luID0gc3Bhd25PcHRpb25zUGx1Z2luO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3Bhd24tb3B0aW9ucy1wbHVnaW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnRpbWVvdXRQbHVnaW4gPSB2b2lkIDA7XG5jb25zdCBnaXRfcGx1Z2luX2Vycm9yXzEgPSByZXF1aXJlKFwiLi4vZXJyb3JzL2dpdC1wbHVnaW4tZXJyb3JcIik7XG5mdW5jdGlvbiB0aW1lb3V0UGx1Z2luKHsgYmxvY2sgfSkge1xuICAgIGlmIChibG9jayA+IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdzcGF3bi5hZnRlcicsXG4gICAgICAgICAgICBhY3Rpb24oX2RhdGEsIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIGxldCB0aW1lb3V0O1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHdhaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgJiYgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChraWxsLCBibG9jayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgICAgIChfYSA9IGNvbnRleHQuc3Bhd25lZC5zdGRvdXQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vZmYoJ2RhdGEnLCB3YWl0KTtcbiAgICAgICAgICAgICAgICAgICAgKF9iID0gY29udGV4dC5zcGF3bmVkLnN0ZGVycikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm9mZignZGF0YScsIHdhaXQpO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnNwYXduZWQub2ZmKCdleGl0Jywgc3RvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc3Bhd25lZC5vZmYoJ2Nsb3NlJywgc3RvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGtpbGwoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5raWxsKG5ldyBnaXRfcGx1Z2luX2Vycm9yXzEuR2l0UGx1Z2luRXJyb3IodW5kZWZpbmVkLCAndGltZW91dCcsIGBibG9jayB0aW1lb3V0IHJlYWNoZWRgKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIChfYSA9IGNvbnRleHQuc3Bhd25lZC5zdGRvdXQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vbignZGF0YScsIHdhaXQpO1xuICAgICAgICAgICAgICAgIChfYiA9IGNvbnRleHQuc3Bhd25lZC5zdGRlcnIpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5vbignZGF0YScsIHdhaXQpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuc3Bhd25lZC5vbignZXhpdCcsIHN0b3ApO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuc3Bhd25lZC5vbignY2xvc2UnLCBzdG9wKTtcbiAgICAgICAgICAgICAgICB3YWl0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuZXhwb3J0cy50aW1lb3V0UGx1Z2luID0gdGltZW91dFBsdWdpbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbW91dC1wbHVnaW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9jb21tYW5kLWNvbmZpZy1wcmVmaXhpbmctcGx1Z2luXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9lcnJvci1kZXRlY3Rpb24ucGx1Z2luXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9wbHVnaW4tc3RvcmVcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3Byb2dyZXNzLW1vbml0b3ItcGx1Z2luXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9zaW1wbGUtZ2l0LXBsdWdpblwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc3Bhd24tb3B0aW9ucy1wbHVnaW5cIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3RpbW91dC1wbHVnaW5cIiksIGV4cG9ydHMpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdpdExvZ2dlciA9IGV4cG9ydHMuY3JlYXRlTG9nZ2VyID0gdm9pZCAwO1xuY29uc3QgZGVidWdfMSA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmRlYnVnXzEuZGVmYXVsdC5mb3JtYXR0ZXJzLkwgPSAodmFsdWUpID0+IFN0cmluZyh1dGlsc18xLmZpbHRlckhhc0xlbmd0aCh2YWx1ZSkgPyB2YWx1ZS5sZW5ndGggOiAnLScpO1xuZGVidWdfMS5kZWZhdWx0LmZvcm1hdHRlcnMuQiA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygndXRmOCcpO1xuICAgIH1cbiAgICByZXR1cm4gdXRpbHNfMS5vYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59O1xuZnVuY3Rpb24gY3JlYXRlTG9nKCkge1xuICAgIHJldHVybiBkZWJ1Z18xLmRlZmF1bHQoJ3NpbXBsZS1naXQnKTtcbn1cbmZ1bmN0aW9uIHByZWZpeGVkTG9nZ2VyKHRvLCBwcmVmaXgsIGZvcndhcmQpIHtcbiAgICBpZiAoIXByZWZpeCB8fCAhU3RyaW5nKHByZWZpeCkucmVwbGFjZSgvXFxzKi8sICcnKSkge1xuICAgICAgICByZXR1cm4gIWZvcndhcmQgPyB0byA6IChtZXNzYWdlLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICB0byhtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIGZvcndhcmQobWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiAobWVzc2FnZSwgLi4uYXJncykgPT4ge1xuICAgICAgICB0byhgJXMgJHttZXNzYWdlfWAsIHByZWZpeCwgLi4uYXJncyk7XG4gICAgICAgIGlmIChmb3J3YXJkKSB7XG4gICAgICAgICAgICBmb3J3YXJkKG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNoaWxkTG9nZ2VyTmFtZShuYW1lLCBjaGlsZERlYnVnZ2VyLCB7IG5hbWVzcGFjZTogcGFyZW50TmFtZXNwYWNlIH0pIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cbiAgICBjb25zdCBjaGlsZE5hbWVzcGFjZSA9IGNoaWxkRGVidWdnZXIgJiYgY2hpbGREZWJ1Z2dlci5uYW1lc3BhY2UgfHwgJyc7XG4gICAgaWYgKGNoaWxkTmFtZXNwYWNlLnN0YXJ0c1dpdGgocGFyZW50TmFtZXNwYWNlKSkge1xuICAgICAgICByZXR1cm4gY2hpbGROYW1lc3BhY2Uuc3Vic3RyKHBhcmVudE5hbWVzcGFjZS5sZW5ndGggKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkTmFtZXNwYWNlIHx8IHBhcmVudE5hbWVzcGFjZTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcihsYWJlbCwgdmVyYm9zZSwgaW5pdGlhbFN0ZXAsIGluZm9EZWJ1Z2dlciA9IGNyZWF0ZUxvZygpKSB7XG4gICAgY29uc3QgbGFiZWxQcmVmaXggPSBsYWJlbCAmJiBgWyR7bGFiZWx9XWAgfHwgJyc7XG4gICAgY29uc3Qgc3Bhd25lZCA9IFtdO1xuICAgIGNvbnN0IGRlYnVnRGVidWdnZXIgPSAodHlwZW9mIHZlcmJvc2UgPT09ICdzdHJpbmcnKSA/IGluZm9EZWJ1Z2dlci5leHRlbmQodmVyYm9zZSkgOiB2ZXJib3NlO1xuICAgIGNvbnN0IGtleSA9IGNoaWxkTG9nZ2VyTmFtZSh1dGlsc18xLmZpbHRlclR5cGUodmVyYm9zZSwgdXRpbHNfMS5maWx0ZXJTdHJpbmcpLCBkZWJ1Z0RlYnVnZ2VyLCBpbmZvRGVidWdnZXIpO1xuICAgIHJldHVybiBzdGVwKGluaXRpYWxTdGVwKTtcbiAgICBmdW5jdGlvbiBzaWJsaW5nKG5hbWUsIGluaXRpYWwpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxzXzEuYXBwZW5kKHNwYXduZWQsIGNyZWF0ZUxvZ2dlcihsYWJlbCwga2V5LnJlcGxhY2UoL15bXjpdKy8sIG5hbWUpLCBpbml0aWFsLCBpbmZvRGVidWdnZXIpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc3RlcChwaGFzZSkge1xuICAgICAgICBjb25zdCBzdGVwUHJlZml4ID0gcGhhc2UgJiYgYFske3BoYXNlfV1gIHx8ICcnO1xuICAgICAgICBjb25zdCBkZWJ1ZyA9IGRlYnVnRGVidWdnZXIgJiYgcHJlZml4ZWRMb2dnZXIoZGVidWdEZWJ1Z2dlciwgc3RlcFByZWZpeCkgfHwgdXRpbHNfMS5OT09QO1xuICAgICAgICBjb25zdCBpbmZvID0gcHJlZml4ZWRMb2dnZXIoaW5mb0RlYnVnZ2VyLCBgJHtsYWJlbFByZWZpeH0gJHtzdGVwUHJlZml4fWAsIGRlYnVnKTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oZGVidWdEZWJ1Z2dlciA/IGRlYnVnIDogaW5mbywge1xuICAgICAgICAgICAgbGFiZWwsXG4gICAgICAgICAgICBzaWJsaW5nLFxuICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgIHN0ZXAsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuY3JlYXRlTG9nZ2VyID0gY3JlYXRlTG9nZ2VyO1xuLyoqXG4gKiBUaGUgYEdpdExvZ2dlcmAgaXMgdXNlZCBieSB0aGUgbWFpbiBgU2ltcGxlR2l0YCBydW5uZXIgdG8gaGFuZGxlIGxvZ2dpbmdcbiAqIGFueSB3YXJuaW5ncyBvciBlcnJvcnMuXG4gKi9cbmNsYXNzIEdpdExvZ2dlciB7XG4gICAgY29uc3RydWN0b3IoX291dCA9IGNyZWF0ZUxvZygpKSB7XG4gICAgICAgIHRoaXMuX291dCA9IF9vdXQ7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBwcmVmaXhlZExvZ2dlcihfb3V0LCAnW0VSUk9SXScpO1xuICAgICAgICB0aGlzLndhcm4gPSBwcmVmaXhlZExvZ2dlcihfb3V0LCAnW1dBUk5dJyk7XG4gICAgfVxuICAgIHNpbGVudChzaWxlbmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHNpbGVuY2UgIT09IHRoaXMuX291dC5lbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBuYW1lc3BhY2UgfSA9IHRoaXMuX291dDtcbiAgICAgICAgY29uc3QgZW52ID0gKHByb2Nlc3MuZW52LkRFQlVHIHx8ICcnKS5zcGxpdCgnLCcpLmZpbHRlcihzID0+ICEhcyk7XG4gICAgICAgIGNvbnN0IGhhc09uID0gZW52LmluY2x1ZGVzKG5hbWVzcGFjZSk7XG4gICAgICAgIGNvbnN0IGhhc09mZiA9IGVudi5pbmNsdWRlcyhgLSR7bmFtZXNwYWNlfWApO1xuICAgICAgICAvLyBlbmFibGluZyB0aGUgbG9nXG4gICAgICAgIGlmICghc2lsZW5jZSkge1xuICAgICAgICAgICAgaWYgKGhhc09mZikge1xuICAgICAgICAgICAgICAgIHV0aWxzXzEucmVtb3ZlKGVudiwgYC0ke25hbWVzcGFjZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGVudi5wdXNoKG5hbWVzcGFjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaGFzT24pIHtcbiAgICAgICAgICAgICAgICB1dGlsc18xLnJlbW92ZShlbnYsIG5hbWVzcGFjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbnYucHVzaChgLSR7bmFtZXNwYWNlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRlYnVnXzEuZGVmYXVsdC5lbmFibGUoZW52LmpvaW4oJywnKSk7XG4gICAgfVxufVxuZXhwb3J0cy5HaXRMb2dnZXIgPSBHaXRMb2dnZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1naXQtbG9nZ2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UYXNrc1BlbmRpbmdRdWV1ZSA9IHZvaWQgMDtcbmNvbnN0IGdpdF9lcnJvcl8xID0gcmVxdWlyZShcIi4uL2Vycm9ycy9naXQtZXJyb3JcIik7XG5jb25zdCBnaXRfbG9nZ2VyXzEgPSByZXF1aXJlKFwiLi4vZ2l0LWxvZ2dlclwiKTtcbmNsYXNzIFRhc2tzUGVuZGluZ1F1ZXVlIHtcbiAgICBjb25zdHJ1Y3Rvcihsb2dMYWJlbCA9ICdHaXRFeGVjdXRvcicpIHtcbiAgICAgICAgdGhpcy5sb2dMYWJlbCA9IGxvZ0xhYmVsO1xuICAgICAgICB0aGlzLl9xdWV1ZSA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgd2l0aFByb2dyZXNzKHRhc2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3F1ZXVlLmdldCh0YXNrKTtcbiAgICB9XG4gICAgY3JlYXRlUHJvZ3Jlc3ModGFzaykge1xuICAgICAgICBjb25zdCBuYW1lID0gVGFza3NQZW5kaW5nUXVldWUuZ2V0TmFtZSh0YXNrLmNvbW1hbmRzWzBdKTtcbiAgICAgICAgY29uc3QgbG9nZ2VyID0gZ2l0X2xvZ2dlcl8xLmNyZWF0ZUxvZ2dlcih0aGlzLmxvZ0xhYmVsLCBuYW1lKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgICBsb2dnZXIsXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBwdXNoKHRhc2spIHtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB0aGlzLmNyZWF0ZVByb2dyZXNzKHRhc2spO1xuICAgICAgICBwcm9ncmVzcy5sb2dnZXIoJ0FkZGluZyB0YXNrIHRvIHRoZSBxdWV1ZSwgY29tbWFuZHMgPSAlbycsIHRhc2suY29tbWFuZHMpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zZXQodGFzaywgcHJvZ3Jlc3MpO1xuICAgICAgICByZXR1cm4gcHJvZ3Jlc3M7XG4gICAgfVxuICAgIGZhdGFsKGVycikge1xuICAgICAgICBmb3IgKGNvbnN0IFt0YXNrLCB7IGxvZ2dlciB9XSBvZiBBcnJheS5mcm9tKHRoaXMuX3F1ZXVlLmVudHJpZXMoKSkpIHtcbiAgICAgICAgICAgIGlmICh0YXNrID09PSBlcnIudGFzaykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBGYWlsZWQgJW9gLCBlcnIpO1xuICAgICAgICAgICAgICAgIGxvZ2dlcihgRmF0YWwgZXhjZXB0aW9uLCBhbnkgYXMteWV0IHVuLXN0YXJ0ZWQgdGFza3MgcnVuIHRocm91Z2ggdGhpcyBleGVjdXRvciB3aWxsIG5vdCBiZSBhdHRlbXB0ZWRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBBIGZhdGFsIGV4Y2VwdGlvbiBvY2N1cnJlZCBpbiBhIHByZXZpb3VzIHRhc2ssIHRoZSBxdWV1ZSBoYXMgYmVlbiBwdXJnZWQ6ICVvYCwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb21wbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcXVldWUuc2l6ZSAhPT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBRdWV1ZSBzaXplIHNob3VsZCBiZSB6ZXJvIGFmdGVyIGZhdGFsOiAke3RoaXMuX3F1ZXVlLnNpemV9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcGxldGUodGFzaykge1xuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHRoaXMud2l0aFByb2dyZXNzKHRhc2spO1xuICAgICAgICBpZiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXVlLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhdHRlbXB0KHRhc2spIHtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB0aGlzLndpdGhQcm9ncmVzcyh0YXNrKTtcbiAgICAgICAgaWYgKCFwcm9ncmVzcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IGdpdF9lcnJvcl8xLkdpdEVycm9yKHVuZGVmaW5lZCwgJ1Rhc2tzUGVuZGluZ1F1ZXVlOiBhdHRlbXB0IGNhbGxlZCBmb3IgYW4gdW5rbm93biB0YXNrJyk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvZ3Jlc3MubG9nZ2VyKCdTdGFydGluZyB0YXNrJyk7XG4gICAgICAgIHJldHVybiBwcm9ncmVzcztcbiAgICB9XG4gICAgc3RhdGljIGdldE5hbWUobmFtZSA9ICdlbXB0eScpIHtcbiAgICAgICAgcmV0dXJuIGB0YXNrOiR7bmFtZX06JHsrK1Rhc2tzUGVuZGluZ1F1ZXVlLmNvdW50ZXJ9YDtcbiAgICB9XG59XG5leHBvcnRzLlRhc2tzUGVuZGluZ1F1ZXVlID0gVGFza3NQZW5kaW5nUXVldWU7XG5UYXNrc1BlbmRpbmdRdWV1ZS5jb3VudGVyID0gMDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhc2tzLXBlbmRpbmctcXVldWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2l0RXhlY3V0b3JDaGFpbiA9IHZvaWQgMDtcbmNvbnN0IGNoaWxkX3Byb2Nlc3NfMSA9IHJlcXVpcmUoXCJjaGlsZF9wcm9jZXNzXCIpO1xuY29uc3QgZ2l0X2Vycm9yXzEgPSByZXF1aXJlKFwiLi4vZXJyb3JzL2dpdC1lcnJvclwiKTtcbmNvbnN0IHRhc2tfMSA9IHJlcXVpcmUoXCIuLi90YXNrcy90YXNrXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IHRhc2tzX3BlbmRpbmdfcXVldWVfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzLXBlbmRpbmctcXVldWVcIik7XG5jbGFzcyBHaXRFeGVjdXRvckNoYWluIHtcbiAgICBjb25zdHJ1Y3RvcihfZXhlY3V0b3IsIF9zY2hlZHVsZXIsIF9wbHVnaW5zKSB7XG4gICAgICAgIHRoaXMuX2V4ZWN1dG9yID0gX2V4ZWN1dG9yO1xuICAgICAgICB0aGlzLl9zY2hlZHVsZXIgPSBfc2NoZWR1bGVyO1xuICAgICAgICB0aGlzLl9wbHVnaW5zID0gX3BsdWdpbnM7XG4gICAgICAgIHRoaXMuX2NoYWluID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHRoaXMuX3F1ZXVlID0gbmV3IHRhc2tzX3BlbmRpbmdfcXVldWVfMS5UYXNrc1BlbmRpbmdRdWV1ZSgpO1xuICAgIH1cbiAgICBnZXQgYmluYXJ5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXhlY3V0b3IuYmluYXJ5O1xuICAgIH1cbiAgICBnZXQgY3dkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3dkIHx8IHRoaXMuX2V4ZWN1dG9yLmN3ZDtcbiAgICB9XG4gICAgc2V0IGN3ZChjd2QpIHtcbiAgICAgICAgdGhpcy5fY3dkID0gY3dkO1xuICAgIH1cbiAgICBnZXQgZW52KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXhlY3V0b3IuZW52O1xuICAgIH1cbiAgICBnZXQgb3V0cHV0SGFuZGxlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V4ZWN1dG9yLm91dHB1dEhhbmRsZXI7XG4gICAgfVxuICAgIGNoYWluKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcHVzaCh0YXNrKSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlLnB1c2godGFzayk7XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGFpbiA9IHRoaXMuX2NoYWluLnRoZW4oKCkgPT4gdGhpcy5hdHRlbXB0VGFzayh0YXNrKSk7XG4gICAgfVxuICAgIGF0dGVtcHRUYXNrKHRhc2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IG9uU2NoZWR1bGVDb21wbGV0ZSA9IHlpZWxkIHRoaXMuX3NjaGVkdWxlci5uZXh0KCk7XG4gICAgICAgICAgICBjb25zdCBvblF1ZXVlQ29tcGxldGUgPSAoKSA9PiB0aGlzLl9xdWV1ZS5jb21wbGV0ZSh0YXNrKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBsb2dnZXIgfSA9IHRoaXMuX3F1ZXVlLmF0dGVtcHQodGFzayk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkICh0YXNrXzEuaXNFbXB0eVRhc2sodGFzaylcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmF0dGVtcHRFbXB0eVRhc2sodGFzaywgbG9nZ2VyKVxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuYXR0ZW1wdFJlbW90ZVRhc2sodGFzaywgbG9nZ2VyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRocm93IHRoaXMub25GYXRhbEV4Y2VwdGlvbih0YXNrLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIG9uUXVldWVDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIG9uU2NoZWR1bGVDb21wbGV0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25GYXRhbEV4Y2VwdGlvbih0YXNrLCBlKSB7XG4gICAgICAgIGNvbnN0IGdpdEVycm9yID0gKGUgaW5zdGFuY2VvZiBnaXRfZXJyb3JfMS5HaXRFcnJvcikgPyBPYmplY3QuYXNzaWduKGUsIHsgdGFzayB9KSA6IG5ldyBnaXRfZXJyb3JfMS5HaXRFcnJvcih0YXNrLCBlICYmIFN0cmluZyhlKSk7XG4gICAgICAgIHRoaXMuX2NoYWluID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHRoaXMuX3F1ZXVlLmZhdGFsKGdpdEVycm9yKTtcbiAgICAgICAgcmV0dXJuIGdpdEVycm9yO1xuICAgIH1cbiAgICBhdHRlbXB0UmVtb3RlVGFzayh0YXNrLCBsb2dnZXIpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLl9wbHVnaW5zLmV4ZWMoJ3NwYXduLmFyZ3MnLCBbLi4udGFzay5jb21tYW5kc10sIHBsdWdpbkNvbnRleHQodGFzaywgdGFzay5jb21tYW5kcykpO1xuICAgICAgICAgICAgY29uc3QgcmF3ID0geWllbGQgdGhpcy5naXRSZXNwb25zZSh0YXNrLCB0aGlzLmJpbmFyeSwgYXJncywgdGhpcy5vdXRwdXRIYW5kbGVyLCBsb2dnZXIuc3RlcCgnU1BBV04nKSk7XG4gICAgICAgICAgICBjb25zdCBvdXRwdXRTdHJlYW1zID0geWllbGQgdGhpcy5oYW5kbGVUYXNrRGF0YSh0YXNrLCBhcmdzLCByYXcsIGxvZ2dlci5zdGVwKCdIQU5ETEUnKSk7XG4gICAgICAgICAgICBsb2dnZXIoYHBhc3NpbmcgcmVzcG9uc2UgdG8gdGFzaydzIHBhcnNlciBhcyBhICVzYCwgdGFzay5mb3JtYXQpO1xuICAgICAgICAgICAgaWYgKHRhc2tfMS5pc0J1ZmZlclRhc2sodGFzaykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXRpbHNfMS5jYWxsVGFza1BhcnNlcih0YXNrLnBhcnNlciwgb3V0cHV0U3RyZWFtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdXRpbHNfMS5jYWxsVGFza1BhcnNlcih0YXNrLnBhcnNlciwgb3V0cHV0U3RyZWFtcy5hc1N0cmluZ3MoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhdHRlbXB0RW1wdHlUYXNrKHRhc2ssIGxvZ2dlcikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgbG9nZ2VyKGBlbXB0eSB0YXNrIGJ5cGFzc2luZyBjaGlsZCBwcm9jZXNzIHRvIGNhbGwgdG8gdGFzaydzIHBhcnNlcmApO1xuICAgICAgICAgICAgcmV0dXJuIHRhc2sucGFyc2VyKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlVGFza0RhdGEodGFzaywgYXJncywgcmVzdWx0LCBsb2dnZXIpIHtcbiAgICAgICAgY29uc3QgeyBleGl0Q29kZSwgcmVqZWN0aW9uLCBzdGRPdXQsIHN0ZEVyciB9ID0gcmVzdWx0O1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGRvbmUsIGZhaWwpID0+IHtcbiAgICAgICAgICAgIGxvZ2dlcihgUHJlcGFyaW5nIHRvIGhhbmRsZSBwcm9jZXNzIHJlc3BvbnNlIGV4aXRDb2RlPSVkIHN0ZE91dD1gLCBleGl0Q29kZSk7XG4gICAgICAgICAgICBjb25zdCB7IGVycm9yIH0gPSB0aGlzLl9wbHVnaW5zLmV4ZWMoJ3Rhc2suZXJyb3InLCB7IGVycm9yOiByZWplY3Rpb24gfSwgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBwbHVnaW5Db250ZXh0KHRhc2ssIGFyZ3MpKSwgcmVzdWx0KSk7XG4gICAgICAgICAgICBpZiAoZXJyb3IgJiYgdGFzay5vbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYGV4aXRDb2RlPSVzIGhhbmRsaW5nIHdpdGggY3VzdG9tIGVycm9yIGhhbmRsZXJgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFzay5vbkVycm9yKHJlc3VsdCwgZXJyb3IsIChuZXdTdGRPdXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYGN1c3RvbSBlcnJvciBoYW5kbGVyIHRyZWF0ZWQgYXMgc3VjY2Vzc2ApO1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIoYGN1c3RvbSBlcnJvciByZXR1cm5lZCBhICVzYCwgdXRpbHNfMS5vYmplY3RUb1N0cmluZyhuZXdTdGRPdXQpKTtcbiAgICAgICAgICAgICAgICAgICAgZG9uZShuZXcgdXRpbHNfMS5HaXRPdXRwdXRTdHJlYW1zKEFycmF5LmlzQXJyYXkobmV3U3RkT3V0KSA/IEJ1ZmZlci5jb25jYXQobmV3U3RkT3V0KSA6IG5ld1N0ZE91dCwgQnVmZmVyLmNvbmNhdChzdGRFcnIpKSk7XG4gICAgICAgICAgICAgICAgfSwgZmFpbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgaGFuZGxpbmcgYXMgZXJyb3I6IGV4aXRDb2RlPSVzIHN0ZEVycj0lcyByZWplY3Rpb249JW9gLCBleGl0Q29kZSwgc3RkRXJyLmxlbmd0aCwgcmVqZWN0aW9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFpbChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgcmV0cmlldmluZyB0YXNrIG91dHB1dCBjb21wbGV0ZWApO1xuICAgICAgICAgICAgZG9uZShuZXcgdXRpbHNfMS5HaXRPdXRwdXRTdHJlYW1zKEJ1ZmZlci5jb25jYXQoc3RkT3V0KSwgQnVmZmVyLmNvbmNhdChzdGRFcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnaXRSZXNwb25zZSh0YXNrLCBjb21tYW5kLCBhcmdzLCBvdXRwdXRIYW5kbGVyLCBsb2dnZXIpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IG91dHB1dExvZ2dlciA9IGxvZ2dlci5zaWJsaW5nKCdvdXRwdXQnKTtcbiAgICAgICAgICAgIGNvbnN0IHNwYXduT3B0aW9ucyA9IHRoaXMuX3BsdWdpbnMuZXhlYygnc3Bhd24ub3B0aW9ucycsIHtcbiAgICAgICAgICAgICAgICBjd2Q6IHRoaXMuY3dkLFxuICAgICAgICAgICAgICAgIGVudjogdGhpcy5lbnYsXG4gICAgICAgICAgICAgICAgd2luZG93c0hpZGU6IHRydWUsXG4gICAgICAgICAgICB9LCBwbHVnaW5Db250ZXh0KHRhc2ssIHRhc2suY29tbWFuZHMpKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoZG9uZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZE91dCA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZEVyciA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCBhdHRlbXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgcmVqZWN0aW9uO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGF0dGVtcHRDbG9zZShleGl0Q29kZSwgZXZlbnQgPSAncmV0cnknKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNsb3Npbmcgd2hlbiB0aGVyZSBpcyBjb250ZW50LCB0ZXJtaW5hdGUgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGVtcHRlZCB8fCBzdGRFcnIubGVuZ3RoIHx8IHN0ZE91dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBleGl0Q29kZT0lcyBldmVudD0lcyByZWplY3Rpb249JW9gLCBleGl0Q29kZSwgZXZlbnQsIHJlamVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGRPdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RkRXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXRDb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ZW1wdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBmaXJzdCBhdHRlbXB0IGF0IGNsb3NpbmcgYnV0IG5vIGNvbnRlbnQgeWV0LCB3YWl0IGJyaWVmbHkgZm9yIHRoZSBjbG9zZS9leGl0IHRoYXQgbWF5IGZvbGxvd1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWF0dGVtcHRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ZW1wdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gYXR0ZW1wdENsb3NlKGV4aXRDb2RlLCAnZGVmZXJyZWQnKSwgNTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyKCdyZWNlaXZlZCAlcyBldmVudCBiZWZvcmUgY29udGVudCBvbiBzdGRPdXQvc3RkRXJyJywgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAlcyAlb2AsIGNvbW1hbmQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGxvZ2dlcignJU8nLCBzcGF3bk9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNwYXduZWQgPSBjaGlsZF9wcm9jZXNzXzEuc3Bhd24oY29tbWFuZCwgYXJncywgc3Bhd25PcHRpb25zKTtcbiAgICAgICAgICAgICAgICBzcGF3bmVkLnN0ZG91dC5vbignZGF0YScsIG9uRGF0YVJlY2VpdmVkKHN0ZE91dCwgJ3N0ZE91dCcsIGxvZ2dlciwgb3V0cHV0TG9nZ2VyLnN0ZXAoJ3N0ZE91dCcpKSk7XG4gICAgICAgICAgICAgICAgc3Bhd25lZC5zdGRlcnIub24oJ2RhdGEnLCBvbkRhdGFSZWNlaXZlZChzdGRFcnIsICdzdGRFcnInLCBsb2dnZXIsIG91dHB1dExvZ2dlci5zdGVwKCdzdGRFcnInKSkpO1xuICAgICAgICAgICAgICAgIHNwYXduZWQub24oJ2Vycm9yJywgb25FcnJvclJlY2VpdmVkKHN0ZEVyciwgbG9nZ2VyKSk7XG4gICAgICAgICAgICAgICAgc3Bhd25lZC5vbignY2xvc2UnLCAoY29kZSkgPT4gYXR0ZW1wdENsb3NlKGNvZGUsICdjbG9zZScpKTtcbiAgICAgICAgICAgICAgICBzcGF3bmVkLm9uKCdleGl0JywgKGNvZGUpID0+IGF0dGVtcHRDbG9zZShjb2RlLCAnZXhpdCcpKTtcbiAgICAgICAgICAgICAgICBpZiAob3V0cHV0SGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIoYFBhc3NpbmcgY2hpbGQgcHJvY2VzcyBzdGRPdXQvc3RkRXJyIHRvIGN1c3RvbSBvdXRwdXRIYW5kbGVyYCk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEhhbmRsZXIoY29tbWFuZCwgc3Bhd25lZC5zdGRvdXQsIHNwYXduZWQuc3RkZXJyLCBbLi4uYXJnc10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9wbHVnaW5zLmV4ZWMoJ3NwYXduLmFmdGVyJywgdW5kZWZpbmVkLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHBsdWdpbkNvbnRleHQodGFzaywgYXJncykpLCB7IHNwYXduZWQsIGtpbGwocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Bhd25lZC5raWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3Rpb24gPSByZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGF3bmVkLmtpbGwoJ1NJR0lOVCcpO1xuICAgICAgICAgICAgICAgICAgICB9IH0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkdpdEV4ZWN1dG9yQ2hhaW4gPSBHaXRFeGVjdXRvckNoYWluO1xuZnVuY3Rpb24gcGx1Z2luQ29udGV4dCh0YXNrLCBjb21tYW5kcykge1xuICAgIHJldHVybiB7XG4gICAgICAgIG1ldGhvZDogdXRpbHNfMS5maXJzdCh0YXNrLmNvbW1hbmRzKSB8fCAnJyxcbiAgICAgICAgY29tbWFuZHMsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIG9uRXJyb3JSZWNlaXZlZCh0YXJnZXQsIGxvZ2dlcikge1xuICAgIHJldHVybiAoZXJyKSA9PiB7XG4gICAgICAgIGxvZ2dlcihgW0VSUk9SXSBjaGlsZCBwcm9jZXNzIGV4Y2VwdGlvbiAlb2AsIGVycik7XG4gICAgICAgIHRhcmdldC5wdXNoKEJ1ZmZlci5mcm9tKFN0cmluZyhlcnIuc3RhY2spLCAnYXNjaWknKSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG9uRGF0YVJlY2VpdmVkKHRhcmdldCwgbmFtZSwgbG9nZ2VyLCBvdXRwdXQpIHtcbiAgICByZXR1cm4gKGJ1ZmZlcikgPT4ge1xuICAgICAgICBsb2dnZXIoYCVzIHJlY2VpdmVkICVMIGJ5dGVzYCwgbmFtZSwgYnVmZmVyKTtcbiAgICAgICAgb3V0cHV0KGAlQmAsIGJ1ZmZlcik7XG4gICAgICAgIHRhcmdldC5wdXNoKGJ1ZmZlcik7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdpdC1leGVjdXRvci1jaGFpbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2l0RXhlY3V0b3IgPSB2b2lkIDA7XG5jb25zdCBnaXRfZXhlY3V0b3JfY2hhaW5fMSA9IHJlcXVpcmUoXCIuL2dpdC1leGVjdXRvci1jaGFpblwiKTtcbmNsYXNzIEdpdEV4ZWN1dG9yIHtcbiAgICBjb25zdHJ1Y3RvcihiaW5hcnkgPSAnZ2l0JywgY3dkLCBfc2NoZWR1bGVyLCBfcGx1Z2lucykge1xuICAgICAgICB0aGlzLmJpbmFyeSA9IGJpbmFyeTtcbiAgICAgICAgdGhpcy5jd2QgPSBjd2Q7XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlciA9IF9zY2hlZHVsZXI7XG4gICAgICAgIHRoaXMuX3BsdWdpbnMgPSBfcGx1Z2lucztcbiAgICAgICAgdGhpcy5fY2hhaW4gPSBuZXcgZ2l0X2V4ZWN1dG9yX2NoYWluXzEuR2l0RXhlY3V0b3JDaGFpbih0aGlzLCB0aGlzLl9zY2hlZHVsZXIsIHRoaXMuX3BsdWdpbnMpO1xuICAgIH1cbiAgICBjaGFpbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBnaXRfZXhlY3V0b3JfY2hhaW5fMS5HaXRFeGVjdXRvckNoYWluKHRoaXMsIHRoaXMuX3NjaGVkdWxlciwgdGhpcy5fcGx1Z2lucyk7XG4gICAgfVxuICAgIHB1c2godGFzaykge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hhaW4ucHVzaCh0YXNrKTtcbiAgICB9XG59XG5leHBvcnRzLkdpdEV4ZWN1dG9yID0gR2l0RXhlY3V0b3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1naXQtZXhlY3V0b3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnRhc2tDYWxsYmFjayA9IHZvaWQgMDtcbmNvbnN0IGdpdF9yZXNwb25zZV9lcnJvcl8xID0gcmVxdWlyZShcIi4vZXJyb3JzL2dpdC1yZXNwb25zZS1lcnJvclwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmZ1bmN0aW9uIHRhc2tDYWxsYmFjayh0YXNrLCByZXNwb25zZSwgY2FsbGJhY2sgPSB1dGlsc18xLk5PT1ApIHtcbiAgICBjb25zdCBvblN1Y2Nlc3MgPSAoZGF0YSkgPT4ge1xuICAgICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgIGlmICgoZXJyID09PSBudWxsIHx8IGVyciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXJyLnRhc2spID09PSB0YXNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygoZXJyIGluc3RhbmNlb2YgZ2l0X3Jlc3BvbnNlX2Vycm9yXzEuR2l0UmVzcG9uc2VFcnJvcikgPyBhZGREZXByZWNhdGlvbk5vdGljZVRvRXJyb3IoZXJyKSA6IGVyciwgdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmVzcG9uc2UudGhlbihvblN1Y2Nlc3MsIG9uRXJyb3IpO1xufVxuZXhwb3J0cy50YXNrQ2FsbGJhY2sgPSB0YXNrQ2FsbGJhY2s7XG5mdW5jdGlvbiBhZGREZXByZWNhdGlvbk5vdGljZVRvRXJyb3IoZXJyKSB7XG4gICAgbGV0IGxvZyA9IChuYW1lKSA9PiB7XG4gICAgICAgIGNvbnNvbGUud2Fybihgc2ltcGxlLWdpdCBkZXByZWNhdGlvbiBub3RpY2U6IGFjY2Vzc2luZyBHaXRSZXNwb25zZUVycm9yLiR7bmFtZX0gc2hvdWxkIGJlIEdpdFJlc3BvbnNlRXJyb3IuZ2l0LiR7bmFtZX0sIHRoaXMgd2lsbCBubyBsb25nZXIgYmUgYXZhaWxhYmxlIGluIHZlcnNpb24gM2ApO1xuICAgICAgICBsb2cgPSB1dGlsc18xLk5PT1A7XG4gICAgfTtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShlcnIsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGVyci5naXQpLnJlZHVjZShkZXNjcmlwdG9yUmVkdWNlciwge30pKTtcbiAgICBmdW5jdGlvbiBkZXNjcmlwdG9yUmVkdWNlcihhbGwsIG5hbWUpIHtcbiAgICAgICAgaWYgKG5hbWUgaW4gZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gYWxsO1xuICAgICAgICB9XG4gICAgICAgIGFsbFtuYW1lXSA9IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICBsb2cobmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVyci5naXRbbmFtZV07XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYWxsO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhc2stY2FsbGJhY2suanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNoYW5nZVdvcmtpbmdEaXJlY3RvcnlUYXNrID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IHRhc2tfMSA9IHJlcXVpcmUoXCIuL3Rhc2tcIik7XG5mdW5jdGlvbiBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5VGFzayhkaXJlY3RvcnksIHJvb3QpIHtcbiAgICByZXR1cm4gdGFza18xLmFkaG9jRXhlY1Rhc2soKGluc3RhbmNlKSA9PiB7XG4gICAgICAgIGlmICghdXRpbHNfMS5mb2xkZXJFeGlzdHMoZGlyZWN0b3J5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBHaXQuY3dkOiBjYW5ub3QgY2hhbmdlIHRvIG5vbi1kaXJlY3RvcnkgXCIke2RpcmVjdG9yeX1cImApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoKHJvb3QgfHwgaW5zdGFuY2UpLmN3ZCA9IGRpcmVjdG9yeSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmNoYW5nZVdvcmtpbmdEaXJlY3RvcnlUYXNrID0gY2hhbmdlV29ya2luZ0RpcmVjdG9yeVRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jaGFuZ2Utd29ya2luZy1kaXJlY3RvcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhc2hPYmplY3RUYXNrID0gdm9pZCAwO1xuY29uc3QgdGFza18xID0gcmVxdWlyZShcIi4vdGFza1wiKTtcbi8qKlxuICogVGFzayB1c2VkIGJ5IGBnaXQuaGFzaE9iamVjdGBcbiAqL1xuZnVuY3Rpb24gaGFzaE9iamVjdFRhc2soZmlsZVBhdGgsIHdyaXRlKSB7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ2hhc2gtb2JqZWN0JywgZmlsZVBhdGhdO1xuICAgIGlmICh3cml0ZSkge1xuICAgICAgICBjb21tYW5kcy5wdXNoKCctdycpO1xuICAgIH1cbiAgICByZXR1cm4gdGFza18xLnN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soY29tbWFuZHMsIHRydWUpO1xufVxuZXhwb3J0cy5oYXNoT2JqZWN0VGFzayA9IGhhc2hPYmplY3RUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFzaC1vYmplY3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlSW5pdCA9IGV4cG9ydHMuSW5pdFN1bW1hcnkgPSB2b2lkIDA7XG5jbGFzcyBJbml0U3VtbWFyeSB7XG4gICAgY29uc3RydWN0b3IoYmFyZSwgcGF0aCwgZXhpc3RpbmcsIGdpdERpcikge1xuICAgICAgICB0aGlzLmJhcmUgPSBiYXJlO1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLmV4aXN0aW5nID0gZXhpc3Rpbmc7XG4gICAgICAgIHRoaXMuZ2l0RGlyID0gZ2l0RGlyO1xuICAgIH1cbn1cbmV4cG9ydHMuSW5pdFN1bW1hcnkgPSBJbml0U3VtbWFyeTtcbmNvbnN0IGluaXRSZXNwb25zZVJlZ2V4ID0gL15Jbml0LisgcmVwb3NpdG9yeSBpbiAoLispJC87XG5jb25zdCByZUluaXRSZXNwb25zZVJlZ2V4ID0gL15SZWluLisgaW4gKC4rKSQvO1xuZnVuY3Rpb24gcGFyc2VJbml0KGJhcmUsIHBhdGgsIHRleHQpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IFN0cmluZyh0ZXh0KS50cmltKCk7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAoKHJlc3VsdCA9IGluaXRSZXNwb25zZVJlZ2V4LmV4ZWMocmVzcG9uc2UpKSkge1xuICAgICAgICByZXR1cm4gbmV3IEluaXRTdW1tYXJ5KGJhcmUsIHBhdGgsIGZhbHNlLCByZXN1bHRbMV0pO1xuICAgIH1cbiAgICBpZiAoKHJlc3VsdCA9IHJlSW5pdFJlc3BvbnNlUmVnZXguZXhlYyhyZXNwb25zZSkpKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5pdFN1bW1hcnkoYmFyZSwgcGF0aCwgdHJ1ZSwgcmVzdWx0WzFdKTtcbiAgICB9XG4gICAgbGV0IGdpdERpciA9ICcnO1xuICAgIGNvbnN0IHRva2VucyA9IHJlc3BvbnNlLnNwbGl0KCcgJyk7XG4gICAgd2hpbGUgKHRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnMuc2hpZnQoKTtcbiAgICAgICAgaWYgKHRva2VuID09PSAnaW4nKSB7XG4gICAgICAgICAgICBnaXREaXIgPSB0b2tlbnMuam9pbignICcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbml0U3VtbWFyeShiYXJlLCBwYXRoLCAvXnJlL2kudGVzdChyZXNwb25zZSksIGdpdERpcik7XG59XG5leHBvcnRzLnBhcnNlSW5pdCA9IHBhcnNlSW5pdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUluaXRTdW1tYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pbml0VGFzayA9IHZvaWQgMDtcbmNvbnN0IEluaXRTdW1tYXJ5XzEgPSByZXF1aXJlKFwiLi4vcmVzcG9uc2VzL0luaXRTdW1tYXJ5XCIpO1xuY29uc3QgYmFyZUNvbW1hbmQgPSAnLS1iYXJlJztcbmZ1bmN0aW9uIGhhc0JhcmVDb21tYW5kKGNvbW1hbmQpIHtcbiAgICByZXR1cm4gY29tbWFuZC5pbmNsdWRlcyhiYXJlQ29tbWFuZCk7XG59XG5mdW5jdGlvbiBpbml0VGFzayhiYXJlID0gZmFsc2UsIHBhdGgsIGN1c3RvbUFyZ3MpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsnaW5pdCcsIC4uLmN1c3RvbUFyZ3NdO1xuICAgIGlmIChiYXJlICYmICFoYXNCYXJlQ29tbWFuZChjb21tYW5kcykpIHtcbiAgICAgICAgY29tbWFuZHMuc3BsaWNlKDEsIDAsIGJhcmVDb21tYW5kKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHMsXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgcGFyc2VyKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBJbml0U3VtbWFyeV8xLnBhcnNlSW5pdChjb21tYW5kcy5pbmNsdWRlcygnLS1iYXJlJyksIHBhdGgsIHRleHQpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuaW5pdFRhc2sgPSBpbml0VGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluaXQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRpZmZTdW1tYXJ5ID0gdm9pZCAwO1xuLyoqKlxuICogVGhlIERpZmZTdW1tYXJ5IGlzIHJldHVybmVkIGFzIGEgcmVzcG9uc2UgdG8gZ2V0dGluZyBgZ2l0KCkuc3RhdHVzKClgXG4gKi9cbmNsYXNzIERpZmZTdW1tYXJ5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VkID0gMDtcbiAgICAgICAgdGhpcy5kZWxldGlvbnMgPSAwO1xuICAgICAgICB0aGlzLmluc2VydGlvbnMgPSAwO1xuICAgICAgICB0aGlzLmZpbGVzID0gW107XG4gICAgfVxufVxuZXhwb3J0cy5EaWZmU3VtbWFyeSA9IERpZmZTdW1tYXJ5O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RGlmZlN1bW1hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlRGlmZlJlc3VsdCA9IHZvaWQgMDtcbmNvbnN0IERpZmZTdW1tYXJ5XzEgPSByZXF1aXJlKFwiLi4vcmVzcG9uc2VzL0RpZmZTdW1tYXJ5XCIpO1xuZnVuY3Rpb24gcGFyc2VEaWZmUmVzdWx0KHN0ZE91dCkge1xuICAgIGNvbnN0IGxpbmVzID0gc3RkT3V0LnRyaW0oKS5zcGxpdCgnXFxuJyk7XG4gICAgY29uc3Qgc3RhdHVzID0gbmV3IERpZmZTdW1tYXJ5XzEuRGlmZlN1bW1hcnkoKTtcbiAgICByZWFkU3VtbWFyeUxpbmUoc3RhdHVzLCBsaW5lcy5wb3AoKSk7XG4gICAgZm9yIChsZXQgaSA9IDAsIG1heCA9IGxpbmVzLmxlbmd0aDsgaSA8IG1heDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXTtcbiAgICAgICAgdGV4dEZpbGVDaGFuZ2UobGluZSwgc3RhdHVzKSB8fCBiaW5hcnlGaWxlQ2hhbmdlKGxpbmUsIHN0YXR1cyk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0dXM7XG59XG5leHBvcnRzLnBhcnNlRGlmZlJlc3VsdCA9IHBhcnNlRGlmZlJlc3VsdDtcbmZ1bmN0aW9uIHJlYWRTdW1tYXJ5TGluZShzdGF0dXMsIHN1bW1hcnkpIHtcbiAgICAoc3VtbWFyeSB8fCAnJylcbiAgICAgICAgLnRyaW0oKVxuICAgICAgICAuc3BsaXQoJywgJylcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgICAgY29uc3Qgc3VtbWFyeSA9IC8oXFxkKylcXHMoW2Etel0rKS8uZXhlYyh0ZXh0KTtcbiAgICAgICAgaWYgKCFzdW1tYXJ5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3VtbWFyeVR5cGUoc3RhdHVzLCBzdW1tYXJ5WzJdLCBwYXJzZUludChzdW1tYXJ5WzFdLCAxMCkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gc3VtbWFyeVR5cGUoc3RhdHVzLCBrZXksIHZhbHVlKSB7XG4gICAgY29uc3QgbWF0Y2ggPSAoLyhbYS16XSs/KXM/XFxiLy5leGVjKGtleSkpO1xuICAgIGlmICghbWF0Y2ggfHwgIXN0YXR1c1VwZGF0ZVttYXRjaFsxXV0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdGF0dXNVcGRhdGVbbWF0Y2hbMV1dKHN0YXR1cywgdmFsdWUpO1xufVxuY29uc3Qgc3RhdHVzVXBkYXRlID0ge1xuICAgIGZpbGUoc3RhdHVzLCB2YWx1ZSkge1xuICAgICAgICBzdGF0dXMuY2hhbmdlZCA9IHZhbHVlO1xuICAgIH0sXG4gICAgZGVsZXRpb24oc3RhdHVzLCB2YWx1ZSkge1xuICAgICAgICBzdGF0dXMuZGVsZXRpb25zID0gdmFsdWU7XG4gICAgfSxcbiAgICBpbnNlcnRpb24oc3RhdHVzLCB2YWx1ZSkge1xuICAgICAgICBzdGF0dXMuaW5zZXJ0aW9ucyA9IHZhbHVlO1xuICAgIH1cbn07XG5mdW5jdGlvbiB0ZXh0RmlsZUNoYW5nZShpbnB1dCwgeyBmaWxlcyB9KSB7XG4gICAgY29uc3QgbGluZSA9IGlucHV0LnRyaW0oKS5tYXRjaCgvXiguKylcXHMrXFx8XFxzKyhcXGQrKShcXHMrWytcXC1dKyk/JC8pO1xuICAgIGlmIChsaW5lKSB7XG4gICAgICAgIHZhciBhbHRlcmF0aW9ucyA9IChsaW5lWzNdIHx8ICcnKS50cmltKCk7XG4gICAgICAgIGZpbGVzLnB1c2goe1xuICAgICAgICAgICAgZmlsZTogbGluZVsxXS50cmltKCksXG4gICAgICAgICAgICBjaGFuZ2VzOiBwYXJzZUludChsaW5lWzJdLCAxMCksXG4gICAgICAgICAgICBpbnNlcnRpb25zOiBhbHRlcmF0aW9ucy5yZXBsYWNlKC8tL2csICcnKS5sZW5ndGgsXG4gICAgICAgICAgICBkZWxldGlvbnM6IGFsdGVyYXRpb25zLnJlcGxhY2UoL1xcKy9nLCAnJykubGVuZ3RoLFxuICAgICAgICAgICAgYmluYXJ5OiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGJpbmFyeUZpbGVDaGFuZ2UoaW5wdXQsIHsgZmlsZXMgfSkge1xuICAgIGNvbnN0IGxpbmUgPSBpbnB1dC5tYXRjaCgvXiguKykgXFx8XFxzK0JpbiAoWzAtOS5dKykgLT4gKFswLTkuXSspIChbYS16XSspJC8pO1xuICAgIGlmIChsaW5lKSB7XG4gICAgICAgIGZpbGVzLnB1c2goe1xuICAgICAgICAgICAgZmlsZTogbGluZVsxXS50cmltKCksXG4gICAgICAgICAgICBiZWZvcmU6ICtsaW5lWzJdLFxuICAgICAgICAgICAgYWZ0ZXI6ICtsaW5lWzNdLFxuICAgICAgICAgICAgYmluYXJ5OiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtZGlmZi1zdW1tYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVMaXN0TG9nU3VtbWFyeVBhcnNlciA9IGV4cG9ydHMuU1BMSVRURVIgPSBleHBvcnRzLkNPTU1JVF9CT1VOREFSWSA9IGV4cG9ydHMuU1RBUlRfQk9VTkRBUlkgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgcGFyc2VfZGlmZl9zdW1tYXJ5XzEgPSByZXF1aXJlKFwiLi9wYXJzZS1kaWZmLXN1bW1hcnlcIik7XG5leHBvcnRzLlNUQVJUX0JPVU5EQVJZID0gJ8Oyw7LDssOyw7LDsiAnO1xuZXhwb3J0cy5DT01NSVRfQk9VTkRBUlkgPSAnIMOyw7InO1xuZXhwb3J0cy5TUExJVFRFUiA9ICcgw7IgJztcbmNvbnN0IGRlZmF1bHRGaWVsZE5hbWVzID0gWydoYXNoJywgJ2RhdGUnLCAnbWVzc2FnZScsICdyZWZzJywgJ2F1dGhvcl9uYW1lJywgJ2F1dGhvcl9lbWFpbCddO1xuZnVuY3Rpb24gbGluZUJ1aWxkZXIodG9rZW5zLCBmaWVsZHMpIHtcbiAgICByZXR1cm4gZmllbGRzLnJlZHVjZSgobGluZSwgZmllbGQsIGluZGV4KSA9PiB7XG4gICAgICAgIGxpbmVbZmllbGRdID0gdG9rZW5zW2luZGV4XSB8fCAnJztcbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfSwgT2JqZWN0LmNyZWF0ZSh7IGRpZmY6IG51bGwgfSkpO1xufVxuZnVuY3Rpb24gY3JlYXRlTGlzdExvZ1N1bW1hcnlQYXJzZXIoc3BsaXR0ZXIgPSBleHBvcnRzLlNQTElUVEVSLCBmaWVsZHMgPSBkZWZhdWx0RmllbGROYW1lcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoc3RkT3V0KSB7XG4gICAgICAgIGNvbnN0IGFsbCA9IHV0aWxzXzEudG9MaW5lc1dpdGhDb250ZW50KHN0ZE91dCwgdHJ1ZSwgZXhwb3J0cy5TVEFSVF9CT1VOREFSWSlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVEZXRhaWwgPSBpdGVtLnRyaW0oKS5zcGxpdChleHBvcnRzLkNPTU1JVF9CT1VOREFSWSk7XG4gICAgICAgICAgICBjb25zdCBsaXN0TG9nTGluZSA9IGxpbmVCdWlsZGVyKGxpbmVEZXRhaWxbMF0udHJpbSgpLnNwbGl0KHNwbGl0dGVyKSwgZmllbGRzKTtcbiAgICAgICAgICAgIGlmIChsaW5lRGV0YWlsLmxlbmd0aCA+IDEgJiYgISFsaW5lRGV0YWlsWzFdLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgIGxpc3RMb2dMaW5lLmRpZmYgPSBwYXJzZV9kaWZmX3N1bW1hcnlfMS5wYXJzZURpZmZSZXN1bHQobGluZURldGFpbFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbGlzdExvZ0xpbmU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsLFxuICAgICAgICAgICAgbGF0ZXN0OiBhbGwubGVuZ3RoICYmIGFsbFswXSB8fCBudWxsLFxuICAgICAgICAgICAgdG90YWw6IGFsbC5sZW5ndGgsXG4gICAgICAgIH07XG4gICAgfTtcbn1cbmV4cG9ydHMuY3JlYXRlTGlzdExvZ1N1bW1hcnlQYXJzZXIgPSBjcmVhdGVMaXN0TG9nU3VtbWFyeVBhcnNlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLWxpc3QtbG9nLXN1bW1hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmxvZ1Rhc2sgPSBleHBvcnRzLnBhcnNlTG9nT3B0aW9ucyA9IHZvaWQgMDtcbmNvbnN0IHBhcnNlX2xpc3RfbG9nX3N1bW1hcnlfMSA9IHJlcXVpcmUoXCIuLi9wYXJzZXJzL3BhcnNlLWxpc3QtbG9nLXN1bW1hcnlcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgdGFza18xID0gcmVxdWlyZShcIi4vdGFza1wiKTtcbnZhciBleGNsdWRlT3B0aW9ucztcbihmdW5jdGlvbiAoZXhjbHVkZU9wdGlvbnMpIHtcbiAgICBleGNsdWRlT3B0aW9uc1tleGNsdWRlT3B0aW9uc1tcIi0tcHJldHR5XCJdID0gMF0gPSBcIi0tcHJldHR5XCI7XG4gICAgZXhjbHVkZU9wdGlvbnNbZXhjbHVkZU9wdGlvbnNbXCJtYXgtY291bnRcIl0gPSAxXSA9IFwibWF4LWNvdW50XCI7XG4gICAgZXhjbHVkZU9wdGlvbnNbZXhjbHVkZU9wdGlvbnNbXCJtYXhDb3VudFwiXSA9IDJdID0gXCJtYXhDb3VudFwiO1xuICAgIGV4Y2x1ZGVPcHRpb25zW2V4Y2x1ZGVPcHRpb25zW1wiblwiXSA9IDNdID0gXCJuXCI7XG4gICAgZXhjbHVkZU9wdGlvbnNbZXhjbHVkZU9wdGlvbnNbXCJmaWxlXCJdID0gNF0gPSBcImZpbGVcIjtcbiAgICBleGNsdWRlT3B0aW9uc1tleGNsdWRlT3B0aW9uc1tcImZvcm1hdFwiXSA9IDVdID0gXCJmb3JtYXRcIjtcbiAgICBleGNsdWRlT3B0aW9uc1tleGNsdWRlT3B0aW9uc1tcImZyb21cIl0gPSA2XSA9IFwiZnJvbVwiO1xuICAgIGV4Y2x1ZGVPcHRpb25zW2V4Y2x1ZGVPcHRpb25zW1widG9cIl0gPSA3XSA9IFwidG9cIjtcbiAgICBleGNsdWRlT3B0aW9uc1tleGNsdWRlT3B0aW9uc1tcInNwbGl0dGVyXCJdID0gOF0gPSBcInNwbGl0dGVyXCI7XG4gICAgZXhjbHVkZU9wdGlvbnNbZXhjbHVkZU9wdGlvbnNbXCJzeW1tZXRyaWNcIl0gPSA5XSA9IFwic3ltbWV0cmljXCI7XG4gICAgZXhjbHVkZU9wdGlvbnNbZXhjbHVkZU9wdGlvbnNbXCJtdWx0aUxpbmVcIl0gPSAxMF0gPSBcIm11bHRpTGluZVwiO1xuICAgIGV4Y2x1ZGVPcHRpb25zW2V4Y2x1ZGVPcHRpb25zW1wic3RyaWN0RGF0ZVwiXSA9IDExXSA9IFwic3RyaWN0RGF0ZVwiO1xufSkoZXhjbHVkZU9wdGlvbnMgfHwgKGV4Y2x1ZGVPcHRpb25zID0ge30pKTtcbmZ1bmN0aW9uIHByZXR0eUZvcm1hdChmb3JtYXQsIHNwbGl0dGVyKSB7XG4gICAgY29uc3QgZmllbGRzID0gW107XG4gICAgY29uc3QgZm9ybWF0U3RyID0gW107XG4gICAgT2JqZWN0LmtleXMoZm9ybWF0KS5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICBmaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgIGZvcm1hdFN0ci5wdXNoKFN0cmluZyhmb3JtYXRbZmllbGRdKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgZmllbGRzLCBmb3JtYXRTdHIuam9pbihzcGxpdHRlcilcbiAgICBdO1xufVxuZnVuY3Rpb24gdXNlck9wdGlvbnMoaW5wdXQpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBPYmplY3QuYXNzaWduKHt9LCBpbnB1dCk7XG4gICAgT2JqZWN0LmtleXMoaW5wdXQpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaWYgKGtleSBpbiBleGNsdWRlT3B0aW9ucykge1xuICAgICAgICAgICAgZGVsZXRlIG91dHB1dFtrZXldO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cbmZ1bmN0aW9uIHBhcnNlTG9nT3B0aW9ucyhvcHQgPSB7fSwgY3VzdG9tQXJncyA9IFtdKSB7XG4gICAgY29uc3Qgc3BsaXR0ZXIgPSBvcHQuc3BsaXR0ZXIgfHwgcGFyc2VfbGlzdF9sb2dfc3VtbWFyeV8xLlNQTElUVEVSO1xuICAgIGNvbnN0IGZvcm1hdCA9IG9wdC5mb3JtYXQgfHwge1xuICAgICAgICBoYXNoOiAnJUgnLFxuICAgICAgICBkYXRlOiBvcHQuc3RyaWN0RGF0ZSA9PT0gZmFsc2UgPyAnJWFpJyA6ICclYUknLFxuICAgICAgICBtZXNzYWdlOiAnJXMnLFxuICAgICAgICByZWZzOiAnJUQnLFxuICAgICAgICBib2R5OiBvcHQubXVsdGlMaW5lID8gJyVCJyA6ICclYicsXG4gICAgICAgIGF1dGhvcl9uYW1lOiAnJWFOJyxcbiAgICAgICAgYXV0aG9yX2VtYWlsOiAnJWFlJ1xuICAgIH07XG4gICAgY29uc3QgW2ZpZWxkcywgZm9ybWF0U3RyXSA9IHByZXR0eUZvcm1hdChmb3JtYXQsIHNwbGl0dGVyKTtcbiAgICBjb25zdCBzdWZmaXggPSBbXTtcbiAgICBjb25zdCBjb21tYW5kID0gW1xuICAgICAgICBgLS1wcmV0dHk9Zm9ybWF0OiR7cGFyc2VfbGlzdF9sb2dfc3VtbWFyeV8xLlNUQVJUX0JPVU5EQVJZfSR7Zm9ybWF0U3RyfSR7cGFyc2VfbGlzdF9sb2dfc3VtbWFyeV8xLkNPTU1JVF9CT1VOREFSWX1gLFxuICAgICAgICAuLi5jdXN0b21BcmdzLFxuICAgIF07XG4gICAgY29uc3QgbWF4Q291bnQgPSBvcHQubiB8fCBvcHRbJ21heC1jb3VudCddIHx8IG9wdC5tYXhDb3VudDtcbiAgICBpZiAobWF4Q291bnQpIHtcbiAgICAgICAgY29tbWFuZC5wdXNoKGAtLW1heC1jb3VudD0ke21heENvdW50fWApO1xuICAgIH1cbiAgICBpZiAob3B0LmZyb20gJiYgb3B0LnRvKSB7XG4gICAgICAgIGNvbnN0IHJhbmdlT3BlcmF0b3IgPSAob3B0LnN5bW1ldHJpYyAhPT0gZmFsc2UpID8gJy4uLicgOiAnLi4nO1xuICAgICAgICBzdWZmaXgucHVzaChgJHtvcHQuZnJvbX0ke3JhbmdlT3BlcmF0b3J9JHtvcHQudG99YCk7XG4gICAgfVxuICAgIGlmIChvcHQuZmlsZSkge1xuICAgICAgICBzdWZmaXgucHVzaCgnLS1mb2xsb3cnLCBvcHQuZmlsZSk7XG4gICAgfVxuICAgIHV0aWxzXzEuYXBwZW5kVGFza09wdGlvbnModXNlck9wdGlvbnMob3B0KSwgY29tbWFuZCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmllbGRzLFxuICAgICAgICBzcGxpdHRlcixcbiAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgIC4uLmNvbW1hbmQsXG4gICAgICAgICAgICAuLi5zdWZmaXgsXG4gICAgICAgIF0sXG4gICAgfTtcbn1cbmV4cG9ydHMucGFyc2VMb2dPcHRpb25zID0gcGFyc2VMb2dPcHRpb25zO1xuZnVuY3Rpb24gbG9nVGFzayhzcGxpdHRlciwgZmllbGRzLCBjdXN0b21BcmdzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHM6IFsnbG9nJywgLi4uY3VzdG9tQXJnc10sXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgcGFyc2VyOiBwYXJzZV9saXN0X2xvZ19zdW1tYXJ5XzEuY3JlYXRlTGlzdExvZ1N1bW1hcnlQYXJzZXIoc3BsaXR0ZXIsIGZpZWxkcyksXG4gICAgfTtcbn1cbmV4cG9ydHMubG9nVGFzayA9IGxvZ1Rhc2s7XG5mdW5jdGlvbiBkZWZhdWx0XzEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbG9nKC4uLnJlc3QpIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSB1dGlsc18xLnRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpO1xuICAgICAgICAgICAgY29uc3QgdGFzayA9IHJlamVjdERlcHJlY2F0ZWRTaWduYXR1cmVzKC4uLnJlc3QpIHx8XG4gICAgICAgICAgICAgICAgY3JlYXRlTG9nVGFzayhwYXJzZUxvZ09wdGlvbnModXRpbHNfMS50cmFpbGluZ09wdGlvbnNBcmd1bWVudChhcmd1bWVudHMpLCB1dGlsc18xLmZpbHRlclR5cGUoYXJndW1lbnRzWzBdLCB1dGlsc18xLmZpbHRlckFycmF5KSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2sodGFzaywgbmV4dCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIGNyZWF0ZUxvZ1Rhc2sob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gbG9nVGFzayhvcHRpb25zLnNwbGl0dGVyLCBvcHRpb25zLmZpZWxkcywgb3B0aW9ucy5jb21tYW5kcyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlamVjdERlcHJlY2F0ZWRTaWduYXR1cmVzKGZyb20sIHRvKSB7XG4gICAgICAgIHJldHVybiAodXRpbHNfMS5maWx0ZXJTdHJpbmcoZnJvbSkgJiZcbiAgICAgICAgICAgIHV0aWxzXzEuZmlsdGVyU3RyaW5nKHRvKSAmJlxuICAgICAgICAgICAgdGFza18xLmNvbmZpZ3VyYXRpb25FcnJvclRhc2soYGdpdC5sb2coc3RyaW5nLCBzdHJpbmcpIHNob3VsZCBiZSByZXBsYWNlZCB3aXRoIGdpdC5sb2coeyBmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcgfSlgKSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gZGVmYXVsdF8xO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9nLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5NZXJnZVN1bW1hcnlEZXRhaWwgPSBleHBvcnRzLk1lcmdlU3VtbWFyeUNvbmZsaWN0ID0gdm9pZCAwO1xuY2xhc3MgTWVyZ2VTdW1tYXJ5Q29uZmxpY3Qge1xuICAgIGNvbnN0cnVjdG9yKHJlYXNvbiwgZmlsZSA9IG51bGwsIG1ldGEpIHtcbiAgICAgICAgdGhpcy5yZWFzb24gPSByZWFzb247XG4gICAgICAgIHRoaXMuZmlsZSA9IGZpbGU7XG4gICAgICAgIHRoaXMubWV0YSA9IG1ldGE7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5maWxlfToke3RoaXMucmVhc29ufWA7XG4gICAgfVxufVxuZXhwb3J0cy5NZXJnZVN1bW1hcnlDb25mbGljdCA9IE1lcmdlU3VtbWFyeUNvbmZsaWN0O1xuY2xhc3MgTWVyZ2VTdW1tYXJ5RGV0YWlsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jb25mbGljdHMgPSBbXTtcbiAgICAgICAgdGhpcy5tZXJnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5yZXN1bHQgPSAnc3VjY2Vzcyc7XG4gICAgfVxuICAgIGdldCBmYWlsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZsaWN0cy5sZW5ndGggPiAwO1xuICAgIH1cbiAgICBnZXQgcmVhc29uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHQ7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBpZiAodGhpcy5jb25mbGljdHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gYENPTkZMSUNUUzogJHt0aGlzLmNvbmZsaWN0cy5qb2luKCcsICcpfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdPSyc7XG4gICAgfVxufVxuZXhwb3J0cy5NZXJnZVN1bW1hcnlEZXRhaWwgPSBNZXJnZVN1bW1hcnlEZXRhaWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1NZXJnZVN1bW1hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlB1bGxTdW1tYXJ5ID0gdm9pZCAwO1xuY2xhc3MgUHVsbFN1bW1hcnkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJlbW90ZU1lc3NhZ2VzID0ge1xuICAgICAgICAgICAgYWxsOiBbXSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jcmVhdGVkID0gW107XG4gICAgICAgIHRoaXMuZGVsZXRlZCA9IFtdO1xuICAgICAgICB0aGlzLmZpbGVzID0gW107XG4gICAgICAgIHRoaXMuZGVsZXRpb25zID0ge307XG4gICAgICAgIHRoaXMuaW5zZXJ0aW9ucyA9IHt9O1xuICAgICAgICB0aGlzLnN1bW1hcnkgPSB7XG4gICAgICAgICAgICBjaGFuZ2VzOiAwLFxuICAgICAgICAgICAgZGVsZXRpb25zOiAwLFxuICAgICAgICAgICAgaW5zZXJ0aW9uczogMCxcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnRzLlB1bGxTdW1tYXJ5ID0gUHVsbFN1bW1hcnk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1QdWxsU3VtbWFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVtb3RlTWVzc2FnZXNPYmplY3RQYXJzZXJzID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmZ1bmN0aW9uIG9iamVjdEVudW1lcmF0aW9uUmVzdWx0KHJlbW90ZU1lc3NhZ2VzKSB7XG4gICAgcmV0dXJuIChyZW1vdGVNZXNzYWdlcy5vYmplY3RzID0gcmVtb3RlTWVzc2FnZXMub2JqZWN0cyB8fCB7XG4gICAgICAgIGNvbXByZXNzaW5nOiAwLFxuICAgICAgICBjb3VudGluZzogMCxcbiAgICAgICAgZW51bWVyYXRpbmc6IDAsXG4gICAgICAgIHBhY2tSZXVzZWQ6IDAsXG4gICAgICAgIHJldXNlZDogeyBjb3VudDogMCwgZGVsdGE6IDAgfSxcbiAgICAgICAgdG90YWw6IHsgY291bnQ6IDAsIGRlbHRhOiAwIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGFzT2JqZWN0Q291bnQoc291cmNlKSB7XG4gICAgY29uc3QgY291bnQgPSAvXlxccyooXFxkKykvLmV4ZWMoc291cmNlKTtcbiAgICBjb25zdCBkZWx0YSA9IC9kZWx0YSAoXFxkKykvaS5leGVjKHNvdXJjZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY291bnQ6IHV0aWxzXzEuYXNOdW1iZXIoY291bnQgJiYgY291bnRbMV0gfHwgJzAnKSxcbiAgICAgICAgZGVsdGE6IHV0aWxzXzEuYXNOdW1iZXIoZGVsdGEgJiYgZGVsdGFbMV0gfHwgJzAnKSxcbiAgICB9O1xufVxuZXhwb3J0cy5yZW1vdGVNZXNzYWdlc09iamVjdFBhcnNlcnMgPSBbXG4gICAgbmV3IHV0aWxzXzEuUmVtb3RlTGluZVBhcnNlcigvXnJlbW90ZTpcXHMqKGVudW1lcmF0aW5nfGNvdW50aW5nfGNvbXByZXNzaW5nKSBvYmplY3RzOiAoXFxkKyksL2ksIChyZXN1bHQsIFthY3Rpb24sIGNvdW50XSkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBhY3Rpb24udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgZW51bWVyYXRpb24gPSBvYmplY3RFbnVtZXJhdGlvblJlc3VsdChyZXN1bHQucmVtb3RlTWVzc2FnZXMpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudW1lcmF0aW9uLCB7IFtrZXldOiB1dGlsc18xLmFzTnVtYmVyKGNvdW50KSB9KTtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5SZW1vdGVMaW5lUGFyc2VyKC9ecmVtb3RlOlxccyooZW51bWVyYXRpbmd8Y291bnRpbmd8Y29tcHJlc3NpbmcpIG9iamVjdHM6IFxcZCslIFxcKFxcZCtcXC8oXFxkKylcXCksL2ksIChyZXN1bHQsIFthY3Rpb24sIGNvdW50XSkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBhY3Rpb24udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgZW51bWVyYXRpb24gPSBvYmplY3RFbnVtZXJhdGlvblJlc3VsdChyZXN1bHQucmVtb3RlTWVzc2FnZXMpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudW1lcmF0aW9uLCB7IFtrZXldOiB1dGlsc18xLmFzTnVtYmVyKGNvdW50KSB9KTtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5SZW1vdGVMaW5lUGFyc2VyKC90b3RhbCAoW14sXSspLCByZXVzZWQgKFteLF0rKSwgcGFjay1yZXVzZWQgKFxcZCspL2ksIChyZXN1bHQsIFt0b3RhbCwgcmV1c2VkLCBwYWNrUmV1c2VkXSkgPT4ge1xuICAgICAgICBjb25zdCBvYmplY3RzID0gb2JqZWN0RW51bWVyYXRpb25SZXN1bHQocmVzdWx0LnJlbW90ZU1lc3NhZ2VzKTtcbiAgICAgICAgb2JqZWN0cy50b3RhbCA9IGFzT2JqZWN0Q291bnQodG90YWwpO1xuICAgICAgICBvYmplY3RzLnJldXNlZCA9IGFzT2JqZWN0Q291bnQocmV1c2VkKTtcbiAgICAgICAgb2JqZWN0cy5wYWNrUmV1c2VkID0gdXRpbHNfMS5hc051bWJlcihwYWNrUmV1c2VkKTtcbiAgICB9KSxcbl07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1yZW1vdGUtb2JqZWN0cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUmVtb3RlTWVzc2FnZVN1bW1hcnkgPSBleHBvcnRzLnBhcnNlUmVtb3RlTWVzc2FnZXMgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgcGFyc2VfcmVtb3RlX29iamVjdHNfMSA9IHJlcXVpcmUoXCIuL3BhcnNlLXJlbW90ZS1vYmplY3RzXCIpO1xuY29uc3QgcGFyc2VycyA9IFtcbiAgICBuZXcgdXRpbHNfMS5SZW1vdGVMaW5lUGFyc2VyKC9ecmVtb3RlOlxccyooLispJC8sIChyZXN1bHQsIFt0ZXh0XSkgPT4ge1xuICAgICAgICByZXN1bHQucmVtb3RlTWVzc2FnZXMuYWxsLnB1c2godGV4dC50cmltKCkpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSksXG4gICAgLi4ucGFyc2VfcmVtb3RlX29iamVjdHNfMS5yZW1vdGVNZXNzYWdlc09iamVjdFBhcnNlcnMsXG4gICAgbmV3IHV0aWxzXzEuUmVtb3RlTGluZVBhcnNlcihbL2NyZWF0ZSBhICg/OnB1bGx8bWVyZ2UpIHJlcXVlc3QvaSwgL1xccyhodHRwcz86XFwvXFwvXFxTKykkL10sIChyZXN1bHQsIFtwdWxsUmVxdWVzdFVybF0pID0+IHtcbiAgICAgICAgcmVzdWx0LnJlbW90ZU1lc3NhZ2VzLnB1bGxSZXF1ZXN0VXJsID0gcHVsbFJlcXVlc3RVcmw7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuUmVtb3RlTGluZVBhcnNlcihbL2ZvdW5kIChcXGQrKSB2dWxuZXJhYmlsaXRpZXMuK1xcKChbXildKylcXCkvaSwgL1xccyhodHRwcz86XFwvXFwvXFxTKykkL10sIChyZXN1bHQsIFtjb3VudCwgc3VtbWFyeSwgdXJsXSkgPT4ge1xuICAgICAgICByZXN1bHQucmVtb3RlTWVzc2FnZXMudnVsbmVyYWJpbGl0aWVzID0ge1xuICAgICAgICAgICAgY291bnQ6IHV0aWxzXzEuYXNOdW1iZXIoY291bnQpLFxuICAgICAgICAgICAgc3VtbWFyeSxcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgfTtcbiAgICB9KSxcbl07XG5mdW5jdGlvbiBwYXJzZVJlbW90ZU1lc3NhZ2VzKF9zdGRPdXQsIHN0ZEVycikge1xuICAgIHJldHVybiB1dGlsc18xLnBhcnNlU3RyaW5nUmVzcG9uc2UoeyByZW1vdGVNZXNzYWdlczogbmV3IFJlbW90ZU1lc3NhZ2VTdW1tYXJ5KCkgfSwgcGFyc2Vycywgc3RkRXJyKTtcbn1cbmV4cG9ydHMucGFyc2VSZW1vdGVNZXNzYWdlcyA9IHBhcnNlUmVtb3RlTWVzc2FnZXM7XG5jbGFzcyBSZW1vdGVNZXNzYWdlU3VtbWFyeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuYWxsID0gW107XG4gICAgfVxufVxuZXhwb3J0cy5SZW1vdGVNZXNzYWdlU3VtbWFyeSA9IFJlbW90ZU1lc3NhZ2VTdW1tYXJ5O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtcmVtb3RlLW1lc3NhZ2VzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVB1bGxSZXN1bHQgPSBleHBvcnRzLnBhcnNlUHVsbERldGFpbCA9IHZvaWQgMDtcbmNvbnN0IFB1bGxTdW1tYXJ5XzEgPSByZXF1aXJlKFwiLi4vcmVzcG9uc2VzL1B1bGxTdW1tYXJ5XCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IHBhcnNlX3JlbW90ZV9tZXNzYWdlc18xID0gcmVxdWlyZShcIi4vcGFyc2UtcmVtb3RlLW1lc3NhZ2VzXCIpO1xuY29uc3QgRklMRV9VUERBVEVfUkVHRVggPSAvXlxccyooLis/KVxccytcXHxcXHMrXFxkK1xccyooXFwrKikoLSopLztcbmNvbnN0IFNVTU1BUllfUkVHRVggPSAvKFxcZCspXFxEKygoXFxkKylcXEQrXFwoXFwrXFwpKT8oXFxEKyhcXGQrKVxcRCtcXCgtXFwpKT8vO1xuY29uc3QgQUNUSU9OX1JFR0VYID0gL14oY3JlYXRlfGRlbGV0ZSkgbW9kZSBcXGQrICguKykvO1xuY29uc3QgcGFyc2VycyA9IFtcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKEZJTEVfVVBEQVRFX1JFR0VYLCAocmVzdWx0LCBbZmlsZSwgaW5zZXJ0aW9ucywgZGVsZXRpb25zXSkgPT4ge1xuICAgICAgICByZXN1bHQuZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgaWYgKGluc2VydGlvbnMpIHtcbiAgICAgICAgICAgIHJlc3VsdC5pbnNlcnRpb25zW2ZpbGVdID0gaW5zZXJ0aW9ucy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlbGV0aW9ucykge1xuICAgICAgICAgICAgcmVzdWx0LmRlbGV0aW9uc1tmaWxlXSA9IGRlbGV0aW9ucy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKFNVTU1BUllfUkVHRVgsIChyZXN1bHQsIFtjaGFuZ2VzLCAsIGluc2VydGlvbnMsICwgZGVsZXRpb25zXSkgPT4ge1xuICAgICAgICBpZiAoaW5zZXJ0aW9ucyAhPT0gdW5kZWZpbmVkIHx8IGRlbGV0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXN1bHQuc3VtbWFyeS5jaGFuZ2VzID0gK2NoYW5nZXMgfHwgMDtcbiAgICAgICAgICAgIHJlc3VsdC5zdW1tYXJ5Lmluc2VydGlvbnMgPSAraW5zZXJ0aW9ucyB8fCAwO1xuICAgICAgICAgICAgcmVzdWx0LnN1bW1hcnkuZGVsZXRpb25zID0gK2RlbGV0aW9ucyB8fCAwO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoQUNUSU9OX1JFR0VYLCAocmVzdWx0LCBbYWN0aW9uLCBmaWxlXSkgPT4ge1xuICAgICAgICB1dGlsc18xLmFwcGVuZChyZXN1bHQuZmlsZXMsIGZpbGUpO1xuICAgICAgICB1dGlsc18xLmFwcGVuZCgoYWN0aW9uID09PSAnY3JlYXRlJykgPyByZXN1bHQuY3JlYXRlZCA6IHJlc3VsdC5kZWxldGVkLCBmaWxlKTtcbiAgICB9KSxcbl07XG5jb25zdCBwYXJzZVB1bGxEZXRhaWwgPSAoc3RkT3V0LCBzdGRFcnIpID0+IHtcbiAgICByZXR1cm4gdXRpbHNfMS5wYXJzZVN0cmluZ1Jlc3BvbnNlKG5ldyBQdWxsU3VtbWFyeV8xLlB1bGxTdW1tYXJ5KCksIHBhcnNlcnMsIHN0ZE91dCwgc3RkRXJyKTtcbn07XG5leHBvcnRzLnBhcnNlUHVsbERldGFpbCA9IHBhcnNlUHVsbERldGFpbDtcbmNvbnN0IHBhcnNlUHVsbFJlc3VsdCA9IChzdGRPdXQsIHN0ZEVycikgPT4ge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyBQdWxsU3VtbWFyeV8xLlB1bGxTdW1tYXJ5KCksIGV4cG9ydHMucGFyc2VQdWxsRGV0YWlsKHN0ZE91dCwgc3RkRXJyKSwgcGFyc2VfcmVtb3RlX21lc3NhZ2VzXzEucGFyc2VSZW1vdGVNZXNzYWdlcyhzdGRPdXQsIHN0ZEVycikpO1xufTtcbmV4cG9ydHMucGFyc2VQdWxsUmVzdWx0ID0gcGFyc2VQdWxsUmVzdWx0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtcHVsbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VNZXJnZURldGFpbCA9IGV4cG9ydHMucGFyc2VNZXJnZVJlc3VsdCA9IHZvaWQgMDtcbmNvbnN0IE1lcmdlU3VtbWFyeV8xID0gcmVxdWlyZShcIi4uL3Jlc3BvbnNlcy9NZXJnZVN1bW1hcnlcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgcGFyc2VfcHVsbF8xID0gcmVxdWlyZShcIi4vcGFyc2UtcHVsbFwiKTtcbmNvbnN0IHBhcnNlcnMgPSBbXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXkF1dG8tbWVyZ2luZ1xccysoLispJC8sIChzdW1tYXJ5LCBbYXV0b01lcmdlXSkgPT4ge1xuICAgICAgICBzdW1tYXJ5Lm1lcmdlcy5wdXNoKGF1dG9NZXJnZSk7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXkNPTkZMSUNUXFxzK1xcKCguKylcXCk6IE1lcmdlIGNvbmZsaWN0IGluICguKykkLywgKHN1bW1hcnksIFtyZWFzb24sIGZpbGVdKSA9PiB7XG4gICAgICAgIHN1bW1hcnkuY29uZmxpY3RzLnB1c2gobmV3IE1lcmdlU3VtbWFyeV8xLk1lcmdlU3VtbWFyeUNvbmZsaWN0KHJlYXNvbiwgZmlsZSkpO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL15DT05GTElDVFxccytcXCgoLitcXC9kZWxldGUpXFwpOiAoLispIGRlbGV0ZWQgaW4gKC4rKSBhbmQvLCAoc3VtbWFyeSwgW3JlYXNvbiwgZmlsZSwgZGVsZXRlUmVmXSkgPT4ge1xuICAgICAgICBzdW1tYXJ5LmNvbmZsaWN0cy5wdXNoKG5ldyBNZXJnZVN1bW1hcnlfMS5NZXJnZVN1bW1hcnlDb25mbGljdChyZWFzb24sIGZpbGUsIHsgZGVsZXRlUmVmIH0pKTtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9eQ09ORkxJQ1RcXHMrXFwoKC4rKVxcKTovLCAoc3VtbWFyeSwgW3JlYXNvbl0pID0+IHtcbiAgICAgICAgc3VtbWFyeS5jb25mbGljdHMucHVzaChuZXcgTWVyZ2VTdW1tYXJ5XzEuTWVyZ2VTdW1tYXJ5Q29uZmxpY3QocmVhc29uLCBudWxsKSk7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXkF1dG9tYXRpYyBtZXJnZSBmYWlsZWQ7XFxzKyguKykkLywgKHN1bW1hcnksIFtyZXN1bHRdKSA9PiB7XG4gICAgICAgIHN1bW1hcnkucmVzdWx0ID0gcmVzdWx0O1xuICAgIH0pLFxuXTtcbi8qKlxuICogUGFyc2UgdGhlIGNvbXBsZXRlIHJlc3BvbnNlIGZyb20gYGdpdC5tZXJnZWBcbiAqL1xuY29uc3QgcGFyc2VNZXJnZVJlc3VsdCA9IChzdGRPdXQsIHN0ZEVycikgPT4ge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGV4cG9ydHMucGFyc2VNZXJnZURldGFpbChzdGRPdXQsIHN0ZEVyciksIHBhcnNlX3B1bGxfMS5wYXJzZVB1bGxSZXN1bHQoc3RkT3V0LCBzdGRFcnIpKTtcbn07XG5leHBvcnRzLnBhcnNlTWVyZ2VSZXN1bHQgPSBwYXJzZU1lcmdlUmVzdWx0O1xuLyoqXG4gKiBQYXJzZSB0aGUgbWVyZ2Ugc3BlY2lmaWMgZGV0YWlsIChpZTogbm90IHRoZSBjb250ZW50IGFsc28gYXZhaWxhYmxlIGluIHRoZSBwdWxsIGRldGFpbCkgZnJvbSBgZ2l0Lm1uZXJnZWBcbiAqIEBwYXJhbSBzdGRPdXRcbiAqL1xuY29uc3QgcGFyc2VNZXJnZURldGFpbCA9IChzdGRPdXQpID0+IHtcbiAgICByZXR1cm4gdXRpbHNfMS5wYXJzZVN0cmluZ1Jlc3BvbnNlKG5ldyBNZXJnZVN1bW1hcnlfMS5NZXJnZVN1bW1hcnlEZXRhaWwoKSwgcGFyc2Vycywgc3RkT3V0KTtcbn07XG5leHBvcnRzLnBhcnNlTWVyZ2VEZXRhaWwgPSBwYXJzZU1lcmdlRGV0YWlsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtbWVyZ2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1lcmdlVGFzayA9IHZvaWQgMDtcbmNvbnN0IGdpdF9yZXNwb25zZV9lcnJvcl8xID0gcmVxdWlyZShcIi4uL2Vycm9ycy9naXQtcmVzcG9uc2UtZXJyb3JcIik7XG5jb25zdCBwYXJzZV9tZXJnZV8xID0gcmVxdWlyZShcIi4uL3BhcnNlcnMvcGFyc2UtbWVyZ2VcIik7XG5jb25zdCB0YXNrXzEgPSByZXF1aXJlKFwiLi90YXNrXCIpO1xuZnVuY3Rpb24gbWVyZ2VUYXNrKGN1c3RvbUFyZ3MpIHtcbiAgICBpZiAoIWN1c3RvbUFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0YXNrXzEuY29uZmlndXJhdGlvbkVycm9yVGFzaygnR2l0Lm1lcmdlIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBvcHRpb24nKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHM6IFsnbWVyZ2UnLCAuLi5jdXN0b21BcmdzXSxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXIoc3RkT3V0LCBzdGRFcnIpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lcmdlID0gcGFyc2VfbWVyZ2VfMS5wYXJzZU1lcmdlUmVzdWx0KHN0ZE91dCwgc3RkRXJyKTtcbiAgICAgICAgICAgIGlmIChtZXJnZS5mYWlsZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgZ2l0X3Jlc3BvbnNlX2Vycm9yXzEuR2l0UmVzcG9uc2VFcnJvcihtZXJnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2U7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5tZXJnZVRhc2sgPSBtZXJnZVRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZXJnZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VQdXNoRGV0YWlsID0gZXhwb3J0cy5wYXJzZVB1c2hSZXN1bHQgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgcGFyc2VfcmVtb3RlX21lc3NhZ2VzXzEgPSByZXF1aXJlKFwiLi9wYXJzZS1yZW1vdGUtbWVzc2FnZXNcIik7XG5mdW5jdGlvbiBwdXNoUmVzdWx0UHVzaGVkSXRlbShsb2NhbCwgcmVtb3RlLCBzdGF0dXMpIHtcbiAgICBjb25zdCBkZWxldGVkID0gc3RhdHVzLmluY2x1ZGVzKCdkZWxldGVkJyk7XG4gICAgY29uc3QgdGFnID0gc3RhdHVzLmluY2x1ZGVzKCd0YWcnKSB8fCAvXnJlZnNcXC90YWdzLy50ZXN0KGxvY2FsKTtcbiAgICBjb25zdCBhbHJlYWR5VXBkYXRlZCA9ICFzdGF0dXMuaW5jbHVkZXMoJ25ldycpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGV0ZWQsXG4gICAgICAgIHRhZyxcbiAgICAgICAgYnJhbmNoOiAhdGFnLFxuICAgICAgICBuZXc6ICFhbHJlYWR5VXBkYXRlZCxcbiAgICAgICAgYWxyZWFkeVVwZGF0ZWQsXG4gICAgICAgIGxvY2FsLFxuICAgICAgICByZW1vdGUsXG4gICAgfTtcbn1cbmNvbnN0IHBhcnNlcnMgPSBbXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXlB1c2hpbmcgdG8gKC4rKSQvLCAocmVzdWx0LCBbcmVwb10pID0+IHtcbiAgICAgICAgcmVzdWx0LnJlcG8gPSByZXBvO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL151cGRhdGluZyBsb2NhbCB0cmFja2luZyByZWYgJyguKyknLywgKHJlc3VsdCwgW2xvY2FsXSkgPT4ge1xuICAgICAgICByZXN1bHQucmVmID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCAocmVzdWx0LnJlZiB8fCB7fSkpLCB7IGxvY2FsIH0pO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL15bKi09XVxccysoW146XSspOihcXFMrKVxccytcXFsoLispXSQvLCAocmVzdWx0LCBbbG9jYWwsIHJlbW90ZSwgdHlwZV0pID0+IHtcbiAgICAgICAgcmVzdWx0LnB1c2hlZC5wdXNoKHB1c2hSZXN1bHRQdXNoZWRJdGVtKGxvY2FsLCByZW1vdGUsIHR5cGUpKTtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9eQnJhbmNoICcoW14nXSspJyBzZXQgdXAgdG8gdHJhY2sgcmVtb3RlIGJyYW5jaCAnKFteJ10rKScgZnJvbSAnKFteJ10rKScvLCAocmVzdWx0LCBbbG9jYWwsIHJlbW90ZSwgcmVtb3RlTmFtZV0pID0+IHtcbiAgICAgICAgcmVzdWx0LmJyYW5jaCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgKHJlc3VsdC5icmFuY2ggfHwge30pKSwgeyBsb2NhbCxcbiAgICAgICAgICAgIHJlbW90ZSxcbiAgICAgICAgICAgIHJlbW90ZU5hbWUgfSk7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXihbXjpdKyk6KFxcUyspXFxzKyhbYS16MC05XSspXFwuXFwuKFthLXowLTldKykkLywgKHJlc3VsdCwgW2xvY2FsLCByZW1vdGUsIGZyb20sIHRvXSkgPT4ge1xuICAgICAgICByZXN1bHQudXBkYXRlID0ge1xuICAgICAgICAgICAgaGVhZDoge1xuICAgICAgICAgICAgICAgIGxvY2FsLFxuICAgICAgICAgICAgICAgIHJlbW90ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoYXNoOiB7XG4gICAgICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgICAgICB0byxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfSksXG5dO1xuY29uc3QgcGFyc2VQdXNoUmVzdWx0ID0gKHN0ZE91dCwgc3RkRXJyKSA9PiB7XG4gICAgY29uc3QgcHVzaERldGFpbCA9IGV4cG9ydHMucGFyc2VQdXNoRGV0YWlsKHN0ZE91dCwgc3RkRXJyKTtcbiAgICBjb25zdCByZXNwb25zZURldGFpbCA9IHBhcnNlX3JlbW90ZV9tZXNzYWdlc18xLnBhcnNlUmVtb3RlTWVzc2FnZXMoc3RkT3V0LCBzdGRFcnIpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHB1c2hEZXRhaWwpLCByZXNwb25zZURldGFpbCk7XG59O1xuZXhwb3J0cy5wYXJzZVB1c2hSZXN1bHQgPSBwYXJzZVB1c2hSZXN1bHQ7XG5jb25zdCBwYXJzZVB1c2hEZXRhaWwgPSAoc3RkT3V0LCBzdGRFcnIpID0+IHtcbiAgICByZXR1cm4gdXRpbHNfMS5wYXJzZVN0cmluZ1Jlc3BvbnNlKHsgcHVzaGVkOiBbXSB9LCBwYXJzZXJzLCBzdGRPdXQsIHN0ZEVycik7XG59O1xuZXhwb3J0cy5wYXJzZVB1c2hEZXRhaWwgPSBwYXJzZVB1c2hEZXRhaWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1wdXNoLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wdXNoVGFzayA9IGV4cG9ydHMucHVzaFRhZ3NUYXNrID0gdm9pZCAwO1xuY29uc3QgcGFyc2VfcHVzaF8xID0gcmVxdWlyZShcIi4uL3BhcnNlcnMvcGFyc2UtcHVzaFwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5mdW5jdGlvbiBwdXNoVGFnc1Rhc2socmVmID0ge30sIGN1c3RvbUFyZ3MpIHtcbiAgICB1dGlsc18xLmFwcGVuZChjdXN0b21BcmdzLCAnLS10YWdzJyk7XG4gICAgcmV0dXJuIHB1c2hUYXNrKHJlZiwgY3VzdG9tQXJncyk7XG59XG5leHBvcnRzLnB1c2hUYWdzVGFzayA9IHB1c2hUYWdzVGFzaztcbmZ1bmN0aW9uIHB1c2hUYXNrKHJlZiA9IHt9LCBjdXN0b21BcmdzKSB7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ3B1c2gnLCAuLi5jdXN0b21BcmdzXTtcbiAgICBpZiAocmVmLmJyYW5jaCkge1xuICAgICAgICBjb21tYW5kcy5zcGxpY2UoMSwgMCwgcmVmLmJyYW5jaCk7XG4gICAgfVxuICAgIGlmIChyZWYucmVtb3RlKSB7XG4gICAgICAgIGNvbW1hbmRzLnNwbGljZSgxLCAwLCByZWYucmVtb3RlKTtcbiAgICB9XG4gICAgdXRpbHNfMS5yZW1vdmUoY29tbWFuZHMsICctdicpO1xuICAgIHV0aWxzXzEuYXBwZW5kKGNvbW1hbmRzLCAnLS12ZXJib3NlJyk7XG4gICAgdXRpbHNfMS5hcHBlbmQoY29tbWFuZHMsICctLXBvcmNlbGFpbicpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcjogcGFyc2VfcHVzaF8xLnBhcnNlUHVzaFJlc3VsdCxcbiAgICB9O1xufVxuZXhwb3J0cy5wdXNoVGFzayA9IHB1c2hUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHVzaC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRmlsZVN0YXR1c1N1bW1hcnkgPSBleHBvcnRzLmZyb21QYXRoUmVnZXggPSB2b2lkIDA7XG5leHBvcnRzLmZyb21QYXRoUmVnZXggPSAvXiguKykgLT4gKC4rKSQvO1xuY2xhc3MgRmlsZVN0YXR1c1N1bW1hcnkge1xuICAgIGNvbnN0cnVjdG9yKHBhdGgsIGluZGV4LCB3b3JraW5nX2Rpcikge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMud29ya2luZ19kaXIgPSB3b3JraW5nX2RpcjtcbiAgICAgICAgaWYgKCdSJyA9PT0gKGluZGV4ICsgd29ya2luZ19kaXIpKSB7XG4gICAgICAgICAgICBjb25zdCBkZXRhaWwgPSBleHBvcnRzLmZyb21QYXRoUmVnZXguZXhlYyhwYXRoKSB8fCBbbnVsbCwgcGF0aCwgcGF0aF07XG4gICAgICAgICAgICB0aGlzLmZyb20gPSBkZXRhaWxbMV0gfHwgJyc7XG4gICAgICAgICAgICB0aGlzLnBhdGggPSBkZXRhaWxbMl0gfHwgJyc7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkZpbGVTdGF0dXNTdW1tYXJ5ID0gRmlsZVN0YXR1c1N1bW1hcnk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1GaWxlU3RhdHVzU3VtbWFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VTdGF0dXNTdW1tYXJ5ID0gZXhwb3J0cy5TdGF0dXNTdW1tYXJ5ID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IEZpbGVTdGF0dXNTdW1tYXJ5XzEgPSByZXF1aXJlKFwiLi9GaWxlU3RhdHVzU3VtbWFyeVwiKTtcbi8qKlxuICogVGhlIFN0YXR1c1N1bW1hcnkgaXMgcmV0dXJuZWQgYXMgYSByZXNwb25zZSB0byBnZXR0aW5nIGBnaXQoKS5zdGF0dXMoKWBcbiAqL1xuY2xhc3MgU3RhdHVzU3VtbWFyeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubm90X2FkZGVkID0gW107XG4gICAgICAgIHRoaXMuY29uZmxpY3RlZCA9IFtdO1xuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBbXTtcbiAgICAgICAgdGhpcy5kZWxldGVkID0gW107XG4gICAgICAgIHRoaXMubW9kaWZpZWQgPSBbXTtcbiAgICAgICAgdGhpcy5yZW5hbWVkID0gW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbGwgZmlsZXMgcmVwcmVzZW50ZWQgYXMgYW4gYXJyYXkgb2Ygb2JqZWN0cyBjb250YWluaW5nIHRoZSBgcGF0aGAgYW5kIHN0YXR1cyBpbiBgaW5kZXhgIGFuZFxuICAgICAgICAgKiBpbiB0aGUgYHdvcmtpbmdfZGlyYC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZmlsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5zdGFnZWQgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE51bWJlciBvZiBjb21taXRzIGFoZWFkIG9mIHRoZSB0cmFja2VkIGJyYW5jaFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5haGVhZCA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKk51bWJlciBvZiBjb21taXRzIGJlaGluZCB0aGUgdHJhY2tlZCBicmFuY2hcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYmVoaW5kID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE5hbWUgb2YgdGhlIGN1cnJlbnQgYnJhbmNoXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogTmFtZSBvZiB0aGUgYnJhbmNoIGJlaW5nIHRyYWNrZWRcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHJhY2tpbmcgPSBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhpcyBTdGF0dXNTdW1tYXJ5IHJlcHJlc2VudHMgYSBjbGVhbiB3b3JraW5nIGJyYW5jaC5cbiAgICAgKi9cbiAgICBpc0NsZWFuKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuZmlsZXMubGVuZ3RoO1xuICAgIH1cbn1cbmV4cG9ydHMuU3RhdHVzU3VtbWFyeSA9IFN0YXR1c1N1bW1hcnk7XG52YXIgUG9yY2VsYWluRmlsZVN0YXR1cztcbihmdW5jdGlvbiAoUG9yY2VsYWluRmlsZVN0YXR1cykge1xuICAgIFBvcmNlbGFpbkZpbGVTdGF0dXNbXCJBRERFRFwiXSA9IFwiQVwiO1xuICAgIFBvcmNlbGFpbkZpbGVTdGF0dXNbXCJERUxFVEVEXCJdID0gXCJEXCI7XG4gICAgUG9yY2VsYWluRmlsZVN0YXR1c1tcIk1PRElGSUVEXCJdID0gXCJNXCI7XG4gICAgUG9yY2VsYWluRmlsZVN0YXR1c1tcIlJFTkFNRURcIl0gPSBcIlJcIjtcbiAgICBQb3JjZWxhaW5GaWxlU3RhdHVzW1wiQ09QSUVEXCJdID0gXCJDXCI7XG4gICAgUG9yY2VsYWluRmlsZVN0YXR1c1tcIlVOTUVSR0VEXCJdID0gXCJVXCI7XG4gICAgUG9yY2VsYWluRmlsZVN0YXR1c1tcIlVOVFJBQ0tFRFwiXSA9IFwiP1wiO1xuICAgIFBvcmNlbGFpbkZpbGVTdGF0dXNbXCJJR05PUkVEXCJdID0gXCIhXCI7XG4gICAgUG9yY2VsYWluRmlsZVN0YXR1c1tcIk5PTkVcIl0gPSBcIiBcIjtcbn0pKFBvcmNlbGFpbkZpbGVTdGF0dXMgfHwgKFBvcmNlbGFpbkZpbGVTdGF0dXMgPSB7fSkpO1xuZnVuY3Rpb24gcmVuYW1lZEZpbGUobGluZSkge1xuICAgIGNvbnN0IGRldGFpbCA9IC9eKC4rKSAtPiAoLispJC8uZXhlYyhsaW5lKTtcbiAgICBpZiAoIWRldGFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnJvbTogbGluZSwgdG86IGxpbmVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZnJvbTogU3RyaW5nKGRldGFpbFsxXSksXG4gICAgICAgIHRvOiBTdHJpbmcoZGV0YWlsWzJdKSxcbiAgICB9O1xufVxuZnVuY3Rpb24gcGFyc2VyKGluZGV4WCwgaW5kZXhZLCBoYW5kbGVyKSB7XG4gICAgcmV0dXJuIFtgJHtpbmRleFh9JHtpbmRleFl9YCwgaGFuZGxlcl07XG59XG5mdW5jdGlvbiBjb25mbGljdHMoaW5kZXhYLCAuLi5pbmRleFkpIHtcbiAgICByZXR1cm4gaW5kZXhZLm1hcCh5ID0+IHBhcnNlcihpbmRleFgsIHksIChyZXN1bHQsIGZpbGUpID0+IHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5jb25mbGljdGVkLCBmaWxlKSkpO1xufVxuY29uc3QgcGFyc2VycyA9IG5ldyBNYXAoW1xuICAgIHBhcnNlcihQb3JjZWxhaW5GaWxlU3RhdHVzLk5PTkUsIFBvcmNlbGFpbkZpbGVTdGF0dXMuQURERUQsIChyZXN1bHQsIGZpbGUpID0+IHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5jcmVhdGVkLCBmaWxlKSksXG4gICAgcGFyc2VyKFBvcmNlbGFpbkZpbGVTdGF0dXMuTk9ORSwgUG9yY2VsYWluRmlsZVN0YXR1cy5ERUxFVEVELCAocmVzdWx0LCBmaWxlKSA9PiB1dGlsc18xLmFwcGVuZChyZXN1bHQuZGVsZXRlZCwgZmlsZSkpLFxuICAgIHBhcnNlcihQb3JjZWxhaW5GaWxlU3RhdHVzLk5PTkUsIFBvcmNlbGFpbkZpbGVTdGF0dXMuTU9ESUZJRUQsIChyZXN1bHQsIGZpbGUpID0+IHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5tb2RpZmllZCwgZmlsZSkpLFxuICAgIHBhcnNlcihQb3JjZWxhaW5GaWxlU3RhdHVzLkFEREVELCBQb3JjZWxhaW5GaWxlU3RhdHVzLk5PTkUsIChyZXN1bHQsIGZpbGUpID0+IHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5jcmVhdGVkLCBmaWxlKSAmJiB1dGlsc18xLmFwcGVuZChyZXN1bHQuc3RhZ2VkLCBmaWxlKSksXG4gICAgcGFyc2VyKFBvcmNlbGFpbkZpbGVTdGF0dXMuQURERUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuTU9ESUZJRUQsIChyZXN1bHQsIGZpbGUpID0+IHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5jcmVhdGVkLCBmaWxlKSAmJiB1dGlsc18xLmFwcGVuZChyZXN1bHQuc3RhZ2VkLCBmaWxlKSAmJiB1dGlsc18xLmFwcGVuZChyZXN1bHQubW9kaWZpZWQsIGZpbGUpKSxcbiAgICBwYXJzZXIoUG9yY2VsYWluRmlsZVN0YXR1cy5ERUxFVEVELCBQb3JjZWxhaW5GaWxlU3RhdHVzLk5PTkUsIChyZXN1bHQsIGZpbGUpID0+IHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5kZWxldGVkLCBmaWxlKSAmJiB1dGlsc18xLmFwcGVuZChyZXN1bHQuc3RhZ2VkLCBmaWxlKSksXG4gICAgcGFyc2VyKFBvcmNlbGFpbkZpbGVTdGF0dXMuTU9ESUZJRUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuTk9ORSwgKHJlc3VsdCwgZmlsZSkgPT4gdXRpbHNfMS5hcHBlbmQocmVzdWx0Lm1vZGlmaWVkLCBmaWxlKSAmJiB1dGlsc18xLmFwcGVuZChyZXN1bHQuc3RhZ2VkLCBmaWxlKSksXG4gICAgcGFyc2VyKFBvcmNlbGFpbkZpbGVTdGF0dXMuTU9ESUZJRUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuTU9ESUZJRUQsIChyZXN1bHQsIGZpbGUpID0+IHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5tb2RpZmllZCwgZmlsZSkgJiYgdXRpbHNfMS5hcHBlbmQocmVzdWx0LnN0YWdlZCwgZmlsZSkpLFxuICAgIHBhcnNlcihQb3JjZWxhaW5GaWxlU3RhdHVzLlJFTkFNRUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuTk9ORSwgKHJlc3VsdCwgZmlsZSkgPT4ge1xuICAgICAgICB1dGlsc18xLmFwcGVuZChyZXN1bHQucmVuYW1lZCwgcmVuYW1lZEZpbGUoZmlsZSkpO1xuICAgIH0pLFxuICAgIHBhcnNlcihQb3JjZWxhaW5GaWxlU3RhdHVzLlJFTkFNRUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuTU9ESUZJRUQsIChyZXN1bHQsIGZpbGUpID0+IHtcbiAgICAgICAgY29uc3QgcmVuYW1lZCA9IHJlbmFtZWRGaWxlKGZpbGUpO1xuICAgICAgICB1dGlsc18xLmFwcGVuZChyZXN1bHQucmVuYW1lZCwgcmVuYW1lZCk7XG4gICAgICAgIHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5tb2RpZmllZCwgcmVuYW1lZC50byk7XG4gICAgfSksXG4gICAgcGFyc2VyKFBvcmNlbGFpbkZpbGVTdGF0dXMuVU5UUkFDS0VELCBQb3JjZWxhaW5GaWxlU3RhdHVzLlVOVFJBQ0tFRCwgKHJlc3VsdCwgZmlsZSkgPT4gdXRpbHNfMS5hcHBlbmQocmVzdWx0Lm5vdF9hZGRlZCwgZmlsZSkpLFxuICAgIC4uLmNvbmZsaWN0cyhQb3JjZWxhaW5GaWxlU3RhdHVzLkFEREVELCBQb3JjZWxhaW5GaWxlU3RhdHVzLkFEREVELCBQb3JjZWxhaW5GaWxlU3RhdHVzLlVOTUVSR0VEKSxcbiAgICAuLi5jb25mbGljdHMoUG9yY2VsYWluRmlsZVN0YXR1cy5ERUxFVEVELCBQb3JjZWxhaW5GaWxlU3RhdHVzLkRFTEVURUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuVU5NRVJHRUQpLFxuICAgIC4uLmNvbmZsaWN0cyhQb3JjZWxhaW5GaWxlU3RhdHVzLlVOTUVSR0VELCBQb3JjZWxhaW5GaWxlU3RhdHVzLkFEREVELCBQb3JjZWxhaW5GaWxlU3RhdHVzLkRFTEVURUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuVU5NRVJHRUQpLFxuICAgIFsnIyMnLCAocmVzdWx0LCBsaW5lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhaGVhZFJlZyA9IC9haGVhZCAoXFxkKykvO1xuICAgICAgICAgICAgY29uc3QgYmVoaW5kUmVnID0gL2JlaGluZCAoXFxkKykvO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFJlZyA9IC9eKC4rPyg/PSg/OlxcLnszfXxcXHN8JCkpKS87XG4gICAgICAgICAgICBjb25zdCB0cmFja2luZ1JlZyA9IC9cXC57M30oXFxTKikvO1xuICAgICAgICAgICAgY29uc3Qgb25FbXB0eUJyYW5jaFJlZyA9IC9cXHNvblxccyhbXFxTXSspJC87XG4gICAgICAgICAgICBsZXQgcmVnZXhSZXN1bHQ7XG4gICAgICAgICAgICByZWdleFJlc3VsdCA9IGFoZWFkUmVnLmV4ZWMobGluZSk7XG4gICAgICAgICAgICByZXN1bHQuYWhlYWQgPSByZWdleFJlc3VsdCAmJiArcmVnZXhSZXN1bHRbMV0gfHwgMDtcbiAgICAgICAgICAgIHJlZ2V4UmVzdWx0ID0gYmVoaW5kUmVnLmV4ZWMobGluZSk7XG4gICAgICAgICAgICByZXN1bHQuYmVoaW5kID0gcmVnZXhSZXN1bHQgJiYgK3JlZ2V4UmVzdWx0WzFdIHx8IDA7XG4gICAgICAgICAgICByZWdleFJlc3VsdCA9IGN1cnJlbnRSZWcuZXhlYyhsaW5lKTtcbiAgICAgICAgICAgIHJlc3VsdC5jdXJyZW50ID0gcmVnZXhSZXN1bHQgJiYgcmVnZXhSZXN1bHRbMV07XG4gICAgICAgICAgICByZWdleFJlc3VsdCA9IHRyYWNraW5nUmVnLmV4ZWMobGluZSk7XG4gICAgICAgICAgICByZXN1bHQudHJhY2tpbmcgPSByZWdleFJlc3VsdCAmJiByZWdleFJlc3VsdFsxXTtcbiAgICAgICAgICAgIHJlZ2V4UmVzdWx0ID0gb25FbXB0eUJyYW5jaFJlZy5leGVjKGxpbmUpO1xuICAgICAgICAgICAgcmVzdWx0LmN1cnJlbnQgPSByZWdleFJlc3VsdCAmJiByZWdleFJlc3VsdFsxXSB8fCByZXN1bHQuY3VycmVudDtcbiAgICAgICAgfV1cbl0pO1xuY29uc3QgcGFyc2VTdGF0dXNTdW1tYXJ5ID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICBjb25zdCBsaW5lcyA9IHRleHQudHJpbSgpLnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBzdGF0dXMgPSBuZXcgU3RhdHVzU3VtbWFyeSgpO1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGluZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHNwbGl0TGluZShzdGF0dXMsIGxpbmVzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXR1cztcbn07XG5leHBvcnRzLnBhcnNlU3RhdHVzU3VtbWFyeSA9IHBhcnNlU3RhdHVzU3VtbWFyeTtcbmZ1bmN0aW9uIHNwbGl0TGluZShyZXN1bHQsIGxpbmVTdHIpIHtcbiAgICBjb25zdCB0cmltbWVkID0gbGluZVN0ci50cmltKCk7XG4gICAgc3dpdGNoICgnICcpIHtcbiAgICAgICAgY2FzZSB0cmltbWVkLmNoYXJBdCgyKTpcbiAgICAgICAgICAgIHJldHVybiBkYXRhKHRyaW1tZWQuY2hhckF0KDApLCB0cmltbWVkLmNoYXJBdCgxKSwgdHJpbW1lZC5zdWJzdHIoMykpO1xuICAgICAgICBjYXNlIHRyaW1tZWQuY2hhckF0KDEpOlxuICAgICAgICAgICAgcmV0dXJuIGRhdGEoUG9yY2VsYWluRmlsZVN0YXR1cy5OT05FLCB0cmltbWVkLmNoYXJBdCgwKSwgdHJpbW1lZC5zdWJzdHIoMikpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkYXRhKGluZGV4LCB3b3JraW5nRGlyLCBwYXRoKSB7XG4gICAgICAgIGNvbnN0IHJhdyA9IGAke2luZGV4fSR7d29ya2luZ0Rpcn1gO1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gcGFyc2Vycy5nZXQocmF3KTtcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGhhbmRsZXIocmVzdWx0LCBwYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmF3ICE9PSAnIyMnKSB7XG4gICAgICAgICAgICByZXN1bHQuZmlsZXMucHVzaChuZXcgRmlsZVN0YXR1c1N1bW1hcnlfMS5GaWxlU3RhdHVzU3VtbWFyeShwYXRoLCBpbmRleCwgd29ya2luZ0RpcikpO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3RhdHVzU3VtbWFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc3RhdHVzVGFzayA9IHZvaWQgMDtcbmNvbnN0IFN0YXR1c1N1bW1hcnlfMSA9IHJlcXVpcmUoXCIuLi9yZXNwb25zZXMvU3RhdHVzU3VtbWFyeVwiKTtcbmZ1bmN0aW9uIHN0YXR1c1Rhc2soY3VzdG9tQXJncykge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgY29tbWFuZHM6IFsnc3RhdHVzJywgJy0tcG9yY2VsYWluJywgJy1iJywgJy11JywgLi4uY3VzdG9tQXJnc10sXG4gICAgICAgIHBhcnNlcih0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gU3RhdHVzU3VtbWFyeV8xLnBhcnNlU3RhdHVzU3VtbWFyeSh0ZXh0KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLnN0YXR1c1Rhc2sgPSBzdGF0dXNUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhdHVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TaW1wbGVHaXRBcGkgPSB2b2lkIDA7XG5jb25zdCB0YXNrX2NhbGxiYWNrXzEgPSByZXF1aXJlKFwiLi90YXNrLWNhbGxiYWNrXCIpO1xuY29uc3QgY2hhbmdlX3dvcmtpbmdfZGlyZWN0b3J5XzEgPSByZXF1aXJlKFwiLi90YXNrcy9jaGFuZ2Utd29ya2luZy1kaXJlY3RvcnlcIik7XG5jb25zdCBjb25maWdfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL2NvbmZpZ1wiKTtcbmNvbnN0IGhhc2hfb2JqZWN0XzEgPSByZXF1aXJlKFwiLi90YXNrcy9oYXNoLW9iamVjdFwiKTtcbmNvbnN0IGluaXRfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL2luaXRcIik7XG5jb25zdCBsb2dfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL2xvZ1wiKTtcbmNvbnN0IG1lcmdlXzEgPSByZXF1aXJlKFwiLi90YXNrcy9tZXJnZVwiKTtcbmNvbnN0IHB1c2hfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL3B1c2hcIik7XG5jb25zdCBzdGF0dXNfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL3N0YXR1c1wiKTtcbmNvbnN0IHRhc2tfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL3Rhc2tcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5jbGFzcyBTaW1wbGVHaXRBcGkge1xuICAgIGNvbnN0cnVjdG9yKF9leGVjdXRvcikge1xuICAgICAgICB0aGlzLl9leGVjdXRvciA9IF9leGVjdXRvcjtcbiAgICB9XG4gICAgX3J1blRhc2sodGFzaywgdGhlbikge1xuICAgICAgICBjb25zdCBjaGFpbiA9IHRoaXMuX2V4ZWN1dG9yLmNoYWluKCk7XG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBjaGFpbi5wdXNoKHRhc2spO1xuICAgICAgICBpZiAodGhlbikge1xuICAgICAgICAgICAgdGFza19jYWxsYmFja18xLnRhc2tDYWxsYmFjayh0YXNrLCBwcm9taXNlLCB0aGVuKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZSh0aGlzLCB7XG4gICAgICAgICAgICB0aGVuOiB7IHZhbHVlOiBwcm9taXNlLnRoZW4uYmluZChwcm9taXNlKSB9LFxuICAgICAgICAgICAgY2F0Y2g6IHsgdmFsdWU6IHByb21pc2UuY2F0Y2guYmluZChwcm9taXNlKSB9LFxuICAgICAgICAgICAgX2V4ZWN1dG9yOiB7IHZhbHVlOiBjaGFpbiB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkKGZpbGVzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ydW5UYXNrKHRhc2tfMS5zdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsnYWRkJywgLi4udXRpbHNfMS5hc0FycmF5KGZpbGVzKV0pLCB1dGlsc18xLnRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpKTtcbiAgICB9XG4gICAgY3dkKGRpcmVjdG9yeSkge1xuICAgICAgICBjb25zdCBuZXh0ID0gdXRpbHNfMS50cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKHR5cGVvZiBkaXJlY3RvcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhjaGFuZ2Vfd29ya2luZ19kaXJlY3RvcnlfMS5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5VGFzayhkaXJlY3RvcnksIHRoaXMuX2V4ZWN1dG9yKSwgbmV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiAoZGlyZWN0b3J5ID09PSBudWxsIHx8IGRpcmVjdG9yeSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGlyZWN0b3J5LnBhdGgpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2soY2hhbmdlX3dvcmtpbmdfZGlyZWN0b3J5XzEuY2hhbmdlV29ya2luZ0RpcmVjdG9yeVRhc2soZGlyZWN0b3J5LnBhdGgsIGRpcmVjdG9yeS5yb290ICYmIHRoaXMuX2V4ZWN1dG9yIHx8IHVuZGVmaW5lZCksIG5leHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9ydW5UYXNrKHRhc2tfMS5jb25maWd1cmF0aW9uRXJyb3JUYXNrKCdHaXQuY3dkOiB3b3JraW5nRGlyZWN0b3J5IG11c3QgYmUgc3VwcGxpZWQgYXMgYSBzdHJpbmcnKSwgbmV4dCk7XG4gICAgfVxuICAgIGhhc2hPYmplY3QocGF0aCwgd3JpdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2soaGFzaF9vYmplY3RfMS5oYXNoT2JqZWN0VGFzayhwYXRoLCB3cml0ZSA9PT0gdHJ1ZSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xuICAgIH1cbiAgICBpbml0KGJhcmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2soaW5pdF8xLmluaXRUYXNrKGJhcmUgPT09IHRydWUsIHRoaXMuX2V4ZWN1dG9yLmN3ZCwgdXRpbHNfMS5nZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xuICAgIH1cbiAgICBtZXJnZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2sobWVyZ2VfMS5tZXJnZVRhc2sodXRpbHNfMS5nZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xuICAgIH1cbiAgICBtZXJnZUZyb21UbyhyZW1vdGUsIGJyYW5jaCkge1xuICAgICAgICBpZiAoISh1dGlsc18xLmZpbHRlclN0cmluZyhyZW1vdGUpICYmIHV0aWxzXzEuZmlsdGVyU3RyaW5nKGJyYW5jaCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayh0YXNrXzEuY29uZmlndXJhdGlvbkVycm9yVGFzayhgR2l0Lm1lcmdlRnJvbVRvIHJlcXVpcmVzIHRoYXQgdGhlICdyZW1vdGUnIGFuZCAnYnJhbmNoJyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkIGFzIHN0cmluZ3NgKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2sobWVyZ2VfMS5tZXJnZVRhc2soW3JlbW90ZSwgYnJhbmNoLCAuLi51dGlsc18xLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpXSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cywgZmFsc2UpKTtcbiAgICB9XG4gICAgb3V0cHV0SGFuZGxlcihoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuX2V4ZWN1dG9yLm91dHB1dEhhbmRsZXIgPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcHVzaCgpIHtcbiAgICAgICAgY29uc3QgdGFzayA9IHB1c2hfMS5wdXNoVGFzayh7XG4gICAgICAgICAgICByZW1vdGU6IHV0aWxzXzEuZmlsdGVyVHlwZShhcmd1bWVudHNbMF0sIHV0aWxzXzEuZmlsdGVyU3RyaW5nKSxcbiAgICAgICAgICAgIGJyYW5jaDogdXRpbHNfMS5maWx0ZXJUeXBlKGFyZ3VtZW50c1sxXSwgdXRpbHNfMS5maWx0ZXJTdHJpbmcpLFxuICAgICAgICB9LCB1dGlsc18xLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2sodGFzaywgdXRpbHNfMS50cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSk7XG4gICAgfVxuICAgIHN0YXNoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayh0YXNrXzEuc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhbJ3N0YXNoJywgLi4udXRpbHNfMS5nZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKV0pLCB1dGlsc18xLnRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpKTtcbiAgICB9XG4gICAgc3RhdHVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhzdGF0dXNfMS5zdGF0dXNUYXNrKHV0aWxzXzEuZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cykpLCB1dGlsc18xLnRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpKTtcbiAgICB9XG59XG5leHBvcnRzLlNpbXBsZUdpdEFwaSA9IFNpbXBsZUdpdEFwaTtcbk9iamVjdC5hc3NpZ24oU2ltcGxlR2l0QXBpLnByb3RvdHlwZSwgY29uZmlnXzEuZGVmYXVsdCgpLCBsb2dfMS5kZWZhdWx0KCkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2ltcGxlLWdpdC1hcGkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZURlZmVycmVkID0gZXhwb3J0cy5kZWZlcnJlZCA9IHZvaWQgMDtcbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgRGVmZXJyZWRQcm9taXNlYFxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiBpbXBvcnQge2RlZmVycmVkfSBmcm9tICdAa3dzaXRlcy9wcm9taXNlLWRlZmVycmVkYDtcbiBgYGBcbiAqL1xuZnVuY3Rpb24gZGVmZXJyZWQoKSB7XG4gICAgbGV0IGRvbmU7XG4gICAgbGV0IGZhaWw7XG4gICAgbGV0IHN0YXR1cyA9ICdwZW5kaW5nJztcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKF9kb25lLCBfZmFpbCkgPT4ge1xuICAgICAgICBkb25lID0gX2RvbmU7XG4gICAgICAgIGZhaWwgPSBfZmFpbDtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBwcm9taXNlLFxuICAgICAgICBkb25lKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gJ3Jlc29sdmVkJztcbiAgICAgICAgICAgICAgICBkb25lKHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWwoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdyZWplY3RlZCc7XG4gICAgICAgICAgICAgICAgZmFpbChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmdWxmaWxsZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdHVzICE9PSAncGVuZGluZyc7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBzdGF0dXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnRzLmRlZmVycmVkID0gZGVmZXJyZWQ7XG4vKipcbiAqIEFsaWFzIG9mIHRoZSBleHBvcnRlZCBgZGVmZXJyZWRgIGZ1bmN0aW9uLCB0byBoZWxwIGNvbnN1bWVycyB3YW50aW5nIHRvIHVzZSBgZGVmZXJyZWRgIGFzIHRoZVxuICogbG9jYWwgdmFyaWFibGUgbmFtZSByYXRoZXIgdGhhbiB0aGUgZmFjdG9yeSBpbXBvcnQgbmFtZSwgd2l0aG91dCBuZWVkaW5nIHRvIHJlbmFtZSBvbiBpbXBvcnQuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuIGltcG9ydCB7Y3JlYXRlRGVmZXJyZWR9IGZyb20gJ0Brd3NpdGVzL3Byb21pc2UtZGVmZXJyZWRgO1xuIGBgYFxuICovXG5leHBvcnRzLmNyZWF0ZURlZmVycmVkID0gZGVmZXJyZWQ7XG4vKipcbiAqIERlZmF1bHQgZXhwb3J0IGFsbG93cyB1c2UgYXM6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuIGltcG9ydCBkZWZlcnJlZCBmcm9tICdAa3dzaXRlcy9wcm9taXNlLWRlZmVycmVkYDtcbiBgYGBcbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gZGVmZXJyZWQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2NoZWR1bGVyID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IHByb21pc2VfZGVmZXJyZWRfMSA9IHJlcXVpcmUoXCJAa3dzaXRlcy9wcm9taXNlLWRlZmVycmVkXCIpO1xuY29uc3QgZ2l0X2xvZ2dlcl8xID0gcmVxdWlyZShcIi4uL2dpdC1sb2dnZXJcIik7XG5jb25zdCBjcmVhdGVTY2hlZHVsZWRUYXNrID0gKCgpID0+IHtcbiAgICBsZXQgaWQgPSAwO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlkKys7XG4gICAgICAgIGNvbnN0IHsgcHJvbWlzZSwgZG9uZSB9ID0gcHJvbWlzZV9kZWZlcnJlZF8xLmNyZWF0ZURlZmVycmVkKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgZG9uZSxcbiAgICAgICAgICAgIGlkLFxuICAgICAgICB9O1xuICAgIH07XG59KSgpO1xuY2xhc3MgU2NoZWR1bGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25jdXJyZW5jeSA9IDIpIHtcbiAgICAgICAgdGhpcy5jb25jdXJyZW5jeSA9IGNvbmN1cnJlbmN5O1xuICAgICAgICB0aGlzLmxvZ2dlciA9IGdpdF9sb2dnZXJfMS5jcmVhdGVMb2dnZXIoJycsICdzY2hlZHVsZXInKTtcbiAgICAgICAgdGhpcy5wZW5kaW5nID0gW107XG4gICAgICAgIHRoaXMucnVubmluZyA9IFtdO1xuICAgICAgICB0aGlzLmxvZ2dlcihgQ29uc3RydWN0ZWQsIGNvbmN1cnJlbmN5PSVzYCwgY29uY3VycmVuY3kpO1xuICAgIH1cbiAgICBzY2hlZHVsZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBlbmRpbmcubGVuZ3RoIHx8IHRoaXMucnVubmluZy5sZW5ndGggPj0gdGhpcy5jb25jdXJyZW5jeSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIoYFNjaGVkdWxlIGF0dGVtcHQgaWdub3JlZCwgcGVuZGluZz0lcyBydW5uaW5nPSVzIGNvbmN1cnJlbmN5PSVzYCwgdGhpcy5wZW5kaW5nLmxlbmd0aCwgdGhpcy5ydW5uaW5nLmxlbmd0aCwgdGhpcy5jb25jdXJyZW5jeSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFzayA9IHV0aWxzXzEuYXBwZW5kKHRoaXMucnVubmluZywgdGhpcy5wZW5kaW5nLnNoaWZ0KCkpO1xuICAgICAgICB0aGlzLmxvZ2dlcihgQXR0ZW1wdGluZyBpZD0lc2AsIHRhc2suaWQpO1xuICAgICAgICB0YXNrLmRvbmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIoYENvbXBsZXRpbmcgaWQ9YCwgdGFzay5pZCk7XG4gICAgICAgICAgICB1dGlsc18xLnJlbW92ZSh0aGlzLnJ1bm5pbmcsIHRhc2spO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmV4dCgpIHtcbiAgICAgICAgY29uc3QgeyBwcm9taXNlLCBpZCB9ID0gdXRpbHNfMS5hcHBlbmQodGhpcy5wZW5kaW5nLCBjcmVhdGVTY2hlZHVsZWRUYXNrKCkpO1xuICAgICAgICB0aGlzLmxvZ2dlcihgU2NoZWR1bGluZyBpZD0lc2AsIGlkKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZSgpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG59XG5leHBvcnRzLlNjaGVkdWxlciA9IFNjaGVkdWxlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjaGVkdWxlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYXBwbHlQYXRjaFRhc2sgPSB2b2lkIDA7XG5jb25zdCB0YXNrXzEgPSByZXF1aXJlKFwiLi90YXNrXCIpO1xuZnVuY3Rpb24gYXBwbHlQYXRjaFRhc2socGF0Y2hlcywgY3VzdG9tQXJncykge1xuICAgIHJldHVybiB0YXNrXzEuc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhbJ2FwcGx5JywgLi4uY3VzdG9tQXJncywgLi4ucGF0Y2hlc10pO1xufVxuZXhwb3J0cy5hcHBseVBhdGNoVGFzayA9IGFwcGx5UGF0Y2hUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwbHktcGF0Y2guanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzU2luZ2xlQnJhbmNoRGVsZXRlRmFpbHVyZSA9IGV4cG9ydHMuYnJhbmNoRGVsZXRpb25GYWlsdXJlID0gZXhwb3J0cy5icmFuY2hEZWxldGlvblN1Y2Nlc3MgPSBleHBvcnRzLkJyYW5jaERlbGV0aW9uQmF0Y2ggPSB2b2lkIDA7XG5jbGFzcyBCcmFuY2hEZWxldGlvbkJhdGNoIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5hbGwgPSBbXTtcbiAgICAgICAgdGhpcy5icmFuY2hlcyA9IHt9O1xuICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgIH1cbiAgICBnZXQgc3VjY2VzcygpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmVycm9ycy5sZW5ndGg7XG4gICAgfVxufVxuZXhwb3J0cy5CcmFuY2hEZWxldGlvbkJhdGNoID0gQnJhbmNoRGVsZXRpb25CYXRjaDtcbmZ1bmN0aW9uIGJyYW5jaERlbGV0aW9uU3VjY2VzcyhicmFuY2gsIGhhc2gpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBicmFuY2gsIGhhc2gsIHN1Y2Nlc3M6IHRydWUsXG4gICAgfTtcbn1cbmV4cG9ydHMuYnJhbmNoRGVsZXRpb25TdWNjZXNzID0gYnJhbmNoRGVsZXRpb25TdWNjZXNzO1xuZnVuY3Rpb24gYnJhbmNoRGVsZXRpb25GYWlsdXJlKGJyYW5jaCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGJyYW5jaCwgaGFzaDogbnVsbCwgc3VjY2VzczogZmFsc2UsXG4gICAgfTtcbn1cbmV4cG9ydHMuYnJhbmNoRGVsZXRpb25GYWlsdXJlID0gYnJhbmNoRGVsZXRpb25GYWlsdXJlO1xuZnVuY3Rpb24gaXNTaW5nbGVCcmFuY2hEZWxldGVGYWlsdXJlKHRlc3QpIHtcbiAgICByZXR1cm4gdGVzdC5zdWNjZXNzO1xufVxuZXhwb3J0cy5pc1NpbmdsZUJyYW5jaERlbGV0ZUZhaWx1cmUgPSBpc1NpbmdsZUJyYW5jaERlbGV0ZUZhaWx1cmU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1CcmFuY2hEZWxldGVTdW1tYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5oYXNCcmFuY2hEZWxldGlvbkVycm9yID0gZXhwb3J0cy5wYXJzZUJyYW5jaERlbGV0aW9ucyA9IHZvaWQgMDtcbmNvbnN0IEJyYW5jaERlbGV0ZVN1bW1hcnlfMSA9IHJlcXVpcmUoXCIuLi9yZXNwb25zZXMvQnJhbmNoRGVsZXRlU3VtbWFyeVwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5jb25zdCBkZWxldGVTdWNjZXNzUmVnZXggPSAvKFxcUyspXFxzK1xcKFxcUytcXHMoW14pXSspXFwpLztcbmNvbnN0IGRlbGV0ZUVycm9yUmVnZXggPSAvXmVycm9yW14nXSsnKFteJ10rKScvbTtcbmNvbnN0IHBhcnNlcnMgPSBbXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcihkZWxldGVTdWNjZXNzUmVnZXgsIChyZXN1bHQsIFticmFuY2gsIGhhc2hdKSA9PiB7XG4gICAgICAgIGNvbnN0IGRlbGV0aW9uID0gQnJhbmNoRGVsZXRlU3VtbWFyeV8xLmJyYW5jaERlbGV0aW9uU3VjY2VzcyhicmFuY2gsIGhhc2gpO1xuICAgICAgICByZXN1bHQuYWxsLnB1c2goZGVsZXRpb24pO1xuICAgICAgICByZXN1bHQuYnJhbmNoZXNbYnJhbmNoXSA9IGRlbGV0aW9uO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoZGVsZXRlRXJyb3JSZWdleCwgKHJlc3VsdCwgW2JyYW5jaF0pID0+IHtcbiAgICAgICAgY29uc3QgZGVsZXRpb24gPSBCcmFuY2hEZWxldGVTdW1tYXJ5XzEuYnJhbmNoRGVsZXRpb25GYWlsdXJlKGJyYW5jaCk7XG4gICAgICAgIHJlc3VsdC5lcnJvcnMucHVzaChkZWxldGlvbik7XG4gICAgICAgIHJlc3VsdC5hbGwucHVzaChkZWxldGlvbik7XG4gICAgICAgIHJlc3VsdC5icmFuY2hlc1ticmFuY2hdID0gZGVsZXRpb247XG4gICAgfSksXG5dO1xuY29uc3QgcGFyc2VCcmFuY2hEZWxldGlvbnMgPSAoc3RkT3V0LCBzdGRFcnIpID0+IHtcbiAgICByZXR1cm4gdXRpbHNfMS5wYXJzZVN0cmluZ1Jlc3BvbnNlKG5ldyBCcmFuY2hEZWxldGVTdW1tYXJ5XzEuQnJhbmNoRGVsZXRpb25CYXRjaCgpLCBwYXJzZXJzLCBzdGRPdXQsIHN0ZEVycik7XG59O1xuZXhwb3J0cy5wYXJzZUJyYW5jaERlbGV0aW9ucyA9IHBhcnNlQnJhbmNoRGVsZXRpb25zO1xuZnVuY3Rpb24gaGFzQnJhbmNoRGVsZXRpb25FcnJvcihkYXRhLCBwcm9jZXNzRXhpdENvZGUpIHtcbiAgICByZXR1cm4gcHJvY2Vzc0V4aXRDb2RlID09PSB1dGlsc18xLkV4aXRDb2Rlcy5FUlJPUiAmJiBkZWxldGVFcnJvclJlZ2V4LnRlc3QoZGF0YSk7XG59XG5leHBvcnRzLmhhc0JyYW5jaERlbGV0aW9uRXJyb3IgPSBoYXNCcmFuY2hEZWxldGlvbkVycm9yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtYnJhbmNoLWRlbGV0ZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQnJhbmNoU3VtbWFyeVJlc3VsdCA9IHZvaWQgMDtcbmNsYXNzIEJyYW5jaFN1bW1hcnlSZXN1bHQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmFsbCA9IFtdO1xuICAgICAgICB0aGlzLmJyYW5jaGVzID0ge307XG4gICAgICAgIHRoaXMuY3VycmVudCA9ICcnO1xuICAgICAgICB0aGlzLmRldGFjaGVkID0gZmFsc2U7XG4gICAgfVxuICAgIHB1c2goY3VycmVudCwgZGV0YWNoZWQsIG5hbWUsIGNvbW1pdCwgbGFiZWwpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZGV0YWNoZWQgPSBkZXRhY2hlZDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbGwucHVzaChuYW1lKTtcbiAgICAgICAgdGhpcy5icmFuY2hlc1tuYW1lXSA9IHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGN1cnJlbnQsXG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgY29tbWl0OiBjb21taXQsXG4gICAgICAgICAgICBsYWJlbDogbGFiZWxcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnRzLkJyYW5jaFN1bW1hcnlSZXN1bHQgPSBCcmFuY2hTdW1tYXJ5UmVzdWx0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QnJhbmNoU3VtbWFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VCcmFuY2hTdW1tYXJ5ID0gdm9pZCAwO1xuY29uc3QgQnJhbmNoU3VtbWFyeV8xID0gcmVxdWlyZShcIi4uL3Jlc3BvbnNlcy9CcmFuY2hTdW1tYXJ5XCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IHBhcnNlcnMgPSBbXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXihcXCpcXHMpP1xcKCg/OkhFQUQgKT9kZXRhY2hlZCAoPzpmcm9tfGF0KSAoXFxTKylcXClcXHMrKFthLXowLTldKylcXHMoLiopJC8sIChyZXN1bHQsIFtjdXJyZW50LCBuYW1lLCBjb21taXQsIGxhYmVsXSkgPT4ge1xuICAgICAgICByZXN1bHQucHVzaCghIWN1cnJlbnQsIHRydWUsIG5hbWUsIGNvbW1pdCwgbGFiZWwpO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL14oXFwqXFxzKT8oXFxTKylcXHMrKFthLXowLTldKylcXHMoLiopJC9zLCAocmVzdWx0LCBbY3VycmVudCwgbmFtZSwgY29tbWl0LCBsYWJlbF0pID0+IHtcbiAgICAgICAgcmVzdWx0LnB1c2goISFjdXJyZW50LCBmYWxzZSwgbmFtZSwgY29tbWl0LCBsYWJlbCk7XG4gICAgfSlcbl07XG5mdW5jdGlvbiBwYXJzZUJyYW5jaFN1bW1hcnkoc3RkT3V0KSB7XG4gICAgcmV0dXJuIHV0aWxzXzEucGFyc2VTdHJpbmdSZXNwb25zZShuZXcgQnJhbmNoU3VtbWFyeV8xLkJyYW5jaFN1bW1hcnlSZXN1bHQoKSwgcGFyc2Vycywgc3RkT3V0KTtcbn1cbmV4cG9ydHMucGFyc2VCcmFuY2hTdW1tYXJ5ID0gcGFyc2VCcmFuY2hTdW1tYXJ5O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtYnJhbmNoLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWxldGVCcmFuY2hUYXNrID0gZXhwb3J0cy5kZWxldGVCcmFuY2hlc1Rhc2sgPSBleHBvcnRzLmJyYW5jaExvY2FsVGFzayA9IGV4cG9ydHMuYnJhbmNoVGFzayA9IGV4cG9ydHMuY29udGFpbnNEZWxldGVCcmFuY2hDb21tYW5kID0gdm9pZCAwO1xuY29uc3QgZ2l0X3Jlc3BvbnNlX2Vycm9yXzEgPSByZXF1aXJlKFwiLi4vZXJyb3JzL2dpdC1yZXNwb25zZS1lcnJvclwiKTtcbmNvbnN0IHBhcnNlX2JyYW5jaF9kZWxldGVfMSA9IHJlcXVpcmUoXCIuLi9wYXJzZXJzL3BhcnNlLWJyYW5jaC1kZWxldGVcIik7XG5jb25zdCBwYXJzZV9icmFuY2hfMSA9IHJlcXVpcmUoXCIuLi9wYXJzZXJzL3BhcnNlLWJyYW5jaFwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5mdW5jdGlvbiBjb250YWluc0RlbGV0ZUJyYW5jaENvbW1hbmQoY29tbWFuZHMpIHtcbiAgICBjb25zdCBkZWxldGVDb21tYW5kcyA9IFsnLWQnLCAnLUQnLCAnLS1kZWxldGUnXTtcbiAgICByZXR1cm4gY29tbWFuZHMuc29tZShjb21tYW5kID0+IGRlbGV0ZUNvbW1hbmRzLmluY2x1ZGVzKGNvbW1hbmQpKTtcbn1cbmV4cG9ydHMuY29udGFpbnNEZWxldGVCcmFuY2hDb21tYW5kID0gY29udGFpbnNEZWxldGVCcmFuY2hDb21tYW5kO1xuZnVuY3Rpb24gYnJhbmNoVGFzayhjdXN0b21BcmdzKSB7XG4gICAgY29uc3QgaXNEZWxldGUgPSBjb250YWluc0RlbGV0ZUJyYW5jaENvbW1hbmQoY3VzdG9tQXJncyk7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ2JyYW5jaCcsIC4uLmN1c3RvbUFyZ3NdO1xuICAgIGlmIChjb21tYW5kcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29tbWFuZHMucHVzaCgnLWEnKTtcbiAgICB9XG4gICAgaWYgKCFjb21tYW5kcy5pbmNsdWRlcygnLXYnKSkge1xuICAgICAgICBjb21tYW5kcy5zcGxpY2UoMSwgMCwgJy12Jyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgY29tbWFuZHMsXG4gICAgICAgIHBhcnNlcihzdGRPdXQsIHN0ZEVycikge1xuICAgICAgICAgICAgaWYgKGlzRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlX2JyYW5jaF9kZWxldGVfMS5wYXJzZUJyYW5jaERlbGV0aW9ucyhzdGRPdXQsIHN0ZEVycikuYWxsWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlX2JyYW5jaF8xLnBhcnNlQnJhbmNoU3VtbWFyeShzdGRPdXQpO1xuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnRzLmJyYW5jaFRhc2sgPSBicmFuY2hUYXNrO1xuZnVuY3Rpb24gYnJhbmNoTG9jYWxUYXNrKCkge1xuICAgIGNvbnN0IHBhcnNlciA9IHBhcnNlX2JyYW5jaF8xLnBhcnNlQnJhbmNoU3VtbWFyeTtcbiAgICByZXR1cm4ge1xuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIGNvbW1hbmRzOiBbJ2JyYW5jaCcsICctdiddLFxuICAgICAgICBwYXJzZXIsXG4gICAgfTtcbn1cbmV4cG9ydHMuYnJhbmNoTG9jYWxUYXNrID0gYnJhbmNoTG9jYWxUYXNrO1xuZnVuY3Rpb24gZGVsZXRlQnJhbmNoZXNUYXNrKGJyYW5jaGVzLCBmb3JjZURlbGV0ZSA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBjb21tYW5kczogWydicmFuY2gnLCAnLXYnLCBmb3JjZURlbGV0ZSA/ICctRCcgOiAnLWQnLCAuLi5icmFuY2hlc10sXG4gICAgICAgIHBhcnNlcihzdGRPdXQsIHN0ZEVycikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlX2JyYW5jaF9kZWxldGVfMS5wYXJzZUJyYW5jaERlbGV0aW9ucyhzdGRPdXQsIHN0ZEVycik7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXJyb3IoeyBleGl0Q29kZSwgc3RkT3V0IH0sIGVycm9yLCBkb25lLCBmYWlsKSB7XG4gICAgICAgICAgICBpZiAoIXBhcnNlX2JyYW5jaF9kZWxldGVfMS5oYXNCcmFuY2hEZWxldGlvbkVycm9yKFN0cmluZyhlcnJvciksIGV4aXRDb2RlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWlsKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbmUoc3RkT3V0KTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZXhwb3J0cy5kZWxldGVCcmFuY2hlc1Rhc2sgPSBkZWxldGVCcmFuY2hlc1Rhc2s7XG5mdW5jdGlvbiBkZWxldGVCcmFuY2hUYXNrKGJyYW5jaCwgZm9yY2VEZWxldGUgPSBmYWxzZSkge1xuICAgIGNvbnN0IHRhc2sgPSB7XG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgY29tbWFuZHM6IFsnYnJhbmNoJywgJy12JywgZm9yY2VEZWxldGUgPyAnLUQnIDogJy1kJywgYnJhbmNoXSxcbiAgICAgICAgcGFyc2VyKHN0ZE91dCwgc3RkRXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VfYnJhbmNoX2RlbGV0ZV8xLnBhcnNlQnJhbmNoRGVsZXRpb25zKHN0ZE91dCwgc3RkRXJyKS5icmFuY2hlc1ticmFuY2hdO1xuICAgICAgICB9LFxuICAgICAgICBvbkVycm9yKHsgZXhpdENvZGUsIHN0ZEVyciwgc3RkT3V0IH0sIGVycm9yLCBfLCBmYWlsKSB7XG4gICAgICAgICAgICBpZiAoIXBhcnNlX2JyYW5jaF9kZWxldGVfMS5oYXNCcmFuY2hEZWxldGlvbkVycm9yKFN0cmluZyhlcnJvciksIGV4aXRDb2RlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWlsKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IG5ldyBnaXRfcmVzcG9uc2VfZXJyb3JfMS5HaXRSZXNwb25zZUVycm9yKHRhc2sucGFyc2VyKHV0aWxzXzEuYnVmZmVyVG9TdHJpbmcoc3RkT3V0KSwgdXRpbHNfMS5idWZmZXJUb1N0cmluZyhzdGRFcnIpKSwgU3RyaW5nKGVycm9yKSk7XG4gICAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gdGFzaztcbn1cbmV4cG9ydHMuZGVsZXRlQnJhbmNoVGFzayA9IGRlbGV0ZUJyYW5jaFRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1icmFuY2guanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlQ2hlY2tJZ25vcmUgPSB2b2lkIDA7XG4vKipcbiAqIFBhcnNlciBmb3IgdGhlIGBjaGVjay1pZ25vcmVgIGNvbW1hbmQgLSByZXR1cm5zIGVhY2ggZmlsZSBhcyBhIHN0cmluZyBhcnJheVxuICovXG5jb25zdCBwYXJzZUNoZWNrSWdub3JlID0gKHRleHQpID0+IHtcbiAgICByZXR1cm4gdGV4dC5zcGxpdCgvXFxuL2cpXG4gICAgICAgIC5tYXAobGluZSA9PiBsaW5lLnRyaW0oKSlcbiAgICAgICAgLmZpbHRlcihmaWxlID0+ICEhZmlsZSk7XG59O1xuZXhwb3J0cy5wYXJzZUNoZWNrSWdub3JlID0gcGFyc2VDaGVja0lnbm9yZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNoZWNrSWdub3JlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jaGVja0lnbm9yZVRhc2sgPSB2b2lkIDA7XG5jb25zdCBDaGVja0lnbm9yZV8xID0gcmVxdWlyZShcIi4uL3Jlc3BvbnNlcy9DaGVja0lnbm9yZVwiKTtcbmZ1bmN0aW9uIGNoZWNrSWdub3JlVGFzayhwYXRocykge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzOiBbJ2NoZWNrLWlnbm9yZScsIC4uLnBhdGhzXSxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXI6IENoZWNrSWdub3JlXzEucGFyc2VDaGVja0lnbm9yZSxcbiAgICB9O1xufVxuZXhwb3J0cy5jaGVja0lnbm9yZVRhc2sgPSBjaGVja0lnbm9yZVRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jaGVjay1pZ25vcmUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNsb25lTWlycm9yVGFzayA9IGV4cG9ydHMuY2xvbmVUYXNrID0gdm9pZCAwO1xuY29uc3QgdGFza18xID0gcmVxdWlyZShcIi4vdGFza1wiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5mdW5jdGlvbiBjbG9uZVRhc2socmVwbywgZGlyZWN0b3J5LCBjdXN0b21BcmdzKSB7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ2Nsb25lJywgLi4uY3VzdG9tQXJnc107XG4gICAgaWYgKHR5cGVvZiByZXBvID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb21tYW5kcy5wdXNoKHJlcG8pO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGRpcmVjdG9yeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29tbWFuZHMucHVzaChkaXJlY3RvcnkpO1xuICAgIH1cbiAgICByZXR1cm4gdGFza18xLnN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soY29tbWFuZHMpO1xufVxuZXhwb3J0cy5jbG9uZVRhc2sgPSBjbG9uZVRhc2s7XG5mdW5jdGlvbiBjbG9uZU1pcnJvclRhc2socmVwbywgZGlyZWN0b3J5LCBjdXN0b21BcmdzKSB7XG4gICAgdXRpbHNfMS5hcHBlbmQoY3VzdG9tQXJncywgJy0tbWlycm9yJyk7XG4gICAgcmV0dXJuIGNsb25lVGFzayhyZXBvLCBkaXJlY3RvcnksIGN1c3RvbUFyZ3MpO1xufVxuZXhwb3J0cy5jbG9uZU1pcnJvclRhc2sgPSBjbG9uZU1pcnJvclRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jbG9uZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VDb21taXRSZXN1bHQgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgcGFyc2VycyA9IFtcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9eXFxbKFteXFxzXSspKCBcXChbXildK1xcKSk/IChbXlxcXV0rKS8sIChyZXN1bHQsIFticmFuY2gsIHJvb3QsIGNvbW1pdF0pID0+IHtcbiAgICAgICAgcmVzdWx0LmJyYW5jaCA9IGJyYW5jaDtcbiAgICAgICAgcmVzdWx0LmNvbW1pdCA9IGNvbW1pdDtcbiAgICAgICAgcmVzdWx0LnJvb3QgPSAhIXJvb3Q7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXFxzKkF1dGhvcjpcXHMoLispL2ksIChyZXN1bHQsIFthdXRob3JdKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gYXV0aG9yLnNwbGl0KCc8Jyk7XG4gICAgICAgIGNvbnN0IGVtYWlsID0gcGFydHMucG9wKCk7XG4gICAgICAgIGlmICghZW1haWwgfHwgIWVtYWlsLmluY2x1ZGVzKCdAJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuYXV0aG9yID0ge1xuICAgICAgICAgICAgZW1haWw6IGVtYWlsLnN1YnN0cigwLCBlbWFpbC5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIG5hbWU6IHBhcnRzLmpvaW4oJzwnKS50cmltKClcbiAgICAgICAgfTtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC8oXFxkKylbXixdKig/OixcXHMqKFxcZCspW14sXSopKD86LFxccyooXFxkKykpL2csIChyZXN1bHQsIFtjaGFuZ2VzLCBpbnNlcnRpb25zLCBkZWxldGlvbnNdKSA9PiB7XG4gICAgICAgIHJlc3VsdC5zdW1tYXJ5LmNoYW5nZXMgPSBwYXJzZUludChjaGFuZ2VzLCAxMCkgfHwgMDtcbiAgICAgICAgcmVzdWx0LnN1bW1hcnkuaW5zZXJ0aW9ucyA9IHBhcnNlSW50KGluc2VydGlvbnMsIDEwKSB8fCAwO1xuICAgICAgICByZXN1bHQuc3VtbWFyeS5kZWxldGlvbnMgPSBwYXJzZUludChkZWxldGlvbnMsIDEwKSB8fCAwO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL14oXFxkKylbXixdKig/OixcXHMqKFxcZCspW14oXStcXCgoWystXSkpPy8sIChyZXN1bHQsIFtjaGFuZ2VzLCBsaW5lcywgZGlyZWN0aW9uXSkgPT4ge1xuICAgICAgICByZXN1bHQuc3VtbWFyeS5jaGFuZ2VzID0gcGFyc2VJbnQoY2hhbmdlcywgMTApIHx8IDA7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gcGFyc2VJbnQobGluZXMsIDEwKSB8fCAwO1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnLScpIHtcbiAgICAgICAgICAgIHJlc3VsdC5zdW1tYXJ5LmRlbGV0aW9ucyA9IGNvdW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgICByZXN1bHQuc3VtbWFyeS5pbnNlcnRpb25zID0gY291bnQ7XG4gICAgICAgIH1cbiAgICB9KSxcbl07XG5mdW5jdGlvbiBwYXJzZUNvbW1pdFJlc3VsdChzdGRPdXQpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgIGF1dGhvcjogbnVsbCxcbiAgICAgICAgYnJhbmNoOiAnJyxcbiAgICAgICAgY29tbWl0OiAnJyxcbiAgICAgICAgcm9vdDogZmFsc2UsXG4gICAgICAgIHN1bW1hcnk6IHtcbiAgICAgICAgICAgIGNoYW5nZXM6IDAsXG4gICAgICAgICAgICBpbnNlcnRpb25zOiAwLFxuICAgICAgICAgICAgZGVsZXRpb25zOiAwLFxuICAgICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIHV0aWxzXzEucGFyc2VTdHJpbmdSZXNwb25zZShyZXN1bHQsIHBhcnNlcnMsIHN0ZE91dCk7XG59XG5leHBvcnRzLnBhcnNlQ29tbWl0UmVzdWx0ID0gcGFyc2VDb21taXRSZXN1bHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1jb21taXQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNvbW1pdFRhc2sgPSB2b2lkIDA7XG5jb25zdCBwYXJzZV9jb21taXRfMSA9IHJlcXVpcmUoXCIuLi9wYXJzZXJzL3BhcnNlLWNvbW1pdFwiKTtcbmZ1bmN0aW9uIGNvbW1pdFRhc2sobWVzc2FnZSwgZmlsZXMsIGN1c3RvbUFyZ3MpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsnY29tbWl0J107XG4gICAgbWVzc2FnZS5mb3JFYWNoKChtKSA9PiBjb21tYW5kcy5wdXNoKCctbScsIG0pKTtcbiAgICBjb21tYW5kcy5wdXNoKC4uLmZpbGVzLCAuLi5jdXN0b21BcmdzKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kcyxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXI6IHBhcnNlX2NvbW1pdF8xLnBhcnNlQ29tbWl0UmVzdWx0LFxuICAgIH07XG59XG5leHBvcnRzLmNvbW1pdFRhc2sgPSBjb21taXRUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tbWl0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kaWZmU3VtbWFyeVRhc2sgPSB2b2lkIDA7XG5jb25zdCBwYXJzZV9kaWZmX3N1bW1hcnlfMSA9IHJlcXVpcmUoXCIuLi9wYXJzZXJzL3BhcnNlLWRpZmYtc3VtbWFyeVwiKTtcbmZ1bmN0aW9uIGRpZmZTdW1tYXJ5VGFzayhjdXN0b21BcmdzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHM6IFsnZGlmZicsICctLXN0YXQ9NDA5NicsIC4uLmN1c3RvbUFyZ3NdLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcihzdGRPdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZV9kaWZmX3N1bW1hcnlfMS5wYXJzZURpZmZSZXN1bHQoc3RkT3V0KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmRpZmZTdW1tYXJ5VGFzayA9IGRpZmZTdW1tYXJ5VGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpZmYuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlRmV0Y2hSZXN1bHQgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgcGFyc2VycyA9IFtcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9Gcm9tICguKykkLywgKHJlc3VsdCwgW3JlbW90ZV0pID0+IHtcbiAgICAgICAgcmVzdWx0LnJlbW90ZSA9IHJlbW90ZTtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9cXCogXFxbbmV3IGJyYW5jaF1cXHMrKFxcUyspXFxzKi0+ICguKykkLywgKHJlc3VsdCwgW25hbWUsIHRyYWNraW5nXSkgPT4ge1xuICAgICAgICByZXN1bHQuYnJhbmNoZXMucHVzaCh7XG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgdHJhY2tpbmcsXG4gICAgICAgIH0pO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL1xcKiBcXFtuZXcgdGFnXVxccysoXFxTKylcXHMqLT4gKC4rKSQvLCAocmVzdWx0LCBbbmFtZSwgdHJhY2tpbmddKSA9PiB7XG4gICAgICAgIHJlc3VsdC50YWdzLnB1c2goe1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIHRyYWNraW5nLFxuICAgICAgICB9KTtcbiAgICB9KVxuXTtcbmZ1bmN0aW9uIHBhcnNlRmV0Y2hSZXN1bHQoc3RkT3V0LCBzdGRFcnIpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgIHJhdzogc3RkT3V0LFxuICAgICAgICByZW1vdGU6IG51bGwsXG4gICAgICAgIGJyYW5jaGVzOiBbXSxcbiAgICAgICAgdGFnczogW10sXG4gICAgfTtcbiAgICByZXR1cm4gdXRpbHNfMS5wYXJzZVN0cmluZ1Jlc3BvbnNlKHJlc3VsdCwgcGFyc2Vycywgc3RkT3V0LCBzdGRFcnIpO1xufVxuZXhwb3J0cy5wYXJzZUZldGNoUmVzdWx0ID0gcGFyc2VGZXRjaFJlc3VsdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLWZldGNoLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5mZXRjaFRhc2sgPSB2b2lkIDA7XG5jb25zdCBwYXJzZV9mZXRjaF8xID0gcmVxdWlyZShcIi4uL3BhcnNlcnMvcGFyc2UtZmV0Y2hcIik7XG5mdW5jdGlvbiBmZXRjaFRhc2socmVtb3RlLCBicmFuY2gsIGN1c3RvbUFyZ3MpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsnZmV0Y2gnLCAuLi5jdXN0b21BcmdzXTtcbiAgICBpZiAocmVtb3RlICYmIGJyYW5jaCkge1xuICAgICAgICBjb21tYW5kcy5wdXNoKHJlbW90ZSwgYnJhbmNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHMsXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgcGFyc2VyOiBwYXJzZV9mZXRjaF8xLnBhcnNlRmV0Y2hSZXN1bHQsXG4gICAgfTtcbn1cbmV4cG9ydHMuZmV0Y2hUYXNrID0gZmV0Y2hUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmV0Y2guanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlTW92ZVJlc3VsdCA9IHZvaWQgMDtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5jb25zdCBwYXJzZXJzID0gW1xuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL15SZW5hbWluZyAoLispIHRvICguKykkLywgKHJlc3VsdCwgW2Zyb20sIHRvXSkgPT4ge1xuICAgICAgICByZXN1bHQubW92ZXMucHVzaCh7IGZyb20sIHRvIH0pO1xuICAgIH0pLFxuXTtcbmZ1bmN0aW9uIHBhcnNlTW92ZVJlc3VsdChzdGRPdXQpIHtcbiAgICByZXR1cm4gdXRpbHNfMS5wYXJzZVN0cmluZ1Jlc3BvbnNlKHsgbW92ZXM6IFtdIH0sIHBhcnNlcnMsIHN0ZE91dCk7XG59XG5leHBvcnRzLnBhcnNlTW92ZVJlc3VsdCA9IHBhcnNlTW92ZVJlc3VsdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLW1vdmUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1vdmVUYXNrID0gdm9pZCAwO1xuY29uc3QgcGFyc2VfbW92ZV8xID0gcmVxdWlyZShcIi4uL3BhcnNlcnMvcGFyc2UtbW92ZVwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5mdW5jdGlvbiBtb3ZlVGFzayhmcm9tLCB0bykge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzOiBbJ212JywgJy12JywgLi4udXRpbHNfMS5hc0FycmF5KGZyb20pLCB0b10sXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgcGFyc2VyOiBwYXJzZV9tb3ZlXzEucGFyc2VNb3ZlUmVzdWx0LFxuICAgIH07XG59XG5leHBvcnRzLm1vdmVUYXNrID0gbW92ZVRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tb3ZlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wdWxsVGFzayA9IHZvaWQgMDtcbmNvbnN0IHBhcnNlX3B1bGxfMSA9IHJlcXVpcmUoXCIuLi9wYXJzZXJzL3BhcnNlLXB1bGxcIik7XG5mdW5jdGlvbiBwdWxsVGFzayhyZW1vdGUsIGJyYW5jaCwgY3VzdG9tQXJncykge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWydwdWxsJywgLi4uY3VzdG9tQXJnc107XG4gICAgaWYgKHJlbW90ZSAmJiBicmFuY2gpIHtcbiAgICAgICAgY29tbWFuZHMuc3BsaWNlKDEsIDAsIHJlbW90ZSwgYnJhbmNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHMsXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgcGFyc2VyKHN0ZE91dCwgc3RkRXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VfcHVsbF8xLnBhcnNlUHVsbFJlc3VsdChzdGRPdXQsIHN0ZEVycik7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5wdWxsVGFzayA9IHB1bGxUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHVsbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VHZXRSZW1vdGVzVmVyYm9zZSA9IGV4cG9ydHMucGFyc2VHZXRSZW1vdGVzID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmZ1bmN0aW9uIHBhcnNlR2V0UmVtb3Rlcyh0ZXh0KSB7XG4gICAgY29uc3QgcmVtb3RlcyA9IHt9O1xuICAgIGZvckVhY2godGV4dCwgKFtuYW1lXSkgPT4gcmVtb3Rlc1tuYW1lXSA9IHsgbmFtZSB9KTtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhyZW1vdGVzKTtcbn1cbmV4cG9ydHMucGFyc2VHZXRSZW1vdGVzID0gcGFyc2VHZXRSZW1vdGVzO1xuZnVuY3Rpb24gcGFyc2VHZXRSZW1vdGVzVmVyYm9zZSh0ZXh0KSB7XG4gICAgY29uc3QgcmVtb3RlcyA9IHt9O1xuICAgIGZvckVhY2godGV4dCwgKFtuYW1lLCB1cmwsIHB1cnBvc2VdKSA9PiB7XG4gICAgICAgIGlmICghcmVtb3Rlcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgICAgcmVtb3Rlc1tuYW1lXSA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgIHJlZnM6IHsgZmV0Y2g6ICcnLCBwdXNoOiAnJyB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHVycG9zZSAmJiB1cmwpIHtcbiAgICAgICAgICAgIHJlbW90ZXNbbmFtZV0ucmVmc1twdXJwb3NlLnJlcGxhY2UoL1teYS16XS9nLCAnJyldID0gdXJsO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMocmVtb3Rlcyk7XG59XG5leHBvcnRzLnBhcnNlR2V0UmVtb3Rlc1ZlcmJvc2UgPSBwYXJzZUdldFJlbW90ZXNWZXJib3NlO1xuZnVuY3Rpb24gZm9yRWFjaCh0ZXh0LCBoYW5kbGVyKSB7XG4gICAgdXRpbHNfMS5mb3JFYWNoTGluZVdpdGhDb250ZW50KHRleHQsIChsaW5lKSA9PiBoYW5kbGVyKGxpbmUuc3BsaXQoL1xccysvKSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9R2V0UmVtb3RlU3VtbWFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVtb3ZlUmVtb3RlVGFzayA9IGV4cG9ydHMucmVtb3RlVGFzayA9IGV4cG9ydHMubGlzdFJlbW90ZXNUYXNrID0gZXhwb3J0cy5nZXRSZW1vdGVzVGFzayA9IGV4cG9ydHMuYWRkUmVtb3RlVGFzayA9IHZvaWQgMDtcbmNvbnN0IEdldFJlbW90ZVN1bW1hcnlfMSA9IHJlcXVpcmUoXCIuLi9yZXNwb25zZXMvR2V0UmVtb3RlU3VtbWFyeVwiKTtcbmNvbnN0IHRhc2tfMSA9IHJlcXVpcmUoXCIuL3Rhc2tcIik7XG5mdW5jdGlvbiBhZGRSZW1vdGVUYXNrKHJlbW90ZU5hbWUsIHJlbW90ZVJlcG8sIGN1c3RvbUFyZ3MgPSBbXSkge1xuICAgIHJldHVybiB0YXNrXzEuc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhbJ3JlbW90ZScsICdhZGQnLCAuLi5jdXN0b21BcmdzLCByZW1vdGVOYW1lLCByZW1vdGVSZXBvXSk7XG59XG5leHBvcnRzLmFkZFJlbW90ZVRhc2sgPSBhZGRSZW1vdGVUYXNrO1xuZnVuY3Rpb24gZ2V0UmVtb3Rlc1Rhc2sodmVyYm9zZSkge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWydyZW1vdGUnXTtcbiAgICBpZiAodmVyYm9zZSkge1xuICAgICAgICBjb21tYW5kcy5wdXNoKCctdicpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kcyxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXI6IHZlcmJvc2UgPyBHZXRSZW1vdGVTdW1tYXJ5XzEucGFyc2VHZXRSZW1vdGVzVmVyYm9zZSA6IEdldFJlbW90ZVN1bW1hcnlfMS5wYXJzZUdldFJlbW90ZXMsXG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0UmVtb3Rlc1Rhc2sgPSBnZXRSZW1vdGVzVGFzaztcbmZ1bmN0aW9uIGxpc3RSZW1vdGVzVGFzayhjdXN0b21BcmdzID0gW10pIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsuLi5jdXN0b21BcmdzXTtcbiAgICBpZiAoY29tbWFuZHNbMF0gIT09ICdscy1yZW1vdGUnKSB7XG4gICAgICAgIGNvbW1hbmRzLnVuc2hpZnQoJ2xzLXJlbW90ZScpO1xuICAgIH1cbiAgICByZXR1cm4gdGFza18xLnN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soY29tbWFuZHMpO1xufVxuZXhwb3J0cy5saXN0UmVtb3Rlc1Rhc2sgPSBsaXN0UmVtb3Rlc1Rhc2s7XG5mdW5jdGlvbiByZW1vdGVUYXNrKGN1c3RvbUFyZ3MgPSBbXSkge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWy4uLmN1c3RvbUFyZ3NdO1xuICAgIGlmIChjb21tYW5kc1swXSAhPT0gJ3JlbW90ZScpIHtcbiAgICAgICAgY29tbWFuZHMudW5zaGlmdCgncmVtb3RlJyk7XG4gICAgfVxuICAgIHJldHVybiB0YXNrXzEuc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kcyk7XG59XG5leHBvcnRzLnJlbW90ZVRhc2sgPSByZW1vdGVUYXNrO1xuZnVuY3Rpb24gcmVtb3ZlUmVtb3RlVGFzayhyZW1vdGVOYW1lKSB7XG4gICAgcmV0dXJuIHRhc2tfMS5zdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsncmVtb3RlJywgJ3JlbW92ZScsIHJlbW90ZU5hbWVdKTtcbn1cbmV4cG9ydHMucmVtb3ZlUmVtb3RlVGFzayA9IHJlbW92ZVJlbW90ZVRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZW1vdGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnN0YXNoTGlzdFRhc2sgPSB2b2lkIDA7XG5jb25zdCBwYXJzZV9saXN0X2xvZ19zdW1tYXJ5XzEgPSByZXF1aXJlKFwiLi4vcGFyc2Vycy9wYXJzZS1saXN0LWxvZy1zdW1tYXJ5XCIpO1xuY29uc3QgbG9nXzEgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5mdW5jdGlvbiBzdGFzaExpc3RUYXNrKG9wdCA9IHt9LCBjdXN0b21BcmdzKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGxvZ18xLnBhcnNlTG9nT3B0aW9ucyhvcHQpO1xuICAgIGNvbnN0IHBhcnNlciA9IHBhcnNlX2xpc3RfbG9nX3N1bW1hcnlfMS5jcmVhdGVMaXN0TG9nU3VtbWFyeVBhcnNlcihvcHRpb25zLnNwbGl0dGVyLCBvcHRpb25zLmZpZWxkcyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHM6IFsnc3Rhc2gnLCAnbGlzdCcsIC4uLm9wdGlvbnMuY29tbWFuZHMsIC4uLmN1c3RvbUFyZ3NdLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcixcbiAgICB9O1xufVxuZXhwb3J0cy5zdGFzaExpc3RUYXNrID0gc3Rhc2hMaXN0VGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0YXNoLWxpc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVwZGF0ZVN1Yk1vZHVsZVRhc2sgPSBleHBvcnRzLnN1Yk1vZHVsZVRhc2sgPSBleHBvcnRzLmluaXRTdWJNb2R1bGVUYXNrID0gZXhwb3J0cy5hZGRTdWJNb2R1bGVUYXNrID0gdm9pZCAwO1xuY29uc3QgdGFza18xID0gcmVxdWlyZShcIi4vdGFza1wiKTtcbmZ1bmN0aW9uIGFkZFN1Yk1vZHVsZVRhc2socmVwbywgcGF0aCkge1xuICAgIHJldHVybiBzdWJNb2R1bGVUYXNrKFsnYWRkJywgcmVwbywgcGF0aF0pO1xufVxuZXhwb3J0cy5hZGRTdWJNb2R1bGVUYXNrID0gYWRkU3ViTW9kdWxlVGFzaztcbmZ1bmN0aW9uIGluaXRTdWJNb2R1bGVUYXNrKGN1c3RvbUFyZ3MpIHtcbiAgICByZXR1cm4gc3ViTW9kdWxlVGFzayhbJ2luaXQnLCAuLi5jdXN0b21BcmdzXSk7XG59XG5leHBvcnRzLmluaXRTdWJNb2R1bGVUYXNrID0gaW5pdFN1Yk1vZHVsZVRhc2s7XG5mdW5jdGlvbiBzdWJNb2R1bGVUYXNrKGN1c3RvbUFyZ3MpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsuLi5jdXN0b21BcmdzXTtcbiAgICBpZiAoY29tbWFuZHNbMF0gIT09ICdzdWJtb2R1bGUnKSB7XG4gICAgICAgIGNvbW1hbmRzLnVuc2hpZnQoJ3N1Ym1vZHVsZScpO1xuICAgIH1cbiAgICByZXR1cm4gdGFza18xLnN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soY29tbWFuZHMpO1xufVxuZXhwb3J0cy5zdWJNb2R1bGVUYXNrID0gc3ViTW9kdWxlVGFzaztcbmZ1bmN0aW9uIHVwZGF0ZVN1Yk1vZHVsZVRhc2soY3VzdG9tQXJncykge1xuICAgIHJldHVybiBzdWJNb2R1bGVUYXNrKFsndXBkYXRlJywgLi4uY3VzdG9tQXJnc10pO1xufVxuZXhwb3J0cy51cGRhdGVTdWJNb2R1bGVUYXNrID0gdXBkYXRlU3ViTW9kdWxlVGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN1Yi1tb2R1bGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlVGFnTGlzdCA9IGV4cG9ydHMuVGFnTGlzdCA9IHZvaWQgMDtcbmNsYXNzIFRhZ0xpc3Qge1xuICAgIGNvbnN0cnVjdG9yKGFsbCwgbGF0ZXN0KSB7XG4gICAgICAgIHRoaXMuYWxsID0gYWxsO1xuICAgICAgICB0aGlzLmxhdGVzdCA9IGxhdGVzdDtcbiAgICB9XG59XG5leHBvcnRzLlRhZ0xpc3QgPSBUYWdMaXN0O1xuY29uc3QgcGFyc2VUYWdMaXN0ID0gZnVuY3Rpb24gKGRhdGEsIGN1c3RvbVNvcnQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHRhZ3MgPSBkYXRhXG4gICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgLm1hcCh0cmltbWVkKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmICghY3VzdG9tU29ydCkge1xuICAgICAgICB0YWdzLnNvcnQoZnVuY3Rpb24gKHRhZ0EsIHRhZ0IpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzQSA9IHRhZ0Euc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzQiA9IHRhZ0Iuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmIChwYXJ0c0EubGVuZ3RoID09PSAxIHx8IHBhcnRzQi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlU29ydGVkKHRvTnVtYmVyKHBhcnRzQVswXSksIHRvTnVtYmVyKHBhcnRzQlswXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBNYXRoLm1heChwYXJ0c0EubGVuZ3RoLCBwYXJ0c0IubGVuZ3RoKTsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmYgPSBzb3J0ZWQodG9OdW1iZXIocGFydHNBW2ldKSwgdG9OdW1iZXIocGFydHNCW2ldKSk7XG4gICAgICAgICAgICAgICAgaWYgKGRpZmYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpZmY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBsYXRlc3QgPSBjdXN0b21Tb3J0ID8gdGFnc1swXSA6IFsuLi50YWdzXS5yZXZlcnNlKCkuZmluZCgodGFnKSA9PiB0YWcuaW5kZXhPZignLicpID49IDApO1xuICAgIHJldHVybiBuZXcgVGFnTGlzdCh0YWdzLCBsYXRlc3QpO1xufTtcbmV4cG9ydHMucGFyc2VUYWdMaXN0ID0gcGFyc2VUYWdMaXN0O1xuZnVuY3Rpb24gc2luZ2xlU29ydGVkKGEsIGIpIHtcbiAgICBjb25zdCBhSXNOdW0gPSBpc05hTihhKTtcbiAgICBjb25zdCBiSXNOdW0gPSBpc05hTihiKTtcbiAgICBpZiAoYUlzTnVtICE9PSBiSXNOdW0pIHtcbiAgICAgICAgcmV0dXJuIGFJc051bSA/IDEgOiAtMTtcbiAgICB9XG4gICAgcmV0dXJuIGFJc051bSA/IHNvcnRlZChhLCBiKSA6IDA7XG59XG5mdW5jdGlvbiBzb3J0ZWQoYSwgYikge1xuICAgIHJldHVybiBhID09PSBiID8gMCA6IGEgPiBiID8gMSA6IC0xO1xufVxuZnVuY3Rpb24gdHJpbW1lZChpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dC50cmltKCk7XG59XG5mdW5jdGlvbiB0b051bWJlcihpbnB1dCkge1xuICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChpbnB1dC5yZXBsYWNlKC9eXFxEKy9nLCAnJyksIDEwKSB8fCAwO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRhZ0xpc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZEFubm90YXRlZFRhZ1Rhc2sgPSBleHBvcnRzLmFkZFRhZ1Rhc2sgPSBleHBvcnRzLnRhZ0xpc3RUYXNrID0gdm9pZCAwO1xuY29uc3QgVGFnTGlzdF8xID0gcmVxdWlyZShcIi4uL3Jlc3BvbnNlcy9UYWdMaXN0XCIpO1xuLyoqXG4gKiBUYXNrIHVzZWQgYnkgYGdpdC50YWdzYFxuICovXG5mdW5jdGlvbiB0YWdMaXN0VGFzayhjdXN0b21BcmdzID0gW10pIHtcbiAgICBjb25zdCBoYXNDdXN0b21Tb3J0ID0gY3VzdG9tQXJncy5zb21lKChvcHRpb24pID0+IC9eLS1zb3J0PS8udGVzdChvcHRpb24pKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIGNvbW1hbmRzOiBbJ3RhZycsICctbCcsIC4uLmN1c3RvbUFyZ3NdLFxuICAgICAgICBwYXJzZXIodGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIFRhZ0xpc3RfMS5wYXJzZVRhZ0xpc3QodGV4dCwgaGFzQ3VzdG9tU29ydCk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydHMudGFnTGlzdFRhc2sgPSB0YWdMaXN0VGFzaztcbi8qKlxuICogVGFzayB1c2VkIGJ5IGBnaXQuYWRkVGFnYFxuICovXG5mdW5jdGlvbiBhZGRUYWdUYXNrKG5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIGNvbW1hbmRzOiBbJ3RhZycsIG5hbWVdLFxuICAgICAgICBwYXJzZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lIH07XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5hZGRUYWdUYXNrID0gYWRkVGFnVGFzaztcbi8qKlxuICogVGFzayB1c2VkIGJ5IGBnaXQuYWRkVGFnYFxuICovXG5mdW5jdGlvbiBhZGRBbm5vdGF0ZWRUYWdUYXNrKG5hbWUsIHRhZ01lc3NhZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIGNvbW1hbmRzOiBbJ3RhZycsICctYScsICctbScsIHRhZ01lc3NhZ2UsIG5hbWVdLFxuICAgICAgICBwYXJzZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lIH07XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5hZGRBbm5vdGF0ZWRUYWdUYXNrID0gYWRkQW5ub3RhdGVkVGFnVGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhZy5qcy5tYXAiLCJjb25zdCB7R2l0RXhlY3V0b3J9ID0gcmVxdWlyZSgnLi9saWIvcnVubmVycy9naXQtZXhlY3V0b3InKTtcbmNvbnN0IHtTaW1wbGVHaXRBcGl9ID0gcmVxdWlyZSgnLi9saWIvc2ltcGxlLWdpdC1hcGknKTtcblxuY29uc3Qge1NjaGVkdWxlcn0gPSByZXF1aXJlKCcuL2xpYi9ydW5uZXJzL3NjaGVkdWxlcicpO1xuY29uc3Qge0dpdExvZ2dlcn0gPSByZXF1aXJlKCcuL2xpYi9naXQtbG9nZ2VyJyk7XG5jb25zdCB7Y29uZmlndXJhdGlvbkVycm9yVGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy90YXNrJyk7XG5jb25zdCB7XG4gICBhc0FycmF5LFxuICAgZmlsdGVyQXJyYXksXG4gICBmaWx0ZXJQcmltaXRpdmVzLFxuICAgZmlsdGVyU3RyaW5nLFxuICAgZmlsdGVyU3RyaW5nT3JTdHJpbmdBcnJheSxcbiAgIGZpbHRlclR5cGUsXG4gICBnZXRUcmFpbGluZ09wdGlvbnMsXG4gICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQsXG4gICB0cmFpbGluZ09wdGlvbnNBcmd1bWVudFxufSA9IHJlcXVpcmUoJy4vbGliL3V0aWxzJyk7XG5jb25zdCB7YXBwbHlQYXRjaFRhc2t9ID0gcmVxdWlyZSgnLi9saWIvdGFza3MvYXBwbHktcGF0Y2gnKVxuY29uc3Qge2JyYW5jaFRhc2ssIGJyYW5jaExvY2FsVGFzaywgZGVsZXRlQnJhbmNoZXNUYXNrLCBkZWxldGVCcmFuY2hUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL2JyYW5jaCcpO1xuY29uc3Qge2NoZWNrSWdub3JlVGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy9jaGVjay1pZ25vcmUnKTtcbmNvbnN0IHtjaGVja0lzUmVwb1Rhc2t9ID0gcmVxdWlyZSgnLi9saWIvdGFza3MvY2hlY2staXMtcmVwbycpO1xuY29uc3Qge2Nsb25lVGFzaywgY2xvbmVNaXJyb3JUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL2Nsb25lJyk7XG5jb25zdCB7Y2xlYW5XaXRoT3B0aW9uc1Rhc2ssIGlzQ2xlYW5PcHRpb25zQXJyYXl9ID0gcmVxdWlyZSgnLi9saWIvdGFza3MvY2xlYW4nKTtcbmNvbnN0IHtjb21taXRUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL2NvbW1pdCcpO1xuY29uc3Qge2RpZmZTdW1tYXJ5VGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy9kaWZmJyk7XG5jb25zdCB7ZmV0Y2hUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL2ZldGNoJyk7XG5jb25zdCB7bW92ZVRhc2t9ID0gcmVxdWlyZShcIi4vbGliL3Rhc2tzL21vdmVcIik7XG5jb25zdCB7cHVsbFRhc2t9ID0gcmVxdWlyZSgnLi9saWIvdGFza3MvcHVsbCcpO1xuY29uc3Qge3B1c2hUYWdzVGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy9wdXNoJyk7XG5jb25zdCB7YWRkUmVtb3RlVGFzaywgZ2V0UmVtb3Rlc1Rhc2ssIGxpc3RSZW1vdGVzVGFzaywgcmVtb3RlVGFzaywgcmVtb3ZlUmVtb3RlVGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy9yZW1vdGUnKTtcbmNvbnN0IHtnZXRSZXNldE1vZGUsIHJlc2V0VGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy9yZXNldCcpO1xuY29uc3Qge3N0YXNoTGlzdFRhc2t9ID0gcmVxdWlyZSgnLi9saWIvdGFza3Mvc3Rhc2gtbGlzdCcpO1xuY29uc3Qge2FkZFN1Yk1vZHVsZVRhc2ssIGluaXRTdWJNb2R1bGVUYXNrLCBzdWJNb2R1bGVUYXNrLCB1cGRhdGVTdWJNb2R1bGVUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL3N1Yi1tb2R1bGUnKTtcbmNvbnN0IHthZGRBbm5vdGF0ZWRUYWdUYXNrLCBhZGRUYWdUYXNrLCB0YWdMaXN0VGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy90YWcnKTtcbmNvbnN0IHtzdHJhaWdodFRocm91Z2hCdWZmZXJUYXNrLCBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL3Rhc2snKTtcblxuZnVuY3Rpb24gR2l0IChvcHRpb25zLCBwbHVnaW5zKSB7XG4gICB0aGlzLl9leGVjdXRvciA9IG5ldyBHaXRFeGVjdXRvcihcbiAgICAgIG9wdGlvbnMuYmluYXJ5LCBvcHRpb25zLmJhc2VEaXIsXG4gICAgICBuZXcgU2NoZWR1bGVyKG9wdGlvbnMubWF4Q29uY3VycmVudFByb2Nlc3NlcyksIHBsdWdpbnMsXG4gICApO1xuICAgdGhpcy5fbG9nZ2VyID0gbmV3IEdpdExvZ2dlcigpO1xufVxuXG4oR2l0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU2ltcGxlR2l0QXBpLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yID0gR2l0O1xuXG4vKipcbiAqIExvZ2dpbmcgdXRpbGl0eSBmb3IgcHJpbnRpbmcgb3V0IGluZm8gb3IgZXJyb3IgbWVzc2FnZXMgdG8gdGhlIHVzZXJcbiAqIEB0eXBlIHtHaXRMb2dnZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG5HaXQucHJvdG90eXBlLl9sb2dnZXIgPSBudWxsO1xuXG4vKipcbiAqIFNldHMgdGhlIHBhdGggdG8gYSBjdXN0b20gZ2l0IGJpbmFyeSwgc2hvdWxkIGVpdGhlciBiZSBgZ2l0YCB3aGVuIHRoZXJlIGlzIGFuIGluc3RhbGxhdGlvbiBvZiBnaXQgYXZhaWxhYmxlIG9uXG4gKiB0aGUgc3lzdGVtIHBhdGgsIG9yIGEgZnVsbHkgcXVhbGlmaWVkIHBhdGggdG8gdGhlIGV4ZWN1dGFibGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbW1hbmRcbiAqIEByZXR1cm5zIHtHaXR9XG4gKi9cbkdpdC5wcm90b3R5cGUuY3VzdG9tQmluYXJ5ID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgIHRoaXMuX2V4ZWN1dG9yLmJpbmFyeSA9IGNvbW1hbmQ7XG4gICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0cyBhbiBlbnZpcm9ubWVudCB2YXJpYWJsZSBmb3IgdGhlIHNwYXduZWQgY2hpbGQgcHJvY2VzcywgZWl0aGVyIHN1cHBseSBib3RoIGEgbmFtZSBhbmQgdmFsdWUgYXMgc3RyaW5ncyBvclxuICogYSBzaW5nbGUgb2JqZWN0IHRvIGVudGlyZWx5IHJlcGxhY2UgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdH0gbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IFt2YWx1ZV1cbiAqIEByZXR1cm5zIHtHaXR9XG4gKi9cbkdpdC5wcm90b3R5cGUuZW52ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMuX2V4ZWN1dG9yLmVudiA9IG5hbWU7XG4gICB9IGVsc2Uge1xuICAgICAgKHRoaXMuX2V4ZWN1dG9yLmVudiA9IHRoaXMuX2V4ZWN1dG9yLmVudiB8fCB7fSlbbmFtZV0gPSB2YWx1ZTtcbiAgIH1cblxuICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIExpc3QgdGhlIHN0YXNoKHMpIG9mIHRoZSBsb2NhbCByZXBvXG4gKi9cbkdpdC5wcm90b3R5cGUuc3Rhc2hMaXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgc3Rhc2hMaXN0VGFzayhcbiAgICAgICAgIHRyYWlsaW5nT3B0aW9uc0FyZ3VtZW50KGFyZ3VtZW50cykgfHwge30sXG4gICAgICAgICBmaWx0ZXJBcnJheShvcHRpb25zKSAmJiBvcHRpb25zIHx8IFtdXG4gICAgICApLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuZnVuY3Rpb24gY3JlYXRlQ2xvbmVUYXNrIChhcGksIHRhc2ssIHJlcG9QYXRoLCBsb2NhbFBhdGgpIHtcbiAgIGlmICh0eXBlb2YgcmVwb1BhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gY29uZmlndXJhdGlvbkVycm9yVGFzayhgZ2l0LiR7IGFwaSB9KCkgcmVxdWlyZXMgYSBzdHJpbmcgJ3JlcG9QYXRoJ2ApO1xuICAgfVxuXG4gICByZXR1cm4gdGFzayhyZXBvUGF0aCwgZmlsdGVyVHlwZShsb2NhbFBhdGgsIGZpbHRlclN0cmluZyksIGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKTtcbn1cblxuXG4vKipcbiAqIENsb25lIGEgZ2l0IHJlcG9cbiAqL1xuR2l0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgY3JlYXRlQ2xvbmVUYXNrKCdjbG9uZScsIGNsb25lVGFzaywgLi4uYXJndW1lbnRzKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogTWlycm9yIGEgZ2l0IHJlcG9cbiAqL1xuR2l0LnByb3RvdHlwZS5taXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGNyZWF0ZUNsb25lVGFzaygnbWlycm9yJywgY2xvbmVNaXJyb3JUYXNrLCAuLi5hcmd1bWVudHMpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBNb3ZlcyBvbmUgb3IgbW9yZSBmaWxlcyB0byBhIG5ldyBkZXN0aW5hdGlvbi5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0LXNjbS5jb20vZG9jcy9naXQtbXZcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gZnJvbVxuICogQHBhcmFtIHtzdHJpbmd9IHRvXG4gKi9cbkdpdC5wcm90b3R5cGUubXYgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKG1vdmVUYXNrKGZyb20sIHRvKSwgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xufTtcblxuLyoqXG4gKiBJbnRlcm5hbGx5IHVzZXMgcHVsbCBhbmQgdGFncyB0byBnZXQgdGhlIGxpc3Qgb2YgdGFncyB0aGVuIGNoZWNrcyBvdXQgdGhlIGxhdGVzdCB0YWcuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoZW5dXG4gKi9cbkdpdC5wcm90b3R5cGUuY2hlY2tvdXRMYXRlc3RUYWcgPSBmdW5jdGlvbiAodGhlbikge1xuICAgdmFyIGdpdCA9IHRoaXM7XG4gICByZXR1cm4gdGhpcy5wdWxsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGdpdC50YWdzKGZ1bmN0aW9uIChlcnIsIHRhZ3MpIHtcbiAgICAgICAgIGdpdC5jaGVja291dCh0YWdzLmxhdGVzdCwgdGhlbik7XG4gICAgICB9KTtcbiAgIH0pO1xufTtcblxuLyoqXG4gKiBDb21taXRzIGNoYW5nZXMgaW4gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkgLSB3aGVuIHNwZWNpZmljIGZpbGUgcGF0aHMgYXJlIHN1cHBsaWVkLCBvbmx5IGNoYW5nZXMgb24gdGhvc2VcbiAqIGZpbGVzIHdpbGwgYmUgY29tbWl0dGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBtZXNzYWdlXG4gKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gW2ZpbGVzXVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoZW5dXG4gKi9cbkdpdC5wcm90b3R5cGUuY29tbWl0ID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGZpbGVzLCBvcHRpb25zLCB0aGVuKSB7XG4gICBjb25zdCBuZXh0ID0gdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyk7XG4gICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuXG4gICBpZiAoZmlsdGVyU3RyaW5nT3JTdHJpbmdBcnJheShtZXNzYWdlKSkge1xuICAgICAgbWVzc2FnZXMucHVzaCguLi5hc0FycmF5KG1lc3NhZ2UpKTtcbiAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ3NpbXBsZS1naXQgZGVwcmVjYXRpb24gbm90aWNlOiBnaXQuY29tbWl0OiByZXF1aXJlcyB0aGUgY29tbWl0IG1lc3NhZ2UgdG8gYmUgc3VwcGxpZWQgYXMgYSBzdHJpbmcvc3RyaW5nW10sIHRoaXMgd2lsbCBiZSBhbiBlcnJvciBpbiB2ZXJzaW9uIDMnKTtcbiAgIH1cblxuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBjb21taXRUYXNrKFxuICAgICAgICAgbWVzc2FnZXMsXG4gICAgICAgICBhc0FycmF5KGZpbHRlclR5cGUoZmlsZXMsIGZpbHRlclN0cmluZ09yU3RyaW5nQXJyYXksIFtdKSksXG4gICAgICAgICBbLi4uZmlsdGVyVHlwZShvcHRpb25zLCBmaWx0ZXJBcnJheSwgW10pLCAuLi5nZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzLCAwLCB0cnVlKV1cbiAgICAgICksXG4gICAgICBuZXh0XG4gICApO1xufTtcblxuLyoqXG4gKiBQdWxsIHRoZSB1cGRhdGVkIGNvbnRlbnRzIG9mIHRoZSBjdXJyZW50IHJlcG9cbiAqL1xuR2l0LnByb3RvdHlwZS5wdWxsID0gZnVuY3Rpb24gKHJlbW90ZSwgYnJhbmNoLCBvcHRpb25zLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHB1bGxUYXNrKGZpbHRlclR5cGUocmVtb3RlLCBmaWx0ZXJTdHJpbmcpLCBmaWx0ZXJUeXBlKGJyYW5jaCwgZmlsdGVyU3RyaW5nKSwgZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cykpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBGZXRjaCB0aGUgdXBkYXRlZCBjb250ZW50cyBvZiB0aGUgY3VycmVudCByZXBvLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgIC5mZXRjaCgndXBzdHJlYW0nLCAnbWFzdGVyJykgLy8gZmV0Y2hlcyBmcm9tIG1hc3RlciBvbiByZW1vdGUgbmFtZWQgdXBzdHJlYW1cbiAqICAgLmZldGNoKGZ1bmN0aW9uICgpIHt9KSAvLyBydW5zIGZldGNoIGFnYWluc3QgZGVmYXVsdCByZW1vdGUgYW5kIGJyYW5jaCBhbmQgY2FsbHMgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW3JlbW90ZV1cbiAqIEBwYXJhbSB7c3RyaW5nfSBbYnJhbmNoXVxuICovXG5HaXQucHJvdG90eXBlLmZldGNoID0gZnVuY3Rpb24gKHJlbW90ZSwgYnJhbmNoKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGZldGNoVGFzayhmaWx0ZXJUeXBlKHJlbW90ZSwgZmlsdGVyU3RyaW5nKSwgZmlsdGVyVHlwZShicmFuY2gsIGZpbHRlclN0cmluZyksIGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogRGlzYWJsZXMvZW5hYmxlcyB0aGUgdXNlIG9mIHRoZSBjb25zb2xlIGZvciBwcmludGluZyB3YXJuaW5ncyBhbmQgZXJyb3JzLCBieSBkZWZhdWx0IG1lc3NhZ2VzIGFyZSBub3Qgc2hvd24gaW5cbiAqIGEgcHJvZHVjdGlvbiBlbnZpcm9ubWVudC5cbiAqXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNpbGVuY2VcbiAqIEByZXR1cm5zIHtHaXR9XG4gKi9cbkdpdC5wcm90b3R5cGUuc2lsZW50ID0gZnVuY3Rpb24gKHNpbGVuY2UpIHtcbiAgIGNvbnNvbGUud2Fybignc2ltcGxlLWdpdCBkZXByZWNhdGlvbiBub3RpY2U6IGdpdC5zaWxlbnQ6IGxvZ2dpbmcgc2hvdWxkIGJlIGNvbmZpZ3VyZWQgdXNpbmcgdGhlIGBkZWJ1Z2AgbGlicmFyeSAvIGBERUJVR2AgZW52aXJvbm1lbnQgdmFyaWFibGUsIHRoaXMgd2lsbCBiZSBhbiBlcnJvciBpbiB2ZXJzaW9uIDMnKTtcbiAgIHRoaXMuX2xvZ2dlci5zaWxlbnQoISFzaWxlbmNlKTtcbiAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBMaXN0IGFsbCB0YWdzLiBXaGVuIHVzaW5nIGdpdCAyLjcuMCBvciBhYm92ZSwgaW5jbHVkZSBhbiBvcHRpb25zIG9iamVjdCB3aXRoIGBcIi0tc29ydFwiOiBcInByb3BlcnR5LW5hbWVcImAgdG9cbiAqIHNvcnQgdGhlIHRhZ3MgYnkgdGhhdCBwcm9wZXJ0eSBpbnN0ZWFkIG9mIHVzaW5nIHRoZSBkZWZhdWx0IHNlbWFudGljIHZlcnNpb25pbmcgc29ydC5cbiAqXG4gKiBOb3RlLCBzdXBwbHlpbmcgdGhpcyBvcHRpb24gd2hlbiBpdCBpcyBub3Qgc3VwcG9ydGVkIGJ5IHlvdXIgR2l0IHZlcnNpb24gd2lsbCBjYXVzZSB0aGUgb3BlcmF0aW9uIHRvIGZhaWwuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoZW5dXG4gKi9cbkdpdC5wcm90b3R5cGUudGFncyA9IGZ1bmN0aW9uIChvcHRpb25zLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHRhZ0xpc3RUYXNrKGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogUmViYXNlcyB0aGUgY3VycmVudCB3b3JraW5nIGNvcHkuIE9wdGlvbnMgY2FuIGJlIHN1cHBsaWVkIGVpdGhlciBhcyBhbiBhcnJheSBvZiBzdHJpbmcgcGFyYW1ldGVyc1xuICogdG8gYmUgc2VudCB0byB0aGUgYGdpdCByZWJhc2VgIGNvbW1hbmQsIG9yIGEgc3RhbmRhcmQgb3B0aW9ucyBvYmplY3QuXG4gKi9cbkdpdC5wcm90b3R5cGUucmViYXNlID0gZnVuY3Rpb24gKCkge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsncmViYXNlJywgLi4uZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cyldKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpXG4gICApO1xufTtcblxuLyoqXG4gKiBSZXNldCBhIHJlcG9cbiAqL1xuR2l0LnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIChtb2RlKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHJlc2V0VGFzayhnZXRSZXNldE1vZGUobW9kZSksIGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogUmV2ZXJ0IG9uZSBvciBtb3JlIGNvbW1pdHMgaW4gdGhlIGxvY2FsIHdvcmtpbmcgY29weVxuICovXG5HaXQucHJvdG90eXBlLnJldmVydCA9IGZ1bmN0aW9uIChjb21taXQpIHtcbiAgIGNvbnN0IG5leHQgPSB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKTtcblxuICAgaWYgKHR5cGVvZiBjb21taXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgICAgIGNvbmZpZ3VyYXRpb25FcnJvclRhc2soJ0NvbW1pdCBtdXN0IGJlIGEgc3RyaW5nJyksXG4gICAgICAgICBuZXh0LFxuICAgICAgKTtcbiAgIH1cblxuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsncmV2ZXJ0JywgLi4uZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cywgMCwgdHJ1ZSksIGNvbW1pdF0pLFxuICAgICAgbmV4dFxuICAgKTtcbn07XG5cbi8qKlxuICogQWRkIGEgbGlnaHR3ZWlnaHQgdGFnIHRvIHRoZSBoZWFkIG9mIHRoZSBjdXJyZW50IGJyYW5jaFxuICovXG5HaXQucHJvdG90eXBlLmFkZFRhZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICBjb25zdCB0YXNrID0gKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJylcbiAgICAgID8gYWRkVGFnVGFzayhuYW1lKVxuICAgICAgOiBjb25maWd1cmF0aW9uRXJyb3JUYXNrKCdHaXQuYWRkVGFnIHJlcXVpcmVzIGEgdGFnIG5hbWUnKTtcblxuICAgcmV0dXJuIHRoaXMuX3J1blRhc2sodGFzaywgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xufTtcblxuLyoqXG4gKiBBZGQgYW4gYW5ub3RhdGVkIHRhZyB0byB0aGUgaGVhZCBvZiB0aGUgY3VycmVudCBicmFuY2hcbiAqL1xuR2l0LnByb3RvdHlwZS5hZGRBbm5vdGF0ZWRUYWcgPSBmdW5jdGlvbiAodGFnTmFtZSwgdGFnTWVzc2FnZSkge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBhZGRBbm5vdGF0ZWRUYWdUYXNrKHRhZ05hbWUsIHRhZ01lc3NhZ2UpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBDaGVjayBvdXQgYSB0YWcgb3IgcmV2aXNpb24sIGFueSBudW1iZXIgb2YgYWRkaXRpb25hbCBhcmd1bWVudHMgY2FuIGJlIHBhc3NlZCB0byB0aGUgYGdpdCBjaGVja291dGAgY29tbWFuZFxuICogYnkgc3VwcGx5aW5nIGVpdGhlciBhIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmdzIGFzIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAqL1xuR2l0LnByb3RvdHlwZS5jaGVja291dCA9IGZ1bmN0aW9uICgpIHtcbiAgIGNvbnN0IGNvbW1hbmRzID0gWydjaGVja291dCcsIC4uLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMsIHRydWUpXTtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kcyksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIENoZWNrIG91dCBhIHJlbW90ZSBicmFuY2hcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYnJhbmNoTmFtZSBuYW1lIG9mIGJyYW5jaFxuICogQHBhcmFtIHtzdHJpbmd9IHN0YXJ0UG9pbnQgKGUuZyBvcmlnaW4vZGV2ZWxvcG1lbnQpXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhlbl1cbiAqL1xuR2l0LnByb3RvdHlwZS5jaGVja291dEJyYW5jaCA9IGZ1bmN0aW9uIChicmFuY2hOYW1lLCBzdGFydFBvaW50LCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5jaGVja291dChbJy1iJywgYnJhbmNoTmFtZSwgc3RhcnRQb2ludF0sIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgb3V0IGEgbG9jYWwgYnJhbmNoXG4gKi9cbkdpdC5wcm90b3R5cGUuY2hlY2tvdXRMb2NhbEJyYW5jaCA9IGZ1bmN0aW9uIChicmFuY2hOYW1lLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5jaGVja291dChbJy1iJywgYnJhbmNoTmFtZV0sIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpKTtcbn07XG5cbi8qKlxuICogRGVsZXRlIGEgbG9jYWwgYnJhbmNoXG4gKi9cbkdpdC5wcm90b3R5cGUuZGVsZXRlTG9jYWxCcmFuY2ggPSBmdW5jdGlvbiAoYnJhbmNoTmFtZSwgZm9yY2VEZWxldGUsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgZGVsZXRlQnJhbmNoVGFzayhicmFuY2hOYW1lLCB0eXBlb2YgZm9yY2VEZWxldGUgPT09IFwiYm9vbGVhblwiID8gZm9yY2VEZWxldGUgOiBmYWxzZSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIERlbGV0ZSBvbmUgb3IgbW9yZSBsb2NhbCBicmFuY2hlc1xuICovXG5HaXQucHJvdG90eXBlLmRlbGV0ZUxvY2FsQnJhbmNoZXMgPSBmdW5jdGlvbiAoYnJhbmNoTmFtZXMsIGZvcmNlRGVsZXRlLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGRlbGV0ZUJyYW5jaGVzVGFzayhicmFuY2hOYW1lcywgdHlwZW9mIGZvcmNlRGVsZXRlID09PSBcImJvb2xlYW5cIiA/IGZvcmNlRGVsZXRlIDogZmFsc2UpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBMaXN0IGFsbCBicmFuY2hlc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0IHwgc3RyaW5nW119IFtvcHRpb25zXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoZW5dXG4gKi9cbkdpdC5wcm90b3R5cGUuYnJhbmNoID0gZnVuY3Rpb24gKG9wdGlvbnMsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgYnJhbmNoVGFzayhnZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIFJldHVybiBsaXN0IG9mIGxvY2FsIGJyYW5jaGVzXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoZW5dXG4gKi9cbkdpdC5wcm90b3R5cGUuYnJhbmNoTG9jYWwgPSBmdW5jdGlvbiAodGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBicmFuY2hMb2NhbFRhc2soKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogRXhlY3V0ZXMgYW55IGNvbW1hbmQgYWdhaW5zdCB0aGUgZ2l0IGJpbmFyeS5cbiAqL1xuR2l0LnByb3RvdHlwZS5yYXcgPSBmdW5jdGlvbiAoY29tbWFuZHMpIHtcbiAgIGNvbnN0IGNyZWF0ZVJlc3RDb21tYW5kcyA9ICFBcnJheS5pc0FycmF5KGNvbW1hbmRzKTtcbiAgIGNvbnN0IGNvbW1hbmQgPSBbXS5zbGljZS5jYWxsKGNyZWF0ZVJlc3RDb21tYW5kcyA/IGFyZ3VtZW50cyA6IGNvbW1hbmRzLCAwKTtcblxuICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21tYW5kLmxlbmd0aCAmJiBjcmVhdGVSZXN0Q29tbWFuZHM7IGkrKykge1xuICAgICAgaWYgKCFmaWx0ZXJQcmltaXRpdmVzKGNvbW1hbmRbaV0pKSB7XG4gICAgICAgICBjb21tYW5kLnNwbGljZShpLCBjb21tYW5kLmxlbmd0aCAtIGkpO1xuICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICB9XG5cbiAgIGNvbW1hbmQucHVzaChcbiAgICAgIC4uLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMsIDAsIHRydWUpLFxuICAgKTtcblxuICAgdmFyIG5leHQgPSB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKTtcblxuICAgaWYgKCFjb21tYW5kLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICAgICBjb25maWd1cmF0aW9uRXJyb3JUYXNrKCdSYXc6IG11c3Qgc3VwcGx5IG9uZSBvciBtb3JlIGNvbW1hbmQgdG8gZXhlY3V0ZScpLFxuICAgICAgICAgbmV4dCxcbiAgICAgICk7XG4gICB9XG5cbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKHN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soY29tbWFuZCksIG5leHQpO1xufTtcblxuR2l0LnByb3RvdHlwZS5zdWJtb2R1bGVBZGQgPSBmdW5jdGlvbiAocmVwbywgcGF0aCwgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBhZGRTdWJNb2R1bGVUYXNrKHJlcG8sIHBhdGgpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuR2l0LnByb3RvdHlwZS5zdWJtb2R1bGVVcGRhdGUgPSBmdW5jdGlvbiAoYXJncywgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICB1cGRhdGVTdWJNb2R1bGVUYXNrKGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMsIHRydWUpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbkdpdC5wcm90b3R5cGUuc3VibW9kdWxlSW5pdCA9IGZ1bmN0aW9uIChhcmdzLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGluaXRTdWJNb2R1bGVUYXNrKGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMsIHRydWUpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbkdpdC5wcm90b3R5cGUuc3ViTW9kdWxlID0gZnVuY3Rpb24gKG9wdGlvbnMsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgc3ViTW9kdWxlVGFzayhnZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG5HaXQucHJvdG90eXBlLmxpc3RSZW1vdGUgPSBmdW5jdGlvbiAoKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGxpc3RSZW1vdGVzVGFzayhnZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIEFkZHMgYSByZW1vdGUgdG8gdGhlIGxpc3Qgb2YgcmVtb3Rlcy5cbiAqL1xuR2l0LnByb3RvdHlwZS5hZGRSZW1vdGUgPSBmdW5jdGlvbiAocmVtb3RlTmFtZSwgcmVtb3RlUmVwbywgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBhZGRSZW1vdGVUYXNrKHJlbW90ZU5hbWUsIHJlbW90ZVJlcG8sIGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhbiBlbnRyeSBieSBuYW1lIGZyb20gdGhlIGxpc3Qgb2YgcmVtb3Rlcy5cbiAqL1xuR2l0LnByb3RvdHlwZS5yZW1vdmVSZW1vdGUgPSBmdW5jdGlvbiAocmVtb3RlTmFtZSwgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICByZW1vdmVSZW1vdGVUYXNrKHJlbW90ZU5hbWUpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBjdXJyZW50bHkgYXZhaWxhYmxlIHJlbW90ZXMsIHNldHRpbmcgdGhlIG9wdGlvbmFsIHZlcmJvc2UgYXJndW1lbnQgdG8gdHJ1ZSBpbmNsdWRlcyBhZGRpdGlvbmFsXG4gKiBkZXRhaWwgb24gdGhlIHJlbW90ZXMgdGhlbXNlbHZlcy5cbiAqL1xuR2l0LnByb3RvdHlwZS5nZXRSZW1vdGVzID0gZnVuY3Rpb24gKHZlcmJvc2UsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgZ2V0UmVtb3Rlc1Rhc2sodmVyYm9zZSA9PT0gdHJ1ZSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIENhbGwgYW55IGBnaXQgcmVtb3RlYCBmdW5jdGlvbiB3aXRoIGFyZ3VtZW50cyBwYXNzZWQgYXMgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBvcHRpb25zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhlbl1cbiAqL1xuR2l0LnByb3RvdHlwZS5yZW1vdGUgPSBmdW5jdGlvbiAob3B0aW9ucywgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICByZW1vdGVUYXNrKGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogQ2FsbCBhbnkgYGdpdCB0YWdgIGZ1bmN0aW9uIHdpdGggYXJndW1lbnRzIHBhc3NlZCBhcyBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW119IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFt0aGVuXVxuICovXG5HaXQucHJvdG90eXBlLnRhZyA9IGZ1bmN0aW9uIChvcHRpb25zLCB0aGVuKSB7XG4gICBjb25zdCBjb21tYW5kID0gZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cyk7XG5cbiAgIGlmIChjb21tYW5kWzBdICE9PSAndGFnJykge1xuICAgICAgY29tbWFuZC51bnNoaWZ0KCd0YWcnKTtcbiAgIH1cblxuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKGNvbW1hbmQpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cylcbiAgICk7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgcmVwb3NpdG9yeSBzZXJ2ZXIgaW5mb1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFt0aGVuXVxuICovXG5HaXQucHJvdG90eXBlLnVwZGF0ZVNlcnZlckluZm8gPSBmdW5jdGlvbiAodGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsndXBkYXRlLXNlcnZlci1pbmZvJ10pLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBQdXNoZXMgdGhlIGN1cnJlbnQgdGFnIGNoYW5nZXMgdG8gYSByZW1vdGUgd2hpY2ggY2FuIGJlIGVpdGhlciBhIFVSTCBvciBuYW1lZCByZW1vdGUuIFdoZW4gbm90IHNwZWNpZmllZCB1c2VzIHRoZVxuICogZGVmYXVsdCBjb25maWd1cmVkIHJlbW90ZSBzcGVjLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbcmVtb3RlXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoZW5dXG4gKi9cbkdpdC5wcm90b3R5cGUucHVzaFRhZ3MgPSBmdW5jdGlvbiAocmVtb3RlLCB0aGVuKSB7XG4gICBjb25zdCB0YXNrID0gcHVzaFRhZ3NUYXNrKHtyZW1vdGU6IGZpbHRlclR5cGUocmVtb3RlLCBmaWx0ZXJTdHJpbmcpfSwgZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cykpO1xuXG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayh0YXNrLCB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIG5hbWVkIGZpbGVzIGZyb20gc291cmNlIGNvbnRyb2wuXG4gKi9cbkdpdC5wcm90b3R5cGUucm0gPSBmdW5jdGlvbiAoZmlsZXMpIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhbJ3JtJywgJy1mJywgLi4uYXNBcnJheShmaWxlcyldKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpXG4gICApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBuYW1lZCBmaWxlcyBmcm9tIHNvdXJjZSBjb250cm9sIGJ1dCBrZWVwcyB0aGVtIG9uIGRpc2sgcmF0aGVyIHRoYW4gZGVsZXRpbmcgdGhlbSBlbnRpcmVseS4gVG9cbiAqIGNvbXBsZXRlbHkgcmVtb3ZlIHRoZSBmaWxlcywgdXNlIGBybWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IGZpbGVzXG4gKi9cbkdpdC5wcm90b3R5cGUucm1LZWVwTG9jYWwgPSBmdW5jdGlvbiAoZmlsZXMpIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhbJ3JtJywgJy0tY2FjaGVkJywgLi4uYXNBcnJheShmaWxlcyldKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpXG4gICApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgbGlzdCBvZiBvYmplY3RzIGluIGEgdHJlZSBiYXNlZCBvbiBjb21taXQgaGFzaC4gUGFzc2luZyBpbiBhbiBvYmplY3QgaGFzaCByZXR1cm5zIHRoZSBvYmplY3QncyBjb250ZW50LFxuICogc2l6ZSwgYW5kIHR5cGUuXG4gKlxuICogUGFzc2luZyBcIi1wXCIgd2lsbCBpbnN0cnVjdCBjYXQtZmlsZSB0byBkZXRlcm1pbmUgdGhlIG9iamVjdCB0eXBlLCBhbmQgZGlzcGxheSBpdHMgZm9ybWF0dGVkIGNvbnRlbnRzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW119IFtvcHRpb25zXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoZW5dXG4gKi9cbkdpdC5wcm90b3R5cGUuY2F0RmlsZSA9IGZ1bmN0aW9uIChvcHRpb25zLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fY2F0RmlsZSgndXRmLTgnLCBhcmd1bWVudHMpO1xufTtcblxuR2l0LnByb3RvdHlwZS5iaW5hcnlDYXRGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgcmV0dXJuIHRoaXMuX2NhdEZpbGUoJ2J1ZmZlcicsIGFyZ3VtZW50cyk7XG59O1xuXG5HaXQucHJvdG90eXBlLl9jYXRGaWxlID0gZnVuY3Rpb24gKGZvcm1hdCwgYXJncykge1xuICAgdmFyIGhhbmRsZXIgPSB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJncyk7XG4gICB2YXIgY29tbWFuZCA9IFsnY2F0LWZpbGUnXTtcbiAgIHZhciBvcHRpb25zID0gYXJnc1swXTtcblxuICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICAgICBjb25maWd1cmF0aW9uRXJyb3JUYXNrKCdHaXQuY2F0RmlsZTogb3B0aW9ucyBtdXN0IGJlIHN1cHBsaWVkIGFzIGFuIGFycmF5IG9mIHN0cmluZ3MnKSxcbiAgICAgICAgIGhhbmRsZXIsXG4gICAgICApO1xuICAgfVxuXG4gICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgY29tbWFuZC5wdXNoLmFwcGx5KGNvbW1hbmQsIG9wdGlvbnMpO1xuICAgfVxuXG4gICBjb25zdCB0YXNrID0gZm9ybWF0ID09PSAnYnVmZmVyJ1xuICAgICAgPyBzdHJhaWdodFRocm91Z2hCdWZmZXJUYXNrKGNvbW1hbmQpXG4gICAgICA6IHN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soY29tbWFuZCk7XG5cbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKHRhc2ssIGhhbmRsZXIpO1xufTtcblxuR2l0LnByb3RvdHlwZS5kaWZmID0gZnVuY3Rpb24gKG9wdGlvbnMsIHRoZW4pIHtcbiAgIGNvbnN0IGNvbW1hbmQgPSBbJ2RpZmYnLCAuLi5nZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKV07XG5cbiAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbW1hbmQuc3BsaWNlKDEsIDAsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5fbG9nZ2VyLndhcm4oJ0dpdCNkaWZmOiBzdXBwbHlpbmcgb3B0aW9ucyBhcyBhIHNpbmdsZSBzdHJpbmcgaXMgbm93IGRlcHJlY2F0ZWQsIHN3aXRjaCB0byBhbiBhcnJheSBvZiBzdHJpbmdzJyk7XG4gICB9XG5cbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbkdpdC5wcm90b3R5cGUuZGlmZlN1bW1hcnkgPSBmdW5jdGlvbiAoKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGRpZmZTdW1tYXJ5VGFzayhnZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzLCAxKSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG5HaXQucHJvdG90eXBlLmFwcGx5UGF0Y2ggPSBmdW5jdGlvbiAocGF0Y2hlcykge1xuICAgY29uc3QgdGFzayA9ICFmaWx0ZXJTdHJpbmdPclN0cmluZ0FycmF5KHBhdGNoZXMpXG4gICAgICA/IGNvbmZpZ3VyYXRpb25FcnJvclRhc2soYGdpdC5hcHBseVBhdGNoIHJlcXVpcmVzIG9uZSBvciBtb3JlIHN0cmluZyBwYXRjaGVzIGFzIHRoZSBmaXJzdCBhcmd1bWVudGApXG4gICAgICA6IGFwcGx5UGF0Y2hUYXNrKGFzQXJyYXkocGF0Y2hlcyksIGdldFRyYWlsaW5nT3B0aW9ucyhbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKTtcblxuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICB0YXNrLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufVxuXG5HaXQucHJvdG90eXBlLnJldnBhcnNlID0gZnVuY3Rpb24gKCkge1xuICAgY29uc3QgY29tbWFuZHMgPSBbJ3Jldi1wYXJzZScsIC4uLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMsIHRydWUpXTtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kcywgdHJ1ZSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIFNob3cgdmFyaW91cyB0eXBlcyBvZiBvYmplY3RzLCBmb3IgZXhhbXBsZSB0aGUgZmlsZSBhdCBhIGNlcnRhaW4gY29tbWl0XG4gKlxuICogQHBhcmFtIHtzdHJpbmdbXX0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhlbl1cbiAqL1xuR2l0LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKG9wdGlvbnMsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhbJ3Nob3cnLCAuLi5nZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzLCAxKV0pLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cylcbiAgICk7XG59O1xuXG4vKipcbiAqL1xuR2l0LnByb3RvdHlwZS5jbGVhbiA9IGZ1bmN0aW9uIChtb2RlLCBvcHRpb25zLCB0aGVuKSB7XG4gICBjb25zdCB1c2luZ0NsZWFuT3B0aW9uc0FycmF5ID0gaXNDbGVhbk9wdGlvbnNBcnJheShtb2RlKTtcbiAgIGNvbnN0IGNsZWFuTW9kZSA9IHVzaW5nQ2xlYW5PcHRpb25zQXJyYXkgJiYgbW9kZS5qb2luKCcnKSB8fCBmaWx0ZXJUeXBlKG1vZGUsIGZpbHRlclN0cmluZykgfHwgJyc7XG4gICBjb25zdCBjdXN0b21BcmdzID0gZ2V0VHJhaWxpbmdPcHRpb25zKFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCB1c2luZ0NsZWFuT3B0aW9uc0FycmF5ID8gMSA6IDApKTtcblxuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBjbGVhbldpdGhPcHRpb25zVGFzayhjbGVhbk1vZGUsIGN1c3RvbUFyZ3MpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuR2l0LnByb3RvdHlwZS5leGVjID0gZnVuY3Rpb24gKHRoZW4pIHtcbiAgIGNvbnN0IHRhc2sgPSB7XG4gICAgICBjb21tYW5kczogW10sXG4gICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICBwYXJzZXIgKCkge1xuICAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGVuKCk7XG4gICAgICAgICB9XG4gICAgICB9XG4gICB9O1xuXG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayh0YXNrKTtcbn07XG5cbi8qKlxuICogQ2xlYXJzIHRoZSBxdWV1ZSBvZiBwZW5kaW5nIGNvbW1hbmRzIGFuZCByZXR1cm5zIHRoZSB3cmFwcGVyIGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAqXG4gKiBAcmV0dXJucyB7R2l0fVxuICovXG5HaXQucHJvdG90eXBlLmNsZWFyUXVldWUgPSBmdW5jdGlvbiAoKSB7XG4gICAvLyBUT0RPOlxuICAgLy8gdGhpcy5fZXhlY3V0b3IuY2xlYXIoKTtcbiAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBhIHBhdGhuYW1lIG9yIHBhdGhuYW1lcyBhcmUgZXhjbHVkZWQgYnkgLmdpdGlnbm9yZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBwYXRobmFtZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFt0aGVuXVxuICovXG5HaXQucHJvdG90eXBlLmNoZWNrSWdub3JlID0gZnVuY3Rpb24gKHBhdGhuYW1lcywgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBjaGVja0lnbm9yZVRhc2soYXNBcnJheSgoZmlsdGVyVHlwZShwYXRobmFtZXMsIGZpbHRlclN0cmluZ09yU3RyaW5nQXJyYXksIFtdKSkpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbkdpdC5wcm90b3R5cGUuY2hlY2tJc1JlcG8gPSBmdW5jdGlvbiAoY2hlY2tUeXBlLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGNoZWNrSXNSZXBvVGFzayhmaWx0ZXJUeXBlKGNoZWNrVHlwZSwgZmlsdGVyU3RyaW5nKSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdpdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5naXRJbnN0YW5jZUZhY3RvcnkgPSBleHBvcnRzLmdpdEV4cG9ydEZhY3RvcnkgPSBleHBvcnRzLmVzTW9kdWxlRmFjdG9yeSA9IHZvaWQgMDtcbmNvbnN0IGFwaV8xID0gcmVxdWlyZShcIi4vYXBpXCIpO1xuY29uc3QgcGx1Z2luc18xID0gcmVxdWlyZShcIi4vcGx1Z2luc1wiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmNvbnN0IEdpdCA9IHJlcXVpcmUoJy4uL2dpdCcpO1xuLyoqXG4gKiBBZGRzIHRoZSBuZWNlc3NhcnkgcHJvcGVydGllcyB0byB0aGUgc3VwcGxpZWQgb2JqZWN0IHRvIGVuYWJsZSBpdCBmb3IgdXNlIGFzXG4gKiB0aGUgZGVmYXVsdCBleHBvcnQgb2YgYSBtb2R1bGUuXG4gKlxuICogRWc6IGBtb2R1bGUuZXhwb3J0cyA9IGVzTW9kdWxlRmFjdG9yeSh7IHNvbWV0aGluZyAoKSB7fSB9KWBcbiAqL1xuZnVuY3Rpb24gZXNNb2R1bGVGYWN0b3J5KGRlZmF1bHRFeHBvcnQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZGVmYXVsdEV4cG9ydCwge1xuICAgICAgICBfX2VzTW9kdWxlOiB7IHZhbHVlOiB0cnVlIH0sXG4gICAgICAgIGRlZmF1bHQ6IHsgdmFsdWU6IGRlZmF1bHRFeHBvcnQgfSxcbiAgICB9KTtcbn1cbmV4cG9ydHMuZXNNb2R1bGVGYWN0b3J5ID0gZXNNb2R1bGVGYWN0b3J5O1xuZnVuY3Rpb24gZ2l0RXhwb3J0RmFjdG9yeShmYWN0b3J5LCBleHRyYSkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3J5LmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIGFwaV8xLmRlZmF1bHQsIGV4dHJhIHx8IHt9KTtcbn1cbmV4cG9ydHMuZ2l0RXhwb3J0RmFjdG9yeSA9IGdpdEV4cG9ydEZhY3Rvcnk7XG5mdW5jdGlvbiBnaXRJbnN0YW5jZUZhY3RvcnkoYmFzZURpciwgb3B0aW9ucykge1xuICAgIGNvbnN0IHBsdWdpbnMgPSBuZXcgcGx1Z2luc18xLlBsdWdpblN0b3JlKCk7XG4gICAgY29uc3QgY29uZmlnID0gdXRpbHNfMS5jcmVhdGVJbnN0YW5jZUNvbmZpZyhiYXNlRGlyICYmICh0eXBlb2YgYmFzZURpciA9PT0gJ3N0cmluZycgPyB7IGJhc2VEaXIgfSA6IGJhc2VEaXIpIHx8IHt9LCBvcHRpb25zKTtcbiAgICBpZiAoIXV0aWxzXzEuZm9sZGVyRXhpc3RzKGNvbmZpZy5iYXNlRGlyKSkge1xuICAgICAgICB0aHJvdyBuZXcgYXBpXzEuZGVmYXVsdC5HaXRDb25zdHJ1Y3RFcnJvcihjb25maWcsIGBDYW5ub3QgdXNlIHNpbXBsZS1naXQgb24gYSBkaXJlY3RvcnkgdGhhdCBkb2VzIG5vdCBleGlzdGApO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb25maWcuY29uZmlnKSkge1xuICAgICAgICBwbHVnaW5zLmFkZChwbHVnaW5zXzEuY29tbWFuZENvbmZpZ1ByZWZpeGluZ1BsdWdpbihjb25maWcuY29uZmlnKSk7XG4gICAgfVxuICAgIGNvbmZpZy5wcm9ncmVzcyAmJiBwbHVnaW5zLmFkZChwbHVnaW5zXzEucHJvZ3Jlc3NNb25pdG9yUGx1Z2luKGNvbmZpZy5wcm9ncmVzcykpO1xuICAgIGNvbmZpZy50aW1lb3V0ICYmIHBsdWdpbnMuYWRkKHBsdWdpbnNfMS50aW1lb3V0UGx1Z2luKGNvbmZpZy50aW1lb3V0KSk7XG4gICAgY29uZmlnLnNwYXduT3B0aW9ucyAmJiBwbHVnaW5zLmFkZChwbHVnaW5zXzEuc3Bhd25PcHRpb25zUGx1Z2luKGNvbmZpZy5zcGF3bk9wdGlvbnMpKTtcbiAgICBwbHVnaW5zLmFkZChwbHVnaW5zXzEuZXJyb3JEZXRlY3Rpb25QbHVnaW4ocGx1Z2luc18xLmVycm9yRGV0ZWN0aW9uSGFuZGxlcih0cnVlKSkpO1xuICAgIGNvbmZpZy5lcnJvcnMgJiYgcGx1Z2lucy5hZGQocGx1Z2luc18xLmVycm9yRGV0ZWN0aW9uUGx1Z2luKGNvbmZpZy5lcnJvcnMpKTtcbiAgICByZXR1cm4gbmV3IEdpdChjb25maWcsIHBsdWdpbnMpO1xufVxuZXhwb3J0cy5naXRJbnN0YW5jZUZhY3RvcnkgPSBnaXRJbnN0YW5jZUZhY3Rvcnk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1naXQtZmFjdG9yeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2l0UCA9IHZvaWQgMDtcbmNvbnN0IGdpdF9yZXNwb25zZV9lcnJvcl8xID0gcmVxdWlyZShcIi4uL2Vycm9ycy9naXQtcmVzcG9uc2UtZXJyb3JcIik7XG5jb25zdCBnaXRfZmFjdG9yeV8xID0gcmVxdWlyZShcIi4uL2dpdC1mYWN0b3J5XCIpO1xuY29uc3QgZnVuY3Rpb25OYW1lc0J1aWxkZXJBcGkgPSBbXG4gICAgJ2N1c3RvbUJpbmFyeScsICdlbnYnLCAnb3V0cHV0SGFuZGxlcicsICdzaWxlbnQnLFxuXTtcbmNvbnN0IGZ1bmN0aW9uTmFtZXNQcm9taXNlQXBpID0gW1xuICAgICdhZGQnLFxuICAgICdhZGRBbm5vdGF0ZWRUYWcnLFxuICAgICdhZGRDb25maWcnLFxuICAgICdhZGRSZW1vdGUnLFxuICAgICdhZGRUYWcnLFxuICAgICdhcHBseVBhdGNoJyxcbiAgICAnYmluYXJ5Q2F0RmlsZScsXG4gICAgJ2JyYW5jaCcsXG4gICAgJ2JyYW5jaExvY2FsJyxcbiAgICAnY2F0RmlsZScsXG4gICAgJ2NoZWNrSWdub3JlJyxcbiAgICAnY2hlY2tJc1JlcG8nLFxuICAgICdjaGVja291dCcsXG4gICAgJ2NoZWNrb3V0QnJhbmNoJyxcbiAgICAnY2hlY2tvdXRMYXRlc3RUYWcnLFxuICAgICdjaGVja291dExvY2FsQnJhbmNoJyxcbiAgICAnY2xlYW4nLFxuICAgICdjbG9uZScsXG4gICAgJ2NvbW1pdCcsXG4gICAgJ2N3ZCcsXG4gICAgJ2RlbGV0ZUxvY2FsQnJhbmNoJyxcbiAgICAnZGVsZXRlTG9jYWxCcmFuY2hlcycsXG4gICAgJ2RpZmYnLFxuICAgICdkaWZmU3VtbWFyeScsXG4gICAgJ2V4ZWMnLFxuICAgICdmZXRjaCcsXG4gICAgJ2dldFJlbW90ZXMnLFxuICAgICdpbml0JyxcbiAgICAnbGlzdENvbmZpZycsXG4gICAgJ2xpc3RSZW1vdGUnLFxuICAgICdsb2cnLFxuICAgICdtZXJnZScsXG4gICAgJ21lcmdlRnJvbVRvJyxcbiAgICAnbWlycm9yJyxcbiAgICAnbXYnLFxuICAgICdwdWxsJyxcbiAgICAncHVzaCcsXG4gICAgJ3B1c2hUYWdzJyxcbiAgICAncmF3JyxcbiAgICAncmViYXNlJyxcbiAgICAncmVtb3RlJyxcbiAgICAncmVtb3ZlUmVtb3RlJyxcbiAgICAncmVzZXQnLFxuICAgICdyZXZlcnQnLFxuICAgICdyZXZwYXJzZScsXG4gICAgJ3JtJyxcbiAgICAncm1LZWVwTG9jYWwnLFxuICAgICdzaG93JyxcbiAgICAnc3Rhc2gnLFxuICAgICdzdGFzaExpc3QnLFxuICAgICdzdGF0dXMnLFxuICAgICdzdWJNb2R1bGUnLFxuICAgICdzdWJtb2R1bGVBZGQnLFxuICAgICdzdWJtb2R1bGVJbml0JyxcbiAgICAnc3VibW9kdWxlVXBkYXRlJyxcbiAgICAndGFnJyxcbiAgICAndGFncycsXG4gICAgJ3VwZGF0ZVNlcnZlckluZm8nXG5dO1xuZnVuY3Rpb24gZ2l0UCguLi5hcmdzKSB7XG4gICAgbGV0IGdpdDtcbiAgICBsZXQgY2hhaW4gPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB0cnkge1xuICAgICAgICBnaXQgPSBnaXRfZmFjdG9yeV8xLmdpdEluc3RhbmNlRmFjdG9yeSguLi5hcmdzKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY2hhaW4gPSBQcm9taXNlLnJlamVjdChlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGRlclJldHVybigpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2VBcGk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoYWluUmV0dXJuKCkge1xuICAgICAgICByZXR1cm4gY2hhaW47XG4gICAgfVxuICAgIGNvbnN0IHByb21pc2VBcGkgPSBbLi4uZnVuY3Rpb25OYW1lc0J1aWxkZXJBcGksIC4uLmZ1bmN0aW9uTmFtZXNQcm9taXNlQXBpXS5yZWR1Y2UoKGFwaSwgbmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBpc0FzeW5jID0gZnVuY3Rpb25OYW1lc1Byb21pc2VBcGkuaW5jbHVkZXMobmFtZSk7XG4gICAgICAgIGNvbnN0IHZhbGlkID0gaXNBc3luYyA/IGFzeW5jV3JhcHBlcihuYW1lLCBnaXQpIDogc3luY1dyYXBwZXIobmFtZSwgZ2l0LCBhcGkpO1xuICAgICAgICBjb25zdCBhbHRlcm5hdGl2ZSA9IGlzQXN5bmMgPyBjaGFpblJldHVybiA6IGJ1aWxkZXJSZXR1cm47XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhcGksIG5hbWUsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiBnaXQgPyB2YWxpZCA6IGFsdGVybmF0aXZlLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFwaTtcbiAgICB9LCB7fSk7XG4gICAgcmV0dXJuIHByb21pc2VBcGk7XG4gICAgZnVuY3Rpb24gYXN5bmNXcmFwcGVyKGZuLCBnaXQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3NbYXJncy5sZW5ndGhdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZSBpbnRlcmZhY2UgcmVxdWlyZXMgdGhhdCBoYW5kbGVycyBhcmUgbm90IHN1cHBsaWVkIGlubGluZSwgJyArXG4gICAgICAgICAgICAgICAgICAgICd0cmFpbGluZyBmdW5jdGlvbiBub3QgYWxsb3dlZCBpbiBjYWxsIHRvICcgKyBmbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KHRvRXJyb3IoZXJyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIGdpdFtmbl0uYXBwbHkoZ2l0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBzeW5jV3JhcHBlcihmbiwgZ2l0LCBhcGkpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBnaXRbZm5dKC4uLmFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIGFwaTtcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnRzLmdpdFAgPSBnaXRQO1xuZnVuY3Rpb24gdG9FcnJvcihlcnJvcikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihlcnJvcik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgZ2l0X3Jlc3BvbnNlX2Vycm9yXzEuR2l0UmVzcG9uc2VFcnJvcihlcnJvcik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcm9taXNlLXdyYXBwZWQuanMubWFwIiwiXG5jb25zdCB7Z2l0UH0gPSByZXF1aXJlKCcuL2xpYi9ydW5uZXJzL3Byb21pc2Utd3JhcHBlZCcpO1xuY29uc3Qge2VzTW9kdWxlRmFjdG9yeSwgZ2l0SW5zdGFuY2VGYWN0b3J5LCBnaXRFeHBvcnRGYWN0b3J5fSA9IHJlcXVpcmUoJy4vbGliL2dpdC1mYWN0b3J5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXNNb2R1bGVGYWN0b3J5KFxuICAgZ2l0RXhwb3J0RmFjdG9yeShnaXRJbnN0YW5jZUZhY3RvcnksIHtnaXRQfSlcbik7XG4iLCJpbXBvcnQgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCBPYnNpZGlhbkdpdCBmcm9tIFwiLi9tYWluXCI7XG5pbXBvcnQgeyBCcmFuY2hJbmZvLCBGaWxlU3RhdHVzUmVzdWx0LCBTdGF0dXMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHaXRNYW5hZ2VyIHtcbiAgICByZWFkb25seSBwbHVnaW46IE9ic2lkaWFuR2l0O1xuICAgIHJlYWRvbmx5IGFwcDogQXBwO1xuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogT2JzaWRpYW5HaXQpIHtcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgICAgIHRoaXMuYXBwID0gcGx1Z2luLmFwcDtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBzdGF0dXMoKTogUHJvbWlzZTxTdGF0dXM+O1xuXG4gICAgYWJzdHJhY3QgY29tbWl0QWxsKG1lc3NhZ2U/OiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj47XG5cbiAgICBhYnN0cmFjdCBwdWxsKCk6IFByb21pc2U8bnVtYmVyPjtcblxuICAgIGFic3RyYWN0IHB1c2goKTogUHJvbWlzZTxudW1iZXI+O1xuXG4gICAgYWJzdHJhY3QgY2FuUHVzaCgpOiBQcm9taXNlPGJvb2xlYW4+O1xuXG4gICAgYWJzdHJhY3QgY2hlY2tSZXF1aXJlbWVudHMoKTogUHJvbWlzZTxcInZhbGlkXCIgfCBcIm1pc3NpbmctcmVwb1wiIHwgXCJtaXNzaW5nLWdpdFwiPjtcblxuICAgIGFic3RyYWN0IGJyYW5jaEluZm8oKTogUHJvbWlzZTxCcmFuY2hJbmZvPjtcblxuICAgIGFic3RyYWN0IGNoZWNrb3V0KGJyYW5jaDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcblxuICAgIGFic3RyYWN0IGluaXQoKTogUHJvbWlzZTx2b2lkPjtcblxuICAgIGFic3RyYWN0IHNldENvbmZpZyhwYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xuXG4gICAgYWJzdHJhY3QgZ2V0Q29uZmlnKHBhdGg6IHN0cmluZyk6IFByb21pc2U8YW55PjtcblxuICAgIGFic3RyYWN0IGZldGNoKCk6IFByb21pc2U8dm9pZD47XG5cbiAgICBhc3luYyBmb3JtYXRDb21taXRNZXNzYWdlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1pdE1lc3NhZ2U7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlLmluY2x1ZGVzKFwie3tudW1GaWxlc319XCIpKSB7XG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gYXdhaXQgdGhpcy5zdGF0dXMoKTtcbiAgICAgICAgICAgIGxldCBudW1GaWxlcyA9IHN0YXR1cy5jaGFuZ2VkLmxlbmd0aDtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShcInt7bnVtRmlsZXN9fVwiLCBTdHJpbmcobnVtRmlsZXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5pbmNsdWRlcyhcInt7ZmlsZXN9fVwiKSkge1xuICAgICAgICAgICAgbGV0IHN0YXR1cyA9IGF3YWl0IHRoaXMuc3RhdHVzKCk7XG5cbiAgICAgICAgICAgIGxldCBjaGFuZ2VzZXQ6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nW107IH0gPSB7fTtcbiAgICAgICAgICAgIHN0YXR1cy5jaGFuZ2VkLmZvckVhY2goKHZhbHVlOiBGaWxlU3RhdHVzUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmluZGV4IGluIGNoYW5nZXNldCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VzZXRbdmFsdWUuaW5kZXhdLnB1c2godmFsdWUucGF0aCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlc2V0W3ZhbHVlLmluZGV4XSA9IFt2YWx1ZS5wYXRoXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGNodW5rcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgW2FjdGlvbiwgZmlsZXNdIG9mIE9iamVjdC5lbnRyaWVzKGNoYW5nZXNldCkpIHtcbiAgICAgICAgICAgICAgICBjaHVua3MucHVzaChhY3Rpb24gKyBcIiBcIiArIGZpbGVzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZpbGVzID0gY2h1bmtzLmpvaW4oXCIsIFwiKTtcblxuICAgICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie3tmaWxlc319XCIsIGZpbGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtb21lbnQgPSAod2luZG93IGFzIGFueSkubW9tZW50O1xuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoXG4gICAgICAgICAgICBcInt7ZGF0ZX19XCIsXG4gICAgICAgICAgICBtb21lbnQoKS5mb3JtYXQodGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tbWl0RGF0ZUZvcm1hdClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmxpc3RDaGFuZ2VkRmlsZXNJbk1lc3NhZ2VCb2R5KSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlICsgXCJcXG5cXG5cIiArIFwiQWZmZWN0ZWQgZmlsZXM6XCIgKyBcIlxcblwiICsgKGF3YWl0IHRoaXMuc3RhdHVzKCkpLnN0YWdlZC5qb2luKFwiXFxuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBzcGF3blN5bmMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbUFkYXB0ZXIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCBzaW1wbGVHaXQsICogYXMgc2ltcGxlIGZyb20gXCJzaW1wbGUtZ2l0XCI7XG5pbXBvcnQgeyBHaXRNYW5hZ2VyIH0gZnJvbSBcIi4vZ2l0TWFuYWdlclwiO1xuaW1wb3J0IE9ic2lkaWFuR2l0IGZyb20gXCIuL21haW5cIjtcbmltcG9ydCB7IEJyYW5jaEluZm8sIEZpbGVTdGF0dXNSZXN1bHQsIFBsdWdpblN0YXRlIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIFNpbXBsZUdpdCBleHRlbmRzIEdpdE1hbmFnZXIge1xuICAgIGdpdDogc2ltcGxlLlNpbXBsZUdpdDtcbiAgICBjb25zdHJ1Y3RvcihwbHVnaW46IE9ic2lkaWFuR2l0KSB7XG4gICAgICAgIHN1cGVyKHBsdWdpbik7XG5cbiAgICAgICAgY29uc3QgYWRhcHRlciA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgYXMgRmlsZVN5c3RlbUFkYXB0ZXI7XG4gICAgICAgIGNvbnN0IHBhdGggPSBhZGFwdGVyLmdldEJhc2VQYXRoKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNHaXRJbnN0YWxsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5naXQgPSBzaW1wbGVHaXQocGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBzdGF0dXMoKTogUHJvbWlzZTx7XG4gICAgICAgIGNoYW5nZWQ6IEZpbGVTdGF0dXNSZXN1bHRbXTtcbiAgICAgICAgc3RhZ2VkOiBzdHJpbmdbXTtcbiAgICAgICAgY29uZmxpY3RlZDogc3RyaW5nW107XG4gICAgfT4ge1xuICAgICAgICB0aGlzLnBsdWdpbi5zZXRTdGF0ZShQbHVnaW5TdGF0ZS5zdGF0dXMpO1xuICAgICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCB0aGlzLmdpdC5zdGF0dXMoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNoYW5nZWQ6IHN0YXR1cy5maWxlcyxcbiAgICAgICAgICAgIHN0YWdlZDogc3RhdHVzLnN0YWdlZCxcbiAgICAgICAgICAgIGNvbmZsaWN0ZWQ6IHN0YXR1cy5jb25mbGljdGVkLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFzeW5jIGNvbW1pdEFsbChtZXNzYWdlPzogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnVwZGF0ZVN1Ym1vZHVsZXMpIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldFN0YXRlKFBsdWdpblN0YXRlLmNvbW1pdCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmdpdC5zdWJNb2R1bGUoW1wiZm9yZWFjaFwiLCBcIi0tcmVjdXJzaXZlXCIsIGBnaXQgYWRkIC1BICYmIGlmIFsgISAteiBcIiQoZ2l0IHN0YXR1cyAtLXBvcmNlbGFpbilcIiBdOyB0aGVuIGdpdCBjb21taXQgLW0gXCIke21lc3NhZ2UgPz8gYXdhaXQgdGhpcy5mb3JtYXRDb21taXRNZXNzYWdlKCl9XCI7IGZpYF0sIChlcnI6IGFueSkgPT4gdGhpcy5vbkVycm9yKGVycikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGx1Z2luLnNldFN0YXRlKFBsdWdpblN0YXRlLmFkZCk7XG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0LmFkZChcbiAgICAgICAgICAgIFwiLi8qXCIsIChlcnI6IGFueSkgPT4gdGhpcy5vbkVycm9yKGVycilcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0U3RhdGUoUGx1Z2luU3RhdGUuY29tbWl0KTtcblxuICAgICAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2l0LmNvbW1pdChtZXNzYWdlID8/IGF3YWl0IHRoaXMuZm9ybWF0Q29tbWl0TWVzc2FnZSgpKSkuc3VtbWFyeS5jaGFuZ2VzO1xuICAgIH1cblxuICAgIGFzeW5jIHB1bGwoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0U3RhdGUoUGx1Z2luU3RhdGUucHVsbCk7XG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy51cGRhdGVTdWJtb2R1bGVzKVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5naXQuc3ViTW9kdWxlKFtcInVwZGF0ZVwiLCBcIi0tcmVtb3RlXCIsIFwiLS1tZXJnZVwiLCBcIi0tcmVjdXJzaXZlXCJdLCAoZXJyOiBhbnkpID0+IHRoaXMub25FcnJvcihlcnIpKTtcblxuICAgICAgICBjb25zdCBwdWxsUmVzdWx0ID0gYXdhaXQgdGhpcy5naXQucHVsbChbXCItLW5vLXJlYmFzZVwiXSxcbiAgICAgICAgICAgIGFzeW5jIChlcnI6IEVycm9yIHwgbnVsbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGlzcGxheUVycm9yKGBQdWxsIGZhaWxlZCAke2Vyci5tZXNzYWdlfWApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCB0aGlzLmdpdC5zdGF0dXMoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cy5jb25mbGljdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmhhbmRsZUNvbmZsaWN0KHN0YXR1cy5jb25mbGljdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gcHVsbFJlc3VsdC5maWxlcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgYXN5bmMgcHVzaCgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0aGlzLnBsdWdpbi5zZXRTdGF0ZShQbHVnaW5TdGF0ZS5zdGF0dXMpO1xuICAgICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCB0aGlzLmdpdC5zdGF0dXMoKTtcbiAgICAgICAgY29uc3QgdHJhY2tpbmdCcmFuY2ggPSBzdGF0dXMudHJhY2tpbmc7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRCcmFuY2ggPSBzdGF0dXMuY3VycmVudDtcbiAgICAgICAgY29uc3QgcmVtb3RlQ2hhbmdlZEZpbGVzID0gKGF3YWl0IHRoaXMuZ2l0LmRpZmZTdW1tYXJ5KFtjdXJyZW50QnJhbmNoLCB0cmFja2luZ0JyYW5jaF0pKS5jaGFuZ2VkO1xuXG4gICAgICAgIHRoaXMucGx1Z2luLnNldFN0YXRlKFBsdWdpblN0YXRlLnB1c2gpO1xuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MudXBkYXRlU3VibW9kdWxlcykge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5naXQuZW52KHsgLi4ucHJvY2Vzcy5lbnYsIFwiT0JTSURJQU5fR0lUXCI6IDEgfSkuc3ViTW9kdWxlKFtcImZvcmVhY2hcIiwgXCItLXJlY3Vyc2l2ZVwiLCBgdHJhY2tpbmc9JChnaXQgZm9yLWVhY2gtcmVmIC0tZm9ybWF0PSclKHVwc3RyZWFtOnNob3J0KScgXCIkKGdpdCBzeW1ib2xpYy1yZWYgLXEgSEVBRClcIik7IGVjaG8gJHRyYWNraW5nOyBpZiBbICEgLXogXCIkKGdpdCBkaWZmIC0tc2hvcnRzdGF0ICR0cmFja2luZylcIiBdOyB0aGVuIGdpdCBwdXNoOyBmaWBdLCAoZXJyOiBhbnkpID0+IHRoaXMub25FcnJvcihlcnIpKTtcblxuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0LmVudih7IC4uLnByb2Nlc3MuZW52LCBcIk9CU0lESUFOX0dJVFwiOiAxIH0pLnB1c2goKGVycjogYW55KSA9PiB0aGlzLm9uRXJyb3IoZXJyKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlbW90ZUNoYW5nZWRGaWxlcztcbiAgICB9XG5cblxuICAgIGFzeW5jIGNhblB1c2goKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIGFsbG93IHB1c2hpbmcgaW4gc3VibW9kdWxlcyBldmVuIGlmIHRoZSByb290IGhhcyBubyBjaGFuZ2VzLlxuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MudXBkYXRlU3VibW9kdWxlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5naXQuc3RhdHVzKChlcnI6IGFueSkgPT4gdGhpcy5vbkVycm9yKGVycikpO1xuICAgICAgICBjb25zdCB0cmFja2luZ0JyYW5jaCA9IHN0YXR1cy50cmFja2luZztcbiAgICAgICAgY29uc3QgY3VycmVudEJyYW5jaCA9IHN0YXR1cy5jdXJyZW50O1xuICAgICAgICBjb25zdCByZW1vdGVDaGFuZ2VkRmlsZXMgPSAoYXdhaXQgdGhpcy5naXQuZGlmZlN1bW1hcnkoW2N1cnJlbnRCcmFuY2gsIHRyYWNraW5nQnJhbmNoXSkpLmNoYW5nZWQ7XG5cbiAgICAgICAgcmV0dXJuIHJlbW90ZUNoYW5nZWRGaWxlcyAhPT0gMDtcbiAgICB9XG5cbiAgICBhc3luYyBjaGVja1JlcXVpcmVtZW50cygpOiBQcm9taXNlPFwidmFsaWRcIiB8IFwibWlzc2luZy1yZXBvXCIgfCBcIm1pc3NpbmctZ2l0XCI+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzR2l0SW5zdGFsbGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBcIm1pc3NpbmctZ2l0XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoYXdhaXQgdGhpcy5naXQuY2hlY2tJc1JlcG8oKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBcIm1pc3NpbmctcmVwb1wiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcInZhbGlkXCI7XG4gICAgfVxuXG4gICAgYXN5bmMgYnJhbmNoSW5mbygpOiBQcm9taXNlPEJyYW5jaEluZm8+IHtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5naXQuc3RhdHVzKChlcnI6IGFueSkgPT4gdGhpcy5vbkVycm9yKGVycikpO1xuICAgICAgICBjb25zdCBicmFuY2hlcyA9IGF3YWl0IHRoaXMuZ2l0LmJyYW5jaChbXCItLW5vLWNvbG9yXCJdLCAoZXJyOiBhbnkpID0+IHRoaXMub25FcnJvcihlcnIpKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY3VycmVudDogc3RhdHVzLmN1cnJlbnQsXG4gICAgICAgICAgICB0cmFja2luZzogc3RhdHVzLnRyYWNraW5nLFxuICAgICAgICAgICAgYnJhbmNoZXM6IGJyYW5jaGVzLmFsbCxcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgYXN5bmMgY2hlY2tvdXQoYnJhbmNoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5naXQuY2hlY2tvdXQoYnJhbmNoLCAoZXJyOiBhbnkpID0+IHRoaXMub25FcnJvcihlcnIpKTtcbiAgICB9O1xuXG4gICAgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5naXQuaW5pdChmYWxzZSk7XG4gICAgfTtcblxuICAgIGFzeW5jIHNldENvbmZpZyhwYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5naXQuYWRkQ29uZmlnKHBhdGgsIHZhbHVlLCAoZXJyOiBhbnkpID0+IHRoaXMub25FcnJvcihlcnIpKTtcbiAgICB9O1xuXG4gICAgYXN5bmMgZ2V0Q29uZmlnKHBhdGg6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHRoaXMuZ2l0Lmxpc3RDb25maWcoKGVycjogYW55KSA9PiB0aGlzLm9uRXJyb3IoZXJyKSk7XG4gICAgICAgIHJldHVybiBjb25maWcuYWxsW3BhdGhdO1xuICAgIH1cblxuICAgIGFzeW5jIGZldGNoKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmdpdC5mZXRjaCgoZXJyOiBhbnkpID0+IHRoaXMub25FcnJvcihlcnIpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzR2l0SW5zdGFsbGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3RldmV1a3gvZ2l0LWpzL2lzc3Vlcy80MDJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IHNwYXduU3luYygnZ2l0JywgWyctLXZlcnNpb24nXSwge1xuICAgICAgICAgICAgc3RkaW86ICdpZ25vcmUnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjb21tYW5kLmVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNvbW1hbmQuZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25FcnJvcihlcnJvcjogRXJyb3IgfCBudWxsKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGlzcGxheUVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IE5vdGljZSwgUGx1Z2luLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgQ2hhbmdlZEZpbGVzTW9kYWwgfSBmcm9tIFwic3JjL21vZGFscy9jaGFuZ2VkRmlsZXNNb2RhbFwiO1xuaW1wb3J0IHsgQ3VzdG9tTWVzc2FnZU1vZGFsIH0gZnJvbSBcInNyYy9tb2RhbHMvY3VzdG9tTWVzc2FnZU1vZGFsXCI7XG5pbXBvcnQgeyBQcm9taXNlUXVldWUgfSBmcm9tIFwic3JjL3Byb21pc2VRdWV1ZVwiO1xuaW1wb3J0IHsgT2JzaWRpYW5HaXRTZXR0aW5nc1RhYiB9IGZyb20gXCJzcmMvc2V0dGluZ3NcIjtcbmltcG9ydCB7IFN0YXR1c0JhciB9IGZyb20gXCJzcmMvc3RhdHVzQmFyXCI7XG5pbXBvcnQgeyBHaXRNYW5hZ2VyIH0gZnJvbSBcIi4vZ2l0TWFuYWdlclwiO1xuaW1wb3J0IHsgU2ltcGxlR2l0IH0gZnJvbSBcIi4vc2ltcGxlR2l0XCI7XG5pbXBvcnQgeyBQbHVnaW5TdGF0ZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmludGVyZmFjZSBPYnNpZGlhbkdpdFNldHRpbmdzIHtcbiAgICBjb21taXRNZXNzYWdlOiBzdHJpbmc7XG4gICAgY29tbWl0RGF0ZUZvcm1hdDogc3RyaW5nO1xuICAgIGF1dG9TYXZlSW50ZXJ2YWw6IG51bWJlcjtcbiAgICBhdXRvUHVsbEludGVydmFsOiBudW1iZXI7XG4gICAgYXV0b1B1bGxPbkJvb3Q6IGJvb2xlYW47XG4gICAgZGlzYWJsZVB1c2g6IGJvb2xlYW47XG4gICAgcHVsbEJlZm9yZVB1c2g6IGJvb2xlYW47XG4gICAgZGlzYWJsZVBvcHVwczogYm9vbGVhbjtcbiAgICBsaXN0Q2hhbmdlZEZpbGVzSW5NZXNzYWdlQm9keTogYm9vbGVhbjtcbiAgICBzaG93U3RhdHVzQmFyOiBib29sZWFuO1xuICAgIHVwZGF0ZVN1Ym1vZHVsZXM6IGJvb2xlYW47XG59XG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBPYnNpZGlhbkdpdFNldHRpbmdzID0ge1xuICAgIGNvbW1pdE1lc3NhZ2U6IFwidmF1bHQgYmFja3VwOiB7e2RhdGV9fVwiLFxuICAgIGNvbW1pdERhdGVGb3JtYXQ6IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiLFxuICAgIGF1dG9TYXZlSW50ZXJ2YWw6IDAsXG4gICAgYXV0b1B1bGxJbnRlcnZhbDogMCxcbiAgICBhdXRvUHVsbE9uQm9vdDogZmFsc2UsXG4gICAgZGlzYWJsZVB1c2g6IGZhbHNlLFxuICAgIHB1bGxCZWZvcmVQdXNoOiB0cnVlLFxuICAgIGRpc2FibGVQb3B1cHM6IGZhbHNlLFxuICAgIGxpc3RDaGFuZ2VkRmlsZXNJbk1lc3NhZ2VCb2R5OiBmYWxzZSxcbiAgICBzaG93U3RhdHVzQmFyOiB0cnVlLFxuICAgIHVwZGF0ZVN1Ym1vZHVsZXM6IGZhbHNlLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JzaWRpYW5HaXQgZXh0ZW5kcyBQbHVnaW4ge1xuICAgIGdpdE1hbmFnZXI6IEdpdE1hbmFnZXI7XG4gICAgc2V0dGluZ3M6IE9ic2lkaWFuR2l0U2V0dGluZ3M7XG4gICAgc3RhdHVzQmFyOiBTdGF0dXNCYXI7XG4gICAgc3RhdGU6IFBsdWdpblN0YXRlO1xuICAgIHRpbWVvdXRJREJhY2t1cDogbnVtYmVyO1xuICAgIHRpbWVvdXRJRFB1bGw6IG51bWJlcjtcbiAgICBsYXN0VXBkYXRlOiBudW1iZXI7XG4gICAgZ2l0UmVhZHkgPSBmYWxzZTtcbiAgICBwcm9taXNlUXVldWU6IFByb21pc2VRdWV1ZSA9IG5ldyBQcm9taXNlUXVldWUoKTtcbiAgICBjb25mbGljdE91dHB1dEZpbGUgPSBcImNvbmZsaWN0LWZpbGVzLW9ic2lkaWFuLWdpdC5tZFwiO1xuXG4gICAgc2V0U3RhdGUoc3RhdGU6IFBsdWdpblN0YXRlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXI/LmRpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBhc3luYyBvbmxvYWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsb2FkaW5nICcgKyB0aGlzLm1hbmlmZXN0Lm5hbWUgKyBcIiBwbHVnaW5cIik7XG4gICAgICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG5cbiAgICAgICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBPYnNpZGlhbkdpdFNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcInB1bGxcIixcbiAgICAgICAgICAgIG5hbWU6IFwiUHVsbCBmcm9tIHJlbW90ZSByZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5wcm9taXNlUXVldWUuYWRkVGFzaygoKSA9PiB0aGlzLnB1bGxDaGFuZ2VzRnJvbVJlbW90ZSgpKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcInB1c2hcIixcbiAgICAgICAgICAgIG5hbWU6IFwiQ3JlYXRlIGJhY2t1cFwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMucHJvbWlzZVF1ZXVlLmFkZFRhc2soKCkgPT4gdGhpcy5jcmVhdGVCYWNrdXAoZmFsc2UpKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwiY29tbWl0LXB1c2gtc3BlY2lmaWVkLW1lc3NhZ2VcIixcbiAgICAgICAgICAgIG5hbWU6IFwiQ3JlYXRlIGJhY2t1cCB3aXRoIHNwZWNpZmllZCBtZXNzYWdlXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gbmV3IEN1c3RvbU1lc3NhZ2VNb2RhbCh0aGlzKS5vcGVuKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcImxpc3QtY2hhbmdlZC1maWxlc1wiLFxuICAgICAgICAgICAgbmFtZTogXCJMaXN0IGNoYW5nZWQgZmlsZXNcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5naXRNYW5hZ2VyLnN0YXR1cygpO1xuICAgICAgICAgICAgICAgIG5ldyBDaGFuZ2VkRmlsZXNNb2RhbCh0aGlzLCBzdGF0dXMuY2hhbmdlZCkub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd1N0YXR1c0Jhcikge1xuICAgICAgICAgICAgLy8gaW5pdCBzdGF0dXNCYXJcbiAgICAgICAgICAgIGxldCBzdGF0dXNCYXJFbCA9IHRoaXMuYWRkU3RhdHVzQmFySXRlbSgpO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXIgPSBuZXcgU3RhdHVzQmFyKHN0YXR1c0JhckVsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJJbnRlcnZhbChcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5zdGF0dXNCYXIuZGlzcGxheSgpLCAxMDAwKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB0aGlzLmluaXQoKSk7XG5cbiAgICB9XG5cbiAgICBhc3luYyBvbnVubG9hZCgpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJREJhY2t1cCk7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SURQdWxsKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3VubG9hZGluZyAnICsgdGhpcy5tYW5pZmVzdC5uYW1lICsgXCIgcGx1Z2luXCIpO1xuICAgIH1cbiAgICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICAgIH1cbiAgICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2F2ZUxhc3RBdXRvKGRhdGU6IERhdGUsIG1vZGU6IFwiYmFja3VwXCIgfCBcInB1bGxcIikge1xuICAgICAgICBpZiAobW9kZSA9PT0gXCJiYWNrdXBcIikge1xuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubWFuaWZlc3QuaWQgKyBcIjpsYXN0QXV0b0JhY2t1cFwiLCBkYXRlLnRvU3RyaW5nKCkpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGUgPT09IFwicHVsbFwiKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5tYW5pZmVzdC5pZCArIFwiOmxhc3RBdXRvUHVsbFwiLCBkYXRlLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZExhc3RBdXRvKCk6IFByb21pc2U8eyBcImJhY2t1cFwiOiBEYXRlLCBcInB1bGxcIjogRGF0ZTsgfT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJiYWNrdXBcIjogbmV3IERhdGUod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubWFuaWZlc3QuaWQgKyBcIjpsYXN0QXV0b0JhY2t1cFwiKSA/PyBcIlwiKSxcbiAgICAgICAgICAgIFwicHVsbFwiOiBuZXcgRGF0ZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5tYW5pZmVzdC5pZCArIFwiOmxhc3RBdXRvUHVsbFwiKSA/PyBcIlwiKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmdpdE1hbmFnZXIgPSBuZXcgU2ltcGxlR2l0KHRoaXMpO1xuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmdpdE1hbmFnZXIuY2hlY2tSZXF1aXJlbWVudHMoKTtcbiAgICAgICAgICAgIHN3aXRjaCAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm1pc3NpbmctZ2l0XCI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheUVycm9yKFwiQ2Fubm90IHJ1biBnaXQgY29tbWFuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm1pc3NpbmctcmVwb1wiOlxuICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiQ2FuJ3QgZmluZCBhIHZhbGlkIGdpdCByZXBvc2l0b3J5LiBQbGVhc2UgY3JlYXRlIG9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInZhbGlkXCI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2l0UmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFBsdWdpblN0YXRlLmlkbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmF1dG9QdWxsT25Cb290KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb21pc2VRdWV1ZS5hZGRUYXNrKCgpID0+IHRoaXMucHVsbENoYW5nZXNGcm9tUmVtb3RlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RBdXRvcyA9IGF3YWl0IHRoaXMubG9hZExhc3RBdXRvKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b1NhdmVJbnRlcnZhbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLnNldHRpbmdzLmF1dG9TYXZlSW50ZXJ2YWwgLSAoTWF0aC5yb3VuZCgoKG5vdy5nZXRUaW1lKCkgLSBsYXN0QXV0b3MuYmFja3VwLmdldFRpbWUoKSkgLyAxMDAwKSAvIDYwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0QXV0b0JhY2t1cChkaWZmIDw9IDAgPyAwIDogZGlmZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b1B1bGxJbnRlcnZhbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLnNldHRpbmdzLmF1dG9QdWxsSW50ZXJ2YWwgLSAoTWF0aC5yb3VuZCgoKG5vdy5nZXRUaW1lKCkgLSBsYXN0QXV0b3MucHVsbC5nZXRUaW1lKCkpIC8gMTAwMCkgLyA2MCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEF1dG9QdWxsKGRpZmYgPD0gMCA/IDAgOiBkaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNvbWV0aGluZyB3ZWlyZCBoYXBwZW5lZC4gVGhlICdjaGVja1JlcXVpcmVtZW50cycgcmVzdWx0IGlzIFwiICsgcmVzdWx0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBwdWxsQ2hhbmdlc0Zyb21SZW1vdGUoKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmdpdFJlYWR5KSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5naXRSZWFkeSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGZpbGVzVXBkYXRlZCA9IGF3YWl0IHRoaXMuZ2l0TWFuYWdlci5wdWxsKCk7XG4gICAgICAgIGlmIChmaWxlc1VwZGF0ZWQgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlNZXNzYWdlKGBQdWxsZWQgbmV3IGNoYW5nZXMuICR7ZmlsZXNVcGRhdGVkfSBmaWxlcyB1cGRhdGVkYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlNZXNzYWdlKFwiRXZlcnl0aGluZyBpcyB1cC10by1kYXRlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2l0TWFuYWdlciBpbnN0YW5jZW9mIFNpbXBsZUdpdCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5naXRNYW5hZ2VyLnN0YXR1cygpO1xuICAgICAgICAgICAgaWYgKHN0YXR1cy5jb25mbGljdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihgWW91IGhhdmUgJHtzdGF0dXMuY29uZmxpY3RlZC5sZW5ndGh9IGNvbmZsaWN0IGZpbGVzYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFN0YXRlKFBsdWdpblN0YXRlLmlkbGUpO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZUJhY2t1cChmcm9tQXV0b0JhY2t1cDogYm9vbGVhbiwgY29tbWl0TWVzc2FnZT86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoIXRoaXMuZ2l0UmVhZHkpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5naXRSZWFkeSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICghZnJvbUF1dG9CYWNrdXApIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodGhpcy5jb25mbGljdE91dHB1dEZpbGUpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuZGVsZXRlKGZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdpdE1hbmFnZXIgaW5zdGFuY2VvZiBTaW1wbGVHaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMuZ2l0TWFuYWdlci5zdGF0dXMoKTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGNvbmZsaWN0IGZpbGVzIG9uIGF1dG8gYmFja3VwXG4gICAgICAgICAgICBpZiAoZnJvbUF1dG9CYWNrdXAgJiYgc3RhdHVzLmNvbmZsaWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoUGx1Z2luU3RhdGUuaWRsZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoYERpZCBub3QgY29tbWl0LCBiZWNhdXNlIHlvdSBoYXZlICR7c3RhdHVzLmNvbmZsaWN0ZWQubGVuZ3RofSBjb25mbGljdCBmaWxlcy4gUGxlYXNlIHJlc29sdmUgdGhlbSBhbmQgY29tbWl0IHBlciBjb21tYW5kLmApO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ29uZmxpY3Qoc3RhdHVzLmNvbmZsaWN0ZWQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNoYW5nZWRGaWxlcyA9IChhd2FpdCB0aGlzLmdpdE1hbmFnZXIuc3RhdHVzKCkpLmNoYW5nZWQ7XG5cbiAgICAgICAgaWYgKGNoYW5nZWRGaWxlcy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1pdGVkRmlsZXMgPSBhd2FpdCB0aGlzLmdpdE1hbmFnZXIuY29tbWl0QWxsKGNvbW1pdE1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5TWVzc2FnZShgQ29tbWl0dGVkICR7Y29tbWl0ZWRGaWxlc30gZmlsZXNgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU1lc3NhZ2UoXCJObyBjaGFuZ2VzIHRvIGNvbW1pdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5kaXNhYmxlUHVzaCkge1xuICAgICAgICAgICAgaWYgKCEoYXdhaXQgdGhpcy5naXRNYW5hZ2VyLmJyYW5jaEluZm8oKSkudHJhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihcIkRpZCBub3QgcHVzaC4gTm8gdHJhY2tpbmcgYnJhbmNoIGlzIHNldCEgUGxlYXNlIHNldCBvbmUgaW4gdGhlIHNldHRpbmdzXCIsIDEwMDAwKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFBsdWdpblN0YXRlLmlkbGUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyBQcmV2ZW50IHBsdWdpbiB0byBwdWxsL3B1c2ggYXQgZXZlcnkgY2FsbCBvZiBjcmVhdGVCYWNrdXAuIE9ubHkgaWYgdW5wdXNoZWQgY29tbWl0cyBhcmUgcHJlc2VudFxuICAgICAgICAgICAgaWYgKGF3YWl0IHRoaXMuZ2l0TWFuYWdlci5jYW5QdXNoKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5wdWxsQmVmb3JlUHVzaCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdWxsZWRGaWxlc0xlbmd0aCA9IGF3YWl0IHRoaXMuZ2l0TWFuYWdlci5wdWxsKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwdWxsZWRGaWxlc0xlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU1lc3NhZ2UoYFB1bGxlZCAke3B1bGxlZEZpbGVzTGVuZ3RofSBmaWxlcyBmcm9tIHJlbW90ZWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmVmcmVzaCBiZWNhdXNlIG9mIHB1bGxcbiAgICAgICAgICAgICAgICBsZXQgc3RhdHVzOiBhbnk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2l0TWFuYWdlciBpbnN0YW5jZW9mIFNpbXBsZUdpdCAmJiAoc3RhdHVzID0gYXdhaXQgdGhpcy5naXRNYW5hZ2VyLnN0YXR1cygpKS5jb25mbGljdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoYENhbm5vdCBwdXNoLiBZb3UgaGF2ZSAke3N0YXR1cy5jb25mbGljdGVkLmxlbmd0aH0gY29uZmxpY3QgZmlsZXNgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDb25mbGljdChzdGF0dXMuY29uZmxpY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoZWRGaWxlcyA9IGF3YWl0IHRoaXMuZ2l0TWFuYWdlci5wdXNoKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU1lc3NhZ2UoYFB1c2hlZCAke3B1c2hlZEZpbGVzfSBmaWxlcyB0byByZW1vdGVgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU1lc3NhZ2UoXCJObyBjaGFuZ2VzIHRvIHB1c2hcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTdGF0ZShQbHVnaW5TdGF0ZS5pZGxlKTtcbiAgICB9XG5cbiAgICBzdGFydEF1dG9CYWNrdXAobWludXRlcz86IG51bWJlcikge1xuICAgICAgICB0aGlzLnRpbWVvdXRJREJhY2t1cCA9IHdpbmRvdy5zZXRUaW1lb3V0KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvbWlzZVF1ZXVlLmFkZFRhc2soKCkgPT4gdGhpcy5jcmVhdGVCYWNrdXAodHJ1ZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZUxhc3RBdXRvKG5ldyBEYXRlKCksIFwiYmFja3VwXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEF1dG9CYWNrdXAoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAobWludXRlcyA/PyB0aGlzLnNldHRpbmdzLmF1dG9TYXZlSW50ZXJ2YWwpICogNjAwMDBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzdGFydEF1dG9QdWxsKG1pbnV0ZXM/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0SURQdWxsID0gd2luZG93LnNldFRpbWVvdXQoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9taXNlUXVldWUuYWRkVGFzaygoKSA9PiB0aGlzLnB1bGxDaGFuZ2VzRnJvbVJlbW90ZSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVMYXN0QXV0byhuZXcgRGF0ZSgpLCBcInB1bGxcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0QXV0b1B1bGwoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAobWludXRlcyA/PyB0aGlzLnNldHRpbmdzLmF1dG9QdWxsSW50ZXJ2YWwpICogNjAwMDBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjbGVhckF1dG9CYWNrdXAoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVvdXRJREJhY2t1cCkge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJREJhY2t1cCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY2xlYXJBdXRvUHVsbCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMudGltZW91dElEUHVsbCkge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJRFB1bGwpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZUNvbmZsaWN0KGNvbmZsaWN0ZWQ6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoUGx1Z2luU3RhdGUuY29uZmxpY3RlZCk7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gW1xuICAgICAgICAgICAgXCIjIENvbmZsaWN0IGZpbGVzXCIsXG4gICAgICAgICAgICBcIlBsZWFzZSByZXNvbHZlIHRoZW0gYW5kIGNvbW1pdCBwZXIgY29tbWFuZCAoVGhpcyBmaWxlIHdpbGwgYmUgZGVsZXRlZCBiZWZvcmUgdGhlIGNvbW1pdCkuXCIsXG4gICAgICAgICAgICAuLi5jb25mbGljdGVkLm1hcChlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGUpO1xuICAgICAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluayA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZmlsZVRvTGlua3RleHQoZmlsZSwgXCIvXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYC0gW1ske2xpbmt9XV1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgLSBOb3QgYSBmaWxlOiAke2V9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICBdO1xuICAgICAgICB0aGlzLndyaXRlQW5kT3BlbkZpbGUobGluZXMuam9pbihcIlxcblwiKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgd3JpdGVBbmRPcGVuRmlsZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci53cml0ZSh0aGlzLmNvbmZsaWN0T3V0cHV0RmlsZSwgdGV4dCk7XG5cbiAgICAgICAgbGV0IGZpbGVJc0FscmVhZHlPcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVBbGxMZWF2ZXMobGVhZiA9PiB7XG4gICAgICAgICAgICBpZiAobGVhZi5nZXREaXNwbGF5VGV4dCgpICE9IFwiXCIgJiYgdGhpcy5jb25mbGljdE91dHB1dEZpbGUuc3RhcnRzV2l0aChsZWFmLmdldERpc3BsYXlUZXh0KCkpKSB7XG4gICAgICAgICAgICAgICAgZmlsZUlzQWxyZWFkeU9wZW5lZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWZpbGVJc0FscmVhZHlPcGVuZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vcGVuTGlua1RleHQodGhpcy5jb25mbGljdE91dHB1dEZpbGUsIFwiL1wiLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlZ2lvbjogZGlzcGxheWluZyAvIGZvcm1hdHRpbmcgbWVzc2FnZXNcbiAgICBkaXNwbGF5TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcsIHRpbWVvdXQ6IG51bWJlciA9IDQgKiAxMDAwKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyPy5kaXNwbGF5TWVzc2FnZShtZXNzYWdlLnRvTG93ZXJDYXNlKCksIHRpbWVvdXQpO1xuXG4gICAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5kaXNhYmxlUG9wdXBzKSB7XG4gICAgICAgICAgICBuZXcgTm90aWNlKG1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coYGdpdCBvYnNpZGlhbiBtZXNzYWdlOiAke21lc3NhZ2V9YCk7XG4gICAgfVxuICAgIGRpc3BsYXlFcnJvcihtZXNzYWdlOiBzdHJpbmcsIHRpbWVvdXQ6IG51bWJlciA9IDApOiB2b2lkIHtcbiAgICAgICAgbmV3IE5vdGljZShtZXNzYWdlKTtcbiAgICAgICAgY29uc29sZS5sb2coYGdpdCBvYnNpZGlhbiBlcnJvcjogJHttZXNzYWdlfWApO1xuICAgICAgICB0aGlzLnN0YXR1c0Jhcj8uZGlzcGxheU1lc3NhZ2UobWVzc2FnZS50b0xvd2VyQ2FzZSgpLCB0aW1lb3V0KTtcbiAgICB9XG59Il0sIm5hbWVzIjpbIkZ1enp5U3VnZ2VzdE1vZGFsIiwiU3VnZ2VzdE1vZGFsIiwiU2V0dGluZyIsIk5vdGljZSIsIlBsdWdpblNldHRpbmdUYWIiLCJnaXRfZXJyb3JfMSIsInJlcXVpcmUkJDAiLCJvcyIsInR0eSIsInV0aWwiLCJyZXF1aXJlJCQxIiwidGhpcyIsImZzXzEiLCJmaWxlX2V4aXN0c18xIiwidXRpbF8xIiwiYXJndW1lbnRfZmlsdGVyc18xIiwicmVxdWlyZSQkMiIsInJlcXVpcmUkJDMiLCJyZXF1aXJlJCQ0IiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ3IiwidXRpbHNfMSIsInRhc2tfY29uZmlndXJhdGlvbl9lcnJvcl8xIiwidGFza18xIiwiQ2xlYW5TdW1tYXJ5XzEiLCJjaGVja19pc19yZXBvXzEiLCJjbGVhbl8xIiwiY29uZmlnXzEiLCJnaXRfY29uc3RydWN0X2Vycm9yXzEiLCJnaXRfcGx1Z2luX2Vycm9yXzEiLCJnaXRfcmVzcG9uc2VfZXJyb3JfMSIsInJlc2V0XzEiLCJkZWJ1Z18xIiwiZ2l0X2xvZ2dlcl8xIiwidGFza3NfcGVuZGluZ19xdWV1ZV8xIiwidGFzayIsImdpdEVycm9yIiwiY2hpbGRfcHJvY2Vzc18xIiwiZ2l0X2V4ZWN1dG9yX2NoYWluXzEiLCJwYXJzZV9kaWZmX3N1bW1hcnlfMSIsInBhcnNlX2xpc3RfbG9nX3N1bW1hcnlfMSIsInBhcnNlX3JlbW90ZV9vYmplY3RzXzEiLCJwYXJzZV9yZW1vdGVfbWVzc2FnZXNfMSIsIk1lcmdlU3VtbWFyeV8xIiwicGFyc2VfcHVsbF8xIiwicGFyc2VfbWVyZ2VfMSIsInBhcnNlX3B1c2hfMSIsInRhc2tfY2FsbGJhY2tfMSIsImNoYW5nZV93b3JraW5nX2RpcmVjdG9yeV8xIiwiaGFzaF9vYmplY3RfMSIsImluaXRfMSIsIm1lcmdlXzEiLCJwdXNoXzEiLCJzdGF0dXNfMSIsImxvZ18xIiwicHJvbWlzZV9kZWZlcnJlZF8xIiwiQnJhbmNoRGVsZXRlU3VtbWFyeV8xIiwiQnJhbmNoU3VtbWFyeV8xIiwicGFyc2VfYnJhbmNoX2RlbGV0ZV8xIiwicGFyc2VfYnJhbmNoXzEiLCJDaGVja0lnbm9yZV8xIiwicGFyc2VfY29tbWl0XzEiLCJwYXJzZV9mZXRjaF8xIiwicGFyc2VfbW92ZV8xIiwiR2V0UmVtb3RlU3VtbWFyeV8xIiwicmVxdWlyZSQkOCIsInJlcXVpcmUkJDkiLCJyZXF1aXJlJCQxMCIsInJlcXVpcmUkJDExIiwicmVxdWlyZSQkMTIiLCJyZXF1aXJlJCQxMyIsInJlcXVpcmUkJDE0IiwicmVxdWlyZSQkMTUiLCJyZXF1aXJlJCQxNiIsInJlcXVpcmUkJDE3IiwicmVxdWlyZSQkMTgiLCJyZXF1aXJlJCQxOSIsInJlcXVpcmUkJDIwIiwicmVxdWlyZSQkMjEiLCJyZXF1aXJlJCQyMiIsInBsdWdpbnMiLCJwbHVnaW5zXzEiLCJHaXQiLCJnaXRfZmFjdG9yeV8xIiwic2ltcGxlR2l0Iiwic3Bhd25TeW5jIiwiVEZpbGUiLCJQbHVn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QUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pLLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUM5QyxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3hFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUNoSSxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUMxRyxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3pGLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDdkYsb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0FB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LEdBQUcsR0FBRyxDQUFDO0FBQ3BDLEdBQUc7QUFDSCxFQUFFLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtBQUNsQixJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3BDLEdBQUc7QUFDSCxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxPQUFPLENBQUMsRUFBRSxFQUFFO0FBQ3JCLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQixFQUFFLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtBQUNsQixJQUFJLE9BQU8sTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLEdBQUc7QUFDSCxFQUFFLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtBQUNsQixJQUFJLE9BQU8sTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLEdBQUc7QUFDSCxFQUFFLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtBQUNsQixJQUFJLE9BQU8sTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLEdBQUc7QUFDSCxFQUFFLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtBQUNsQixJQUFJLE9BQU8sTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLEdBQUc7QUFDSCxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQztBQUNwQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFL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O0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxTQUFTO0FBQ1YsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVMsR0FBRztBQUNyQjtBQUNBO0FBQ0E7QUFDQSxDQUFDLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDdkgsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLEVBQUU7QUFDRjtBQUNBO0FBQ0EsQ0FBQyxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsU0FBUyxJQUFJLFNB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QUFDTCxHQUFHLEVBQUU7QUFDTCxHQUFHLEVBQUU7QUFDTCxHQUFHLEVBQUU7QUFDTCxHQUFHLEVBQUU7QUFDTCxHQUFHLEVBQUU7QUFDTCxHQUFHLEVBQUU7QUFDTCxHQUFHLEVBQUU7QUFDTCxHQUFHLEVBQUU7QUFDTCxHQUFHLEVBQUU7QUFDTCxHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLEdBQUc7QUFDTixHQUFHLENBQUM7QUFDSixFQUFFO0FBQ0YsQ0FBQyxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2hCO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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SSxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLEtBQUtBLEtBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6SCxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksS0FBS0EsS0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNILElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxLQUFLQSxLQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUlBLEtBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5SixJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksS0FBS0EsS0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJQSxLQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUlBLEtBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzTSxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksS0FBS0EsS0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJQSxLQUFPLENBQUMs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
