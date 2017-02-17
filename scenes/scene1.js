function scene1starter () {
  clearScreen();
  setTimeout(function () {
    showLine('What will you do?', 100, undefined, 1);
  }, 1500);


}

$(document).ready(function () {
  setTimeout(function () {
    showLine('Welcome to Moon Prison.', 50, undefined, 1);
    showLine('This is your cell.', 50);
    showLine('A perfect glass room and a sun that never sets.', 50);
    showLine('Amazing.', 100);
  }, 2000);
  nextScreenLoader(scene1starter, 300);
});
