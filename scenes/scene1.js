function starredStep(clickCounter) {
    /*
    create an element, append element to body, append * to element
    have css position (i.e top(static), left(dynamic) change by distance relative to window width and clickInterval size).
    give element a fadeOut and animated movement upwards from bottom of screen
    selectable font size? or also dependant on window width and cllick interval size?
    */
}

function alternateClicks(clickInterval, audioInterval, leftClickTimer, rightClickTimer, animElements) {       // bug of undetermined cause makes bindings stop functioning after sometime (might be fixed)
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
    }, clickInterval / 2 + 300);

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
        }, clickInterval / 2 + 300);

          clearTimeout(leftClickTimer);
            console.log('right clicked');
            rightClickTimer = setTimeout(function () {
                stopAudio('einstein');
            }, audioInterval);
            setTimeout(function () {
                $(document).unbind('contextmenu');
                alternateClicks(clickInterval, audioInterval, leftClickTimer, rightClickTimer, animElements);
            }, clickInterval);
          return false;
        });
      }, clickInterval);
    }
  });
}

function startWalking () {
  addAudio('einstein', './audio/EOTB.webm', 22);
  showLine('That\'s right...', 50, 1);
  showLine('It wasn\'t just munching...', 50);
  showLine('There was also something else...', 50);
  $('#einstein').on('canplay', function () {
    setTimeout(function () {
      var instructorLeft = document.createElement('span');
      $('#txtDiv').append(instructorLeft);
      $(instructorLeft).attr('class', 'anyText').html('[left click] ').attr('id', 'instructorLeft').fadeIn(2000);


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
          $('#animElem' + '0' + 'span' + j).fadeIn(2000);// .css('opacity', '1');
          console.log('SEVEN!!!!');
        } else {
          console.log('NOT SEVEN!!!!');
          $('#animElem' + '0' + 'span' + j).css('opacity', '0');
        }
      }
      var leftClickTimer, rightClickTimer;
      alternateClicks(900, 1400, leftClickTimer, rightClickTimer, animElements);
    }, 4500);
  });
}

function munchResult (result) {
  if (result) {
    clearScreen(300, ['.msg'], 300);
    nextScreenLoader(startWalking, 300);
  } else {
    clearScreen(300, ['.msg'], 600);
    setTimeout(function () {
      showLine('You have DIED of STARVATION', 100, 1, 0, 1000, 'starveDeath');
    }, 1300);
  }
}

function starveRelease (audioTimer = 0, munchCounter = 0, munchTotal = 0, starveTimer = 0, starveInterval = 0) {
  var starveInterval = [],
      starveCounter = 0;

      console.log('starve release started');

      starveTimer = setTimeout(function () {
        munchCounter = 0;
        //clearTimeout(audioTimer); not sure why this was here in the first place
      }, 250);

      if (munchTotal > 8) {
          starveCounter = 8;
      } else if (munchTotal > 15) {
          starveCounter = 15;
      } else if (munchTotal > 21) {
          starveCounter = 21;
      } else if (munchTotal > 32) {
          starveCounter = 32;
      }

      var audioTimer = setTimeout(function () {
        //playAudio('starvingEffect');
        restartAudio('starvingEffect', starveCounter);

          starveInterval[munchTotal] = setInterval(function () {
            starveCounter += 1;

            if (starveCounter > 38) {
              clearTimeout(starveTimer);
              for (var i = 0; i < munchTotal + 1; i++) {
                clearInterval(starveInterval[i]);
              }
              stopAudio('starvingEffect');
              munchResult(0);
            }
        }, 1000);
    }, 2000);


    $(document).one('keydown', function (e) {
        console.log('launching munchPress');
      for (var i = 0; i < munchTotal + 1; i++) {
        clearInterval(starveInterval[i]);
      }
      stopAudio('starvingEffect');
      clearTimeout(starveTimer);
      munchPress (e, audioTimer, munchCounter, munchTotal, starveTimer, starveInterval);
    });
}

function munchPress (e, audioTimer = 0, munchCounter = 0, munchTotal = 0, starveTimer = 0, starveInterval = 0) {
    if (e.which === 32) {
        console.log('munchpress launched');
      var stop = 0;
      clearTimeout(audioTimer);
      munchCounter += 1;

      if (munchCounter > 3) {
          munchCounter = 1;
      }

      munchTotal += 1;

      var k = Math.floor(Math.random() * 7);
      var j = Math.floor(Math.random() * 5);
      console.log(munchCounter);

      if (munchCounter === 1) {
          playAudio('munchEffect' + k);
      }

      if (munchCounter === 2) {                         // TODO just improve the implementation
          playAudio('crunchEffect' + j);
      }
      if (munchCounter === 3) {
            playAudio('gruntEffect' + j);
        munchCounter = 0;
      }
      if (munchTotal > 50) {
        clearTimeout(starveTimer);
        for (var i = 0; i < munchTotal + 1; i++) {
          clearInterval(starveInterval[i]);
        }
        munchResult(1);
        stop = 1;
      }
      if (!stop) {
        $(document).one('keyup', function (e) {
        starveRelease(audioTimer, munchCounter, munchTotal, munchTotal, starveTimer, starveInterval);
      });
      }
  }
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
    showLine('Press [SPACEBAR] to munch', 50, 0, 0, 100, 'afterMessageInstruct');


    for (var i = 0; i < 7; i++) {
      addAudio('munchEffect' + i, './audio/munching/munch' + i + '.mp3');
    }
    for (var j = 0; j < 5; j++) {
      addAudio('crunchEffect' + j, './audio/munching/crunch' + j + '.mp3');
    }
    for (var k = 0; k < 5; k++) {
      addAudio('gruntEffect' + k, './audio/munching/grunt' + k + '.mp3');
    }
    addAudio('starvingEffect', './audio/munching/starvation.mp3');

    setTimeout(function () {
      starveRelease();
    }, 5500);
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
                              $('#ansOp1').css('opacity') === '0'],[[0, 1, 1],[0,1,1]], ['You are now sitting. Beautiful.', 'You are now sitting. Beautiful.']);
                            });
    $('#ansDiv').on('mousedown', '#ansOp1', function () {
      console.log('clicked stand');
    switchOnClick([$('#ansOp0').css('opacity') === '1' && $('#ansOp1').css('opacity') === '1',
                              $('#ansOp0').css('opacity') === '0',
                              $('#ansOp1').css('opacity') === '0.5'], [[1, 0, 1],[1, 0, 1],[ 1, 0, 1]], ['You continue to stand. You are thinking nothing.', 'You are now standing. Horrible.', 'You\'ve been standing a while, perhaps you should SIT and THINK ABOUT WHAT YOU\'VE DONE.']);
                            });
    $('#ansDiv').on('mousedown', '#ansOp2', function () {
      console.log('clicked think');
    switchOnClick([($('#ansOp1').css('opacity') === '1' && $('#ansOp0').css('opacity') === '1') || ($('#ansOp1').css('opacity') === '0.5' && $('#ansOp0').css('opacity') === '1'),
                              $('#ansOp1').css('opacity') === '1' && $('#ansOp0').css('opacity') === '0',
                              $('#ansOp1').css('opacity') === '0' && $('#ansOp0').css('opacity') === '1'], [[1, 0.5, 1],[0, 0, 0],[1, 0.5, 1]], ['That would be exhausting.', 'finish', 'That would be exhausting.'], munchingTime);
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
