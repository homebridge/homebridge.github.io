# Building the site locally

This is an [Angular](https://angular.dev) application. The markdown pages live in `src/docs`, and the reference data (HAP services, characteristics and categories; Matter device types) is generated from Homebridge's own packages.

## Development server

```
npm start
```

Then open http://localhost:4200/. The app reloads automatically when a source file changes.

Note that the markdown pages are fetched over HTTP, so after editing a `.md` file you may need a hard reload in the browser to get past its cache.

## Regenerating the reference data

```
npm run gen
```

This rebuilds:

- `src/assets/services.json`, `characteristics.json` and `categories.json` from `@homebridge/hap-nodejs`
- `src/assets/matter-device-types.json` and `src/docs/api/matter-clusters.md` from `homebridge`
- `src/sitemap.txt`

Run it after bumping either of those two packages, and commit the results.

## Production build

```
npm run build
```

The build artifacts are written to `dist/`.

## Linting

```
npm run lint
```
