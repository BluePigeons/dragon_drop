# dragon_drop
## Responsive UI for dynamically generating draggable popups

##Getting Started

Firstly include dependencies in your website - Dragon Drop relies on the latest version of Bootstrap, JQuery and JQuery UI to work.

To include Dragon Drop itself in your website, you need to either:

 - Download latest version of dragon_drop.js and dragon_drop.css and store locally
 - Use Rawgit URL: 
 		https://rawgit.com/BluePigeons/dragon_drop/master/dragondrop.css
 		https://rawgit.com/BluePigeons/dragon_drop/master/dragondrop.js

Add script tag at the bottom of page body and then there are two stages to introduce the dragondrop - initialising settings and adding popups.

##Initialise Settings

To initialises ettings you need to run the function **initialise_dragondrop** that takes two options, parent_id and the_options.
```
initialise_dragondrop(parent_id, the_options);
```

 - **parent_id** - (String) This is the string id name of the element that the Dragon Drop environment is going to run inside.
 - **the_options** - (Object) This is the JSON defined the options.

The options take the format as follows:

```

  {
    "minimise" : Boolean,
    "initialise_min_bar": "min bar parent id",
    "beforemin": "funcname",
    "aftermin": "funcname",
    "beforereopen": "funcname",
    "afterreopen": "funcname",
    "beforeclose": "funcname",
    "afterclose": "funcname"
  }

```
 - **minimise** (Boolean) (default: false) - If true then the dragon pops wil have a minimise functions enabled.
 - **initialise_min_bar** (String) (Optional) - Defines the element then a bar will be generated inside for the minimised pops to be displayed in. If not defined whilst **minimise** is set to true then a bar will need to be manually present in the page with the class "dragondrop-min-bar" for the minimised pops to be added to.
 - **beforemin** (Function) (Optional) - Defines function name to run immediately before a pop is to be minimised. Function should take one option of the id name (String) of the pop to be minimised.
 - **aftermin** (Function) (Optional) - Defines function name to run immediately after a pop is minimised. Function should take one option of the id name (String) of the pop that was minimised.
 - **beforereopen** (Function) (Optional) - Defines function name to run immediately before a minimised pop is to be reopened. Function should take one option of the id name (String) of the pop to be reopened.
 - **aftereopen** (Function) (Optional) - Defines function name to run immediately after a minimised pop is reopened. Function should take one option of the id name (String) of the pop that was reopened.

 - **beforeclose** (Function) (Optional) - Defines function name to run immediately before a pop is to be closed. Function should take one option of the id name (String) of the pop to be closed.
 - **afterclose** (Function) (Optional) - Defines function name to run immediately after a pop is to be closed. Function should take one option of the id name (String) of the pop that was closed.

##Adding Popups

To add a new popup, or pop, you need to run the function **add_dragondrop_pop** which takes five inputs.
```
add_dragondrop_pop( popup_class, content_HTML, parent_id, min_option, handlebar_HTML )
```

 - **popup_class** (String) - Classname(s) as a string to be added to that popup after generation.
 - **content_HTML** (String) - Any HTML to be added to the popup content, will be placed after the handlebar within the popup layout.
 - **parent_id** (String) - The id name of the parent element that the popup is to be added inside.
 - **min_option** (Boolean) - If true then a minimise button is added to be used for minimising functions if they are initialised in settings. If the minimising functions are not initialised then a button will still be added but will not trigger any functions.
 - **handlebar_HTML** (String) - Any HTML to be added to the handlebar of the popup after the close (and minimise) button. Please be aware that the handlebar is used to drag the pop around so if too full of buttons then there will be little space on the handlebar to use for dragging the popup.

Adding popups can be done dynamically, for example in response to a button trigger.

The popups are resizeable by dragging the edges - currently this is set at the right hand side and bottom edges but this may be adjusted (currently under development). When resized, the corresponding new Bootstrap grid column width is recalculated and updated to ensure a smooth responsiveness to the website. 

When dragged around the page, the popups are designed to snap into place adjacent to other Dragon Drop popups and the element of the popup is moved to its new position between or besides its neighbours too, not just moved visually around the page. This is done to ensure a consistent responsive design so that the adjusted relative positions can be maintained across screen sizes. Basic JQuery UI dragging loses its relative positions when screen sizes are adjusted.


