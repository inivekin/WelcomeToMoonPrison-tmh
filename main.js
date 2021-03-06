var intId = [];
var stringArray = [];
var newClassArray = [];
var curLine = [];
var screenBreakCheck = false;
var context;
var bufferLoader;                          // evil globals to be fixed
var persistentAudio = {};


/*
screenPause parameter: time to pause before fadeTime - default 500
element: state specific classes or elements to remove in an array - must incule tage (i.e. '.msg' or '#bigOldTitle') - default .msg and .pbreaks
fadeTime: time for elements to fade out

screenPause tends to be equal or sometimes greater than fadeTime slightly
*/
function clearScreen (screenPause = 500, element = ['.msg'], fadeTime = 500) {
  setTimeout(function (){
      for (var i = 0; i < element.length; i++) {
        $(element[i]).fadeOut(fadeTime);
      }
  }, screenPause);
  setTimeout(function () {
    for (var i = 0; i < element.length; i++) {
      $(element[i]).remove();
    }
    clearAnswerOptionBindings();
  }, fadeTime + screenPause);
}

function clearAnswerOptionBindings()
{
  // Unbind old answer option bindings if we had any
  if(this.answerOptionBindings) {
    for(var i = 0; i < this.answerOptionBindings.length; ++i) {
      $('#ansDiv').off('mousedown', this.answerOptionBindings[i]);
    }
    this.answerOptionBindings = [];
  }
}

var revealByLetter = function (targetChild, stringWordArray, interval, i, stringLength, count, fadeLength) {
  setTimeout(function () {
  for (var j = 0; j < stringWordArray[i].length; j++) {
    $('#' + targetChild + count + 'span' + i + 'letter' + j).delay(interval * j).fadeTo(fadeLength, 1);  // delays letter
  }
}, interval * stringLength);                                         // delays word
};

var revealByWord = function(targetChild, stringWordArray, interval, stringLength, count, fadeLength = 0, byWord = 0) {
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
  if(newClass !== undefined) {
      newPara.className += ' ' + newClass;
  }
  $('#txtDiv').append(newPara);

  /*var lineBreak = document.createElement('br');
  lineBreak.setAttribute('class', 'pBreaks');
  $('#txtDiv').append(lineBreak);*/                                     // replaced with margin-top  in css, might cause bugs?
  curLine[count] = setTimeout(function () { showTextByWord('msg', '#txtDiv', stringLine, 0, interval, count, fadeLength, byWord); }, this.totalDelay);
  newClassArray[count] = newClass;
  stringArray[count] = stringLine;

  if (newClass !== 'openingText' && newClass !== 'openingText openingText1stLine' && byWord !== 1) {
     blathering(stringArray[count].length, interval, this.totalDelay, count, extra);
  }

  this.oldInterval = interval;
  this.totalDelay = this.totalDelay + (stringArray[count].length * this.oldInterval) + (extra === undefined ? 500 : extra);
  this.count = count + 1;
};

function blathering (stringLength, interval, delay, count, extra) {
    var i = Math.floor(Math.random() * 3);
    setTimeout(function () {
        persistentAudio['blather' + i] = context.createBufferSource();
        persistentAudio['blather' + i].buffer = persistentAudio['bufferList'][i];
        persistentAudio['blather' + i].loop = true;
        persistentAudio['blather' + i].connect(context.destination);
        persistentAudio['blather' + i].start(0);                                // TODO add in slower playback for greater interval (http://www.github.com/urtzurd/html-audio/)
        setTimeout(function () {
            persistentAudio['blather' + i].stop();
        }, stringLength * interval);
    }, delay);
}

/*
conditionArray: is an array of conditions to pass for the corresponding arrays to be run
fadeTargetArray: a 2 dimensional array, one row for each condition, affects only ansOp elements for now but can be eaily changed if needed
messageArray: 1 diimensional array, will print a message for each corresponding condition. If message is 'finish', will run optional function (callToFunction)
*/
function switchOnClick (conditionArray, fadeTargetArray, messageArray, callToFunction) {
    for (var i = 0; i < conditionArray.length; i++) {
      if(conditionArray[i]) {
      for (var j = 0; j < fadeTargetArray.length; j++) {
        $('#ansOp' + j).fadeTo(100, fadeTargetArray[i][j]);
        }
        if(messageArray[i] !== undefined) {
          if (messageArray[i] === 'finish') {
             callToFunction(arguments[4]);
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
    if($(answer).css('opacity') > 0) {
    $('<span id="selector" class="anyText">_</span>').insertBefore($(answer).children(":first-child"));
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

function answerOptions (options, altOptions, optionCallbacks = false) {
  var answers = [], ansDel;
  for (var i = 0; i < stringArray.length; i++) {
    ansDel = stringArray[i].length * 50;
  }
  setTimeout(function () {
    var opID;
    for (var i = 0; i < options.length; i++) {
      opID = 'ansOp' + i;
      answers[i] = document.createElement('p');
      answers[i].setAttribute('id', opID);
      answers[i].setAttribute('class', 'selectable');
      $('#ansDiv').append(answers[i]);

      /*var lineBreak = document.createElement('br');
        lineBreak.setAttribute('class', 'pBreaks');
        $('#ansDiv').append(lineBreak); */                              // removal of pBreaks makes this unecessary

      showTextByWord('ansOp', '#ansDiv', options[i], 0, 50, i);
      if(optionCallbacks) {
        $('#ansDiv').on('mousedown', '#' + opID, optionCallbacks[i]);
        if(!this.answerOptionBindings) {
          this.answerOptionBindings = [];
        }
        this.answerOptionBindings.push('#' + opID);
      }
    }
    answerActivation(answers, options, altOptions);
  }, ansDel);
}

function alternateClicks (clickInterval, audioInterval, clickFunctions, condition, leftClickTimer = 0, rightClickTimer = 0, clickCounter = 0) {
  $(document).one('mousedown', function (e) {
    $(document).bind('contextmenu', function (e) {
      e.preventDefault();
      return false;
    });
    if (e.which === 1) {
        clickFunctions[0]();
        clearTimeout(rightClickTimer);

      leftClickTimer = setTimeout(function () {
        clickFunctions[2]();
      }, audioInterval);

      if (condition()) {
          clearTimeout(leftClickTimer);
          clearTimeout(rightClickTimer);
          clickFunctions[4]();
      } else {
          setTimeout(function () {
            $(document).unbind('contextmenu');
            $(document).bind('contextmenu', function (e) {
              e.preventDefault();
              clickFunctions[1]();
              clearTimeout(leftClickTimer);

              rightClickTimer = setTimeout(function () {
                clickFunctions[3]();
              }, audioInterval);

              setTimeout(function () {
                $(document).unbind('contextmenu');
                if (condition()) {
                  clearTimeout(leftClickTimer);
                  clearTimeout(rightClickTimer);
                  clickFunctions[4]();
                } else {
                    alternateClicks (clickInterval, audioInterval, clickFunctions, condition, leftClickTimer, rightClickTimer, clickCounter);
                }
                return false;
              }, clickInterval);
            });
          }, clickInterval);
      }
    } else {
        alternateClicks (clickInterval, audioInterval, clickFunctions, condition, leftClickTimer, rightClickTimer, clickCounter);
    }
    return false;
  });
}

function animateClickIndicator(click, animElements, clickInterval, audioInterval) {
  if (click === 'left') {
    for (var i = 0; i < (animElements[0].length + 3) / 4; i++) {
      $('#animElem0span' + ((animElements[0].length + 3) / 4 + i - 1)).fadeTo(i * (clickInterval / 6) + audioInterval - clickInterval, 1);
      $('#animElem0span' + ((animElements[0].length + 3) / 4 - i - 1)).fadeTo(i * 0.5 * (clickInterval / 6), 0);
    }
    $('#instructorLeft').fadeTo(clickInterval / 6, 0);
    setTimeout(function () {
      $('#instructorRight').fadeTo(clickInterval / 2, 1);
    }, clickInterval / 2 + ((audioInterval + 100 - clickInterval) / 2));
  } else if (click === 'right') {
    for (var j = 0; j < animElements[0].length / 2; j++) {
      $('#animElem0span' + ((animElements[0].length + 3) / 4 - j - 1)).fadeTo(j * (clickInterval / 6) + audioInterval - clickInterval, 1);
      $('#animElem0span' + ((animElements[0].length + 3) / 4 + j - 1)).fadeTo(j * 0.5 * (clickInterval / 6), 0);
    }
    $('#instructorRight').fadeTo(clickInterval / 6, 0);
    setTimeout(function () {
      $('#instructorLeft').fadeTo(clickInterval / 2, 1);
    }, clickInterval / 2 + ((audioInterval + 100 - clickInterval) / 2));
  }
}

function createClickIndicators() {
  var instructorLeft = document.createElement('span');
  $('#txtDiv').append(instructorLeft);
  $(instructorLeft).attr('class', 'anyText').html('[left click]').attr('id', 'instructorLeft').fadeIn(2000);

  var animElements = ['* - - - - - _ - - - - - *'],
  animElemSpans = [];
  for (var i = 0; i < animElements.length; i++) {
    animElemSpans[i] = document.createElement('span');
    $(animElemSpans[i]).attr('id', 'animElem' + i);
    $(animElemSpans[i]).attr('class', 'animElements');
    $('#txtDiv').append(animElemSpans[i]);
    showTextByWord('animElem', '#txtDiv', animElements[i], 0, 0, i);

  }

  var instructorRight = document.createElement('span');
  $('#txtDiv').append(instructorRight);
  $(instructorRight).attr('class', 'anyText').html('[right click]').attr('id', 'instructorRight');
  $(instructorRight).css('opacity', '0');

  for (var j = 0; j < (animElements[0].length + 1) / 2; j++) {
    if (j === ((animElements[0].length + 3) / 4 - 1)) {
      $('#animElem' + '0' + 'span' + j).fadeIn(2000);// .css('opacity', '1');
    } else {
      $('#animElem' + '0' + 'span' + j).css('opacity', '0');
    }
  }
  return animElements;
}

function BufferLoader(context, urlList, callback) {
    console.log('loading buffer');
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
    };

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    };

    request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};

var addAudio = function (id, location, startTime = 0, loop = false) {
  var audio = document.createElement('audio');
  $('body').append(audio);
  $(audio).attr('id', id).attr('src', location).attr('loop', loop);
  audio.currentTime = startTime;
};

var removeAudio = function(id) {
  var audio = document.getElementById(id);
  $(audio).remove();
};

var stopAudio = function (id, fade) {
  $('#' + id).get(0).pause();
  if(!(fade === undefined)) {
    // code here if needed
  }
};

var restartAudio = function (id, startTime = 0) {
  var audio = $('#' + id);
  audio.currentTime = startTime;
  audio.get(0).play();
};

var playAudio = function (id) {
  $('#' + id).get(0).play();

};

function nextScreenLoader (functionToRun, screenPause) {
  var nextScreenLoader = setTimeout(function () {
  //  $(document).unbind('mousedown.screenBreak');
    nextScreenLoader.noBreakCheck = true;
    clearScreen(100, ['.msg'], screenPause);
    setTimeout(function () { functionToRun(); }, screenPause + 100);
    }, this.totalDelay);

  /* $(document).bind('mousedown.screenBreak', function () {
    $(document).unbind('mousedown.screenBreak');
      if (!nextScreenLoader.noBreakCheck) {
      clearTimeout(nextScreenLoader);
      clearScreen(1000, ['.msg', '.pBreaks'], screenPause);
      setTimeout(function () { functionToRun(); }, screenPause + 1000);
      }
  }); */
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

function loadScene0 () {
  $('#ansDiv').off('mousedown.answering');
  loadScene('/scenes/opening.js');
  clearScreen(0, ['.msg', '.selectable'], 0);
}
function loadScene1() {
  $('#ansDiv').off('mousedown.answering');
  loadScene('/scenes/scene1.js');
  clearScreen(0, ['.msg', '.selectable'], 0);
}

function loadScene2() {
  $('#ansDiv').off('mousedown.answering');
  loadScene('/scenes/scene2.js');
  clearScreen(0, ['.msg', '.selectable'], 0);
}

function loadScene3() {
  $('#ansDiv').off('mousedown.answering');
  loadScene('/scenes/scene3.js');
  clearScreen(0, ['.msg', '.selectable'], 0);
}

function loadScene4() {
  $('#ansDiv').off('mousedown.answering');
  loadScene('/scenes/scene4.js');
  clearScreen(0, ['.msg', '.selectable'], 0);
}

function loadScene5() {
  $('#ansDiv').off('mousedown.answering');
  loadScene('/scenes/scene5.js');
  clearScreen(0, ['.msg', '.selectable'], 0);
}

function openingAudio() {
    bufferLoader = new BufferLoader(
        context,
        [
            '../audio/blathermouth1.mp3',
            '../audio/blathermouth2.mp3',
            '../audio/blathermouth3.mp3'
        ],
        sceneSelector
    );

    bufferLoader.load();
}

function sceneSelector (bufferList) {
  showLine('SELECT A SCENE', 50, 1);
  answerOptions(['OPENING', 'SCENE 1', 'SCENE 2', 'SCENE 3', 'SCENE 4', 'SCENE 5'],['DONE-ISH', 'IN PROG', 'IN PROG', 'IN PROG', 'TBD', 'TBD']);
  $('#ansDiv').on('mousedown.answering', '#ansOp0', function () {
    switchOnClick([$('#ansOp0').css('opacity') === '1'], [[0,1,1,1,1,1]], ['finish'], loadScene0);
  });
  $('#ansDiv').on('mousedown.answering', '#ansOp1', function () {
    switchOnClick([$('#ansOp1').css('opacity') === '1'], [[1,0,1,1,1,1]], ['finish'], loadScene1);
  });
  $('#ansDiv').on('mousedown.answering', '#ansOp2', function () {
    switchOnClick([$('#ansOp2').css('opacity') === '1'], [[1,1,0,1,1,1]], ['finish'], loadScene2);
  });
  $('#ansDiv').on('mousedown.answering', '#ansOp3', function () {
    switchOnClick([$('#ansOp3').css('opacity') === '1'], [[1,1,1,0,1,1]], ['finish'], loadScene3);
  });
  $('#ansDiv').on('mousedown.answering', '#ansOp4', function () {
    switchOnClick([$('#ansOp4').css('opacity') === '1'], [[1,1,1,1,0,1]], ['NOT YET, TRY ANOTHER']);
  });
  $('#ansDiv').on('mousedown.answering', '#ansOp5', function () {
    switchOnClick([$('#ansOp5').css('opacity') === '1'], [[1,1,1,1,1,0]], ['OPTIMISTIC... TRY ANOTHER']);
  });

  persistentAudio['bufferList'] = bufferList;

}

function gameStart () {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  openingAudio();
}

window.onload = gameStart;
