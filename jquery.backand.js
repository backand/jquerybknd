/***********************************************
 * backand JavaScript Library
 * Authors: backand
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Compiled At: 07/21/2015
 ***********************************************/
backand.options.ajax.json = function (url, data, verb, successCallback, errorCallback, forToken) {
    $.ajax({
        url: url,
        async: false,
        type: verb,
        beforeSend: function (xhr) {
            if (!forToken)
                xhr.setRequestHeader('Authorization', backand.security.authentication.token);
        },
        data: data,
        dataType: 'json',
        cache: false,
        error: function (xhr, textStatus, err) {
            if (errorCallback) errorCallback(xhr, textStatus, err);
        },
        success: function (data, textStatus, xhr) {
            if (successCallback) successCallback(data, textStatus, xhr);
        }
    });
};