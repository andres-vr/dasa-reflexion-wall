import * as ecs from '@8thwall/ecs'
import {getUserText, createTextEntity} from './handle-text'
import {createHtmlInput} from './create-textbox'
import {createMenu} from './menu'
import {createColorPicker} from './color-picker'

createHtmlInput()  // Call on startup
createMenu()

let canSpawn: boolean = true

let selectedColor: string = 'ffffff'

createColorPicker((color) => {
  selectedColor = color
  console.log('Selected color updated:', selectedColor)
})

const componentsForClone = [
  ecs.Position, ecs.Quaternion, ecs.Scale, ecs.Shadow, ecs.BoxGeometry, ecs.Material, ecs.ScaleAnimation, ecs.PositionAnimation,
  ecs.RotateAnimation, ecs.CustomPropertyAnimation, ecs.CustomVec3Animation, ecs.FollowAnimation,
  ecs.LookAtAnimation, ecs.GltfModel, ecs.Collider, ecs.ParticleEmitter, ecs.Ui, ecs.Audio,
]

const cloneComponents = (sourceEid, targetEid, world) => {
  componentsForClone.forEach((component) => {
    if (component.has(world, sourceEid)) {
      const properties = component.get(world, sourceEid)
      component.set(world, targetEid, {...properties})
    }
  })
}

ecs.registerComponent({
  name: 'Tap Place',
  schema: {
    entityToSpawn: ecs.eid,  // Entity ID for the entity to spawn
    minScale: ecs.f32,  // Minimum scale for the spawned entity
    maxScale: ecs.f32,  // Maximum scale for the spawned entity
  },
  schemaDefaults: {
    minScale: 1.0,  // Default minimum scale is 1.0
    maxScale: 3.0,  // Default maximum scale is 3.0
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
          // Disable the entityToSpawn
          ecs.Disabled.set(world, entityToSpawn)
        }
      })
      .listen(eid, ecs.input.SCREEN_TOUCH_START, (e) => {
        const {entityToSpawn, minScale, maxScale} = schemaAttribute.get(eid)
        const currentTime = Date.now()

        if (currentTime - dataAttribute.get(eid).lastInteractionTime <= 500) {
          return
        }

        dataAttribute.set(eid, {
          lastInteractionTime: currentTime,
        })

        if (canSpawn) {
          canSpawn = false
          if (entityToSpawn) {
            // This block was missing a proper check for isSpawned
            const newEntity = world.createEntity()
            const randomScale = Math.random() * (maxScale - minScale) + minScale

            cloneComponents(entityToSpawn, newEntity, world)

            ecs.Position.set(world, newEntity, e.data.worldPosition)
            ecs.ScaleAnimation.set(world, newEntity, {
              fromX: 0,
              fromY: 0,
              fromZ: 0,
              toX: randomScale,
              toY: randomScale,
              toZ: randomScale,
              duration: 400,
              loop: false,
              easeOut: true,
              easingFunction: 'Quadratic',
            })

            const userText = getUserText()
            createTextEntity(world, e.data.worldPosition, userText)  // Add the text on top of the note
            console.log('User text to display:', userText)

            // Convert selected color to RGB format
            const red = parseInt(selectedColor.substring(1, 3), 16) / 255
            const green = parseInt(selectedColor.substring(3, 5), 16) / 255
            const blue = parseInt(selectedColor.substring(5, 7), 16) / 255

            console.log(red, green, blue)
            // Apply the color to the material
            ecs.Material.set(world, newEntity, {
              r: red,
              g: green,
              b: blue,
            })
          }
        } else {
          console.error('Couldn\'t create a clone. Did you forget to set entityToSpawn in the properties?')
        }
      })
  },
})
