function starredStep(clickCounter) {
    /*
    create an element, append element to body, append * to element
    have css position (i.e top(static), left(dynamic) change by distance relative to window width and clickInterval size).
    give element a fadeOut and animated movement upwards from bottom of screen
    selectable font size? or also dependant on window width and cllick interval size?
    */
}

function alternateClicks(clickInterval, audioInterval, leftClickTimer, rightClickTimer, animElements, gainConvolver, gainControl) {       // bug of undetermined cause makes bindings stop functioning after sometime (might be fixed)
  $(document).one('mousedown', function (e) {
    $(document).bind('contextmenu', function (e) {
      e.preventDefault();
      return false;
    });
    if (e.which === 1) {
        gainConvolver.gain.value = 0;
        gainControl.gain.value = 1;

        var rightReverbTimer, leftReverbTimer;
        clearTimeout(rightClickTimer);
        clearTimeout(rightReverbTimer);

      for (var i = 0; i < (animElements[0].length + 3) / 4; i++) {
        $('#animElem0span' + ((animElements[0].length + 3) / 4 + i - 1)).fadeTo(i * (clickInterval / 6) + 500, 1);
        $('#animElem0span' + ((animElements[0].length + 3) / 4 - i - 1)).fadeTo(i * 0.5 * (clickInterval / 6), 0);
      }
      $('#instructorLeft').fadeTo(clickInterval / 6, 0);
      setTimeout(function () {
        $('#instructorRight').fadeTo(clickInterval / 2, 1);
    }, clickInterval / 2 + 300);

      if(($('#einstein').get(0).paused)) {
        $('#einstein').get(0).play();
      }

      leftClickTimer = setTimeout(function () {
          gainConvolver.gain.value = 1;
          gainControl.gain.value = 0;
          setTimeout(function () {
              stopAudio('einstein');
          }, 100);
      }, audioInterval);


      setTimeout(function () {
        $(document).unbind('contextmenu');

        $(document).bind('contextmenu', function (e) {
          e.preventDefault();

          gainConvolver.gain.value = 0;
          gainControl.gain.value = 1;

          clearTimeout(leftClickTimer);
          clearTimeout(leftReverbTimer);

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

          rightClickTimer = setTimeout(function () {
              gainConvolver.gain.value = 1;
              gainControl.gain.value = 0;
              setTimeout(function () {
                  stopAudio('einstein');
              }, 100);
          }, audioInterval);

          setTimeout(function () {
                $(document).unbind('contextmenu');
                alternateClicks(clickInterval, audioInterval, leftClickTimer, rightClickTimer, animElements, gainConvolver, gainControl);
          }, clickInterval);
        });
      }, clickInterval);
    }
  });
}

//function setupWebAudio() {
    /* var audio = document.getElementById('einstein');
    var context = new AudioContext();
    var source = context.createMediaElementSource(audio);
    var convolver = context.createConvolver();
    var irRRequest = new XMLHttpRequest();
    irRRequest.open("GET", "./audio/impulses/PrimeLong.aiff", true);
    irRRequest.responseType = "arraybuffer";
    irRRequest.onload = function() {
        context.decodeAudioData( irRRequest.response,
            function(buffer) { convolver.buffer = buffer; } );
    }
    irRRequest.send();
// note the above is async; when the buffer is loaded, it will take effect, but in the meantime, the sound will be unaffected.

    source.connect( convolver );
    convolver.connect( context.destination ); */ // without tuna method

/*    var context = new AudioContext();
    var tuna = new Tuna(context);
    var audio = $('#einstein').get(0);
    var source = context.createMediaElementSource(audio);
    var gainControl = context.createGain();


    var convolver = new tuna.Convolver({
    highCut: 10000,                         //20 to 22050
    lowCut: 20,                             //20 to 22050
    dryLevel: 1,                            //0 to 1+
    wetLevel: 1,                            //0 to 1+
    level: 1,                               //0 to 1+, adjusts total output of both wet and dry
    impulse: "./audio/impulses/PrimeLong.wav",    //the path to your impulse response
    bypass: 0
    });

    source.connect(convolver);
    source.connect(gainControl);
    console.log(convolver);
    convolver.connect(gainControl)
    gainControl.connect(context.destination);
    console.log('starting source');

    return convolver;
} */


function startWalking () {
  addAudio('einstein', './audio/EOTB.webm', 22);
  showLine('That\'s right...', 50, 1);
  showLine('It wasn\'t just munching...', 50);
  showLine('There was also something else...', 50);


  // Audio dealings
  var context = new AudioContext();
  var tuna = new Tuna(context);
  var audio = $('#einstein').get(0);
  var source = context.createMediaElementSource(audio);
  var gainControl = context.createGain();
  var gainConvolver = context.createGain();


  var convolver = new tuna.Convolver({
  highCut: 10000,                         //20 to 22050
  lowCut: 20,                             //20 to 22050
  dryLevel: 1,                            //0 to 1+
  wetLevel: 1,                            //0 to 1+
  level: 1,                               //0 to 1+, adjusts total output of both wet and dry
  impulse: "./audio/impulses/PrimeLong.wav",    //the path to your impulse response
  bypass: 0
  });

  source.connect(gainControl);
  source.connect(convolver);
  convolver.connect(gainConvolver);
  gainConvolver.connect(context.destination);
  gainControl.connect(context.destination);

  //$('#einstein').on('canplay', function () {
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
      var leftClickTimer, rightClickTimer;

      alternateClicks(900, 1400, leftClickTimer, rightClickTimer, animElements, gainConvolver, gainControl);
    }, 4500);
  //});
}

function munchResult (result) {
  if (result) {
    clearScreen(0, ['.msg'], 0);
    nextScreenLoader(startWalking, 0);
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
      var stop = 0;
      clearTimeout(audioTimer);
      munchCounter += 1;

      if (munchCounter > 3) {
          munchCounter = 1;
      }

      munchTotal += 1;

      var k = Math.floor(Math.random() * 7);
      var j = Math.floor(Math.random() * 5);

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
