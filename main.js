var intId = [];
var stringArray = [];
var curLine = [];                           // evil globals to be removed

function fadeloop (star, timeOut, timeIn, loop, count) {
    var $star = $(star),
        fn = function () {
      $star.fadeTo(timeOut, Math.random()).delay(Math.random() * 100).fadeTo(timeIn, Math.random());
    };
    fn();
    if (loop) {                                           // maybe try if check to stop loop first and then have the loop to continue after?
      this.counter = (this.counter === undefined ? 0 : this.counter + 1);
      intId[this.counter] = setInterval(fn, timeOut + timeIn + 100);
    }
}

function clearScreen () {                                                  // TODO add more functioonality to make element removal easier/cleaner
  $('.msg').remove();
  $('.pBreaks').remove();
  $('.anyText').remove();
}


function randomStars (i) {
                                                                          // TODO randomize font-size instead
    var divsize = ((Math.random() * 16) + 16).toFixed();
    $newdiv = $('<div/>').attr('id', 'star' + i).css({
        'font-size'   : divsize + 'px'
    });
                                                                          // makes position sensitive to size and document's width
    var posx = (Math.random() * ($(document).width() - divsize)).toFixed();   // FIXME try to keep star locations away from title (low priority)
    var posy = (Math.random() * ($(document).height() - divsize)).toFixed();  // FIXME on window resize stars remain oddly positioned (low priority)

    $newdiv.css({
        'font-family' : 'Gaiatype',
        'color'       : 'white',
        'text-shadow' : '3px 3px 0px #BF4494',
        'position'    : 'absolute',
        'left'        : posx + 'px',
        'top'         : posy + 'px',
        'display'     : 'none'
    }).html('*').appendTo('body');
}

var loadOpening = function (count) {
  clearScreen();                                                              // clearing screen

  // creating title elements
  var titlePage = document.createElement('h1');
  $(titlePage).attr('class', 'anyText').attr('id', 'bigOldTitle'); // .css('opacity', '0.0');
  titlePage.innerHTML = 'MOON PRISON';
  $('body').append(titlePage);
  var instruct = document.createElement('h3');
  $(instruct).attr('class', 'anyText').attr('id', 'instructor'); // .css('opacity', '0.0');
  instruct.innerHTML = '[click to play]';
  $('#bigOldTitle').append(instruct);
  $('#bigOldTitle').fadeIn(500, 'swing', function () { $('#instructor').fadeIn(800); });


  // generate and loop stars
  var starNum = 31;
  for (var i = 0; i < starNum; i++) {                                           // TODO make star number dependent on window size
    randomStars(i);
    fadeloop ('#star' + i, 1500, 1200, true, starNum);
  }
  // event listener to continue into game
  $(document).on('mousedown', function () {
    $(instruct).fadeOut(300);
    $(titlePage).fadeOut(500);
    //setTimeout(function () { clearScreen(); }, 500);
    for (var i = 0; i < starNum; i++) {
      $('#star' + i).fadeOut(500);
      clearInterval(intId[i]);
      setTimeout(function () {
        $('#star' + i).remove();
      }, 500);
      $(document).unbind('click');
    }

    $.getScript('/scenes/scene1.js');
  });
};

var showText = function (target, message, index, interval, count) {       // incremental reveal of each character
  if (index < message.length) {
    $('#msg' + count).append(message[index++]);
    $(document).bind('mousedown.screenSkip', function () {
      //interval = 0;
      index = message.length + 1;
      if(!showText.screenBreakCheck) {
        screenBreak(count);
        showText.screenBreakCheck = true;
    }

      $(document).unbind('mousedown.screenSkip');
    });
    setTimeout(function () { showText('#msg' + count, message, index, interval, count); }, interval);
  }
};

var screenBreak = function (count) {
  for (var i = 0; i < stringArray.length; i++) {
    clearTimeout(curLine[i]);
    $('#msg' + i).html('');
    showText('#txtDiv', stringArray[i], 0, 0, i);
    }
    check = true;
};

/*
stringLine is the message, write as a string.
interval is the rate each letter appears in ms
extra pauses after a line for extra effect(default:500ms)
check must be 1 if the line is the last before a refresh (resets data like this.totalDelay).
*/

var showLine = function (stringLine, interval, extra, check) {
  this.count = (this.count === undefined ? 0 : this.count + 1);
  var count = (this.count === undefined ? 0 : this.count);
  var newPara = document.createElement('p');
  newPara.setAttribute('id', 'msg' + count);
  newPara.setAttribute('class', 'msg');
  $('#txtDiv').append(newPara);

  var lineBreak = document.createElement('br');
  lineBreak.setAttribute('class', 'pBreaks');
  $('#txtDiv').append(lineBreak);

  curLine[count] = setTimeout(function () { showText('#txtDiv', stringLine, 0, interval, count); }, (this.totalDelay === undefined ? 0 : this.totalDelay)); // TODO if click skip this
  stringArray[count] = stringLine;
  this.oldInterval = interval;
  this.totalDelay = (this.totalDelay === undefined ? 0 : this.totalDelay) + (stringArray[count].length * this.oldInterval) + (extra === undefined ? 500 : extra);

/*
  if (check) {
    var mainScreenLoader = setTimeout(function () { loadOpening(this.count); }, this.totalDelay + 1500);
    this.totalDelay = 0;
    this.count = 0;
  }*/



};

var addAudio = function ( id, location) {
  var audio = document.createElement('audio');
  $('body').append(audio);
  $(audio).attr('id', id).attr('src', location);
};


//id for added element, TODO duration optional-not yet implemented
var playAudio = function (id, duration) {
  $('#' + id).get(0).play();
  if(!duration == undefined) {
    // code here eventually
  }
};

function gameIntro () {
  addAudio('einstein', './audio/EOTB.webm');
  playAudio('einstein');
  showLine('You\'ve done a terrible thing you can\'t remember.', 50);
  showLine('Something just terribly awful.', 50);
  showLine('You should be ashamed.', 50, 1500);
  showLine('You should be locked up.', 100, undefined, 1);

  var mainScreenLoader = setTimeout(function () {
    $(document).unbind('mousedown.screenBreak');
    mainScreenLoader.titleOccurCheck = true;
    loadOpening(this.count);
   }, this.totalDelay + 1500);

   //if(showText.screenBreakCheck){
  $(document).bind('mousedown.screenBreak', function () {
    $(document).unbind('mousedown.screenBreak');
      if (!mainScreenLoader.titleOccurCheck) {
      setTimeout(function () { loadOpening(this.count); }, 1500);
      }
      clearTimeout(mainScreenLoader);
    //setTimeout(function () { loadOpening(this.count); }, 2000);
  });
}

window.onload = gameIntro;
