CREATE TABLE [dbo].[users](
	[user_id] [varchar](100) NOT NULL UNIQUE DEFAULT NEWID(),
	[username] [varchar](8) NOT NULL UNIQUE,
	[firstName] [varchar](30) NOT NULL,
	[lastName] [varchar](30) NOT NULL,
	[country] [varchar](30) NOT NULL,
	[hash_password] [varchar](500) NOT NULL,
	[email] [varchar](50) NOT NULL,
	[image] [varchar](30) NOT NULL,
	PRIMARY KEY (user_id, username)
)