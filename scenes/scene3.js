$(document).ready(function () {
  relaxAudioLoad();
    //scene3Screen1();
});

function scene3Screen1(relaxAudio) {
  showLine('Welcome back to your cell.', 50, 1);
  showLine('You\'ve been out for a while.', 50);
  showLine('You should try to R E L A X .', 50);

  answerOptions(['SIT', 'STAND', 'R E L A X'], ['SIT', 'STAND', 'R E L A X']);

  $('#ansDiv').on('mousedown.answering', '#ansOp0', function () {
  switchOnClick([$('#ansOp0').css('opacity') === '1'], [[0, 1, 1]], ['Ahh. Almost there.']);
                          });
  $('#ansDiv').on('mousedown.answering', '#ansOp1', function () {
    switchOnClick([$('#ansOp1').css('opacity') === '1'], [[1, 0, 1]],['You are already standing. You can\'t stand and relax, obviously.'] );
                          });
  $('#ansDiv').on('mousedown.answering', '#ansOp2', function () {
    switchOnClick([$('#ansOp1').css('opacity') === '1' && $('#ansOp0').css('opacity') === '0'], [[0, 0, 0]], ['finish'], scene3Screen2, relaxAudio);
                          });
}

function relaxAudioLoad() {
  console.log('Loading audio...');


  var bufferLoader = new BufferLoader(
      context,
      [
        '../audio/youHaveToRelax.mp3'
      ],
      relaxAudioPrepare
  );

  bufferLoader.load();
}

function relaxAudioPrepare(bufferList) {
  console.log('Preparing audio...');
  var relaxAudio = {};

  relaxAudio['source'] = context.createBufferSource();
  relaxAudio['source'].buffer = bufferList[0];

  relaxAudio['source'].connect(context.destination);

  scene3Screen1(relaxAudio);
}

function scene3Screen2 (relaxAudio) {
  console.log('Beginning Screen2...');

  $('#ansDiv').off('.answering');
  clearScreen(0, ['.selectable', '.msg'], 200);

  relaxAudio['source'].start(0);

  typeRelax(relaxAudio);
}

function typeRelax (relaxAudio) {
  var letters = {};
  var fallingLetters = [];
  setTimeout(function () {
    scene3Screen2Lines();
  },3500);

  letters = scene3TextToEnter('RELAX', 'top', 'padding-left');

  letters['offset'] = context.currentTime;
  console.log(letters);
  console.log(letters['offset']);

  var audioTimeCheck = setInterval(function () {
    console.log('OffsetTime: ' + (context.currentTime - letters['offset']));
    if (context.currentTime - letters['offset'] > 9) {
      console.log('OffsetTime: ' + (context.currentTime - letters['offset']));
      for (var i = 0; i < letters['letterArray'].length; i++) {
          console.log('Falling letter ' + i);
          fallingLetters = fallingLetter(letters, i);
      }
      checkLetterPos(letters, fallingLetters, scene3Breathing);
      clearInterval(audioTimeCheck);
    }
  }, 500)


  var typeIndicator = createTypeIndicator(letters);
  blinkIndicator(typeIndicator);
}

function scene3Screen2Lines () {
  showLine('Ok...', 50, 1, 0, 1500, '', 500, 0);
  setTimeout(function () {
    $('#msg0').fadeTo(500, 0);
  }, 300);
  showLine('Ok the first thing you gonna wanna do...', 50, 0, 0, 1500, '', 500, 0);
  setTimeout(function () {
    $('#msg1').fadeTo(500, 0);
  }, 5500);
  showLine('is', 50, 0, 0, 0, '', 500, 0);
  setTimeout(function () {
    $('#msg2').fadeTo(500, 0);
  }, 6000);
  setTimeout(function () {
    clearScreen();
  }, 6500);
}

function scene3TextToEnter(string, from, orientation, dist=50) {
  var gap = 100 / (string.length + 1);
  var letterArray =[];
  var letterProp = {};

  letterProp[from] = '-5%';
  letterProp['opacity'] = '1';
  letterProp['position'] = 'absolute';

  for (var i = 0; i < string.length; i++) {
    var letter = document.createElement('span');
    if (from == 'top' | from == 'bottom') {
      letterProp[orientation] = gap * (i + 1) + 'vw';
    } else {
      letterProp[orientation] = gap * (i + 1) + 'vh';
    }
    $('#wrapper').append(letter);
    $(letter).attr('id', 'letter' + i).attr('class', 'anyText falling');
    //$(letter).css({
      //'padding-left' : gap * (i + 1) + '%',
      //'top'          : '-5%',
      //'opacity'      : '1',
      //'position'     : 'absolute'
    //});
    $(letter).css(letterProp);
    $(letter).html(string[i]);

    letterArray[i] = letter;
  }
  return {letterArray: letterArray, gap: gap, from: from, orientation: orientation, dist: dist};
}

function createTypeIndicator(letters) {
  var typeIndicator = document.createElement('span');
  var or, nor;

  $('#txtDiv').append(typeIndicator);
  if(letters['orientation'] == 'padding-top' || letters['orientation'] == 'padding-bottom') {
    or = 'vh';
    nor = 'vw';
  } else {
    or = 'vw';
    nor = 'vh';
  }

  var typeIndProp = {};

  typeIndProp[letters['from']] = letters['dist'] + nor;
  typeIndProp[letters['orientation']] = letters['gap'] + or;
  typeIndProp['position'] = 'absolute';
  $(typeIndicator).html('_').attr('class', 'anyText').css(typeIndProp).attr('id', 'typeIndicator');
  //$(typeIndicator).html('_').attr('class', 'anyText').css({
    //'top'      : '50%',
    //'left'     : letters['gap'] + or,
    //'position' : 'absolute'
  //}).attr('id', 'typeIndicator');

  return typeIndicator;
}


function blinkIndicator(typeIndicator) {
  var typeWaiting = setInterval(function () {
    $(typeIndicator).fadeTo(200,0.1).delay(100).fadeTo(200,1);
  }, 500);
}


function fallingLetter(letters, i, speed=10) {
  var fallingInterval = [];
  console.log ('Moving letter ' + i);
  letters['speed'] = speed;

  var letterAnimProp = {}

  if(letters['orientation'] == 'padding-top' || letters['orientation'] == 'padding-bottom') {
    or = 'vh';
    nor = 'vw';
  } else {
    or = 'vw';
    nor = 'vh';
  }

  letterAnimProp[letters['from']] = '+=' + speed + nor;
  letterAnimProp['opacity'] = '-=' + speed /100;

  setTimeout(function() {
    fallingInterval[i] = setInterval(function () {
      $('#letter' + i).animate(letterAnimProp, 500, 'linear');
        //$('#letter' + i).animate({
          //from            : '+='+ speed + '%',
          //'opacity'       : '-=' + speed / 100
        //}, 500, 'linear');
    }, 500);

    setTimeout(function () {
      clearInterval(fallingInterval[i]);
      $('#letter' + i).remove();
    }, (100 / speed) * 500);
  },(10000 / speed) * i / (letters['dist']/50));


  return fallingInterval;
}

function checkLetterPos(letters, fallingLetters, callToFunc) {
  var incr = 0;
  var clickTimeout = [];
  var incrTimeout = [];

  for (i = 0; i < letters['letterArray'].length; i++) {
    clickTimeout = clickTimer(i, letters, incr, clickTimeout, callToFunc);
  }
  for (var j = 0; j < letters['letterArray'].length; j++) {
    incrTimeout[j] = setTimeout(function (x) {
      return function () {
        incr = x + 1;
      }
      console.log('Timeout, incrementing...');
      console.log(letters['speed']);
      console.log('Next occurence at: ' + ((100 / letters['speed']) * 500 - 1000(letters['dist']/50) + (10000 / letters['speed']) * x));
    }(j), (100 / letters['speed']) * 500 - 1000/(letters['dist']/50) + (10000 / letters['speed']) * j);
  }

  //incrTimeout[0] = setTimeout(function () {
    //incr = 1;
  //}, (100 / letters['speed']) * 500);
  //incrTimeout[1] = setTimeout(function () {
    //incr = 2;
  //}, 4000 + 1000);
  //incrTimeout[2] = setTimeout(function () {
    //incr = 3;
  //}, 4000 + (1000 * 2));
  //incrTimeout[3] = setTimeout(function () {
    //incr = 4;
  //}, 4000 + (1000 * 3));


  $(document).on('click keydown', function () {
    console.log(incr);
    clearTimeout(clickTimeout[incr]);
    clearTimeout(incrTimeout[incr]);
    typedLetter(incr, letters, 1);
    if (incr === letters['letterArray'].length - 1) {
      $(document).off('click keydown');
      callToFunc(letters);
    } else {
      incr += 1;
    }
  });
}


function clickTimer (i, letters, incr, clickTimeout, callToFunc) {
  clickTimeout[i] = setTimeout(function () {
    typedLetter(i,letters,0);
    if (i === letters['letterArray'].length - 1) {
      $(document).off('click keydown');
      console.log('continuing');
      callToFunc(letters);
    }
  }, (100 / letters['speed']) * 500 - 1000/(letters['dist']/50) + (10000 / letters['speed']) * i);

  return clickTimeout;
}

function typedLetter (incr, letters, check) {
  console.log(incr);
  console.log($('#letter' + incr));
  //var fallBelowCheck = $('#letter' + incr)[0].style.top > '40%';
  //var fallAboveCheck = $('#letter' + incr)[0].style.top < '55%';
  var maxDiff = letters['dist'] * 0.01 - 0.1;
  var minDiff = letters['dist'] * 0.01 + 0.1;

  if (letters['from'] == 'top' || letters['bottom']) {
    var fallBelowCheck = parseFloat($('#letter' + incr).css(letters['from'])) > maxDiff * $(window).height();
    var fallAboveCheck = parseFloat($('#letter' + incr).css(letters['from'])) < minDiff * $(window).height();
    var or = 'vh';
    var nor = 'vw';
  } else {
    var fallBelowCheck = parseFloat($('#letter' + incr).css(letters['from'])) > maxDiff * $(window).width();
    var fallAboveCheck = parseFloat($('#letter' + incr).css(letters['from'])) < minDiff * $(window).width();
    var or = 'vw';
    var nor = 'vh';
  }

  console.log(parseFloat($('#letter' + incr).css(letters['from'])) + ', ' + $(window).width() * maxDiff + ', ' + $(window).width() * minDiff);
  console.log(parseFloat($('#letter' + incr).css(letters['from'])) > $(window).width() * maxDiff);
  console.log(parseFloat($('#letter' + incr).css(letters['from'])) < $(window).width() * minDiff);

  console.log('Clicked: ' + check);
  //console.log($('#letter' + incr)[0].style.top);
  console.log(fallBelowCheck + ' ' + fallAboveCheck);
  var indicatorProp = {}
  indicatorProp[letters['orientation']] = '+=' + letters['gap'] + nor;
  $('#typeIndicator').css(indicatorProp);
    //$('#typeIndicator').css({
        //'left' : '+=' + letters['gap'] + '%'
    //});

    var letterClone = $('#letter' + incr).clone().appendTo('#txtDiv');
    $(letterClone).attr('id','letter' + incr + 'Clone');

    if (fallBelowCheck && fallAboveCheck && check) {
      console.log('Passed fall check, affecting letter ' + incr);
      //clearInterval(fallingLetters[incr]);
      $(letterClone).css(letters['from'], letters['dist'] + or).css('opacity', '1');
      //$(letterClone).css({
        //'top'     : '50%',
        //'opacity' : '1'
      //});
    } else {
      $(letterClone).css(letters['from'], letters['dist'] + or).css('opacity', '1').attr('class', 'anyTextInvert');
      //$(letterClone).css({
        //'top'     : '50%',
        //'opacity' : '1'
      //}).attr('class', 'anyTextInvert');
    }
}

function scene3Breathing(letters) {
  $(document).off('click keydown');
  $('#typeIndicator').remove();
  var letterPos = [];
  var breathPos = [];
  var breathingInterval = [];

  for (var i = 0; i < 5; i++) {
    letterPos[i] = $('#letter' + i + 'Clone')[0].style.paddingLeft;
    breathPos[i] = parseFloat(letterPos[i]) - 50;
    console.log($('#letter' + i + 'Clone')[0].style.paddingLeft)
    console.log(letterPos);
    console.log(breathPos);

    breatheInOut(breathPos[i], i, breathingInterval, letters);

  }
}

function breatheInOut (breathPos, i, breathingInterval, letters) {
    breathingInterval[i] = setInterval(function () {
      console.log('Checking time...');
      if (context.currentTime - letters['offset'] > 17) {
        clearInterval(breathingInterval[i]);
        setTimeout(function () {
          breathingMotions(breathPos, i, 0);
          breathingMotions(breathPos, i, 400);
          breathingMotions(breathPos, i, 1600);
          breathingMotions(breathPos, i, 2000);
          breathingMotions(breathPos, i, 3600);
          breathingMotions(breathPos, i, 4000);
          breathingMotions(breathPos, i, 5100);
          breathingMotions(breathPos, i, 5500);
          breathingMotions(breathPos, i, 7100);
          breathingMotions(breathPos, i, 7500);
          breathingMotions(breathPos, i, 8700);
          breathingMotions(breathPos, i, 9100);
          breathingMotions(breathPos, i, 10600);
          breathingMotions(breathPos, i, 11000);
          finalBreath(breathPos, i, 12600);
        }, 3000);
      }
    }, 100);

}

function breathingMotions (breathPos, i, timeout) {
  setTimeout(function () {
      $('#letter' + i + 'Clone').animate({
        'left': '+=' + breathPos * 0.3 + '%'
      }, 100);

      setTimeout(function () {
        $('#letter' + i + 'Clone').animate({
          'left': '-=' + breathPos * 0.3 + '%'
        }, 100);
      },100);
  }, timeout);
}

function finalBreath (breathPos, j, timeout) {
  setTimeout(function () {
      $('#letter' + j + 'Clone').animate({
        'left'    : '+=' + breathPos * 0.3 + '%',
        'opacity' : '0'
      }, 100);
    if (j === 4) {
      setTimeout(function () {
        for (i=0; i < 5; i++) {
          $('#letter' + i + 'Clone').remove();
        }
        relaxHere();
      }, 100);
    }
  }, timeout);
}

function relaxHere() {
  var letters = {};
  var fallingLetters = [];
  letters = scene3TextToEnter('HERE', 'right', 'padding-top', 70);
  for (var i = 0; i < letters['letterArray'].length; i++) {
      console.log('Falling letter ' + i);
      fallingLetters = fallingLetter(letters, i, 10);
  }
  checkLetterPos(letters, fallingLetters, relaxNow);
  var typeIndicator = createTypeIndicator(letters);
  blinkIndicator(typeIndicator);
}

function relaxNow() {
  $('#typeIndicator').remove();
  console.log('R E L A X NOW');
}
