# Dump content

Each dump is stored in its own directory with a `metadata.json` file. The directory name and metadata `id` must match. Content is grouped by date under the `body` property.

Create a dump with:

```sh
pnpm create:dump my-project projects
```

Use a comma-separated gallery list when a dump belongs in multiple galleries:

```sh
pnpm create:dump my-project home,projects
```

The command creates the dump directory, validated metadata, and `note1.md`. The first body entry uses the current local date. Replace the generated description, image, dimensions, and content before publishing.

Valid galleries are `home`, `work`, `projects`, and `journal`. Gallery membership lives in each dump's `galleries` field, so no separate import or gallery registry needs updating.

## Markdown

Markdown blocks reference a `.md` file inside the dump directory:

```json
"2025/12/13": [{ "type": "markdown", "src": "day13.md" }]
```

For example, `db/dumps/aoc/day13.md` is referenced as `day13.md` in `db/dumps/aoc/metadata.json`. Nested paths such as `notes/day13.md` are also supported.

- `type`: Must be `"markdown"`.
- `src`: Path to a `.md` file relative to the dump directory.
- `compact`: Optional. Defaults to `true`. Set it to `false` to render the full entry without Show more or Show less controls.

## Images

Image blocks require a source URL, alternative text, and the image's intrinsic dimensions:

```json
{
  "body": {
    "2025/12/13": [
      {
        "type": "image",
        "src": "/aoc/calendar.png",
        "alt": "Advent calendar showing the completed challenges",
        "width": 1600,
        "height": 900,
        "fullWidth": true,
        "caption": "Progress after day 13"
      }
    ]
  }
}
```

For a local image, place the file in `public/<dump-id>/` and use its public path for `src`. For example, `public/aoc/calendar.png` is referenced as `/aoc/calendar.png`. Images are not loaded relative to the dump directory.

- `type`: Must be `"image"`.
- `src`: Public path to the image. Local paths start with `/`.
- `alt`: A useful text alternative. Use an empty string only when the image is decorative.
- `width`: Original image width in pixels.
- `height`: Original image height in pixels.
- `fullWidth`: Optional. Set to `true` to fill the content block width.
- `caption`: Optional text displayed below the image.

## Videos

Video blocks reference a video served from `public/`:

```json
"2025/12/13": [
  {
    "type": "video",
    "src": "/aoc/walkthrough.mp4",
    "title": "Day 13 solution walkthrough",
    "poster": "/aoc/walkthrough-poster.png",
    "caption": "The completed solution"
  }
]
```

For example, `public/aoc/walkthrough.mp4` is referenced as `/aoc/walkthrough.mp4`.

- `type`: Must be `"video"`.
- `src`: Public path to the video. Local paths start with `/`.
- `title`: Optional accessible label displayed above the video.
- `poster`: Optional public path to an image displayed before playback.
- `caption`: Optional text displayed below the video.

A date can contain image, Markdown, and video blocks in the order they should appear:

```json
"2025/12/13": [
  { "type": "markdown", "src": "day13.md" },
  {
    "type": "image",
    "src": "/aoc/calendar.png",
    "alt": "Advent calendar showing the completed challenges",
    "width": 1600,
    "height": 900
  },
  {
    "type": "video",
    "src": "/aoc/walkthrough.mp4",
    "title": "Day 13 solution walkthrough"
  }
]
```
