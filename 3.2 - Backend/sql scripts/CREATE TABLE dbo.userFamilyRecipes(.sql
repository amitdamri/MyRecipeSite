CREATE TABLE dbo.userFamilyRecipes(
	id int IDENTITY(1,1),
	username varchar(8) NOT NULL,
	title varchar(300) NOT NULL,
    image varchar (1000) NOT NULL,
    readyInMinutes int NOT NULL,
    aggregateLikes int,
    vegetarian varchar(10) NOT NULL CHECK (vegetarian IN('true', 'false')),
    vegan varchar(10) NOT NULL CHECK (vegan IN('true', 'false')),
    glutenFree varchar(10) NOT NULL CHECK (glutenFree IN('true', 'false')),
	author varchar(50) NOT NULL,
    whenAcceptable varchar(100) not null,
	instructions varchar(5000) NOT NULL,
    servings int NOT NULL,
	PRIMARY KEY (id),
	foreign key (username) references dbo.users(username)
)

