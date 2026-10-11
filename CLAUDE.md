# Next Slide Show

Web based slide show which allows clients to resize, rotate, source images and remember client viewport of pciture.

## Tech stack

JavaScript, NextJS 14.1, React 18, Bootstrap 5.3, Jimp 0.22

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
When the user increases the size of the image via shortcuts or clicking the source image is resize and reloaded. This new file is held in a cache file next to the original file with a suffix which describe those settings eg. red-arrow-01-12.jpg-w100-270 is red-arrow-01-12.jpg rotated 270 degress.


