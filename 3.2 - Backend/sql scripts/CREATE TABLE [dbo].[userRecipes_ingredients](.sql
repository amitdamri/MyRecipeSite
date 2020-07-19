CREATE TABLE dbo.userRecipes_ingredients(
	id int NOT NULL,
	name varchar(200) NOT NULL,
	amount float NOT NULL,
    unit varchar(100) NOT NULL,
	PRIMARY KEY (id, name),
	FOREIGN KEY (id) REFERENCES userRecipes(id)
)

