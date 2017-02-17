var intId = [];
var stringArray = [];
var curLine = [];
var screenBreakCheck = false;                          // evil globals to be removed

function fadeloop (star, timeOut, timeIn, loop, count) {
    var $star = $(star),
        fn = function () {
      $star.fadeTo(timeOut, Math.random()).delay(Math.random() * 100).fadeTo(timeIn, Math.random());
    };
    fn();
    if (loop) {
      this.counter = (this.counter === undefined ? 0 : this.counter + 1);
      intId[this.counter] = setInterval(fn, timeOut + timeIn + 100);
      // TODO sometimes stars do not fade right because setInterval lasts too long for fade zone before clearInterval can stop it.
      // fix by making interval shorter, preferably around 500-1000, though need to make sure fadeTos fade to close decimal so flickering isn't too much
    }
}


/*
screenPause parameter: time to pause before fadeTime - default 1500
element: state specific classes or elements to remove in an array - must incule tage (i.e. '.msg' or '#bigOldTitle') - default .msg and .pbreaks
fadeTime: time for elements to fade out

screenPause tends to be equal or sometimes greater than fadeTime slightly
*/
function clearScreen (screenPause, element, fadeTime) {
  console.log('clearing screen');
  screenPause = (screenPause === undefined ? 1000 : screenPause);
  fadeTime = (fadeTime === undefined ? 300 : fadeTime);
  element = (element === undefined ? ['.msg', '.pbreaks'] : element);
  setTimeout(function () {
    for (var i = 0; i < element.length; i++) {
      $(element[i]).fadeOut(fadeTime);
    }
  }, screenPause);
  setTimeout(function () {
    for (var i = 0; i < element.length; i++) {
      $(element[i]).remove();
    }
  }, fadeTime + screenPause + 100);
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

function loadOpening () {
  // creating title elements
  var titlePage = document.createElement('h1');
  $(titlePage).attr('class', 'anyText').attr('id', 'bigOldTitle'); // .css('opacity', '0.0');
  titlePage.innerHTML = 'MOON PRISON';
  $('body').append(titlePage);
  var instruct = document.createElement('h3');
  $(instruct).attr('class', 'anyText').attr('id', 'instructor'); // .css('opacity', '0.0');
  instruct.innerHTML = '[click to play]';
  $('#bigOldTitle').append(instruct);
  $('#bigOldTitle').fadeIn(500, function () { $('#instructor').fadeIn(800); });


  // generate and loop stars
  var starNum = 31;
  for (var i = 0; i < starNum; i++) {                                           // TODO make star number dependent on window size
    randomStars(i);
    fadeloop ('#star' + i, 1500, 1200, true, starNum);
  }
  // event listener to continue into game
  $(document).on('mousedown', function () {
    clearScreen(300, ['#bigOldTitle'], 300);
    var starArray = [];
    for (var i = 0; i < starNum; i++) {
      clearInterval(intId[i]);
      starArray[i] = '#star' + i;
    }
    setTimeout(function () {
      clearScreen(600, starArray, 600);
    }, 200);
    $(document).unbind('mousedown');

    setTimeout(function () {
      $.getScript('/scenes/scene1.js')
        .done(function () {
          console.log('Next js script loaded successfully');
        })
        .fail(function () {
          console.log('Couldn\'t load next js file for some reason');
        });
    }, 500);
  });
}

var showText = function (targetChild, targetParent, message, index, interval, count) {       // incremental reveal of each character
  console.log(message);
  console.log(message.length);
  if (index < message.length) {
    console.log(message[index]);
    $(targetChild + count).append(message[index++]);
    console.log(targetChild);
    $(document).bind('mousedown.screenSkip', function () {
      interval = 10;
      //index = message.length + 1;
      if(!screenBreakCheck) {
        screenBreak(targetChild, targetParent, count);
        screenBreakCheck = true;
    }

      $(document).unbind('mousedown.screenSkip');
    });
    setTimeout(function () { showText(targetChild, targetParent, message, index, interval, count); }, interval);
  }
};

var screenBreak = function (targetChild, targetParent, count) {
  for (var i = count + 1; i < stringArray.length; i++) {
    clearTimeout(curLine[i]);
    $(targetChild + i).html('');
    showText(targetChild, targetParent, stringArray[i], 0, 10, i);            // TODO maybe give a small incrementing delay instead of them all starting at once (low priority)?

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
  if (!(check === undefined)) {
    this.count = 0;
    stringArray = [];
    curLine = [];
    screenBreakCheck = false;
    this.totalDelay = 0;
  }

  var count = (this.count === undefined ? count : this.count);
  var newPara = document.createElement('p');
  newPara.setAttribute('id', 'msg' + count);
  newPara.setAttribute('class', 'msg');
  $('#txtDiv').append(newPara);

  var lineBreak = document.createElement('br');
  lineBreak.setAttribute('class', 'pBreaks');
  $('#txtDiv').append(lineBreak);

  curLine[count] = setTimeout(function () { showText('#msg', '#txtDiv', stringLine, 0, interval, count); }, this.totalDelay);
  stringArray[count] = stringLine;
  this.oldInterval = interval;
  this.totalDelay = this.totalDelay + (stringArray[count].length * this.oldInterval) + (extra === undefined ? 500 : extra);
  this.count = count + 1;

  console.log(stringArray[count]);
};

function answerOptions (options) {
  var answerDiv = document.createElement('div');
  answerDiv.setAttribute('id', 'answerDiv');
  answerDiv.setAttribute('class', 'anyText');
  $('body').append(answerDiv);
  var answers = [], ansDel;
  for (var i = 0; i < stringArray.length; i++) {
    ansDel = stringArray[i].length * 50;
  }
  setTimeout( function () {
  for (var i = 0; i < options.length; i++) {
    answers[i] = document.createElement('p');
    answers[i].setAttribute('id', 'answerOp' + i);
    $('#answerDiv').append(answers[i]);
    console.log(options);
    console.log(options[i]);
      showText('#answerOp', '#answerDiv', options[i], 0, 50, i);
    }
    }, ansDel);
  }


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

function nextScreenLoader(functionToRun, screenPause) {
  var nextScreenLoader = setTimeout(function () {
    $(document).unbind('mousedown.screenBreak');
    nextScreenLoader.noBreakCheck = true;
    clearScreen(300, ['.msg', '.pBreaks'], 300);
    setTimeout(function () { functionToRun(); }, screenPause);
    }, this.totalDelay + screenPause);

  $(document).bind('mousedown.screenBreak', function () {
    $(document).unbind('mousedown.screenBreak');
      if (!nextScreenLoader.noBreakCheck) {
      clearTimeout(nextScreenLoader);
      clearScreen(screenPause - 300, ['.msg', '.pBreaks'], 300);
      setTimeout(function () { functionToRun(); }, screenPause);
      }
  });
};


function gameIntro () {
  addAudio('einstein', './audio/EOTB.webm');
  playAudio('einstein');

  showLine('You\'ve done a terrible thing you can\'t remember.', 50, undefined, true);
  showLine('Something just terribly awful.', 50);
  showLine('You should be ashamed.', 50, 1500);
  showLine('You should be locked up.', 100);
  nextScreenLoader(loadOpening, 1000);

}

window.onload = gameIntro;
