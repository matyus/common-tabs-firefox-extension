# Common tabs

Open some tabs in Firefox

## Getting started

### API Keys for Mozilla

https://addons.mozilla.org/en-US/developers/addon/api/key/

### Developer Tools

https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/

## Development

```
make init
```

```
make dev
```

## Publishing

```
export AMO_JWT_ISSUER="user:111111:000"
export AMO_JWT_SECRET="ABC123"
```

```
make sign
```

Dont't forget to version bump the manifest.
