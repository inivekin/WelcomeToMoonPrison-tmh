var intId = [];
var stringArray = [];
var newClassArray = [];
var curLine = [];
var screenBreakCheck = false;                          // evil globals to be removed

/*
screenPause parameter: time to pause before fadeTime - default 500
element: state specific classes or elements to remove in an array - must incule tage (i.e. '.msg' or '#bigOldTitle') - default .msg and .pbreaks
fadeTime: time for elements to fade out

screenPause tends to be equal or sometimes greater than fadeTime slightly
*/
function clearScreen (screenPause = 500, element = ['.msg'], fadeTime = 500) {
  console.log('clearing screen');
  setTimeout(function (){
      for (var i = 0; i < element.length; i++) {
        $(element[i]).fadeOut(fadeTime);
      }
  }, screenPause);
  setTimeout(function () {
    for (var i = 0; i < element.length; i++) {
      $(element[i]).remove();
    }
  }, fadeTime + screenPause);
}

var revealByLetter = function (targetChild, stringWordArray, interval, i, stringLength, count, fadeLength) {
  setTimeout(function () {
  for (var j = 0; j < stringWordArray[i].length; j++) {
    $('#' + targetChild + count + 'span' + i + 'letter' + j).delay(interval * j).fadeTo(fadeLength, 1);  // delays letter
  }
}, interval * stringLength);                                         // delays word
};

var revealByWord = function(targetChild, stringWordArray, interval, stringLength, count, byWord = 0, fadeLength = 0) {
  for (var i = 0; i < stringWordArray.length; i++) {
    if (!byWord) {
      revealByLetter(targetChild, stringWordArray, interval, i, stringLength, count, fadeLength);  // to continue to letter reveal
    } else {
      $('#' + targetChild + count + 'span' + i).children().delay(stringLength * interval).fadeTo(fadeLength, 1);
    }
      stringLength = stringWordArray[i].length + stringLength;
  }
};

var showTextByLetter = function (targetChild, count, word, wordSpan, index, letterIndex, interval, fadeLength, byWord) {
  if (letterIndex < word.length) {
    var letterSpan = document.createElement('span');
    $(wordSpan).append(letterSpan);
    $(letterSpan).attr('id', targetChild + count + 'span' + (index - 1) + 'letter' + letterIndex).attr('class', 'anyText').css('opacity', '0');
    $(letterSpan).append(word[letterIndex++]);
    showTextByLetter(targetChild, count, word, wordSpan, index, letterIndex, interval, fadeLength, byWord);
  }
};

var showTextByWord = function (targetChild, targetParent, message, index, interval, count, fadeLength, byWord) {                        // TODO add screenSkip functionaility back in or maybe not
  var stringWordArray = message.split(' ');
  if (index < stringWordArray.length) {
    var wordSpan = document.createElement('span');
    $('#' + targetChild + count).append(wordSpan);
    $(wordSpan).attr('id', targetChild + count + 'span' + index).attr('class', 'anyText');
    var letterIndex = 0;
    showTextByLetter(targetChild, count, stringWordArray[index++], wordSpan, index, letterIndex, interval, fadeLength, byWord);

    $(wordSpan).append('\xa0');
    showTextByWord(targetChild, targetParent, message, index, interval, count, fadeLength, byWord);
  } else {
    var stringLength = 0;
      revealByWord(targetChild, stringWordArray, interval, stringLength, count, fadeLength, byWord);
  }
};

/*var showText = function (targetChild, targetParent, message, index, interval, count) {
  if (index < message.length) {
    $(targetChild + count).append(message[index++]);
    $(document).bind('click.screenSkip', function () {
      interval = 5;
      //index = message.length + 1;
      if(!screenBreakCheck) {
          screenBreakCheck = true;
        screenBreak(targetChild, targetParent, count, index);
    }

      $(document).unbind('click.screenSkip');
    });
    if (index >= message.length) {
      $(document).unbind('click.screenSkip');
    }
    setTimeout(function () { showText(targetChild, targetParent, message, index, interval, count); }, interval);
  }
};

var screenBreak = function (targetChild, targetParent, count, index) {
    var loopNum = stringArray.length;
    setTimeout(function () {
  for (var i = count; i < loopNum - 1; i++) {
      console.log(i);
    clearTimeout(curLine[i + 1]);
    $(targetChild + (i + 1)).html('');
    showLine(stringArray[i + 1], 5, 0, 1, undefined, newClassArray[i + 1]);
    }
}, 50);
};    */                                                                          // now deprecated


/*
stringLine is the message, write as a string.
interval is the rate each letter appears in ms
skip will remove any delay, will not wait for previous lines to be displayed
extra pauses after a line for extra effect(default:250ms)
check must be 1 if the line is the last before a refresh (resets data like this.totalDelay).
*/
var showLine = function (stringLine, interval, check, skip, extra, newClass, fadeLength, byWord) {
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
  var count = this.count;
  var newPara = document.createElement('p');
  newPara.setAttribute('id', 'msg' + count);
  newPara.setAttribute('class', 'msg');
  if(!(newClass === undefined)) {
      newPara.className += ' ' + newClass;
  }
  $('#txtDiv').append(newPara);

  /*var lineBreak = document.createElement('br');
  lineBreak.setAttribute('class', 'pBreaks');
  $('#txtDiv').append(lineBreak);*/                                     // replaced with margin-top  in css, might cause bugs?
  curLine[count] = setTimeout(function () { showTextByWord('msg', '#txtDiv', stringLine, 0, interval, count, fadeLength, byWord); }, this.totalDelay);
  newClassArray[count] = newClass;
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
function switchOnClick (conditionArray, fadeTargetArray, messageArray, callToFunction) {
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
              showLine(messageArray[i], 25, 0, 1, undefined, 'responses');
             if(($('#txtDiv p').length > 4)) {
               $('#msg' + ($('#txtDiv p').length - 4)).fadeOut(100);
               //$('#txtDiv').find('br').remove();                              //since pBreaks removed
             }
          }
      }
    }
    }
  }


function answerActive(answer, option) {
    console.log(answer);
    if($(answer).css('opacity') > 0) {
    $('<span id="selector">_</span>').insertBefore($(answer).children(":first-child")); // FIXME for some reason a shitload of underscores a spawned if only the underscore if hovered over
    }
}

function answerInactive(answer, option) {
    $('span#selector').remove();
}

function answerSelecting(answer, option, altOption, i) {
  if (altOption === '' || undefined) {
    // code here eventually                              // TODO add some feedback like a dimming effect on pressdown
  } else {
    $(answer).html('\xa0' + altOption);
    setTimeout(function () {
        // code here eventually                             // TODO add some feedback like a dimming effect on pressdown
        $('span#selector').remove();
        $(answer).html('');
        showTextByWord('ansOp', '#ansDiv', option, 0, 50, i);
    }, 500);
  }
}

function answerSelected(answer, option, i) {
                                                                // Shouldn't be used as mouse region changes with submessages
}

function answerActivation (answers, options, altOptions) {
    var underscoreBlink;
  for (var i = 0; i < answers.length; i++) {
  (function (i) {
      $(answers[i]).on('mouseover', function () {
        answerActive(answers[i], options[i]);
        underscoreBlink = setInterval(function () {
            $('#selector').fadeTo(200, 0.1).delay(100).fadeTo(200, 1);
        }, 500);
      });
      $(answers[i]).on('mouseleave', function () {
        answerInactive(answers[i], options[i]);
        clearInterval(underscoreBlink);
      });
      $(answers[i]).on('mousedown', function () {
        answerSelecting(answers[i], options[i], altOptions[i], i);
      });
      $(answers[i]).on('mouseup', function () {
        answerSelected(answers[i], options[i], i);
        clearInterval(underscoreBlink);
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

    /*var lineBreak = document.createElement('br');
    lineBreak.setAttribute('class', 'pBreaks');
    $('#ansDiv').append(lineBreak); */                              // removal of pBreaks makes this unecessary

    showTextByWord('ansOp', '#ansDiv', options[i], 0, 50, i);
    }
    answerActivation(answers, options, altOptions);
    }, ansDel);
  }


var addAudio = function (id, location, startTime = 0) {
  var audio = document.createElement('audio');
  $('body').append(audio);
  $(audio).attr('id', id).attr('src', location);
  audio.currentTime = startTime;
};

var stopAudio = function (id, fade) {
  $('#' + id).get(0).pause();
  if(!(fade === undefined)) {
    // code here if needed
  }
};

var restartAudio = function (id) {
  var audio = $('#' + id);
  audio.get(0).currentTime = 0;
};

var playAudio = function (id) {
  $('#' + id).get(0).play();

};

function nextScreenLoader (functionToRun, screenPause) {
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
      clearScreen(1000, ['.msg', '.pBreaks'], screenPause);
      setTimeout(function () { functionToRun(); }, screenPause + 1000);
      }
  });
}

function loadScene (sceneScriptFile) {
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

function gameStart () {
  loadScene('/scenes/opening.js');
}

window.onload = gameStart;
