const {remote, shell} = require('electron')
const {Menu, MenuItem} = remote
const {dialog} = require('electron').remote
const path = require('path')
const csvsync = require('csvsync')
const fs = require('fs')
const os = require("os");
const $ = require('jQuery')
const {app} = require('electron').remote;
const appRootDir = require('app-root-dir').get() //get the path of the application bundle
const ffmpeg = appRootDir+'/ffmpeg/ffmpeg'
const exec = require( 'child_process' ).exec
const si = require('systeminformation');
const naturalSort = require('node-natural-sort')
var userDataPath = path.join(app.getPath('userData'),'Data');
makeSureUserDataFolderIsThere()
console.log('user path: ', userDataPath)
var moment = require('moment')
var content = document.getElementById("contentDiv")
var localMediaStream
var sys = {
  modelID: 'unknown',
  isMacBook: false // need to detect if macbook for ffmpeg recording framerate value
}
//var instructions = "I'm going to ask you to name some pictures. When you hear a beep, a picture will appear on the computer screen. Your job is to name the picture using only one word. We'll practice several pictures before we begin"
var palpa1Instructions = ["palpa1"]
var palpa2Instructions = ["palpa2"]
var palpa8Instructions = ["palpa8"]
var palpa14Instructions = ["palpa14"]
var palpa15Instructions = ["palpa15"]
var palpa16Instructions = ["palpa16"]
var palpa17Instructions = ["palpa17"]
var beepSound = path.join(__dirname, 'assets', 'beep.wav')
var exp = new experiment('Phonological-assessment')
// construct a new ffmpeg recording object
var rec = new ff()
var palpa1TimeoutID
var palpa2TimeoutID
var palpa8TimeoutID
var palpa14TimeoutID
var palpa15TimeoutID
var palpa16TimeoutID
var palpa17TimeoutID
var palpa1TimeoutTime = 1000*30 // 30 seconds
var palpa2TimeoutTime = 1000*30 // 30 seconds
var palpa8TimeoutTime = 1000*30 // 30 seconds
var palpa14TimeoutTime = 1000*30 // 30 seconds
var palpa15TimeoutTime = 1000*30 // 30 seconds
var palpa16TimeoutTime = 1000*30 // 30 seconds
var palpa17TimeoutTime = 1000*30 // 30 seconds
var imgTimeoutID
var imgDurationMS = 1000*2 // 2 seconds
exp.getRootPath()
exp.getMediaPath()
var palpa1MediaPath = path.resolve(exp.mediapath, 'palpa1', 'media')
var palpa2MediaPath = path.resolve(exp.mediapath, 'palpa2', 'media')
var palpa8MediaPath = path.resolve(exp.mediapath, 'palpa8', 'media')
var palpa14MediaPath = path.resolve(exp.mediapath, 'palpa14', 'media')
var palpa15MediaPath = path.resolve(exp.mediapath, 'palpa15', 'media')
var palpa16MediaPath = path.resolve(exp.mediapath, 'palpa16', 'media')
var palpa17MediaPath = path.resolve(exp.mediapath, 'palpa17', 'media')
var palpa1StimList = fs.readdirSync(palpa1MediaPath).sort(naturalSort())
var palpa2StimList = fs.readdirSync(palpa2MediaPath).sort(naturalSort())
var palpa8StimList = fs.readdirSync(palpa8MediaPath).sort(naturalSort())
var palpa14StimList = fs.readdirSync(palpa14MediaPath).sort(naturalSort())
var palpa15StimList = fs.readdirSync(palpa15MediaPath).sort(naturalSort())
var palpa16StimList = fs.readdirSync(palpa16MediaPath).sort(naturalSort())
var palpa17StimList = fs.readdirSync(palpa17MediaPath).sort(naturalSort())
var palpa1Trials = readCSV(path.resolve(exp.mediapath, 'palpa1', 'palpa1stim.csv'))
var palpa2Trials = readCSV(path.resolve(exp.mediapath, 'palpa2', 'palpa2stim.csv'))
var palpa8Trials = readCSV(path.resolve(exp.mediapath, 'palpa8', 'palpa8stim.csv'))
var palpa14Trials = readCSV(path.resolve(exp.mediapath, 'palpa14', 'palpa14stim.csv'))
var palpa15Trials = readCSV(path.resolve(exp.mediapath, 'palpa15', 'palpa15stim.csv'))
var palpa16Trials = readCSV(path.resolve(exp.mediapath, 'palpa16', 'palpa16stim.csv'))
var palpa17Trials = readCSV(path.resolve(exp.mediapath, 'palpa17', 'palpa17stim.csv'))
var maxNumberOfPalpa1Trials = palpa1Trials.length
var maxNumberOfPalpa2Trials = palpa2Trials.length
var maxNumberOfPalpa8Trials = palpa8Trials.length
var maxNumberOfPalpa14Trials = palpa14Trials.length
var maxNumberOfPalpa15Trials = palpa15Trials.length
var maxNumberOfPalpa16Trials = palpa16Trials.length
var maxNumberOfPalpa17Trials = palpa17Trials.length
var palpa1FileToSave
var palpa2FileToSave
var palpa8FileToSave
var palpa14FileToSave
var palpa15FileToSave
var palpa16FileToSave
var palpa17FileToSave
var palpa1DataFileHeader = ['subj', 'session', 'assessment', 'trial', 'diffLoc', 'diffType', 'keyPressed', 'reactionTime', 'accuracy', os.EOL]
var palpa2DataFileHeader = ['subj', 'session', 'assessment', 'trial', 'diffLoc', 'diffType', 'frequency', 'keyPressed', 'reactionTime', 'accuracy', os.EOL]
var palpa14DataFileHeader = ['subj', 'session', 'assessment', 'trial', 'conditionType', 'keyPressed', 'reactionTime', 'accuracy', os.EOL]
var palpa15DataFileHeader = ['subj', 'session', 'assessment', 'trial', 'conditionType', 'keyPressed', 'reactionTime', 'accuracy', os.EOL]
var palpa16DataFileHeader = ['subj', 'session', 'assessment', 'practice', 'trial', 'target', 'wordOrNot', 'keyPressed', 'reactionTime', 'accuracy', 'errorType', os.EOL]
var palpa17DataFileHeader = ['subj', 'session', 'assessment', 'practice', 'trial', 'target', 'wordOrNot', 'keyPressed', 'reactionTime', 'accuracy', 'errorType', os.EOL]
var assessment = ''
var subjID
var sessID
var stimOnset
var accuracy
var rt
//var trialNum = document.getElementById("trialNumID")
//var trialNumber = 1
var t = 0
var tReal = t-1
lowLag.init(); // init audio functions
//console.log(cinderellaImgs)








//camera preview on
function startWebCamPreview() {
  clearScreen()
  var vidPrevEl = document.createElement("video")
  vidPrevEl.autoplay = true
  vidPrevEl.id = "webcampreview"
  content.appendChild(vidPrevEl)
  navigator.webkitGetUserMedia({video: true, audio: false},
    function(stream) {
      localMediaStream = stream
      vidPrevEl.src = URL.createObjectURL(stream)
    },
    function() {
      alert('Could not connect to webcam')
    }
  )
}


// camera preview off
function stopWebCamPreview () {
  if(typeof localMediaStream !== "undefined")
  {
    localMediaStream.getVideoTracks()[0].stop()
    clearScreen()
  }
}


// get date and time for appending to filenames
function getDateStamp() {
  ts = moment().format('MMMM Do YYYY, h:mm:ss a')
  ts = ts.replace(/ /g, '-') // replace spaces with dash
  ts = ts.replace(/,/g, '') // replace comma with nothing
  ts = ts.replace(/:/g, '-') // replace colon with dash
  console.log('recording date stamp: ', ts)
  return ts
}


// runs when called by systeminformation
function updateSys(ID) {
  sys.modelID = ID
  if (ID.includes("MacBook") == true) {
    sys.isMacBook = true
  }

  //console.log("updateSys has updated!")
  //console.log(ID.includes("MacBook"))
  //console.log(sys.isMacBook)
} // end updateSys

si.system(function(data) {
  console.log(data['model']);
  updateSys(data['model'])
})


// ffmpeg object constructor
function ff() {
  this.ffmpegPath = path.join(appRootDir,'ffmpeg','ffmpeg'),
  this.framerate = function () {

  },
  this.shouldOverwrite = '-y',         // do overwrite if file with same name exists
  this.threadQueSize = '50',           // preallocation
  this.cameraFormat = 'avfoundation',  // macOS only
  this.screenFormat = 'avfoundation',  // macOS only
  this.cameraDeviceID = '0',           // macOS only
  this.audioDeviceID = '0',            // macOS only
  this.screenDeviceID = '1',           // macOS only
  this.videoSize = '1280x720',         // output video dimensions
  this.videoCodec = 'libx264',         // encoding codec
  this.recQuality = '20',              //0-60 (0 = perfect quality but HUGE files)
  this.preset = 'ultrafast',
  this.videoExt = '.mp4',
  // filter is for picture in picture effect
  this.filter = '"[0]scale=iw/8:ih/8 [pip]; [1][pip] overlay=main_w-overlay_w-10:main_h-overlay_h-10"',
  this.isRecording = false,
  this.getSubjID = function() {
    var subjID = document.getElementById("subjID").value
    if (subjID === '') {
      console.log ('subject is blank')
      alert('Participant field is blank!')
      subjID = '0000'
    }
    return subjID
  },
  this.getSessID = function () {
    var sessID = document.getElementById("sessID").value
    if (sessID === '') {
      console.log ('session is blank')
      alert('Session field is blank!')
      sessID = '0000'
    }
    return sessID
  },
  this.getAssessmentType = function () {
    var assessmentType = document.getElementById("assessmentID").value
    if (assessmentType === '') {
      console.log ('assessment field is blank')
      alert('Assessment field is blank!')
    } else {
      return assessmentType
    }
  },
  this.datestamp = getDateStamp(),
  this.makeOutputFolder = function () {
    outpath = path.join(userDataPath, 'video')
    //fs.mkdirSync(path.join(app.getPath('userData'), 'video'))
    if (!fs.existsSync(outpath)) {
      fs.mkdirSync(outpath)
    }
    return outpath
  }
  this.outputFilename = function() {
    return path.join(this.makeOutputFolder(), this.getSubjID()+'_'+this.getSessID()+'_'+this.getAssessmentType()+'_'+getDateStamp()+this.videoExt)
  },
  this.getFramerate = function () {
    if (sys.isMacBook == true){
      var framerate = 30
    } else {
      var framerate = 29.97
    }
    return framerate
  },
  this.startRec = function() {
    cmd = [
      '"'+this.ffmpegPath +'"' +
      ' ' + this.shouldOverwrite +
      ' -thread_queue_size ' + this.threadQueSize +
      ' -f ' + this.screenFormat +
      ' -framerate ' + this.getFramerate().toString() +
      ' -i ' + '"' + this.screenDeviceID + '"' +
      ' -thread_queue_size ' + this.threadQueSize +
      ' -f ' + this.cameraFormat +
      ' -framerate ' + this.getFramerate().toString() +
      ' -video_size ' + this.videoSize +
      ' -i "' + this.cameraDeviceID + '":"' + this.audioDeviceID + '"' +
      ' -profile:v baseline' +
      ' -c:v ' + this.videoCodec +
      ' -crf ' + this.recQuality +
      ' -preset ultrafast' +
      ' -filter_complex ' + this.filter +
      ' -r ' + this.getFramerate().toString() +
      ' ' + '"' + this.outputFilename() + '"'
    ]
    console.log('ffmpeg cmd: ')
    console.log(cmd)
    this.isRecording = true
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      // console.log(`stdout: ${stdout}`);
      // console.log(`stderr: ${stderr}`);
    })
  },
  this.stopRec = function () {
    exec('killall ffmpeg')
  }
}


// open data folder in finder
function openDataFolder() {
  dataFolder = userDataPath
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder)
  }
  shell.showItemInFolder(dataFolder)
}


function makeSureUserDataFolderIsThere(){
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath)
  }
}


function chooseFile() {
  console.log("Analyze a file!")
  dialog.showOpenDialog(
    {title: "PALPA Analysis",
    defaultPath: userDataPath,
    properties: ["openFile"]},
  analyzeSelectedFile)
}


function analyzeSelectedFile(filePath) {
  console.log("file chosen: ", filePath)
}


// play audio file using lowLag API
function playAudio(fileToPlay) {
  lowLag.load(fileToPlay);
  lowLag.play(fileToPlay);
  return getTime()
}


// get timestamp (milliseconds since file loaded)
function getTime() {
  return performance.now()
}


// read csv file. This is how experiments will be controlled, query files to show, etc.
function readCSV(filename){
  var csv = fs.readFileSync(filename)
  var stim = csvsync.parse(csv, {
    skipHeader: false,
    returnObject: true
  })
  //var stim = csvReader(filename)
  console.log(stim)
  return stim
  //stim = readCSV(myfile)
  //console.log(stim)
  //var myfile = __dirname+'/experiments/pnt/assets/txt/pntstim.csv'
}



// remove all child elements from a div, here the convention will be to
// remove the elements from "contentDiv" after a trial
function clearScreen() {
  while (content.hasChildNodes())
  content.removeChild(content.lastChild)
}


// show text instructions on screen
function showPalpa1Instructions(txt) {
  palpa1FileToSave = path.join(userDataPath,subjID+'_'+sessID+'_'+assessment+'_'+getDateStamp()+'.csv')
  clearScreen()
  //rec.startRec()
  var textDiv = document.createElement("div")
  textDiv.style.textAlign = 'center'
  var p = document.createElement("p")
  var txtNode = document.createTextNode(txt)
  p.appendChild(txtNode)
  textDiv.appendChild(p)
  var lineBreak = document.createElement("br")
  var btnDiv = document.createElement("div")
  var startBtn = document.createElement("button")
  var startBtnTxt = document.createTextNode("Start")
  startBtn.appendChild(startBtnTxt)
  startBtn.onclick = showNextPalpa1Trial
  btnDiv.appendChild(startBtn)
  content.appendChild(textDiv)
  content.appendChild(lineBreak)
  content.appendChild(btnDiv)
  return getTime()
}



// show text instructions on screen
function showPalpa2Instructions(txt) {
  palpa2FileToSave = path.join(userDataPath,subjID+'_'+sessID+'_'+assessment+'_'+getDateStamp()+'.csv')
  clearScreen()
  //rec.startRec()
  var textDiv = document.createElement("div")
  textDiv.style.textAlign = 'center'
  var p = document.createElement("p")
  var txtNode = document.createTextNode(txt)
  p.appendChild(txtNode)
  textDiv.appendChild(p)
  var lineBreak = document.createElement("br")
  var btnDiv = document.createElement("div")
  var startBtn = document.createElement("button")
  var startBtnTxt = document.createTextNode("Start")
  startBtn.appendChild(startBtnTxt)
  startBtn.onclick = showNextPalpa2Trial
  btnDiv.appendChild(startBtn)
  content.appendChild(textDiv)
  content.appendChild(lineBreak)
  content.appendChild(btnDiv)
  return getTime()
}



// show text instructions on screen
function showPalpa8Instructions(txt) {
  clearScreen()
  rec.startRec()
  var textDiv = document.createElement("div")
  textDiv.style.textAlign = 'center'
  var p = document.createElement("p")
  var txtNode = document.createTextNode(txt)
  p.appendChild(txtNode)
  textDiv.appendChild(p)
  var lineBreak = document.createElement("br")
  var btnDiv = document.createElement("div")
  var startBtn = document.createElement("button")
  var startBtnTxt = document.createTextNode("Start")
  startBtn.appendChild(startBtnTxt)
  startBtn.onclick = showNextPalpa8Trial
  btnDiv.appendChild(startBtn)
  content.appendChild(textDiv)
  content.appendChild(lineBreak)
  content.appendChild(btnDiv)
  return getTime()
}



// show text instructions on screen
function showPalpa14Instructions(txt) {
  palpa14FileToSave = path.join(userDataPath,subjID+'_'+sessID+'_'+assessment+'_'+getDateStamp()+'.csv')
  clearScreen()
  //rec.startRec()
  var textDiv = document.createElement("div")
  textDiv.style.textAlign = 'center'
  var p = document.createElement("p")
  var txtNode = document.createTextNode(txt)
  p.appendChild(txtNode)
  textDiv.appendChild(p)
  var lineBreak = document.createElement("br")
  var btnDiv = document.createElement("div")
  var startBtn = document.createElement("button")
  var startBtnTxt = document.createTextNode("Start")
  startBtn.appendChild(startBtnTxt)
  startBtn.onclick = showNextPalpa14Trial
  btnDiv.appendChild(startBtn)
  content.appendChild(textDiv)
  content.appendChild(lineBreak)
  content.appendChild(btnDiv)
  return getTime()
}

// show text instructions on screen
function showPalpa15Instructions(txt) {
  palpa15FileToSave = path.join(userDataPath,subjID+'_'+sessID+'_'+assessment+'_'+getDateStamp()+'.csv')
  clearScreen()
  //rec.startRec()
  var textDiv = document.createElement("div")
  textDiv.style.textAlign = 'center'
  var p = document.createElement("p")
  var txtNode = document.createTextNode(txt)
  p.appendChild(txtNode)
  textDiv.appendChild(p)
  var lineBreak = document.createElement("br")
  var btnDiv = document.createElement("div")
  var startBtn = document.createElement("button")
  var startBtnTxt = document.createTextNode("Start")
  startBtn.appendChild(startBtnTxt)
  startBtn.onclick = showNextPalpa15Trial
  btnDiv.appendChild(startBtn)
  content.appendChild(textDiv)
  content.appendChild(lineBreak)
  content.appendChild(btnDiv)
  return getTime()
}

// show text instructions on screen
function showPalpa16Instructions(txt) {
  palpa16FileToSave = path.join(userDataPath,subjID+'_'+sessID+'_'+assessment+'_'+getDateStamp()+'.csv')
  clearScreen()
  //rec.startRec()
  var textDiv = document.createElement("div")
  textDiv.style.textAlign = 'center'
  var p = document.createElement("p")
  var txtNode = document.createTextNode(txt)
  p.appendChild(txtNode)
  textDiv.appendChild(p)
  var lineBreak = document.createElement("br")
  var btnDiv = document.createElement("div")
  var startBtn = document.createElement("button")
  var startBtnTxt = document.createTextNode("Start")
  startBtn.appendChild(startBtnTxt)
  startBtn.onclick = showNextPalpa16Trial
  btnDiv.appendChild(startBtn)
  content.appendChild(textDiv)
  content.appendChild(lineBreak)
  content.appendChild(btnDiv)
  return getTime()
}

// show text instructions on screen
function showPalpa17Instructions(txt) {
  palpa17FileToSave = path.join(userDataPath,subjID+'_'+sessID+'_'+assessment+'_'+getDateStamp()+'.csv')
  clearScreen()
  //rec.startRec()
  var textDiv = document.createElement("div")
  textDiv.style.textAlign = 'center'
  var p = document.createElement("p")
  var txtNode = document.createTextNode(txt)
  p.appendChild(txtNode)
  textDiv.appendChild(p)
  var lineBreak = document.createElement("br")
  var btnDiv = document.createElement("div")
  var startBtn = document.createElement("button")
  var startBtnTxt = document.createTextNode("Start")
  startBtn.appendChild(startBtnTxt)
  startBtn.onclick = showNextPalpa17Trial
  btnDiv.appendChild(startBtn)
  content.appendChild(textDiv)
  content.appendChild(lineBreak)
  content.appendChild(btnDiv)
  return getTime()
}


function showImg(imgPath, imgDurationMS) {
  clearScreen()
  var imageEl = document.createElement("img")
  imageEl.src = imgPath
  content.appendChild(imageEl)
  clearTimeout(imgTimeoutID)
  imgTimeoutID = setTimeout(clearScreen, imgDurationMS)
  return getTime()
}



function stopRecordingAndShowNav() {
  clearScreen()
  rec.stopRec()
  openNav()
}



function clearScreenAndStopRecording() {
  clearScreen()
  rec.stopRec()
  openNav()
}



// load experiment module js file. All experiments are written in js, no separate html file
function loadJS (ID) {
  if (!document.getElementById(ID +'JS')) {
    expDir = path.join(__dirname, '/experiments/', ID, path.sep)
    scrElement = document.createElement("script")
    scrElement.type = "application/javascript"
    scrElement.src = expDir + ID + '.js'
    scrElement.id = ID + 'JS'
    document.body.appendChild(scrElement)
    console.log('loaded: ', scrElement.src)
    //might need to wait for scrElement.onload event -- test this
    //http://stackoverflow.com/a/38834971/3280952
  }
}


// unload js at the end of experiment run
function unloadJS (ID) {
  if (document.getElementById(ID +'JS')) {
    scrElement = document.getElementById(ID +'JS')
    document.body.removeChild(scrElement)
    console.log('removed: ', ID +'JS')
  }
}


// wait for time (in ms) and then run the supplied function.
// for now, the supplied function can only have one input variable.
// this WILL HANG the gui
function waitThenDoSync(ms, doneWaitingCallback, arg){
   var start = performance.now()
   var end = start;
   while(end < start + ms) {
     end = performance.now()
  }
  if (arg !== undefined) {
    doneWaitingCallback(arg)
  } else {
    doneWaitingCallback()
  }
}


// wait for time (in ms) and then run the supplied function.
// for now, the supplied function can only have one input variable. (this does not hang gui)
function waitThenDoAsync (ms, doneWaitingCallback, arg) {
  start = performance.now()
  setTimeout(function () {
    if (arg !== undefined) {
      doneWaitingCallback(arg)
    } else {
      doneWaitingCallback()
    }
    end = performance.now()
    console.log('Actual waitThenDo() time: ', end - start)
  }, ms)
}


 // keys object for storing keypress information
var keys = {
  key : '',
  time : 0,
  rt: 0,
  specialKeys: [' ', 'Enter', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Shift', 'Tab', 'BackSpace'],
  letterKeys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  alphaNumericKeys: 'abcdefghijklmnopqrstuvwxyz1234567890'.split(''), // inspired by: http://stackoverflow.com/a/31755504/3280952
  whiteList: function () {
    return this.alphaNumericKeys.concat(this.specialKeys)
  },
  blackList: [],
  isAllowed: function () {
    idx = this.whiteList().indexOf(this.key)
    var val = false
    if (idx > 0) {
      val = true
    } else {
      val = false
    }
    return val
  }
}


// experiment object for storing session parameters, etc.
function experiment(name) {
  this.beginTime= 0,
  this.endTime= 0,
  this.duration= 0,
  this.name= name,
  this.rootpath= '',
  this.mediapath= '',
  this.getDuration = function () {
    return this.endTime - this.beginTime
  },
  this.setBeginTime = function() {
    this.beginTime = performance.now()
  },
  this.setEndTime = function () {
    this.endTime = performance.now()
  },
  this.getMediaPath = function () {
    this.mediapath = path.join(__dirname, '/assets/')
    return this.mediapath
  },
  this.getRootPath = function () {
    this.rootpath = path.join(__dirname,'/')
    return this.rootpath
  }
}


function getRT() {
  return keys.time - stimOnset
}


function checkPalpa1Accuracy() {
 if (keys.key === palpa1Trials[t].same.trim()) {
   acc = 1
 } else {
   acc = 0
 }
 return acc
}


function checkPalpa2Accuracy() {
 if (keys.key === palpa2Trials[t].same.trim()) {
   acc = 1
 } else {
   acc = 0
 }
 return acc
}


function checkPalpa14Accuracy() {
 if (keys.key === palpa14Trials[t].correctResp.trim()) {
   acc = 1
 } else {
   acc = 0
 }
 return acc
}


function checkPalpa15Accuracy() {
 if (keys.key === palpa15Trials[t].same.trim()) {
   acc = 1
 } else {
   acc = 0
 }
 return acc
}


function checkPalpa16Accuracy() {
 letters = [palpa16Trials[t].letter1.trim(), palpa16Trials[t].letter2.trim(), palpa16Trials[t].letter3.trim(), palpa16Trials[t].letter4.trim(), palpa16Trials[t].letter5.trim()]
 //errorCodes = [palpa16Trials[t].error1.trim(), palpa16Trials[t].error2.trim(), palpa16Trials[t].error3.trim(), palpa16Trials[t].error4.trim(), palpa16Trials[t].error5.trim()]
 correctChoice = palpa16Trials[t].name.charAt(0) // first character is the target
 subjChoice = keys.key
 if (subjChoice === correctChoice) {
   acc = 1
   errorType = 'noErr'
 } else {
   acc = 0
   errorType = 'someErr'
 }
 // } else {
 //   acc = 0
 //   errorIdx = errorCodes.indexOf(subjChoice)
 //   if (errorIdx < 0) {
 //     errorType = 'keyNotInList'
 //   } else {
 //     errorType = errorCodes[errorIdx]
 //   }
 // }
 console.log("errorType: ", errorType, " accuracy: ", acc)
 return {acc: acc,
        errorType: errorType}
}


function checkPalpa17Accuracy() {
  letters = [palpa17Trials[t].letter1.trim(), palpa17Trials[t].letter2.trim(), palpa17Trials[t].letter3.trim(), palpa17Trials[t].letter4.trim(), palpa17Trials[t].letter5.trim()]
  //errorCodes = [palpa17Trials[t].error1.trim(), palpa17Trials[t].error2.trim(), palpa17Trials[t].error3.trim(), palpa17Trials[t].error4.trim(), palpa17Trials[t].error5.trim()]
  correctChoice = palpa17Trials[t].correctChoice.trim() // first character is the target
  subjChoice = keys.key
  if (subjChoice === correctChoice) {
    acc = 1
    errorType = 'noErr'
  } else {
    acc = 0
    errorType = 'someErr'
  }
  // } else {
  //   acc = 0
  //   errorIdx = errorCodes.indexOf(subjChoice)
  //   if (errorIdx < 0) {
  //     errorType = 'keyNotInList'
  //   } else {
  //     errorType = errorCodes[errorIdx]
  //   }
  // }
  console.log("errorType: ", errorType, " accuracy: ", acc)
  return {acc: acc,
         errorType: errorType}
}



function appendPalpa1TrialDataToFile(fileToAppend, dataArray) {
  dataArray.push(os.EOL)
  dataString = csvsync.stringify(dataArray)
  if (!fs.existsSync(fileToAppend)) {
    fs.appendFileSync(fileToAppend, palpa1DataFileHeader)
    fs.appendFileSync(fileToAppend, dataArray)
  } else {
    fs.appendFileSync(fileToAppend, dataArray)
  }
  console.log("appended file: ", fileToAppend)
}


function appendPalpa2TrialDataToFile(fileToAppend, dataArray) {
  dataArray.push(os.EOL)
  dataString = csvsync.stringify(dataArray)
  if (!fs.existsSync(fileToAppend)) {
    fs.appendFileSync(fileToAppend, palpa2DataFileHeader)
    fs.appendFileSync(fileToAppend, dataArray)
  } else {
    fs.appendFileSync(fileToAppend, dataArray)
  }
  console.log("appended file: ", fileToAppend)
}


function appendPalpa8TrialDataToFile(fileToAppend, dataArray) {
  dataArray.push(os.EOL)
  dataString = csvsync.stringify(dataArray)
  if (!fs.existsSync(fileToAppend)) {
    fs.appendFileSync(fileToAppend, palpa8DataFileHeader)
    fs.appendFileSync(fileToAppend, dataArray)
  } else {
    fs.appendFileSync(fileToAppend, dataArray)
  }
  console.log("appended file: ", fileToAppend)
}


function appendPalpa14TrialDataToFile(fileToAppend, dataArray) {
  dataArray.push(os.EOL)
  dataString = csvsync.stringify(dataArray)
  if (!fs.existsSync(fileToAppend)) {
    fs.appendFileSync(fileToAppend, palpa14DataFileHeader)
    fs.appendFileSync(fileToAppend, dataArray)
  } else {
    fs.appendFileSync(fileToAppend, dataArray)
  }
  console.log("appended file: ", fileToAppend)
}


function appendPalpa15TrialDataToFile(fileToAppend, dataArray) {
  dataArray.push(os.EOL)
  dataString = csvsync.stringify(dataArray)
  if (!fs.existsSync(fileToAppend)) {
    fs.appendFileSync(fileToAppend, palpa15DataFileHeader)
    fs.appendFileSync(fileToAppend, dataArray)
  } else {
    fs.appendFileSync(fileToAppend, dataArray)
  }
  console.log("appended file: ", fileToAppend)
}


function appendPalpa16TrialDataToFile(fileToAppend, dataArray) {
  dataArray.push(os.EOL)
  dataString = csvsync.stringify(dataArray)
  if (!fs.existsSync(fileToAppend)) {
    fs.appendFileSync(fileToAppend, palpa16DataFileHeader)
    fs.appendFileSync(fileToAppend, dataArray)
  } else {
    fs.appendFileSync(fileToAppend, dataArray)
  }
  console.log("appended file: ", fileToAppend)
}


function appendPalpa17TrialDataToFile(fileToAppend, dataArray) {
  dataArray.push(os.EOL)
  dataString = csvsync.stringify(dataArray)
  if (!fs.existsSync(fileToAppend)) {
    fs.appendFileSync(fileToAppend, palpa17DataFileHeader)
    fs.appendFileSync(fileToAppend, dataArray)
  } else {
    fs.appendFileSync(fileToAppend, dataArray)
  }
  console.log("appended file: ", fileToAppend)
}


function checkPalpa16ErrorType() {
  var errType = 'x'
  return errType
}


function checkPalpa17ErrorType() {
  var errType = 'x'
  return errType
}



// update keys object when a keydown event is detected
function updateKeys() {
  // gets called from: document.addEventListener('keydown', updateKeys);
  keys.key = event.key
  keys.time = performance.now() // gives ms
  keys.rt = 0
  console.log("key: " + keys.key)
  if (keys.key === '1' || keys.key === '2') {
    if (assessment === 'palpa1') {
      accuracy = checkPalpa1Accuracy()
      console.log("accuracy: ", accuracy)
      keys.rt = getRT()
      console.log("RT: ", keys.rt)
      appendPalpa1TrialDataToFile(palpa1FileToSave, [subjID, sessID, assessment, palpa1Trials[t].name.trim(), palpa1Trials[t].diffLoc.trim(), palpa1Trials[t].diffType.trim(), keys.key, keys.rt, accuracy])
      showNextPalpa1Trial()
    } else if (assessment === 'palpa2') {
      accuracy = checkPalpa2Accuracy()
      appendPalpa2TrialDataToFile(palpa2FileToSave, [subjID, sessID, assessment, palpa2Trials[t].name.trim(), palpa2Trials[t].diffLoc.trim(), palpa2Trials[t].diffType.trim(), palpa2Trials[t].freq.trim(), keys.key, keys.rt, accuracy])
      showNextPalpa2Trial()
    } else if (assessment === 'palpa14') {
      accuracy = checkPalpa14Accuracy()
      appendPalpa14TrialDataToFile(palpa14FileToSave, [subjID, sessID, assessment, palpa14Trials[t].PictureName.trim(), palpa14Trials[t].conditionType.trim(), keys.key, keys.rt, accuracy])
      showNextPalpa14Trial()
    } else if (assessment === 'palpa15') {
      accuracy = checkPalpa15Accuracy()
      appendPalpa15TrialDataToFile(palpa15FileToSave, [subjID, sessID, assessment, palpa15Trials[t].name.trim(), palpa15Trials[t].conditionType.trim(), keys.key, keys.rt, accuracy])
      showNextPalpa15Trial()
    }
  } else if (keys.key === 'ArrowLeft') {
    if (assessment === 'palpa1') {
      showPreviousPalpa1Trial()
    } else if (assessment === 'palpa2') {
      showPreviousPalpa2Trial()
    } else if (assessment === 'palpa8') {
      showPreviousPalpa8Trial()
    } else if (assessment === 'palpa14') {
      showPreviousPalpa14Trial()
    } else if (assessment === 'palpa15') {
      showPreviousPalpa15Trial()
    } else if (assessment === 'palpa16') {
      showPreviousPalpa16Trial()
    } else if (assessment === 'palpa17') {
      showPreviousPalpa17Trial()
    }
  } else if (keys.letterKeys.indexOf(keys.key) > -1) {
    if (assessment === 'palpa16') {
      palpa16Result = checkPalpa16Accuracy()
      appendPalpa16TrialDataToFile(palpa16FileToSave, [subjID, sessID, assessment, palpa16Trials[t].practice.trim(), palpa16Trials[t].name.trim(), palpa16Trials[t].name.charAt(0), palpa16Trials[t].wordOrNot.trim(), keys.key, keys.rt, palpa16Result.acc, palpa16Result.errorType])
      showNextPalpa16Trial()
    } else if (assessment === 'palpa17') {
      palpa17Result = checkPalpa17Accuracy()
      appendPalpa17TrialDataToFile(palpa17FileToSave, [subjID, sessID, assessment, palpa17Trials[t].practice.trim(), palpa17Trials[t].name.trim(), palpa17Trials[t].correctChoice.trim(), palpa17Trials[t].wordOrNot.trim(), keys.key, keys.rt, palpa17Result.acc, palpa17Result.errorType])
      showNextPalpa17Trial()
    } else if (assessment === 'palpa8') {
      showNextPalpa8Trial()
    }
  }
}


// store state of navigation pane
var nav = {
  hidden: false
}


function clearAllTimeouts() {
  clearTimeout(palpa1TimeoutID)
  clearTimeout(palpa2TimeoutID)
  clearTimeout(palpa8TimeoutID)
  clearTimeout(palpa14TimeoutID)
  clearTimeout(palpa15TimeoutID)
  clearTimeout(palpa16TimeoutID)
  clearTimeout(palpa17TimeoutID)
}


// open navigation pane
function openNav() {
  clearAllTimeouts()
  document.getElementById("navPanel").style.width = "150px"
  document.getElementById("contentDiv").style.marginLeft = "150px"
  document.body.style.backgroundColor = "rgba(0,0,0,0.3)"
  if (document.getElementById("imageElement")) {
    document.getElementById("imageElement").style.opacity = "0.1";
  }
  document.getElementById("closeNavBtn").innerHTML = "&times;"
}


// close navigation pane
function closeNav() {
    document.getElementById("navPanel").style.width = "0px";
    document.getElementById("contentDiv").style.marginLeft= "0px";
    document.getElementById("contentDiv").style.width= "100%";
    document.body.style.backgroundColor = "white";
    //document.getElementById("menuBtn").innerHTML = "&#9776;"
    if (document.getElementById("imageElement")) {
      document.getElementById("imageElement").style.opacity = "1";
    }
}


// toggle navigation pane, detect if hidden or not
function toggleNav() {
  if (nav.hidden) {
    openNav()
    nav.hidden = false
  } else {
    closeNav()
    nav.hidden = true
  }
}


// check if key that was pressed was the escape key or q. Quits experiment immediately
function checkForEscape() {
  key = event.key
  if (key === "Escape" || key=== "q") {
    console.log("Escape was pressed")
    openNav()
    nav.hidden = false
    // unloadJS(exp.name)
    clearScreen()
    rec.stopRec()
  }
}

function getStarted() {
  subjID = document.getElementById("subjID").value
  sessID = document.getElementById("sessID").value
  assessment = document.getElementById("assessmentID").value
  console.log("assessment chosen: ", assessment)
  if (subjID === '' || sessID === '' || assessment === '') {
    console.log ('subject, session, or assessment is blank')
    alert('subject, session, or assessment is blank')
  } else {
    console.log ('subject is: ', subjID)
    console.log('session is: ', sessID)
    stopWebCamPreview()
    closeNav()
    resetTrialNumber()
    if (assessment === 'palpa1') {
      showPalpa1Instructions(palpa1Instructions)
    } else if (assessment === 'palpa2') {
      showPalpa2Instructions(palpa2Instructions)
    } else if (assessment === 'palpa8') {
      showPalpa8Instructions(palpa8Instructions)
    } else if (assessment === 'palpa14') {
      showPalpa14Instructions(palpa14Instructions)
    } else if (assessment === 'palpa15') {
      showPalpa15Instructions(palpa15Instructions)
    } else if (assessment === 'palpa16') {
      showPalpa16Instructions(palpa16Instructions)
    } else if (assessment === 'palpa17') {
      showPalpa17Instructions(palpa17Instructions)
    }
    //showInstructions(instructions)
  }
}


function showNextTrial() {
  clearTimeout(trialTimeoutID)
  closeNav()
  clearScreen()
  t += 1
  if (t > maxTrials) {
    clearScreen()
    t = maxTrials+1
    return false
  }
  picNum.value = t
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'pics', trials[t].PictureName.trim() + '.png')
  playAudio(path.join(exp.mediapath, 'beep.wav'))
  content.appendChild(img)
  trialTimeoutID = setTimeout(showNextTrial, 1000 * timeoutTime)
  return getTime()
}


function showNextPalpa1Trial() {
  clearTimeout(palpa1TimeoutID)
  closeNav()
  clearScreen()
  t += 1
  if (t > maxNumberOfPalpa1Trials) {
    clearScreen()
    t = maxNumberOfPalpa1Trials+1
    return false
  }
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  stimOnset = playAudio(path.join(palpa1MediaPath, palpa1Trials[t].name.trim()+'.wav'))
  palpa1TimeoutID = setTimeout(showNextPalpa1Trial, palpa1TimeoutTime)
  return stimOnset
}


function showPreviousPalpa1Trial() {
  clearTimeout(palpa1TimeoutID)
  closeNav()
  t -= 1
  if (t < 0) {
    t=0
  }
  clearScreen()
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  stimOnset = playAudio(path.join(palpa1MediaPath, palpa1Trials[t].name.trim()+'.wav'))
  palpa1TimeoutID = setTimeout(showNextPalpa1Trial, palpa1TimeoutTime)
  return getTime()
}


function showNextPalpa2Trial() {
  clearTimeout(palpa2TimeoutID)
  closeNav()
  clearScreen()
  t += 1
  if (t > maxNumberOfPalpa2Trials) {
    clearScreen()
    t = maxNumberOfPalpa2Trials+1
    return false
  }
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  stimOnset = playAudio(path.join(palpa2MediaPath, palpa2Trials[t].name.trim()+'.wav'))
  palpa2TimeoutID = setTimeout(showNextPalpa2Trial, palpa2TimeoutTime)
  return getTime()
}


function showPreviousPalpa2Trial() {
  clearTimeout(palpa2TimeoutID)
  closeNav()
  t -= 1
  if (t < 0) {
    t=0
  }
  clearScreen()
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  stimOnset = playAudio(path.join(palpa2MediaPath, palpa2Trials[t].name.trim()+'.wav'))
  palpa2TimeoutID = setTimeout(showNextPalpa2Trial, palpa2TimeoutTime)
  return getTime()
}


function showNextPalpa8Trial() {
  clearTimeout(palpa8TimeoutID)
  closeNav()
  clearScreen()
  t += 1
  if (t > maxNumberOfPalpa8Trials) {
    clearScreen()
    t = maxNumberOfPalpa8Trials+1
    return false
  }
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  playAudio(path.join(palpa8MediaPath, palpa8Trials[t].name.trim()+'.wav'))
  palpa8TimeoutID = setTimeout(showNextPalpa8Trial, palpa8TimeoutTime)
  return getTime()
}


function showPreviousPalpa8Trial() {
  clearTimeout(palpa8TimeoutID)
  closeNav()
  t -= 1
  if (t < 0) {
    t=0
  }
  clearScreen()
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  playAudio(path.join(palpa8MediaPath, palpa8Trials[t].name.trim()+'.wav'))
  palpa8TimeoutID = setTimeout(showNextPalpa8Trial, palpa8TimeoutTime)
  return getTime()
}


function showNextPalpa14Trial() {
  clearTimeout(palpa14TimeoutID)
  closeNav()
  clearScreen()
  t += 1
  if (t > maxNumberOfPalpa14Trials) {
    clearScreen()
    t = maxNumberOfPalpa14Trials+1
    return false
  }
  var img = document.createElement("img")
  img.src = path.join(path.join(palpa14MediaPath, palpa14Trials[t].PictureName.trim()+'.png'))
  img.style.height = "100%"
  content.appendChild(img)
  stimOnset = getTime()
  //playAudio(path.join(palpa14MediaPath, palpa14Trials[t].PictureName.trim()+'.wav'))
  palpa14TimeoutID = setTimeout(showNextPalpa14Trial, palpa14TimeoutTime)
  return stimOnset
}


function showPreviousPalpa14Trial() {
  clearTimeout(palpa14TimeoutID)
  closeNav()
  t -= 1
  if (t < 0) {
    t=0
  }
  clearScreen()
  var img = document.createElement("img")
  img.src = path.join(path.join(palpa14MediaPath, palpa14Trials[t].PictureName.trim()+'.png'))
  img.style.height = "100%"
  content.appendChild(img)
  stimOnset = getTime()
  //playAudio(path.join(palpa14MediaPath, palpa14Trials[t].name.trim()+'.wav'))
  palpa14TimeoutID = setTimeout(showNextPalpa14Trial, palpa14TimeoutTime)
  return stimOnset
}


function showNextPalpa15Trial() {
  clearTimeout(palpa15TimeoutID)
  closeNav()
  clearScreen()
  t += 1
  if (t > maxNumberOfPalpa15Trials) {
    clearScreen()
    t = maxNumberOfPalpa15Trials+1
    return false
  }
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  stimOnset = playAudio(path.join(palpa15MediaPath, palpa15Trials[t].name.trim()+'.wav'))
  palpa15TimeoutID = setTimeout(showNextPalpa15Trial, palpa15TimeoutTime)
  return getTime()
}


function showPreviousPalpa15Trial() {
  clearTimeout(palpa15TimeoutID)
  closeNav()
  t -= 1
  if (t < 0) {
    t=0
  }
  clearScreen()
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  stimOnset = playAudio(path.join(palpa15MediaPath, palpa15Trials[t].name.trim()+'.wav'))
  palpa15TimeoutID = setTimeout(showNextPalpa15Trial, palpa15TimeoutTime)
  return getTime()
}


function showNextPalpa16Trial() {
  clearTimeout(palpa16TimeoutID)
  closeNav()
  clearScreen()
  t += 1
  if (t > maxNumberOfPalpa16Trials) {
    clearScreen()
    t = maxNumberOfPalpa16Trials+1
    return false
  }
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  stimOnset = playAudio(path.join(palpa16MediaPath, palpa16Trials[t].name.trim()+'.wav'))
  palpa16TimeoutID = setTimeout(showNextPalpa16Trial, palpa16TimeoutTime)
  return getTime()
}


function showPreviousPalpa16Trial() {
  clearTimeout(palpa16TimeoutID)
  closeNav()
  t -= 1
  if (t < 0) {
    t=0
  }
  clearScreen()
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  stimOnset = playAudio(path.join(palpa16MediaPath, palpa16Trials[t].name.trim()+'.wav'))
  palpa16TimeoutID = setTimeout(showNextPalpa16Trial, palpa16TimeoutTime)
  return getTime()
}


function showNextPalpa17Trial() {
  clearTimeout(palpa17TimeoutID)
  closeNav()
  clearScreen()
  t += 1
  if (t > maxNumberOfPalpa17Trials) {
    clearScreen()
    t = maxNumberOfPalpa17Trials+1
    return false
  }
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  stimOnset = playAudio(path.join(palpa17MediaPath, palpa17Trials[t].name.trim()+'.wav'))
  palpa17TimeoutID = setTimeout(showNextPalpa17Trial, palpa17TimeoutTime)
  return getTime()
}


function showPreviousPalpa17Trial() {
  clearTimeout(palpa17TimeoutID)
  closeNav()
  t -= 1
  if (t < 0) {
    t=0
  }
  clearScreen()
  var img = document.createElement("img")
  img.src = path.join(exp.mediapath, 'sound512px' + '.png')
  img.style.height = "40%"
  content.appendChild(img)
  stimOnset = playAudio(path.join(palpa17MediaPath, palpa17Trials[t].name.trim()+'.wav'))
  palpa17TimeoutID = setTimeout(showNextPalpa17Trial, palpa17TimeoutTime)
  return getTime()
}


function resetTrialNumber() {
  t = 0
}




// event listeners that are active for the life of the application
document.addEventListener('keyup', checkForEscape)
document.addEventListener('keyup', updateKeys)
// document.getElementById("videoElement").style.visibility = "hidden"
// document.getElementById("textElement").style.visibility = "hidden"
// document.getElementById("audioElement").style.visibility = "hidden"
// document.getElementById("buttonElement").style.visibility = "hidden"
