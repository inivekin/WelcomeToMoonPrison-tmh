$(document).ready(function () {
  addAudio('einstein', './audio/EOTB.webm');
  playAudio('einstein');

  showLine('You\'ve done a terrible thing you can\'t remember.', 50, true, false, 1500);
  showLine('Something just terribly awful.', 50);
  showLine('You should be ashamed.', 50, false, false, 1500);
  showLine('You should be locked up.', 100);
  nextScreenLoader(loadOpening, 1000);
});

function loadOpening () {
  // creating title elements
  var titlePage = document.createElement('h1');
  $(titlePage).attr('class', 'anyText').attr('id', 'bigOldTitle'); // .css('opacity', '0.0');
  titlePage.innerHTML = 'MOON PRISON';
  $('body').append(titlePage);
  var instruct = document.createElement('h3');
  $(instruct).attr('class', 'anyText').attr('id', 'instructor'); // .css('opacity', '0.0');
  instruct.innerHTML = '[click to play]';
  $('#bigOldTitle').append(instruct);
  $('#bigOldTitle').fadeIn(500, function () { $('#instructor').fadeIn(800); });


  // generate a number of stars proportionate to viewport size and loop fade-in/fade-out
  var starNum = $(window).width() * $(window).height() * 5.0e-5;
  for (var i = 0; i < starNum; i++) {
    randomStars(i);
    fadeloop ('#star' + i, 1500, 1200, true, starNum);
  }
  // event listener to continue into game
  $(document).on('mousedown', function () {
    clearScreen(300, ['#bigOldTitle'], 300);
    var starArray = [];
    for (var i = 0; i < starNum; i++) {
      clearInterval(intId[i]);
      starArray[i] = '#star' + i;
    }
    setTimeout(function () {
      clearScreen(600, starArray, 600);
    }, 200);
    $(document).unbind('mousedown');

    loadScene('/scenes/scene1.js');
  });
}

function randomStars (i) {
                                                                          // TODO randomize font-size instead
    var divSize = ((Math.random() * 16) + 16).toFixed();
    $newdiv = $('<div/>').attr('id', 'star' + i).css({
        'font-size'   : divSize + 'px'
    });
    var viewportWidth = $(window).width()
    var viewportHeight = $(window).height()
    // FIXME try to keep star locations away from title (low priority)
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
}

function fadeloop (star, timeOut, timeIn, loop, count) {
    var $star = $(star),
        fn = function () {
      $star.fadeTo(timeOut, Math.random()).delay(Math.random() * 100).fadeTo(timeIn, Math.random());
    };
    fn();
    if (loop) {
      this.counter = (this.counter === undefined ? 0 : this.counter + 1);
      intId[this.counter] = setInterval(fn, timeOut + timeIn + 100);
      // TODO sometimes stars do not fade right because setInterval lasts too long for fade zone before clearInterval can stop it.
      // fix by making interval shorter, preferably around 500-1000, though need to make sure fadeTos fade to close decimal so flickering isn't too much
    }
}
