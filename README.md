# Chain Reaction!

This a web version the famous mobile game "Chain Reaction"! Find a snapshot of the mobile game below:

![Mobile Game](http://tarasoft.bg/p/projects/251x382/0/33dd1d40658a0cc5492a31aba97d0a19.jpg)

# Know the game

Chain reaction is a deterministic combinatorial game of perfect information for 2 players (Red and Green).
What makes it more interesting is how unpredictable the game seems to be at the end.
The game board is of the size 6 * 9 cells.
For each cell on the board, a critical mass is defined.
Critical mass is nothing but the number of orthogonally adjacent cells.
So, for usual cells, this would ne 4,  for edge cells it will be 3 and for corner cells it will be 2.
Intially, at the start of the game, all cells are empty.
The Red and the Greeen player take turns to place "orbs" of their correspondong colors in the cells.
Each player can place only their color orb in an empty cell. The player can also place the orb in a cell that already contains one or more same colored orbs. This way the orbs are stacked up in the same cell.
When stack size of the cell equals the critical mass, it explodes.
The result of the explosion is that to each of the orthogonally adjacent cells, an orb is added.
The explosion might result in overloading of adjacent cells thus leading to a chain of explosions, hence the name, <b>Chain Reaction</b>.
The winner is the one who eliminates other player's orbs.

### Online!
The game is now officially available on:
>[ketanhwr.github.io/chain-reaction]

[ketanhwr.github.io/chain-reaction]: <http://ketanhwr.github.io/chain-reaction>
