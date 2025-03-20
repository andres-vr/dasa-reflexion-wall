import * as ecs from '@8thwall/ecs'

import {screen} from './landing'
import {removeEntity, StickyNoteTapDelete} from './remove'
import {deleteMode, likeMode} from './modes'
import {cloneEntityWithChildren} from './clone'
import {findEntityByPosition} from './find-entity'
import {createTextInput, updateChildText} from './text'
import {createDeleteButton, createLikeButton, createInfoButton} from './buttons'

let counter: Number = 0
screen()

ecs.registerComponent({
  name: 'Tap Place',
  schema: {
    entityToSpawn: ecs.eid,
    minScale: ecs.f32,
    maxScale: ecs.f32,
  },
  schemaDefaults: {
    minScale: 1.0,
    maxScale: 1.0,
  },
  data: {
    lastInteractionTime: ecs.f64,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const {entityToSpawn} = schemaAttribute.get(eid)
        if (entityToSpawn) {
          ecs.Disabled.set(world, entityToSpawn, {})
        }
        createInfoButton()
        createDeleteButton()
        createLikeButton()
        const targetPosition1 = {x: -2, y: 3, z: 0.01}
        findEntityByPosition(world, targetPosition1, 2)
        const targetPosition2 = {x: 1.5, y: 4.5, z: 0.01}
        findEntityByPosition(world, targetPosition2, 1)
      })
      .listen(eid, ecs.input.SCREEN_TOUCH_START, async (e) => {
        try {
          const {entityToSpawn} = schemaAttribute.get(eid)
          const currentTime = Date.now()
          if (currentTime - dataAttribute.get(eid).lastInteractionTime <= 500) {
            return
          }
          dataAttribute.set(eid, {lastInteractionTime: currentTime})
          if (deleteMode) {
            const tappedEntity = e.data.hit?.entity
            if (tappedEntity) {
              removeEntity(tappedEntity, world)
            }
            return
          }
          if (entityToSpawn && !deleteMode && !likeMode) {
            createTextInput((userText) => {
              const newEntity = cloneEntityWithChildren(entityToSpawn, world)
              if (!newEntity) {
                console.error('❌ Failed to clone entity')
                return
              }
              ecs.Position.set(world, newEntity, e.data.worldPosition)
              if (ecs.GltfModel.has(world, newEntity)) {
                counter = Math.floor(Math.random() * 4)
                switch (counter) {
                  case 0: {
                    ecs.GltfModel.set(world, newEntity, {url: 'assets/note-blue.glb'})
                    break
                  }
                  case 1: {
                    ecs.GltfModel.set(world, newEntity, {url: 'assets/note-green.glb'})
                    break
                  }
                  case 2: {
                    ecs.GltfModel.set(world, newEntity, {url: 'assets/note-red.glb'})
                    break
                  }
                  case 3: {
                    ecs.GltfModel.set(world, newEntity, {url: 'assets/note-yellow.glb'})
                    break
                  }
                  default: {
                    ecs.GltfModel.set(world, newEntity, {url: 'assets/note-without-texture.glb'})
                    break
                  }
                }
              }
              updateChildText(newEntity, world, userText)
              StickyNoteTapDelete.set(world, newEntity, {})
            })
          }
        } catch (error) {
          console.error('🚨 Error in screen tap event:', error)
        }
      })
  },
})