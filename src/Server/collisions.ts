import { System, Response } from "detect-collisions";
import { colliderBody, collisionBodyType } from "./gametypes";

export class CollisionMgmt {
  sys: System;
  constructor(system: System) {
    this.sys = system;
  }

  update() {
    this.sys.checkAll((res: Response) => {
      let { a, b, overlapV } = res;

      switch (a.cBody as collisionBodyType) {
        case collisionBodyType.player:
          switch (b.cBody as collisionBodyType) {
            case collisionBodyType.player:
              //push other player
              b.setPosition((b.x += overlapV.x), (b.y += overlapV.y));
              break;
            case collisionBodyType.wall:
            case collisionBodyType.cage:
              //can't walk through
              a.setPosition(a.x - overlapV.x, a.y - overlapV.y);
              break;
            case collisionBodyType.exit:
              //can't walk through
              a.setPosition(a.x - overlapV.x, a.y - overlapV.y);
              //TODO, manage the key and unlocking door via signals
              break;
            case collisionBodyType.key:
              //no physics changes;
              //TODO, manage the key via signals
              break;
            case collisionBodyType.club:
            case collisionBodyType.knife:
            case collisionBodyType.rock:
            case collisionBodyType.whip:
              //no physics changes;
              //TODO, manage picking up weapons via signals
              break;
            case collisionBodyType.enemy:
              //TODO
              //player enemy collision
              //player gets damage, but damages enemy too
              //player knockback
              break;
            default:
              break;
          }
          break;
        case collisionBodyType.club:
        case collisionBodyType.knife:
        case collisionBodyType.rock:
        case collisionBodyType.whip:
          switch (b.cBody as collisionBodyType) {
            case collisionBodyType.enemy:
              //TODO collision from weapon to enemy
              break;
            case collisionBodyType.wall:
              //TODO collision of weapon and wall
              break;
            default:
              break;
          }
          break;
        case collisionBodyType.enemy:
          switch (b.cBody as collisionBodyType) {
            case collisionBodyType.player:
              break;
            case collisionBodyType.wall:
              break;
            case collisionBodyType.generator:
              break;
            default:
              break;
          }
          break;
        default:
      }
    });
  }
}
