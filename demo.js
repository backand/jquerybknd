/***********************************************
 * backand JavaScript Library
 * Authors: backand
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Compiled At: 07/21/2015
 ***********************************************/
$(function () {

    // init backand url
    backand.options.url = "https://api.backand.com:8080";

    var outputElement = null;

    var successCallback = function (data) {
        outputElement.text('');
        outputElement.removeClass('alert-danger');
        outputElement.addClass('alert-success');
        if (data)
            outputElement.text(JSON.stringify(data));
        else
            outputElement.text("success");
    };
    var errorCallback = function (error) {
        outputElement.text('');
        outputElement.removeClass('alert-success');
        outputElement.addClass('alert-danger');
        if (error) {
            if (error.responseJSON && error.responseJSON.error_description) {
                outputElement.text(error.responseJSON.error_description);
            }
            else if (error.responseText) {
                outputElement.text(error.responseText);

            }
            else {
                outputElement.text("error");
            }
        }
        else {
            outputElement.text("error");
        }
    };

    var lastCreatedId = null;

    // LOGIN
    $('#oauth2 button').click(function () {
        outputElement = $('#oauth2 .output');

        var username = $('input[name=username]').val();
        var password = $('input[name=password]').val();
        var appname = $('input[name=appname]').val();

        backand.security.authentication.login(username, password, appname, successCallback, errorCallback);
    });


    //CRUD
    //CRUD-READ
    $('#crud #readMultiFilter button').click(function () {
        if (!backand.model) {
            alert("please login before using backand");
            return;
        }


        outputElement = $(this).parents('.row:first').find('.output');

        var pageNumber = 1;
        var pageSize = 10;
        var filter = [{ fieldName: "First_Name", operator: backand.filter.operator.text.startsWith, value: "Nir" }, { fieldName: "Last_Name", operator: backand.filter.operator.text.contains, value: "k" }];
        var sort = [{ fieldName: "Last_Name", order: "desc" }, { fieldName: "First_Name", order: "desc" }];
        var search = null;
        var deep = true;

        backand.model.Employees.getList(pageNumber, pageSize, filter, sort, search, deep, successCallback, errorCallback);
    });
    $('#crud #readSingleFilter button').click(function () {
        if (!backand.model) {
            alert("please login before using backand");
            return;
        }


        outputElement = $(this).parents('.row:first').find('.output');

        var pageNumber = 1;
        var pageSize = 10;
        var filter = { fieldName: "First_Name", operator: backand.filter.operator.text.equals, value: "Nir" };
        var sort = { fieldName: "Last_Name", order: "desc" };
        var search = null;
        var deep = true;

        backand.model.Employees.getList(pageNumber, pageSize, filter, sort, search, deep, successCallback, errorCallback);
    });

    $('#crud #readById button').click(function () {
        if (!backand.model) {
            alert("please login before using backand");
            return;
        }


        outputElement = $(this).parents('.row:first').find('.output');


        backand.model.Employees.get(lastCreatedId ? lastCreatedId : 20, false, successCallback, errorCallback);
    });

    //CRUD-READ
    $('#crud #create button').click(function () {
        if (!backand.model) {
            alert("please login before using backand");
            return;
        }

        outputElement = $(this).parents('.row:first').find('.output');

        var employee = { "First_Name": "Nir", "Last_Name": "Kaufman" };

        backand.model.Employees.create(employee, function (data) {
            lastCreatedId = data.__metadata.id;
            successCallback(data);
        }, errorCallback);
    });

    //CRUD-UPDATE
    $('#crud #update button').click(function () {
        if (!backand.model) {
            alert("please login before using backand");
            return;
        }
        if (!lastCreatedId) {
            alert("please create before update");
            return;
        }


        outputElement = $(this).parents('.row:first').find('.output');

        var id = lastCreatedId;
        var employee = { "First_Name": "Nir2", "Last_Name": "Kaufman2" };

        backand.model.Employees.update(id, employee, successCallback, errorCallback);
    });

    //CRUD-DELETE
    $('#crud #delete button').click(function () {
        if (!backand.model) {
            alert("please login before using backand");
            return;
        }
        if (!lastCreatedId) {
            alert("please create before delete");
            return;
        }


        outputElement = $(this).parents('.row:first').find('.output');

        var id = lastCreatedId;

        backand.model.Employees.delete(id, successCallback, errorCallback);
    });


    //BUSINESS RULES
    $('#bl button').click(function () {
        alert("This action is limited to an admin role.");
    });

});