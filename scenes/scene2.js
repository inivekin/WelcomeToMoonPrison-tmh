$(document).ready(function () {
  setTimeout(function () {
    this.floatingTextQueue = [];
    this.queueFinishFunc = null;
    nextScreenLoader(scene2screen1, 0);
  }, 200);
});

function scene2screen1()
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
  
  this.queueFinishFunc = function () { nextScreenLoader(scene2screen2, 0); };
  runFloatingTextQueue();
}

function scene2screen2()
{
  stopAudio('forestImpression'); // TODO this would sound better faded out
  answerOptions(['CLIMB A TREE', 'I\'M BUSY'],
                ['', ''],
                [function () { nextScreenLoader(scene2ClimbTree1, 0); },
                 function () { nextScreenLoader(scene2Busy, 0); }]);
}

function scene2ClimbTree1()
{
  clearScreen(0, ['.selectable'], 0);
  $('#ansDiv').empty(); // FIXME this doesn't seem like the best way to do this - search scene 1 for better fix
  playAudio('forestImpression');
  pushFloatingTextQueue(0, 10, "I love climbing", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 20, "And I love trees", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 30, "I love climbing", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 40, "So climb with me", 1500, 2000, null, 2000);
  
  pushFloatingTextQueue(0, 60, "(CLIMBING TO BE IMPLEMENTED)", 1500, 2000, null, 2000);
  this.queueFinishFunc = null;
  runFloatingTextQueue();
}

function scene2Busy()
{
  clearScreen(0, ['.selectable'], 0);
  $('#ansDiv').empty(); // FIXME this doesn't seem like the best way to do this - search scene 1 for better fix
  playAudio('forestImpression');
  pushFloatingTextQueue(0, 10, "You’re not made up of all your problems!", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 20, "Even if you could solve them,", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 30, "They would still lay in wait...", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 40, "Waiting to shake your faith...", 1500, 2000, null, 2000);
  pushFloatingTextQueue(0, 50, "Faith that it’s all okay...", 1500, 2000, null, 2000);
  
  this.queueFinishFunc = function () { nextScreenLoader(scene2OkayNotOkay, 0); };
  runFloatingTextQueue();
}

function scene2OkayNotOkay()
{
  nextScreenLoader(
    function () {
      answerOptions(['I\'M OKAY', 'I\'M NOT OKAY'],
                    ['', ''],
                    [function () { /* TODO */ },
                     function () { /* TODO */ }]);
    }, 0);
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
  if(this.floatingTextQueue.length > 0)
  {
    var queueObject = this.floatingTextQueue.shift();
    var floatingDiv = document.createElement('div');
    $(floatingDiv).attr('class', 'msg scene2screen1FloatText');
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
    // Done processing queue, do cleanup and move on to next scene
    clearFloatingText();
    // TODO put the next 2 lines somewhere at end of scene for general hygiene
    // this.floatingTextQueue = null;
    // this.queueFinishFunc = null;
    if(this.queueFinishFunc)
    {
      this.queueFinishFunc();
      this.queueFinishFunc = null;
    }
  }
}

function clearFloatingText()
{
    $('body').remove('.scene2screen1FloatText');
}
