$(document).ready(function () {
    init();
});

function BufferLoader(context, urlList, callback) {
    console.log('loading buffer');
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}



var context;
var bufferLoader;

function init() {
  // Fix up prefixing
  console.log('init');

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '../audio/ForestImpression.ogg'
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
// Create two sources and play them both together.
var source1 = context.createBufferSource();

var tuna = new Tuna(context);

var convolver = new tuna.Convolver({
highCut: 4000,                         //20 to 22050
lowCut: 20,                             //20 to 22050
dryLevel: 1,                            //0 to 1+
wetLevel: 1,                            //0 to 1+
level: 1,                               //0 to 1+, adjusts total output of both wet and dry
impulse: "./audio/impulses/PrimeLong.wav",    //the path to your impulse response
bypass: 0
});

source1.buffer = bufferList[0];

source1.connect(convolver);
convolver.connect(context.destination);
source1.start(0);

setTimeout(function () {
    console.log('change');
    convolver.disconnect(0);
    source1.connect(context.destination);
}, 5000)
}


/*    console.log('started');
    var buffer;
    var randomBuffer = null;
    var audio = document.getElementById('einstein');
    var context = new AudioContext();
    var source = context.createBufferSource();
    //var convolver = context.createConvolver();
    var irRRequest = new XMLHttpRequest();
    irRRequest.open("GET", "./audio/ForestImpression.ogg", true);
    irRRequest.responseType = "arraybuffer";
    irRRequest.onload = function() {
        context.decodeAudioData( irRRequest.response,
            function(buffer) { randomBuffer = buffer; } );
    };
    irRRequest.send();

    source.buffer = buffer
// note the above is async; when the buffer is loaded, it will take effect, but in the meantime, the sound will be unaffected.

    // source.connect( convolver );
    // convolver.connect( context.destination ); // without tuna method

    //var audio = $('#einstein').get(0);
    // source.buffer = buffer;
    //var gainControl = context.createGain();


    /* var convolver = new tuna.Convolver({
    highCut: 10000,                         //20 to 22050
    lowCut: 20,                             //20 to 22050
    dryLevel: 1,                            //0 to 1+
    wetLevel: 1,                            //0 to 1+
    level: 1,                               //0 to 1+, adjusts total output of both wet and dry
    impulse: "./audio/impulses/PrimeLong.wav",    //the path to your impulse response
    bypass: 0
});

    source.connect(context.destination);
    // convolver.connect(context.destination);
    console.log('starting source');

    source.start(0);
});*/
