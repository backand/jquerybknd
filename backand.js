/***********************************************
 * backand JavaScript Library
 * Authors: backand
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Compiled At: 07/21/2015
 ***********************************************/
var backand = {
    /* initiate app and user security tokens */
    options: {
        url: 'https://api.backand.com:8080',
        version: '1',
        getUrl: function (apiUrl) {
            return this.url + '/' + this.version + apiUrl;
        },
        getQueryString: function(){
            return window.location.href.slice(window.location.href.indexOf('?') + 1);
        },
        objectToQueryString: function (obj) {
            var str = [];
            for (var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        /* general ajax call for backand rest api */
        ajax: {
            json: function (url, data, verb, successCallback, erroCallback) {

            },
            file: function (url, data, verb, successCallback, erroCallback) {

            }
        },
        verbs: { get: "GET", put: "PUT", post: "POST", delete: "DELETE" }
    },
    security: {
        authentication: {
            url: "/token",
            token: null,
            onlogin: null,
            addLoginEvent: function (appname) {
                if (backand.security.authentication.onlogin !== null) return;
                // Create the event
                if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                    backand.security.authentication.onlogin = document.createEvent("CustomEvent");
                    backand.security.authentication.onlogin.initCustomEvent('onlogin', false, false, { "appname": appname });
                }
                else {
                    backand.security.authentication.onlogin = new CustomEvent("onlogin", { "appname": appname });
                }
            },
            login: function (username, password, appname, successCallback, errorCallback) {
                backand.security.authentication.addLoginEvent();
                backand.options.ajax.json(backand.options.url + backand.security.authentication.url, { grant_type: "password", username: username, password: password, appname: appname }, backand.options.verbs.post, function (data) {
                        backand.security.authentication.token = data.token_type + " " + data.access_token;
                        document.dispatchEvent(backand.security.authentication.onlogin);
                        backand.loadTables();
                        if (successCallback) successCallback(data);
                    },
                    function (xhr, textStatus, err) {
                        if (errorCallback && xhr) errorCallback(xhr, textStatus, err)
                    },
                    true);
            }
        }
    },
    api: {
        /* table is the object the contains the information about a database table or table */
        table: {
            config: {
                url: '/table/config/',
                /* get the configuration information of the table such as table name, columns names and columns types */
                getItem: function (name, successCallback, errorCallback) {
                    var url = backand.options.getUrl(backand.api.table.config.url + name);
                    backand.options.ajax.json(url, null, backand.options.verbs.get, successCallback, errorCallback);
                },
                getList: function (withSelectOptions, pageNumber, pageSize, filter, sort, search, successCallback, errorCallback) {
                    var url = backand.options.getUrl(backand.api.table.config.url);
                    var data = {
                        withSelectOptions: withSelectOptions,
                        pageNumber: pageNumber,
                        pageSize: pageSize,
                        filter: JSON.stringify(filter),
                        sort: JSON.stringify(sort),
                        search: search
                    };
                    backand.options.ajax.json(url, data, backand.options.verbs.get, successCallback, errorCallback);

                }
            },
            /* get the table data */
            data: {
                url: '/objects/',
                /* get a single row by the primary key (id) */
                getItem: function (name, id, deep, successCallback, errorCallback) {
                    var url = backand.options.getUrl(backand.api.table.data.url + name + '/' + id);
                    var data = { deep: deep };
                    backand.options.ajax.json(url, data, backand.options.verbs.get, successCallback, errorCallback);
                },
                /* get a list of rows with optional filter, sort and page */
                getList: function (name, withSelectOptions, withFilterOptions, pageNumber, pageSize, filter, sort, search, deep, successCallback, errorCallback) {
                    var url = backand.options.getUrl(backand.api.table.data.url + name);
                    var data = { withSelectOptions: withSelectOptions, withFilterOptions: withFilterOptions, pageNumber: pageNumber, pageSize: pageSize, filter: JSON.stringify(filter), sort: JSON.stringify(sort), search: search, deep: deep };
                    backand.options.ajax.json(url, data, backand.options.verbs.get, successCallback, errorCallback);

                },
                createItem: function (name, data, successCallback, errorCallback, params) {
                    var url = backand.options.getUrl(backand.api.table.data.url + name);
                    if (params)
                        url += '?' + backand.options.objectToQueryString(params);
                    backand.options.ajax.json(url, data, backand.options.verbs.post, successCallback, errorCallback);
                },
                updateItem: function (name, id, data, successCallback, errorCallback, params) {
                    var url = backand.options.getUrl(backand.api.table.data.url + name + '/' + id);
                    if (params)
                        url += '?' + backand.options.objectToQueryString(params);
                    backand.options.ajax.json(url, data, backand.options.verbs.put, successCallback, errorCallback);
                },
                deleteItem: function (name, id, successCallback, errorCallback) {
                    var url = backand.options.getUrl(backand.api.table.data.url + name + '/' + id);
                    backand.options.ajax.json(url, null, backand.options.verbs.delete, successCallback, errorCallback);
                },
                autoComplete: function (tableName, fieldName, data, successCallback, errorCallback) {
                    var url = backand.options.getUrl(backand.api.table.data.url + "autocomplete/" + tableName + '/' + fieldName);
                    backand.options.ajax.json(url, data, backand.options.verbs.get, successCallback, errorCallback);
                },
                selectOptions: function (tableName, fieldName, successCallback, errorCallback) {
                    var url = backand.options.getUrl(backand.api.table.data.url + "selectOptions/" + tableName + '/' + fieldName);
                    backand.options.ajax.json(url, null, backand.options.verbs.get, successCallback, errorCallback);
                }
            }
        }
    },
    filter: {
        item: function (fieldName, operator, value) {
            this.fieldName = fieldName;
            this.operator = operator;
            this.value = value;
        },
        operator: {
            numeric: { equals: "equals", notEquals: "notEquals", greaterThan: "greaterThan", greaterThanOrEqualsTo: "greaterThanOrEqualsTo", lessThan: "lessThan", lessThanOrEqualsTo: "lessThanOrEqualsTo", empty: "empty", notEmpty: "notEmpty" },
            date: { equals: "equals", notEquals: "notEquals", greaterThan: "greaterThan", greaterThanOrEqualsTo: "greaterThanOrEqualsTo", lessThan: "lessThan", lessThanOrEqualsTo: "lessThanOrEqualsTo", empty: "empty", notEmpty: "notEmpty" },
            text: { equals: "equals", notEquals: "notEquals", startsWith: "startsWith", endsWith: "endsWith", contains: "contains", notContains: "notContains", empty: "empty", notEmpty: "notEmpty" },
            boolean: { equals: "equals" },
            relation: { in: "in" }
        }
    },
    field:{
        type: {
            ShortText: "ShortText",
            LongText: "LongText",
            Image: "Image",
            Url: "Url",
            Numeric: "Numeric",
            Boolean: "Boolean",
            DateTime: "DateTime",
            SingleSelect: "SingleSelect",
            MultiSelect: "MultiSelect"
        },
        displayFormat: {
            ShortText: { Email: "Email", Password: "Password", SSN: "SSN", Phone: "Phone" },
            LongText: { MultiLines: "MultiLines", MultiLinesEditor: "MultiLinesEditor", SingleLine: "SingleLine", Html: "Html" },
            Image: { Crop: "Crop", Fit: "Fit" },
            Url: { Hyperlink: "Hyperlink", ButtonLink: "ButtonLink" },
            Numeric: { GeneralNumeric: "GeneralNumeric", Currency: "Currency", NumberWithSeparator: "NumberWithSeparator", Percentage: "Percentage" },
            Boolean: {},
            DateTime: { Date_mm_dd: "Date_mm_dd", Date_dd_mm: "Date_dd_mm", Date_mm_dd_12: "Date_mm_dd_12", Date_dd_mm_12: "Date_dd_mm_12", Date_mm_dd_24: "Date_mm_dd_24", Date_dd_mm_24: "Date_dd_mm_24", Date_Custom: "Date_Custom" },
            SingleSelect: { DropDown: "DropDown", AutoCompleteStratWith: "AutoCompleteStratWith", AutoCompleteMatchAny: "AutoCompleteMatchAny" },
            MultiSelect: { Checklist: "Checklist", SubGrid: "SubGrid" }
        }
    },
    sort: {
        item: function (fieldName, order) {
            this.fieldName = fieldName;
            this.order = order;
        },
        order: { asc: "asc", desc: "desc" }

    },
    table: function (name, cacheConfig) {
        this.name = name;
        this.cacheConfig = cacheConfig;
    },

    loadTables: function () {
        backand.model = [];

        var filterItem = new backand.filter.item("SystemView", backand.filter.operator.boolean.equals, false);
        var filter = [filterItem];

        var sortItem = new backand.sort.item("captionText", backand.sort.order.asc);

        var sort = [sortItem];

        backand.api.table.config.getList(null, null, 1000, filter, sort, null, function (data) {
                for (var i = 0; i < data.data.length; i++) {
                    var name = data.data[i].name;
                    backand.model[name] = new backand.table(name, true);
                    backand.model.push(backand.model[name]);
                }
                setReadonlyArray(backand.model);
            },
            function (xhr) { throw new Error(JSON.stringify(xhr)); });
    }


};


backand.filter.item.prototype.constructor = backand.filter.item;

backand.filter.item.prototype.fieldName = function () {
    return this.fieldName;
};

backand.filter.item.prototype.operator = function () {
    return this.operator;
};

backand.filter.item.prototype.value = function () {
    return this.value;
};


backand.sort.item.prototype.constructor = backand.sort.item;

backand.sort.item.prototype.fieldName = function () {
    return this.fieldName;
};

backand.sort.item.prototype.order = function () {
    return this.order;
};



//orm
backand.table.prototype.constructor = backand.table;

backand.table.prototype.name = function () {
    return this.name;
};

backand.table.prototype.cacheConfig = function () {
    return this.cacheConfig;
};

backand.table.prototype.get = function (id, deep, successCallback, errorCallback) {
    backand.api.table.data.getItem(this.name, id, deep, successCallback, errorCallback);
};
backand.table.prototype.getList = function (pageNumber, pageSize, filter, sort, search, deep, successCallback, errorCallback) {
    if (filter && filter.constructor !== Array)
        filter = [filter];
    if (sort && sort.constructor !== Array)
        sort = [sort];
    if (deep === null || deep === undefined)
        deep = true;
    backand.api.table.data.getList(this.name, false, false, pageNumber, pageSize, filter, sort, search, deep, successCallback, errorCallback);
};
backand.table.prototype.create = function (data, successCallback, errorCallback) {
    backand.api.table.data.createItem(this.name, JSON.stringify(data), successCallback, errorCallback, { returnObject: true });
};
backand.table.prototype.update = function (id, data, successCallback, errorCallback) {
    backand.api.table.data.updateItem(this.name, id, JSON.stringify(data), successCallback, errorCallback, { returnObject: true });
};
backand.table.prototype.delete = function (id, successCallback, errorCallback) {
    backand.api.table.data.deleteItem(this.name, id, successCallback, errorCallback);
};

function setReadonlyArray(array) {
    array.copyWithin = undefined;
    array.fill = undefined;
    array.push = undefined;
    array.pop = undefined;
    array.slice = undefined;
    array.splice = undefined;
    array.reverse = undefined;
    array.shift = undefined;
    array.unshift = undefined;
    array.sort = undefined;
}






