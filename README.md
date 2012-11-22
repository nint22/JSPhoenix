JSPhoenix
=========

JSPhoenix is a simple Javascript Re-implementation of the
classic [TI-83+ Phoenix game](http://www.ticalc.org/archives/files/fileinfo/148/14876.html).
JSPhoenix runs in any modern browser that implements the HTML5 standard. This game only
uses the Canvas tag to render the game's output, and was meant as a fun single-day
programming exercise.

Controls
========

Start the game by loading the web-page (the Javascript game source-code is embeded in it), and
press your space-bar key to start. Arrows move the ship on the bottom half, while enemies always reside
in the top half. The Z-key is used to shoot at enemies; each enemy-type has different health values!
Get hit five times, you loose. Beat all three levels to win!

Notes
=====

The game appears "fuzzy" on purpose: I wanted to use the native 96 x 64 pixel screen, used
by the TI-83+. Thus, I scale that source output by about 5 times to be more easily visible.
The game only features *three* levels with four different kind of enemies. Each one has a
different health value, but all four shoot the same kind of bullets. The player only has five
health-points which do not regenerate.

Features I would love to see others develop and merge-back would be:

- A currency system, rather than "buying one item at each store"
- Cleaner fonts
- A more "retro" look of the actual pixel display
- Buy health through the store
- Have weapons upgrade (different kinds of weapons, not just damage-point upgrades)
- More levels & enemies

The source-code design is pretty straight-forward: there is a looped function which controls
frame / update rates, and executes an "Update" function (game logic), and a "Render" function (rendering).
The entire game state is stored as an integer in a sing variable, which helps transition between the splash-screen,
playing, the store, winning, etc. No particular coding standard was used, nor is there a focus on optimization.

Credit
======

Developed for fun in a day by [Jeremy Bridon](http://www.cores2.com). Feel free to fork and go wild
with this code. If you have any questions, feel free to contact me through GitHub or through
[my website](http://www.cores2.com/blog/?page_id=21).
