# DevOps Project

We've used the climbing grade project in our pipeline which includes build, test, analysis, deployment and monitoring. Link to previous milestones:

* [M1: Build](https://github.ncsu.edu/ckapadi/devops-project/blob/master/README.md)
* [M2: Test and Analysis](https://github.ncsu.edu/sarora6/DevOps_Project/blob/master/Milestone2:%20README.md)
* [M3: Deployment](https://github.ncsu.edu/sarora6/DevOps_Project/blob/master/Milestone3_README.md)

## Special Milestone

For the purpose of the special milestone, we implemented the combination of two monkeys, Diet Monkey and Trainer Monkey. Since we have used docker containers to run our web servers, the monkeys try to fiddle with the resources allotted and stress with heavy http load to the container.

### Diet Monkey

The diet monkey tries to shrink the memory allocated to the container hosting the webserver. So everytime the monkey script is run, the memory allocated to the container is reduced to half.

### Trainer Monkey

The trainer monkey tries to put concurrent http stress on the webserver. For this we've used the `node-stress` library and tried stressing the container with 500 concurrent http requests.

### Combined Effect

For this milestone, we created a node file [run_monkey.js](https://github.ncsu.edu/sarora6/DevOps_Project/blob/master/monkey/run_monkey.js) which runs both the monkeys, diet and trainer, in the same order to test the system and report failures. By default, we allocated 200MB to our webserver for running and the usual usage is around 30-40MB. Firstly, the diet monkey runs, finds the memory allocated to the webserver container and reduces it to half i.e. 100MB. Next, the trainer monkey tries to put concurrent http load of 1000 requests on the shrinked webserver container. This increases the usage to amost 80-90% (80-90MB) thereby triggerring the autoscale script. The autoscale script then checks the usage is more than 50% and adds 100MB to the container, thereby making it 200MB again. If both the monkeys and the autoscale script run successfully, this is how the output looks like:

![img](/img/monkey.PNG)

This shows us the container stats on the LHS and the output of the monkey on the RHS. The output of the monkey shows that firstly the memory is reduced to 100M and then the results of the http stress test. It shows that all the requests were 'ok' and the test is passed. 

To integrate this monkey with our pipeline, whenever a commit is made to the repo, this monkey is run as the final step of the post-build task. This allows us to report the results for the test in each build log, as well as report the failures caused by the monkey.

[Link to Screencast Video](https://youtu.be/uOWwPq7DWKs)






