const request = async (method, url, body) => {
    let options = method === 'POST' || method === 'PATCH' ? { method, headers: {'content-type': 'application/json'}, body } : { method };

    const res = await fetch(url, options);
    const data = await res.json();

    return data;
}

export default {
    get: request.bind('GET'),
    post: request.bind('POST'),
    put: request.bind('PUT'),
    patch: request.bind('PATCH'),
    delete: request.bind('DELETE'),
}