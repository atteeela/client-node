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
let url = "https://api.stackhut.com/run";

module.exports.req_id = null;
module.exports.root_dir = __dirname;

module.exports.SHError = class {
    constructor(code, msg, data) {
        this.code = code;
        this.msg = msg;
        this.data = typeof data !== 'undefined' ? data : {};
    };
};

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



module.exports.SHService = class {
    constructor(author, name, version, auth, host) {
        this.version = typeof version !== 'undefined' ? version : "latest";
        this.auth = typeof auth !== 'undefined' ? auth : null;
        this.host = typeof host !== 'undefined' ? host : 'https://api.stackhut.com/run';
        this.service_short_name = `${author}/${name}:${this.version}`
    };

    _make_call(iface, method, ...params) {
        // create the SH json-rpc obj
        let msg = {
            service: this.service_short_name,
            id: new_id(),
            request: {
                method: `${iface}.${method}`,
                params: params,
                jsonrpc: '2.0',
                id: id_val
            }
        };

        if auth:
            msg['auth'] = this.auth.msg()


        return new Promise(function (resolve, reject) {
            request({
                    url: url,
                    method: 'POST',
                    body: msg,
                    json: true
                },
                function (error, response, body) {
                    if (!error && response.statusCode >= 200 && response.statusCode < 300) {
                        if ('result' in body) {
                            resolve(body['result']);
                        } else {
                            reject(body['error'])
                        }
                    } else {
                        reject('error: ' + response.statusCode + error)
                    }
                }
            )
        })
    };
};

// stackhut library functions
module.exports.get_stackhut_user = function() {
    return make_call('get_stackhut_user')
};
