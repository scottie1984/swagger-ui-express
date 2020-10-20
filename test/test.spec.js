const assert = require('assert');
const app = require('./testapp/app');
const puppeteer = require('puppeteer');
require('es6-shim');

describe('integration', function() {
  var server;
	var browser = null;
  var sitepage = null;

  before(function(done) {
		app.set('port', 3001);
		server = app.listen(app.get('port'), function() {
			done();
		});
	});

  after(async function() {
		server.close();
		await sitepage.close();
		await browser.close();
	});

	it('should intialize browser', async function() {
    this.timeout(30000);
    browser = await puppeteer.launch();
    sitepage = await browser.newPage();
  });

	it('should have API Documentation hosted at /api-docs', async function() {
    const httpResponse = await sitepage.goto('http://localhost:3001/api-docs/');
    assert.ok(httpResponse.ok());
  });

  it('should contain the expected elements on the page from /api-docs', async function() {
    await sitepage.waitForSelector('.information-container', { timeout: 2000 });
    assert.equal('Swagger UI', await sitepage.title());
    const html = await sitepage.evaluate(() => document.querySelector('.swagger-ui').innerHTML);
    assert.ok(html);
    assert.notEqual(html.indexOf("id=\"operations-\\/test-index\""), -1);
    assert.notEqual(html.indexOf("id=\"operations-\\/test-impossible\""), -1);
	});

  it('should have API Documentation hosted at /api-docs-from-url', async function() {
    const httpResponse = await sitepage.goto('http://localhost:3001/api-docs-from-url/');
    assert.ok(httpResponse.ok());
  });

  it('should contain the expected elements on the page from /api-docs-from-url', async function() {
    await sitepage.waitForSelector('.information-container', { timeout: 2000 });
    assert.equal('Swagger UI', await sitepage.title());
    const html = await sitepage.evaluate(() => document.querySelector('.swagger-ui').innerHTML);
    assert.ok(html);
// console.log(`**** ${html}`);
    assert.notEqual(html.indexOf("id=\"operations-\\/test-index\""), -1);
    assert.notEqual(html.indexOf("id=\"operations-\\/test-impossible\""), -1);
  });

  it('should have API Documentation hosted at /api-docs-using-object', async function() {
    const httpResponse = await sitepage.goto('http://localhost:3001/api-docs-using-object/');
    assert.ok(httpResponse.ok());
  });

  it('should contain the expected elements on the page for api-docs-using-object', async function() {
    await sitepage.waitForSelector('.information-container', { timeout: 2000 });
    assert.equal('Swagger UI', await sitepage.title());
    const html = await sitepage.evaluate(() => document.querySelector('.swagger-ui').innerHTML);
    assert.ok(html);
    assert.notEqual(html.indexOf("id=\"operations-\\/test-index\""), -1);
    assert.notEqual(html.indexOf("id=\"operations-\\/test-impossible\""), -1);
  });

  it('should have API Documentation hosted at /api-docs-with-null', async function() {
    const httpResponse = await sitepage.goto('http://localhost:3001/api-docs-with-null/');
    assert.ok(httpResponse.ok());
  });

  it('should contain the expected elements on the page for api-docs-with-null', async function() {
    await sitepage.waitForSelector('.information-container', { timeout: 2000 });
    assert.equal('Swagger UI', await sitepage.title());
    const html = await sitepage.evaluate(() => document.querySelector('.swagger-ui').innerHTML);
    assert.ok(html);
    assert.notEqual(html.indexOf("id=\"operations-\\/test-index\""), -1);
    assert.notEqual(html.indexOf("id=\"operations-\\/test-impossible\""), -1);
  });

  it('should not leak package.json', async function() {
    await sitepage.goto('http://localhost:3001/api-docs/package.json');
    const body = await sitepage.evaluate(() => document.querySelector('body').innerText);
    assert.equal('Not Found', body);
  });
});