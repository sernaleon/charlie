/*! 
* DevExpress Mobile View and Layout Framework (part of PhoneJS)
* Version: 13.2.8
* Build date: Mar 11, 2014
*
* Copyright (c) 2012 - 2014 Developer Express Inc. ALL RIGHTS RESERVED
* EULA: http://phonejs.devexpress.com/EULA
*/

"use strict";
if (!DevExpress.MOD_FRAMEWORK) {
    if (!window.DevExpress)
        throw Error('Required module is not referenced: core');
    /*! Module framework, file framework.js */
    (function($, DX, undefined) {
        var mergeWithReplace = function(destination, source, needReplaceFn) {
                var result = [];
                for (var i = 0, destinationLength = destination.length; i < destinationLength; i++)
                    if (!needReplaceFn(destination[i], source))
                        result.push(destination[i]);
                result.push.apply(result, source);
                return result
            };
        var getMergeCommands = function() {
                return function(destination, source) {
                        return mergeWithReplace(destination, source, function(destObject, source) {
                                return $.grep(source, function(srcObject) {
                                        return destObject.option("id") === srcObject.option("id") && srcObject.option("id") || destObject.option("behavior") === srcObject.option("behavior") && destObject.option("behavior")
                                    }).length
                            })
                    }
            };
        var resolvePropertyValue = function(command, containerOptions, propertyName) {
                var defaultOption = containerOptions ? containerOptions[propertyName] : undefined;
                return command.option(propertyName) || defaultOption
            };
        var resolveTextValue = function(command, containerOptions) {
                var hasIcon = !!command.option("icon") || command.option("iconSrc"),
                    titleValue = resolvePropertyValue(command, containerOptions, "title");
                return containerOptions.showText || !hasIcon ? titleValue : ""
            };
        var resolveIconValue = function(command, containerOptions, propertyName) {
                var hasText = !!command.option("title"),
                    iconValue = resolvePropertyValue(command, containerOptions, propertyName);
                return containerOptions.showIcon || !hasText ? iconValue : undefined
            };
        var resolveTypeValue = function(command, containerOptions) {
                return resolvePropertyValue(command, containerOptions, "type")
            };
        DX.framework = {utils: {
                mergeCommands: getMergeCommands(),
                commandToContainer: {
                    resolveTypeValue: resolveTypeValue,
                    resolveIconValue: resolveIconValue,
                    resolveTextValue: resolveTextValue,
                    resolvePropertyValue: resolvePropertyValue
                }
            }}
    })(jQuery, DevExpress);
    /*! Module framework, file framework.routing.js */
    (function($, DX) {
        var Class = DX.Class;
        DX.framework.Route = Class.inherit({
            _trimSeparators: function(str) {
                return str.replace(/^[\/.]+|\/+$/g, "")
            },
            _escapeRe: function(str) {
                return str.replace(/\W/g, "\\$1")
            },
            _checkConstraint: function(param, constraint) {
                param = String(param);
                if (typeof constraint === "string")
                    constraint = new RegExp(constraint);
                var match = constraint.exec(param);
                if (!match || match[0] !== param)
                    return false;
                return true
            },
            _ensureReady: function() {
                var self = this;
                if (this._patternRe)
                    return false;
                this._pattern = this._trimSeparators(this._pattern);
                this._patternRe = "";
                this._params = [];
                this._segments = [];
                this._separators = [];
                this._pattern.replace(/[^\/]+/g, function(segment, index) {
                    self._segments.push(segment);
                    if (index)
                        self._separators.push(self._pattern.substr(index - 1, 1))
                });
                $.each(this._segments, function(index) {
                    var isStatic = true,
                        segment = this,
                        separator = index ? self._separators[index - 1] : "";
                    if (segment.charAt(0) === ":") {
                        isStatic = false;
                        segment = segment.substr(1);
                        self._params.push(segment);
                        self._patternRe += "(?:" + separator + "([^/]+))";
                        if (segment in self._defaults)
                            self._patternRe += "?"
                    }
                    else
                        self._patternRe += separator + self._escapeRe(segment)
                });
                this._patternRe = new RegExp("^" + this._patternRe + "$")
            },
            ctor: function(pattern, defaults, constraints) {
                this._pattern = pattern || "";
                this._defaults = defaults || {};
                this._constraints = constraints || {}
            },
            parse: function(uri) {
                var self = this;
                this._ensureReady();
                var matches = this._patternRe.exec(uri);
                if (!matches)
                    return false;
                var result = $.extend({}, this._defaults);
                $.each(this._params, function(i) {
                    var index = i + 1;
                    if (matches.length >= index && matches[index])
                        result[this] = self.parseSegment(matches[index])
                });
                $.each(this._constraints, function(key) {
                    if (!self._checkConstraint(result[key], self._constraints[key])) {
                        result = false;
                        return false
                    }
                });
                return result
            },
            format: function(routeValues) {
                var self = this,
                    query = "";
                this._ensureReady();
                var mergeValues = $.extend({}, this._defaults),
                    useStatic = 0,
                    ret = [],
                    dels = [],
                    unusedRouteValues = {};
                $.each(routeValues, function(paramName, paramValue) {
                    routeValues[paramName] = self.formatSegment(paramValue);
                    if (!(paramName in mergeValues))
                        unusedRouteValues[paramName] = true
                });
                $.each(this._segments, function(index, segment) {
                    ret[index] = index ? self._separators[index - 1] : '';
                    if (segment.charAt(0) === ':') {
                        var paramName = segment.substr(1);
                        if (!(paramName in routeValues) && !(paramName in self._defaults)) {
                            ret = null;
                            return false
                        }
                        if (paramName in self._constraints && !self._checkConstraint(routeValues[paramName], self._constraints[paramName])) {
                            ret = null;
                            return false
                        }
                        if (paramName in routeValues) {
                            if (routeValues[paramName] !== undefined) {
                                mergeValues[paramName] = routeValues[paramName];
                                ret[index] += routeValues[paramName];
                                useStatic = index
                            }
                            delete unusedRouteValues[paramName]
                        }
                        else if (paramName in mergeValues) {
                            ret[index] += mergeValues[paramName];
                            dels.push(index)
                        }
                    }
                    else {
                        ret[index] += segment;
                        useStatic = index
                    }
                });
                $.each(mergeValues, function(key, value) {
                    if (!!value && $.inArray(":" + key, self._segments) === -1 && routeValues[key] !== value) {
                        ret = null;
                        return false
                    }
                });
                var unusedCount = 0;
                if (!$.isEmptyObject(unusedRouteValues)) {
                    query = "?";
                    $.each(unusedRouteValues, function(key) {
                        query += key + "=" + routeValues[key] + "&";
                        unusedCount++
                    });
                    query = query.substr(0, query.length - 1)
                }
                $.each(routeValues, function(i) {
                    if (!this in mergeValues) {
                        ret = null;
                        return false
                    }
                });
                if (ret === null)
                    return false;
                if (dels.length)
                    $.map(dels, function(i) {
                        if (i >= useStatic)
                            ret[i] = ''
                    });
                var path = ret.join('');
                path = path.replace(/\/+$/, "");
                return {
                        uri: path + query,
                        unusedCount: unusedCount
                    }
            },
            formatSegment: function(value) {
                if ($.isArray(value) || $.isPlainObject(value))
                    return "json:" + encodeURIComponent(JSON.stringify(value));
                return encodeURIComponent(value)
            },
            parseSegment: function(value) {
                if (value.substr(0, 5) === "json:")
                    try {
                        return $.parseJSON(decodeURIComponent(value.substr(5)))
                    }
                    catch(x) {}
                return decodeURIComponent(value)
            }
        });
        DX.framework.MvcRouter = DX.Class.inherit({
            ctor: function() {
                this._registry = []
            },
            _trimSeparators: function(str) {
                return str.replace(/^[\/.]+|\/+$/g, "")
            },
            _createRoute: function(pattern, defaults, constraints) {
                return new DX.framework.Route(pattern, defaults, constraints)
            },
            register: function(pattern, defaults, constraints) {
                this._registry.push(this._createRoute(pattern, defaults, constraints))
            },
            _parseQuery: function(query) {
                var result = {},
                    values = query.split("&");
                $.each(values, function(index, value) {
                    var keyValuePair = value.split("=");
                    result[keyValuePair[0]] = decodeURIComponent(keyValuePair[1])
                });
                return result
            },
            parse: function(uri) {
                var self = this,
                    ret;
                uri = this._trimSeparators(uri);
                var parts = uri.split("?", 2),
                    path = parts[0],
                    query = parts[1];
                $.each(this._registry, function() {
                    var result = this.parse(path);
                    if (result !== false) {
                        ret = result;
                        if (query)
                            ret = $.extend(ret, self._parseQuery(query));
                        return false
                    }
                });
                return ret ? ret : false
            },
            format: function(obj) {
                var ret = false,
                    minUnusedCount = 99999;
                obj = obj || {};
                $.each(this._registry, function() {
                    var toFormat = $.extend(true, {}, obj);
                    var result = this.format(toFormat);
                    if (result !== false)
                        if (minUnusedCount > result.unusedCount) {
                            minUnusedCount = result.unusedCount;
                            ret = result.uri
                        }
                });
                return ret
            }
        })
    })(jQuery, DevExpress);
    /*! Module framework, file framework.command.js */
    (function($, DX) {
        var ui = DX.ui;
        DX.framework.dxCommand = ui.Component.inherit({
            ctor: function(element, options) {
                if ($.isPlainObject(element)) {
                    options = element;
                    element = $("<div />")
                }
                this.beforeExecute = $.Callbacks();
                this.afterExecute = $.Callbacks();
                this.callBase(element, options)
            },
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        action: null,
                        id: null,
                        title: "",
                        icon: "",
                        iconSrc: "",
                        visible: true,
                        disabled: false
                    })
            },
            execute: function() {
                var isDisabled = this._options.disabled;
                if ($.isFunction(isDisabled))
                    isDisabled = !!isDisabled.apply(this, arguments);
                if (isDisabled)
                    throw new Error(DX.utils.stringFormat("Cannot execute command: {0}", this._options.id));
                this.beforeExecute.fire(arguments);
                this._createActionByOption("action", {allowedForGesture: true}).apply(this, arguments);
                this.afterExecute.fire(arguments)
            },
            _render: function() {
                this.callBase();
                this._element().addClass("dx-command")
            },
            _renderDisabledState: $.noop,
            _dispose: function() {
                this.callBase();
                this._element().removeData(this.NAME);
                this.beforeExecute.empty();
                this.afterExecute.empty()
            }
        });
        ui.registerComponent("dxCommand", DX.framework.dxCommand)
    })(jQuery, DevExpress);
    /*! Module framework, file framework.commandMapping.js */
    (function($, DX) {
        DX.framework.CommandMapping = DX.Class.inherit({
            ctor: function() {
                this._commandMappings = {};
                this._containerDefaults = {}
            },
            setDefaults: function(containerId, defaults) {
                this._containerDefaults[containerId] = defaults;
                return this
            },
            mapCommands: function(containerId, commandMappings) {
                var self = this;
                $.each(commandMappings, function(index, commandMapping) {
                    if (typeof commandMapping === "string")
                        commandMapping = {id: commandMapping};
                    var commandId = commandMapping.id;
                    var mappings = self._commandMappings[containerId] || {};
                    mappings[commandId] = $.extend({
                        showIcon: true,
                        showText: true
                    }, self._containerDefaults[containerId] || {}, commandMapping);
                    self._commandMappings[containerId] = mappings
                });
                this._initExistingCommands();
                return this
            },
            unmapCommands: function(containerId, commandIds) {
                var self = this;
                $.each(commandIds, function(index, commandId) {
                    var mappings = self._commandMappings[containerId] || {};
                    if (mappings)
                        delete mappings[commandId]
                });
                this._initExistingCommands()
            },
            getCommandMappingForContainer: function(commandId, containerId) {
                return (this._commandMappings[containerId] || {})[commandId]
            },
            checkCommandsExist: function(commands) {
                var self = this,
                    result = $.grep(commands, function(commandName, index) {
                        return $.inArray(commandName, self._existingCommands) < 0 && $.inArray(commandName, commands) === index
                    });
                if (result.length !== 0)
                    throw new Error("The '" + result.join("', '") + "' command" + (result.length === 1 ? " is" : "s are") + " not registred in the application's command mapping. See http://dxpr.es/1bTjfj1 for more details.");
            },
            load: function(config) {
                if (!config)
                    return;
                var self = this;
                $.each(config, function(name, container) {
                    self.setDefaults(name, container.defaults);
                    self.mapCommands(name, container.commands)
                });
                return this
            },
            _initExistingCommands: function() {
                var self = this;
                this._existingCommands = [];
                $.each(self._commandMappings, function(name, _commands) {
                    $.each(_commands, function(index, command) {
                        if ($.inArray(command.id, self._existingCommands) < 0)
                            self._existingCommands.push(command.id)
                    })
                })
            }
        });
        DX.framework.CommandMapping.defaultMapping = {
            "global-navigation": {
                defaults: {
                    showIcon: true,
                    showText: true
                },
                commands: []
            },
            "ios-header-toolbar": {
                defaults: {
                    showIcon: false,
                    showText: true,
                    location: "right"
                },
                commands: ["edit", "save", {
                        id: "back",
                        location: "left"
                    }, {
                        id: "cancel",
                        location: "left"
                    }, {
                        id: "create",
                        showIcon: true,
                        showText: false
                    }]
            },
            "ios-action-sheet": {
                defaults: {
                    showIcon: false,
                    showText: true
                },
                commands: []
            },
            "ios-view-footer": {
                defaults: {
                    showIcon: false,
                    showText: true
                },
                commands: [{
                        id: "delete",
                        type: "danger"
                    }]
            },
            "android-header-toolbar": {
                defaults: {
                    showIcon: true,
                    showText: false,
                    location: "right"
                },
                commands: [{
                        id: "back",
                        showIcon: false,
                        location: "left"
                    }, "create", "edit", "save", {
                        id: "cancel",
                        showText: true,
                        location: "menu"
                    }, {
                        id: "delete",
                        showText: true,
                        location: "menu"
                    }]
            },
            "android-simple-toolbar": {
                defaults: {
                    showIcon: true,
                    showText: false,
                    location: "right"
                },
                commands: [{
                        id: "back",
                        showIcon: false,
                        location: "left"
                    }, {id: "create"}, {
                        id: "save",
                        showText: true,
                        location: "left"
                    }, {
                        id: "edit",
                        showText: true,
                        location: "menu"
                    }, {
                        id: "cancel",
                        showText: true,
                        location: "menu"
                    }, {
                        id: "delete",
                        showText: true,
                        location: "menu"
                    }]
            },
            "android-footer-toolbar": {
                defaults: {location: "right"},
                commands: [{
                        id: "create",
                        showText: false,
                        location: "center"
                    }, {
                        id: "edit",
                        showText: false,
                        location: "left"
                    }, {
                        id: "delete",
                        location: "menu"
                    }, {
                        id: "save",
                        showIcon: false,
                        location: "left"
                    }]
            },
            "tizen-header-toolbar": {
                defaults: {
                    showIcon: true,
                    showText: false,
                    location: "right"
                },
                commands: [{
                        id: "back",
                        showIcon: false,
                        location: "left"
                    }, "create", "edit", "save", {
                        id: "cancel",
                        showText: true,
                        location: "menu"
                    }, {
                        id: "delete",
                        showText: true,
                        location: "menu"
                    }]
            },
            "tizen-footer-toolbar": {
                defaults: {location: "right"},
                commands: [{
                        id: "create",
                        showText: false
                    }, {
                        id: "edit",
                        showText: false,
                        location: "left"
                    }, {
                        id: "delete",
                        location: "menu"
                    }, {
                        id: "save",
                        showIcon: false,
                        location: "left"
                    }]
            },
            "tizen-simple-toolbar": {
                defaults: {
                    showIcon: true,
                    showText: false,
                    location: "right"
                },
                commands: [{
                        id: "back",
                        showIcon: false,
                        location: "left"
                    }, {id: "create"}, {
                        id: "save",
                        showText: true,
                        location: "left"
                    }, {
                        id: "edit",
                        showText: true,
                        location: "menu"
                    }, {
                        id: "cancel",
                        showText: true,
                        location: "menu"
                    }, {
                        id: "delete",
                        showText: true,
                        location: "menu"
                    }]
            },
            "generic-header-toolbar": {
                defaults: {
                    showIcon: false,
                    showText: true,
                    location: "right"
                },
                commands: ["edit", "save", {
                        id: "back",
                        location: "left"
                    }, {
                        id: "cancel",
                        location: "left"
                    }, {
                        id: "create",
                        showIcon: true,
                        showText: false
                    }]
            },
            "generic-view-footer": {
                defaults: {
                    showIcon: false,
                    showText: true
                },
                commands: [{
                        id: "delete",
                        type: "danger"
                    }]
            },
            "win8-appbar": {
                defaults: {location: "right"},
                commands: ["edit", "cancel", "save", "delete", {
                        id: "create",
                        location: "left"
                    }]
            },
            "win8-toolbar": {
                defaults: {
                    showText: false,
                    location: "left"
                },
                commands: [{id: "previousPage"}]
            },
            "win8-phone-appbar": {
                defaults: {location: "center"},
                commands: ["create", "edit", "cancel", "save", {
                        id: "delete",
                        location: "menu"
                    }]
            },
            "desktop-toolbar": {
                defaults: {
                    showIcon: false,
                    showText: true,
                    location: "right"
                },
                commands: ["cancel", "create", "edit", "save", {
                        id: "delete",
                        type: "danger"
                    }]
            }
        }
    })(jQuery, DevExpress);
    /*! Module framework, file framework.viewCache.js */
    (function($, DX, undefined) {
        var Class = DX.Class;
        DX.framework.ViewCache = Class.inherit({
            ctor: function() {
                this._cache = {}
            },
            setView: function(key, viewInfo) {
                this._cache[key] = viewInfo
            },
            getView: function(key) {
                return this._cache[key]
            },
            removeView: function(key) {
                var result = this._cache[key];
                delete this._cache[key];
                return result
            },
            clear: function() {
                this._cache = {}
            },
            hasView: function(key) {
                return key in this._cache
            }
        });
        DX.framework.NullViewCache = Class.inherit({
            setView: $.noop,
            getView: $.noop,
            removeView: $.noop,
            clear: $.noop,
            hasView: $.noop
        })
    })(jQuery, DevExpress);
    /*! Module framework, file framework.stateManager.js */
    (function($, DX, undefined) {
        var Class = DX.Class;
        DX.framework.MemoryKeyValueStorage = Class.inherit({
            ctor: function() {
                this.storage = {}
            },
            getItem: function(key) {
                return this.storage[key]
            },
            setItem: function(key, value) {
                this.storage[key] = value
            },
            removeItem: function(key) {
                delete this.storage[key]
            }
        });
        DX.framework.StateManager = Class.inherit({
            ctor: function(options) {
                options = options || {};
                this.storage = options.storage || new DX.framework.MemoryKeyValueStorage;
                this.stateSources = options.stateSources || []
            },
            addStateSource: function(stateSource) {
                this.stateSources.push(stateSource)
            },
            removeStateSource: function(stateSource) {
                var index = $.inArray(stateSource, this.stateSources);
                if (index > -1) {
                    this.stateSources.splice(index, 1);
                    stateSource.removeState(this.storage)
                }
            },
            saveState: function() {
                var self = this;
                $.each(this.stateSources, function(index, stateSource) {
                    stateSource.saveState(self.storage)
                })
            },
            restoreState: function() {
                var self = this;
                $.each(this.stateSources, function(index, stateSource) {
                    stateSource.restoreState(self.storage)
                })
            },
            clearState: function() {
                var self = this;
                $.each(this.stateSources, function(index, stateSource) {
                    stateSource.removeState(self.storage)
                })
            }
        })
    })(jQuery, DevExpress);
    /*! Module framework, file framework.browserAdapters.js */
    (function($, DX, undefined) {
        var Class = DX.Class;
        var ROOT_PAGE_URL = "__root__",
            BUGGY_ANDROID_BUFFER_PAGE_URL = "__buffer__";
        DX.framework.DefaultBrowserAdapter = Class.inherit({
            ctor: function(options) {
                options = options || {};
                this._window = options.window || window;
                this.popState = $.Callbacks();
                $(this._window).on("hashchange", $.proxy(this._onHashChange, this));
                this._tasks = DX.createQueue()
            },
            replaceState: function(uri) {
                var self = this;
                return this._addTask(function() {
                        uri = self._normalizeUri(uri);
                        self._window.history.replaceState(null, null, "#" + uri);
                        self._currentTask.resolve()
                    })
            },
            pushState: function(uri) {
                var self = this;
                return this._addTask(function() {
                        uri = self._normalizeUri(uri);
                        self._window.history.pushState(null, null, "#" + uri);
                        self._currentTask.resolve()
                    })
            },
            createRootPage: function() {
                return this.replaceState(ROOT_PAGE_URL)
            },
            _onHashChange: function() {
                if (this._currentTask)
                    this._currentTask.resolve();
                this.popState.fire()
            },
            back: function() {
                var self = this;
                return this._addTask(function() {
                        self._window.history.back()
                    })
            },
            getHash: function() {
                return this._normalizeUri(this._window.location.hash)
            },
            isRootPage: function() {
                return this.getHash() === ROOT_PAGE_URL
            },
            _normalizeUri: function(uri) {
                return (uri || "").replace(/^#+/, "")
            },
            _addTask: function(task) {
                var self = this,
                    d = $.Deferred();
                this._tasks.add(function() {
                    self._currentTask = d;
                    task();
                    return d
                });
                return d.promise()
            }
        });
        DX.framework.OldBrowserAdapter = DX.framework.DefaultBrowserAdapter.inherit({
            ctor: function() {
                this._innerEventCount = 0;
                this.callBase.apply(this, arguments);
                this._skipNextEvent = false
            },
            replaceState: function(uri) {
                var self = this;
                uri = self._normalizeUri(uri);
                if (self.getHash() !== uri) {
                    self._addTask(function() {
                        self._skipNextEvent = true;
                        self._window.history.back()
                    });
                    return self._addTask(function() {
                            self._skipNextEvent = true;
                            self._window.location.hash = uri
                        })
                }
                return $.Deferred().resolve().promise()
            },
            pushState: function(uri) {
                var self = this;
                uri = this._normalizeUri(uri);
                if (this.getHash() !== uri)
                    return self._addTask(function() {
                            self._skipNextEvent = true;
                            self._window.location.hash = uri
                        });
                return $.Deferred().resolve().promise()
            },
            createRootPage: function() {
                return this.pushState(ROOT_PAGE_URL)
            },
            _onHashChange: function() {
                var currentTask = this._currentTask;
                this._currentTask = null;
                if (this._skipNextEvent)
                    this._skipNextEvent = false;
                else
                    this.popState.fire();
                if (currentTask)
                    currentTask.resolve()
            }
        });
        DX.framework.BuggyAndroidBrowserAdapter = DX.framework.OldBrowserAdapter.inherit({createRootPage: function() {
                this.pushState(BUGGY_ANDROID_BUFFER_PAGE_URL);
                return this.callBase()
            }});
        DX.framework.HistorylessBrowserAdapter = DX.framework.DefaultBrowserAdapter.inherit({
            ctor: function(options) {
                options = options || {};
                this._window = options.window || window;
                this.popState = $.Callbacks();
                $(this._window).on("dxback", $.proxy(this._onHashChange, this));
                this._currentHash = this._window.location.hash
            },
            replaceState: function(uri) {
                this._currentHash = this._normalizeUri(uri);
                return $.Deferred().resolve().promise()
            },
            pushState: function(uri) {
                return this.replaceState(uri)
            },
            createRootPage: function() {
                return this.replaceState(ROOT_PAGE_URL)
            },
            getHash: function() {
                return this._normalizeUri(this._currentHash)
            },
            back: function() {
                return this.replaceState(ROOT_PAGE_URL)
            },
            _onHashChange: function() {
                var promise = this.back();
                this.popState.fire();
                return promise
            }
        })
    })(jQuery, DevExpress);
    /*! Module framework, file framework.browserNavigationDevice.js */
    (function($, DX, undefined) {
        var Class = DX.Class;
        var SESSION_KEY = "dxPhoneJSApplication";
        DX.framework.BrowserNavigationDevice = Class.inherit({
            ctor: function(options) {
                options = options || {};
                this._browserAdapter = options.browserAdapter || this._createBrowserAdapter(options);
                this.uriChanged = $.Callbacks();
                this.backInitiated = $.Callbacks();
                this._deferredNavigate = null;
                this._browserAdapter.popState.add($.proxy(this._onPopState, this));
                $(window).on("unload", this._saveBrowserState)
            },
            _isBuggyAndroid2: function() {
                var version = DX.devices.real.version;
                return DX.devices.real.platform === "android" && version.length > 1 && (version[0] === 2 && version[1] < 4 || version[0] < 2)
            },
            _isBuggyAndroid4: function() {
                var version = DX.devices.real.version;
                return DX.devices.real.platform === "android" && version.length > 1 && version[0] === 4 && version[1] === 0
            },
            _createBrowserAdapter: function(options) {
                var sourceWindow = options.window || window,
                    supportPushReplace = sourceWindow.history.replaceState && sourceWindow.history.pushState;
                if (sourceWindow !== sourceWindow.top)
                    return new DX.framework.HistorylessBrowserAdapter(options);
                if (this._isBuggyAndroid4())
                    return new DX.framework.BuggyAndroidBrowserAdapter(options);
                if (this._isBuggyAndroid2() || !supportPushReplace)
                    return new DX.framework.OldBrowserAdapter(options);
                return new DX.framework.DefaultBrowserAdapter(options)
            },
            _saveBrowserState: function() {
                if (window.sessionStorage)
                    sessionStorage.setItem(SESSION_KEY, true)
            },
            _prepareBrowserHistory: function() {
                var hash = this.getUri();
                if (!window.sessionStorage || sessionStorage.getItem(SESSION_KEY))
                    return $.Deferred().resolve().promise();
                sessionStorage.removeItem(SESSION_KEY);
                this._browserAdapter.createRootPage();
                return this._browserAdapter.pushState(hash)
            },
            getUri: function() {
                return this._browserAdapter.getHash()
            },
            setUri: function(uri) {
                return this._browserAdapter.isRootPage() ? this._browserAdapter.pushState(uri) : this._browserAdapter.replaceState(uri)
            },
            _onPopState: function(uri) {
                var self = this,
                    currentHash = this.getUri();
                if (this._deferredNavigate && this._deferredNavigate.state() === "pending")
                    if (this._browserAdapter.isRootPage())
                        this._deferredNavigate.resolve();
                    else
                        this._browserAdapter.back();
                else if (this._browserAdapter.isRootPage())
                    this.backInitiated.fire();
                else {
                    this._deferredNavigate = $.Deferred().done(function() {
                        self.uriChanged.fire(currentHash)
                    });
                    this._browserAdapter.back()
                }
            },
            back: function() {
                return this._browserAdapter.back()
            },
            init: function() {
                var self = this;
                return self._prepareBrowserHistory().done(function() {
                        if (self._browserAdapter.isRootPage())
                            self._browserAdapter.pushState("")
                    })
            }
        })
    })(jQuery, DevExpress);
    /*! Module framework, file framework.navigationManager.js */
    (function($, DX, undefined) {
        var Class = DX.Class;
        var NAVIGATION_TARGETS = {
                current: "current",
                blank: "blank",
                back: "back"
            },
            STORAGE_HISTORY_KEY = "__history";
        DX.framework.NavigationStack = Class.inherit({
            ctor: function(options) {
                options = options || {};
                this.itemsRemoved = $.Callbacks();
                this.clear()
            },
            currentItem: function() {
                return this.items[this.currentIndex]
            },
            back: function(uri) {
                this.currentIndex--;
                if (this.currentIndex < 0)
                    throw Error("Unable to go back");
                var currentItem = this.currentItem();
                if (currentItem.uri !== uri)
                    this._updateItem(this.currentIndex, uri)
            },
            forward: function() {
                this.currentIndex++;
                if (this.currentIndex >= this.items.length)
                    throw Error("Unable to go forward");
            },
            navigate: function(uri, replaceCurrent) {
                if (this.currentIndex < this.items.length && this.currentIndex > -1 && this.items[this.currentIndex].uri === uri)
                    return;
                if (replaceCurrent && this.currentIndex > -1)
                    this.currentIndex--;
                if (this.currentIndex + 1 < this.items.length && this.items[this.currentIndex + 1].uri === uri)
                    this.currentIndex++;
                else {
                    var toDelete = this.items.splice(this.currentIndex + 1, this.items.length - this.currentIndex - 1);
                    this.items.push({});
                    this.currentIndex++;
                    this._updateItem(this.currentIndex, uri);
                    this._deleteItems(toDelete)
                }
                return this.currentItem()
            },
            _updateItem: function(index, uri) {
                var item = this.items[index];
                item.uri = uri;
                item.key = this.items[0].uri + "_" + index + "_" + uri
            },
            _deleteItems: function(items) {
                if (items)
                    this.itemsRemoved.fire(items)
            },
            getPreviousItem: function() {
                return this.items.length > 1 ? this.items[this.currentIndex - 1] : undefined
            },
            canBack: function() {
                return this.currentIndex > 0
            },
            clear: function() {
                this._deleteItems(this.items);
                this.items = [];
                this.currentIndex = -1
            }
        });
        DX.framework.NavigationManager = Class.inherit({
            ctor: function(options) {
                options = options || {};
                var self = this;
                self.navigationStacks = {};
                self._keepPositionInStack = options.keepPositionInStack;
                self.currentStack = new DX.framework.NavigationStack;
                self.currentUri = undefined;
                self.navigating = $.Callbacks();
                self.navigated = $.Callbacks();
                self.navigatingBack = $.Callbacks();
                self.navigationCanceled = $.Callbacks();
                self.itemRemoved = $.Callbacks();
                self._navigationDevice = options.navigationDevice || new DX.framework.BrowserNavigationDevice;
                self._navigationDevice.uriChanged.add($.proxy(self.navigate, self));
                self._navigationDevice.backInitiated.add($.proxy(self._deviceBackInitiated, self));
                DX.hardwareBackButton.add($.proxy(self._deviceBackInitiated, self));
                self._stateStorageKey = options.stateStorageKey || STORAGE_HISTORY_KEY
            },
            init: function() {
                return this._navigationDevice.init()
            },
            _deviceBackInitiated: function() {
                if (!DX.backButtonCallback.fire())
                    this.back({isHardwareButton: true});
                else
                    this._restoreDevicePreviousUri()
            },
            _restoreDevicePreviousUri: function() {
                this._navigationDevice.setUri(this.currentUri)
            },
            navigate: function(uri, options) {
                var self = this;
                options = $.extend({target: NAVIGATION_TARGETS.blank}, options || {});
                if (uri === undefined)
                    uri = self._navigationDevice.getUri();
                if (/^_back$/.test(uri)) {
                    self.back();
                    return
                }
                var args = {
                        currentUri: self.currentUri,
                        uri: uri,
                        options: options,
                        cancel: false,
                        navigateWhen: []
                    };
                self.navigating.fire(args);
                uri = args.uri;
                if (args.cancel || self.currentUri === uri) {
                    this._restoreDevicePreviousUri();
                    self.navigationCanceled.fire(args)
                }
                else
                    $.when.apply($, args.navigateWhen).done(function() {
                        DX.utils.executeAsync(function() {
                            var previousUri = self.currentUri;
                            self.currentUri = uri;
                            self._updateHistory(uri, options);
                            self._restoreDevicePreviousUri();
                            self.navigated.fire({
                                uri: uri,
                                previousUri: previousUri,
                                options: options,
                                item: self.currentItem()
                            })
                        })
                    })
            },
            _createNavigationStack: function() {
                var result = new DX.framework.NavigationStack;
                result.itemsRemoved.add($.proxy(this._removeItems, this));
                return result
            },
            _updateHistory: function(uri, options) {
                var isRoot = options.root,
                    forceIsRoot = isRoot,
                    forceToRoot = false;
                if (isRoot || !this.currentStack.items.length) {
                    this.navigationStacks[uri] = this.navigationStacks[uri] || this._createNavigationStack();
                    if (this.currentStack === this.navigationStacks[uri])
                        forceToRoot = true;
                    else
                        this.currentStack = this.navigationStacks[uri];
                    forceIsRoot = true
                }
                if (isRoot && this.currentStack.items.length)
                    if (this._keepPositionInStack && options.root && !forceToRoot)
                        this.currentUri = this.currentItem().uri;
                    else {
                        this.currentStack.currentIndex = 0;
                        if (this.currentItem().uri !== uri)
                            this.currentStack.navigate(uri, true)
                    }
                else {
                    var prevIndex = this.currentStack.currentIndex,
                        prevItem = this.currentItem() || {};
                    switch (options.target) {
                        case NAVIGATION_TARGETS.blank:
                            this.currentStack.navigate(uri);
                            break;
                        case NAVIGATION_TARGETS.current:
                            this.currentStack.navigate(uri, true);
                            break;
                        case NAVIGATION_TARGETS.back:
                            if (this.currentStack.currentIndex > 0)
                                this.currentStack.back(uri);
                            else
                                this.currentStack.navigate(uri, true);
                            break;
                        default:
                            throw Error(DX.utils.stringFormat("Unknown navigation target: \"{0}\". Use the DevExpress.framework.NavigationManager.NAVIGATION_TARGETS enumerable values", options.target));
                    }
                    if (options.direction === undefined) {
                        var indexDelta = this.currentStack.currentIndex - prevIndex;
                        if (indexDelta < 0)
                            options.direction = this.currentItem().backDirection || "backward";
                        else if (indexDelta > 0 && this.currentStack.currentIndex > 0)
                            options.direction = "forward";
                        else
                            options.direction = "none"
                    }
                    prevItem.backDirection = options.direction === "forward" ? "backward" : "none"
                }
                options.root = forceIsRoot
            },
            _removeItems: function(items) {
                var self = this;
                $.each(items, function(index, item) {
                    self.itemRemoved.fire(item)
                })
            },
            back: function(options) {
                options = options || {};
                var navigatingBackArgs = $.extend({cancel: false}, options);
                this.navigatingBack.fire(navigatingBackArgs);
                if (navigatingBackArgs.cancel) {
                    this._restoreDevicePreviousUri();
                    return
                }
                var item = this.getPreviousItem();
                if (item)
                    this.navigate(item.uri, {
                        target: NAVIGATION_TARGETS.back,
                        item: item
                    });
                else
                    this._navigationDevice.back()
            },
            getPreviousItem: function() {
                return this.currentStack.getPreviousItem()
            },
            currentItem: function() {
                return this.currentStack.currentItem()
            },
            currentIndex: function() {
                return this.currentStack.currentIndex
            },
            rootUri: function() {
                return this.currentStack.items.length ? this.currentStack.items[0].uri : this.currentUri
            },
            canBack: function() {
                return this.currentStack.canBack() || DX.backButtonCallback.hasCallback()
            },
            getItemByIndex: function(index) {
                return this.currentStack.items[index]
            },
            saveState: function(storage) {
                if (this.currentStack.items.length) {
                    var state = {
                            items: this.currentStack.items,
                            currentIndex: this.currentStack.currentIndex,
                            currentStackKey: this.currentStack.items[0].uri
                        };
                    var json = JSON.stringify(state);
                    storage.setItem(this._stateStorageKey, json)
                }
                else
                    this.removeState(storage)
            },
            restoreState: function(storage) {
                if (this.disableRestoreState)
                    return;
                var json = storage.getItem(this._stateStorageKey);
                if (json)
                    try {
                        var state = JSON.parse(json),
                            stack = this._createNavigationStack();
                        if (!state.items[0].uri)
                            throw Error("Error while application state restoring. State has been cleared. Refresh the page");
                        stack.items = state.items;
                        stack.currentIndex = state.currentIndex;
                        this.navigationStacks[stack.items[0].uri] = stack;
                        this.currentStack = this.navigationStacks[state.currentStackKey];
                        this._navigationDevice.setUri(this.currentItem().uri)
                    }
                    catch(e) {
                        this.removeState(storage);
                        throw e;
                    }
            },
            removeState: function(storage) {
                storage.removeItem(this._stateStorageKey)
            },
            clearHistory: function() {
                this.currentStack.clear()
            }
        });
        DX.framework.NavigationManager.NAVIGATION_TARGETS = NAVIGATION_TARGETS
    })(jQuery, DevExpress);
    /*! Module framework, file framework.actionExecutors.js */
    (function($, DX, undefined) {
        DX.framework.createActionExecutors = function(app) {
            return {
                    routing: {execute: function(e) {
                            var action = e.action,
                                routeValues,
                                options,
                                uri;
                            if ($.isPlainObject(action)) {
                                routeValues = action.routeValues;
                                if (routeValues && $.isPlainObject(routeValues))
                                    options = action.options;
                                else
                                    routeValues = action;
                                uri = app.router.format(routeValues);
                                app.navigate(uri, options);
                                e.handled = true
                            }
                        }},
                    hash: {execute: function(e) {
                            if (typeof e.action !== "string" || e.action.charAt(0) !== "#")
                                return;
                            var uriTemplate = e.action.substr(1),
                                args = e.args[0],
                                uri = uriTemplate;
                            var defaultEvaluate = function(expr) {
                                    var getter = DX.data.utils.compileGetter(expr),
                                        model = e.args[0].model;
                                    return getter(model)
                                };
                            var evaluate = args.evaluate || defaultEvaluate;
                            uri = uriTemplate.replace(/\{([^}]+)\}/g, function(entry, expr) {
                                expr = $.trim(expr);
                                if (expr.indexOf(",") > -1)
                                    expr = $.map(expr.split(","), $.trim);
                                var value = evaluate(expr);
                                if (value === undefined)
                                    value = "";
                                value = DX.framework.Route.prototype.formatSegment(value);
                                return value
                            });
                            var navigateOptions = (e.component || {}).NAME === "dxCommand" ? e.component.option() : {};
                            app.navigate(uri, navigateOptions);
                            e.handled = true
                        }}
                }
        }
    })(jQuery, DevExpress);
    /*! Module framework, file framework.application.js */
    (function($, DX) {
        var Class = DX.Class,
            BACK_COMMAND_TITLE,
            INIT_IN_PROGRESS = "InProgress",
            INIT_COMPLETE = "Inited",
            frameworkNS = DX.framework;
        DX.framework.Application = Class.inherit({
            ctor: function(options) {
                options = options || {};
                this._options = options;
                this.namespace = options.namespace || options.ns || window;
                this.components = [];
                BACK_COMMAND_TITLE = DX.localization.localizeString("@Back");
                this.router = options.router || new DX.framework.MvcRouter;
                this.navigationManager = options.navigationManager || new DX.framework.NavigationManager({keepPositionInStack: options.navigateToRootViewMode === "keepHistory"});
                this.navigationManager.navigating.add($.proxy(this._onNavigating, this));
                this.navigationManager.navigatingBack.add($.proxy(this._onNavigatingBack, this));
                this.navigationManager.navigated.add($.proxy(this._onNavigated, this));
                this.navigationManager.navigationCanceled.add($.proxy(this._onNavigationCanceled, this));
                this.navigationManager.itemRemoved.add($.proxy(this._onNavigationItemRemoved, this));
                this.stateManager = options.stateManager || new DX.framework.StateManager({storage: options.stateStorage || sessionStorage});
                this.stateManager.addStateSource(this.navigationManager);
                this._viewCache = options.disableViewCache ? new DX.framework.NullViewCache : options.viewCache || new DX.framework.ViewCache;
                this.navigation = this._createNavigationCommands(options.navigation);
                this.commandMapping = this._createCommandMapping(options.commandMapping, this.navigation);
                this.beforeViewSetup = $.Callbacks();
                this.afterViewSetup = $.Callbacks();
                this.viewShowing = $.Callbacks();
                this.viewShown = $.Callbacks();
                this.viewHidden = $.Callbacks();
                this.viewDisposing = $.Callbacks();
                this.viewDisposed = $.Callbacks();
                this.navigating = $.Callbacks();
                this.navigatingBack = $.Callbacks();
                this.initialized = $.Callbacks();
                this._isNavigating = false;
                this._viewsToDispose = [];
                DX.registerActionExecutor(DX.framework.createActionExecutors(this));
                DX.overlayTargetContainer(".dx-viewport");
                this.components.push(this.router);
                this.components.push(this.navigationManager)
            },
            _createCommandMapping: function(commandMapping, navigationCommands) {
                var result = commandMapping;
                if (!(commandMapping instanceof DX.framework.CommandMapping)) {
                    result = new DX.framework.CommandMapping;
                    result.load(DX.framework.CommandMapping.defaultMapping || {}).load(commandMapping || {})
                }
                var navigationCommandIds = $.map(navigationCommands, function(command) {
                        return command.option("id")
                    });
                result.mapCommands("global-navigation", navigationCommandIds);
                return result
            },
            _createNavigationCommands: function(commandConfig) {
                if (!commandConfig)
                    return [];
                var self = this,
                    generatedIdCount = 0;
                return $.map(commandConfig, function(item) {
                        var command;
                        if (item instanceof frameworkNS.dxCommand)
                            command = item;
                        else
                            command = new frameworkNS.dxCommand($.extend({root: true}, item));
                        if (!command.option("id"))
                            command.option("id", "navigation_" + generatedIdCount++);
                        return command
                    })
            },
            _callComponentMethod: function(methodName, args) {
                var tasks = [];
                $.each(this.components, function(index, component) {
                    if (component[methodName] && $.isFunction(component[methodName])) {
                        var result = component[methodName](args);
                        if (result && result.done)
                            tasks.push(result)
                    }
                });
                return $.when.apply($, tasks)
            },
            init: function() {
                var self = this;
                self._initState = INIT_IN_PROGRESS;
                return self._callComponentMethod("init").done(function() {
                        self._initState = INIT_COMPLETE;
                        self._processEvent("initialized")
                    })
            },
            _onNavigatingBack: function(args) {
                this._processEvent("navigatingBack", args)
            },
            _onNavigating: function(args) {
                var self = this;
                if (self._isNavigating) {
                    self._pendingNavigationArgs = args;
                    args.cancel = true;
                    return
                }
                else {
                    self._isNavigating = true;
                    delete self._pendingNavigationArgs
                }
                var routeData = this.router.parse(args.uri);
                if (!routeData)
                    throw new Error(DX.utils.stringFormat("Routing rule is not found for the \"{0}\" url", args.uri));
                var uri = this.router.format(routeData);
                if (args.uri !== uri && uri) {
                    args.cancel = true;
                    DX.utils.executeAsync(function() {
                        self.navigate(uri, args.options)
                    })
                }
                else
                    self._processEvent("navigating", args)
            },
            _onNavigated: function(args) {
                var self = this,
                    direction = args.options.direction,
                    deferred = $.Deferred(),
                    viewInfo = self._acquireViewInfo(args.item);
                if (!self._isViewReadyToShow(viewInfo))
                    self._setViewLoadingState(viewInfo, direction).done(function() {
                        DX.utils.executeAsync(function() {
                            self._createViewModel(viewInfo);
                            self._createViewCommands(viewInfo);
                            deferred.resolve()
                        })
                    }).fail(function() {
                        self._isNavigating = false;
                        deferred.reject()
                    });
                else
                    deferred.resolve();
                deferred.done(function() {
                    self._highlightCurrentNavigationCommand(viewInfo);
                    self._showView(viewInfo, direction).always(function() {
                        self._isNavigating = false;
                        var pendingArgs = self._pendingNavigationArgs;
                        if (pendingArgs)
                            DX.utils.executeAsync(function() {
                                self.navigate(pendingArgs.uri, pendingArgs.options)
                            })
                    })
                })
            },
            _isViewReadyToShow: function(viewInfo) {
                return !!viewInfo.model
            },
            _onNavigationCanceled: function(args) {
                var self = this;
                if (!self._pendingNavigationArgs || self._pendingNavigationArgs.uri !== args.uri) {
                    var currentItem = self.navigationManager.currentItem();
                    if (currentItem)
                        DX.utils.executeAsync(function() {
                            var viewInfo = self._acquireViewInfo(currentItem);
                            self._highlightCurrentNavigationCommand(viewInfo)
                        });
                    self._isNavigating = false
                }
            },
            _onViewRemoved: function(viewInfo) {
                this._viewsToDispose.push(viewInfo)
            },
            _disposeRemovedViews: function() {
                var viewInfo;
                while (viewInfo = this._viewsToDispose.shift()) {
                    var args = {viewInfo: viewInfo};
                    this._processEvent("viewDisposing", args, args.viewInfo.model);
                    this._disposeView(viewInfo);
                    this._processEvent("viewDisposed", args, args.viewInfo.model)
                }
            },
            _onNavigationItemRemoved: function(item) {
                var viewInfo = this._viewCache.removeView(item.key);
                if (viewInfo)
                    this._onViewRemoved(viewInfo)
            },
            _onViewHidden: function(viewInfo) {
                var args = {viewInfo: viewInfo};
                this._processEvent("viewHidden", args, args.viewInfo.model)
            },
            _disposeView: function(viewInfo) {
                if (!viewInfo.model)
                    return;
                var commands = viewInfo.model.commands || [];
                $.each(commands, function(index, command) {
                    command._dispose()
                })
            },
            _acquireViewInfo: function(navigationItem) {
                var viewInfo = this._viewCache.getView(navigationItem.key);
                if (!viewInfo) {
                    viewInfo = this._createViewInfo(navigationItem);
                    this._viewCache.setView(navigationItem.key, viewInfo)
                }
                return viewInfo
            },
            _processEvent: function(eventName, args, model) {
                this._callComponentMethod(eventName, args);
                if (this[eventName] && this[eventName].fire)
                    this[eventName].fire(args);
                var modelMethod = (model || {})[eventName];
                if (modelMethod)
                    modelMethod.call(model, args)
            },
            _createViewInfo: function(navigationItem) {
                var uri = navigationItem.uri,
                    routeData = this.router.parse(uri);
                var viewInfo = {
                        viewName: routeData.view,
                        routeData: routeData,
                        uri: uri,
                        key: navigationItem.key,
                        canBack: this.canBack()
                    };
                return viewInfo
            },
            _createViewModel: function(viewInfo) {
                this._processEvent("beforeViewSetup", {viewInfo: viewInfo});
                viewInfo.model = viewInfo.model || this._callViewCodeBehind(viewInfo.routeData);
                this._processEvent("afterViewSetup", {viewInfo: viewInfo})
            },
            _createViewCommands: function(viewInfo) {
                viewInfo.commands = viewInfo.model.commands || [];
                if (viewInfo.canBack)
                    this._appendBackCommand(viewInfo)
            },
            _callViewCodeBehind: function(routeData) {
                var setupFunc = $.noop;
                if (routeData.view in this.namespace)
                    setupFunc = this.namespace[routeData.view];
                return setupFunc.call(this.namespace, routeData) || {}
            },
            _appendBackCommand: function(viewInfo) {
                var commands = viewInfo.commands;
                var toMergeTo = [new DX.framework.dxCommand({
                            id: "back",
                            title: BACK_COMMAND_TITLE,
                            behavior: "back",
                            action: "#_back",
                            icon: "arrowleft",
                            type: "back"
                        })];
                var result = DX.framework.utils.mergeCommands(toMergeTo, commands);
                commands.length = 0;
                commands.push.apply(commands, result)
            },
            _showView: function(viewInfo, direction) {
                var self = this;
                var eventArgs = {
                        viewInfo: viewInfo,
                        direction: direction
                    };
                self._processEvent("viewShowing", eventArgs, viewInfo.model);
                return self._showViewImpl(eventArgs.viewInfo, eventArgs.direction).done(function() {
                        self._processEvent("viewShown", eventArgs, viewInfo.model);
                        self._disposeRemovedViews()
                    })
            },
            _highlightCurrentNavigationCommand: function(viewInfo) {
                var self = this,
                    selectedCommand,
                    currentUri = viewInfo.uri,
                    currentNavigationItemId = viewInfo.model && viewInfo.model.currentNavigationItemId;
                if (currentNavigationItemId !== undefined)
                    $.each(this.navigation, function(index, command) {
                        if (command.option("id") === currentNavigationItemId) {
                            selectedCommand = command;
                            return false
                        }
                    });
                if (!selectedCommand)
                    $.each(this.navigation, function(index, command) {
                        var commandUri = command.option("action");
                        if (DX.utils.isString(commandUri)) {
                            commandUri = commandUri.replace(/^#+/, "");
                            if (commandUri === self.navigationManager.rootUri()) {
                                selectedCommand = command;
                                return false
                            }
                        }
                    });
                $.each(this.navigation, function(index, command) {
                    command.option("highlighted", command === selectedCommand)
                })
            },
            _initViewLoadingState: DX.abstract,
            _setCurrentViewAsyncImpl: DX.abstract,
            navigate: function(uri, options) {
                var self = this;
                if ($.isPlainObject(uri)) {
                    uri = self.router.format(uri);
                    if (uri === false)
                        throw new Error("The passed object cannot be formatted into a uri string by router. An appropriate route should be registered.");
                }
                if (!self._initState)
                    self.init().done(function() {
                        self.restoreState();
                        self.navigate(uri, options)
                    });
                else if (self._initState === INIT_COMPLETE)
                    self.navigationManager.navigate(uri, options);
                else
                    throw new Error("Unable to navigate. Application is being initialized. Consider using the 'HtmlApplication.navigating' event to alter the navigation logic.");
            },
            canBack: function() {
                return this.navigationManager.canBack()
            },
            back: function() {
                this.navigationManager.back()
            },
            saveState: function() {
                this.stateManager.saveState()
            },
            restoreState: function() {
                this.stateManager.restoreState()
            },
            clearState: function() {
                this.stateManager.clearState()
            }
        })
    })(jQuery, DevExpress);
    /*! Module framework, file framework.html.js */
    (function($, DX, undefined) {
        DX.framework.html = {layoutControllers: []}
    })(jQuery, DevExpress);
    /*! Module framework, file framework.widgetCommandAdapters.js */
    (function($, DX) {
        var commandToContainer = DX.framework.utils.commandToContainer;
        var adapters = DX.framework.html.commandToDXWidgetAdapters = {
                _updateItems: [],
                addCommandBase: function(widget, command, containerOptions, initialItemOptions, customizeItem) {
                    var itemOptions = $.extend(initialItemOptions, containerOptions, command.option());
                    var items = widget.option("items");
                    items.push(itemOptions);
                    var updateItem = function(name, newValue, oldValue) {
                            $.extend(itemOptions, command.option());
                            customizeItem(itemOptions, name, newValue, oldValue);
                            if (name !== "highlighted")
                                widget.option("items", items)
                        };
                    this._updateItems.push(updateItem);
                    updateItem();
                    command.optionChanged.add(updateItem);
                    widget.disposing.add(function() {
                        command.optionChanged.remove(updateItem)
                    })
                }
            };
        adapters.dxToolbar = {addCommand: function($container, command, containerOptions) {
                var toolbar = $container.data("dxToolbar"),
                    initialItemData = {command: command};
                toolbar.option("itemClickAction", function(e) {
                    if (e.itemData.command)
                        e.itemData.command.execute()
                });
                function customizeOption(itemOptions) {
                    var location = commandToContainer.resolvePropertyValue(command, containerOptions, "location");
                    itemOptions.location = location;
                    if (location === "menu")
                        itemOptions.text = commandToContainer.resolveTextValue(command, containerOptions);
                    else {
                        var options = {
                                text: commandToContainer.resolveTextValue(command, containerOptions),
                                disabled: command.option("disabled"),
                                icon: commandToContainer.resolveIconValue(command, containerOptions, "icon"),
                                iconSrc: commandToContainer.resolveIconValue(command, containerOptions, "iconSrc"),
                                type: commandToContainer.resolveTypeValue(command, containerOptions)
                            };
                        itemOptions.options = options;
                        initialItemData.widget = "button"
                    }
                }
                adapters.addCommandBase(toolbar, command, containerOptions, initialItemData, customizeOption);
                toolbar.option("visible", true)
            }};
        adapters.dxActionSheet = {addCommand: function($container, command, containerOptions) {
                var actionSheet = $container.data("dxActionSheet"),
                    initialItemData = {command: command};
                adapters.addCommandBase(actionSheet, command, containerOptions, initialItemData, function(itemOptions) {
                    itemOptions.text = commandToContainer.resolveTextValue(command, containerOptions);
                    itemOptions.icon = commandToContainer.resolveIconValue(command, containerOptions, "icon");
                    itemOptions.iconSrc = commandToContainer.resolveIconValue(command, containerOptions, "iconSrc")
                })
            }};
        adapters.dxList = {addCommand: function($container, command, containerOptions) {
                var list = $container.data("dxList");
                adapters.addCommandBase(list, command, containerOptions, {}, function(itemOptions) {
                    itemOptions.title = commandToContainer.resolveTextValue(command, containerOptions);
                    itemOptions.clickAction = function() {
                        if (!itemOptions.disabled)
                            command.execute()
                    };
                    itemOptions.icon = commandToContainer.resolveIconValue(command, containerOptions, "icon");
                    itemOptions.iconSrc = commandToContainer.resolveIconValue(command, containerOptions, "iconSrc")
                })
            }};
        adapters.dxNavBar = {addCommand: function($container, command, containerOptions) {
                var navbar = $container.data("dxNavBar");
                var initialItemData = {command: command};
                navbar.option("itemClickAction", function(e) {
                    var items = navbar.option("items");
                    for (var i = items.length; --i; )
                        items[i].command.option("highlighted", false);
                    e.itemData.command.execute()
                });
                var updateSelectedIndex = function() {
                        var items = navbar.option("items");
                        for (var i = 0, itemsCount = items.length; i < itemsCount; i++)
                            if (items[i].highlighted) {
                                navbar.option("selectedIndex", i);
                                break
                            }
                    };
                adapters.addCommandBase(navbar, command, containerOptions, initialItemData, function(itemOptions, name, newValue, oldValue) {
                    if (name === "highlighted") {
                        if (newValue)
                            updateSelectedIndex()
                    }
                    else {
                        itemOptions.text = commandToContainer.resolveTextValue(command, containerOptions);
                        itemOptions.icon = commandToContainer.resolveIconValue(command, containerOptions, "icon");
                        itemOptions.iconSrc = commandToContainer.resolveIconValue(command, containerOptions, "iconSrc");
                        updateSelectedIndex()
                    }
                })
            }};
        adapters.dxPivot = {addCommand: function($container, command, containerOptions) {
                var pivot = $container.data("dxPivot");
                var initialItemData = {command: command};
                pivot.option("itemSelectAction", function(e) {
                    e.itemData.command.execute()
                });
                var updateSelectedIndex = function() {
                        var items = pivot.option("items") || [];
                        for (var i = 0, itemsCount = items.length; i < itemsCount; i++)
                            if (items[i].highlighted) {
                                pivot.option("selectedIndex", i);
                                break
                            }
                    };
                adapters.addCommandBase(pivot, command, containerOptions, initialItemData, function(itemOptions, name, newValue, oldValue) {
                    if (name === "highlighted") {
                        if (newValue)
                            updateSelectedIndex()
                    }
                    else {
                        itemOptions.title = commandToContainer.resolveTextValue(command, containerOptions);
                        updateSelectedIndex()
                    }
                })
            }};
        adapters.dxSlideOut = {addCommand: function($container, command, containerOptions) {
                var slideOut = $container.data("dxSlideOut");
                var initialItemData = {command: command};
                slideOut.option("itemClickAction", function(e) {
                    e.itemData.command.execute()
                });
                var updateSelectedIndex = function() {
                        var items = slideOut.option("items") || [];
                        for (var i = 0, itemsCount = items.length; i < itemsCount; i++)
                            if (items[i].highlighted) {
                                slideOut.option("selectedIndex", i);
                                break
                            }
                    };
                adapters.addCommandBase(slideOut, command, containerOptions, initialItemData, function(itemOptions, name, newValue, oldValue) {
                    if (name === "highlighted") {
                        if (newValue)
                            updateSelectedIndex()
                    }
                    else {
                        itemOptions.title = commandToContainer.resolveTextValue(command, containerOptions);
                        itemOptions.icon = commandToContainer.resolveIconValue(command, containerOptions, "icon");
                        itemOptions.iconSrc = commandToContainer.resolveIconValue(command, containerOptions, "iconSrc");
                        updateSelectedIndex()
                    }
                })
            }}
    })(jQuery, DevExpress);
    /*! Module framework, file framework.commandManager.js */
    (function($, DX, undefined) {
        var Class = DX.Class,
            ui = DevExpress.ui;
        DX.framework.dxCommandContainer = ui.Component.inherit({
            ctor: function(element, options) {
                if ($.isPlainObject(element)) {
                    options = element;
                    element = $("<div />")
                }
                this.callBase(element, options)
            },
            _render: function() {
                this.callBase();
                this._element().addClass("dx-command-container")
            }
        });
        ui.registerComponent("dxCommandContainer", DX.framework.dxCommandContainer);
        DX.framework.html.CommandManager = Class.inherit({
            ctor: function(options) {
                options = options || {};
                this.globalCommands = options.globalCommands || [];
                this.commandsToWidgetRegistry = [this._commandsToDXWidget];
                this.commandMapping = options.commandMapping || new DX.framework.CommandMapping
            },
            _commandsToDXWidget: function($container, commandInfos) {
                var componentNames = $container.data("dxComponents");
                var adapters = DX.framework.html.commandToDXWidgetAdapters;
                if (componentNames)
                    for (var index in componentNames) {
                        var widgetName = componentNames[index];
                        if (widgetName in adapters) {
                            var widget = $container.data(widgetName);
                            widget.beginUpdate();
                            $.each(commandInfos, function(index, commandInfo) {
                                adapters[widgetName].addCommand($container, commandInfo.command, commandInfo.options)
                            });
                            widget.endUpdate();
                            return true
                        }
                    }
                return false
            },
            _findCommands: function($view) {
                var result = $.map($view.addBack().find(".dx-command"), function(element) {
                        return $(element).dxCommand("instance")
                    });
                return result
            },
            _findCommandContainers: function($markup) {
                var result = $.map($markup.find(".dx-command-container"), function(element) {
                        return $(element).dxCommandContainer("instance")
                    });
                return result
            },
            _checkCommandId: function(id, command) {
                if (id === null)
                    throw new Error("The command's 'id' option should be specified.\r\nProcessed markup: " + command._element().get(0).outerHTML);
            },
            _arrangeCommandsToContainers: function(commands, containers) {
                var self = this,
                    commandHash = {},
                    commandIds = [];
                $.each(commands, function(i, command) {
                    var id = command.option("id");
                    self._checkCommandId(id, command);
                    commandIds.push(id);
                    commandHash[id] = command
                });
                self.commandMapping.checkCommandsExist(commandIds);
                $.each(containers, function(k, container) {
                    var commandInfos = [];
                    $.each(commandHash, function(id, command) {
                        var commandId = id;
                        var commandOptions = self.commandMapping.getCommandMappingForContainer(commandId, container.option("id"));
                        if (commandOptions)
                            commandInfos.push({
                                command: command,
                                options: commandOptions
                            })
                    });
                    self._attachCommandsToContainer(container._element(), commandInfos)
                })
            },
            _attachCommandsToContainer: function($container, commandInfos) {
                var handled = false;
                $.each(this.commandsToWidgetRegistry, function(index, commandsToWidget) {
                    handled = commandsToWidget($container, commandInfos);
                    return !handled
                });
                if (!handled)
                    this._defaultCommandsToContainer($container, commandInfos)
            },
            _defaultCommandsToContainer: function($container, commandInfos) {
                $.each(commandInfos, function(index, commandInfo) {
                    var command = commandInfo.command,
                        $source = command._element();
                    if ($source) {
                        $container.append($source);
                        $source.on("dxclick", function() {
                            command.execute()
                        })
                    }
                })
            },
            _collectCommands: function($markup, extraCommands) {
                var markupCommands = this._findCommands($markup);
                var viewRelatedCommands = DX.framework.utils.mergeCommands(extraCommands, markupCommands);
                var allCommands = DX.framework.utils.mergeCommands(this.globalCommands, viewRelatedCommands);
                return allCommands
            },
            layoutCommands: function($markup, extraCommands) {
                extraCommands = extraCommands || [];
                var allCommands = this._collectCommands($markup, extraCommands);
                var commandContainers = this._findCommandContainers($markup);
                this._arrangeCommandsToContainers(allCommands, commandContainers)
            }
        })
    })(jQuery, DevExpress);
    /*! Module framework, file framework.layoutController.js */
    (function($, DX, undefined) {
        var Class = DX.Class;
        var HIDDEN_BAG_ID = "__hidden-bag";
        var TRANSITION_SELECTOR = ".dx-transition:not(.dx-transition .dx-transition)";
        var transitionSelector = function(transitionName) {
                return ".dx-transition-" + transitionName
            };
        DX.framework.html.DefaultLayoutController = Class.inherit({
            ctor: function(options) {
                options = options || {};
                this._layoutTemplateName = options.layoutTemplateName || "";
                this._disableViewLoadingState = options.disableViewLoadingState;
                this._layoutModel = options.layoutModel || {}
            },
            init: function(options) {
                options = options || {};
                this._$viewPort = options.$viewPort || $("body");
                this._$hiddenBag = options.$hiddenBag || $(document.getElementById(HIDDEN_BAG_ID)) || $("<div/>").hide().appendTo("body");
                this.viewReleased = $.Callbacks();
                this.viewRendered = $.Callbacks();
                this._commandManager = options.commandManager || new DX.framework.html.CommandManager({commandMapping: options.commandMapping});
                this._viewEngine = options.viewEngine;
                this._prepareTemplates(options.navigation || [])
            },
            activate: function() {
                this._justActivated = true;
                this._visibleViews = {};
                this._moveToViewPort(this._getRootElement());
                this._getRootElement().show()
            },
            deactivate: function() {
                var self = this;
                $.each(this._visibleViews, function(index, viewInfo) {
                    self._hideView(viewInfo);
                    self._releaseView(viewInfo)
                });
                this._moveToHiddenBag(this._getRootElement())
            },
            _getPreviousViewInfo: function(viewInfo) {
                return this._visibleViews[this._getTargetFrame(viewInfo)]
            },
            _prepareTemplates: function(navigationCommands) {
                var self = this;
                var $layoutTemplate = self._viewEngine.findLayoutTemplate(this._getLayoutTemplateName()).removeClass("dx-hidden");
                self._$layoutTemplate = $layoutTemplate;
                self._$mainLayout = self._createEmptyLayout().show();
                self._createNavigation(navigationCommands);
                self._blankViewInfo = self._createBlankViewInfo($layoutTemplate)
            },
            _createNavigation: function(navigationCommands) {
                this._viewEngine._applyTemplate(this._$mainLayout, this._layoutModel);
                this._renderCommands(this._$mainLayout, navigationCommands)
            },
            _getRootElement: function() {
                return this._$mainLayout
            },
            _getViewFrame: function(viewInfo) {
                return this._$mainLayout
            },
            _getLayoutTemplateName: function() {
                return this._layoutTemplateName
            },
            _createBlankViewInfo: function($layoutTemplate) {
                var self = this;
                var $blankView = $layoutTemplate.clone().addClass("blank-view").appendTo(self._$hiddenBag);
                self._viewEngine._createComponents($blankView);
                var model = {title: ko.observable()};
                this._getTransitionElements($blankView).each(function(i, item) {
                    self._viewEngine._applyTemplate($(item), model)
                });
                var result = {
                        model: model,
                        renderResult: {
                            $markup: $blankView,
                            $viewItems: $()
                        },
                        isBlankView: true
                    };
                self._appendViewToLayout(result);
                return result
            },
            _createViewLayoutTemplate: function() {
                var self = this;
                var $viewLayoutTemplate = self._$layoutTemplate.clone().appendTo(self._$hiddenBag);
                self._viewEngine._createComponents($viewLayoutTemplate);
                return $viewLayoutTemplate
            },
            _createEmptyLayout: function() {
                var self = this;
                var $result = self._$layoutTemplate.clone().appendTo(self._$hiddenBag);
                self._viewEngine._createComponents($result);
                self._removeTransitionContent($result);
                return $result
            },
            _removeTransitionContent: function($markup) {
                var $transitionElements = this._getTransitionElements($markup);
                $transitionElements.children().remove()
            },
            _getTransitionElements: function($markup) {
                return $markup.find(TRANSITION_SELECTOR).addBack(TRANSITION_SELECTOR)
            },
            setViewLoadingState: function(viewInfo, direction) {
                var self = this;
                if (self._disableViewLoadingState)
                    return $.Deferred().resolve().promise();
                var blankViewInfo = $.extend({}, viewInfo, self._blankViewInfo);
                self._blankViewInfo.model.title((viewInfo.viewTemplateInfo || {}).title || "Loading...");
                return self._showViewImpl(blankViewInfo, direction)
            },
            showView: function(viewInfo, direction) {
                var self = this;
                var previousViewInfo = self._getPreviousViewInfo(viewInfo);
                if (previousViewInfo && previousViewInfo.isBlankView)
                    direction = "none";
                self._ensureViewRendered(viewInfo);
                return this._showViewImpl(viewInfo, direction).done(function() {
                        self._onViewShown(viewInfo)
                    })
            },
            disposeView: function(viewInfo) {
                if (viewInfo.renderResult) {
                    viewInfo.renderResult.$markup.remove();
                    viewInfo.renderResult.$viewItems.remove();
                    delete viewInfo.renderResult
                }
            },
            _prepareViewTemplate: function($viewTemplate, viewInfo) {
                this._viewEngine._createComponents($viewTemplate)
            },
            _renderView: function($viewTemplate, viewInfo) {
                var self = this;
                var $layout = this._createViewLayoutTemplate();
                var $viewItems = $viewTemplate.children();
                this._getTransitionElements($layout).each(function(i, item) {
                    self._viewEngine._applyTemplate($(item), viewInfo.model)
                });
                this._viewEngine._applyLayoutCore($viewTemplate, $layout);
                var isSimplifiedMarkup = true,
                    outOfContentItems = $();
                $viewItems.each(function(i, item) {
                    var $item = $(item);
                    self._viewEngine._applyTemplate($item, viewInfo.model);
                    if ($item.is(".dx-command,.dx-content,script"))
                        isSimplifiedMarkup = false;
                    else
                        outOfContentItems = outOfContentItems.add($item)
                });
                if (outOfContentItems.length && !isSimplifiedMarkup)
                    throw new Error("All the dxView element children should be either of the dxCommand or dxContent type.\r\nProcessed markup: " + outOfContentItems[0].outerHTML);
                viewInfo.renderResult = {
                    $markup: $layout,
                    $viewItems: $viewItems
                }
            },
            _renderCommands: function($markup, commands) {
                var commandContainers = this._findCommandContainers($markup);
                this._commandManager._arrangeCommandsToContainers(commands, commandContainers)
            },
            _applyViewCommands: function(viewInfo) {
                var $viewItems = viewInfo.renderResult.$viewItems,
                    $markup = viewInfo.renderResult.$markup,
                    viewCommands = this._commandManager._findCommands($viewItems);
                viewInfo.commands = DX.framework.utils.mergeCommands(viewInfo.commands || [], viewCommands);
                this._renderCommands($markup, viewInfo.commands)
            },
            _findCommandContainers: function($markup) {
                return this._viewEngine._createComponents($markup, ["dxCommandContainer"])
            },
            _ensureViewRendered: function(viewInfo) {
                var self = this;
                if (!viewInfo.renderResult) {
                    var $viewTemplate = viewInfo.$viewTemplate || this._viewEngine.findViewTemplate(viewInfo.viewName);
                    this._prepareViewTemplate($viewTemplate, viewInfo);
                    this._renderView($viewTemplate, viewInfo);
                    this._applyViewCommands(viewInfo);
                    self._appendViewToLayout(viewInfo);
                    self._onRenderComplete(viewInfo);
                    self.viewRendered.fire(viewInfo)
                }
            },
            _appendViewToLayout: function(viewInfo) {
                var self = this,
                    $viewFrame = self._getViewFrame(viewInfo),
                    $markup = viewInfo.renderResult.$markup,
                    $transitionContentElements = $();
                $.each($markup.find(".dx-content-placeholder"), function(index, el) {
                    var placeholder = $(el).dxContentPlaceholder("instance");
                    placeholder.prepareTransition()
                });
                $.each(self._getTransitionElements($viewFrame), function(index, transitionElement) {
                    var $transition = $(transitionElement),
                        $viewElement = $markup.find(transitionSelector($transition.data("dx-transition-name"))).children();
                    self._hideViewElements($viewElement);
                    $transition.append($viewElement);
                    $transitionContentElements = $transitionContentElements.add($viewElement)
                });
                self._$mainLayout.append(viewInfo.renderResult.$viewItems.filter(".dx-command"));
                $markup.remove();
                viewInfo.renderResult.$markup = $transitionContentElements
            },
            _onRenderComplete: function(){},
            _onViewShown: function(viewInfo) {
                $(document).trigger("dx.viewchanged")
            },
            _doTransition: function(viewInfo, direction) {
                var self = this,
                    deferred = $.Deferred();
                var transitions = $.map(viewInfo.renderResult.$markup, function(transitionContent) {
                        var $transitionContent = $(transitionContent),
                            $transition = $transitionContent.parent(),
                            transitionType = self._disableTransitions ? "none" : $transition.data("dx-transition-type");
                        return {
                                destination: $transition,
                                source: $transitionContent,
                                type: transitionType || "none",
                                direction: direction || "none"
                            }
                    });
                self._executeTransitions(transitions).done(function() {
                    deferred.resolve()
                });
                return deferred.promise()
            },
            _hideView: function(viewInfo) {
                if (viewInfo.renderResult)
                    this._hideViewElements(viewInfo.renderResult.$markup)
            },
            _showViewImpl: function(viewInfo, direction) {
                var self = this,
                    deferred = $.Deferred();
                if (this._justActivated) {
                    this._justActivated = false;
                    direction = "none"
                }
                return self._doTransition(viewInfo, direction).done(function() {
                        self._changeView(viewInfo)
                    })
            },
            _releaseView: function(viewInfo) {
                this.viewReleased.fireWith(this, [viewInfo])
            },
            _getViewPortElement: function() {
                return this._$viewPort
            },
            _getHiddenBagElement: function() {
                return this._$hiddenBag
            },
            _changeView: function(viewInfo) {
                var self = this;
                var previousViewInfo = self._getPreviousViewInfo(viewInfo);
                if (previousViewInfo && previousViewInfo !== viewInfo) {
                    self._hideView(previousViewInfo);
                    if (!previousViewInfo.isBlankView)
                        this._releaseView(previousViewInfo)
                }
                this._visibleViews[this._getTargetFrame(viewInfo)] = viewInfo
            },
            _getTargetFrame: function(viewInfo) {
                return "content"
            },
            _hideViewElements: function($elements) {
                this._patchIDs($elements);
                this._disableInputs($elements);
                $elements.removeClass("dx-active-view").addClass("dx-inactive-view")
            },
            _showViewElements: function($elements) {
                this._unpatchIDs($elements);
                this._enableInputs($elements);
                $elements.removeClass("dx-inactive-view").addClass("dx-active-view")
            },
            _executeTransitions: function(transitions) {
                var self = this;
                var animatedTransitions = $.map(transitions, function(transitionOptions) {
                        self._showViewElements(transitionOptions.source);
                        if (transitionOptions.source.children().length)
                            return DX.framework.html.TransitionExecutor.create(transitionOptions.destination, transitionOptions)
                    });
                var animatedDeferreds = $.map(animatedTransitions, function(transition) {
                        transition.options.source.addClass("dx-transition-source");
                        return transition.exec()
                    });
                var result = $.when.apply($, animatedDeferreds).done(function() {
                        $.each(animatedTransitions, function(index, transition) {
                            transition.finalize();
                            self._hideViewElements(transition.options.source.parent().find(".dx-active-view:not(.dx-transition-source)"));
                            transition.options.source.removeClass("dx-transition-source")
                        })
                    });
                return result
            },
            _patchIDs: function($markup) {
                this._processIDs($markup, function(id) {
                    var result = id;
                    if (id.indexOf(HIDDEN_BAG_ID) === -1)
                        result = HIDDEN_BAG_ID + "-" + id;
                    return result
                })
            },
            _unpatchIDs: function($markup) {
                this._processIDs($markup, function(id) {
                    var result = id;
                    if (id.indexOf(HIDDEN_BAG_ID) === 0)
                        result = id.substr(HIDDEN_BAG_ID.length + 1);
                    return result
                })
            },
            _processIDs: function($markup, process) {
                var elementsWithIds = $markup.find("[id]");
                $.each(elementsWithIds, function(index, element) {
                    var $el = $(element),
                        id = $el.attr("id");
                    $el.attr("id", process(id))
                })
            },
            _enableInputs: function($markup) {
                var $inputs = $markup.find(":input[data-dx-disabled=true]");
                $.each($inputs, function(index, input) {
                    $(input).removeAttr("disabled").removeAttr("data-dx-disabled")
                })
            },
            _disableInputs: function($markup) {
                var $inputs = $markup.find(":input:not([disabled], [disabled=true])");
                $.each($inputs, function(index, input) {
                    $(input).attr({
                        disabled: true,
                        "data-dx-disabled": true
                    })
                })
            },
            _moveToViewPort: function($items) {
                $items.appendTo(this._getViewPortElement())
            },
            _moveToHiddenBag: function($items) {
                $items.appendTo(this._getHiddenBagElement())
            }
        });
        DX.framework.html.layoutControllers.push({controller: new DX.framework.html.DefaultLayoutController})
    })(jQuery, DevExpress);
    /*! Module framework, file framework.templateEngine.js */
    (function($, DX, undefined) {
        var Class = DX.Class;
        DX.framework.html.KnockoutJSTemplateEngine = Class.inherit({applyTemplate: function(template, model) {
                ko.applyBindings(model, $(template).get(0))
            }})
    })(jQuery, DevExpress);
    /*! Module framework, file framework.viewEngine.js */
    (function($, DX, undefined) {
        var Class = DX.Class,
            ui = DX.ui,
            _VIEW_ROLE = "dxView",
            _LAYOUT_ROLE = "dxLayout";
        DX.framework[_VIEW_ROLE] = ui.Component.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        name: null,
                        title: null,
                        layout: null
                    })
            },
            _render: function() {
                this.callBase();
                this._element().addClass("dx-view")
            }
        });
        ui.registerComponent(_VIEW_ROLE, DX.framework.dxView);
        DX.framework[_LAYOUT_ROLE] = ui.Component.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {name: null})
            },
            _render: function() {
                this.callBase();
                this._element().addClass("dx-layout")
            }
        });
        ui.registerComponent(_LAYOUT_ROLE, DX.framework.dxLayout);
        DX.framework.dxViewPlaceholder = ui.Component.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {viewName: null})
            },
            _render: function() {
                this.callBase();
                this._element().addClass("dx-view-placeholder")
            }
        });
        ui.registerComponent("dxViewPlaceholder", DX.framework.dxViewPlaceholder);
        var setupTransitionElement = function($element, transitionType, transitionName, contentCssPosition) {
                if (contentCssPosition === "absolute")
                    $element.addClass("dx-transition-absolute");
                else
                    $element.addClass("dx-transition-static");
                $element.addClass("dx-transition").addClass("dx-transition-" + transitionName);
                $element.data("dx-transition-type", transitionType);
                $element.data("dx-transition-name", transitionName)
            };
        var setupTransitionInnerElement = function($element) {
                $element.addClass("dx-transition-inner-wrapper")
            };
        DX.framework.dxTransition = ui.Component.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        name: null,
                        type: "slide"
                    })
            },
            _render: function() {
                this.callBase();
                var element = this._element();
                setupTransitionElement(element, this.option("type"), this.option("name"), "absolute");
                element.wrapInner("<div/>");
                setupTransitionInnerElement(element.children())
            },
            _clean: function() {
                this.callBase();
                this._element().empty()
            }
        });
        ui.registerComponent("dxTransition", DX.framework.dxTransition);
        DX.framework.dxContentPlaceholder = ui.Component.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        name: null,
                        transition: "none",
                        contentCssPosition: "absolute"
                    })
            },
            _render: function() {
                this.callBase();
                var $element = this._element();
                $element.addClass("dx-content-placeholder").addClass("dx-content-placeholder-" + this.option("name"));
                setupTransitionElement($element, this.option("transition"), this.option("name"), this.option("contentCssPosition"))
            },
            prepareTransition: function() {
                var $element = this._element();
                if ($element.children(".dx-content").length === 0) {
                    $element.wrapInner("<div>");
                    $element.children().dxContent({targetPlaceholder: this.option("name")})
                }
            }
        });
        ui.registerComponent("dxContentPlaceholder", DX.framework.dxContentPlaceholder);
        DX.framework.dxContent = ui.Component.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {targetPlaceholder: null})
            },
            _optionChanged: function(name) {
                this._refresh()
            },
            _clean: function() {
                this.callBase();
                this._element().removeClass(this._currentClass)
            },
            _render: function() {
                this.callBase();
                var element = this._element();
                element.addClass("dx-content");
                this._currentClass = "dx-content-" + this.option("targetPlaceholder");
                element.addClass(this._currentClass);
                setupTransitionInnerElement(element)
            }
        });
        ui.registerComponent("dxContent", DX.framework.dxContent);
        DX.framework.html.ViewEngine = Class.inherit({
            ctor: function(options) {
                options = options || {};
                this.$root = options.$root;
                this.device = options.device || {};
                this.templateEngine = options.templateEngine;
                this.dataOptionsAttributeName = options.dataOptionsAttributeName || "data-options";
                this._templateMap = {};
                this._pendingViewContainer = null;
                this.viewSelecting = $.Callbacks();
                this.modelFromViewDataExtended = $.Callbacks();
                this.layoutSelecting = $.Callbacks();
                this.layoutApplying = $.Callbacks();
                this.layoutApplied = $.Callbacks()
            },
            init: function() {
                var self = this;
                this._initDefaultLayout();
                return this._loadTemplates().done(function() {
                        self._enumerateTemplates(function(template) {
                            self._applyPartialViews(template._element())
                        })
                    })
            },
            _enumerateTemplates: function(processFn) {
                var self = this;
                $.each(self._templateMap, function(name, templatesByRoleMap) {
                    $.each(templatesByRoleMap, function(role, templates) {
                        $.each(templates, function(index, template) {
                            processFn(template)
                        })
                    })
                })
            },
            _findComponent: function(name, role) {
                return ((this._templateMap[name] || {})[role] || [])[0]
            },
            _findTemplate: function(name, role) {
                var self = this,
                    component = self._findComponent(name, role);
                if (!component)
                    throw new Error("Error 404: Template not found. role:  " + role + ", name: " + name);
                var $template = component._element(),
                    $result = $template.clone();
                this._createComponents($result, [role]);
                return $result
            },
            findViewTemplate: function(viewName) {
                var findViewEventArgs = {viewName: viewName};
                this.viewSelecting.fire(findViewEventArgs);
                return findViewEventArgs.view ? $(findViewEventArgs.view) : this._findTemplate(viewName, _VIEW_ROLE, true)
            },
            _extendModelFromViewData: function($view, model) {
                DX.utils.extendFromObject(model, $view.data(_VIEW_ROLE).option());
                this.modelFromViewDataExtended.fire({
                    view: $view,
                    model: model
                })
            },
            _createComponents: function($markup, types) {
                var self = this;
                var result = [];
                $markup.find("*").addBack().filter("[" + self.dataOptionsAttributeName + "]").each(function(index, element) {
                    var $element = $(element),
                        optionsString = $element.attr(self.dataOptionsAttributeName),
                        options;
                    try {
                        options = new Function("return {" + optionsString + "}")()
                    }
                    catch(ex) {
                        throw new Error(DX.utils.stringFormat("Unable to parse options.\nMessage: {0};\nOptions value: {1}", ex, optionsString));
                    }
                    for (var componentName in options)
                        if (!types || $.inArray(componentName, types) > -1)
                            if ($element[componentName]) {
                                $element[componentName](options[componentName]);
                                result.push($element[componentName]("instance"))
                            }
                });
                return result
            },
            _loadTemplatesFromMarkup: function($markup) {
                if ($markup.find("[data-dx-role]").length)
                    throw Error("View templates should be updated according to the 13.1 changes. Go to http://dxpr.es/15ikrJA for more details");
                var self = this;
                $markup.appendTo(this.$root);
                DX.localization.localizeNode($markup);
                var components = self._createComponents($markup, [_VIEW_ROLE, _LAYOUT_ROLE]);
                $.each(components, function(index, component) {
                    var $element = component._element();
                    $element.addClass("dx-hidden");
                    self._registerTemplateComponent(component);
                    component._element().detach()
                })
            },
            _registerTemplateComponent: function(component) {
                var self = this,
                    $element = component._element(),
                    role = component.NAME,
                    options = component.option(),
                    templateName = options.name,
                    componentsByRoleMap = self._templateMap[templateName] || {};
                componentsByRoleMap[role] = componentsByRoleMap[role] || [];
                componentsByRoleMap[role].push(component);
                self._templateMap[templateName] = componentsByRoleMap
            },
            getViewTemplateInfo: function(viewName) {
                return this._templateMap[viewName][_VIEW_ROLE][0].option()
            },
            _applyPartialViews: function($render) {
                var self = this;
                this._createComponents($render, ["dxViewPlaceholder"]);
                $.each($render.find(".dx-view-placeholder"), function() {
                    var $partialPlaceholder = $(this);
                    var viewName = $partialPlaceholder.data("dxViewPlaceholder").option("viewName");
                    var $view = self._findTemplate(viewName, _VIEW_ROLE);
                    self._applyPartialViews($view);
                    $partialPlaceholder.append($view);
                    $view.removeClass("dx-hidden")
                })
            },
            _ajaxImpl: function() {
                return $.ajax.apply($, arguments)
            },
            _loadTemplates: function() {
                var self = this;
                this._templateMap = {};
                this._loadTemplatesFromMarkup(this.$root.children());
                var tasks = [];
                var winPhonePrefix;
                if (location.protocol.indexOf("wmapp") >= 0)
                    winPhonePrefix = location.protocol + "www/";
                $("head").find("link[rel='dx-template']").each(function(index, link) {
                    var url = $(link).attr("href");
                    var task = self._ajaxImpl({
                            url: (winPhonePrefix || "") + url,
                            isLocal: winPhonePrefix ? true : undefined,
                            success: function(data) {
                                self._loadTemplatesFromMarkup(DX.utils.createMarkupFromString(data))
                            },
                            dataType: "html"
                        });
                    tasks.push(task)
                });
                return $.when.apply($, tasks).done(function() {
                        $.each(self._templateMap, function(name, templatesByRoleMap) {
                            $.each(templatesByRoleMap, function(role, templates) {
                                self._filterTemplatesByDevice(templates)
                            })
                        })
                    })
            },
            _filterTemplatesByDevice: function(components) {
                var bestMatches = DX.utils.findBestMatches(this.device, components, function(component) {
                        return component.option()
                    });
                this._checkMatchedTemplates(bestMatches);
                var match = bestMatches[0];
                $.each(components, function(index, component) {
                    if (component != match) {
                        component._dispose();
                        component._element().remove()
                    }
                });
                components.length = 0;
                if (match)
                    components.push(match)
            },
            _checkMatchedTemplates: function(bestMatches) {
                if (bestMatches.length > 1) {
                    var message = "Concurrent templates are found:\r\n";
                    $.each(bestMatches, function(index, match) {
                        message += match._element().attr("data-options") + "\r\n"
                    });
                    message += "Target device:\r\n";
                    message += JSON.stringify(this.device);
                    throw Error(message);
                }
            },
            _extendModelFormViewTemplate: function($viewTemplate, model) {
                this._extendModelFromViewData($viewTemplate, model)
            },
            _ensureTemplates: function(viewInfo) {
                this._ensureViewTemplate(viewInfo)
            },
            _ensureViewTemplate: function(viewInfo) {
                viewInfo.$viewTemplate = viewInfo.$viewTemplate || this.findViewTemplate(viewInfo.viewName);
                return viewInfo.$viewTemplate
            },
            _wrapViewDefaultContent: function($viewTemplate) {
                $viewTemplate.wrapInner("<div class=\"dx-full-height\"></div>");
                $viewTemplate.children().eq(0).dxContent({targetPlaceholder: 'content'})
            },
            _initDefaultLayout: function() {
                this._$defaultLayoutTemplate = $("<div class=\"dx-full-height\" data-options=\"dxLayout : { name: 'default' } \"> \
                <div class=\"dx-full-height\" data-options=\"dxContentPlaceholder : { name: 'content' } \" ></div> \
            </div>")
            },
            _getDefaultLayoutTemplate: function() {
                var $result = this._$defaultLayoutTemplate.clone();
                this._createComponents($result);
                return $result
            },
            findLayoutTemplate: function(layoutName) {
                if (!layoutName)
                    return this._getDefaultLayoutTemplate();
                var findLayoutEventArgs = {layoutName: layoutName};
                this.layoutSelecting.fire(findLayoutEventArgs);
                return findLayoutEventArgs.layout ? $(findLayoutEventArgs.layout) : this._findTemplate(layoutName, _LAYOUT_ROLE)
            },
            _applyTemplate: function($markup, model) {
                var self = this;
                $markup.each(function(i, element) {
                    self.templateEngine.applyTemplate(element, model)
                })
            },
            _applyLayoutCore: function($view, $layout) {
                if ($layout === undefined || $layout.length === 0)
                    $layout = this._getDefaultLayoutTemplate();
                if ($view.children(".dx-content").length === 0)
                    this._wrapViewDefaultContent($view);
                var $toMerge = $().add($layout).add($view);
                var $placeholderContents = $toMerge.find(".dx-content");
                $.each($placeholderContents, function() {
                    var $placeholderContent = $(this);
                    var placeholderId = $placeholderContent.data("dxContent").option("targetPlaceholder");
                    var $placeholder = $toMerge.find(".dx-content-placeholder-" + placeholderId);
                    $placeholder.empty();
                    $placeholder.append($placeholderContent)
                });
                $placeholderContents.filter(":not(.dx-content-placeholder .dx-content)").remove();
                return $layout
            }
        })
    })(jQuery, DevExpress);
    /*! Module framework, file framework.htmlApplication.js */
    (function($, DX, undefined) {
        var frameworkNS = DX.framework,
            htmlNS = frameworkNS.html;
        var VIEW_PORT_CLASSNAME = "dx-viewport";
        var HIDDEN_BAG_ID = "__hidden-bag";
        var HIDDEN_BAG_CLASSNAME = "dx-hidden-bag";
        htmlNS.HtmlApplication = frameworkNS.Application.inherit({
            ctor: function(options) {
                options = options || {};
                this.callBase(options);
                this._$root = $(options.rootNode || document.body);
                this._initViewPort(options.viewPort);
                this.device = options.device || DX.devices.current();
                this._navigationType = options.navigationType || options.defaultLayout;
                this._initHiddenBag();
                this.viewEngine = options.viewEngine || new htmlNS.ViewEngine({
                    $root: this._$root,
                    device: this.device,
                    templateEngine: options.templateEngine || new htmlNS.KnockoutJSTemplateEngine({navigationManager: this.navigationManager})
                });
                this.components.push(this.viewEngine);
                this.viewRendered = $.Callbacks();
                this._layoutControllers = options.layoutControllers || htmlNS.layoutControllers;
                this._availableLayoutControllers = [];
                this.resolveLayoutController = $.Callbacks()
            },
            _initViewPort: function(options) {
                this._$viewPort = this._getViewPort();
                options = options || {};
                if (DX.devices.current().platform === "desktop")
                    options = $.extend({disabled: true}, options);
                if (!options.disabled)
                    DX.ui.initViewport(options);
                DX.devices.attachCss(this._$viewPort);
                this._$viewPort.addClass(this._getColorSchemeClass())
            },
            _getViewPort: function() {
                var $viewPort = $("." + VIEW_PORT_CLASSNAME);
                if (!$viewPort.length)
                    $viewPort = $("<div>").addClass(VIEW_PORT_CLASSNAME).appendTo(this._$root);
                return $viewPort
            },
            _initHiddenBag: function() {
                this._$hiddenBag = this._getHiddenBag(this._$root, this._$viewPort)
            },
            _getHiddenBag: function($root, $viewPort) {
                var $hiddenBag = $("#" + HIDDEN_BAG_ID);
                if (!$hiddenBag.length)
                    $hiddenBag = $("<div/>").addClass(HIDDEN_BAG_CLASSNAME).attr("id", HIDDEN_BAG_ID).appendTo($root);
                $hiddenBag.addClass(($viewPort.attr("class") || "").replace(VIEW_PORT_CLASSNAME, ""));
                return $hiddenBag
            },
            _showViewImpl: function(viewInfo, direction) {
                this._activateLayoutController(viewInfo.layoutController);
                return this._activeLayoutController.showView(viewInfo, direction)
            },
            _setViewLoadingState: function(viewInfo, direction) {
                this._activateLayoutController(viewInfo.layoutController);
                return this._activeLayoutController.setViewLoadingState(viewInfo, direction)
            },
            _resolveLayoutController: function(viewInfo) {
                var args = {
                        viewInfo: viewInfo,
                        layoutController: null,
                        availableLayoutControllers: this._availableLayoutControllers
                    };
                this._processEvent("resolveLayoutController", args, viewInfo.model);
                return args.layoutController || this._resolveLayoutControllerImpl(viewInfo)
            },
            _resolveLayoutControllerImpl: function(viewInfo) {
                var viewTemplateInfo = viewInfo.viewTemplateInfo || {},
                    target = $.extend({
                        root: !viewInfo.canBack,
                        navigationType: viewTemplateInfo.navigationType || viewTemplateInfo.layout || this._navigationType
                    }, DX.devices.current());
                var matches = DX.utils.findBestMatches(target, this._availableLayoutControllers);
                if (!matches.length)
                    throw Error("The layout controller cannot be resolved. There are no appropriate layout controllers for the current context. Make sure you have the corresponding *.js references in your main *.html file.");
                if (matches.length > 1)
                    throw Error("The layout controller cannot be resolved. Two or more layout controllers suit the current context. Make the layout controllers registration more specific.");
                if (matches[0].navigationType !== target.navigationType)
                    throw Error("The layout controller cannot be resolved. There are no appropriate layout controllers for the specified navigation type: '" + target.navigationType + "'. Make sure you have the corresponding *.js references in your main *.html file.");
                return matches[0].controller
            },
            _activateLayoutController: function(layoutController) {
                var self = this;
                if (self._activeLayoutController !== layoutController) {
                    if (self._activeLayoutController)
                        self._activeLayoutController.deactivate();
                    layoutController.activate();
                    self._activeLayoutController = layoutController
                }
            },
            init: function() {
                var self = this,
                    result = this.callBase();
                result.done(function() {
                    self._initLayoutControllers()
                });
                return result
            },
            _disposeView: function(viewInfo) {
                if (viewInfo.layoutController.disposeView)
                    viewInfo.layoutController.disposeView(viewInfo);
                this.callBase(viewInfo)
            },
            viewPort: function() {
                return this._$viewPort
            },
            _getThemeClasses: function(device) {
                var platformToThemeMap = {
                        ios: "dx-theme-ios dx-theme-ios-typography",
                        android: "dx-theme-android dx-theme-android-typography",
                        desktop: "dx-theme-desktop dx-theme-desktop-typography",
                        win8: "dx-theme-win8 dx-theme-win8-typography",
                        win8phone: "dx-theme-win8 dx-theme-win8-typography",
                        tizen: "dx-theme-tizen dx-theme-tizen-typography",
                        generic: "dx-theme-generic dx-theme-generic-typography"
                    };
                return platformToThemeMap[device.platform]
            },
            _createViewInfo: function(navigationItem) {
                var viewInfo = this.callBase(navigationItem);
                viewInfo.viewTemplateInfo = this.viewEngine.getViewTemplateInfo(viewInfo.viewName) || {};
                viewInfo.layoutController = this._resolveLayoutController(viewInfo);
                return viewInfo
            },
            _createViewModel: function(viewInfo) {
                this.callBase(viewInfo);
                var templateInfo = viewInfo.viewTemplateInfo,
                    model = viewInfo.model;
                for (var name in templateInfo)
                    if (!(name in model))
                        model[name] = templateInfo[name]
            },
            _checklayoutControllersRegistration: function(controllers) {
                var result = [];
                $.each(controllers, function(oldControllerName, controllerInfo) {
                    if (!controllerInfo.controller)
                        result.push(oldControllerName)
                });
                if (result.length !== 0)
                    throw new Error("A deprecated way is used for the registration of the following layout controllers: '" + result.join("' ,'") + "'.\r\nFor details, read the http://dxpr.es/1bTjfj1");
            },
            _initLayoutControllers: function() {
                var self = this;
                self._checklayoutControllersRegistration(self._layoutControllers);
                $.each(self._layoutControllers, function(index, controllerInfo) {
                    var controller = controllerInfo.controller,
                        target = $.extend({navigationType: this._navigationType}, DX.devices.current());
                    if (DX.utils.findBestMatches(target, [controllerInfo]).length) {
                        self._availableLayoutControllers.push(controllerInfo);
                        if (controller.init)
                            controller.init({
                                app: self,
                                $viewPort: self._$viewPort,
                                $hiddenBag: self._$hiddenBag,
                                navigationManager: self.navigationManager,
                                commandMapping: self.commandMapping,
                                viewEngine: self.viewEngine,
                                navigation: self.navigation
                            });
                        if (controller.viewReleased)
                            controller.viewReleased.add(function(viewInfo) {
                                self._onViewReleased(viewInfo)
                            });
                        if (controller.viewRendered)
                            controller.viewRendered.add(function(viewInfo) {
                                self._processEvent("viewRendered", viewInfo, viewInfo.model)
                            })
                    }
                })
            },
            _onViewReleased: function(viewInfo) {
                this._onViewHidden(viewInfo);
                if (!this._viewCache.hasView(viewInfo.key))
                    this._onViewRemoved(viewInfo)
            },
            _getColorSchemeClass: function() {
                var $indicator = $("<div>").addClass("dx-color-scheme").appendTo(this._$viewPort),
                    markerThemeProperty = "font-family",
                    colorSchemeName = $indicator.css(markerThemeProperty).replace(/^['"]|['"]$/g, "");
                $indicator.remove();
                if (!colorSchemeName || colorSchemeName === "#") {
                    DX.utils.logger.info("Color scheme name is undefined");
                    return
                }
                return "dx-color-scheme-" + colorSchemeName
            }
        })
    })(jQuery, DevExpress);
    /*! Module framework, file framework.transitionExecutor.js */
    (function($, DX) {
        $.fn.extend({unwrapInner: function(selector) {
                return this.each(function() {
                        var t = this,
                            c = $(t).children(selector);
                        c.each(function() {
                            var e = $(this);
                            e.contents().appendTo(t);
                            e.remove()
                        })
                    })
            }});
        var TRANSITION_DURATION = 400;
        var TransitionExecutor = DX.Class.inherit({
                ctor: function(container, options) {
                    this.container = container;
                    this.options = options
                },
                exec: function() {
                    var self = this,
                        options = self.options;
                    var $source = options.source,
                        $destination = options.destination;
                    var $sourceAbsoluteWrapper = $source,
                        $destinationRelativeWrapper = $destination,
                        $destinationAbsoluteWrapper = self._getTransitionInnerElement($destination);
                    this._finalize = function(){};
                    return self._animate($.extend({}, options, {
                            source: $sourceAbsoluteWrapper,
                            destination: $destinationAbsoluteWrapper
                        }))
                },
                finalize: function() {
                    if (!this._finalize)
                        throw Error("The \"exec\" method should be called before the \"finalize\" one");
                    this._finalize()
                },
                _getTransitionInnerElement: function($transitionElement) {
                    return $transitionElement.children(".dx-active-view:not(.dx-transition-source)")
                },
                _animate: function() {
                    return (new $.Deferred).resolve().promise()
                }
            });
        var NoneTransitionExecutor = TransitionExecutor.inherit({_animate: function(options) {
                    var $source = options.source,
                        $destination = options.destination;
                    var containerWidth = this.container.width();
                    DX.fx.animate($source, {
                        type: "slide",
                        from: {left: 0},
                        to: {left: 0},
                        duration: 0
                    });
                    DX.fx.animate($destination, {
                        type: "slide",
                        from: {left: -containerWidth},
                        to: {left: -containerWidth},
                        duration: 0
                    });
                    return $.Deferred().resolve().promise()
                }});
        var SlideTransitionExecutor = TransitionExecutor.inherit({_animate: function(options) {
                    if (options.direction === "none")
                        return $.Deferred().resolve().promise();
                    var $source = options.source,
                        $destination = options.destination;
                    var containerWidth = this.container.width(),
                        destinationLeft = $destination.position().left;
                    if (options.direction === "backward")
                        containerWidth = -containerWidth;
                    var promiseSource = DX.fx.animate($source, {
                            type: "slide",
                            from: {left: containerWidth},
                            to: {left: 0},
                            duration: TRANSITION_DURATION
                        });
                    var promiseDestination = DX.fx.animate($destination, {
                            type: "slide",
                            from: {left: 0},
                            to: {left: -containerWidth},
                            duration: TRANSITION_DURATION
                        });
                    return $.when(promiseDestination, promiseSource)
                }});
        var SlideIOS7TransitionExecutor = TransitionExecutor.inherit({_animate: function(options) {
                    if (options.direction === "none")
                        return $.Deferred().resolve().promise();
                    var $source = options.source,
                        $destination = options.destination;
                    var containerWidth = this.container.width(),
                        slowTransitionWidth = containerWidth / 5,
                        sourceLeftFrom,
                        sourceLeftTo,
                        destinationLeftFrom,
                        destinationLeftTo,
                        destinationLeft = $destination.position().left,
                        sourceZIndex = $source.css("z-index"),
                        destinationZIndex = $destination.css("z-index");
                    if (options.direction === "backward") {
                        sourceLeftFrom = -slowTransitionWidth;
                        sourceLeftTo = 0;
                        destinationLeftFrom = 0;
                        destinationLeftTo = containerWidth;
                        $source.css("z-index", 1);
                        $destination.css("z-index", 2)
                    }
                    else {
                        sourceLeftFrom = containerWidth;
                        sourceLeftTo = 0;
                        destinationLeftFrom = 0;
                        destinationLeftTo = -slowTransitionWidth;
                        $source.css("z-index", 2);
                        $destination.css("z-index", 1)
                    }
                    var promiseSource = DX.fx.animate($source, {
                            type: "slide",
                            from: {left: sourceLeftFrom},
                            to: {left: sourceLeftTo},
                            duration: TRANSITION_DURATION
                        });
                    var promiseDestination = DX.fx.animate($destination, {
                            type: "slide",
                            from: {left: destinationLeftFrom},
                            to: {left: destinationLeftTo},
                            duration: TRANSITION_DURATION
                        });
                    return $.when(promiseDestination, promiseSource).done(function() {
                            $source.css("z-index", sourceZIndex);
                            $destination.css("z-index", destinationZIndex)
                        })
                }});
        var OverflowTransitionExecutor = TransitionExecutor.inherit({_animate: function(options) {
                    var $source = options.source,
                        $destination = options.destination,
                        destinationTop = $destination.position().top,
                        destinationLeft = $destination.position().left,
                        containerWidth = this.container.width();
                    if (options.direction === "backward")
                        containerWidth = -containerWidth;
                    var animations = [];
                    if (options.direction === "forward")
                        animations.push(DX.fx.animate($source, {
                            type: "slide",
                            from: {
                                top: destinationTop,
                                left: containerWidth + destinationLeft,
                                "z-index": 1
                            },
                            to: {left: destinationLeft},
                            duration: TRANSITION_DURATION
                        }));
                    else {
                        animations.push(DX.fx.animate($source, {
                            type: "slide",
                            from: {
                                left: destinationLeft,
                                "z-index": 1
                            },
                            to: {left: destinationLeft},
                            duration: TRANSITION_DURATION
                        }));
                        animations.push(DX.fx.animate($destination, {
                            type: "slide",
                            from: {"z-index": 2},
                            to: {left: destinationLeft - containerWidth},
                            duration: TRANSITION_DURATION
                        }))
                    }
                    return $.when.apply($, animations)
                }});
        var FadeTransitionExecutor = TransitionExecutor.inherit({_animate: function(options) {
                    var $source = options.source,
                        $destination = options.destination,
                        d = new $.Deferred;
                    $source.css({opacity: 0});
                    $destination.animate({opacity: 0}, TRANSITION_DURATION);
                    $source.animate({opacity: 1}, TRANSITION_DURATION, function() {
                        d.resolve()
                    });
                    return d.promise()
                }});
        TransitionExecutor.create = function(container, options) {
            var transitionType = options.direction === "none" ? "none" : options.type;
            var device = DX.devices.current();
            switch (transitionType) {
                case"none":
                    return new NoneTransitionExecutor(container, options);
                case"slide":
                    if (device.platform === "ios" && device.version[0] === 7)
                        return new SlideIOS7TransitionExecutor(container, options);
                    else
                        return new SlideTransitionExecutor(container, options);
                case"fade":
                    return new FadeTransitionExecutor(container, options);
                case"overflow":
                    return new OverflowTransitionExecutor(container, options);
                default:
                    throw Error(DX.utils.formatString("Unknown transition type \"{0}\"", options.type));
            }
        };
        DX.framework.html.TransitionExecutor = TransitionExecutor
    })(jQuery, DevExpress);
    DevExpress.MOD_FRAMEWORK = true
}