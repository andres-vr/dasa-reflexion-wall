import * as ecs from '@8thwall/ecs'

const createHtmlInput = (): void => {
  let inputDiv = document.getElementById('ar-text-input') as HTMLDivElement
  if (!inputDiv) {
    inputDiv = document.createElement('div') as HTMLDivElement
    inputDiv.id = 'ar-text-input'
    inputDiv.style.position = 'absolute'
    inputDiv.style.bottom = '20px'
    inputDiv.style.left = '50%'
    inputDiv.style.transform = 'translateX(-50%)'
    inputDiv.style.background = '#ffffff'
    inputDiv.style.padding = '10px'
    inputDiv.style.borderRadius = '5px'
    inputDiv.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.1)'

    const input = document.createElement('input') as HTMLInputElement
    input.type = 'text'
    input.id = 'userTextInput'
    input.placeholder = 'Enter your text...'
    input.style.padding = '5px'
    input.style.fontSize = '16px'

    inputDiv.appendChild(input)
    document.body.appendChild(inputDiv)
  }
}
createHtmlInput()  // Call on startup

let canSpawn: boolean = true
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

const createTextEntity = (world, position, userText) => {
  const textEntity = world.createEntity()
  ecs.Position.set(world, textEntity, position)
  ecs.Ui.set(world, textEntity, {
    type: 'overlay',
    text: userText,
    width: '100',
    height: '50',
  })
}
// STEP 4: Get User Input Safely
const getUserText = (): string => {
  const userInput = document.getElementById('userTextInput') as HTMLInputElement
  if (!userInput) {
    console.warn('No input field found! Using default text.')
    return 'Default Text'
  }
  const textValue = userInput.value.trim()
  console.log('User entered text:', textValue)
  return textValue || 'Default Text'
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
          canSpawn = true
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
          }
        } else {
          console.error('Couldn\'t create a clone. Did you forget to set entityToSpawn in the properties?')
        }
      })
  },
})
