# Website Performance Optimization Portfolio Project

## How to run the sites

* Download the enitre file _stadelmann-website-optimization.
* Open the file _index.html_ in your browser.
* Open the file _views/pizza.html_ in your browser.
* Voila, you're ready to browse through the website: You can have a look at the portfolio of Cameron Pittman.
* You can also check out, what kind of delicious pizzas Cam's Pizzeria has to offer. They come with all kind of ingredients and in all sizes.

**or**

* open https://martinstad.github.io/udacity/stadelmann-website-optimization/index.html in your browser

## How the code was altered in order to improve site speed

**index.html**

### _Images_

* All images were replaced with compressed images through the website _compressor.io_
* In the file _index.html_ the style attribute was added to the img code to determine width and height
* Add alt attributes to images

### _Rendering_

* Order of loading files was changed: The print.css is loading in the end now, after syle.css and after the loading of the font
* It was made sure that these files are loading asynchronously, which had an especially big impact on the sitespeed of the mobile site
* For that `media="none"` and/or  `onload="if(media!='all')media='all'"` was added

**main.js**

### _Frames per Second_
* Get rid of for loop and background noise entirely
* Make sure there is no forced synchronous layout when changing pizza sizes by adjusting _function ChangePizzaSizes_
