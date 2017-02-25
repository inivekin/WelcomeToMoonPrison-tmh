$(document).ready(function () {
  setTimeout(function () {
    this.floatingTextQueue = [];
    nextScreenLoader(scene2starter, 0);
  }, 200);
});

function scene2starter()
{
  addAudio('forestImpression', './audio/ForestImpression.ogg');
  playAudio('forestImpression');
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
  if(this.floatingTextQueue.length > 0)
  {
    var queueObject = this.floatingTextQueue.shift();
    var floatingDiv = document.createElement('div');
    $(floatingDiv).attr('class','msg');
    $(floatingDiv).css('position', 'absolute');
    $(floatingDiv).css('left', queueObject['left'] + '%');
    $(floatingDiv).css('top', queueObject['top'] + '%');
    $(floatingDiv).css('opacity', '0');
    $(floatingDiv).html(queueObject['text']);
    $('body').append(floatingDiv);
    $(floatingDiv).fadeTo(queueObject['fadeInDur'], 1).delay(queueObject['delayDur']).fadeTo(queueObject['fadeOutDur'], 0);
    setTimeout(runFloatingTextQueue, queueObject['timeoutDur']);
  }
}
