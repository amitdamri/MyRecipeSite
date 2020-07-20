CREATE TABLE [dbo].[users_recipes_watched](
	[col_id] INT IDENTITY(1,1),
	[username] [varchar](8) NOT NULL,
	[recipe_id] [varchar](50) NOT NULL,
	PRIMARY KEY (col_id)
)