# DevOps_Project: Deployment

The production infrastructure and deployment pipeline should support the following properties,

#### Deploy software to the production environment after build, testing, and analysis stage
The previous milestone included the ability to trigger a build using Jenkins whenever changes are pushed to git. We are using docker container to deploy our Climbing grade application after the build is successful. Overall there are three containers running one for each proxy, production and canary.


#### Configure a production environment automatically
- Configuration management is done mainly using docker. Using the DockerFile the environment gets pre-configured with respect to the requirments. 
- To install and start redis server, we have written a shell script. 


#### Monitor the deployed application and send alerts
We are using Data Dog to monitor our application and gather metrics. We are monitoring CPU utilization and RAM usage. We have set the threshold for CPU utiliation as 60% and for memory usage as 500Mb. Whenever the usage exceed the threshold limit, an e-mail alert is raised. Also if the issue is not resolved within 15 minutes, the e-mail alert is re-triggered.

![img](/img/metrics.png)
#### Autoscale individual components of production
After the production environment gets deployed, autoscaling feature keeps running in bakground using forever command. We have written a Bash script to fetch the memory metric of the container which keep son running every 5 seconds. Whenever the memory usage goes above 50%, then it increases the memory limit by 100Mb.

#### Toggle functionality of a feature using feature flag
* We have used a Global Redis Store to maintain the value of feature flag setting. 
* We have a [script](https://github.ncsu.edu/sarora6/DevOps_Project/blob/master/start_redis.sh) to install, confugure and start redis server.
* We have created another app, server.js, running at `http://localhost:8000` that would toggle the value of feature flag. This flag value will be accessed in production server by our app to provide access to the functionality of `/newfeature`.
* The value of `myflag` is toggled to achieve toggle functionality. Only when the value of `myflag` is `enable`, the `/newfeature` is available.
* Every request send to `http://localhost:8000/newfeature` would toggle the value of feature flag, thereby enabling and disabling the feature in production.

#### Perform a canary release
We have created a staging branch for canary release. Using proxy server, we are handling request between Production and Staging (Canary). 66% incoming traffic is handled by Production and rest 33% by Staging . If an alert (For example, Error 500) is raised from canary then request are no longer sent to canary.







