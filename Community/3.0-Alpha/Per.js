/* Per.js Community */
/* Version: 3.0 */
/* (c) 2018 Skyogo Studio */
/* Released under the Apache License Version 2.0 */

(function(window, document, undefined) {

    /**
     * Init variable: versions
     * versions is a const variable, It's value cannot be change.
     */
    var versions = 3.0;
    console.info("Hello future! It is Per.js " + versions + "!");
    console.info("Welcome running Per.js " + versions + " Community!\nVisit ours website: http://www.skyogo.com\nto download our other projects, or check the update for Per.js!");

    /**
     * Init all variables
     */
    var pluginArr = new Array(),
        usedPluginArr = ["Per", "Per.do", "Per.version", "Per.joinModule", "Per.use", "Per.getAllModuleName", "Per.getAllModuleVersion", "Per.isThisModuleUsed", "Per.getAllModuleNameAndVersion"],
        asyncDOMArr = new Array(),
        dataElArr = new Array(),
        forElArr = new Array(),
        isAsyncRun = false,
        isReactiveVal = false,
        isReactChangeRedoVal = false,
        allComponentArr = new Array(),
        componentJoinArr = new Array();

    /**
     * Init all functions
     */
    var getObjKeyAndVal = function(obj) {
        var arr = new Array();
        for (var i in obj) {
            arr.push(i, obj[i]);
        }
        return arr;
    }
    var dataReplace = function(html, data, isHTML) {
        var dataArr = getObjKeyAndVal(data);
        html = html.replace(/&lt;!--[\w\W\r\n]*?--&gt;/gmi, '');
        for (var a = 0; a < dataArr.length; a++) {
            if (a % 2 == 0) {
                var o = 0;
                while (html.indexOf("\{\{" + dataArr[a] + ".", o) != -1 || html.indexOf("\{\{" + dataArr[a] + "\}\}", o) != -1) {
                    var reg = new RegExp(dataArr[a]);
                    var splitOr = html.substr(html.indexOf("\{\{", o) + 2, html.indexOf("\}\}", o) - html.indexOf("\{\{", o) - 2);
                    if (typeof dataArr[a + 1] == "string" || typeof dataArr[a + 1] == "number") {
                        if (dataArr[a] == splitOr.substr(0, dataArr[a].length)) {
                            var val = splitOr.replace(reg, "\"" + dataArr[a + 1] + "\"");
                            var reg = new RegExp("``" + dataArr[a] + "``", "g");
                            val = val.replace(reg, "\"" + dataArr[a + 1] + "\"");
                        } else {
                            var val = "";
                        }
                    } else if (typeof dataArr[a + 1] == "object" && Array.isArray(dataArr[a + 1]) == false) {
                        if (dataArr[a] == splitOr.substr(0, dataArr[a].length)) {
                            var val = splitOr.replace(reg, JSON.stringify(dataArr[a + 1]));
                            var reg = new RegExp("``" + dataArr[a] + "``", "g");
                            val = val.replace(reg, "\"" + dataArr[a + 1] + "\"");
                        } else {
                            var val = "";
                        }
                    } else {
                        if (dataArr[a] == splitOr.substr(0, dataArr[a].length)) {
                            var val = splitOr.replace(reg, dataArr[a + 1]);
                            var reg = new RegExp("``" + dataArr[a] + "``", "g");
                            val = val.replace(reg, "\"" + dataArr[a + 1] + "\"");
                        } else {
                            var val = "";
                        }
                    }
                    if (val != "") {
                        var returnVal = new Function("return " + val)();
                        if (typeof returnVal == "object" && Array.isArray(returnVal) == false) {
                            returnVal = JSON.stringify(returnVal);
                        }
                        var splitOr2 = html.substr(html.indexOf("\{\{", o) + 2, html.indexOf("\}\}", o) - html.indexOf("\{\{", o) - 2);
                        splitOr2 = splitOr2.replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\./g, "\\.").replace(/\,/g, "\\,");
                        var reg = new RegExp("\{\{" + splitOr2 + "\}\}", "g");
                        html = html.replace(reg, returnVal);
                        o += returnVal.length;
                    } else {
                        o = html.indexOf("\}\}", o) + 2;
                    }
                }
                if (!isHTML) {
                    html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                }
            }
        }
        return html;
    }
    var polyfillBind = function(fn, ctx) {
        function boundFn(a) {
            ctx._super = this;
            var l = arguments.length;
            return l ?
                l > 1 ?
                fn.apply(ctx, arguments) :
                fn.call(ctx, a) :
                fn.call(ctx)
        }
        boundFn._length = fn.length;
        return boundFn;
    }
    var joinAsyncList = function(el, type, html) {
        joinAsyncHashArray(el, type, html);
        if (!isAsyncRun) {
            isAsyncRun = true;
            if (typeof Promise == "function") {
                new Promise(function(resolve, duration) {
                    resolve();
                }).then(function() {
                    for (var i = 0; i < asyncDOMArr.length; i++) {
                        if (asyncDOMArr[i + 1] == "html") {
                            asyncDOMArr[i].innerHTML = asyncDOMArr[i + 2];
                        } else {
                            asyncDOMArr[i].innerText = asyncDOMArr[i + 2];
                        }
                        i += 2;
                    }
                    isAsyncRun = false;
                });
            } else {
                setTimeout(function() {
                    for (var i = 0; i < asyncDOMArr.length; i++) {
                        if (asyncDOMArr[i + 1] == "html") {
                            asyncDOMArr[i].innerHTML = asyncDOMArr[i + 2];
                        } else {
                            asyncDOMArr[i].innerText = asyncDOMArr[i + 2];
                        }
                        i += 2;
                    }
                    isAsyncRun = false;
                }, 0);
            }
        }
    }
    var joinAsyncHashArray = function(el, type, html) {
        var isHasThisEl = false;
        for (var i = 0; i < asyncDOMArr.length; i++) {
            if (i % 3 == 0 && asyncDOMArr[i] == el) {
                asyncDOMArr[i + 1] = type;
                asyncDOMArr[i + 2] = html;
                isHasThisEl = true;
                break;
            }
        }
        if (!isHasThisEl) {
            asyncDOMArr.push(el, type, html);
        }
    }

    /**
     * Init Per's functions
     */
    var isThisModuleUsed = function(moduleName) {
        if (typeof moduleName == "string") {
            for (var i = 0; i < usedPluginArr.length; i++) {
                if (usedPluginArr[i] == moduleName) {
                    return true;
                }
            }
            return false;
        }
    }
    var getAllModuleNameAndVersion = function() {
        var allModuleArr = new Array();
        for (var i = 0; i < pluginArr.length; i++) {
            if (i % 3 == 0) {
                allModuleArr.push(pluginArr[i], pluginArr[i + 1]);
            }
        }
        return allModuleArr;
    }
    var joinModule = function(moduleName, moduleVersion, moduleFunction) {
        if (typeof moduleName == "string" && typeof moduleFunction == "function" && typeof moduleVersion == "number") {
            var allModule = getAllModuleNameAndVersion();
            for (var i = 0; i < allModule.length; i++) {
                if (moduleName == allModule[i]) {
                    console.error("Per.js: please do not rejoin the module!");
                    return;
                }
            }
            pluginArr.push(moduleName, moduleVersion, moduleFunction);
        }
    }
    var use = function(moduleName) {
        if (Array.isArray(moduleName)) {
            for (var a = 0; a < moduleName.length; a++) {
                if (isThisModuleUsed(moduleName[a])) {
                    console.error("Per.js: please do not reuse the module! at module " + moduleName[a]);
                } else {
                    for (var i = 0; i < pluginArr.length; i++) {
                        if (i % 3 == 0 && pluginArr[i] == moduleName[a]) {
                            pluginArr[i + 2]();
                            usedPluginArr[usedPluginArr.length] = pluginArr[i];
                            break;
                        }
                    }
                }
            }
        } else if (typeof moduleName == "string") {
            if (moduleName == "all") {
                moduleName = getAllModuleNameAndVersion();
                for (var a = 0; a < moduleName.length; a++) {
                    if (a % 2 == 0) {
                        if (isThisModuleUsed(moduleName[a])) {
                            console.error("Per.js: please do not reuse the module! at module " + moduleName[a]);
                        } else {
                            for (var i = 0; i < pluginArr.length; i++) {
                                if (i % 3 == 0 && pluginArr[i] == moduleName[a]) {
                                    pluginArr[i + 2]();
                                    usedPluginArr[usedPluginArr.length] = pluginArr[i];
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                if (!isThisModuleUsed(moduleName)) {
                    for (var i = 0; i < pluginArr.length; i++) {
                        if (i % 3 == 0 && pluginArr[i] == moduleName) {
                            pluginArr[i + 2]();
                            usedPluginArr[usedPluginArr.length] = moduleName;
                        }
                    }
                } else {
                    console.error("Per.js please do not reuse the module! at module " + moduleName);
                }
            }
        }
    }
    var config = function(settingName, value) {
        if (typeof value == "boolean") {
            switch (settingName) {
                case "reactive":
                    isReactiveVal = value;
                    break;
                case "reactChangeRedoFunction":
                    isReactChangeRedoVal = value;
                    break;
                default:
                    console.error("Per.js: unknow function config's parameter settingName.");
                    break;
            }
        } else {
            console.error("Per.js: type of function config's parameter value should be boolean!");
        }
    }
    var deepCopy = function(p, c) {
        var c = c || {};
        for (var i in p) {
            if (!p.hasOwnProperty(i)) {
                continue;
            }
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                deepCopy(p[i], c[i]);
            } else {
                c[i] = p[i];
            }
        }
        return c;
    }

    /**
     * Init function Per and propertys
     */
    window.Per = function(el) {
        return new window.Per.fn(el);
    }
    window.Per.fn = function(el) {
        this.el = el;
        this.version = versions;
        this.joinModule = joinModule;
        this.use = use;
        this.getAllModuleNameAndVersion = getAllModuleNameAndVersion;
        this.isThisModuleUsed = isThisModuleUsed;
        this.config = config;
        this.dom = function(Obj, isReactive, isReactChangeRedo) {
            if (isReactive == null || isReactive == undefined || isReactive == "") {
                isReactive = isReactiveVal;
                isReactChangeRedo = isReactChangeRedoVal;
            } else if (isReactive == false) {
                isReactive = false;
                isReactChangeRedo = false;
            } else {
                if (isReactChangeRedo == null || isReactChangeRedo == undefined || isReactChangeRedo == "") {
                    isReactChangeRedo = isReactChangeRedoVal;
                }
            }
            if (typeof Obj == "object" && typeof isReactive == "boolean") {
                Obj.el = this.el;
                if (typeof Obj.el == "string") {
                    if (typeof Obj.isAsyncDOM != "boolean") {
                        Obj.isAsyncDOM = false;
                    } else {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "isAsyncDOM", {
                                    set: function(newVal) {
                                        Obj.isAsyncDOM = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.isAsyncDOM;
                                    }
                                });
                            } else {
                                Object.defineProperty(this.dom, "isAsyncDOM", {
                                    set: function(newVal) {
                                        Obj.isAsyncDOM = newVal;
                                    },
                                    get: function() {
                                        return Obj.isAsyncDOM;
                                    }
                                });
                            }
                        }
                    }
                    var Element = document.querySelectorAll(Obj.el);
                    if (Obj.info != undefined) {
                        if (typeof Obj.info == "function") {
                            Obj.info = Obj.info();
                        }
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "info", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = newVal();
                                        }
                                        Obj.info = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.info;
                                    }
                                });
                            } else {
                                Object.defineProperty(this.dom, "info", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = newVal();
                                        }
                                        Obj.info = newVal;
                                    },
                                    get: function() {
                                        return Obj.info;
                                    }
                                });
                            }
                        }
                    } else {
                        Obj.info = {};
                    }
                    if (Obj.data != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "data", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        for (var i in newVal) {
                                            Obj.data[i] = newVal[i];
                                        }
                                        var dataElNodeList = document.querySelectorAll(Obj.el);
                                        for (var o = 0, len2 = dataElNodeList.length; o < len2; o++) {
                                            for (var i = 0, len = dataElArr.length; i < len; i++) {
                                                if (i % 2 == 0 && dataElArr[i] == dataElNodeList[o]) {
                                                    var html = dataElArr[i + 1];
                                                }
                                            }
                                            dataElNodeList[o].innerHTML = html;
                                        }
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.data;
                                    }
                                });
                            } else {
                                Object.defineProperty(this.dom, "data", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        for (var i in newVal) {
                                            Obj.data[i] = newVal[i];
                                        }
                                        var dataElNodeList = document.querySelectorAll(Obj.el);
                                        for (var o = 0, len2 = dataElNodeList.length; o < len2; o++) {
                                            for (var i = 0, len = dataElArr.length; i < len; i++) {
                                                if (i % 2 == 0 && dataElArr[i] == dataElNodeList[o]) {
                                                    var html = dataElArr[i + 1];
                                                    if (dataElNodeList[o].getAttribute("p-html") == null) {
                                                        var isHTML = false;
                                                    } else {
                                                        var isHTML = true;
                                                    }
                                                    html = dataReplace(html, Obj.data, isHTML);
                                                    if (Obj.isAsyncDOM) {
                                                        joinAsyncList(dataElNodeList[o], "html", html.toString());
                                                    } else {
                                                        dataElNodeList[o].innerHTML = html.toString();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.data;
                                    }
                                });
                            }
                        }
                        if (typeof Obj.data == "function") {
                            Obj.data = polyfillBind(Obj.data, Obj.info)();
                        }
                        var dataElNodeList = document.querySelectorAll(Obj.el);
                        for (var o = 0, len2 = dataElNodeList.length; o < len2; o++) {
                            var html = dataElNodeList[o].innerHTML;
                            dataElArr.push(dataElNodeList[o], html);
                            for (var i = 0, len = dataElArr.length; i < len; i++) {
                                if (i % 2 == 0 && dataElArr[i] == dataElNodeList[o]) {
                                    if (dataElNodeList[o].getAttribute("p-html") == null) {
                                        var isHTML = false;
                                    } else {
                                        var isHTML = true;
                                    }
                                    html = dataReplace(html, Obj.data, isHTML);
                                    if (Obj.isAsyncDOM) {
                                        joinAsyncList(dataElNodeList[o], "html", html.toString());
                                    } else {
                                        dataElNodeList[o].innerHTML = html.toString();
                                    }
                                }
                            }
                        }
                    }
                    if (Obj.loop != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "loop", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.loop = newVal;
                                        for (var i = 0, len = Element.length; i < len; i++) {
                                            Element[i].innerHTML = singleLi;
                                        }
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.loop;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "loop", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.loop = newVal;
                                        for (var i = 0, len = Element.length; i < len; i++) {
                                            if (Element[i].getAttribute("p-loop-in") != null) {
                                                for (var a = 0, len2 = forElArr.length; a < len2; a++) {
                                                    if (forElArr[a] == Element[i] && i % 2 == 0) {
                                                        var singleLi = forElArr[a + 1];
                                                    }
                                                }
                                                var obj = new Object();
                                                obj[Element[i].getAttribute("p-loop-in")] = Obj.loop[0];
                                                var nowElInner = dataReplace(singleLi, obj, true);
                                                for (var a = 1; a < Obj.loop.length; a++) {
                                                    nowElInner += singleLi;
                                                    obj[Element[i].getAttribute("p-loop-in")] = Obj.loop[a];
                                                    nowElInner = dataReplace(nowElInner, obj, true);
                                                }
                                                if (Obj.isAsyncDOM) {
                                                    joinAsyncList(Element[i], "html", nowElInner);
                                                } else {
                                                    Element[i].innerHTML = nowElInner;
                                                }
                                            } else {
                                                var forInnerHTML = "";
                                                for (var a = 0, len2 = Obj.loop.length; a < len2 - 1; a++) {
                                                    if (a == len2 - 2) {
                                                        forInnerHTML += "<li>" + Obj.loop[a] + "</li>";
                                                        break;
                                                    }
                                                    forInnerHTML += "<li>" + Obj.loop[a] + "</li>" + Obj.loop[len2 - 1];
                                                }
                                                if (Obj.isAsyncDOM) {
                                                    joinAsyncList(Element[i], "html", forInnerHTML);
                                                } else {
                                                    Element[i].innerHTML = forInnerHTML;
                                                }
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.loop;
                                    }
                                })
                            }
                        }
                        if (typeof Obj.loop == "function") {
                            Obj.loop = polyfillBind(Obj.loop, Obj.info)();
                        }
                        for (var i = 0, len = Element.length; i < len; i++) {
                            if (Element[i].getAttribute("p-loop-in") != null) {
                                var singleLi = Element[i].innerHTML;
                                forElArr.push(Element[i], singleLi);
                                var obj = new Object();
                                obj[Element[i].getAttribute("p-loop-in")] = Obj.loop[0];
                                var nowElInner = dataReplace(singleLi, obj, true);
                                for (var a = 1; a < Obj.loop.length; a++) {
                                    nowElInner += singleLi;
                                    obj[Element[i].getAttribute("p-loop-in")] = Obj.loop[a];
                                    nowElInner = dataReplace(nowElInner, obj, true);
                                }
                                if (Obj.isAsyncDOM) {
                                    joinAsyncList(Element[i], "html", nowElInner);
                                } else {
                                    Element[i].innerHTML = nowElInner;
                                }
                            } else {
                                var forInnerHTML = "";
                                for (var a = 0, len2 = Obj.loop.length; a < len2 - 1; a++) {
                                    if (a == len2 - 2) {
                                        forInnerHTML += "<li>" + Obj.loop[a] + "</li>";
                                        break;
                                    }
                                    forInnerHTML += "<li>" + Obj.loop[a] + "</li>" + Obj.loop[len2 - 1];
                                }
                                if (Obj.isAsyncDOM) {
                                    joinAsyncList(Element[i], "html", forInnerHTML);
                                } else {
                                    Element[i].innerHTML = forInnerHTML;
                                }
                            }
                        }
                    }
                    if (Obj.load != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "loadCallback", {
                                    set: function(newVal) {
                                        Obj.loadCallback = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.loadCallback;
                                    }
                                });
                                Object.defineProperty(this.dom, "load", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.load = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.load;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "loadCallback", {
                                    set: function(newVal) {
                                        Obj.loadCallback = newVal;
                                    },
                                    get: function() {
                                        return Obj.loadCallback;
                                    }
                                });
                                Object.defineProperty(this.dom, "load", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.load = newVal;
                                        if (!isThisModuleUsed("Per.ajax")) {
                                            use(["Per.ajax"]);
                                        }
                                        Per().ajax("GET", Obj.load, "", true, function(html) {
                                            for (var i = 0; i < Element.length; i++) {
                                                if (Obj.isAsyncDOM) {
                                                    joinAsyncList(Element[i], "html", html);
                                                } else {
                                                    Element[i].innerHTML = html;
                                                }
                                            }
                                            if (typeof Obj.loadCallback == "string") {
                                                var MethodArr = getObjKeyAndVal(Obj.method);
                                                for (var a = 0; a < MethodArr.length; a++) {
                                                    if (MethodArr[a] == Obj.loadCallback) {
                                                        for (var i = 0; i < Element.length; i++) {
                                                            MethodArr[a + 1]();
                                                        }
                                                        break;
                                                    }
                                                }
                                            } else if (typeof Obj.loadCallback == "function") {
                                                Obj.loadCallback();
                                            }
                                        });
                                    },
                                    get: function() {
                                        return Obj.load;
                                    }
                                })
                            }
                        }
                        if (typeof Obj.load == "function") {
                            Obj.load = polyfillBind(Obj.load, Obj.info)();
                        }
                        if (!isThisModuleUsed("Per.ajax")) {
                            use(["Per.ajax"]);
                        }
                        Per().ajax("GET", Obj.load, "", true, function(html) {
                            for (var i = 0; i < Element.length; i++) {
                                if (Obj.isAsyncDOM) {
                                    joinAsyncList(Element[i], "html", html);
                                } else {
                                    Element[i].innerHTML = html;
                                }
                            }
                            if (typeof Obj.loadCallback == "string") {
                                var MethodArr = getObjKeyAndVal(Obj.method);
                                for (var a = 0; a < MethodArr.length; a++) {
                                    if (MethodArr[a] == Obj.loadCallback) {
                                        for (var i = 0; i < Element.length; i++) {
                                            MethodArr[a + 1]();
                                        }
                                        break;
                                    }
                                }
                            } else if (typeof Obj.loadCallback == "function") {
                                Obj.loadCallback();
                            }
                        });
                    }
                    if (Obj.html != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "html", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.html = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.html;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "html", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.html = newVal;
                                        for (var i = 0, len = Element.length; i < len; i++) {
                                            if (Obj.isAsyncDOM) {
                                                joinAsyncList(Element[i], "html", Obj.html);
                                            } else {
                                                Element[i].innerHTML = Obj.html;
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.html;
                                    }
                                })
                            }
                        }
                        if (typeof Obj.html == "function") {
                            Obj.html = polyfillBind(Obj.html, Obj.info)();
                        }
                        for (var i = 0, len = Element.length; i < len; i++) {
                            if (Obj.isAsyncDOM) {
                                joinAsyncList(Element[i], "html", Obj.html);
                            } else {
                                Element[i].innerHTML = Obj.html;
                            }
                        }
                    }
                    if (Obj.text != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "text", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.text = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.text;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "text", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.text = newVal;
                                        for (var i = 0, len = Element.length; i < len; i++) {
                                            if (Obj.isAsyncDOM) {
                                                joinAsyncList(Element[i], "text", Obj.text);
                                            } else {
                                                Element[i].innerText = Obj.text;
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.text;
                                    }
                                })
                            }
                        }
                        if (typeof Obj.text == "function") {
                            Obj.text = polyfillBind(Obj.text, Obj.info)();
                        }
                        for (var i = 0, len = Element.length; i < len; i++) {
                            if (Obj.isAsyncDOM) {
                                joinAsyncList(Element[i], "text", Obj.text);
                            } else {
                                Element[i].innerText = Obj.text;
                            }
                        }
                    }
                    if (Obj.val != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "val", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.val = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.val;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "val", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.val = newVal;
                                        for (var i = 0, len = Element.length; i < len; i++) {
                                            Element[i].value = Obj.val;
                                        }
                                    },
                                    get: function() {
                                        return Obj.val;
                                    }
                                })
                            }
                        }
                        if (typeof Obj.val == "function") {
                            Obj.val = polyfillBind(Obj.val, Obj.info)();
                        }
                        for (var i = 0, len = Element.length; i < len; i++) {
                            Element[i].value = Obj.val;
                        }
                    }
                    if (Obj.css != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "css", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.css = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.css;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "css", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.css = newVal;
                                        var cssObjArr = getObjKeyAndVal(Obj.css);
                                        for (var a = 0, len = cssObjArr.length; a < len; a++) {
                                            if (a % 2 == 0) {
                                                for (var i = 0, len2 = Element.length; i < len2; i++) {
                                                    Element[i].style[cssObjArr[a]] = cssObjArr[a + 1];
                                                }
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.css;
                                    }
                                })
                            }
                        }
                        if (typeof Obj.css == "function") {
                            Obj.css = polyfillBind(Obj.css, Obj.info)();
                        }
                        var cssObjArr = getObjKeyAndVal(Obj.css);
                        for (var a = 0, len = cssObjArr.length; a < len; a++) {
                            if (a % 2 == 0) {
                                for (var i = 0, len2 = Element.length; i < len2; i++) {
                                    Element[i].style[cssObjArr[a]] = cssObjArr[a + 1];
                                }
                            }
                        }
                    }
                    if (Obj.attr != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "attr", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.attr = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.attr;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "attr", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.attr = newVal;
                                        var attrObjArr = getObjKeyAndVal(Obj.attr);
                                        for (var a = 0, len = attrObjArr.length; a < len; a++) {
                                            if (a % 2 == 0) {
                                                for (var i = 0, len2 = Element.length; i < len2; i++) {
                                                    Element[i].setAttribute(attrObjArr[a], attrObjArr[a + 1]);
                                                }
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.attr;
                                    }
                                })
                            }
                        }
                        if (typeof Obj.attr == "function") {
                            Obj.attr = polyfillBind(Obj.attr, Obj.info)();
                        }
                        var attrObjArr = getObjKeyAndVal(Obj.attr);
                        for (var a = 0, len = attrObjArr.length; a < len; a++) {
                            if (a % 2 == 0) {
                                for (var i = 0, len2 = Element.length; i < len2; i++) {
                                    Element[i].setAttribute(attrObjArr[a], attrObjArr[a + 1]);
                                }
                            }
                        }
                    }
                    if (typeof Obj.click == "function") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "click", {
                                    set: function(newVal) {
                                        Obj.click = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.click;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "click", {
                                    set: function(newVal) {
                                        Obj.click = newVal;
                                        var newFun = polyfillBind(Obj.click, Obj.info);
                                        for (var i = 0; i < Element.length; i++) {
                                            Element[i].onclick = newFun;
                                        }
                                    },
                                    get: function() {
                                        return Obj.click;
                                    }
                                })
                            }
                        }
                        var newFun = polyfillBind(Obj.click, Obj.info);
                        for (var i = 0; i < Element.length; i++) {
                            Element[i].onclick = newFun;
                        }
                    } else if (typeof Obj.click == "string") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "click", {
                                    set: function(newVal) {
                                        Obj.click = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.click;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "click", {
                                    set: function(newVal) {
                                        Obj.click = newVal;
                                        var MethodArr = getObjKeyAndVal(Obj.method);
                                        for (var a = 0; a < MethodArr.length; a++) {
                                            if (MethodArr[a] == Obj.click) {
                                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                                for (var i = 0; i < Element.length; i++) {
                                                    Element[i].onclick = newFun;
                                                }
                                                break;
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.click;
                                    }
                                })
                            }
                        }
                        var MethodArr = getObjKeyAndVal(Obj.method);
                        for (var a = 0; a < MethodArr.length; a++) {
                            if (MethodArr[a] == Obj.click) {
                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                for (var i = 0; i < Element.length; i++) {
                                    Element[i].onclick = newFun;
                                }
                                break;
                            }
                        }
                    }
                    if (typeof Obj.mousemove == "function") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "mousemove", {
                                    set: function(newVal) {
                                        Obj.mousemove = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.mousemove;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "mousemove", {
                                    set: function(newVal) {
                                        Obj.mousemove = newVal;
                                        var newFun = polyfillBind(Obj.mousemove, Obj.info);
                                        for (var i = 0; i < Element.length; i++) {
                                            Element[i].onmousemove = newFun;
                                        }
                                    },
                                    get: function() {
                                        return Obj.mousemove;
                                    }
                                })
                            }
                        }
                        var newFun = polyfillBind(Obj.mousemove, Obj.info);
                        for (var i = 0; i < Element.length; i++) {
                            Element[i].onmousemove = newFun;
                        }
                    } else if (typeof Obj.mousemove == "string") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "mousemove", {
                                    set: function(newVal) {
                                        Obj.mousemove = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.mousemove;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "mousemove", {
                                    set: function(newVal) {
                                        Obj.mousemove = newVal;
                                        var MethodArr = getObjKeyAndVal(Obj.method);
                                        for (var a = 0; a < MethodArr.length; a++) {
                                            if (MethodArr[a] == Obj.mousemove) {
                                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                                for (var i = 0; i < Element.length; i++) {
                                                    Element[i].onmousemove = newFun;
                                                }
                                                break;
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.mousemove;
                                    }
                                })
                            }
                        }
                        var MethodArr = getObjKeyAndVal(Obj.method);
                        for (var a = 0; a < MethodArr.length; a++) {
                            if (MethodArr[a] == Obj.mousemove) {
                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                for (var i = 0; i < Element.length; i++) {
                                    Element[i].onmousemove = newFun;
                                }
                                break;
                            }
                        }
                    }
                    if (typeof Obj.mousedown == "function") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "mousedown", {
                                    set: function(newVal) {
                                        Obj.mousedown = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.mousedown;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "mousedown", {
                                    set: function(newVal) {
                                        Obj.mousedown = newVal;
                                        var newFun = polyfillBind(Obj.mousedown, Obj.info);
                                        for (var i = 0; i < Element.length; i++) {
                                            Element[i].onmousedown = newFun;
                                        }
                                    },
                                    get: function() {
                                        return Obj.mousedown;
                                    }
                                })
                            }
                        }
                        var newFun = polyfillBind(Obj.mousedown, Obj.info);
                        for (var i = 0; i < Element.length; i++) {
                            Element[i].onmousedown = newFun;
                        }
                    } else if (typeof Obj.mousedown == "string") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "mousedown", {
                                    set: function(newVal) {
                                        Obj.mousedown = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.mousedown;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "mousedown", {
                                    set: function(newVal) {
                                        Obj.mousedown = newVal;
                                        var MethodArr = getObjKeyAndVal(Obj.method);
                                        for (var a = 0; a < MethodArr.length; a++) {
                                            if (MethodArr[a] == Obj.mousedown) {
                                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                                for (var i = 0; i < Element.length; i++) {
                                                    Element[i].onmousedown = newFun;
                                                }
                                                break;
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.mousedown;
                                    }
                                })
                            }
                        }
                        var MethodArr = getObjKeyAndVal(Obj.method);
                        for (var a = 0; a < MethodArr.length; a++) {
                            if (MethodArr[a] == Obj.mousedown) {
                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                for (var i = 0; i < Element.length; i++) {
                                    Element[i].onmousedown = newFun;
                                }
                                break;
                            }
                        }
                    }
                    if (typeof Obj.mouseover == "function") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "mouseover", {
                                    set: function(newVal) {
                                        Obj.mouseover = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.mouseover;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "mouseover", {
                                    set: function(newVal) {
                                        Obj.mouseover = newVal;
                                        var newFun = polyfillBind(Obj.mouseover, Obj.info);
                                        for (var i = 0; i < Element.length; i++) {
                                            Element[i].onmouseover = newFun;
                                        }
                                    },
                                    get: function() {
                                        return Obj.mouseover;
                                    }
                                })
                            }
                        }
                        var newFun = polyfillBind(Obj.mouseover, Obj.info);
                        for (var i = 0; i < Element.length; i++) {
                            Element[i].onmouseover = newFun;
                        }
                    } else if (typeof Obj.mouseover == "string") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "mouseover", {
                                    set: function(newVal) {
                                        Obj.mouseover = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.mouseover;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "mouseover", {
                                    set: function(newVal) {
                                        Obj.mouseover = newVal;
                                        var MethodArr = getObjKeyAndVal(Obj.method);
                                        for (var a = 0; a < MethodArr.length; a++) {
                                            if (MethodArr[a] == Obj.mouseover) {
                                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                                for (var i = 0; i < Element.length; i++) {
                                                    Element[i].onmouseover = newFun;
                                                }
                                                break;
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.mouseover;
                                    }
                                })
                            }
                        }
                        var MethodArr = getObjKeyAndVal(Obj.method);
                        for (var a = 0; a < MethodArr.length; a++) {
                            if (MethodArr[a] == Obj.mouseover) {
                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                for (var i = 0; i < Element.length; i++) {
                                    Element[i].onmouseover = newFun;
                                }
                                break;
                            }
                        }
                    }
                    if (typeof Obj.mouseout == "function") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "mouseout", {
                                    set: function(newVal) {
                                        Obj.mouseout = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.mouseout;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "mouseout", {
                                    set: function(newVal) {
                                        Obj.mouseout = newVal;
                                        var newFun = polyfillBind(Obj.mouseout, Obj.info);
                                        for (var i = 0; i < Element.length; i++) {
                                            Element[i].onmouseout = newFun;
                                        }
                                    },
                                    get: function() {
                                        return Obj.mouseout;
                                    }
                                })
                            }
                        }
                        var newFun = polyfillBind(Obj.mouseout, Obj.info);
                        for (var i = 0; i < Element.length; i++) {
                            Element[i].onmouseout = newFun;
                        }
                    } else if (typeof Obj.mouseout == "string") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "mouseout", {
                                    set: function(newVal) {
                                        Obj.mouseout = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.mouseout;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "mouseout", {
                                    set: function(newVal) {
                                        Obj.mouseout = newVal;
                                        var MethodArr = getObjKeyAndVal(Obj.method);
                                        for (var a = 0; a < MethodArr.length; a++) {
                                            if (MethodArr[a] == Obj.mouseout) {
                                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                                for (var i = 0; i < Element.length; i++) {
                                                    Element[i].onmouseout = newFun;
                                                }
                                                break;
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.mouseout;
                                    }
                                })
                            }
                        }
                        var MethodArr = getObjKeyAndVal(Obj.method);
                        for (var a = 0; a < MethodArr.length; a++) {
                            if (MethodArr[a] == Obj.mouseout) {
                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                for (var i = 0; i < Element.length; i++) {
                                    Element[i].onmouseout = newFun;
                                }
                                break;
                            }
                        }
                    }
                    if (typeof Obj.mouseup == "function") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "mouseup", {
                                    set: function(newVal) {
                                        Obj.mouseup = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.mouseup;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "mouseup", {
                                    set: function(newVal) {
                                        Obj.mouseup = newVal;
                                        var newFun = polyfillBind(Obj.mouseup, Obj.info);
                                        for (var i = 0; i < Element.length; i++) {
                                            Element[i].onmouseup = newFun;
                                        }
                                    },
                                    get: function() {
                                        return Obj.mouseup;
                                    }
                                })
                            }
                        }
                        var newFun = polyfillBind(Obj.mouseup, Obj.info);
                        for (var i = 0; i < Element.length; i++) {
                            Element[i].onmouseup = newFun;
                        }
                    } else if (typeof Obj.mouseup == "string") {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "mouseup", {
                                    set: function(newVal) {
                                        Obj.mouseup = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.mouseup;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "mouseup", {
                                    set: function(newVal) {
                                        Obj.mouseup = newVal;
                                        var MethodArr = getObjKeyAndVal(Obj.method);
                                        for (var a = 0; a < MethodArr.length; a++) {
                                            if (MethodArr[a] == Obj.mouseup) {
                                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                                for (var i = 0; i < Element.length; i++) {
                                                    Element[i].onmouseup = newFun;
                                                }
                                                break;
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.mouseup;
                                    }
                                })
                            }
                        }
                        var MethodArr = getObjKeyAndVal(Obj.method);
                        for (var a = 0; a < MethodArr.length; a++) {
                            if (MethodArr[a] == Obj.mouseup) {
                                var newFun = polyfillBind(MethodArr[a + 1], Obj.info);
                                for (var i = 0; i < Element.length; i++) {
                                    Element[i].onmouseup = newFun;
                                }
                                break;
                            }
                        }
                    }
                    if (Obj.name != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "name", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.name = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.name;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "name", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.name = newVal;
                                        for (var i = 0; i < Element.length; i++) {
                                            Element[i].setAttribute("name", Obj.name);
                                        }
                                    },
                                    get: function() {
                                        return Obj.name;
                                    }
                                })
                            }
                        }
                        if (typeof Obj.name == "function") {
                            Obj.name = polyfillBind(Obj.name, Obj.info)();
                        }
                        for (var i = 0; i < Element.length; i++) {
                            Element[i].setAttribute("name", Obj.name);
                        }
                    }
                    if (Obj.bind != undefined && Obj.bindType != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "bindType", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.bindType = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.bindType;
                                    }
                                });
                                Object.defineProperty(this.dom, "bind", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.bind = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.bind;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "bindType", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.bindType = newVal;
                                    },
                                    get: function() {
                                        return Obj.bindType;
                                    }
                                });
                                Object.defineProperty(this.dom, "bind", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.bind = newVal;
                                        if (Obj.bindType.substr(0, 3) == "in ") {
                                            var bindElement = document.querySelector(Obj.el);
                                            var dataObj = new Object();
                                            dataObj[Obj.bindType.substr(3, Obj.bindType.length - 3)] = bindElement.value;
                                            bindElement.el = Obj.el;
                                            bindElement.dataName = Obj.bindType.substr(3, Obj.bindType.length - 3);
                                            bindElement.per = Per(Obj.bind);
                                            bindElement.per.dom({
                                                data: dataObj
                                            }, true, false);
                                            bindElement.oninput = function() {
                                                var dataObj = new Object();
                                                dataObj[this.dataName] = document.querySelector(this.el).value;
                                                this.per.dom.data = dataObj;
                                            }
                                        } else if (Obj.bindType == "html") {
                                            for (var i = 0; i < Element.length; i++) {
                                                var bindHTMLListener = Element[i];
                                                bindHTMLListener.paraEl = i;
                                                bindHTMLListener.targetEl = document.querySelectorAll(Obj.bind);
                                                bindHTMLListener.oninput = function() {
                                                    var elementList = this.targetEl;
                                                    for (var a = 0; a < elementList.length; a++) {
                                                        elementList[a].innerHTML = Element[this.paraEl].value;
                                                    }
                                                }
                                            }
                                        } else if (Obj.bindType == "text") {
                                            for (var i = 0; i < Element.length; i++) {
                                                var bindHTMLListener = Element[i];
                                                bindHTMLListener.paraEl = i;
                                                bindHTMLListener.targetEl = document.querySelectorAll(Obj.bind);
                                                bindHTMLListener.oninput = function() {
                                                    var elementList = this.targetEl;
                                                    for (var a = 0; a < elementList.length; a++) {
                                                        elementList[a].innerText = Element[this.paraEl].value;
                                                    }
                                                }
                                            }
                                        } else if (Obj.bindType == "value") {
                                            for (var i = 0; i < Element.length; i++) {
                                                var bindHTMLListener = Element[i];
                                                bindHTMLListener.paraEl = i;
                                                bindHTMLListener.targetEl = document.querySelectorAll(Obj.bind);
                                                bindHTMLListener.oninput = function() {
                                                    var elementList = this.targetEl;
                                                    for (var a = 0; a < elementList.length; a++) {
                                                        elementList[a].value = Element[this.paraEl].value;
                                                    }
                                                }
                                            }
                                        } else {
                                            console.error("Per.js: unknow bindType!");
                                        }
                                    },
                                    get: function() {
                                        return Obj.bind;
                                    }
                                })
                            }
                        }
                        if (typeof Obj.bindType == "function") {
                            Obj.bindType = polyfillBind(Obj.bindType, Obj.info)();
                        }
                        if (typeof Obj.bind == "function") {
                            Obj.bind = polyfillBind(Obj.bind, Obj.info)();
                        }
                        if (Obj.bindType.substr(0, 3) == "in ") {
                            var bindElement = document.querySelector(Obj.el);
                            var dataObj = new Object();
                            dataObj[Obj.bindType.substr(3, Obj.bindType.length - 3)] = bindElement.value;
                            bindElement.el = Obj.el;
                            bindElement.dataName = Obj.bindType.substr(3, Obj.bindType.length - 3);
                            bindElement.per = Per(Obj.bind);
                            bindElement.per.dom({
                                data: dataObj
                            }, true, false);
                            bindElement.oninput = function() {
                                var dataObj = new Object();
                                dataObj[this.dataName] = document.querySelector(this.el).value;
                                this.per.dom.data = dataObj;
                            }
                        } else if (Obj.bindType == "html") {
                            for (var i = 0; i < Element.length; i++) {
                                var bindHTMLListener = Element[i];
                                bindHTMLListener.paraEl = i;
                                bindHTMLListener.targetEl = document.querySelectorAll(Obj.bind);
                                bindHTMLListener.oninput = function() {
                                    var elementList = this.targetEl;
                                    for (var a = 0; a < elementList.length; a++) {
                                        elementList[a].innerHTML = Element[this.paraEl].value;
                                    }
                                }
                            }
                        } else if (Obj.bindType == "text") {
                            for (var i = 0; i < Element.length; i++) {
                                var bindHTMLListener = Element[i];
                                bindHTMLListener.paraEl = i;
                                bindHTMLListener.targetEl = document.querySelectorAll(Obj.bind);
                                bindHTMLListener.oninput = function() {
                                    var elementList = this.targetEl;
                                    for (var a = 0; a < elementList.length; a++) {
                                        elementList[a].innerText = Element[this.paraEl].value;
                                    }
                                }
                            }
                        } else if (Obj.bindType == "value") {
                            for (var i = 0; i < Element.length; i++) {
                                var bindHTMLListener = Element[i];
                                bindHTMLListener.paraEl = i;
                                bindHTMLListener.targetEl = document.querySelectorAll(Obj.bind);
                                bindHTMLListener.oninput = function() {
                                    var elementList = this.targetEl;
                                    for (var a = 0; a < elementList.length; a++) {
                                        elementList[a].value = Element[this.paraEl].value;
                                    }
                                }
                            }
                        } else {
                            console.error("Per.js: unknow bindType!");
                        }
                    }
                    if (Obj.con != undefined) {
                        if (isReactive) {
                            if (isReactChangeRedo) {
                                Object.defineProperty(this.dom, "con", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.con = newVal;
                                        Per(Obj.el).dom(Obj, false, false);
                                    },
                                    get: function() {
                                        return Obj.con;
                                    }
                                })
                            } else {
                                Object.defineProperty(this.dom, "con", {
                                    set: function(newVal) {
                                        if (typeof newVal == "function") {
                                            newVal = polyfillBind(newVal, Obj.info)();
                                        }
                                        Obj.con = newVal;
                                        for (var i = 0; i < Element.length; i++) {
                                            if (Element[i].getAttribute("p-con") == "true") {
                                                Element[i].style.display = "";
                                            } else {
                                                Element[i].style.display = "none";
                                            }
                                        }
                                    },
                                    get: function() {
                                        return Obj.con;
                                    }
                                })
                            }
                        }
                        if (typeof Obj.con == "function") {
                            Obj.con = polyfillBind(Obj.con, Obj.info)();
                        }
                        for (var i = 0; i < Element.length; i++) {
                            if (Element[i].getAttribute("p-con") == "true") {
                                Element[i].style.display = "";
                            } else {
                                Element[i].style.display = "none";
                            }
                        }
                    }
                    if (typeof Obj.callback == "function") {
                        var newFun = polyfillBind(Obj.callback, Obj.info);
                        newFun();
                    } else if (typeof Obj.callback == "string") {
                        var callbackMethodArr = getObjKeyAndVal(Obj.method);
                        for (var i = 0; i < callbackMethodArr.length; i++) {
                            if (callbackMethodArr[i] == Obj.callback) {
                                var newFun = polyfillBind(callbackMethodArr[i + 1], Obj.info);
                                newFun();
                                break;
                            }
                        }
                    }
                } else {
                    console.error("Per.js: para el cannot be null!");
                }
            }
        }
    }

    /**
     * This code is for no parentheses
     */
    Per.isThisModuleUsed = isThisModuleUsed;
    Per.getAllModuleNameAndVersion = getAllModuleNameAndVersion;
    Per.joinModule = joinModule;
    Per.use = use;
    Per.version = versions;
    Per.config = config;

    /**
     * Init all inner modules
     */
    var per = Per();
    /**
     * Per.component模块用于注册组件
     * @since 1.0
     */
    per.joinModule("Per.component", versions, function() {
        function PerComponentInit(componentName, option) {
            this.componentName = componentName;
            this.option = option;
            this.apply = function(element) {
                if (element == undefined) {
                    var perComNodeList = document.querySelectorAll(this.componentName);
                    if (this.option.attribute != undefined) {
                        var perComAttrArr = getObjKeyAndVal(this.option.attribute);
                    }
                    for (var i = 0, len = perComNodeList.length; i < len; i++) {
                        perComNodeList[i].innerHTML = this.option.template;
                        if (this.option.attribute != undefined) {
                            for (var a = 0, len2 = perComAttrArr.length; a < len2; a++) {
                                if (a % 2 == 0) {
                                    perComAttrArr[a+1](perComNodeList[i].getAttribute("p-"+perComAttrArr[a]));
                                }
                            }
                        }
                    }
                    if (this.option.dom != undefined) {
                        var perDOMFun = Per(this.componentName);
                        perDOMFun.dom(this.option.dom, true, false);
                        return perDOMFun;
                    }
                } else {
                    var perComNodeList = document.querySelectorAll(element + " " + this.componentName);
                    if (this.option.attribute != undefined) {
                        var perComAttrArr = getObjKeyAndVal(this.option.attribute);
                    }
                    for (var i = 0, len = perComNodeList.length; i < len; i++) {
                        perComNodeList[i].innerHTML = this.option.template;
                        if (this.option.attribute != undefined) {
                            for (var a = 0, len2 = perComAttrArr.length; a < len2; a++) {
                                if (a % 2 == 0) {
                                    perComAttrArr[a+1](perComNodeList[i].getAttribute("p-"+perComAttrArr[a]));
                                }
                            }
                        }
                    }
                    if (this.option.dom != undefined) {
                        var perDOMFun = Per(element + " " + this.componentName);
                        perDOMFun.dom(this.option.dom, true, false);
                        return perDOMFun;
                    }
                }
            }
            this.clone = function(componentName) {
                if (componentName != undefined) {
                    var perComNewObj = deepCopy(this.option);
                    return new PerComponentInit(componentName, perComNewObj);
                } else {
                    console.error("Per.js: componentName cannot be undefined.");
                }
            }
        }
        window.Per.fn.prototype.component = {
            set: function(componentName, option) {
                if (componentName != undefined && option != undefined) {
                    componentJoinArr[componentName] = componentName;
                    return new PerComponentInit(componentName, option);
                } else {
                    console.error("Per.js: componentName and option cannot be undefined.");
                }
            },
            get: function(componentName) {
                if (componentName != undefined) {
                    return componentJoinArr[componentName];
                } else {
                    console.error("Per.js: componentName cannot be undefined.");
                }
            }
        }
        Per.component = window.Per.fn.prototype.component;
    });
    /**
     * Per.ajax模块用于执行ajax操作
     * @since 1.0
     */
    per.joinModule("Per.ajax", versions, function() {
        window.Per.fn.prototype.ajax = function(type, url, msg, async, callback) {
            //callback参数必须有一个值来接受信息
            //当async为true时，并且请求出现异常时，系统将会自动向callback方法里传入异常状态码
            if (type.toUpperCase() == "GET") {
                //GET请求msg参数无效，需要提交数据的话请放置在url中
                if (async ||async ==undefined || async =="" || async ==null) {
                    if (callback != "" && callback != null && callback != undefined) {
                        var xmlhttp;
                        xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function() {
                            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                                callback(xmlhttp.responseText);
                            } else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
                                callback(xmlhttp.status);
                            }
                        }
                        xmlhttp.open("GET", url, true);
                        xmlhttp.send();
                    } else {
                        console.error("Per.js: unknow function ajax's callback value!");
                    }
                } else if (!async) {
                    if (callback != "" && callback != null && callback != undefined) {
                        var xmlhttp;
                        xmlhttp = new XMLHttpRequest();
                        xmlhttp.open("GET", url, false);
                        xmlhttp.send();
                        callback(xmlhttp.responseText);
                    } else {
                        console.error("Per.js: unknow function ajax's callback value!");
                    }
                } else {
                    console.error("Per.js: unknow function ajax's async value!");
                }
            } else if (type.toUpperCase() == "POST") {
                //POST请求msg参数必须填写
                if (async ||async ==undefined || async =="" || async ==null) {
                    if (callback != "" && callback != null && callback != undefined) {
                        var xmlhttp;
                        xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function() {
                            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                                callback(xmlhttp.responseText);
                            } else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
                                callback(xmlhttp.status);
                            }
                        }
                        xmlhttp.open("POST", url, true);
                        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xmlhttp.send(msg);
                    } else {
                        console.error("Per.js: unknow function ajax's callback value!");
                    }
                } else if (!async) {
                    if (callback != "" && callback != null && callback != undefined) {
                        var xmlhttp;
                        xmlhttp = new XMLHttpRequest();
                        xmlhttp.open("POST", url, false);
                        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xmlhttp.send(msg);
                        callback(xmlhttp.responseText);
                    } else {
                        console.error("Per.js: unknow function ajax's callback value!");
                    }
                } else {
                    console.error("Per.js: unknow function ajax's async value!");
                }
            } else {
                console.error("Per.js: unknow function ajax's type value!")
            }
        }
        Per.ajax = window.Per.fn.prototype.ajax;
    });
    /**
     * Per.page模块用于注册和切换页面
     * @since 1.2
     */
    per.joinModule("Per.page", versions, function() {
        var perPageModulePageArr = new Array();
        window.Per.fn.prototype.page = {
            create: {
                page: function(pageGroupName, pageEl) {
                    if (typeof pageEl == "string") {
                        if (perPageModulePageArr[pageGroupName] == undefined || perPageModulePageArr[pageGroupName] == null) {
                            console.error("Per.js: pageGroup need create frist! at pageGroup: " + pageGroupName);
                        } else {
                            perPageModulePageArr[pageGroupName][perPageModulePageArr[pageGroupName].length] = pageEl;
                        }
                    } else if (Array.isArray(pageEl)) {
                        for (var i = 0, len = pageEl.length; i < len; i++) {
                            if (perPageModulePageArr[pageGroupName] == undefined || perPageModulePageArr[pageGroupName] == null) {
                                console.error("Per.js: pageGroup need create frist! at pageGroup: " + pageGroupName);
                            } else {
                                perPageModulePageArr[pageGroupName][perPageModulePageArr[pageGroupName].length] = pageEl[i];
                            }
                        }
                    } else {
                        console.error("Per.js: unknow pageEl's type.");
                    }
                },
                pageGroup: function(pageGroupName) {
                    if (typeof pageGroupName == "string") {
                        if (perPageModulePageArr[pageGroupName] == undefined || perPageModulePageArr[pageGroupName] == null) {
                            perPageModulePageArr[pageGroupName] = new Array();
                        } else {
                            console.error("Per.js: this pageGroup has already been create! at pageGroup: " + pageGroupName);
                        }
                    } else if (Array.isArray(pageGroupName)) {
                        for (var i = 0, len = pageGroupName.length; i < len; i++) {
                            if (perPageModulePageArr[pageGroupName[i]] == undefined || perPageModulePageArr[pageGroupName[i]] == null) {
                                perPageModulePageArr[pageGroupName[i]] = new Array();
                            } else {
                                console.error("Per.js: this pageGroup has already been create! at pageGroup: " + pageGroupName[i]);
                            }
                        }
                    } else {
                        console.error("Per.js: unknow pageGroupName's type.");
                    }
                }
            },
            to: function(pageGroupName, pageNumber) {
                if (perPageModulePageArr[pageGroupName] == undefined || perPageModulePageArr[pageGroupName] == null) {
                    console.error("Per.js: pageGroup need create frist! at pageGroup: " + pageGroupName);
                } else {
                    var arr = perPageModulePageArr[pageGroupName];
                    for (var i = 0; i < arr.length; i++) {
                        var elArr = document.querySelectorAll(arr[i]);
                        for (var a = 0; a < elArr.length; a++) {
                            elArr[a].style.display = "none";
                        }
                    }
                    var elArr = document.querySelectorAll(arr[pageNumber - 1]);
                    for (var a = 0; a < elArr.length; a++) {
                        elArr[a].style.display = "";
                    }
                }
            },
            remove: {
                page: function(pageGroupName, pageEl) {
                    if (typeof pageEl == "string") {
                        if (perPageModulePageArr[pageGroupName] == undefined || perPageModulePageArr[pageGroupName] == null) {
                            console.error("Per.js: you need create this pageGroup before remove it! at pageGroup: " + pageGroupName);
                        } else {
                            var arr = perPageModulePageArr[pageGroupName];
                            for (var i = 0; i < arr.length; i++) {
                                if (arr[i] == pageEl) {
                                    arr.splice(i, 1);
                                }
                            }
                            perPageModulePageArr[pageGroupName] = arr;
                        }
                    } else if (Array.isArray(pageEl)) {
                        for (var i = 0, len = pageEl.length; i < len; i++) {
                            if (perPageModulePageArr[pageGroupName] == undefined || perPageModulePageArr[pageGroupName] == null) {
                                console.error("Per.js: you need create this pageGroup before remove it! at pageGroup: " + pageGroupName);
                            } else {
                                var arr = perPageModulePageArr[pageGroupName];
                                for (var i = 0; i < arr.length; i++) {
                                    if (arr[i] == pageEl[i]) {
                                        arr.splice(i, 1);
                                    }
                                }
                                perPageModulePageArr[pageGroupName] = arr;
                            }
                        }
                    } else {
                        console.error("Per.js: unknow pageEl's type.");
                    }
                },
                pageGroup: function(pageGroupName) {
                    if (typeof pageGroupName == "string") {
                        if (perPageModulePageArr[pageGroupName] == undefined || perPageModulePageArr[pageGroupName] == null) {
                            console.error("Per.js: you need create this pageGroup before remove it! at pageGroup: " + pageGroupName);
                        } else {
                            perPageModulePageArr[pageGroupName] = undefined;
                        }
                    } else if (Array.isArray(pageGroupName)) {
                        for (var i = 0, len = pageGroupName.length; i < len; i++) {
                            if (perPageModulePageArr[pageGroupName[i]] == undefined || perPageModulePageArr[pageGroupName[i]] == null) {
                                console.error("Per.js: you need create this pageGroup before remove it! at pageGroup: " + pageGroupName[i]);
                            } else {
                                perPageModulePageArr[pageGroupName[i]] = undefined;
                            }
                        }
                    } else {
                        console.error("Per.js: unknow pageGroupName's type.");
                    }
                }
            },
            get: {
                pageGroup: function(pageGroupName) {
                    if (perPageModulePageArr[pageGroupName] == undefined || perPageModulePageArr[pageGroupName] == null) {
                        console.error("Per.js: you need create this pageGroup before get it! at pageGroup: " + pageGroupName);
                    } else {
                        return perPageModulePageArr[pageGroupName];
                    }
                }
            }
        }
        Per.page = window.Per.fn.prototype.page;
    });
    /**
     * Per.check模块用于判断字符串
     * @since 1.3
     */
    per.joinModule("Per.check", versions, function() {
        window.Per.fn.prototype.check = {
            mail: function(mailText) {
                var reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
                return reg.test(mailText);
            },
            html: function(text) {
                var reg = new RegExp(/\<|\>|\\/g);
                return reg.test(text);
            },
            URL: function(text) {
                var RegUrl = new RegExp();
                RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
                return RegUrl.test(text);
            }
        }
        Per.check = window.Per.fn.prototype.check;
    });
    /**
     * Per.dom模块让你使用类似JQuery的语法去操作DOM
     * @since 1.4
     */
    per.joinModule("Per.dom", versions, function() {
        var otherFrameWork$ = window.$;
        var perGetFun = function(el) {
            if (el == undefined || el == null || el == "") {
                console.error("Per.js: you need set el attr, before use Per.get module!");
            } else {
                if (!per.isThisModuleUsed("Per.sel")) {
                    per.use("Per.sel");
                }
                return {
                    css: function(cssName, val) {
                        if (typeof val == "string") {
                            var elArr = per.sel.selectAll(el);
                            for (var i = 0; i < elArr.length; i++) {
                                elArr[i].style[cssName] = val;
                            }
                        } else {
                            var elArr = per.sel.selectAll(el);
                            var returnText = "";
                            for (var i = 0; i < elArr.length; i++) {
                                returnText += elArr[i].style[cssName];
                            }
                            return returnText;
                        }
                    },
                    attr: function(attrName, val) {
                        if (typeof val == "string") {
                            var elArr = per.sel.selectAll(el);
                            for (var i = 0; i < elArr.length; i++) {
                                elArr[i].setAttribute(attrName, val);
                            }
                        } else {
                            var elArr = per.sel.selectAll(el);
                            var returnText = "";
                            for (var i = 0; i < elArr.length; i++) {
                                returnText += elArr[i].getAttribute(attrName);
                            }
                            return returnText;
                        }
                    },
                    height: function(val) {
                        if (typeof val == "string") {
                            var elArr = per.sel.selectAll(el);
                            for (var i = 0; i < elArr.length; i++) {
                                elArr[i].setAttribute("height", val);
                            }
                        } else {
                            var elArr = per.sel.selectAll(el);
                            var returnText = "";
                            for (var i = 0; i < elArr.length; i++) {
                                returnText += elArr[i].getAttribute("height");
                            }
                            return returnText;
                        }
                    },
                    width: function(val) {
                        if (typeof val == "string") {
                            var elArr = per.sel.selectAll(el);
                            for (var i = 0; i < elArr.length; i++) {
                                elArr[i].setAttribute("width", val);
                            }
                        } else {
                            var elArr = per.sel.selectAll(el);
                            var returnText = "";
                            for (var i = 0; i < elArr.length; i++) {
                                returnText += elArr[i].getAttribute("width");
                            }
                            return returnText;
                        }
                    },
                    html: function(val) {
                        if (typeof val == "string") {
                            var elArr = per.sel.selectAll(el);
                            for (var i = 0; i < elArr.length; i++) {
                                elArr[i].innerHTML = val;
                            }
                        } else {
                            var elArr = per.sel.selectAll(el);
                            var returnText = "";
                            for (var i = 0; i < elArr.length; i++) {
                                returnText += elArr[i].innerHTML;
                            }
                            return returnText;
                        }
                    },
                    text: function(val) {
                        if (typeof val == "string") {
                            var elArr = per.sel.selectAll(el);
                            for (var i = 0; i < elArr.length; i++) {
                                elArr[i].innerText = val;
                            }
                        } else {
                            var elArr = per.sel.selectAll(el);
                            var returnText = "";
                            for (var i = 0; i < elArr.length; i++) {
                                returnText += elArr[i].innerText;
                            }
                            return returnText;
                        }
                    },
                    val: function(val) {
                        if (typeof val == "string") {
                            var elArr = per.sel.selectAll(el);
                            for (var i = 0; i < elArr.length; i++) {
                                elArr[i].value = val;
                            }
                        } else {
                            var elArr = per.sel.selectAll(el);
                            var returnText = "";
                            for (var i = 0; i < elArr.length; i++) {
                                returnText += elArr[i].value;
                            }
                            return returnText;
                        }
                    },
                    classes: function(val) {
                        if (typeof val == "string") {
                            var elArr = per.sel.selectAll(el);
                            for (var i = 0; i < elArr.length; i++) {
                                elArr[i].setAttribute("class", val);
                            }
                        } else {
                            var elArr = per.sel.selectAll(el);
                            var returnText = "";
                            for (var i = 0; i < elArr.length; i++) {
                                returnText += elArr[i].getAttribute("class");
                            }
                            return returnText;
                        }
                    },
                    parent: function() {
                        //返回数组或字符串形式
                        var elArr = per.sel.selectAll(el);
                        if (elArr.length == 1) {
                            var returnText = "";
                            for (var i = 0; i < elArr.length; i++) {
                                returnText += elArr[i].parentNode;
                            }
                            return returnText;
                        } else {
                            var returnArr = new Array();
                            for (var i = 0; i < elArr.length; i++) {
                                returnArr[returnArr.length] = elArr[i].parentNode;
                            }
                            return returnArr;
                        }
                    },
                    children: function() {
                        //返回2维数组形式，第一维为父元素，第二维为子节点
                        var elArr = per.sel.selectAll(el);
                        var returnArr = new Array();
                        for (var i = 0; i < elArr.length; i++) {
                            returnArr[returnArr.length] = elArr[i].childNodes;
                        }
                        return returnArr;
                    },
                    noConflict: function() {
                        window.$ = otherFrameWork$;
                    }
                }
            }
        }
        Per.dom = perGetFun;
        window.$ = perGetFun;
    });
    /**
     * Per.lazyLoad模块用于懒加载图片
     * @since 1.5
     */
    per.joinModule("Per.lazyLoad", versions, function() {
        var lazyLoadListenerRepeatTime = 25; //ms
        var lazyLoadRange = 100; //px
        var lazyLoadList = new Array();
        window.Per.fn.prototype.lazyLoad = {
            setLazyLoadListenerRepeatTime: function(num) {
                if (typeof num == "number") {
                    lazyLoadListenerRepeatTime = num;
                } else {
                    console.error("Per.js: function setLazyLoadListenerRepeatTime's para num's type should be number!");
                }
            },
            setLazyLoadRange: function(num) {
                if (typeof num == "number") {
                    lazyLoadRange = num;
                } else {
                    console.error("Per.js: function setLazyLoadRange's para num's type should be number!");
                }
            },
            setLazyLoad: function(el, url) {
                lazyLoadList.push(el, url);
            },
            clearLazyLoadTimer: function() {
                clearInterval(lazyLoadTimer);
            }
        }
        //懒加载监听器
        var lazyLoadTimer = setInterval(function() {
            if (lazyLoadList.length != 0) {
                for (var i = 0; i < lazyLoadList.length; i++) {
                    if (i % 2 == 0) {
                        var Element = document.querySelector(lazyLoadList[i]);
                        var h = window.screen.availHeight;
                        if (Element.getBoundingClientRect().top - (h + lazyLoadRange) <= 0) {
                            Element.setAttribute("src", lazyLoadList[i + 1]);
                            lazyLoadList.splice(0, 2);
                            i -= 2;
                        }
                    }
                }
            }
        }, lazyLoadListenerRepeatTime);
        Per.lazyLoad = window.Per.fn.prototype.lazyLoad;
    });
    /**
     * Per.each模块用于遍历数组
     * @since 2.0
     */
    per.joinModule("Per.each", versions, function() {
        //fun参数类型需为function，且必须要有2个参数，第一个用来获取i的值，用来获取当前arr的值
        window.Per.fn.prototype.each = function(arr, fun) {
            if (typeof fun == "function" && Array.isArray(arr)) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    fun(i, arr[i]);
                }
            }
        }
        Per.each = window.Per.fn.prototype.each;
    });
    /**
     * Per.browser模块用于获取浏览器的一些信息
     * @since 2.0
     */
    per.joinModule("Per.browser", versions, function() {
        window.Per.fn.prototype.browser = {
            type: function() {
                var userAgent = navigator.userAgent;
                var isOpera = userAgent.indexOf("Opera") > -1;
                if (isOpera) {
                    return "Opera";
                } else if (userAgent.indexOf("Firefox") > -1) {
                    return "Firefox";
                } else if (userAgent.indexOf("Chrome") > -1) {
                    return "Chrome";
                } else if (userAgent.indexOf("Safari") > -1) {
                    return "Safari";
                } else if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                    return "IE";
                } else if (userAgent.indexOf("Trident") > -1) {
                    return "Edge";
                }
            },
            isPC: function() {
                if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                    return false;
                } else {
                    return true;
                }
            },
            OSType: function() {
                var sUserAgent = navigator.userAgent;
                if ((navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel")) return "MacOS";
                if ((navigator.platform == "X11") && !isWin && !isMac) return "Unix";
                if ((String(navigator.platform).indexOf("Linux") > -1)) return "Linux";
                if ((navigator.platform == "Win32") || (navigator.platform == "Windows")) {
                    if (sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1) {
                        return "Windows2000";
                    } else if (sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1) {
                        return "WindowsXP";
                    } else if (sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1) {
                        return "Windows2003";
                    } else if (sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1) {
                        return "Windows Vista";
                    } else if (sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1) {
                        return "Windows7";
                    } else if (sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1) {
                        return "Windows10";
                    }
                }
                if (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('Linux') > -1) {
                    return 'Android';
                } else if (sUserAgent.indexOf('iPhone') > -1) {
                    return 'iOS';
                } else if (sUserAgent.indexOf('Windows Phone') > -1) {
                    return 'WP';
                }
                return "Other";
            },
            isNetConnect: function() {
                return navigator.onLine;
            }
        }
        Per.browser = window.Per.fn.prototype.browser;
    });
    /**
     * Per.animation模块用于给DOM元素设置动画
     * @since 2.4
     */
    per.joinModule("Per.animation", versions, function() {
        //当一个元素同时拥有多个动画时，将会以最后设置的animation为准调用一次callback函数
        //当一个元素的属性的值就等于你要进行动画的值时，动画将不会被触发
        window.Per.fn.prototype.animation = function(PerAniEl) {
            var PerAniElAniCallBackFun = function() {
                this.style.transition = null;
                this.style["-moz-transition"] = null;
                this.style["-webkit-transition"] = null;
                this.style["-o-transition"] = null;
                this.style["-ms-transition"] = null;
                if (typeof this.callbackFun == "function" && !this.isCallbackFunDo) {
                    this.isCallbackFunDo = true;
                    this.callbackFun();
                }
            }
            if (PerAniEl == null || PerAniEl == undefined || PerAniEl == "") {
                console.error("Per.js: animation's parameter element shouldn't be null or undefined!");
            } else {
                return {
                    width: function(val, time, callback) {
                        if (typeof val == "string" && typeof time == "number") {
                            var PerAniElArr = document.querySelectorAll(PerAniEl);
                            for (var i = 0, len = PerAniElArr.length; i < len; i++) {
                                var thisPerAniEl = PerAniElArr[i];
                                if (thisPerAniEl.style.width != val) {
                                    if (typeof callback == "function") {
                                        thisPerAniEl.callbackFun = callback;
                                    }
                                    thisPerAniEl.style.transition = "all " + time + "s";
                                    thisPerAniEl.style["-moz-transition"] = "all " + time + "s";
                                    thisPerAniEl.style["-webkit-transition"] = "all " + time + "s";
                                    thisPerAniEl.style["-o-transition"] = "all " + time + "s";
                                    thisPerAniEl.style["-ms-transition"] = "all " + time + "s";
                                    thisPerAniEl.isCallbackFunDo = false;
                                    thisPerAniEl.addEventListener("transitionend", PerAniElAniCallBackFun);
                                    thisPerAniEl.addEventListener('webkitTransitionEnd', PerAniElAniCallBackFun);
                                    thisPerAniEl.style.width = val;
                                }
                            }
                        } else {
                            console.error("Per.js: animation's parameter val should be string, and time should be number!");
                        }
                    },
                    height: function(val, time, callback) {
                        if (typeof val == "string" && typeof time == "number") {
                            var PerAniElArr = document.querySelectorAll(PerAniEl);
                            for (var i = 0, len = PerAniElArr.length; i < len; i++) {
                                var thisPerAniEl = PerAniElArr[i];
                                if (thisPerAniEl.style.height != val) {
                                    if (typeof callback == "function") {
                                        thisPerAniEl.callbackFun = callback;
                                    }
                                    thisPerAniEl.style.transition = "all " + time + "s";
                                    thisPerAniEl.style["-moz-transition"] = "all " + time + "s";
                                    thisPerAniEl.style["-webkit-transition"] = "all " + time + "s";
                                    thisPerAniEl.style["-o-transition"] = "all " + time + "s";
                                    thisPerAniEl.style["-ms-transition"] = "all " + time + "s";
                                    thisPerAniEl.isCallbackFunDo = false;
                                    thisPerAniEl.addEventListener("transitionend", PerAniElAniCallBackFun);
                                    thisPerAniEl.addEventListener('webkitTransitionEnd', PerAniElAniCallBackFun);
                                    thisPerAniEl.style.height = val;
                                }
                            }
                        } else {
                            console.error("Per.js: animation's parameter val should be string, and time should be number!");
                        }
                    },
                    to: function(styleType, toVal, time, callback) {
                        if (typeof toVal == "string" && typeof time == "number") {
                            var PerAniElArr = document.querySelectorAll(PerAniEl);
                            for (var i = 0, len = PerAniElArr.length; i < len; i++) {
                                var thisPerAniEl = PerAniElArr[i];
                                if (thisPerAniEl.style[styleType] != toVal) {
                                    if (typeof callback == "function") {
                                        thisPerAniEl.callbackFun = callback;
                                    }
                                    thisPerAniEl.style.transition = "all " + time + "s";
                                    thisPerAniEl.style["-moz-transition"] = "all " + time + "s";
                                    thisPerAniEl.style["-webkit-transition"] = "all " + time + "s";
                                    thisPerAniEl.style["-o-transition"] = "all " + time + "s";
                                    thisPerAniEl.style["-ms-transition"] = "all " + time + "s";
                                    thisPerAniEl.isCallbackFunDo = false;
                                    thisPerAniEl.addEventListener("transitionend", PerAniElAniCallBackFun);
                                    thisPerAniEl.addEventListener('webkitTransitionEnd', PerAniElAniCallBackFun);
                                    thisPerAniEl.style[styleType] = toVal;
                                }
                            }
                        } else {
                            console.error("Per.js: animation's parameter val should be string, and time should be number!");
                        }
                    }
                }
            }
        }
        Per.animation = window.Per.fn.prototype.animation;
    });
    /**
     * Per.sel模块用于更方便的选取DOM
     * @since 3.0
     */
    per.joinModule("Per.sel", versions, function() {
        window.Per.fn.prototype.sel = {
            select: function(el) {
                if (el.indexOf("!") == -1) {
                    var beforeEl = document.querySelector(el);
                } else {
                    var beforeFalseSign = el.substr(0, el.indexOf("!")),
                        afterFalseSign = el.substr(el.indexOf("!") + 1, el.length - (el.indexOf("!") + 1)),
                        beforeEl = document.querySelector(beforeFalseSign),
                        afterElList = document.querySelectorAll(afterFalseSign);
                    for (var i = 0, len = afterElList.length; i < len; i++) {
                        if (afterElList[i] == beforeEl) {
                            return null;
                        }
                    }
                }
                return beforeEl;
            },
            selectAll: function(el) {
                if (el.indexOf("!") == -1) {
                    var newElList = document.querySelectorAll(el);
                } else {
                    var beforeFalseSign = el.substr(0, el.indexOf("!")),
                        afterFalseSign = el.substr(el.indexOf("!") + 1, el.length - (el.indexOf("!") + 1)),
                        beforeElList = document.querySelectorAll(beforeFalseSign),
                        afterElList = document.querySelectorAll(afterFalseSign),
                        newElList = new Array(),
                        isThisElNeedRemove;
                    for (var i = 0, len = beforeElList.length; i < len; i++) {
                        isThisElNeedRemove = false;
                        for (var a = 0, len2 = afterElList.length; a < len2; a++) {
                            if (beforeElList[i] == afterElList[a]) {
                                isThisElNeedRemove = true;
                                break;
                            }
                        }
                        if (!isThisElNeedRemove) {
                            newElList.push(beforeElList[i]);
                        }
                    }
                }
                return newElList;
            }
        }
        Per.sel = window.Per.fn.prototype.sel;
    });
    per.joinModule("Per.cookie", versions, function() {
        window.Per.fn.prototype.cookie = {
            set: function(name, value, expiredays, path) {
                document.cookie = name + "=" + value + "; expires=" + expiredays + "; path=" + path;
            },
            get: function(name) {
                var cookieList = document.cookie.split(";");
                for (var i = 0, len = cookieList.length; i < len; i++) {
                    var cookieThisCookieArr = cookieList[i].split("=");
                    if (cookieThisCookieArr[0].replace(/ /g, "") == name) {
                        return cookieThisCookieArr[1];
                    }
                }
                return null;
            },
            remove: function(name, path) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = Per.cookie.get(name);
                if (cval != null)
                    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=" + path;
            }
        }
        Per.cookie = window.Per.fn.prototype.cookie;
    })
})(window, document);
