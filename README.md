# DevOps_Project: Deployment

The production infrastructure and deployment pipeline should support the following properties,

#### Deploy software to the production environment after build, testing, and analysis stage

#### Configure a production environment automatically

#### Monitor the deployed application and send alerts
We are using Data Dog to monitor our application and gather metrics. We are monitoring CPU utilization and RAM usage. We have set the threshold for CPU utiliation as 60% and for memory usage as 500Mb. Whenever the usage exceed the threshold limit, an e-mail alert is raised. Also if the issue is not resolved within 15 minutes, the e-mail alert is re-triggered.

![img](/img/metrics.png)
#### Autoscale individual components of production
We have written a Bash script to fetch the memory metric of the container which keep son running every 5 minutes. Whenever the memory usage goes above 50%, then it increases the memory limit by 100Mb.

#### Toggle functionality of a feature using feature flag
* We have used a Global Redis Store to maintain the value of feature flag setting. 
* We have a [script](https://github.ncsu.edu/sarora6/DevOps_Project/blob/master/start_redis.sh) to install, confugure and start redis server.
* We have created another app, server.js, running at `http://localhost:8000` that would toggle the value of feature flag. This flag value will be accessed in production server by our app to provide access to the functionality of `/newfeature`
* Every request send to `http://localhost:8000/newfeature` would toggle the value of feature flag, thereby enabling and disabling the feature in production.

#### Perform a canary release
We have created a staging branch for canary release. Using proxy server, we are handling request between Production and Staging (Canary). 66% incoming traffic is handled by Production and rest 33% by Staging . If an alert (For example, Error 500) is raised from canary then request are no longer sent to canary.







