var intId = [];
var stringArray = [];
var curLine = [];
var screenBreakCheck = false;                          // evil globals to be removed


/*
screenPause parameter: time to pause before fadeTime - default 500
element: state specific classes or elements to remove in an array - must incule tage (i.e. '.msg' or '#bigOldTitle') - default .msg and .pbreaks
fadeTime: time for elements to fade out

screenPause tends to be equal or sometimes greater than fadeTime slightly
*/
function clearScreen (screenPause, element, fadeTime) {
  console.log('clearing screen');
  screenPause = (screenPause === undefined ? 500 : screenPause);
  fadeTime = (fadeTime === undefined ? 500 : fadeTime);
  element = (element === undefined ? ['.msg', '.pbreaks'] : element);
    for (var i = 0; i < element.length; i++) {
      $(element[i]).fadeOut(fadeTime);
    }
  setTimeout(function () {
    for (var i = 0; i < element.length; i++) {
      $(element[i]).remove();
    }
  }, fadeTime + screenPause);
}

function blankSpace (number) {
    for (var i = 0; i < number; i++) {
        showLine('', 0);
    }
}

var showText = function (targetChild, targetParent, message, index, interval, count) {       // incremental reveal of each character (should rarely be called in place of showLine)
  if (index < message.length) {
    $(targetChild + count).append(message[index++]);
    $(document).bind('mousedown.screenSkip', function () {
      interval = 10;
      index = message.length + 1;
      if(!screenBreakCheck) {
        screenBreak(targetChild, targetParent, count, index);
        screenBreakCheck = true;
    }

      $(document).unbind('mousedown.screenSkip');
    });
    if (index >= message.length) {
      $(document).unbind('mousedown.screenSkip');
    }
    setTimeout(function () { showText(targetChild, targetParent, message, index, interval, count); }, interval);
  }
};

var screenBreak = function (targetChild, targetParent, count, index) {
  for (var i = 0; i < stringArray.length; i++) {
    clearTimeout(curLine[i]);
    $(targetChild + (i)).html('');
    showText(targetChild, targetParent, stringArray[i], 0, 10, i);
    }
    check = true;
};


/*
stringLine is the message, write as a string.
interval is the rate each letter appears in ms
extra pauses after a line for extra effect(default:250ms)
check must be 1 if the line is the last before a refresh (resets data like this.totalDelay).
*/
var showLine = function (stringLine, interval, check, skip, extra) {
  if (check) {
    this.count = 0;
    stringArray = [];
    curLine = [];
    screenBreakCheck = false;
    this.totalDelay = 0;
  }
  if (skip) {
    this.totalDelay = 0;
  }
  console.log(stringLine);
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
};

/*
conditionArray: is an array of conditions to pass for the corresponding arrays to be run
fadeTargetArray: a 2 dimensional array, one row for each condition, affects only ansOp elements for now but can be eaily changed if needed
messageArray: 1 diimensional array, will print a message for each corresponding condition. If message is 'finish', will run optional function (callToFunction)
*/
function switchOnClick(conditionArray, fadeTargetArray, messageArray, callToFunction) {
    for (var i = 0; i < conditionArray.length; i++) {
      console.log('conditionArray[i]: ' + conditionArray[i]);
      if(conditionArray[i]) {
      for (var j = 0; j < fadeTargetArray.length; j++) {
        console.log('fadeTargetArray[i][j]' + fadeTargetArray[i][j]);
        $('#ansOp' + j).fadeTo(100, fadeTargetArray[i][j]);
        }
        if(!(messageArray[i] === undefined)) {
          if (messageArray[i] === 'finish') {
             callToFunction();
          } else {
              showLine('...' + messageArray[i], 25, 0, 1);
             if(($('#txtDiv p').length > 4)) {
               $('#msg' + ($('#txtDiv p').length - 4)).fadeOut(100);
               $('#txtDiv').find('br').remove();
             }
          }
      }
    }
    }
  }

function answerActive(answer, option) {
  $(answer).html('_' + option);
}

function answerInactive(answer, option) {
  $(answer).html(option);
}

function answerSelecting(answer, option, altOption) {
  if (altOption === '' || undefined) {
    // code here eventually                              // TODO add some feedback like a dimming effect on pressdown
  } else {
    $(answer).html(altOption);
  }
}

function answerSelected(answer, option) {
  setTimeout(function () {
      // code here eventually                             // TODO add some feedback like a dimming effect on pressdown
      $(answer).html(option);
  }, 500);
}

function answerActivation (answers, options, altOptions) {
  for (var i = 0; i < answers.length; i++) {
  (function (i) {
      $(answers[i]).on('mouseover', function () {
        answerActive(answers[i], options[i]);
      });
      $(answers[i]).on('mouseleave', function () {
        answerInactive(answers[i], '\xa0' + options[i]);
      });
      $(answers[i]).on('mousedown', function () {
        answerSelecting(answers[i], '\xa0' + options[i], altOptions[i]);
      });
      $(answers[i]).on('mouseup', function () {
        answerSelected(answers[i], '\xa0' + options[i]);
      });
    })(i);
}
}

function answerOptions (options, altOptions) {
  var answers = [], ansDel;
  for (var i = 0; i < stringArray.length; i++) {
    ansDel = stringArray[i].length * 50;
  }
  setTimeout(function () {
  for (var i = 0; i < options.length; i++) {
    answers[i] = document.createElement('p');
    answers[i].setAttribute('id', 'ansOp' + i);
    answers[i].setAttribute('class', 'selectable');
    $('#ansDiv').append(answers[i]);
    showText('#ansOp', '#ansDiv', '\xa0' + options[i], 0, 50, i);
    }
    answerActivation(answers, options, altOptions);
    }, ansDel);
  }


var addAudio = function (id, location) {
  var audio = document.createElement('audio');
  $('body').append(audio);
  $(audio).attr('id', id).attr('src', location);
};

var stopAudio = function (id, fade) {
  $('#' + id).get(0).pause();
  if(!(fade === undefined)) {
    // code here if needed
  }
}


var playAudio = function (id, duration) {
  $('#' + id).get(0).play();
  if(!(duration === undefined)) {
  }
};

function nextScreenLoader(functionToRun, screenPause) {
  var nextScreenLoader = setTimeout(function () {
    $(document).unbind('mousedown.screenBreak');
    nextScreenLoader.noBreakCheck = true;
    clearScreen(100, ['.msg', '.pBreaks'], screenPause);
    setTimeout(function () { functionToRun(); }, screenPause + 100);
    }, this.totalDelay);

  $(document).bind('mousedown.screenBreak', function () {
    $(document).unbind('mousedown.screenBreak');
      if (!nextScreenLoader.noBreakCheck) {
      clearTimeout(nextScreenLoader);
      clearScreen(100, ['.msg', '.pBreaks'], screenPause);
      setTimeout(function () { functionToRun(); }, screenPause + 100);
      }
  });
}

function loadScene(sceneScriptFile) {
      setTimeout(function () {
      $.getScript(sceneScriptFile)
        .done(function () {
          console.log('Loaded ' + sceneScriptFile + ' successfully');
        })
        .fail(function () {
          console.log('Couldn\'t load ' + sceneScriptFile + ' for some reason');
        });
    }, 500);
}

function gameStart() {
  loadScene('/scenes/opening.js');
}

window.onload = gameStart;
