create table `archives` (
	`name` varchar(20) primary key not null, 
	`limit` integer default 5, 
	`type` varchar(5) default 'wni', 
	`status` varchar(7) default 'active' 
);

create table `passports` (
	`code`  varchar(20) primary key not null,
	`name`  varchar(50) not null ,
	`dateBirth`  VARCHAR(10) ,
	`datePrint`  varchar(10) ,
	`gender`  varchar(1) default 'L',
	`type`  varchar(10) not null default 'paspor',
	`status`  varchar(50),
	`noKTP`  varchar(20) ,
	`noPassport`  varchar(20) not null
);