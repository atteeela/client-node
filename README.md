# StackHut NodeJS/ES6 Client Library

StackHut client library to call dev, local, and hosted StackHut services dynamically and asynchronously from your Node/ES6 code as if it were a local function.

There are 3 main objects in the library,

#### SHService

This is the main library you create per service to communicate with it. It takes several parameters on construction, where those in square brackets are optional:

```js
let service = client.SHService(author, service_name, [service_version], [auth], [host])
```

* author - The author of the service
* service_name - The service name
* version - The specific verion of the service (is `latest` if left blank)
* auth - An `SHAuth` object used to authenticate requests for private services
* host - URL for the StackHut API server, can be set to point to local servers during development, is `https://api.stackhut.com` if left blank

To make a remote call, just call the interface and method name on the service object:

```js
    let result = service.Interface.method(params, ...)
```

#### SHAuth

An optional object used to authenticate requests to a service:

```
let auth = client.SHAuth(user, [hash], [token])
```

* user - Username of a registered StackHut user
* hash - Hash of the user's password (you can find this in ~/.stackhut.cfg). Be careful not to use in public-facing code. 
* token - A valid API token created for the user

One of `hash` or `token` must be present in the `auth` object to authorise a request by the given user.

#### SHError

Returned in the event of a remote service error in the catch block of a rejected promise.

The object has 3 parameters,

* code - The RPC error code
* message - A string describing the error
* data - An optional object that may contain additional structured data for handling the error

## Example

Using the existing service called `demo-nodejs` by user `stackhut`, we create the main service object,

```js
let client = require('stackhut-client')
let s = client.SHService('stackhut', 'web-tools')

```

From here we can call any functions on any interfaces exposed by the hosted `stackhut/demo-nodejs` service, as follows:

```js
let result_p = s.Default.renderWebpage("www.stackhut.com", 1024, 768)
```

The client library is promise-based, so `result_p` either resolves or rejects depending on the service call and parameters. We can code for this as you would any promise:

```js
result_p
.then(function(res) {
    console.log(`Page render at ${result}`)
}).catch(function(err) {
    console.log(err)
})

```

## Requirements

* A modern ES6 implementation that supports ES6 proxies, rest parameters and spread parameters. We used io.js v3 to develop this library with the arguments `--harmony --harmony-proxies`.

