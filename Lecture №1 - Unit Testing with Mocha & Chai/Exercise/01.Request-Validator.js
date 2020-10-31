function requestValidator(inputObj) {
    const uriValidationRegEx = /^[0-9A-Za-z\.]+$|\*/;
    const validMethods = ['GET', 'POST', 'DELETE', 'CONNECT'];
    const validVersions = ['HTTP/0.9', 'HTTP/1.0', 'HTTP/1.1', 'HTTP/2.0'];
    const messageValidationRegEx = /^[A-Za-z0-9~!@#\$%\^\*()_\+\-=\[\]\{\};:\|,\.\/\?` ]*$/;

    const isMethodValid = validMethods.includes(inputObj.method);
    const isUriValid = uriValidationRegEx.test(inputObj.uri);
    const isVersionValid = validVersions.includes(inputObj.version);
    const isMessageValid = messageValidationRegEx.test(inputObj.message);

    if (!inputObj.hasOwnProperty('method') || !isMethodValid) {
        invalidPropertyHandler('Method');
    } else if (!inputObj.hasOwnProperty('uri') || !isUriValid) {
        invalidPropertyHandler('URI');
    } else if (!inputObj.hasOwnProperty('version') || !isVersionValid) {
        invalidPropertyHandler('Version');
    } else if (!inputObj.hasOwnProperty('message') || !isMessageValid) {
        invalidPropertyHandler('Message');
    }

    return inputObj;

    function invalidPropertyHandler(invalidProperty) {
        throw new Error(`Invalid request header: Invalid ${invalidProperty}`);
    }
}

requestValidator({
    method: 'GET',
    uri: 'svn.public.catalog',
    version: 'HTTP/1.1',
    message: ''
});

requestValidator({
    method: 'OPTIONS',
    uri: 'git.master',
    version: 'HTTP/1.1',
    message: '-recursive'
});

requestValidator({
    method: 'POST',
    uri: 'home.bash',
    message: 'rm -rf /*'
});