# MILESTONE: TEST+ANALYSIS

The goal of this milestone is to implement a testing component and an analysis component for building a target project.
For this milestone, we have used the project [Climbing Grade](https://github.com/Grantismo/climbing-grade.js/), which is used to convert different climbing grades between different systems. We've used Jenkins for managing out CI pipeline, which is hosted on a DigitalOcean droplet. 

### Test Section

For the test section, the pipeline first runs the unit test for the project, which were already part of the test suite. This runs the test and fails the build if any test fails.
![img](/img/unit_test.PNG)

We've used istanbul to measure coverage and report the results. The basic unit tests return a low coverage for the project. As a result these statistics were removed from the build pipeline. 
![img](/img/base_coverage.PNG)

Hence, we've made use of the test case generation technique, and used [main.js](https://github.ncsu.edu/sarora6/DevOps-Milestone2/blob/master/main.js) to generate a new [test.js](https://github.ncsu.edu/sarora6/DevOps-Milestone2/blob/master/test.js) file based on the systems provided in the base file. The coverage results now show up better statistics. 
![img](/img/coverage.PNG)

The coverage report would also be generated after the build.
![img](img/coverage_report.PNG)
