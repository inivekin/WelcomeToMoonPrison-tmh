var context, bufferLoader;

function clickAnimations (e, animElements, clickInterval, audioInterval) {
    var left = 0, right = 0;

    if (e === 1) {
        for (var i = 0; i < (animElements[0].length + 3) / 4; i++) {
          $('#animElem0span' + ((animElements[0].length + 3) / 4 + i - 1)).fadeTo(i * (clickInterval / 6) + audioInterval - clickInterval, 1);
          $('#animElem0span' + ((animElements[0].length + 3) / 4 - i - 1)).fadeTo(i * 0.5 * (clickInterval / 6), 0);
        }
        $('#instructorLeft').fadeTo(clickInterval / 6, 0);
        setTimeout(function () {
          $('#instructorRight').fadeTo(clickInterval / 2, 1);
      }, clickInterval / 2 + ((audioInterval + 100 - clickInterval) / 2));
    } else {
        for (var i = 0; i < animElements[0].length / 2; i++) {
          $('#animElem0span' + ((animElements[0].length + 3) / 4 - i - 1)).fadeTo(i * (clickInterval / 6) + audioInterval - clickInterval, 1);
          $('#animElem0span' + ((animElements[0].length + 3) / 4 + i - 1)).fadeTo(i * 0.5 * (clickInterval / 6), 0);
        }

        $('#instructorRight').fadeTo(clickInterval / 6, 0);
        setTimeout(function () {
          $('#instructorLeft').fadeTo(clickInterval / 2, 1);
      }, clickInterval / 2 + ((audioInterval + 100 - clickInterval) / 2));
    }
}

function starredStep (clickCounter, clickInterval) {
    var stepStar = document.createElement('div');
    $(stepStar).css({
      'display'  : 'block',
      'position' : 'absolute',
      'left'     : clickCounter * ($(window).width() / ((1850 - clickInterval) * 0.01)) - ($(window).width() / ((1850 - clickInterval) * 0.01)) + 'px',
      'bottom'   : '2%',
      'font-size': ($(window).width() / (1700 - clickInterval)) * 20 + 'px'
    }).appendTo('body').html('*').attr('class', 'anyText').attr('id', 'starStep' + clickCounter).animate({
      'opacity': '0',
      'bottom': '7%',
      'font-size': '+=20px'
    }, 1000);
    setTimeout(function () {
      $('#starStep' + clickCounter).remove();
    }, 1100);
}

function resumeSong (bufferList, offset, eotbSong, ignored = 1) {
    var song = context.createBufferSource();

    if (!ignored) {
        var tuna = new Tuna(context);

        var convolver = new tuna.Convolver({
        highCut: 10000,                         //20 to 22050
        lowCut: 20,                             //20 to 22050
        dryLevel: 1,                            //0 to 1+
        wetLevel: 1,                            //0 to 1+
        level: 1,                               //0 to 1+, adjusts total output of both wet and dry
        impulse: "./audio/impulses/PrimeLong.wav",    //the path to your impulse response
        bypass: 0
        });
        var gainControl = context.createGain();
        var gainConvolver = context.createGain();

        convolver.connect(gainConvolver);
        gainControl.connect(context.destination);
        gainConvolver.connect(context.destination);
        song.connect(convolver);
        song.connect(gainControl);
    } else {
        eotbSong.convolver.connect(eotbSong.gainConvolver);
        eotbSong.gainControl.connect(context.destination);
        eotbSong.gainConvolver.connect(context.destination);
        song.connect(eotbSong.convolver);
        song.connect(eotbSong.gainControl);
    }

    song.buffer = bufferList[0];

    song.start(0, offset)

    return {song : song, gainControl : gainControl, gainConvolver : gainConvolver, convolver : convolver}
}

function continueSong() {

}

function alternateClicks(e1, clickInterval, audioInterval, animElements, bufferList, eotbSong, whichClick = 2, offset = 22, clickCounter = 0) {
    $(document).bind('contextmenu.prevention', function (e2) {
      e2.preventDefault();
      return false;
    });

    clickCounter += 1;

    eotbSong.gainConvolver.gain.value = 0;
    eotbSong.gainControl.gain.value = 1;

    clickAnimations(e1.which, animElements, clickInterval, audioInterval);

    starredStep(clickCounter, clickInterval);

    whichClick = e1.which;

    // start clickInterval
    var clickIntervalTimer = setTimeout(function () {
        console.log('clickInterval start');
        $(document).bind('mousedown.clickInterval', function (e3) {
            if (e3 !== whichClick) {
                $(document).unbind('mousedown.clickInterval');
                clearTimeout(clickIntervalTimer);
                clearTimeout(audioIntervalTimer);
                alternateClicks(e3, clickInterval, audioInterval, animElements, bufferList, eotbSong, whichClick, offset);
            }
        });
        // start audioInterval
        var audioIntervalTimer = setTimeout(function() {
            console.log('audioInterval start');
            $(document).unbind('mousedown.clickInterval');
            eotbSong.gainConvolver.gain.value = 1;
            eotbSong.gainControl.gain.value = 0;
            offset = context.currentTime + 22;
            eotbSong.song.stop();

            $(document).bind('mousedown.audioInterval', function (e3) {
                if (e3 !== whichClick) {
                    $(document).unbind('mousedown.audioInterval');
                    eotbSong = resumeSong(bufferList, offset, eotbSong);
                    alternateClicks(e3, clickInterval, audioInterval, animElements, bufferList, eotbSong, whichClick, offset);
                }
            });
        }, audioInterval - clickInterval);
    }, clickInterval);
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

function bufferAudioSetup() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    bufferLoader = new BufferLoader(
      context,
      [
        '../audio/EOTB.ogg'
      ],
      startWalkingIntro
      );

    bufferLoader.load();
}

function startWalkingIntro (bufferList) {
  addAudio('einstein', './audio/EOTB.webm', 22);
  showLine('That\'s right...', 50, 1);
  showLine('It wasn\'t just munching...', 50);
  showLine('There was also something else...', 50);

    setTimeout(function () {
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
      var clickTimer, eotbSong = {};
      $(document).one('mousedown', function (e1) {
          eotbSong = resumeSong(bufferList, 22, eotbSong, 0);
      alternateClicks(e1, 900, 1400, animElements, bufferList, eotbSong);
    });
    }, 4500);
}

function munchResult (result) {
  for (var i = 0; i < 7; i++) {
    removeAudio('munchEffect' + i, './audio/munching/munch' + i + '.mp3');
  }
  for (var j = 0; j < 5; j++) {
    removeAudio('crunchEffect' + j, './audio/munching/crunch' + j + '.mp3');
  }
  for (var k = 0; k < 5; k++) {
    removeAudio('gruntEffect' + k, './audio/munching/grunt' + k + '.mp3');
  }
  removeAudio('starvingEffect', './audio/munching/starvation.mp3');
  if (result) {
    clearScreen(0, ['.msg'], 0);
    nextScreenLoader(bufferAudioSetup, 0);
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
    }, 500);


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
      if ((munchCounter === 3) && (munchTotal % 2 === 0)) {
        if (Math.random() > 0.5) {
          playAudio('gruntEffect' + j);
          console.log('playing grunt');
        }
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
  // stopAudio('shiryu8');
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
    munchResult(1);

    /*
  setTimeout(function () {
    showLine('Welcome to Moon Prison.', 50, 1);
    showLine('This is your cell.', 50);
    showLine('A perfect glass room and a sun that never sets.', 50);
    showLine('Amazing.', 100);
    nextScreenLoader(scene1starter, 300);
  }, 200);
  */
});
