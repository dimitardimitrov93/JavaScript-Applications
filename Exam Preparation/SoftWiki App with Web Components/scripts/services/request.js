const request = async (method, url, body) => {
    let options = method === 'POST' || method === 'PATCH' ? { method, headers: { 'content-type': 'application/json' }, body } : { method };

    const res = await fetch(url, options);

    const data = await res.json();

    return data;
}

export default {
    get: request.bind(this, 'GET'),
    post: request.bind(this, 'POST'),
    put: request.bind(this, 'PUT'),
    patch: request.bind(this, 'PATCH'),
    delete: request.bind(this, 'DELETE'),
}