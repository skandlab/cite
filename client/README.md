# Testing

1. start mock server

    `node __mockEndpoints__.js`

2. Modify axios.defaults.baseURL in utils/backendRequests.tsx

    example if the mockserver starts in "http://localhost:5000"
    change axios.defaults.baseURL to "http://localhost:5000/server"

3. Run tests

    `npm run test`
