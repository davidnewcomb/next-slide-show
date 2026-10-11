# Next Slide Show

Web based slide show which allows clients to resize, rotate, source images and remember client viewport of pciture.

## Tech stack

JavaScript, NextJS 14.1, React 18, Bootstrap 5.3

## Configuraton File

A slide show configuration (json) file describes how to display the images in this folder. It's name is in the format cfg-*.json.

{
    "cfg": {                                // Initial configurataion in some cases used to build "list" attribute
        "from": 161,
        "to": 1,
        "padding": 0,
        "pattern": "",
        "dir": "/path/to/img-folder"        // Path to folder where this cfg file is
    },
    "list": [                                // One entry per file in folder
        {
            "src": "Red-Arrows-12-001.jpg",  // Filename
            "fav": true                      // Is in the favourites sub-list
            "inc": false,                    // Include in slideshow
            "cfg": {                         // Configuration of picture
                "style": false,              // false is no style on picture, true is picture is forced to be width of screen
                "widthPercent": 100,         // Magification
                "rotate": 270,               // Rotation
                "scroll": {                  // Client widnow scroll
                    "t": 0,                  // css top
                    "l": 0                   // css left
                }
            }
        }
    ]
    "admin": {
        "version": 3,                           // version of file
        "updated": "2025-07-21T00:55:10.554Z",  // updated time
        "created": "2025-07-20T04:07:38.135Z",  // created time
        "filename": "/path/to/img-folder/cfg-red-arrows-01.json"  // This configurations absolute folder
    }
}

## Usage

User is presnted with a screen to load a configuration file.
Each file is represented according to the list item configuration. There is a control panel on the slide show page to change these values.
Rotation and magnification happen in the browser with css. The server only ever serves the original file untouched (`/api/img/<name>?dir=<folder>`), nothing is generated or cached next to the images.
The image is measured when it loads and then rotated about its centre inside a wrapper sized to the rotated bounding box, so the page scrolls as if the file itself had been transformed and the saved scroll position still lines up.
Stored rotation is anti-clockwise (as jimp used to apply it server side), so the angle is negated for css, which turns clockwise. Old cfg files therefore look the same as before.


