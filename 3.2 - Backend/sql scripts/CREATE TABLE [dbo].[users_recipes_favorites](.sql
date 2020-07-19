CREATE TABLE [dbo].[users_recipes_favorites](
	[username] [varchar](8) NOT NULL,
	[recipe_id] [varchar](50) NOT NULL,
	PRIMARY KEY (username, recipe_id)
)