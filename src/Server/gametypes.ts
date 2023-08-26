import { Box, System } from "detect-collisions";

export const ENEMY_GEN_TRIGGER = 25;

export enum collisionBodyType {
  player = "player",
  wall = "wall",
  cage = "cage",
  exit = "exit",
  key = "key",
  club = "club",
  knife = "knife",
  rock = "rock",
  whip = "whip",
  enemy = "enemy",
  generator = "generator",
}

export enum weaponType {
  knife = "knife",
  whip = "whip",
  club = "club",
  rock = "rock",
  spear = "spear",
  machete = "machete",
  none = "none",
}

export type colliderBody = Box & { cBody: collisionBodyType };
export type direction = "right" | "up" | "left" | "down" | "none";

export type InternalState = {
  //game data
  dc: System;
  gameState: gamestates;
  soloGame: boolean;
  topScorer: string;

  //time values
  scoreTik: number;
  enemyGenTik: number;

  //map date
  map: Array<Array<number>> | undefined;
  startingCoords: [number, number];

  //entities
  players: colliderBody[];
  weapons: colliderBody[];
  capacity: number;
  cages: colliderBody[];
  exit: colliderBody;
  key: colliderBody;
  generators: colliderBody[];
  enemies: colliderBody[];
};

export enum enemyState {
  idle = "idle",
  scanning = "scanning",
  patrol = "patrol",
  attack = "attack",
  damage = "damage",
  moving = "moving",
}

export enum gamestates {
  "config" = "config",
  "prestart" = "prestart",
  "startingbanner" = "startingbanner",
  "running" = "running",
  "gameover" = "gameover",
}

export type playerState = "active" | "disabled" | "waiting";
export type doorstate = "open" | "closed";
