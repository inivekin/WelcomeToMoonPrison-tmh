$(document).ready(function () {
    scene3Screen1();
});

function scene3Screen1() {
  showLine('Welcome back to your cell.', 50, 1);
  showLine('You\'ve been out for a while.', 50);
  showLine('You should try to R E L A X .', 50);

  answerOptions(['SIT', 'STAND', 'R E L A X'], ['SIT', 'STAND', 'R E L A X']);

  $('#ansDiv').on('mousedown.answering', '#ansOp0', function () {
  switchOnClick([$('#ansOp0').css('opacity') === '1'], [[1, 1, 1]], ['You are already standing. You can\'t stand and relax, obviously.']);
                          });
  $('#ansDiv').on('mousedown.answering', '#ansOp1', function () {
    switchOnClick([$('#ansOp1').css('opacity') === '1'], [[1, 1, 1]], ['Ahh. Almost there.']);
                          });
  $('#ansDiv').on('mousedown.answering', '#ansOp2', function () {
    switchOnClick([$('#ansOp2').css('opacity') === '1'], [[1, 1, 1]], ['finish'], relaxAudioLoad);
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
}
