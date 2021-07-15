Canvas Webhook Connector
==============================
**Canvas Webhook Connector** is a simple node server designed to accept external webhooks and convert them into a POST REST request that canvas can utilize.

At present, this works as a bridge between Snipcart and Canvas to automatically create users under a specific course whenever a snipcart transaction is successfully completed.

## Usage
```bash
$ git clone https://github.com/gabehoban/canvas-webhook.git
```
Fill out the required fields in the environment file:
```bash
$ cd canvas-webhook && cp .env.example .env
```
```bash
$ nano .env
```
Register the webhook on snipcart's dashboard as `https://CANVAS_DOMAIN:3000/hook`

Server the program:
```bash
$ node index.js
```

## License 
* see [LICENSE](https://github.com/gabehoban/canvas-webhook/blob/master/LICENSE.md) file
 
