$(document).ready(function () {
    scene3Screen1();
});

function scene3Screen1() {
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
    switchOnClick([$('#ansOp1').css('opacity') === '1' && $('#ansOp0').css('opacity') === '0'], [[0, 0, 0]], ['finish'], relaxAudioLoad);
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

  scene3Screen2(relaxAudio);
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

  letters = scene3TextToEnter('RELAX');
  var audioTimeCheck = setInterval(function () {
    if (context.currentTime > 12) {
      for (var i = 0; i < letters['letterArray'].length; i++) {
          console.log('Falling letter ' + i);

          fallingLetter(letters, relaxAudio, i);
      }
      clearInterval(audioTimeCheck);
    }
  }, 500)

  $(document).on(click, function (event) {
    checkLetterPos(event);
  })
  //blinkIndicator(typeIndicator);
}

function scene3TextToEnter(string) {
  var gap = 100 / (string.length + 1);
  var letterArray =[];

  for (var i = 0; i < string.length; i++) {
    var letter = document.createElement('span');
    $('#txtDiv').append(letter);
    $(letter).attr('id', 'letter' + i).attr('class', 'anyText falling');
    $(letter).css({
      'padding-left' : gap * (i + 1) + '%',
      'top'          : '-5%',
      'opacity'      : '1',
      'position'     : 'absolute'
    });
    $(letter).html(string[i]);

    letterArray[i] = letter;
  }
  return {letterArray: letterArray, gap: gap};
}


function blinkIndicator(typeIndicator) {
  var typeWaiting = setInterval(function () {
    $(typeIndicator).fadeTo(200,0.1).delay(100).fadeTo(200,1);
  }, 500);
}


function fallingLetter(letters, audio, i) {
  var fallingInterval = [];
  console.log('Moving letter ' + i);

  setTimeout(function() {
    fallingInterval[i] = setInterval(function () {
        console.log(context.currentTime);
        $('#letter' + i).animate({
          'top'     : '+=10%',
          'opacity' : '-=0.1'
        }, 500, 'linear');
      setTimeout(function () {
        clearInterval(fallingInterval[i]);
        $('#letter' + i).remove();
      }, 5000);
        // At click or type check position and determine success
    }, 500);
  },1000 * i);
}

function  checkLetterPos(event) {
  // TODO check top height of letter i, increment i, remember success
}
