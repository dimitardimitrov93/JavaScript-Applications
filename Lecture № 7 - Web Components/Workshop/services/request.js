export const request = async (url, method, body) => {
    let options = method === 'POST' || method === 'PATCH' ? { method, body } : { method };

    const res = await fetch(url, options);

    const data = await res.json();

    return data;
}