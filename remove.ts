import * as ecs from '@8thwall/ecs'
import {likeEntity} from './like'
import {deleteMode, likeMode} from './modes'
import {lockedNotes} from './find-entity'

export const removeEntity = (entityEid, world) => {
  try {
    if (ecs.Position.has(world, entityEid)) {
      world.deleteEntity(entityEid)
      console.log(`🗑️ Removed entity: ${entityEid}`)
    } else {
      console.warn('⚠️ Tried to remove a non-existing entity:', entityEid)
    }
  } catch (error) {
    console.error('🚨 Error removing entity:', error)
  }
}

export const StickyNoteTapDelete = ecs.registerComponent({
  name: 'StickyNoteTapDelete',
  schema: {},
  stateMachine: ({world, eid}) => {
    ecs.defineState('default')
      .initial()
      .listen(eid, ecs.input.SCREEN_TOUCH_START, (e) => {
        if (deleteMode) {
          if (!lockedNotes.includes(eid)) {
            removeEntity(eid, world)
          }
        } else if (likeMode) {
          likeEntity(eid, world)
        }
      })
  },
})