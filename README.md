# bookmarks

Websites worth keeping. Each one is an issue in this repo. A workflow turns
them into [`api.json`](api.json), which
[bhaumikmistry.com/website-bookmarks](https://www.bhaumikmistry.com/website-bookmarks)
reads directly, so adding a bookmark needs no deploy.

## Adding one

Open an issue. The title is the name, the first line of the body is the URL,
and an optional second line is the description.

```
Title:  Aashna Doshi

Body:   https://www.aashnadoshi.com
        Software Engineer @ Google | Podcast Host | Creator
```

Then close it. Closing changes nothing about how it displays, it just keeps the
issue list quiet. Both open and closed issues show on the site.

To remove a bookmark, delete the issue.

## Why closing does nothing here

The sibling repo [reads](https://github.com/bhaumikmistry/reads) uses the same
shape, but there an open issue means to-read and a closed one means read. A
bookmark has no such state, so state is ignored.

## api.json

Regenerated on every issue opened, closed, reopened, edited, or commented on.

```json
[
  {
    "id": 1,
    "title": "Aashna Doshi",
    "url": "https://www.aashnadoshi.com",
    "description": "Software Engineer @ Google | Podcast Host | Creator",
    "createdAt": "2026-08-11T00:00:00Z"
  }
]
```

An issue whose body does not start with `http://` or `https://` gets an empty
`url` rather than being dropped, so a malformed entry is visible instead of
silently missing.
