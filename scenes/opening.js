$(document).ready(function () {
    //openingAudio();
  firstScreen();
});

//var persistentAudio = {};

//function openingAudio() {
    //bufferLoader = new BufferLoader(
        //context,
        //[
            //'../audio/blathermouth1.mp3',
            //'../audio/blathermouth2.mp3',
            //'../audio/blathermouth3.mp3'
        //],
        //firstScreen
    //);

    //bufferLoader.load();
//}

function firstScreen() {

    addAudio('shiryu8', './audio/Shiryu8.ogg');
    $('#shiryu8').get(0).volume = 0.75;
    $('#shiryu8').on('canplay', function () {
        playAudio('shiryu8');

        //persistentAudio['bufferList'] = bufferList;

        showLine('YOU\'VE DONE A TERRIBLE THING YOU CAN\'T REMEMBER.', 50, true, false, 750, 'openingText openingText1stLine');
        showLine('SOMETHING JUST TERRIBLY AWFUL.', 50, 0, 0, undefined, 'openingText');
        showLine('YOU SHOULD BE ASHAMED.', 50, false, false, 1500, 'openingText');
        showLine('YOU SHOULD BE LOCKED UP.', 100, 0, 0, undefined, 'openingText');
        setTimeout(function () {
            console.log('starting audio fade in');
            var fadeInInterval = setInterval(function () {
                $('#shiryu8').get(0).volume += 0.05;
            }, 500);
            setTimeout(function () {
                clearInterval(fadeInInterval);
            }, 2400);
        }, 10000);
        nextScreenLoader(loadOpening, 4000);
    });
}

function loadOpening () {
  // creating title elements
  var titlePage = document.createElement('h1');
  $(titlePage).attr('class', 'anyText').attr('id', 'bigOldTitle'); // .css('opacity', '0.0');
  titlePage.innerHTML = 'MOON PRISON';
  $(titlePage).css('font-size', $(window).width() * $(window).height() * 7e-5);
  $('body').append(titlePage);
  var instruct = document.createElement('h3');
  $(instruct).attr('class', 'anyText').attr('id', 'instructor'); // .css('opacity', '0.0');
  instruct.innerHTML = '[click to play]';
  $('#bigOldTitle').append(instruct);
  $('#bigOldTitle').fadeIn(1000, function () { $('#instructor').fadeIn(1800); });


  // generate a number of stars proportionate to viewport size and loop fade-in/fade-out
  var starNum = $(window).width() * $(window).height() * 5.0e-5;
  for (var i = 0; i < starNum; i++) {
    randomStars(i);
    fadeloop ('#star' + i, 1400, 1000, true, i);
  }
  // event listener to continue into game
  $(document).on('mousedown', function () {

      var audioFadeOut = setInterval(function () {
          $('#shiryu8').get(0).volume -= 0.05;
      }, 500);

      setTimeout(function () {
          clearInterval(audioFadeOut);
      }, 2500);

    clearScreen(300, ['#bigOldTitle'], 300);
    var starArray = [];
    for (var i = 0; i < starNum; i++) {
      clearInterval(intId[i]);
      starArray[i] = '#star' + i;
    }
    setTimeout(function () {
      clearScreen(300, starArray, 2800);
  }, 100);
    $(document).unbind('mousedown');
    setTimeout(function () {
        loadScene('/scenes/scene1.js');
    }, 2800);
  });
}

function randomStars (i) {
    var divSize = ((Math.random() * 22) + 6).toFixed();
    $newdiv = $('<div/>').attr('id', 'star' + i).attr('class', 'starField').css({
        'font-size'   : divSize + 'px'
    });
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();

    var posX = ((Math.random() * (viewportWidth - divSize)) * 100  / viewportWidth).toFixed();
    var posY = ((Math.random() * (viewportHeight - divSize)) * 100 / viewportHeight).toFixed();

    $newdiv.css({
        'font-family' : 'Gaiatype',
        'color'       : 'white',
        'text-shadow' : '3px 3px 0px #BF4494',
        'position'    : 'absolute',
        'left'        : posX + '%',
        'top'         : posY + '%',
        'display'     : 'none'
    }).html('*').appendTo('body');

    return $('#star' + i).css('font-size');
}

function fadeloop (star, timeOut, timeIn, loop, count) {
    var $star = $(star),
        fn = function () {
      $star.fadeTo(timeOut, Math.random() * 0.8).delay(Math.random() * 100).fadeTo(timeIn, Math.random() * 0.8);
    };
    fn();
    if (loop) {
      intId[count] = setInterval(fn, timeOut + timeIn + 100);
      // TODO sometimes stars do not fade right because setInterval lasts too long for fade zone before clearInterval can stop it.
      // fix by making interval shorter, preferably around 500-1000, though need to make sure fadeTos fade to close decimal so flickering isn't too much
    }
}
