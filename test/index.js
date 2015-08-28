let should = require('chai').should(),
    sh_client = require('../index.js');

describe('client', function () {
    it('runs a valid call locally', function() {
        "use strict";
        let client = new sh_client.SHService('mands', 'stackhut');
        client.Default.add(1,2)
        .then(function(res) {
                console.log(res);
                res.should.equal(3);
            });
    });

});
