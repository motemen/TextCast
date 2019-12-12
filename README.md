TextCast
========

An app which overlays any texts on desktop. Built with Electron.

Flags
-----

* `--no-banner`
  * Do not show version/URL on startup.
* `--port=4140`
  * Port to listen on.
* `--style={style}`
  * Text styles. eg. `font-size: 30px; color: green`

API
---

### `POST /post`

Adds new text on screen.

Content-Type can be `application/x-www-form-urlencoded` or `application/json`.

Parameters:
  * `text`: Text to show

### `PUT /stream`

Adds new texts on screen, line by line.

### `POST /clear`

Clears all texts.
