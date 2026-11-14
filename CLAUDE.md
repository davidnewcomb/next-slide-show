# NextJs / ReactJs Slide Show

Web site which starts with a "Load" page. The load page gets an absolute
file path from the user. The file is a slide show configuration file
which displays a series of files in a particular way.

Currently the slideshow only works with images but I hope to expand to render video files with similar rules.

## Display modes

Each image file can be displayed in 2 modes: stretched so the image is 100% of the page width or no zooming.
When images are not stretched they are can be zoomed in to.
Clicking on the image switches between these modes.

## Image Control Panel

This panel lets you manipulate the image view and hop around the series.
The view of the image can be rotated, scaled or the viewport may be changed.

### Duplication

A referrence to an file may be duplicated so that it may have different settings.

## Save

All the changes are kept at the front end until the user want to save them.
Auto save coming soon.
