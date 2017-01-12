var assert = require('assert');
var app = require('./testapp/app');
var http = require('http');
var phantom = require('phantom');
require('es6-shim');

describe('integration', function() {
  var server;
  var sitepage = null;
	var phInstance = null;

  before(function(done) {
		app.set('port', 3001);

		server = app.listen(app.get('port'), function() {
			done();
		});
	});

  after(function() {
		server.close();
		sitepage.close();
		phInstance.exit();
	});

	it('should have API Documentation hosted at /api-docs', function(done) {
    phantom.create()
      .then(function(instance) {
        phInstance = instance;
        return instance.createPage();
      })
      .then(function(page) {
        sitepage = page;
        return page.open('http://localhost:3001/api-docs/#//test');
      })
      .then(function(status) {
        setTimeout(function() {
          assert.equal('success', status);
          done();
        }, 100);
      });
  });

  it('should contain the expected elements on the page', function(done) {
    sitepage.property('title')
      .then(function(title) {
        assert.equal('Swagger UI', title);
        return sitepage.evaluate(function() {
          return document.querySelector('#resource_\\/test').innerHTML;
        });
      })
      .then(function(html) {
        assert.ok(html);
        assert.ok(html.indexOf('id="/test_index"'));
        assert.ok(html.indexOf('id="/test_impossible"'));
        done();
      });
	});
});
