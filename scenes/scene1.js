var intervalCounter;
var policeTimer;

$(document).ready(function () {
    scene1Screen1();
});

function scene1Screen1 () {
    setTimeout(function () {
      showLine('Welcome to Moon Prison.', 50, 1);
      showLine('This is your cell.', 50);
      showLine('A perfect glass room and a sun that never sets.', 50);
      showLine('Amazing.', 100);
      nextScreenLoader(scene1Question1, 300);
  }, 200);
}

function scene1Question1 () {
    showLine('What will you do?', 50, true);

    answerOptions(['SIT', 'STAND', 'THINK ABOUT WHAT YOU\'VE DONE'], ['WHY', 'WHY', 'OH GOD WHY']);

    // TODO I will clean this up I swear. It just hurts for me to look at for too long of a period
    $('#ansDiv').on('mousedown.answering', '#ansOp0', function () {
      console.log('clicked sit');
    switchOnClick([$('#ansOp1').css('opacity') === '1' || $('#ansOp1').css('opacity') === '0.5',
                              $('#ansOp1').css('opacity') === '0'],[[0, 1, 1],[0,1,1]], ['You are now sitting. Beautiful.', 'You are now sitting. Beautiful.']);
                            });
    $('#ansDiv').on('mousedown.answering', '#ansOp1', function () {
      console.log('clicked stand');
    switchOnClick([$('#ansOp0').css('opacity') === '1' && $('#ansOp1').css('opacity') === '1',
                              $('#ansOp0').css('opacity') === '0',
                              $('#ansOp1').css('opacity') === '0.5'], [[1, 0, 1],[1, 0, 1],[ 1, 0, 1]], ['You continue to stand. You are thinking nothing.', 'You are now standing. Horrible.', 'You\'ve been standing a while, perhaps you should SIT and THINK ABOUT WHAT YOU\'VE DONE.']);
                            });
    $('#ansDiv').on('mousedown.answering', '#ansOp2', function () {
      console.log('clicked think');
    switchOnClick([($('#ansOp1').css('opacity') === '1' && $('#ansOp0').css('opacity') === '1') || ($('#ansOp1').css('opacity') === '0.5' && $('#ansOp0').css('opacity') === '1'),
                              $('#ansOp1').css('opacity') === '1' && $('#ansOp0').css('opacity') === '0',
                              $('#ansOp1').css('opacity') === '0' && $('#ansOp0').css('opacity') === '1'], [[1, 0.5, 1],[0, 0, 0],[1, 0.5, 1]], ['That would be exhausting.', 'finish', 'That would be exhausting.'], scene1Screen2);
                            });
}

function scene1Screen2 () {
  $('#ansDiv').off('.answering');
  clearScreen(0, ['.selectable', '.msg'], 200);
  stopAudio('shiryu8');
  setTimeout(function () {
    showLine('You think.', 50, 1);
    showLine('You think hard.', 50, 0, 0, 750);
    showLine('Nothing is coming.', 50);
    showLine('Thinking of nothing.', 50);
    showLine('Nothing but... munching...', 100);
    showLine('Press [SPACEBAR] to munch', 50, 0, 0, 100, 'afterMessageInstruct');
    munchingAudioLoad();
    }, 400);
}

function munchingAudioLoad () {
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

    var bufferLoader = new BufferLoader(
        context,
        munchingEffects,
        munchingAudioPrepare
    );

    bufferLoader.load();
}

function munchingAudioPrepare (bufferList) {
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

    addAudio('EOTBDrone', './audio/EOTBDrone.ogg', 0, true);

    munchingAudio['gainMunchConvolver'] = context.createGain();
    munchingAudio['gainMunchControl'] = context.createGain();
    munchingAudio['gainCrunchControl'] = context.createGain();
    munchingAudio['gainGruntControl'] = context.createGain();
    munchingAudio['gainGruntOverdrive'] = context.createGain();

    var overdrive = new tuna.Overdrive({
    outputGain: 0.1,         //0 to 1+
    drive: 0.5,              //0 to 1
    curveAmount: 0.95,          //0 to 1
    algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
    bypass: 1
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
    starveOnRelease(munchingAudio);
}

function starveOnRelease (munchingAudio, munchCounter = 0, munchTotal = 0) {
  var starveInterval,
      starveCounter,
      intervalStarted = false;

      var starveTimer = setTimeout(function () {
        munchCounter = 0;
      }, 250);

      if (munchTotal > 8) {
        if (munchTotal > 15) {
          if (munchTotal > 21) {
            if (munchTotal > 32) {
                starveCounter = 32.3;
            } else {
              starveCounter = 21.1;
            }
          } else {
            starveCounter = 15.5;
          }
        } else {
          starveCounter = 8.4;
        }
      } else {
        starveCounter = 0;
      }

      var audioTimer = setTimeout(function () {
          munchingAudio['starveSource'].connect(context.destination);
          munchingAudio['starveSource'].start(0, starveCounter.toFixed(1));
          intervalStarted = true;

          starveInterval = setInterval(function () {
            starveCounter += 1;
            if (starveCounter > 38) {
              clearTimeout(starveTimer);
              clearTimeout(audioTimer);
              clearInterval(starveInterval);
              munchingAudio['starveSource'].stop();
              munchingResult(0);
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
      munchOnPress (e, munchingAudio, munchCounter, munchTotal);
    });
}

function munchOnPress (e, munchingAudio, munchCounter, munchTotal) {
    if (e.which === 32) {
      var stop = 0;

      munchCounter += 1;

      if (munchCounter > 3) {
          munchCounter = 1;
      }

      if (munchTotal === 0) {
          var munchBlink = setInterval(function () {
              $('.afterMessageInstruct').fadeTo(250, 0.5).delay(100).fadeTo(250, 1);
          }, 600);
      }

      munchTotal += 1;

      k = Math.floor(Math.random() * 7);
      j = Math.floor(Math.random() * 5);

      if (munchCounter === 1) {
              munchingAudio['munchSource' + k].connect(munchingAudio['gainMunchControl']);
              munchingAudio['gainMunchControl'].connect(context.destination);
              munchingAudio['munchSource' + k].connect(munchingAudio['convolver']);
              munchingAudio['convolver'].connect(munchingAudio['gainMunchConvolver']);
              munchingAudio['gainMunchConvolver'].connect(context.destination);
              munchingAudio['gainMunchConvolver'].gain.value = 0.5 - munchTotal / 100;
              munchingAudio['gainMunchControl'].gain.value = 0.5 + munchTotal / 100;
              munchingAudio['munchSource' + k].start(0);
              munchingAudio['munchSource' + k] = context.createBufferSource();
              munchingAudio['munchSource' + k].buffer = munchingAudio['bufferList'][k];
      }
      if (munchCounter === 2) {
          munchingAudio['crunchSource' + j].connect(munchingAudio['gainCrunchControl']);
          munchingAudio['gainCrunchControl'].gain.value = 0.5 + munchTotal / 20;
          munchingAudio['gainCrunchControl'].connect(context.destination);
          munchingAudio['crunchSource' + j].start(0.250);
          munchingAudio['crunchSource' + j] = context.createBufferSource();
          munchingAudio['crunchSource' + j].buffer = munchingAudio['bufferList'][7 + j];
      }
      if (munchCounter === 3 && munchTotal < 45) {
        if (Math.random() < munchTotal / 50) {
            munchingAudio['gruntSource' + j].connect(munchingAudio['gainGruntControl']);
            munchingAudio['gainGruntControl'].connect(context.destination);
            munchingAudio['gruntSource' + j].connect(munchingAudio['overdrive']);
            munchingAudio['overdrive'].connect(munchingAudio['gainGruntOverdrive']);
            munchingAudio['gainGruntOverdrive'].connect(context.destination);
            munchingAudio['gainGruntControl'].gain.value = munchTotal / 50;
            munchingAudio['gainGruntOverdrive'].gain.value = (munchTotal > 25 ? munchTotal / 75 : 0);
            munchingAudio['gruntSource' + j].start(0.5);
            munchingAudio['gruntSource' + j] = context.createBufferSource();
            munchingAudio['gruntSource' + j].buffer = munchingAudio['bufferList'][12 + j];
        }
        munchCounter = 0;
      }



      if (munchTotal > 39) {
          if (munchTotal === 40) {
              munchingAudio['chantSource'].connect(munchingAudio['gainChantControl']);
              munchingAudio['gainChantControl'].connect(context.destination);
              // munchingAudio['chantSource'].start(0);
              playAudio('EOTBDrone');
              $('#EOTBDrone').get(0).volume = 0;
              var audioFadeIn = setInterval(function () {
                  $('#EOTBDrone').get(0).volume += 0.1;
              }, 500);
              setTimeout(function () {
                  clearInterval(audioFadeIn);
              }, 5000);
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
        clearInterval(munchBlink);
        munchingResult(1);
        stop = 1;
      }
      if (!stop) {
        $(document).one('keyup', function (e) {
            if (munchCounter === 0) {
                setTimeout(function() {
                    starveOnRelease(munchingAudio, munchCounter, munchTotal);
                }, 500 * (1 - (munchTotal / 50)));
            } else {
                starveOnRelease(munchingAudio, munchCounter, munchTotal);
            }
      });
      }
  } else {
      $(document).one('keyup', function (e) {
          if (munchCounter === 0) {
              setTimeout(function() {
                  starveOnRelease(munchingAudio, munchCounter, munchTotal);
              }, 500 * (1 - (munchTotal / 50)));
          } else {
              starveOnRelease(munchingAudio, munchCounter, munchTotal);
          }
  });
  }
}

function munchingResult (result) {
  if (result) {
    clearScreen(300, ['.msg'], 300);
    showLine('', 0, 1);                                                         // added just to clear totalDelay, surely a better way is possible?
    nextScreenLoader(scene1Screen3, 1500);
  } else {
    clearScreen(300, ['.msg'], 600);
    setTimeout(function () {
      showLine('You have DIED of STARVATION', 100, 1, 0, 1000, 'starveDeath');
      setTimeout(function () {
          loadScene('/scenes/scene2.js');
      }, 2000);
    }, 1300);
  }
}

function scene1Screen3 () {
  showLine('That\'s right...', 50, 1);
  showLine('It wasn\'t just munching...', 50);
  showLine('There was also something else...', 50);

  walkingAudioLoad();
}

function walkingAudioLoad () {
    bufferLoader = new BufferLoader(
        context,
        [
            '../audio/EOTB.ogg'
        ],
        walkingAudioPrepare
    );

    bufferLoader.load();
}

function walkingAudioPrepare (bufferList) {

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
          walking(900, 1400, eotb, animElements);
      }, 2500);
}

function walking(clickInterval, audioInterval, eotb, animElements, totalClicks = 0, playing = false, condition = 0, clickCounter = 0, offset = 22) {
    var exactInt = clickInterval / 2 + ((audioInterval + 100 - clickInterval) / 2);
    alternateClicks(clickInterval, audioInterval, [
                                function () {
                                    stopAudio('EOTBDrone');
                                    switchGains([eotb['gainConvolver'], eotb['gainControl']],[0,1]);             // at left click
                                    randomStars(totalClicks + clickCounter);
                                    fadeloop('#star' + (totalClicks + clickCounter), exactInt, exactInt, true, totalClicks + clickCounter);
                                    animateClickIndicator('left', animElements, clickInterval, audioInterval);
                                    if (!playing) {
                                        console.log('left click: ' + offset);
                                        eotb['source'].start(0, offset);                                        // TODO add a small fade in to the start of the audio?
                                        playing = true;
                                        startedAt = context.currentTime - offset;
                                    }
                                    clickCounter += 1;
                                    condition = (clickCounter > ((1700 - clickInterval) / 100));
                                },
                                function () {
                                    switchGains([eotb['gainConvolver'], eotb['gainControl']],[0,1]);             // at right click
                                    randomStars(totalClicks + clickCounter);
                                    fadeloop('#star' + (totalClicks + clickCounter), exactInt, exactInt, true, totalClicks + clickCounter);
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
                                          walking(300, 700, eotb, animElements, totalClicks, true);
                                      } else {
                                          $('#instructorLeft').fadeTo(500, 0);
                                          totalClicks += clickCounter;
                                          fallingStars(totalClicks, eotb);
                                          runningAudioLoad();
                                      }
                                    }, 1200);
                                }], function () {
                                    return Boolean(clickCounter > ((1700 - clickInterval) / 100) - 1);
                                });
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
    }
}

function audioTimeout (audio, offset, startedAt) {
    elapsed = (context.currentTime - startedAt).toFixed(1);                                                 // TODO maybe implement the pausing and starting as its own functions?
    audio['source'].stop();
    console.log('stopped: ' + offset);
    return elapsed;
}

function fallingStars (totalClicks, eotb) {
    for (var i = 0; i < totalClicks; i++) {
        clearInterval(intId[i]);
    }
    setTimeout(function () {
        for (var i = 0; i < totalClicks; i++) {
            $('#star' + i).animate({
                'top' : '100%',
                'opacity' : '0'
            }, 2000 * Math.random());
        }
        clearScreen(0, ['starField', 'msg'], 1900);
        eotb['source'].stop();                                                  // TODO add effect instead of random stop
    }, 1000);
}

function runningAudioLoad () {
    bufferLoader = new BufferLoader(
        context,
        [
            '../audio/MoDemJams.webm'
        ],
        runningAudioPrepare
    );

    bufferLoader.load();
}

function runningAudioPrepare(bufferList) {
    var tuna = new Tuna(context);

    var filter = new tuna.Filter({
        frequency: 3000, //20 to 22050
        Q: 1, //0.001 to 100
        gain: 0, //-40 to 40 (in decibels)
        filterType: "lowpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
        bypass: 0
    });

    var runningAudio = {};

    runningAudio['source'] = context.createBufferSource();
    runningAudio['source'].buffer = bufferList[0];
    runningAudio['gainControl'] = context.createGain();
    runningAudio['gainFilter'] = context.createGain();
    runningAudio['filter'] = filter;

    runningAudio['source'].connect(runningAudio['filter']);
    runningAudio['filter'].connect(runningAudio['gainFilter']);
    runningAudio['gainFilter'].connect(context.destination);
    runningAudio['source'].connect(runningAudio['gainControl']);
    runningAudio['gainControl'].connect(context.destination);
    runningAudio['gainFilter'].gain.value = 0;
    runningAudio['gainControl'].gain.value = 0;

    running(runningAudio);
}

function running (runningAudio) {
    showLine('Oh, it was running', 100, 1);

    var audioFadeIn = setInterval(function () {
      runningAudio['gainFilter'].gain.value += 0.05;
    }, 250);
    setTimeout(function() {
      clearInterval(audioFadeIn);
    }, 5000);

    runningAudio['source'].start(0, 12);

    var caughtStatus = false;
    var clickCounter = 0;
    var extra = 10000;
    var policePosition = -1;

  setTimeout(function () {
    alternateClicks(0, 0, [
        function () {
            if (clickCounter === 0) {
                runningAudio['gainControl'].gain.value = 1;
                runningAudio['filter'].disconnect();
            }
            clickCounter += 1;
            starredStep(clickCounter, 100, extra);
            policePosition = policeman(clickCounter, 100, extra);
            if ((policePosition > clickCounter * ($(window).width() / ((1850 - 100 + extra) * 0.01)) - ($(window).width() / ((1850 - 100 + extra) * 0.01)))) {
              console.log('status change to true');
              caughtStatus = true;
            }
        },
        function () {
            clickCounter += 1;
            starredStep(clickCounter, 100, extra);

            if ((policePosition > clickCounter * ($(window).width() / ((1850 - 100 + extra) * 0.01)) - ($(window).width() / ((1850 - 100 + extra) * 0.01)))) {
              console.log('status change to true');
              caughtStatus = true;
            }
        },
        function () {},
        function () {},
        function () {
          if (caughtStatus) {
            var audioSlowdown = setInterval(function () {
              runningAudio['source'].playbackRate.value -= 0.05;
            }, 250);
            caught(caughtStatus);
          } else {
            runningAudio['source'].connect(runningAudio['filter']);
            runningAudio['filter'].connect(runningAudio['gainFilter']);
            runningAudio['gainFilter'].connect(context.destination);
            runningAudio['gainFilter'].gain.value = 1;
            var audioFadeOut = setInterval(function () {
              runningAudio['gainFilter'].gain.value -= 0.05;
              console.log(runningAudio['gainFilter'].gain.value);
            }, 250);
            runningAudio['gainControl'].gain.value = 0;
          }

          setTimeout(function () {
            clearInterval(audioSlowdown);
            clearInterval(audioFadeOut);
            runningAudio['source'].stop();
            caught(caughtStatus);
          }, 5000);
        }], function () {
            return Boolean(policePosition > clickCounter * ($(window).width() / ((1850 - 100 + extra) * 0.01)) - ($(window).width() / ((1850 - 100 + extra) * 0.01))) || (clickCounter > 115);
        });
  }, 1100);
}

function policeman (clickCounter, clickInterval, extra) {
    if (clickCounter === 1) {
        // insert audio hey freeze!
        intervalCounter = 0;
        showLine('FREEZE!', 50, 0, 1, 0, 'chaserSpeech');
        $('.chaserSpeech').css({
            'position'  :   'fixed',
            'left'      :   intervalCounter * ($(window).width() / ((1850 - clickInterval + extra) * 0.01)) - ($(window).width() / ((1850 - clickInterval + extra) * 0.01)) + 'px',
            'top'       :   '75%',
            'font-size' :   '52px'
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

function caught (caughtStatus) {
    $(document).bind('contextmenu', function (e) {
      e.preventDefault();
      return false;
    });
    if (caughtStatus) {
        clearInterval(policeTimer);
    } else {
        setTimeout(function () {
            clearInterval(policeTimer);
        }, 1000);
    }
    clearScreen(300, ['.chaserSpeech', '.anyText', '.msg'], 700);
    setTimeout(function () {
        $(document).unbind('contextmenu');
        loadScene('/scenes/scene2.js');
    }, 1200);
}

// function hideOnClick (id, message) {
//   $(document).on('click', id, function () {
//     showLine(message, 50, true);
//     $(id).fadeTo(100, 0);
//   });
// }
