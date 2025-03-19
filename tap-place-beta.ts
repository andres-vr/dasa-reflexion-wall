import * as ecs from '@8thwall/ecs'

let deleteMode = false  // Track whether delete mode is active
let likeMode = false

// List of components to clone
const componentsForClone = [
  ecs.Position, ecs.Quaternion, ecs.Scale, ecs.Shadow, ecs.BoxGeometry, ecs.Material,
  ecs.ScaleAnimation, ecs.PositionAnimation, ecs.RotateAnimation, ecs.CustomPropertyAnimation,
  ecs.CustomVec3Animation, ecs.FollowAnimation, ecs.LookAtAnimation, ecs.GltfModel, ecs.Collider,
  ecs.ParticleEmitter, ecs.Ui, ecs.Audio, ecs.Text, ecs.Font, ecs.Layout,
]

// Function to update the text of the child entity
const updateChildText = (parentEntityEid, world, newText) => {
  try {
    const children = Array.from(world.getChildren(parentEntityEid))
    if (children.length > 1) {
      ecs.Ui.set(world, children[1], {
        type: '3d',
        fontSize: 20,
        borderColor: '#000000',
        borderWidth: 1,
        text: newText,
      })
      ecs.Ui.set(world, children[0], {
        type: '3d',
        fontSize: 55,
        borderWidth: 0,
        borderRadius: 50,
        color: '#000000',
        background: '#FFFFFF',
        backgroundOpacity: 0,
        text: '',
        textAlign: 'center',
      })
    } else {
      console.warn('⚠️ No children found for entity:', parentEntityEid)
    }
  } catch (error) {
    console.error('🚨 Error updating child text:', error)
  }
}

// Function to clone an entity and its children
const cloneEntityWithChildren = (sourceEid, world) => {
  try {
    if (!ecs.Position.has(world, sourceEid)) {
      console.error('❌ Source entity does not exist:', sourceEid)
      return null
    }

    const targetEid = world.createEntity()

    // Clone components
    componentsForClone.forEach((component) => {
      if (component?.has(world, sourceEid)) {
        const properties = component.get(world, sourceEid)
        component.set(world, targetEid, {...properties})
      }
    })

    // Ensure the cloned entity has a collider for touch detection
    ecs.Collider.set(world, targetEid, {type: 'box'})

    // Enable the cloned entity if it was disabled
    ecs.Disabled.remove(world, targetEid)

    // Recursively clone child entities
    const children = Array.from(world.getChildren(sourceEid))
    children.forEach((childEid) => {
      const newChildEid = cloneEntityWithChildren(childEid, world)
      if (newChildEid) {
        world.setParent(newChildEid, targetEid)
      }
    })
    return targetEid
  } catch (error) {
    console.error('🚨 Error cloning entity:', error)
    return null
  }
}

// Function to create an input field for user text input
const createTextInput = (callback) => {
  try {
    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Enter your text...'
    input.style.position = 'absolute'
    input.style.bottom = '10%'
    input.style.left = '50%'
    input.style.transform = 'translate(-50%, -50%)'
    input.style.padding = '10px'
    input.style.fontSize = '16px'
    input.style.border = '1px solid #ccc'
    input.style.borderRadius = '5px'
    input.style.zIndex = '1000'

    document.body.appendChild(input)
    input.focus()

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && input.value.trim() !== '') {
        console.log('📝 User entered text:', input.value.trim())
        callback(input.value.trim())  // Send the input text back
        document.body.removeChild(input)  // Remove the input box
      }
    })
  } catch (error) {
    console.error('🚨 Error creating text input:', error)
  }
}

// Function to remove an entity
const removeEntity = (entityEid, world) => {
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

const likeEntity = (entityEid, world) => {
  try {
    if (ecs.Position.has(world, entityEid)) {
      try {
        const children = Array.from(world.getChildren(entityEid))
        if (children.length > 1) {
          ecs.Ui.set(world, children[0], {
            type: '3d',
            fontSize: 55,
            borderWidth: 0,
            borderRadius: 50,
            color: '#000000',
            background: '#FFFFFF',
            backgroundOpacity: 1,
            text: '1',
            textAlign: 'center',
          })
        } else {
          console.warn('⚠️ No children found for entity:', entityEid)
        }
      } catch (error) {
        console.error('🚨 Error updating child text:', error)
      }
    } else {
      console.warn('⚠️ Tried to remove a non-existing entity:', entityEid)
    }
  } catch (error) {
    console.error('🚨 Error removing entity:', error)
  }
}

const createDeleteButton = () => {
  const button = document.createElement('button')
  button.innerHTML = '🗑️'  // Trash emoji
  button.style.position = 'absolute'
  button.style.bottom = '20px'
  button.style.right = '35%'
  button.style.width = '50px'
  button.style.height = '50px'
  button.style.border = 'none'
  button.style.backgroundColor = 'white'  // Default background
  button.style.borderRadius = '50%'
  button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'
  button.style.fontSize = '24px'
  button.style.cursor = 'pointer'
  button.style.zIndex = '1000'
  button.style.transition = 'background-color 0.3s ease, transform 0.2s ease-in-out'

  document.body.appendChild(button)

  button.addEventListener('click', () => {
    deleteMode = !deleteMode
    button.style.backgroundColor = deleteMode ? 'red' : 'white'  // Fix: Directly update button background
    button.style.color = deleteMode ? 'white' : 'black'  // Optional: Change icon color
    button.style.transform = deleteMode ? 'scale(1.2)' : 'scale(1)'
  })
}

const createLikeButton = () => {
  const button = document.createElement('button')
  button.innerHTML = '👍'  // Trash emoji
  button.style.position = 'absolute'
  button.style.bottom = '20px'
  button.style.right = '20%'
  button.style.width = '50px'
  button.style.height = '50px'
  button.style.border = 'none'
  button.style.backgroundColor = 'white'  // Default background
  button.style.borderRadius = '50%'
  button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'
  button.style.fontSize = '24px'
  button.style.cursor = 'pointer'
  button.style.zIndex = '1000'
  button.style.transition = 'background-color 0.3s ease, transform 0.2s ease-in-out'

  document.body.appendChild(button)

  button.addEventListener('click', () => {
    likeMode = !likeMode
    button.style.backgroundColor = likeMode ? 'blue' : 'white'  // Fix: Directly update button background
    button.style.color = likeMode ? 'white' : 'black'  // Optional: Change icon color
    button.style.transform = likeMode ? 'scale(1.2)' : 'scale(1)'
  })
}

const createInfoButton = () => {
  const button = document.createElement('button')
  button.innerHTML = 'ℹ️'  // Info icon
  button.style.position = 'absolute'
  button.style.bottom = '20px'
  button.style.right = '5%'
  button.style.width = '50px'
  button.style.height = '50px'
  button.style.border = 'none'
  button.style.backgroundColor = '#ffffff'
  button.style.borderRadius = '50%'
  button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'
  button.style.fontSize = '24px'
  button.style.cursor = 'pointer'
  button.style.zIndex = '1000'
  button.style.transition = 'transform 0.2s ease-in-out'

  button.addEventListener('click', () => {
    alert('Tap anywhere to leave your comment')
  })
  document.body.appendChild(button)
}

// 1) Register the custom component, store the return value in a variable
const StickyNoteTapDelete = ecs.registerComponent({
  name: 'StickyNoteTapDelete',
  schema: {},
  stateMachine: ({world, eid}) => {
    ecs.defineState('default')
      .initial()
      .listen(eid, ecs.input.SCREEN_TOUCH_START, (e) => {
        if (deleteMode) {
          removeEntity(eid, world)
        } else if (likeMode) {
          likeEntity(eid, world)
        }
      })
  },
})

// Register the 'Tap Place' component (for spawning Notes with custom text)
ecs.registerComponent({
  name: 'Tap Place',
  schema: {
    entityToSpawn: ecs.eid,  // Entity ID for the entity to spawn
    minScale: ecs.f32,       // Minimum scale for the spawned entity
    maxScale: ecs.f32,       // Maximum scale for the spawned entity
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
          // Disable original entity so it's not visible/collidable
          ecs.Disabled.set(world, entityToSpawn, {})
        }
        createInfoButton()
        createDeleteButton()
        createLikeButton()
      })
      .listen(eid, ecs.input.SCREEN_TOUCH_START, async (e) => {
        try {
          const {entityToSpawn} = schemaAttribute.get(eid)
          const currentTime = Date.now()

          // Prevent rapid consecutive interactions
          if (currentTime - dataAttribute.get(eid).lastInteractionTime <= 500) {
            return
          }
          dataAttribute.set(eid, {lastInteractionTime: currentTime})

          // DELETE MODE: Check for tapped entity and remove it
          if (deleteMode) {
            const tappedEntity = e.data.hit?.entity
            if (tappedEntity) {
              removeEntity(tappedEntity, world)
            }
            return
          }

          // If delete mode is OFF, create a new note
          if (entityToSpawn) {
            createTextInput((userText) => {
              console.log('📌 Creating new note with text:', userText)
              const newEntity = cloneEntityWithChildren(entityToSpawn, world)
              if (!newEntity) {
                console.error('❌ Failed to clone entity')
                return
              }

              // Set position of the new entity
              ecs.Position.set(world, newEntity, e.data.worldPosition)

              // Update the text of the first child entity with user input
              updateChildText(newEntity, world, userText)

              // 2) Use the variable `StickyNoteTapDelete` to attach the component
              StickyNoteTapDelete.set(world, newEntity, {})
            })
          }
        } catch (error) {
          console.error('🚨 Error in screen tap event:', error)
        }
      })
  },
})
