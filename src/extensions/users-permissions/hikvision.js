const ipcamera = require('node-hikvision-api');


const options = {
  host	: '192.168.137.234',
  port 	: '80',
  user 	: 'admin',
  pass 	: 'datagaze@#$',
  log 	: false
};
const hikvision 	= new ipcamera.hikvision(options);

hikvision.nightProfile()

// PTZ Go to preset 10
hikvision.ptzPreset(10)

console.log('HIKVISION ', hikvision)
function getDateTime() {
  let date = new Date();
  let hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  let min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  let sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  let day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}


// Monitor Camera Alarms
hikvision.on('alarm', function(code,action,index) {
  if (code === 'VideoMotion'   && action === 'Start')  console.log(getDateTime() + ' Channel ' + index + ': Video Motion Detected')
  if (code === 'VideoMotion'   && action === 'Stop')   console.log(getDateTime() + ' Channel ' + index + ': Video Motion Ended')
  if (code === 'LineDetection' && action === 'Start')  console.log(getDateTime() + ' Channel ' + index + ': Line Cross Detected')
  if (code === 'LineDetection' && action === 'Stop')   console.log(getDateTime() + ' Channel ' + index + ': Line Cross Ended')
  if (code === 'AlarmLocal'    && action === 'Start')  console.log(getDateTime() + ' Channel ' + index + ': Local Alarm Triggered: ' + index)
  if (code === 'AlarmLocal'    && action === 'Stop')   console.log(getDateTime() + ' Channel ' + index + ': Local Alarm Ended: ' + index)
  if (code === 'VideoLoss'     && action === 'Start')  console.log(getDateTime() + ' Channel ' + index + ': Video Lost!')
  if (code === 'VideoLoss'     && action === 'Stop')   console.log(getDateTime() + ' Channel ' + index + ': Video Found!')
  if (code === 'VideoBlind'    && action === 'Start')  console.log(getDateTime() + ' Channel ' + index + ': Video Blind!')
  if (code === 'VideoBlind'    && action === 'Stop')   console.log(getDateTime() + ' Channel ' + index + ': Video Unblind!')
});



