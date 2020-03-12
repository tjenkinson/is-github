# is-github

A small JavaScript library which checks if the provided IP address belongs to GitHub. Works in Node and the browser.

It uses [GitHub's meta endpoint](https://developer.github.com/v3/meta/) to get the valid IP ranges. The response is cached for the duration GitHub provides in the `Cache-Control` header.

## Usage

```sh
$ npm i is-github
```

or "[https://cdn.jsdelivr.net/npm/is-github@1](https://cdn.jsdelivr.net/npm/is-github@1)".

```js
import { isGitHub } from 'is-github';

if (await isGitHub('1.2.3.4')) {
  console.log('Request came from GitHub!');
} else {
  console.log('Request was not from GitHub.');
}
```

### Options

It is possible to provide the following options in an object as the second argument:

- `service`: The service to check. One of: 'hooks', 'web', 'api', 'git', 'pages', 'importer' (_Default: 'hooks'_)
- `userAgent`: The user agent to use for the request to GitHub. This might not work in the browser. (_Default: 'is-github'_)
- `timeout`: The timeout in ms. (_Default: 5000_)

## Requirements

The following API's are required when running in the browser.

- [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
