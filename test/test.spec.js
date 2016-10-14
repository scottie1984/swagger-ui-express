var assert = require('assert');
var app = require('./testapp/app');
var http = require('http');
var phantom = require('phantom');

describe('integration', function() {
  var server;
  var sitepage = null;
	var phInstance = null;

  before(function(done) {
		app.set('port', 3001);

		server = http.createServer(app);

		server.listen(app.get('port'), function() {
			done();
		});
	});

  after(function() {
		server.close();
		sitepage.close();
		phInstance.exit();
	});

	it('Get API Documentation hosted at /api-docs', function() {
    return phantom.create()
        .then(instance => {
            phInstance = instance;
            return instance.createPage();
        })
        .then(page => {
            sitepage = page;
            return page.open('http://localhost:3001/api-docs');
        })
        .then(status => sitepage.property('title'))
        .then(content => {
            assert.equal(content, 'Swagger UI');
        })
        .then(() => sitepage.evaluate(function() {
        	return document.getElementById('resource_/test').innerHTML;
				}))
        .then(html => {
            assert.ok(html);
        })
        .then(() => sitepage.evaluate(function() {
					return document.getElementById('/test_index').innerHTML;
				}))
				.then(html => {
						assert.ok(html);
				})
				.then(() => sitepage.evaluate(function() {
					return document.getElementById('/test_impossible').innerHTML;
				}))
				.then(html => {
						assert.ok(html);
				});
	});
});