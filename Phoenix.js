// Global read-only
var CanvasWidth = 96;
var CanvasHeight = 64;
var FrameTime = 1.0 / 30.0;

// Variable base constants (changed in store)
var PlayerSpeed = 1;
var BulletSpeed = 2;
var BulletReload = 300; // in MS (a delay)

var EnemyBulletSpeed = 1;

// FPS elements
var FPSLabel;
var LastFPSUpdate;
var FrameCount;

// Global variables
var MainContext;
var IntervalHandle = null;
var LastTime;

// Couple of important colors (from light to dark)
var Color0 = {R:239, G:255, B:222};
var Color1 = {R:173, G:215, B:148};
var Color2 = {R:82, G:146, B:115};
var Color3 = {R:24, G:52, B:66};
var ColorPalette = [Color0, Color1, Color2, Color3];

// Game state. 0 - Start, 1 - playing a level, 2 - store, 3 - game over, 4 - win!
var GameState = 0;

// The active level definition we have
var GameLevel = 0; // Some structure here...

// Player health (5 hits)
var PlayerHealth = 5;

// Time for game lost..
var GameLostTime = 0;

/*** Bullet Info. ***/

// Player and enemy bullets
var BulletsShot = 0;
var Bullets = [];

/*** Game geometry ***/

var Enemy0 = {
	Width: 6,
	Height: 6,
	Sprite: [
		[3,0,0,0,0,3],
		[3,0,0,0,0,3],
		[3,3,3,3,3,3],
		[3,3,3,3,3,3],
		[0,3,3,3,3,0],
		[0,0,3,3,0,0]
	]
};

var Enemy1 = {
	Width: 8,
	Height: 5,
	Sprite: [
		[3,0,0,0,0,0,0,3],
		[3,3,0,3,3,0,3,3],
		[3,3,3,3,3,3,3,3],
		[3,3,0,3,3,0,3,3],
		[3,0,0,0,0,0,0,3]
	]
};

var Enemy2 = {
	Width: 16,
	Height: 12,
	Sprite: [
		[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
		[3,3,0,0,0,0,0,0,0,0,0,0,0,0,3,3],
		[3,3,3,0,0,0,0,0,0,0,0,0,0,3,3,3],
		[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
		[3,3,0,0,3,3,3,3,3,3,3,3,0,0,3,3],
		[3,3,0,0,0,3,3,3,3,3,3,0,0,0,3,3],
		[3,3,0,0,0,0,3,3,3,3,0,0,0,0,3,3],
		[3,3,3,0,0,0,3,3,3,3,0,0,0,3,3,3],
		[3,3,3,3,0,0,3,3,3,3,0,0,3,3,3,3],
		[0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
		[0,0,3,3,3,3,3,3,3,3,3,3,3,3,0,0],
		[0,0,0,3,3,3,3,3,3,3,3,3,3,0,0,0]
	]
};

var Enemy3 = {
	Width: 16,
	Height: 12,
	Sprite: [
		[3,0,1,1,0,0,1,1,1,1,0,0,1,1,0,3],
		[3,3,2,2,0,0,2,2,2,2,0,0,2,2,3,3],
		[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
		[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
		[3,3,0,0,3,3,3,3,3,3,3,3,0,0,3,3],
		[3,3,0,0,0,3,3,3,3,3,3,0,0,0,3,3],
		[3,3,0,0,0,0,3,3,3,3,0,0,0,0,3,3],
		[3,3,3,0,0,0,0,3,3,0,0,0,0,3,3,3],
		[3,3,3,0,0,0,0,3,3,0,0,0,0,3,3,3],
		[0,3,3,0,0,0,3,3,3,3,0,0,0,3,3,0],
		[0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0]
	]
};

var Player = {
	Width: 8,
	Height: 6,
	Sprite: [
		[3,0,0,0,0,0,0,3],
		[3,0,0,0,0,0,0,3],
		[3,0,0,3,3,0,0,3],
		[3,0,3,0,0,3,0,3],
		[3,3,0,0,0,0,3,3],
		[3,0,0,0,0,0,0,3]
	]
};

/*** Enemy List ***/

// Active enemy group
var EnemyList = null;

// Active level
var LevelIndex = 0;

// Level listing
var Levels = [
	// Level 1
	[
		{eType:Enemy0, ox:10, oy:14, health:2, age:0}, // Row 1
		{eType:Enemy0, ox:20, oy:14, health:2, age:0},
		{eType:Enemy0, ox:30, oy:14, health:2, age:0},
		{eType:Enemy0, ox:40, oy:14, health:2, age:0},
		{eType:Enemy0, ox:50, oy:14, health:2, age:0},
		{eType:Enemy0, ox:60, oy:14, health:2, age:0},
		{eType:Enemy0, ox:70, oy:14, health:2, age:0},
		{eType:Enemy0, ox:10, oy:24, health:2, age:0}, // Row 2
		{eType:Enemy0, ox:20, oy:24, health:2, age:0},
		{eType:Enemy0, ox:30, oy:24, health:2, age:0},
		{eType:Enemy0, ox:40, oy:24, health:2, age:0},
		{eType:Enemy0, ox:50, oy:24, health:2, age:0},
		{eType:Enemy0, ox:60, oy:24, health:2, age:0},
		{eType:Enemy0, ox:70, oy:24, health:2, age:0}
	],
	// Level 2
	[
		{eType:Enemy1, ox:10, oy:14, health:4, age:0}, // Row 1
		{eType:Enemy1, ox:25, oy:14, health:4, age:0},
		{eType:Enemy1, ox:40, oy:14, health:4, age:0},
		{eType:Enemy1, ox:55, oy:14, health:4, age:0},
		{eType:Enemy1, ox:70, oy:14, health:4, age:0},
		{eType:Enemy1, ox:5, oy:24, health:4, age:0}, // Row 2
		{eType:Enemy1, ox:20, oy:24, health:4, age:0},
		{eType:Enemy1, ox:35, oy:24, health:4, age:0},
		{eType:Enemy1, ox:50, oy:24, health:4, age:0},
		{eType:Enemy1, ox:65, oy:24, health:4, age:0},
		{eType:Enemy1, ox:80, oy:24, health:4, age:0}
	],
	// Level 3
	[
		{eType:Enemy2, ox:10, oy:35, health:100, age:0},
		{eType:Enemy2, ox:CanvasWidth - Enemy2.Width - 10, oy:35, health:100, age:0},
		{eType:Enemy3, ox:CanvasWidth / 2 - Enemy3.Width, oy:5, health:200, age:1}
	]
];

/*** Key States ***/

var Key_Left = false;
var Key_Right = false;
var Key_Up = false;
var Key_Down = false;
var Key_Z = false;
var LastKeyZ = null;

// Player position
var px = CanvasWidth / 2 - Player.Width / 2;
var py = CanvasHeight - 10;

/*** Graphics Primitive Wrappers ***/

// Render a point given a point and a color
function RenderPoint(x, y, color)
{
    // Save context
    MainContext.save();
    
    // Set color
    if(color != undefined)
        MainContext.fillStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    else
        MainContext.fillStyle = "rgb(0, 0, 0)";
    
    // Draw from point to point
    MainContext.fillRect(x, y, 1, 1);
    
    // Revert context
    MainContext.restore();
}

// Render a sprite on-screen
function RenderSprite(px, py, pixels, width, height)
{
	// Draw the player's ship
	for(var y = 0; y < height; y++)
	for(var x = 0; x < width; x++)
	{
		var ColorIndex = pixels[y][x];
		var Color = ColorPalette[ColorIndex];
		RenderPoint(Math.floor(x + px), Math.floor(y + py), Color);
	}
}

/*** Initialization ***/

// Main application entry point
function main()
{
	// Load counter text
	FPSLabel = document.getElementById("FPSLabel");
	
	// Load canvas
	var MainCanvas = document.getElementById("MainCanvas");
	MainCanvas.width = CanvasWidth;
	MainCanvas.height = CanvasHeight;
	MainContext = MainCanvas.getContext("2d");
	
	// Register keybinds
	document.onkeydown = function(event)
	{
		// Start a game!
		if(GameState == 0 && event.keyCode == 32)
			GameState = 1;
		
		// Game state
		else if(GameState == 1)
		{
			if(event.keyCode == 37)
				Key_Left = true;
			if(event.keyCode == 39)
				Key_Right = true;
			if(event.keyCode == 38)
				Key_Up = true;
			if(event.keyCode == 40)
				Key_Down = true;
			if(event.keyCode == 90 || event.keyCode == 122)
				Key_Z = true;
		}
		
		// Store
		else if(GameState == 2)
		{
			// 1: speed increase, 2: shoot increase, 3: bullet speed, space: skip
			if(event.keyCode == 49)
			{
				PlayerSpeed++;
				GameState = 1;
			}
			if(event.keyCode == 50)
			{
				BulletReload -= 100;
				GameState = 1;
			}
			if(event.keyCode == 51)
			{
				BulletSpeed++;
				GameState = 1;
			}
			if(event.keyCode == 32)
				GameState = 1;
		}
	};
	
	document.onkeyup = function(event)
	{
		// Game state
		if(GameState == 1)
		{
			if(event.keyCode == 37)
				Key_Left = false;
			if(event.keyCode == 39)
				Key_Right = false;
			if(event.keyCode == 38)
				Key_Up = false;
			if(event.keyCode == 40)
				Key_Down = false;
			if(event.keyCode == 90 || event.keyCode == 122)
			{
				Key_Z = false;
				LastKeyZ = null;
			}
		}
	};
	
	// Set the level
	SetLevel(Levels[LevelIndex]);
	
	// prepare key counter
	LastFPSUpdate = new Date();
	FrameCount = 0;
	
	// Start the main render loop
	var d = new Date();
	LastTime = d.getTime();
	Loop();
}

// Global update; keeps track of time delta
function Loop()
{
	// Remove interval
	clearInterval(IntervalHandle);
	
	// Compute delta-time
	var d = new Date();
	var now = d.getTime();
	var dTime = Math.abs(now - LastTime) / 1000;
	LastTime = now;
	
	// Update game logic
	Update(dTime);
	
	// Render
	Render();
	
	// FPS count update
	FrameCount++;
	d = new Date();
	if(Math.abs(d.getTime() - LastFPSUpdate.getTime()) > 1000)
	{
		FPSLabel.innerHTML = FrameCount;
		FrameCount = 0;
		LastFPSUpdate = d;
	}
	
	// Time that was consumed
	d = new Date();
	var consumedTime = Math.abs(d.getTime() - LastTime) / 1000;
	consumedTime = FrameTime - consumedTime;
	if(consumedTime < 0.0)
		consumedTime = 0.0;
	
	// Sleep for the frame time - what was used here
	IntervalHandle = setInterval(Loop, FrameTime * 1000); // Millis
}

/*** Game Components ***/

function Update(dTime)
{
	// What game state are we in?
	// In menu
	if(GameState == 0)
	{
	}
	// Playing a level
	else if(GameState == 1)
	{
		/*** Level Management ***/
		
		// Done with level, go to store
		if(EnemyList.length <= 0)
		{
			// Load next level, if we can
			LevelIndex++;
			
			// We won!
			if(LevelIndex >= Levels.length)
				GameState = 4;
			// Else, load store, and next level
			else
			{
				GameState = 2;
				SetLevel(Levels[LevelIndex]);
			}
		}
		
		/*** Player ***/
		
		// Move player ship
		if(Key_Right)
			px += PlayerSpeed;
		if(Key_Left)
			px -= PlayerSpeed;
		if(Key_Up)
			py -= PlayerSpeed;
		if(Key_Down)
			py += PlayerSpeed;
		
		// User is shooting
		var d = new Date();
		if(Key_Z && (LastKeyZ == null || Math.abs(LastKeyZ.getTime() - d.getTime()) > BulletReload))
		{
			// Fire bullet, start cooldown
			BulletsShot++;
			Bullets.push({player:true, x:px + Player.Width / 2 - (BulletsShot % 2), y:py + Player.Height / 2});
			LastKeyZ = d;
		}
		
		// Apply world limits
		if(px < -Player.Width / 2)
			px = -Player.Width / 2;
		if(px > CanvasWidth - Player.Width / 2)
			px = CanvasWidth - Player.Width / 2;
		if(py < CanvasHeight / 2)
			py = CanvasHeight / 2;
		if(py > CanvasHeight - Player.Height)
			py = CanvasHeight - Player.Height;
		
		// Update and cull any bullets out of bounds
		for(var i = Bullets.length - 1; i >= 0; i--)
		{
			// Get bullet
			var Bullet = Bullets[i];
			var RemoveBullet = false;
			
			// World culling
			if(!IsWithin(Bullet.x, Bullet.y, CanvasWidth, CanvasHeight))
				RemoveBullet = true;
			
			// Player hitting enemy
			if(Bullet.player == true)
			{
				for(var j = EnemyList.length - 1; j >= 0; j--)
				{
					// If this bullet hits the enemy
					var Enemy = EnemyList[j];
					if(!RemoveBullet && IsWithin(Bullet.x - Enemy.x, Bullet.y - Enemy.y, Enemy.eType.Width, Enemy.eType.Height))
					{
						// Decrease health
						Enemy.health--;
						RemoveBullet = true;
						if(Enemy.health <= 0)
							EnemyList.splice(j, 1);
					}
				}
			}
			
			// Bullet hitting player
			else
			{
				if(!RemoveBullet && IsWithin(Bullet.x - px, Bullet.y - py, Player.Width, Player.Height))
				{
					RemoveBullet = true;
					
					// Lower health
					PlayerHealth -= 1;
					
					// If dead, you lose!
					if(PlayerHealth <= 0)
						GameState = 3;
				}
			}
			
			// Remove bullet if needed
			if(RemoveBullet)
				Bullets.splice(i, 1);
			// If enemy bullet, move down
			else if(Bullet.player == false)
				Bullet.y += EnemyBulletSpeed;
			// If player bullet, move up
			else if(Bullet.player == true)
				Bullet.y -= BulletSpeed;
		}
		
		// Move all enemy ships in appropriate pattern
		for(var i = 0; i < EnemyList.length; i++)
		{
			// Get enemy and grow age
			var Enemy = EnemyList[i];
			Enemy.age += dTime;
			Enemy.bulletAge += dTime;
			
			// Original pos
			var x = Enemy.ox;
			var y = Enemy.oy;
			
			// We want to do 1 second per movement... 4 animations total
			var ModTime = Math.floor(Enemy.age) % 4;
			var LinTime = Enemy.age - Math.floor(Enemy.age);
			
			// Bottom-left to bottom-right
			if(ModTime == 0)
				Enemy.x = Lint(x, x + 10, LinTime);
			// Bottom-right to top-right
			else if(ModTime == 1)
				Enemy.y = Lint(y, y - 10, LinTime);
			// Top-right to top-left
			else if(ModTime == 2)
				Enemy.x = Lint(x + 10, x, LinTime);
			// Top-left to bottom-left
			else if(ModTime == 3)
				Enemy.y = Lint(y - 10, y, LinTime);
			
			// Check if we should shoot back!
			if(Enemy.bulletAge > 2.5)
			{
				Bullets.push({player:false, x:Enemy.x + (Enemy.eType.Width) / 2, y:Enemy.y + (Enemy.eType.Height) / 2});
				Enemy.bulletAge -= 2.5;
			}
		}
	}
	// Store
	else if(GameState == 2)
	{
	}
	// Game lost or won
	else if(GameState == 3 || GameState == 4)
	{
		// Nothing to do!
		GameLostTime += dTime;
	}
}

function Render()
{
	// Clear the back
	var Color = ColorPalette[0];
	MainContext.fillStyle = "rgb(" + Color.R + "," + Color.G + "," + Color.B + ")";
	MainContext.fillRect(0,0,CanvasWidth,CanvasHeight);
	
	// In menu
	if(GameState == 0)
	{
		// Draw instructions (start with space bar)
		Color = ColorPalette[3];
		MainContext.fillStyle = "rgb(" + Color.R + "," + Color.G + "," + Color.B + ")";
		MainContext.fillText("-= Phoenix =-", 16, 25);
		MainContext.fillText("[Press Space]", 16, 35);
		RenderSprite(CanvasWidth / 2 - Enemy2.Width / 2, CanvasHeight / 2 + 10, Enemy2.Sprite, Enemy2.Width, Enemy2.Height);
	}
	// Playing a level
	else if(GameState == 1)
	{
		// Draw sprite
		RenderSprite(px, py, Player.Sprite, Player.Width, Player.Height);
		
		// Render enemies
		for(var i = 0; i < EnemyList.length; i++)
		{
			var Enemy = EnemyList[i];
			RenderSprite(Enemy.x, Enemy.y, Enemy.eType.Sprite, Enemy.eType.Width, Enemy.eType.Height);
		}
		
		// Render friendly bullets...
		for(var i = 0; i < Bullets.length; i++)
			RenderPoint(Math.floor(Bullets[i].x), Math.floor(Bullets[i].y), Color3);
		
		// Render health last
		var Height = Math.floor((PlayerHealth / 5.0) * CanvasHeight);
		for(var i = 0; i < Height; i++)
			RenderPoint(CanvasWidth - 1, CanvasHeight - i - 1, Color3);
	}
	// Store
	else if(GameState == 2)
	{
		// 1: speed increase, 2: shoot increase, 3: bullet speed, space: skip
		Color = ColorPalette[3];
		MainContext.fillStyle = "rgb(" + Color.R + "," + Color.G + "," + Color.B + ")";
		MainContext.fillText("Store: Tap # to buy", 2, 15);
		MainContext.fillText("1. Fast Ship", 2, 25);
		MainContext.fillText("2. Fast Reload", 2, 35);
		MainContext.fillText("3. Fast Bullet", 2, 45);
		MainContext.fillText("Space-Bar: Cancel", 2, 55);
	}
	// Game lost
	else if(GameState == 3 || GameState == 4)
	{
		// Trivial fun little graphics
		var Text = "-= GAME OVER =-";
		if(GameState == 4)
			Text = "-= !YOU WON! =-";
		for(var i = 0; i < Text.length; i++)
		{
			Color = ColorPalette[Math.floor(((Math.sin(GameLostTime * 10 + i * 0.4) + 1) / 2) * 3) + 1];
			MainContext.fillStyle = "rgb(" + Color.R + "," + Color.G + "," + Color.B + ")";
			MainContext.fillText(Text[i], 10 + i * 5, 34 + Math.sin(GameLostTime * 2.0 + i * 0.05) * 8.0);
		}
	}
}

function SetLevel(Level)
{
	// We are going to deep-copy
	EnemyList = new Array();
	for(var i = 0; i < Level.length; i++)
	{
		var Enemy = Level[i];
		EnemyList[i] = { eType: Enemy.eType, x: Enemy.ox, y: Enemy.oy, ox: Enemy.ox, oy: Enemy.oy, health: Enemy.health, age: Enemy.age, bulletAge:0 };
	}
}

/*** Utility Functions ***/

// Returns true if the point is within the volume
function IsWithin(x, y, width, height)
{
	if(x < 0 || y < 0 || x >= width || y >= height)
		return false;
	else
		return true;
}

// Linear interpolation (normalized progress)
function Lint(a, b, progress)
{
	return a * (1.0 - progress) + b * progress;
}
