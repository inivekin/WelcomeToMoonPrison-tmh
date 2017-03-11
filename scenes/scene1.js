var intervalCounter;
var policeTimer;

function caught () {
    clearInterval(policeTimer);
    clearScreen(300, ['.chaserSpeech', '.anyText', '.msg'], 700);
    setTimeout(function () {
        showLine('To be continued...', 50, 1);
    }, 700);
}

function policeman (clickCounter, clickInterval, extra) {
    if (clickCounter === 1) {
        // insert audio hey freeze!
        intervalCounter = 0;
        showLine('FREEZE!', 50, 0, 1, 0, 'chaserSpeech');
        $('.chaserSpeech').css({
            'position'  :   'fixed',
            'left'      :   intervalCounter * ($(window).width() / ((1850 - clickInterval + extra) * 0.01)) - ($(window).width() / ((1850 - clickInterval + extra) * 0.01)) + 'px',
            'top'       :   '75%'
        }).animate({
            'opacity'   :   '0',
            'left'      :   '-=10%'
        }, 2000);

        policeTimer = setInterval(function() {
            intervalCounter += 1;
            starredStep(intervalCounter, clickInterval, extra, '^', 5);
        }, 250);
    } else if (clickCounter === 15) {
        showLine('BANG!', 50, 0, 1, 0, 'chaserSpeech');
        $('.chaserSpeech').css({
            'position'  :   'fixed',
            'left'      :   intervalCounter * ($(window).width() / ((1850 - clickInterval + extra) * 0.01)) - ($(window).width() / ((1850 - clickInterval + extra) * 0.01)) + 'px',
            'top'       :   '75%'
        }).animate({
            'opacity'   :   '0',
            'left'      :   '-=10%'
        }, 2000);
    }
    return (intervalCounter * ($(window).width() / ((1850 - clickInterval + extra) * 0.01)) - ($(window).width() / ((1850 - clickInterval + extra) * 0.01)));
}

function nowRun(bufferList, extra = 10000, clickCounter = 0, policePosition = -1) {
    clearScreen(0, ['.animElem', '.anyText', '.starField', '.msg'], 1000);
    var tuna = new Tuna(context);
    var filter = new tuna.Filter({
        frequency: 3000, //20 to 22050
        Q: 1, //0.001 to 100
        gain: 0, //-40 to 40 (in decibels)
        filterType: "lowpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
        bypass: 0
    });
    var source = context.createBufferSource();
    source.buffer = bufferList[0];
    var gainControl = context.createGain();
    var gainFilter = context.createGain();

    source.connect(filter);
    filter.connect(gainFilter);
    gainFilter.connect(context.destination);
    source.connect(gainControl);
    gainControl.connect(context.destination);
    gainFilter.gain.value = 0.5;
    gainControl.gain.value = 0;

    source.start(0, 12);

  setTimeout(function () {
    showLine('Oh, it was running', 100, 1);
    alternateClicks(0, 0, [
        function () {
            if (clickCounter === 0) {
                gainControl.gain.value = 1;
                filter.disconnect();
            }
            clickCounter += 1;
            starredStep(clickCounter, 100, extra);
            policePosition = policeman(clickCounter, 100, extra);
        },
        function () {
            clickCounter += 1;
            starredStep(clickCounter, 100, extra);
        },
        function () {},
        function () {},
        function () {
          var audioSlowdown = setInterval(function () {
            source.playbackRate.value -= 0.05;
          }, 250);
          setTimeout(function () {
            clearInterval(audioSlowdown);
            source.stop();
            caught();
          }, 5000);
        }], function () {
            return Boolean(policePosition > clickCounter * ($(window).width() / ((1850 - 100 + extra) * 0.01)) - ($(window).width() / ((1850 - 100 + extra) * 0.01))) || (clickCounter > 115);
        });
  }, 1100);
}

function nowRunAudio () {
    bufferLoader = new BufferLoader(
        context,
        [
            '../audio/MoDemJams.webm'
        ],
        nowRun
    );

    bufferLoader.load();
}

function starredStep (clickCounter, clickInterval, extra = 0, text = '*', offset = 1) {
    var stepStar = document.createElement('div');
    $(stepStar).css({
      'display'  : 'block',
      'position' : 'absolute',
      'left'     : clickCounter * ($(window).width() / ((1850 - clickInterval + extra) * 0.01)) - (offset * $(window).width() / ((1850 - clickInterval + extra) * 0.01)) + 'px',
      'bottom'   : '2%',
      'font-size': ($(window).width() / (1700 - clickInterval)) * 20 + 'px'
  }).appendTo('body').html(text).attr('class', 'anyText').attr('id', 'starStep' + clickCounter).animate({
      'opacity': '0',
      'bottom': '7%',
      'font-size': '+=20px'
  }, 1000, 'linear');
    setTimeout(function () {
      $('#starStep' + clickCounter).remove();
    }, 1100);
}

function switchGains(gainNodeArray, toggleArray) {
    for (var i = 0; i < gainNodeArray.length; i++) {
        gainNodeArray[i].gain.value = toggleArray[i];
        console.log('switched gains');
        console.log(gainNodeArray[i]);
        console.log(gainNodeArray[i].gain.value);
    }
}

function animateClickIndicator (click, animElements, clickInterval, audioInterval) {
    console.log('animating indicators');
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

function audioTimeout (audio, offset, startedAt) {
    elapsed = (context.currentTime - startedAt).toFixed(1);                                                 // TODO maybe implement the pausing and starting as its own functions?
    audio['source'].stop();
    console.log('stopped: ' + offset);
    return elapsed;
}

function slowWalk(clickInterval, audioInterval, eotb, animElements, playing = false, condition = 0, clickCounter = 0, offset = 22) {
    var exactInt = clickInterval / 2 + ((audioInterval + 100 - clickInterval) / 2);
    alternateClicks(clickInterval, audioInterval, [
                                function () {
                                    switchGains([eotb['gainConvolver'], eotb['gainControl']],[0,1]);             // at left click
                                    randomStars(clickCounter);
                                    fadeloop('#star' + clickCounter, exactInt, exactInt, true, clickCounter);
                                    animateClickIndicator('left', animElements, clickInterval, audioInterval);
                                    if (!playing) {
                                        console.log('left click: ' + offset);
                                        eotb['source'].start(0, offset);                                        // TODO add a amll fade in to the start of the audio?
                                        playing = true;
                                        startedAt = context.currentTime - offset;
                                    }
                                    clickCounter += 1;
                                    condition = (clickCounter > ((1700 - clickInterval) / 100));
                                },
                                function () {
                                    switchGains([eotb['gainConvolver'], eotb['gainControl']],[0,1]);             // at right click
                                    randomStars(clickCounter);
                                    fadeloop('#star' + clickCounter, exactInt, exactInt, true, clickCounter);
                                    animateClickIndicator('right', animElements, clickInterval, audioInterval);
                                    if (!playing) {
                                        console.log('right click: ' + offset);
                                        eotb['source'].start(0, offset);
                                        playing = true;
                                        startedAt = context.currentTime - offset;
                                    }
                                    clickCounter += 1;
                                    condition = (clickCounter > ((1700 - clickInterval) / 100));
                                },
                                function () {
                                    switchGains([eotb['gainConvolver'], eotb['gainControl']],[1,0]);            // at failed left click
                                        offset = audioTimeout(eotb, offset, startedAt);
                                        playing = false;

                                        eotb['source'] = context.createBufferSource();
                                        eotb['source'].buffer = eotb['bufferList'][0];
                                        eotb['source'].connect(eotb['convolver']);
                                        eotb['source'].connect(eotb['gainControl']);
                                },
                                function () {
                                    switchGains([eotb['gainConvolver'], eotb['gainControl']],[1,0]);            // at failed right click
                                        offset = audioTimeout(eotb, offset, startedAt);
                                        playing = false;

                                        eotb['source'] = context.createBufferSource();
                                        eotb['source'].buffer = eotb['bufferList'][0];
                                        eotb['source'].connect(eotb['convolver']);
                                        eotb['source'].connect(eotb['gainControl']);
                                },
                                function (){                                                              // on reaching click goal (defined by condition)
                                    clearScreen(300, ['.msg'], 700);
                                    $('.animElements').fadeTo(500, 0);
                                    $('#instructorRight').fadeTo(500, 0);
                                    $('#instructorLeft').fadeTo(500, 0);
                                    setTimeout(function () {
                                      if (clickInterval !== 300) {
                                          showLine('What was it?', 50, 1);
                                          $('.animElements').fadeTo(500, 1);
                                          $('#instructorLeft').fadeTo(500, 1);
                                          totalClicks = clickCounter;
                                          slowWalk(300, 700, eotb, animElements, true);
                                      } else {
                                          eotb['source'].stop();
                                          nowRunAudio();
                                      }
                                    }, 1200);
                                }], function () {
                                    return Boolean(clickCounter > ((1700 - clickInterval) / 100) - 1);
                                });
}


function alternateClicks (clickInterval, audioInterval, clickFunction, condition, leftClickTimer = 0, rightClickTimer = 0, clickCounter = 0) {
  $(document).one('mousedown', function (e) {
    $(document).bind('contextmenu', function (e) {
      e.preventDefault();
      return false;
    });
    if (e.which === 1) {
        clickFunction[0]();
        clearTimeout(rightClickTimer);

      leftClickTimer = setTimeout(function () {
        clickFunction[2]();
      }, audioInterval);

      if (condition()) {
          clearTimeout(leftClickTimer);
          clearTimeout(rightClickTimer);
          clickFunction[4]();
      } else {
          setTimeout(function () {
            $(document).unbind('contextmenu');
            $(document).bind('contextmenu', function (e) {
              e.preventDefault();
              clickFunction[1]();
              clearTimeout(leftClickTimer);

              rightClickTimer = setTimeout(function () {
                clickFunction[3]();
              }, audioInterval);

              setTimeout(function () {
                $(document).unbind('contextmenu');
                if (condition()) {
                  clearTimeout(leftClickTimer);
                  clearTimeout(rightClickTimer);
                  clickFunction[4]();
                } else {
                    alternateClicks (clickInterval, audioInterval, clickFunction, condition, leftClickTimer, rightClickTimer, clickCounter);
                }
                return false;
              }, clickInterval);
            });
          }, clickInterval);
      }
    } else {
        alternateClicks (clickInterval, audioInterval, clickFunction, condition, leftClickTimer, rightClickTimer, clickCounter);
    }
    return false;
  });
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

function scene1Audio (bufferList) {

    var tuna = new Tuna(context);
    var source = context.createBufferSource();
    var gainControl = context.createGain();
    var gainConvolver = context.createGain();

    var convolver = new tuna.Convolver({
    highCut: 10000,                         // 20 to 22050
    lowCut: 20,                             // 20 to 22050
    dryLevel: 1,                            // 0 to 1+
    wetLevel: 1,                            // 0 to 1+
    level: 1,                               // 0 to 1+, adjusts total output of both wet and dry
    impulse: './audio/impulses/PrimeLong.wav',    // the path to your impulse response
    bypass: 0
    });

    var eotb = {};
    eotb['source'] = source;
    eotb['convolver'] = convolver;
    eotb['gainControl'] = gainControl;
    eotb['gainConvolver'] = gainConvolver;
    eotb['bufferList'] = bufferList;

    source.buffer = bufferList[0];

    source.connect(gainControl);
    source.connect(convolver);
    convolver.connect(gainConvolver);
    gainConvolver.connect(context.destination);
    gainControl.connect(context.destination);

      setTimeout(function () {
          var animElements = createClickIndicators();
          slowWalk(900, 1400, eotb, animElements);
      }, 2500);
}

function startWalking () {
  showLine('That\'s right...', 50, 1);
  showLine('It wasn\'t just munching...', 50);
  showLine('There was also something else...', 50);

  // Audio dealings
  bufferLoader = new BufferLoader(
      context,
      [
          '../audio/EOTB.ogg'
      ],
      scene1Audio
  );

  bufferLoader.load();
}

function munchResult (result) {
  for (var i = 0; i < 7; i++) {
    removeAudio('munchEffect' + i, './audio/munching/munch' + i + '.mp3');
  }
  for (var j = 0; j < 5; j++) {
    removeAudio('crunchEffect' + j, './audio/munching/crunch' + j + '.mp3');
    removeAudio('gruntEffect' + j, './audio/munching/grunt' + j + '.mp3');
  }
  removeAudio('starvingEffect', './audio/munching/starvation.mp3');

  if (result) {
    clearScreen(300, ['.msg'], 300);
    showLine('', 0, 1);                                                         // added just to clear totalDelay, surely a better way is possible?
    nextScreenLoader(startWalking, 1500);
  } else {
    clearScreen(300, ['.msg'], 600);
    setTimeout(function () {
      showLine('You have DIED of STARVATION', 100, 1, 0, 1000, 'starveDeath');
    }, 1300);
  }
}

function starveRelease (munchingAudio, audioTimer = 0, munchCounter = 0, munchTotal = 0, starveTimer = 0, starveCounter = 0, starveInterval = 0) {
  var starveInterval,
      intervalStarted = false;

      starveTimer = setTimeout(function () {
        munchCounter = 0;
      }, 250);

      console.log(starveCounter);

      if (munchTotal > 8) {
        if (munchTotal > 15) {
          if (munchTotal > 21) {
            if (munchTotal > 32) {
                starveCounter = 32;                                             // TODO add in decimal places to avoid pop in audio
            } else {
              starveCounter = 21;
            }
          } else {
            starveCounter = 15;
          }
        } else {
          starveCounter = 8;
        }
      } else {
        starveCounter = 0;
      }

      var audioTimer = setTimeout(function () {
          munchingAudio['starveSource'].connect(context.destination);
          munchingAudio['starveSource'].start(0, starveCounter);
          intervalStarted = true;

          starveInterval = setInterval(function () {                // interval doesn't clear for some reason, try removing array thing and just have normal variable?
            starveCounter += 1;
            if (starveCounter > 38) {
              clearTimeout(starveTimer);
              clearTimeout(audioTimer);
              clearInterval(starveInterval);
              munchingAudio['starveSource'].stop();
              munchResult(0);
            }
        }, 1000);
    }, 500);


    $(document).one('keydown', function (e) {
      clearInterval(starveInterval);
      if (intervalStarted) {
            munchingAudio['starveSource'].stop();
            munchingAudio['starveSource'] = context.createBufferSource();
            munchingAudio['starveSource'].buffer = munchingAudio['bufferList'][17];
      }
      clearTimeout(starveTimer);
      clearTimeout(audioTimer);
      munchPress (e, munchingAudio, audioTimer, munchCounter, munchTotal, starveTimer, starveCounter, starveInterval);
    });
}

function munchPress (e, munchingAudio, audioTimer = 0, munchCounter = 0, munchTotal = 0, starveTimer = 0, starveCounter = 0, starveInterval = 0) {
    if (e.which === 32) {
      var stop = 0;
      clearTimeout(audioTimer);

      munchCounter += 1;

      if (munchCounter > 3) {
          munchCounter = 1;
      }

      munchTotal += 1;

      k = Math.floor(Math.random() * 7);
      j = Math.floor(Math.random() * 5);

      if (munchCounter === 1) {
          munchingAudio['munchSource' + k].connect(munchingAudio['gainMunchControl']);
          munchingAudio['gainMunchControl'].connect(context.destination);
          munchingAudio['munchSource' + k].connect(munchingAudio['convolver']);
          munchingAudio['convolver'].connect(munchingAudio['gainMunchOverdrive']);
          munchingAudio['gainMunchOverdrive'].connect(context.destination);
          munchingAudio['gainMunchOverdrive'].gain.value = 1 - munchTotal / 50;
          munchingAudio['gainMunchControl'].gain.value = munchTotal / 50;
          munchingAudio['munchSource' + k].start(0);
          munchingAudio['munchSource' + k] = context.createBufferSource();
          munchingAudio['munchSource' + k].buffer = munchingAudio['bufferList'][k];
      }

      if (munchCounter === 2) {
          munchingAudio['crunchSource' + j].connect(munchingAudio['gainCrunchControl']);
          munchingAudio['gainCrunchControl'].gain.value = 0.5 + munchTotal / 20;
          munchingAudio['gainCrunchControl'].connect(context.destination);
          munchingAudio['crunchSource' + j].start(0);
          munchingAudio['crunchSource' + j] = context.createBufferSource();
          munchingAudio['crunchSource' + j].buffer = munchingAudio['bufferList'][7 + j];
      }
      if (munchCounter === 3 && munchTotal % 2 === 0 && munchTotal < 45) {
        if (Math.random() < munchTotal / 50) {
            munchingAudio['gruntSource' + j].connect(munchingAudio['gainGruntControl']);
            munchingAudio['gainGruntControl'].connect(context.destination);
            munchingAudio['gruntSource' + j].connect(munchingAudio['overdrive']);
            munchingAudio['overdrive'].connect(munchingAudio['gainGruntOverdrive']);
            munchingAudio['gainGruntOverdrive'].connect(context.destination);
            munchingAudio['gainGruntControl'].gain.value = munchTotal / 50;
            munchingAudio['gainGruntOverdrive'].gain.value = (munchTotal > 25 ? munchTotal / 75 : 0);
            munchingAudio['gruntSource' + j].start(0);
            munchingAudio['gruntSource' + j] = context.createBufferSource();
            munchingAudio['gruntSource' + j].buffer = munchingAudio['bufferList'][12 + j];
        }
        munchCounter = 0;
      }



      if (munchTotal > 9) {
          if (munchTotal === 10) {
              munchingAudio['chantSource'].connect(munchingAudio['gainChantControl']);
              munchingAudio['gainChantControl'].connect(context.destination);
              // munchingAudio['chantSource'].start(0);
              var munchBlink = setInterval(function () {
                  $('.afterMessageInstruct').fadeTo(250, 0.1).delay(100).fadeTo(250, 1);
              }, 600);
          }
          munchingAudio['gainChantControl'].gain.value = munchTotal / 50;
      }
      if (munchTotal > 50) {
        munchingAudio['gruntSource' + j].connect(munchingAudio['gainGruntControl']);
        munchingAudio['gainGruntControl'].connect(context.destination);
        munchingAudio['gruntSource' + j].connect(munchingAudio['overdrive']);
        munchingAudio['overdrive'].connect(munchingAudio['gainGruntOverdrive']);
        munchingAudio['gainGruntOverdrive'].connect(context.destination);
        munchingAudio['gainGruntControl'].gain.value = munchTotal / 25;
        munchingAudio['gainGruntOverdrive'].gain.value = munchTotal / 75;
        munchingAudio['gruntSource' + j].start(0);
        clearTimeout(starveTimer);
        clearInterval(starveInterval);
        clearInterval(munchBlink);
        munchResult(1);
        stop = 1;
      }
      if (!stop) {
        $(document).one('keyup', function (e) {
        starveRelease(munchingAudio, audioTimer, munchCounter, munchTotal, starveTimer, starveCounter, starveInterval);
      });
      }
  } else {
      $(document).one('keyup', function (e) {
      starveRelease(munchingAudio, audioTimer, munchCounter, munchTotal, starveTimer, starveCounter, starveInterval);
  });
  }
}

function munchingAudio(bufferList) {
    var tuna = new Tuna(context);
    munchingAudio = {};
    for (var i = 0; i < 7; i++) {
        munchingAudio['munchSource' + i] = context.createBufferSource();
        munchingAudio['munchSource' + i].buffer = bufferList[i];
    }
    for (var j = 0; j < 5; j++) {
        munchingAudio['crunchSource' + j] = context.createBufferSource();
        munchingAudio['crunchSource' + j].buffer = bufferList[j + 7];
        munchingAudio['gruntSource' + j] = context.createBufferSource();
        munchingAudio['gruntSource' + j].buffer = bufferList[j + 12];
    }
    munchingAudio['starveSource'] = context.createBufferSource();
    munchingAudio['starveSource'].buffer = bufferList[17];

    munchingAudio['chantSource'] = context.createBufferSource();
    munchingAudio['chantSource'].buffer = bufferList[18];
    munchingAudio['gainChantControl'] = context.createGain();

    munchingAudio['gainMunchOverdrive'] = context.createGain();
    munchingAudio['gainMunchControl'] = context.createGain();
    munchingAudio['gainCrunchControl'] = context.createGain();
    munchingAudio['gainGruntControl'] = context.createGain();
    munchingAudio['gainGruntOverdrive'] = context.createGain();

    var overdrive = new tuna.Overdrive({
    outputGain: 0.1,         //0 to 1+
    drive: 0.5,              //0 to 1
    curveAmount: 0.95,          //0 to 1
    algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
    bypass: 1                                                                   // TODO check to see if overdrive effect is useful
    });

    var convolver = new tuna.Convolver({
    highCut: 7500,                         //20 to 22050
    lowCut: 20,                             //20 to 22050
    dryLevel: 1,                            //0 to 1+
    wetLevel: 3,                            //0 to 1+
    level: 0.5,                               //0 to 1+, adjusts total output of both wet and dry
    impulse: "./audio/impulses/PrimeShort.wav",    //the path to your impulse response
    bypass: 0
});

    munchingAudio['convolver'] = convolver;
    munchingAudio['overdrive'] = overdrive;

    munchingAudio['bufferList'] = bufferList;
    starveRelease(munchingAudio);
}

function munchingTime () {
  clearScreen(0, ['.selectable', '.msg'], 200);
  stopAudio('shiryu8');
  setTimeout(function () {
    showLine('You think.', 50, 1);
    showLine('You think hard.', 50, 0, 0, 750);
    showLine('Nothing is coming.', 50);
    showLine('Thinking of nothing.', 50);
    showLine('Nothing but... munching...', 100);
    showLine('Press [SPACEBAR] to munch', 50, 0, 0, 100, 'afterMessageInstruct');

    var munchingEffects = [];
    for (var i = 0; i < 7; i++) {
      munchingEffects.push('../audio/munching/munch' + i + '.mp3');
    }
    for (var j = 0; j < 5; j++) {
      munchingEffects.push('../audio/munching/crunch' + j + '.mp3');
    }
    for (var k = 0; k < 5; k++) {
        munchingEffects.push('../audio/munching/grunt' + k + '.mp3');
    }
    munchingEffects.push('../audio/munching/starvation.mp3');
    munchingEffects.push('../audio/munching/chorus.mp3');

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    console.log(munchingEffects);

    var bufferLoader = new BufferLoader(
        context,
        munchingEffects,
        munchingAudio
    );

    bufferLoader.load();
    // setTimeout(function () {
    //   starveRelease();
    // }, 5500);
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

    var context = new AudioContext();

    // munchingTime();

      setTimeout(function () {
        showLine('Welcome to Moon Prison.', 50, 1);
        showLine('This is your cell.', 50);
        showLine('A perfect glass room and a sun that never sets.', 50);
        showLine('Amazing.', 100);
        nextScreenLoader(scene1starter, 300);
    }, 200);
});
