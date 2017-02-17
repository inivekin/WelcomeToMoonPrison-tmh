function hideOnClick (id, message) {
  $(id).on('click', function () {
    console.log('clicked');
    showLine(message, 50);
    $(id).css('visibility', 'hidden');
  });
}

function scene1starter () {
  setTimeout(function () {
    showLine('What will you do?', 100, undefined, 1);
  }, 1000);
  setTimeout(function () {
    answerOptions(['SIT', 'STAND', 'THINK']);
    hideOnClick('#answerOp0', 'You are now sitting.');
  }, 1200);
}

$(document).ready(function () {
  setTimeout(function () {
    showLine('Welcome to Moon Prison.', 50, undefined, 1);
    showLine('This is your cell.', 50);
    showLine('A perfect glass room and a sun that never sets.', 50);
    showLine('Amazing.', 100);
  }, 1500);
  nextScreenLoader(scene1starter, 1000);
});
