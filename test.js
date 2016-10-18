var ClimbingGrade = require('./climbing-grade.js');

var grade = new ClimbingGrade('5.1','yds');
grade.format('french');
grade.format('australian');
grade.format('south_african');
grade.format('uiaa');
grade.format('british');
grade.format('hueco');
grade.format('font');

var grade = new ClimbingGrade('2','french');
grade.format('yds');
grade.format('australian');
grade.format('south_african');
grade.format('uiaa');
grade.format('british');
grade.format('hueco');
grade.format('font');

var grade = new ClimbingGrade('7','australian');
grade.format('yds');
grade.format('french');
grade.format('south_african');
grade.format('uiaa');
grade.format('british');
grade.format('hueco');
grade.format('font');

var grade = new ClimbingGrade('8','south_african');
grade.format('yds');
grade.format('french');
grade.format('australian');
grade.format('uiaa');
grade.format('british');
grade.format('hueco');
grade.format('font');

var grade = new ClimbingGrade('iii-','uiaa');
grade.format('yds');
grade.format('french');
grade.format('australian');
grade.format('south_african');
grade.format('british');
grade.format('hueco');
grade.format('font');

var grade = new ClimbingGrade('m 1','british');
grade.format('yds');
grade.format('french');
grade.format('australian');
grade.format('south_african');
grade.format('uiaa');
grade.format('hueco');
grade.format('font');

var grade = new ClimbingGrade('vb','hueco');
grade.format('yds');
grade.format('french');
grade.format('australian');
grade.format('south_african');
grade.format('uiaa');
grade.format('british');
grade.format('font');

var grade = new ClimbingGrade('1','font');
grade.format('yds');
grade.format('french');
grade.format('australian');
grade.format('south_african');
grade.format('uiaa');
grade.format('british');
grade.format('hueco');
