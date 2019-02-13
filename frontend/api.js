const BACKEND_URL = "https://syar2tbuna.execute-api.us-east-1.amazonaws.com/"
const DATA_ENDPOINT = "dev/data"

function getData() {
    return fetch(`${BACKEND_URL}${DATA_ENDPOINT}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            } throw new Error(response.statusText)
        })
        .catch(error => { throw new Error(error.message) });
}

function storeData(data) {
    return fetch(`${BACKEND_URL}${DATA_ENDPOINT}`,
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            } throw new Error(response.statusText)
        })
        .catch(error => { throw new Error(error.message) });
}