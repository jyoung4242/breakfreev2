import { Application, RoomId, startServer, UserId, verifyJwt } from "@hathora/server-sdk";
import * as dotenv from "dotenv";
import { resolve } from "path";

import { MapGen } from "./mapgen.ts";
import { EnemyAI } from "./enemyAI.ts";
import { CollisionMgmt } from "./collisions.ts";
import { colliderBody, collisionBodyType, direction, ENEMY_GEN_TRIGGER, gamestates, InternalState } from "./gametypes.ts";
import { Entities } from "./srvEntity.ts";

dotenv.config();
const rooms: Map<RoomId, InternalState> = new Map();
const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

const app: Application = {
  verifyToken: (token: string, roomId: string): Promise<UserId | undefined> => {
    return new Promise((resolve, reject) => {
      const result = verifyJwt(token, process.env.APP_SECRET as string);
      if (result) resolve(result);
      else reject();
    });
  },
  subscribeUser: (roomId: RoomId, userId: UserId): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!rooms.has(roomId)) {
        //create room in map
        //room initialization logic here
      }

      /*************************************************
      //check to make sure user not in room
      *************************************************/
      const game = rooms.get(roomId);
      if (game == undefined) return;

      const findResult = game.players.findIndex((user: any) => user.id === userId);
      if (findResult != -1) {
        server.sendMessage(
          roomId,
          userId,
          encoder.encode(
            JSON.stringify({
              type: "ERROR",
              message: `user: ${userId} is already in room ${roomId}`,
            })
          )
        );
        reject();
      }

      /*****************************************
       * if player limit not exceeded, proceed
       ****************************************/
      if (game.players.length == game.capacity) {
        /****************
         * Error handling
         ***************/
        console.warn("Current room at max capacity");
        server.closeConnection(roomId, userId, "Current room at max capacity");
        return;
      }

      /*****************************************
       * add player to room
       ****************************************/
      const plrGen = new Entities(collisionBodyType.player, { id: userId, color: "blue" });
      game.players.push(plrGen.entitystate);
      resolve();
    });
  },
  unsubscribeUser: (roomId: RoomId, userId: UserId): Promise<void> => {
    return new Promise((resolve, reject) => {
      /***********************
       * Check for valid room
       ***********************/
      if (!rooms.has(roomId)) {
        return;
      }

      /*********************
       * Get room gamestate
       *********************/
      const game = rooms.get(roomId);

      /********************************
       * Find the player in gamestate
       * remove them from the game
       *******************************/
      const plrIndex = game?.players.findIndex((plr: any) => plr.id == userId);
      if ((plrIndex as number) >= 0) {
        //broadcast new user to all players
        const leftMessage = {
          type: "event",
          scene: "any",
          subtype: "userLeftServer",
          playerID: userId,
        };
        server.broadcastMessage(roomId, encoder.encode(JSON.stringify(leftMessage)));
        game?.players.splice(plrIndex as number, 1);
      }

      //cleanup
      if (game?.players.length == 0) {
        game.gameState == gamestates.gameover;
        game.enemies = [];
      }

      resolve();
    });
  },

  /*
    The onMessage is the callback that manages all the clients messages to the server, this is where a bulk of your server code goes regarding
    responding to the client's messages
  */

  onMessage: (roomId: RoomId, userId: UserId, data: ArrayBuffer): Promise<void> => {
    return new Promise(resolve => {
      const msg = JSON.parse(decoder.decode(data));
      console.log(`message from ${userId}, in ${roomId}: `, msg);
      server.sendMessage(
        roomId,
        userId,
        encoder.encode(
          JSON.stringify({
            type: "SERVERMESSAGE",
            msg: "HELLO FROM SERVER",
          })
        )
      );
      resolve();
    });
  },
};

const port = 9000;
const server = await startServer(app, port);
console.log(`Hathora Server listening on port ${port}`);

//gametik
setInterval(() => {
  rooms.forEach((game: any, key: string) => {
    //for each game...

    //increase score if player active
    if (game.gameState == gamestates.running) game.scoreTik++;
    else game.scoreTik = 0;

    if (game.scoreTik >= 20) {
      game.scoreTik = 0;
      game.players.forEach((plr: any) => {
        if (plr.state === "active") plr.score++;
      });
    }

    //increase monster gen tick, and react
    if (game.gameState == gamestates.running) game.enemyGenTik++;
    else game.enemyGenTik = 0;

    if (game.enemyGenTik >= ENEMY_GEN_TRIGGER) {
      game.enemyGenTik = 0;

      game.generators.forEach((gen: any, ind: number) => {
        generateEnemy(game, ind);
      });
    }

    //increase enemyAI tik, and react
    //TODO - enemyAI here

    //manage movement
    if (game.players.length > 0) {
      game.players.forEach((plr: colliderBody) => {
        updatePlayersPositions(plr);
      });
    }

    //manage collisions
    //update client state
  });
}, 50);

function generateEnemy(game: InternalState, index: number) {
  //TODO - add enemy generation
  //test for entities around generator
  //if clear, add entity nearby
}

function updatePlayersPositions(plr: any) {
  //modify velocity based on keyboard input
  if (plr.status == "walk") {
    switch (plr.direction as direction) {
      case "down":
        plr.velocity.y = 9;
        plr.velocity.x = 0;
        break;
      case "up":
        plr.velocity.y = -9;
        plr.velocity.x = 0;
        break;
      case "left":
        plr.velocity.x = -9;
        plr.velocity.y = 0;
        break;
      case "right":
        plr.velocity.x = 9;
        plr.velocity.y = 0;
        break;
      case "none":
        plr.velocity.x = 0;
        plr.velocity.y = 0;
        break;
    }
  } else {
    plr.velocity.x = 0;
    plr.velocity.y = 0;
  }
  //update position based on velocity
  (plr as colliderBody).setPosition((plr.pos.x += plr.velocity.x), (plr.pos.y += plr.velocity.y));
}
