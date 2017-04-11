$(document).ready(function () {
  setTimeout(function () {
    this.floatingTextQueue = [];
    this.queueFinishFunc = null;
    nextScreenLoader(scene2Screen1, 0);
  }, 200);
});

function scene2Screen1()
{
  addAudio('forestImpression', './audio/ForestImpression.ogg');
  playAudio('forestImpression');
  // TODO cleanup positioning of these guys
  pushFadeOutText(0, 10, "Picture in your mind...");
  pushFadeOutText(30, 20, "...yellow fields...");
  pushFadeOutText(50, 30, "...surrounded by green trees...");
  pushFadeOutText(0, 40, "...and a little frog...");
  pushFadeOutText(30, 50, "...playing in a pond...");
  pushFadeOutText(50, 60, "...and he sings a song:");

  pushFadeOutText(0, 10, "Hi there!");
  pushFadeOutText(50, 20, "It's just so nice to see you!");
  pushFadeOutText(30, 30, "Boy it must be nice to be you!");
  pushFadeOutText(50, 40, "Being yourself is great...");
  pushFadeOutText(50, 50, "Learning from your mistakes...");
  pushFadeOutText(50, 60, "And boy you've made some mistakes...");

  pushFadeOutText(10, 50, "We could, run round and climb a tree, or");
  pushFadeOutText(10, 60, "Unless you’ve somewhere to be-fore");
  pushFadeOutText(10, 70, "You make your next mistake");
  pushFadeOutText(10, 80, "I can’t be up too late");
  pushFadeOutText(10, 90, "So what is the choice you make?");

  this.queueFinishFunc = function () { nextScreenLoader(scene2Question1, 0); };
  runFloatingTextQueue();
}

function scene2Question1()
{
  stopAudio('forestImpression'); // TODO this would sound better faded out
  answerOptions(['CLIMB A TREE', 'I\'M BUSY'],
                ['', ''],
                [function () { nextScreenLoader(scene2Correct1, 0); },
                 function () { nextScreenLoader(scene2Incorrect1, 0); }]);
}

function scene2Correct1()
{
  clearScreen(0, ['.selectable'], 0);
  playAudio('forestImpression');
  pushNoFadeOutText(0, 10, "I love climbing");
  pushNoFadeOutText(0, 20, "And I love trees");
  pushNoFadeOutText(0, 30, "I love climbing");
  pushNoFadeOutText(0, 40, "So climb with me");

  this.queueFinishFunc = function () { nextScreenLoader(scene2StartClimb, 0); };
  runFloatingTextQueue();
}

function scene2StartClimb()
{
  var climbContextObject = {}
  climbContextObject['clickInterval'] = 900;
  climbContextObject['audioInterval'] = null;
  climbContextObject['leftClickTimer'] = 0;
  climbContextObject['rightClickTimer'] = 0;
  climbContextObject['clickCounter'] = 0;
  climbContextObject['animElements'] = createClickIndicators();

  var leftClickFunc = makeScene2ClimbLeftClick(climbContextObject);
  var rightClickFunc = makeScene2ClimbRightClick(climbContextObject);
  var failedLeftClickFunc = makeScene2ClimbFailedLeftClick(climbContextObject);
  var failedRightClickFunc = makeScene2ClimbFailedRightClick(climbContextObject);
  var goalFunc = makeScene2ClimbGoal(climbContextObject);
  var scene2ClimbCondition = makeScene2ClimbCondition(climbContextObject);
  var clickFunctions = [leftClickFunc, rightClickFunc, failedLeftClickFunc,
                        failedRightClickFunc, goalFunc];

  alternateClicks(climbContextObject['clickInterval'],
                  climbContextObject['audioInterval'],
                  clickFunctions,
                  scene2ClimbCondition,
                  climbContextObject['leftClickTimer'],
                  climbContextObject['rightClickTimer'],
                  climbContextObject['clickCounter']);
}

function makeScene2ClimbLeftClick(contextObj)
{
  return function () {
    contextObj['clickCounter'] += 1;
    animateClickIndicator('left', contextObj['animElements'], contextObj['clickInterval'], contextObj['audioInterval']);
    contextObj['condition'] = (contextObj['clickCounter'] > ((1700 - contextObj['clickInterval']) / 100));
  }
}

function makeScene2ClimbRightClick(contextObj)
{
  return function () {
    contextObj['clickCounter'] += 1;
    animateClickIndicator('right', contextObj['animElements'], contextObj['clickInterval'], contextObj['audioInterval']);
    contextObj['condition'] = (contextObj['clickCounter'] > ((1700 - contextObj['clickInterval']) / 100));
  }
}

function makeScene2ClimbFailedLeftClick(contextObj)
{
  return function () {
    // TODO What do we need here?
    }
}

function makeScene2ClimbFailedRightClick(contextObj)
{
  return function () {
    // TODO What do we need here?
  }
}

function makeScene2ClimbGoal(contextObj)
{
  return function () {
    clearScreen(0, ['.selectable', '#instructorLeft', '#instructorRight', '.animElements'], 0);
    playAudio('forestImpression');
    pushNoFadeOutText(0, 10, "Now we’re climbing up towards the sky!");
    pushNoFadeOutText(0, 20, "Freedom’s there!");
    pushNoFadeOutText(0, 30, "I can see it there!");
    pushNoFadeOutText(0, 40, "And we’re almost there!");
    pushNoFadeOutText(0, 50, "To the open air!");
    pushNoFadeOutText(0, 70, "(FINAL CLIMB TO BE IMPLEMENTED)");

    this.queueFinishFunc = function () { nextScreenLoader(scene2StartClimb, 0); };
    runFloatingTextQueue();
  }
}

function makeScene2ClimbCondition(contextObj)
{
  return function () {
    return Boolean(contextObj['clickCounter'] > ((1700 - contextObj['clickInterval']) / 100) - 1);
  }
}

function scene2Incorrect1()
{
  clearScreen(0, ['.selectable'], 0);
  playAudio('forestImpression');
  pushNoFadeOutText(0, 10, "You’re not made up of all your problems!");
  pushNoFadeOutText(0, 20, "Even if you could solve them,");
  pushNoFadeOutText(0, 30, "They would still lay in wait...");
  pushNoFadeOutText(0, 40, "Waiting to shake your faith...");
  pushNoFadeOutText(0, 50, "Faith that it’s all okay...");

  this.queueFinishFunc = function () { nextScreenLoader(scene2Question2, 0); };
  runFloatingTextQueue();
}

function scene2Question2()
{
  stopAudio('forestImpression'); // TODO this would sound better faded out
  nextScreenLoader(
    function () {
      answerOptions(['I\'M OKAY', 'I\'M NOT OKAY'],
                    ['', ''],
                    [function () { nextScreenLoader(scene2Incorrect2, 0); },
                     function () { nextScreenLoader(scene2Correct2, 0); }]);
    }, 0);
}

function scene2Correct2()
{
  clearScreen(0, ['.selectable'], 0);
  playAudio('forestImpression');
  pushNoFadeOutText(0, 10, "Freedom’s not something that you say, it’s");
  pushNoFadeOutText(0, 20, "Living with your mistakes, it’s");
  pushNoFadeOutText(0, 30, "Reaching within ourselves...");
  pushNoFadeOutText(0, 40, "Because we are like no one else...");
  pushNoFadeOutText(0, 50, "Free to just be ourselves...");

  this.queueFinishFunc = function () { nextScreenLoader(scene2Question3Correct, 0); };
  runFloatingTextQueue();
}

function scene2Question3Correct()
{
  stopAudio('forestImpression'); // TODO this would sound better faded out
  // TODO check if correct/incorrect are assigned to the right choices
  nextScreenLoader(
    function () {
      answerOptions(['I DON\'T REMEMBER WHAT I\'VE DONE', 'I DON\'T REMEMBER WHO I AM'],
                    ['', ''],
                    [function () { nextScreenLoader(scene2Incorrect3, 0); },
                     function () { nextScreenLoader(scene2Correct3, 0); }]);
    }, 0);
}

function scene2Incorrect2()
{
  clearScreen(0, ['.selectable'], 0);
  playAudio('forestImpression');
  pushNoFadeOutText(0, 10, "I see a man that is not ok, who,");
  pushNoFadeOutText(0, 20, "Runs from his own mistakes, who");
  pushNoFadeOutText(0, 30, "Thinks that he could escape...");
  pushNoFadeOutText(0, 40, "Escape the mistakes he’s made...");
  pushNoFadeOutText(0, 50, "He thinks he’ll escape his fate...");

  this.queueFinishFunc = function () { nextScreenLoader(scene2Question3Incorrect, 0); };
  runFloatingTextQueue();
}

function scene2Question3Incorrect()
{
  stopAudio('forestImpression'); // TODO this would sound better faded out
  // TODO check if correct/incorrect are assigned to the right choices
  nextScreenLoader(
    function () {
      answerOptions(['STAY', 'ESCAPE'],
                    ['', ''],
                    [function () { nextScreenLoader(scene2Correct3, 0); },
                     function () { nextScreenLoader(scene2Incorrect3, 0); }]);
    }, 0);
}

function scene2Correct3()
{
  clearScreen(0, ['.selectable'], 0);
  playAudio('forestImpression');
  pushNoFadeOutText(0, 10, "Stay then,");
  pushNoFadeOutText(0, 20, "It’s okay then");
  pushNoFadeOutText(0, 30, "Stay then");
  pushNoFadeOutText(0, 40, "Stay and then");
  pushNoFadeOutText(0, 50, "Then you can stay and then");
  pushNoFadeOutText(0, 60, "Stay then");

  this.queueFinishFunc = scene2TearDown;
  runFloatingTextQueue();
}

function scene2Incorrect3()
{
  clearScreen(0, ['.selectable'], 0);
  playAudio('forestImpression');
  pushNoFadeOutText(0, 10, "Escape then");
  pushNoFadeOutText(0, 20, "Go ‘head we’re waiting");
  pushNoFadeOutText(0, 30, "You’ve been");
  pushNoFadeOutText(0, 40, "So awfully patient");
  pushNoFadeOutText(0, 50, "So thank you for not going anywhere");

  this.queueFinishFunc = scene2TearDown;
  runFloatingTextQueue();
}

function pushFadeOutText(left, top, text)
{
  pushFloatingTextQueue(left, top, text, 1500, 2000, 1500, 2000);
}

function pushNoFadeOutText(left, top, text)
{
  pushFloatingTextQueue(left, top, text, 1500, 2000, null, 2000);
}

function pushFloatingTextQueue(left, top, text, fadeInDur, delayDur, fadeOutDur, timeoutDur)
{
  var queueObject = {}
  queueObject['left'] = left;
  queueObject['top'] = top;
  queueObject['text'] = text;
  queueObject['fadeInDur'] = fadeInDur;
  queueObject['delayDur'] = delayDur;
  queueObject['fadeOutDur'] = fadeOutDur;
  queueObject['timeoutDur'] = timeoutDur;
  this.floatingTextQueue.push(queueObject);
}

function runFloatingTextQueue()
{
  if(this.floatingTextQueue && this.floatingTextQueue.length > 0)
  {
    var queueObject = this.floatingTextQueue.shift();
    var floatingDiv = document.createElement('div');
    $(floatingDiv).attr('class', 'msg scene2FloatText');
    $(floatingDiv).css('position', 'absolute');
    $(floatingDiv).css('left', queueObject['left'] + '%');
    $(floatingDiv).css('top', queueObject['top'] + '%');
    $(floatingDiv).css('opacity', '0');
    $(floatingDiv).html(queueObject['text']);
    $('body').append(floatingDiv);
    $(floatingDiv).fadeTo(queueObject['fadeInDur'], 1);
    if(queueObject['fadeOutDur'])
    {
      $(floatingDiv).delay(queueObject['delayDur']).fadeTo(queueObject['fadeOutDur'], 0);
    }
    setTimeout(runFloatingTextQueue, queueObject['timeoutDur']);
  }
  else
  {
    // Done processing queue, do cleanup and move on to next screen
    clearFloatingText();
    if(this.queueFinishFunc)
    {
      this.queueFinishFunc();
      this.queueFinishFunc = null;
    }
  }
}

function clearFloatingText()
{
  $('body').remove('.scene2FloatText');
}

function scene2TearDown()
{
  this.floatingTextQueue = null;
  this.queueFinishFunc = null;
  // TODO a bunch of calls to removeAudio here after we work in the
  // new clips, possibly on a setTimeout func or something that waits
  // until audio is done playing
}
