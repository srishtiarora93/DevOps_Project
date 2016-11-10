# DevOps-Milestone3: Deployment

The production infrastructure and deployment pipeline should support the following properties,

#### Deploy software to the production environment after build, testing, and analysis stage

#### Configure a production environment automatically

#### Monitor the deployed application and send alerts
We are using Data Dog to monitor our application and gather metrics. We are monitoring CPU utilization and RAM usage. We have set the threshold for CPU utiliation as 60% and for memory usage as 500Mb. Whenever the usage exceed the threshold limit, an e-mail alert is raised. Also if the issue is not resolved within 15 minutes, the e-mail alert is re-triggered.

![img](/img/metrics.png)
#### Autoscale individual components of production


#### Toggle functionality of a feature using feature flag

#### Perform a canary release



