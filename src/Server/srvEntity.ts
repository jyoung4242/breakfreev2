import { Box } from "detect-collisions";
import { v4 as uuidv4 } from "uuid";
import { Vector } from "../../_SqueletoECS/Vector.ts";
import { UserId } from "@hathora/server-sdk";
import { colliderBody, collisionBodyType, direction, enemyState, playerState } from "./gametypes.ts";
import Chance from "chance";

const chance = new Chance();

export class Entities {
  entitystate: colliderBody;
  constructor(enityType: collisionBodyType, params?: any) {
    this.entitystate = this.getEntityType(enityType, params);
  }

  getEntityType(type: collisionBodyType, position: Vector, params?: any): colliderBody {
    switch (type) {
      case collisionBodyType.player:
        return this.createPlayerBody(position, params.id, params.color);
      case collisionBodyType.wall:
        return this.createWallBody(position);
      case collisionBodyType.cage:
        return this.createCageBody(position);
      case collisionBodyType.exit:
        return this.createExitBody(position);
      case collisionBodyType.key:
        return this.createKeyBody(position);
      case collisionBodyType.club:
        return this.createClubBody(position);
      case collisionBodyType.knife:
        return this.createKniveBody(position);
      case collisionBodyType.rock:
        return this.createRockBody(position);
      case collisionBodyType.whip:
        return this.createWhipBody(position);
      case collisionBodyType.enemy:
        return this.createEnemyBody(position, params.coords);
      case collisionBodyType.generator:
        return this.createEnemyGeneratorBody(position, params.coords);
    }
  }

  createPlayerBody(position: Vector, id: UserId, color: string): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 15, 15, { isCentered: false }), {
      cBody: collisionBodyType.player,
      sid: uuidv4(),
      state: "waiting" as playerState,
      id,
      health: 25,
      score: 0,
      direction: "none" as direction,
      status: "idle",
      velocity: new Vector(0, 0),
      color,
      nickname: "",
      borderradius: 0,
    });
  }

  createWallBody(position: Vector): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 16, 16, { isStatic: true }), {
      cBody: collisionBodyType.wall,
    });
  }

  createCageBody(position: Vector): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 14, 14, { isCentered: false }), {
      cBody: collisionBodyType.cage,
      velocity: new Vector(0, 0),
      angle: 0,
      angleVelocity: 0,
    });
  }

  createExitBody(position: Vector): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 14, 14, { isStatic: true }), {
      cBody: collisionBodyType.exit,
      status: "closed",
      coords: [0, 0],
    });
  }
  createKeyBody(position: Vector): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 14, 14, { isStatic: true }), {
      cBody: collisionBodyType.key,
      status: "available",
      coords: [0, 0],
    });
  }
  createClubBody(position: Vector): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 14, 14, { isTrigger: true }), {
      cBody: collisionBodyType.club,
      status: "onground",
      velocity: new Vector(0, 0),
      sid: uuidv4(),
      visible: true,
      damage: chance.integer({ min: 2, max: 6 }),
    });
  }
  createKniveBody(position: Vector): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 14, 14, { isTrigger: true }), {
      cBody: collisionBodyType.knife,
      status: "onground",
      velocity: new Vector(0, 0),
      sid: uuidv4(),
      damage: chance.integer({ min: 4, max: 8 }),
      visible: true,
    });
  }
  createRockBody(position: Vector): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 14, 14, { isTrigger: true }), {
      cBody: collisionBodyType.rock,
      velocity: new Vector(0, 0),
      sid: uuidv4(),
      damage: chance.integer({ min: 1, max: 5 }),
      status: "onground",
      visible: true,
    });
  }
  createWhipBody(position: Vector): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 14, 14, { isTrigger: true }), {
      cBody: collisionBodyType.whip,
      status: "onground",
      visible: true,
      velocity: new Vector(0, 0),
      sid: uuidv4(),
      damage: chance.integer({ min: 6, max: 9 }),
    });
  }
  createEnemyGeneratorBody(position: Vector, coords: [number, number]): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 14, 14, { isCentered: false }), {
      cBody: collisionBodyType.generator,
      sid: uuidv4(),
      coords: coords,
    });
  }
  createEnemyBody(position: Vector, coords: [number, number]): colliderBody {
    return Object.assign(new Box({ x: position.x, y: position.y }, 15, 15, { isCentered: false }), {
      cBody: collisionBodyType.enemy,
      sid: uuidv4(),
      velocity: new Vector(0, 0),
      state: enemyState.idle,
      direction: "down",
      AItik: 0,
      AIlimit: 0,
      target: null,
      destinationVector: new Vector(0, 0),
      patrolCoords: [0, 0],
      currentCoords: [0, 0],
      remainingAmountToMove: 0,
      patrolPath: [],
      patrolIndex: 0,
      isColliding: false,
      patrolState: "idle",
      health: chance.integer({ min: 7, max: 15 }),
      damage: chance.integer({ min: 4, max: 10 }),
    });
  }
}
