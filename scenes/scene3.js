$(document).ready(function () {
    scene3Screen1();
});

function scene3screen1() {
  showLine('Welcome back to your cell.', 50, 1);
  showLine('You\'ve been out for a while.', 50);
  showLine('You should try to R E L A X .', 50);

  answerOptions(['SIT', 'STAND', 'R E L A X'], ['YES', 'YES', 'OH GOD YES']);

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
