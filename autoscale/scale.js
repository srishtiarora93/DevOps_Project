var exec = require('child_process').exec;

exec('chmod "+x" script.sh');
exec('chmod "+x" script_canary.sh');

setInterval(function(){
        exec('./script.sh', function(err, out, code) {
                console.log(out);
        });
        exec('./script1.sh', function(err, out, code) {
                console.log(out);
        });
}, 5000);

