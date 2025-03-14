import * as ecs from '@8thwall/ecs'

// STEP 1: Create HTML Input Field
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

// STEP 2: Define Components for Cloning
const componentsForClone = [
  ecs.Position, ecs.Quaternion, ecs.Scale, ecs.Shadow, ecs.BoxGeometry, ecs.Material,
  ecs.ScaleAnimation, ecs.PositionAnimation, ecs.RotateAnimation, ecs.CustomPropertyAnimation,
  ecs.CustomVec3Animation, ecs.FollowAnimation, ecs.LookAtAnimation, ecs.GltfModel, ecs.Collider,
  ecs.ParticleEmitter, ecs.Audio, ecs.Ui,  // Using ecs.Ui for 3D text
]

// STEP 3: Clone Components Safely
const cloneComponents = (sourceEid: number, targetEid: number, world: ecs.World): void => {
  componentsForClone.forEach((component) => {
    if (component.has(world, sourceEid)) {
      const properties = component.get(world, sourceEid)
      component.set(world, targetEid, {...properties})
    }
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

// STEP 5: Register the AR Component
ecs.registerComponent({
  name: 'Tap Place',
  schema: {
    entityToSpawn: ecs.eid,
    minScale: ecs.f32,
    maxScale: ecs.f32,
  },
  schemaDefaults: {
    minScale: 1.0,
    maxScale: 3.0,
  },
  data: {
    lastInteractionTime: ecs.f64,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    console.log('Initializing Tap Place component...')
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const {entityToSpawn} = schemaAttribute.get(eid)
        console.log('Entering \'default\' state. Entity to spawn:', entityToSpawn)
        if (entityToSpawn) {
          ecs.Disabled.set(world, entityToSpawn)
        }
      })
      .listen(eid, ecs.input.SCREEN_TOUCH_START, (e) => {
        console.log('Screen tapped at:', e.data.worldPosition)
        const {entityToSpawn, minScale, maxScale} = schemaAttribute.get(eid)
        const currentTime = Date.now()
        if (currentTime - dataAttribute.get(eid).lastInteractionTime <= 500) {
          console.log('Tap ignored (debounce time not passed).')
          return
        }
        dataAttribute.set(eid, {lastInteractionTime: currentTime})
        if (!entityToSpawn) {
          console.error('entityToSpawn is not set!')
          return
        }
        const newEntity = world.createEntity()
        console.log('New note entity created:', newEntity)
        const randomScale = Math.random() * (maxScale - minScale) + minScale
        cloneComponents(entityToSpawn, newEntity, world)
        ecs.Position.set(world, newEntity, e.data.worldPosition)
        console.log('Position set:', e.data.worldPosition)
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
        console.log('Scale animation set with scale:', randomScale)

        // STEP 6: Get user text and create a 3D UI element
        const userText = getUserText()
        console.log('User text to display:', userText)
        try {
          // Create a new entity for the 3D UI text
          const textEntity = world.createEntity()
          console.log('3D UI text entity created:', textEntity)

          // Set the position of the text entity slightly above the note
          const notePosition = e.data.worldPosition
          const textPosition = {x: notePosition.x, y: notePosition.y + 0.1, z: notePosition.z}
          ecs.Position.set(world, textEntity, textPosition)

          // Set up the 3D UI component
          ecs.Ui.set(world, textEntity, {
            type: 'overlay',
            text: userText || 'Default Text',
            fontSize: 0.1,
            width: 'auto',
            height: 'auto',
            background: '#FFFF00',
            color: '#000000',
            padding: '0.02',
            borderRadius: 0.01,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            opacity: 1,
            backgroundOpacity: 1,
          })

          console.log('3D UI Text successfully set:', userText)
        } catch (error) {
          console.error('Error setting 3D UI text:', error)
        }
      })
  },
})
