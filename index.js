"use strict";
// Copyright 2015 StackHut Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let request = require('request');
let reflect = require('harmony-reflect');
let uuid = require('node-uuid');

class SHError {
    constructor(code, msg, data) {
        this.code = code;
        this.msg = msg;
        this.data = typeof data !== 'undefined' ? data : {};
    };
}

module.exports.SHError = SHError;

module.exports.SHAuth = class {
    constructor(user, hash, token) {
        this.user = user;
        this.hash = hash;
        this.token = token;
    };

    msg() {
        if(this.hash != null) {
            return { user: this.user, hash: this.hash }
        } else {
            return { user: this.user, token: this.token }
        }
    };
};


// Internal Service object, is wrapper with a proxy
class _SHService {
    constructor(author, name, version, auth, host) {
        this.version = typeof version !== 'undefined' ? version : "latest";
        this.auth = typeof auth !== 'undefined' ? auth : null;
        this.host = typeof host !== 'undefined' ? host : 'https://api.stackhut.com/run';
        this.service_short_name = `${author}/${name}:${this.version}`
    };

    _make_call(iface, method, params) {
        // create the SH json-rpc obj
        let msg = {
            service: this.service_short_name,
            id: uuid.v4(),
            request: {
                method: `${iface}.${method}`,
                params: params,
                jsonrpc: '2.0',
                id: uuid.v4()
            }
        };
        // add optional auth
        if (this.auth !== null) {
            msg['auth'] = this.auth.msg();
        }

        console.log(msg);
        // make request and convert result into a promise
        return new Promise(function (resolve, reject) {
            request({
                    url: url,
                    method: 'POST',
                    body: msg,
                    json: true
                },
                function (error, response, body) {
                    // TODO - copy python client logic for now
                    if (response.statusCode == 200 && 'result' in body) {
                        resolve(body.result);
                    } else if (response.statusCode != 200 && 'error' in body) {
                        reject(new SHError(body.error.code, body.error.msg, body.error.data));
                    } else {
                        reject(new SHError(-32000, `HTTP Response code ${response.statusCode}`, { error: error }));
                    }
                }
            )
        })
    };
}

module.exports.SHService = function(author, name, version, auth, host) {
    // traps
    let handler = {
        get: function(target, iface_name){
            return new Proxy({}, {
                get: function(_, method_name) {
                    return function(...params) {
                        console.log(target)
                        console.log(`calling ${iface_name}.${method_name}(${params})`)
                        target._make_call(iface_name, method_name, params)
                    }
                }
            });
        }
    };
    let shAuth = new _SHService(author, name, version, auth, host);
    return new Proxy(shAuth, handler)
};
