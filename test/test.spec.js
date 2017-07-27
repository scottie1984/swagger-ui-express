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
    this.timeout(30000);
    phantom.create()
      .then(function(instance) {
        phInstance = instance;
        return instance.createPage();
      })
      .then(function(page) {
        sitepage = page;
        return page.open('http://localhost:3001/api-docs/');
      })
      .then(function(status) {
        setTimeout(function() {
          assert.equal('success', status);
          done();
        }, 100);
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('should contain the expected elements on the page', function(done) {
    sitepage.property('title')
      .then(function(title) {
        assert.equal('Swagger UI', title);
        return sitepage.evaluate(function() {
          return document.querySelector('.swagger-ui').innerHTML;
        });
      })
      .then(function(html) {
        assert.ok(html);
        assert.notEqual(html.indexOf('id="operations-/test-index"'), -1);
        assert.notEqual(html.indexOf('id="operations-/test-impossible"'), -1);
        done();
      })
      .catch(function(err) {
        done(err);
      });
	});

  it('should have API Documentation hosted at /api-docs-from-url', function(done) {
    sitepage.open('http://localhost:3001/api-docs-from-url/')
      .then(function(status) {
        setTimeout(function() {
          assert.equal('success', status);
          done();
        }, 100);
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('should contain the expected elements on the page', function(done) {
    sitepage.property('title')
      .then(function(title) {
        assert.equal('Swagger UI', title);
        return sitepage.evaluate(function() {
          return document.querySelector('.swagger-ui').innerHTML;
        });
      })
      .then(function(html) {
        assert.ok(html);
        assert.notEqual(html.indexOf('id="operations-/test-index"'), -1);
        assert.notEqual(html.indexOf('id="operations-/test-impossible"'), -1);
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });
});
