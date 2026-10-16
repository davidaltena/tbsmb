# The Better SMB · Podcast performance

A free, dependency-free dashboard for **The Better SMB Podcast** and **Better Business Moments**.

Hosted at https://davidaltena.github.io/tbsmb/ using GitHub Pages (main branch, repository root). No build, paid services or server required.

## Current data connection

**Private Spotify and Apple analytics are not connected automatically.** The dashboard supports CSV/TSV imports, column mapping, JSON backups, show/period filters, daily play charts and episode comparisons. Sample mode uses clearly labelled illustrative figures. Real analytics start empty.

Imports are stored only in the current browser's localStorage. They are not uploaded to GitHub. Anyone can open the public dashboard, but they will not see your local imports. Browser storage is not encrypted: people using the same browser profile can view it. Use Export backup to move data between devices or protect against clearing browser data. Sample mode never overwrites imports.

## Add data

1. Export daily analytics from Spotify for Creators, or prepare daily records from Apple Podcasts Connect. Apple listening analytics availability varies; subscription reports are a separate product and are not a general free-show analytics export.
2. Choose **Add your data** and select a CSV/TSV. For raw exports, map the date and value columns, choose the show, source and metric, and optionally map an episode column.
3. Preview and save. Import each metric separately if the source has multiple metric columns. JSON backups restore all metrics together.

Canonical CSV columns:

```csv
date,show,platform,metric,value,episode
```

- `date`: valid YYYY-MM-DD, representing one day; followers use the observation date.
- `show`: `better-smb` or `moments`.
- `platform`: `spotify`, `apple`, or `host`.
- `metric`: `plays`, `downloads`, `followers`, `listeners`, `engaged_listeners`, `consumption`.
- `value`: non-negative number. Counts must be integers. Missing/suppressed data must be omitted; zero means a reported zero.
- `episode`: optional episode title; blank means a show-level record. Use consistent titles across imports/platforms.

`host` supports downloads only. Downloads cannot be assigned to Spotify/Apple. Followers must be show-level snapshots. Consumption percentages are preserved in backups but not aggregated or graphed.

Never import cumulative plays or overlapping period totals as daily counts. The dashboard does not infer daily figures or sum episode counts into show-level unique listeners. To update one record, re-import the same date/show/platform/metric/episode key. For corrections that remove records or rename episodes, clear and re-import a corrected backup after exporting your existing data.

## Metric interpretation

- Spotify and Apple plays remain separate because their definitions differ.
- Host downloads may include Apple/other platforms; they are never added to plays.
- Follows sum latest available snapshots per show and platform within the selected window. They are platform follows, not unique people. Snapshot dates may differ; the data source dates indicate the latest record of any metric. Missing sources mean a partial total.
- Listeners cannot be summed across days as unique people. The optional episode view explicitly reports **listener-days**.
- Charts leave gaps where daily data is absent. When all shows are selected, daily totals include available shows only; incomplete imports give partial totals.
- Periods are anchored to the latest imported reporting date, not today's date. Metrics can be missing within that period.

## Automatic updates

There is no background job, analytics API connection, login flow or scraping in this version. A general Spotify Web API token does not grant Spotify for Creators analytics access. Apple Podcasts Connect listening analytics do not have a general third-party analytics integration. A verified authenticated data source is needed before hands-off updates can be implemented. Do not put account passwords, session cookies, tokens or private analytics files in this public repository.

Official references:
- https://support.spotify.com/au/creators/article/overview-analytics/
- https://developer.spotify.com/documentation/web-api/reference
- https://podcasters.apple.com/support/5392-listener-analytics

## Development

Serve this directory with any static HTTP server (ES modules need HTTP rather than opening index.html directly). Run `npm test` for parser, validation and calculation checks; `npm run check` for JavaScript syntax checks. No package installation is needed.
