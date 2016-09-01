
var rejectionOptions = new Set(["false",'""' , null , false , 'undefined']);
var isUseless = function(something) {
  if (rejectionOptions.has(something) || rejectionOptions.has(typeof something)) {  return true;  }
  else {  return false;  };
};


///needs to be set
var drag_drop_parent_id;

var polyannoMinBarHTML1 = `<button type="button" class="btn polyannoMinEditor"> 
                          <span> _ </span>
                          <span class="polyannoMinTitle">`
var polyannoMinBarHTML2 =  `</span> 
                          </button>`;

var dragondrop_popup_HTML = `

  <div  class="row dragondropbox">
    <div class="col-md-12">

      <div class="row dragondrop-handlebar ui-draggable-handle">

        <button class="btn col-md-1 ">
          <span class="closePopupBtn glyphicon glyphicon-remove"></span>
        </button>

        <button class="btn col-md-1 dragondrop-min">
          <span> _ </span>
        </button>

        <div class="col-md-7">
          <div class="dragondrop-title"></div>
        </div>

      </div>


      <div class="dragondrop-content-box row ui-content">

      <!--insert popup content here -->

      </div>

    </div>
  </div>

`;

var addPopup = function(popupClass, popupClone, parentID, minOption) {

  var popupBoxDiv = document.createElement("div");
  popupBoxDiv.classList.add(popupClass);
  popupBoxDiv.classList.add("annoPopup");
  popupBoxDiv.classList.add("col-md-4");

  popupBoxDiv.id = "-" + Math.random().toString().substring(2);
  var popupIDstring = "#" + popupBoxDiv.id;

  var pageBody = document.getElementById(parentID);
  pageBody.insertBefore(popupBoxDiv, pageBody.childNodes[0]); 

  document.getElementById(popupBoxDiv.id).innerHTML = dragondrop_popup_HTML;
  document.getElementById(popupBoxDiv.id).children[0].children[0].children[1].innerHTML = popupClone;

  drag_drop_parent_id = parentID;

  $(popupIDstring).draggable();
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

  $(popupIDstring).resizable();
  $(popupIDstring).resizable( "enable" );

  return popupIDstring;
};

var removeEditorChild = function(thisEditor) {
  var theParent = document.getElementById(drag_drop_parent_id);
  var toRemove = document.getElementById(thisEditor);
  theParent.removeChild(toRemove);
  if (  isUseless(toRemove) != true ) {  return thisEditor;  };
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
    $("#testingOldCol").html(newcol);
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

var isReverting = false;

var updateIsReverting = function(theNearestSiblings, popupDOM) {
  if ((theNearestSiblings[0] != -1) && (theNearestSiblings[0] != popupDOM.prev())) {
    isReverting = ["insertAfter", theNearestSiblings[0]];
    popupDOM.addClass("polyanno-was-reverted");
    return true;
  }
  else if ((theNearestSiblings[1] != -1) && (theNearestSiblings[1] != popupDOM.next())) {
    isReverting = ["insertBefore", theNearestSiblings[1] ];
    popupDOM.addClass("polyanno-was-reverted");
    return true;
  }
  else {
    return false;
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

var polyannoMinimiseEditor = function (thisEditorWithoutHash) {
  var polyannoMinBarHTML = polyannoMinBarHTML1 + thisEditorWithoutHash + polyannoMinBarHTML2;
  $(".polyanno-min-bar").append(polyannoMinBarHTML);
  $(".polyanno-min-bar").find("span:contains("+thisEditorWithoutHash+")").addClass(thisEditorWithoutHash);
  $("#"+thisEditorWithoutHash).css("display", "none");
};

var polyannoReopenMin = function (thisEditorWithoutHash) {
  $("#"+thisEditorWithoutHash).css("display", "block");
  $(".polyanno-min-bar").find("."+thisEditorWithoutHash).closest(".polyannoMinEditor").remove(); ///
};

var initialiseDragAndDrop = function(parent_id) {

  $('#'+parent_id).on("click", ".closePopupBtn", function(){
    var thisEditor = $(event.target).closest(".annoPopup").attr("id");
    closeEditorMenu(thisEditor);
  });

  $( "#"+parent_id).on( "click", ".polyanno-popup-min", function(event) {
    var thisEditor = $(event.target).closest(".annoPopup").attr("id");
    polyannoMinimiseEditor(thisEditor);
  });

  $( "#"+parent_id ).on( "resizestop", ".annoPopup", function( event, ui ) {
    adjustResizeBootstrapGrid($("#polyanno-page-body"), $(event.target), ui);
  } );

  $( "#"+parent_id ).on( "dragstop", ".annoPopup", function( event, ui ) {
    if ($(event.target).hasClass("polyanno-was-reverted") && (isReverting[0] == "insertAfter") ) {
      var theRest = isReverting[1].nextAll();
      if( !isUseless(theRest) ) { 
        theRest.insertAfter($(event.target));
      };
      $(event.target).insertAfter(isReverting[1]);
      $(event.target).removeClass("polyanno-was-reverted");
      isReverting = false;
    }
    else if ($(event.target).hasClass("polyanno-was-reverted") && (isReverting[0] == "insertBefore") ) {
      var theRest = isReverting[1].prevAll();
      if( !isUseless(theRest) ) { 
        theRest.insertBefore($(event.target));
      };
      $(event.target).insertBefore(isReverting[1]);
      $(event.target).removeClass("polyanno-was-reverted");
      isReverting = false;
    };
  } );

};

$("#polyanno-top-bar").on("click", ".polyannoMinEditor", function(event) {
  var thisEditor = $(this).find(".polyannoMinTitle").html();
  polyannoReopenMin(thisEditor);
});

///set option for minimise
///preload min bar?


