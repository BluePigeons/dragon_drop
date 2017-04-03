
var rejectionOptions = new Set(["false",'""' , null , false , 'undefined']);
var isUseless = function(something) {
  if (rejectionOptions.has(something) || rejectionOptions.has(typeof something)) {  return true;  }
  else {  return false;  };
};

var hasdragondrop_init = false;

///needs to be set
var drag_drop_parent_id;

var dragondrop_min_bar_HTML1 = `<button type="button" class="btn dragondrop-min-pop"> 
                          <span> _ </span>
                          <span class="dragondrop-min-pop-title">`
var dragondrop_min_bar_HTML2 =  `</span> 
                          </button>`;

var dragondrop_popup_HTML = `
  <div class="dragondrop-resize-e ui-resizable-e ui-resizable-handle"></div>
  <div  class="row dragondropbox">
    <div class="col-md-12">

      <div class="row dragondrop-handlebar ui-draggable-handle">

        <button class="btn dragondrop-handlebar-obj dragondrop-close">
          <span class="dragondrop-close-pop-btn glyphicon glyphicon-remove"></span>
        </button>

        <button class="btn dragondrop-handlebar-obj dragondrop-min">
          <span> _ </span>
        </button>

        <div class="dragondrop-handlebar-obj ">
          <div class="dragondrop-title"></div>
        </div>

      </div>


      <!--insert popup content here (should be Bootstrap rows)-->


    </div>
  </div>
  <div class="dragondrop-resize-w ui-resizable-w ui-resizable-handle"></div>

`;

var dragondrop_current_col_width = function(className) {
  var arr = className.split(" ");
  for (var i=0; i < arr.length; i++) {
    if (arr[i].match (/(^|\s)col-md-\S+/g)) {
      var n = arr[i];
      var x = n.split("-md-")[1];
      return Number(x);
    };
  };
  return 0;
};

var add_dragondrop_pop = function(popupClass, contentHTML, parentID, minOption, handlebarHTML, removeCloseOption) {

  if (!hasdragondrop_init) {
    $('#'+parentID).addClass("no-gutter").html("<div class='col-md-12 no-gutter'><div class='row dragondrop-row no-gutter'></div></div>");
    $('.dragondrop-row').sortable({
      handle: ".ui-draggable-handle",
      connectWith: ".dragondrop-row"
    });
    hasdragondrop_init = true;
  };

  var popupBoxDiv = document.createElement("div");
  popupBoxDiv.classList.add(popupClass);
  popupBoxDiv.classList.add("annoPopup"); /////"dragonpop"

  popupBoxDiv.classList.add("col-md-4");

  popupBoxDiv.id = "-" + Math.random().toString().substring(2);
  var popupIDstring = "#" + popupBoxDiv.id;

  ///
  var parentRow = document.getElementById(parentID.children[0].lastChild);
  var parentRowWidth = 0;
  for (var i=0; i < parentRow.length; i++) {
    parentRowWidth += dragondrop_current_col_width(parentRow[i].classList);
  };
  if (parentRowWidth + 4 >= 12) {
    var newRow = document.createElement("div");
    newRow.classList.add("row");
    newRow.classList.add("dragondrop-row");
    newRow.classList.add("no-gutter");
    document.getElementById(parentID.children[0]).insertAfter(newRow, document.getElementById(parentID.children[0]));
  };

  var pageBody = document.getElementById(parentID.children[0].lastChild); //id --> col --> rows
  pageBody.insertAfter(popupBoxDiv, pageBody.lastChild); 

  document.getElementById(popupBoxDiv.id).innerHTML = dragondrop_popup_HTML;
  if (!isUseless(handlebarHTML)) { 
    document.getElementById(popupBoxDiv.id).children[1].children[0].children[0].innerHTML += handlebarHTML;
    $("#"+popupBoxDiv.id).find(".dragondrop-handlebar").children().addClass("dragondrop-handlebar-obj");
  }; 
  if (!isUseless(contentHTML)) { document.getElementById(popupBoxDiv.id).children[1].children[0].innerHTML += contentHTML };

  drag_drop_parent_id = parentID;

  if (isUseless(minOption)) {  $(popupIDstring).find(".dragondrop-min").detach();  }
  else { $(popupIDstring).find(".dragondrop-min").prependTo($(popupIDstring).find(".dragondrop-handlebar")); };

  if (removeCloseOption) {  $(popupIDstring).find(".dragondrop-close").detach();  }
  else { $(popupIDstring).find(".dragondrop-close").prependTo($(popupIDstring).find(".dragondrop-handlebar")); };


  $(popupIDstring).draggable();
  $(popupIDstring).draggable({
    addClasses: false,
    handle: ".ui-draggable-handle"
  });

  $('.dragondrop-row').sortable({
    handle: ".ui-draggable-handle",
    connectWith: ".dragondrop-row"
  });
  /*
  $(popupIDstring).draggable({
    addClasses: false,
    handle: ".ui-draggable-handle",
    revert: function(theObject) {
      return adjustDragBootstrapGrid($(this));
    },
    revertDuration: 0,
    snap: ".annoPopup",
    snapMode: "outer"  
  });
*/
  ////set max height or clearfixes??

  $(popupIDstring).resizable({
    handles: {"e": ".dragondrop-resize-e", "w": ".dragondrop-resize-w" },
    ghost: true,
    stop: function(event, ui) {
      var h = ui.element.find("dragondropbox").css("height");
      ui.element.find(".ui-resizable-handle").css("height", h);
    }
  });
  $(popupIDstring).resizable( "enable" );

  return popupIDstring;
};

var dragondrop_remove_pop = function(thispop) {

  var toRemove = document.getElementById(thispop);
  var theParent = document.getElementById(toRemove.parentElement.id);
  theParent.removeChild(toRemove);
  if (  isUseless(toRemove) != true ) {  return thispop;  };
};

var updateGridCols = function(newcol, popupDOM) {
  var newName = "col-md-"+newcol;
  var theClasses = popupDOM.attr("class").toString();
  var theStartIndex = theClasses.indexOf("col-md-");
  var theEndIndex;
  var spaceIndex = theClasses.indexOf(" ", theStartIndex);
  var finishingIndex = theClasses.length;
  if (spaceIndex == -1) {  theEndIndex = finishingIndex;  }
  else {  theEndIndex = spaceIndex;  };
  var theClassName = theClasses.substring(theStartIndex, theEndIndex);
  if ((theStartIndex != -1) && (theClassName != newName)) {
    popupDOM.removeClass(theClassName).addClass(newName+" ");
    return newcol;
  }
  else {  return 0  };
};

var adjustResizeBootstrapGrid = function(parentDOM, popupDOM, theUI) {
  var gridwidth = Math.round(parentDOM.width() / 12 );
  var newWidth = theUI.size.width;
  var colwidth = Math.round(newWidth/gridwidth);
  return updateGridCols(colwidth, popupDOM);
};

var findCornerArray = function(theDOM) {
    ///position or offset?
  var theLeft = theDOM.position().left;
  var theRight = theLeft + theDOM.width();
  var theTop = theDOM.position().top;
  var theBottom = theTop + theDOM.height(); 
  return [theLeft, theRight, theTop, theBottom];
};

var isBetween = function(theNum, theFirst, theLast) {
  if ((theNum > theFirst) && (theNum < theLast)) { 
    return theNum - theFirst;
  }
  else { return 0 };
};

var formJumpArray = function(theChecks, popupDOM, nDOM, theNSiblings) {
  if ( ((theChecks[2] != 0) && (theChecks[3] != 0)) || ((theChecks[2] == 0) && (theChecks[3] == 0)) ){ ///if top and bottom are not overlapping or both are
    if (theChecks[0] != 0) {  theNSiblings[0] = nDOM; return theNSiblings; }
    else if (theChecks[1] != 0) {  theNSiblings[1] = nDOM; return theNSiblings; };
  }
  else if ( ((theChecks[0] != 0) && (theChecks[1] != 0)) || ((theChecks[0] == 0) && (theChecks[1] == 0)) ){ ///if left and right are inside neighbour and needs to jump above or below
    if (theChecks[2] != 0) {  return theNSiblings;  }
    else if (theChecks[3] != 0) { return theNSiblings;  };
  }
  else if (theChecks[0] != 0) {  theNSiblings[0] = nDOM; return theNSiblings;  }
  else if (theChecks[1] != 0) {  theNSiblings[1] = nDOM; return theNSiblings; };

};

var loopBetweenSides = function(popupCorners, otherCorners){
  return [
    isBetween(popupCorners[0], otherCorners[0], otherCorners[1]), ///needs to add to left this far to clear left side
    isBetween(popupCorners[1], otherCorners[0], otherCorners[1]), ///needs to remove from left this far to clear right side
    isBetween(popupCorners[2], otherCorners[2], otherCorners[3]),
    isBetween(popupCorners[3], otherCorners[2], otherCorners[3])
  ];
};

var hasCornerInside = function(popupCorners, otherCorners) {
  var theChecks = loopBetweenSides(popupCorners, otherCorners);
  if (((theChecks[0] != 0) || (theChecks[1] != 0)) && ((theChecks[2] != 0)|| (theChecks[3] != 0))) { 
    return theChecks;
  }
  else {  return false  };
};

var isReverting = false;

var isEditorOverlap = function(popupDOM, popupCorners, nDOM, theNSiblings) {
  var otherCorners = findCornerArray(nDOM);
  var theChecks = hasCornerInside(popupCorners, otherCorners);
  var outsideChecks = hasCornerInside(otherCorners, popupCorners);

  if ( (theChecks == false) && (outsideChecks == false) ) {
    return theNSiblings;
  }
  else {
    return formJumpArray(theChecks, popupDOM, nDOM, theNSiblings);
  };
  
};

var getDist = function(thisSide, thatSide) {
  return thisSide[0] - thatSide[1];
}

var checkSiblingSides = function(mainSides, checkSides, theNearestSiblings, nDOM) {
  var checkLeft = getDist(mainSides, checkSides);
  var checkRight = getDist(checkSides, mainSides);
  if ( ((theNearestSiblings[0] == -1)&&( checkLeft >= 0)) || ( (theNearestSiblings[0] != -1) && (checkLeft < getDist(mainSides, findCornerArray(theNearestSiblings[0]) ) )) ) {
    theNearestSiblings[0] = nDOM;
    theNearestSiblings[2] = checkLeft;
    return theNearestSiblings;
  }
  else if ( ((theNearestSiblings[1] == -1)&&( checkRight >= 0)) || ( (theNearestSiblings[1] != -1) && (checkRight < getDist(findCornerArray(theNearestSiblings[1]), mainSides) )) ) {
    theNearestSiblings[1] = nDOM;
    theNearestSiblings[2] = checkRight;
    return theNearestSiblings;
  }
  else { return theNearestSiblings; };
};

var nearestSiblings = function(popupCorners, nDOM, theNearestSiblings) {
  var otherCorners = findCornerArray(nDOM);
  if ((popupCorners[2] < otherCorners[3]) && (popupCorners[3] > otherCorners[2])) { ///higher value for top means lower down hence operators' directions
    return checkSiblingSides(popupCorners, otherCorners, theNearestSiblings, nDOM);
  }
  else {
    return theNearestSiblings;
  };
};

var updateIsReverting = function(theNearestSiblings, popupDOM) {
  if ((theNearestSiblings[0] != -1) && (theNearestSiblings[0] != popupDOM.prev())) {
    isReverting = ["insertAfter", theNearestSiblings[0]];
    popupDOM.addClass("dragondrop-was-reverted");
    return true;
  }
  else if ((theNearestSiblings[1] != -1) && (theNearestSiblings[1] != popupDOM.next())) {
    isReverting = ["insertBefore", theNearestSiblings[1] ];
    popupDOM.addClass("dragondrop-was-reverted");
    return true;
  }
  else {
    return true;
  };
};

var adjustDragBootstrapGrid = function(popupDOM) {

  var popupCorners = findCornerArray(popupDOM);
  var theNearestSiblings = [-1, -1];
  if (!isUseless(popupDOM.prev())) { theNearestSiblings == popupDOM.prev(); };
  if (!isUseless(popupDOM.next())) { theNearestSiblings == popupDOM.next(); };

  popupDOM.siblings().each(function(i) {
    theNearestSiblings = isEditorOverlap(popupDOM, popupCorners, $(this), theNearestSiblings);
  });

  if ( ((theNearestSiblings[0] == -1) || (theNearestSiblings[0] == popupDOM.prev())) && ((theNearestSiblings[0] == -1) || (theNearestSiblings[0] == popupDOM.prev()))  ) {
    popupDOM.siblings().each(function(i) {
      theNearestSiblings = nearestSiblings(popupCorners, $(this), theNearestSiblings);
    });
    return updateIsReverting(theNearestSiblings, popupDOM);
  }
  else {
    return updateIsReverting(theNearestSiblings, popupDOM);
  };
  
};

var dragondrop_minimise_pop = function (thisEditorWithoutHash) {
  var dragondrop_min_bar_HTML = dragondrop_min_bar_HTML1 + thisEditorWithoutHash + dragondrop_min_bar_HTML2;
  $(".dragondrop-min-bar").append(dragondrop_min_bar_HTML);
  var new_min = $(".dragondrop-min-bar").find("span:contains("+thisEditorWithoutHash+")");

  new_min.addClass(thisEditorWithoutHash);
  $("#"+thisEditorWithoutHash)
  .hide("scale");
};

var dragondrop_reopen_min = function (thisEditorWithoutHash) {
  var old_min = $(".dragondrop-min-bar").find("."+thisEditorWithoutHash).closest(".dragondrop-min-pop");
  $("#"+thisEditorWithoutHash).show("scale");
  old_min
  .remove(); ///
};

var initialise_dragondrop = function(parent_id, the_options) {

  $('#'+parent_id).on("click", ".dragondrop-close-pop-btn", function(){
    var thisPopID = $(event.target).closest(".annoPopup").attr("id");
    if (!isUseless(the_options.beforeclose)) {  the_options.beforeclose(thisPopID) };
    dragondrop_remove_pop(thisPopID);
    if (!isUseless(the_options.afterclose)) {  the_options.afterclose(thisPopID) };   

  });

  $( "#"+parent_id ).on( "resizestop", ".annoPopup", function( event, ui ) {
    adjustResizeBootstrapGrid($("#"+parent_id), $(event.target), ui);
  } );

  $( "#"+parent_id ).on( "dragstop", ".annoPopup", function( event, ui ) {
    if ($(event.target).hasClass("dragondrop-was-reverted") && (isReverting[0] == "insertAfter") ) {
      var theRest = isReverting[1].nextAll();
      if( !isUseless(theRest) ) { 
        theRest.insertAfter($(event.target));
      };
      $(event.target).insertAfter(isReverting[1]);
      $(event.target).removeClass("dragondrop-was-reverted");
      isReverting = false;
    }
    else if ($(event.target).hasClass("dragondrop-was-reverted") && (isReverting[0] == "insertBefore") ) {
      var theRest = isReverting[1].prevAll();
      if( !isUseless(theRest) ) { 
        theRest.insertBefore($(event.target));
      };
      $(event.target).insertBefore(isReverting[1]);
      $(event.target).removeClass("dragondrop-was-reverted");
      isReverting = false;
    };
  } );

  if (!isUseless(the_options.minimise)) {

    $( "#"+parent_id).on( "click", ".dragondrop-min", function(event) {
      event.stopPropagation();
      var thisPopID = $(event.target).closest(".annoPopup").attr("id");
      if (!isUseless(the_options.beforemin)) {  the_options.beforemin(thisPopID) };

      dragondrop_minimise_pop(thisPopID);

      if (!isUseless(the_options.aftermin)) {  the_options.aftermin(thisPopID) };
    });

    ///default to true
    if (!isUseless(the_options.initialise_min_bar)) {

      document.getElementById(the_options.initialise_min_bar).innerHTML = `<div class="dragondrop-min-bar"> </div>` ;

      $(".dragondrop-min-bar").on("click", ".dragondrop-min-pop", function(event) {
        var thisPopID = $(this).find(".dragondrop-min-pop-title").html();
        if (!isUseless(the_options.beforereopen)) {  the_options.beforereopen(thisPopID) };
        dragondrop_reopen_min(thisPopID);
        if (!isUseless(the_options.afterreopen)) {  the_options.afterreopen(thisPopID) };
      });

    }
    else {
      $(".dragondrop-min-bar").on("click", ".dragondrop-min-pop", function(event) {
        var thisPopID = $(this).find(".dragondrop-min-pop-title").html();
        if (!isUseless(the_options.beforereopen)) {  the_options.beforereopen(thisPopID) };
        dragondrop_reopen_min(thisPopID);
        if (!isUseless(the_options.afterreopen)) {  the_options.afterreopen(thisPopID) };
      });
    };
    
  };

  hasdragondrop_init = true;

};


