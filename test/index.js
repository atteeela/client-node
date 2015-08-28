"use strict";
let expect = require('chai').expect,
    sh_client = require('../index.js');

describe('client', function () {
    it('runs a valid call using SH hosted', function() {
        let client = new sh_client.SHService('stackhut', 'demo-nodejs-persistent');
        return client.Default.add(1, 2).then(function (data) {
            expect(data).to.equal(3);
        });
    });

    //it('runs an invalid call using SH hosted', function() {
    //    let client = new sh_client.SHService('stackhut', 'demo-nodejs-persistent');
    //    return client.Default.add(1, 2).then(function (data) {
    //        expect(data).to.equal(0);
    //    });
    //});

});
