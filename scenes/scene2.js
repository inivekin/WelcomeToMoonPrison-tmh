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
  pushFloatingTextQueue(0, 10, "Picture in your mind...", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(30, 20, "...yellow fields...", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(50, 30, "...surrounded by green trees...", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(0, 40, "...and a little frog...", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(30, 50, "...playing in a pond...", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(50, 60, "...and he sings a song:", 1500, 2000, 1500, 2000);
  
  pushFloatingTextQueue(0, 10, "Hi there!", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(50, 20, "It's just so nice to see you!", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(30, 30, "Boy it must be nice to be you!", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(50, 40, "Being yourself is great...", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(50, 50, "Learning from your mistakes...", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(50, 60, "And boy you've made some mistakes...", 1500, 2000, 1500, 2000);
  
  pushFloatingTextQueue(10, 50, "We could, run round and climb a tree, or", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(10, 60, "Unless you’ve somewhere to be-fore", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(10, 70, "You make your next mistake", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(10, 80, "I can’t be up too late", 1500, 2000, 1500, 2000);
  pushFloatingTextQueue(10, 90, "So what is the choice you make?", 1500, 2000, 1500, 2000);
  
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
  pushFloatingTextQueue(0, 10, "I love climbing", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 20, "And I love trees", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 30, "I love climbing", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 40, "So climb with me", 1500, 2000, null, 2000);
  
  pushFloatingTextQueue(0, 60, "(CLIMBING TO BE IMPLEMENTED)", 1500, 2000, null, 2000);
  this.queueFinishFunc = null;
  runFloatingTextQueue();
}

function scene2Incorrect1()
{
  clearScreen(0, ['.selectable'], 0);
  playAudio('forestImpression');
  pushFloatingTextQueue(0, 10, "You’re not made up of all your problems!", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 20, "Even if you could solve them,", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 30, "They would still lay in wait...", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 40, "Waiting to shake your faith...", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 50, "Faith that it’s all okay...", 1500, 2000, null, 2000);
  
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
  pushFloatingTextQueue(0, 10, "Freedom’s not something that you say, it’s", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 20, "Living with your mistakes, it’s", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 30, "Reaching within ourselves...", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 40, "Because we are like no one else...", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 50, "Free to just be ourselves...", 1500, 2000, null, 2000);
  
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
  pushFloatingTextQueue(0, 10, "I see a man that is not ok, who,", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 20, "Runs from his own mistakes, who", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 30, "Thinks that he could escape...", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 40, "Escape the mistakes he’s made...", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 50, "He thinks he’ll escape his fate...", 1500, 2000, null, 2000);
  
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
  pushFloatingTextQueue(0, 10, "Stay then,", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 20, "It’s okay then", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 30, "Stay then", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 40, "Stay and then", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 50, "Then you can stay and then", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 60, "Stay then", 1500, 2000, null, 2000);
  
  this.queueFinishFunc = scene2TearDown;
  runFloatingTextQueue();
}

function scene2Incorrect3()
{
  clearScreen(0, ['.selectable'], 0);
  playAudio('forestImpression');
  pushFloatingTextQueue(0, 10, "Escape then", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 20, "Go ‘head we’re waiting", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 30, "You’ve been", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 40, "So awfully patient", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 50, "So thank you for not going anywhere", 1500, 2000, null, 2000);
  
  this.queueFinishFunc = scene2TearDown;
  runFloatingTextQueue();
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
