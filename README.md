# Perú News

This project aims to gather headlines from main newspapers webpages from Perú using git actions.

## Modifying the scrapper

You can setup your own headline scrapper by modifying `settings.json`
```json
{
  "out_path": "data",
  "sources": [
    {
      "name": "some_name",
      "url": "https://some_url",
      "selector": "css selector here"
    },
```

- `out_path`: this will be the path where the data is stored.
- `source.name`: for each source, this will become the name of the file (eg: some_name.json).
- `source.selector`: the css selector to get the headlines (SelectorGadget extension in chrome is a nice tool for this).

The scrapper is very simple, for each element the selector obtains, it will try to get the `href` and `text` values to store it in a json file.

The output data will have the format: `{out_path}/YYYYMMDD/{source.name}`.
