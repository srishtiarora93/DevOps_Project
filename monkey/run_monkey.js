var exec = require('child_process').exec;

exec('chmod "+x" diet_monkey.sh');

// Random time interval to run the monkey at.
var timeInSec = Math.floor(Math.random()*25) + 5;

setTimeout(function(){
    exec('./diet_monkey.sh', function(err, out, code) {
        console.log(out);
    });
}, timeInSec*1000);

