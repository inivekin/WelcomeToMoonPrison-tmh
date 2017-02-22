function alternateClicks(clickInterval, audioInterval, leftClickTimer, rightClickTimer, animElements) {
  $(document).one('mousedown', function (e) {
    $(document).bind('contextmenu', function (e) {
      e.preventDefault();
      return false;
    });
    if (e.which === 1) {
      for (var i = 0; i < (animElements[0].length + 3) / 4; i++) {
        console.log(((animElements[0].length + 1) / 2) - i);
        $('#animElem0span' + ((animElements[0].length + 3) / 4 + i - 1)).fadeTo(i * (clickInterval / 6) + 500, 1);
        $('#animElem0span' + ((animElements[0].length + 3) / 4 - i - 1)).fadeTo(i * 0.5 * (clickInterval / 6), 0);
      }
      $('#instructorLeft').fadeTo(clickInterval / 6, 0);
      setTimeout(function () {
        $('#instructorRight').fadeTo(clickInterval / 2, 1);
      }, clickInterval / 2 + 200);

      console.log('left clicked');
      clearTimeout(rightClickTimer);
      if(($('#einstein').get(0).paused)) {
        $('#einstein').get(0).play();
      }
      leftClickTimer = setTimeout(function () {
        stopAudio('einstein');
      }, audioInterval);
      setTimeout(function () {
        $(document).unbind('contextmenu');


        $(document).bind('contextmenu', function (e) {
          e.preventDefault();
          if(($('#einstein').get(0).paused)) {
            $('#einstein').get(0).play();
          }
          for (var i = 0; i < animElements[0].length / 2; i++) {
            $('#animElem0span' + ((animElements[0].length + 3) / 4 - i - 1)).fadeTo(i * (clickInterval / 6) + 500, 1);
            $('#animElem0span' + ((animElements[0].length + 3) / 4 + i - 1)).fadeTo(i * 0.5 * (clickInterval / 6), 0);
          }
          $('#instructorRight').fadeTo(clickInterval / 6, 0);
          setTimeout(function () {
            $('#instructorLeft').fadeTo(clickInterval / 2, 1);
          }, clickInterval / 2 + 200);

          clearTimeout(leftClickTimer);
            console.log('right clicked');
            rightClickTimer = setTimeout(function () {
                stopAudio('einstein');
            }, audioInterval);
            setTimeout(function () {
              alternateClicks(clickInterval, audioInterval, leftClickTimer, rightClickTimer, animElements);
              $(document).unbind('contextmenu');
            }, clickInterval);
          return false;
        });
      }, clickInterval);
    }
  });
}

function startWalking () {
  addAudio('einstein', './audio/EOTB.webm', 22);
  $('#einstein').on('canplay', function () {
    showLine('That\'s right...', 50, 1);
    showLine('It wasn\'t just munching...', 50);
    showLine('There was also something else...', 50);

    setTimeout(function () {
      var instructorLeft = document.createElement('span');
      $('#txtDiv').append(instructorLeft);
      $(instructorLeft).attr('class', 'anyText').html('[left click] ').attr('id', 'instructorLeft').fadeIn(1000);


      var animElements = ['* - - - - - _ - - - - - *'],
          animElemSpans = [];
      for (var i = 0; i < animElements.length; i++) {
        animElemSpans[i] = document.createElement('span');
        $(animElemSpans[i]).attr('id', 'animElem' + i);
        $(animElemSpans[i]).attr('class', 'animElements');
        $('#txtDiv').append(animElemSpans[i]);
        showTextByWord('animElem', '#txtDiv', animElements[i], 0, 0, i);
        console.log((animElements[i].length + 3) / 4 - 1);

      }

      var instructorRight = document.createElement('span');
      $('#txtDiv').append(instructorRight);
      $(instructorRight).attr('class', 'anyText').html('[right click]').attr('id', 'instructorRight');
      $(instructorRight).css('opacity', '0');


      for (var j = 0; j < (animElements[0].length + 1) / 2; j++) {
        if (j === ((animElements[0].length + 3) / 4 - 1)) {
          $('#animElem' + '0' + 'span' + j).fadeIn(1000);// .css('opacity', '1');
          console.log('SEVEN!!!!');
        } else {
          console.log('NOT SEVEN!!!!');
          $('#animElem' + '0' + 'span' + j).css('opacity', '0');
        }
      }
      var leftClickTimer, rightClickTimer;
      alternateClicks(900, 1300, leftClickTimer, rightClickTimer, animElements);
    }, 4500);
  });
}

function munchResult (result) {
  if (result) {
    // you win
    nextScreenLoader(1000, startWalking);
  } else {
    // you starve
    startWalking(1000, startWalking);
  }
}

function starveRelease (heldSounds, loopSounds, munchCounter, totalMunchingAudio, totalStarvingAudio) {
  $(document).one('keyup', function (e) {
    clearInterval(loopSounds);
    clearTimeout(heldSounds);

    var starveCounter = 0;
    playAudio('starvingEffect' + Math.floor(Math.random() * totalStarvingAudio));
    heldSounds = setTimeout(function () {                                       // setTimeout may not be required depending on if set interval pauses at first
      loopSounds = setInterval(function () {
        playAudio('starvingEffect' + Math.floor(Math.random() * totalMunchingAudio));
        starveCounter += 1;
        if (starveCounter > 20) {                                               // depends on interval. Possible addition, increase volume or intensity near end for indication
          munchResult(0);                                                       // escapes loop with starvation
        }
      }, interval);
    }, interval);
    munchPress (heldSounds, loopSounds, munchCounter);
  });
}

function munchPress (heldSounds = 0, loopSounds = 0, munchCounter = 0) {
  var totalMunchingAudio,
      totalStarvingAudio;                                                       // insert when number of files known
  $(document).one('keydown', function (e) {
    if (e === 32) {
      // may want to keep some files separate for only when space is held, if so, just lower totalMunchingAudio boundary here, heighten it in setInterval loop.
      if (!(heldSounds === 0)) {
        clearInterval(loopSounds);
        clearTimeout(heldSounds);
      }
      var i = Math.floor(Math.random() * totalMunchingAudio),
          interval;                                                             // interval depends on general length of files
      playAudio('munchingEffect' + i);
      heldSounds = setTimeout(function () {                                     // setTimeout may not be required depending on if set interval pauses at first
        loopSounds = setInterval(function () {
          playAudio('munchingEffect' + Math.floor(Math.random() * totalMunchingAudio));
          munchCounter += 1;                                                    // Possible addition, increase volume or intensity near end for indication
          if (munchCounter > 40) {
            munchResult(1);
          }
        }, interval);
      }, interval);
      starveRelease(heldSounds, loopSounds, munchCounter, totalMunchingAudio, totalStarvingAudio);
    }
  });
}

function munchingTime () {
  clearScreen(0, ['.selectable', '.msg', '.pBreaks'], 200);
  stopAudio('shiryu8');
  setTimeout(function () {
    showLine('You think.', 50, 1);
    showLine('You think hard.', 50, 0, 0, 750);
    showLine('Nothing is coming.', 50);
    showLine('Thinking of nothing.', 50);
    showLine('Nothing but... munching...', 100);
    showLine('Press [SPACEBAR] to munch to be added', 50, 0, 0, 100, 'afterMessageInstruct');


    nextScreenLoader(startWalking, 1000);
    /*for (var i = 0; i < totalMunchingAudio; i++) {
      addAudio('munchingEffect' + i, './audio/munching/munch' + i);
      addAudio('starvingEffect' + i, './audio/starving/starve' + i);
    }

    var heldSounds,
        loopSounds;
    munchPress(heldSounds, loopSounds); */                                      // activate section when audio ready
  }, 400);
}

function hideOnClick (id, message) {
  $(document).on('click', id, function () {
    showLine(message, 50, true);
    $(id).fadeTo(100, 0);
  });
}


function scene1starter () {
    showLine('What will you do?', 50, true);

    answerOptions(['SIT', 'STAND', 'THINK ABOUT WHAT YOU\'VE DONE'], ['WHY', 'WHY', 'OH GOD WHY']);

    // TODO I will clean this up I swear. It just hurts for me to look at for too long of a period
    $('#ansDiv').on('mousedown', '#ansOp0', function () {
      console.log('clicked sit');
    switchOnClick([$('#ansOp1').css('opacity') === '1' || $('#ansOp1').css('opacity') === '0.5',
                              $('#ansOp1').css('opacity') === '0'],[[0, 1, 1],[0,1,1]], ['You are now sitting.', 'You are now sitting.']);
                            });
    $('#ansDiv').on('mousedown', '#ansOp1', function () {
      console.log('clicked stand');
    switchOnClick([$('#ansOp0').css('opacity') === '1' && $('#ansOp1').css('opacity') === '1',
                              $('#ansOp0').css('opacity') === '0',
                              $('#ansOp1').css('opacity') === '0.5'], [[1, 0, 1],[1, 0, 1],[ 1, 0, 1]], ['You continue to stand mindlessly', 'You are now standing.', 'You\'ve been standing a while, perhaps you should SIT and THINK ABOUT WHAT YOU\'VE DONE.']);
                            });
    $('#ansDiv').on('mousedown', '#ansOp2', function () {
      console.log('clicked think');
    switchOnClick([($('#ansOp1').css('opacity') === '1' && $('#ansOp0').css('opacity') === '1') || ($('#ansOp1').css('opacity') === '0.5' && $('#ansOp0').css('opacity') === '1'),
                              $('#ansOp1').css('opacity') === '1' && $('#ansOp0').css('opacity') === '0',
                              $('#ansOp1').css('opacity') === '0' && $('#ansOp0').css('opacity') === '1'], [[1, 0.5, 1],[0, 0, 0],[1, 0.5, 1]], ['Your knees are weak at the thought', 'finish', 'Your knees are weak at the thought'], munchingTime);
                            });
}


$(document).ready(function () {
  setTimeout(function () {
    showLine('Welcome to Moon Prison.', 50, 1);
    showLine('This is your cell.', 50);
    showLine('A perfect glass room and a sun that never sets.', 50);
    showLine('Amazing.', 100);
    nextScreenLoader(scene1starter, 300);
  }, 200);
});
