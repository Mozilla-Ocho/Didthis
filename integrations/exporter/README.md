# Exporter

## local usage (e.g. for iterating on templates)

Need to perform an initial export, but can skip upload to cloud. Then, can run the file watcher to re-render the export on changes to templates and assets.

Replace `$USER_ID` with the user ID of the user you want to export for (e.g. your local user ID).

```
export USER_ID=o7Cs2WgbbQQem9m6ho26rgXEqUk2
yarn dev:cli export --skip-upload $USER_ID
yarn watch:render $USER_ID
```

You should see output which includes `export directory` - that log message includes the path to the exported files. You can open the exported files in a browser to view them.
