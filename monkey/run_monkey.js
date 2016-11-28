var exec = require('child_process').exec;
var sleep = require('sleep')

exec('chmod "+x" diet_monkey.sh');

// Random time interval to run the monkey at.
var timeInSec = Math.floor(Math.random()*25) + 5;

exec('./diet_monkey.sh', function(err, out, code) {
        console.log(out);
	sleep.sleep(5);	
	var stress = require('stress-node');
	stress({
    		url: "http://162.243.23.35:50100/convert/french/yds/5.1",
    		method: 'GET',
    		timeout: 1000,
    		amount: 1000,
    		concurrent: 1000,
    		data: null,
		progress: function(report) {
        		// console.log(report)
    		}
	}, function(report) {
    		console.log(report);
	});
	sleep.sleep(10);

        stress({
                url: "http://162.243.23.35:50100/convert/french/yds/5.1",
                method: 'GET',
                timeout: 1000,
                amount: 1000,
                concurrent: 1000,
                data: null,
                progress: function(report) {
                        // console.log(report)
                }
        }, function(report) {
                console.log(report);
        });
});
