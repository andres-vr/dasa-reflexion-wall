import * as ecs from '@8thwall/ecs'
import {screen, html} from './landing'

let counter: Number = 0
screen(html)

let deleteMode = false
let likeMode = false

const lockedNotes: number[] = []

const LikeCounter = ecs.registerComponent({
  name: 'LikeCounter',
  schema: {
    likes: ecs.i32,
  },
  schemaDefaults: {
    likes: 0,
  },
})

const toggleDeleteMode = (button: HTMLButtonElement) => {
  deleteMode = !deleteMode
  likeMode = false
  updateButtonStyles()
}

const toggleLikeMode = (button: HTMLButtonElement) => {
  likeMode = !likeMode
  deleteMode = false
  updateButtonStyles()
}

const updateButtonStyles = () => {
  const deleteButton = document.getElementById('deleteButton') as HTMLButtonElement
  const likeButton = document.getElementById('likeButton') as HTMLButtonElement

  if (deleteButton) {
    deleteButton.style.backgroundColor = deleteMode ? 'red' : 'white'
    deleteButton.style.color = deleteMode ? 'white' : 'black'
    deleteButton.style.transform = deleteMode ? 'scale(1.2)' : 'scale(1)'
    deleteButton.style.display = 'flex'
    deleteButton.style.alignItems = 'center'
    deleteButton.style.justifyContent = 'center'
  }

  if (likeButton) {
    likeButton.style.backgroundColor = likeMode ? 'blue' : 'white'
    likeButton.style.color = likeMode ? 'white' : 'black'
    likeButton.style.transform = likeMode ? 'scale(1.2)' : 'scale(1)'
    likeButton.style.display = 'flex'
    likeButton.style.alignItems = 'center'
    likeButton.style.justifyContent = 'center'
  }
}

const createDeleteButton = () => {
  const button = document.createElement('button')
  button.id = 'deleteButton'
  button.innerHTML = '🗑️'
  button.style.position = 'absolute'
  button.style.bottom = '20px'
  button.style.left = '10%'
  button.style.width = '50px'
  button.style.height = '50px'
  button.style.border = 'none'
  button.style.backgroundColor = 'white'
  button.style.borderRadius = '50%'
  button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'
  button.style.fontSize = '24px'
  button.style.cursor = 'pointer'
  button.style.zIndex = '10'
  button.style.transition = 'background-color 0.3s ease, transform 0.2s ease-in-out'
  button.style.display = 'flex'
  button.style.alignItems = 'center'
  button.style.justifyContent = 'center'

  document.body.appendChild(button)
  button.addEventListener('click', () => toggleDeleteMode(button))
}

const createLikeButton = () => {
  const button = document.createElement('button')
  button.id = 'likeButton'
  button.innerHTML = '👍'
  button.style.position = 'absolute'
  button.style.bottom = '20px'
  button.style.right = '42.5%'
  button.style.width = '50px'
  button.style.height = '50px'
  button.style.border = 'none'
  button.style.backgroundColor = 'white'
  button.style.borderRadius = '50%'
  button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'
  button.style.fontSize = '24px'
  button.style.cursor = 'pointer'
  button.style.zIndex = '10'
  button.style.transition = 'background-color 0.3s ease, transform 0.2s ease-in-out'
  button.style.display = 'flex'
  button.style.alignItems = 'center'
  button.style.justifyContent = 'center'

  document.body.appendChild(button)
  button.addEventListener('click', () => toggleLikeMode(button))
}

const componentsForClone = [
  ecs.Position, ecs.Quaternion, ecs.Scale, ecs.Shadow, ecs.BoxGeometry, ecs.Material,
  ecs.ScaleAnimation, ecs.PositionAnimation, ecs.RotateAnimation, ecs.CustomPropertyAnimation,
  ecs.CustomVec3Animation, ecs.FollowAnimation, ecs.LookAtAnimation, ecs.GltfModel, ecs.Collider,
  ecs.ParticleEmitter, ecs.Ui, ecs.Audio, ecs.Text, ecs.Font, ecs.Layout, ecs.World, ecs.forEach,
]

const updateChildText = (parentEntityEid, world, newText) => {
  try {
    const children = Array.from(world.getChildren(parentEntityEid))
    if (children.length > 1) {
      ecs.Ui.set(world, children[0], {
        type: '3d',
        fontSize: 20,
        borderColor: '#000000',
        borderWidth: 1,
        text: newText,
      })
      ecs.Ui.set(world, children[1], {
        type: '3d',
        font: 'Helvetica',
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

const cloneEntityWithChildren = (sourceEid, world) => {
  try {
    if (!ecs.Position.has(world, sourceEid)) {
      console.error('❌ Source entity does not exist:', sourceEid)
      return null
    }

    const targetEid = world.createEntity()
    LikeCounter.set(world, targetEid, {likes: 0})

    componentsForClone.forEach((component) => {
      if (component?.has(world, sourceEid)) {
        const properties = component.get(world, sourceEid)
        component.set(world, targetEid, {...properties})
      }
    })

    ecs.Collider.set(world, targetEid, {type: 'box'})
    ecs.Disabled.remove(world, targetEid)

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

const createTextInput = (callback: (text: string) => void) => {
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
    input.style.zIndex = '10'

    document.body.appendChild(input)
    input.focus()

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && input.value.trim() !== '') {
        callback(input.value.trim())
        document.body.removeChild(input)
      }
    })
  } catch (error) {
    console.error('🚨 Error creating text input:', error)
  }
}

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
      const children = Array.from(world.getChildren(entityEid))
      if (children.length > 1) {
        if (!LikeCounter.has(world, entityEid)) {
          LikeCounter.set(world, entityEid, {likes: 0})
        }
        const currentLikes = LikeCounter.get(world, entityEid).likes + 1
        LikeCounter.set(world, entityEid, {likes: currentLikes})
        ecs.Ui.set(world, children[1], {
          type: '3d',
          font: 'Helvetica',
          fontSize: 55,
          borderWidth: 0,
          borderRadius: 50,
          color: '#000000',
          background: '#FFFFFF',
          backgroundOpacity: 1,
          text: `+${currentLikes}`,
          textAlign: 'center',
        })
        console.log(`👍 Entity ${entityEid} now has ${currentLikes} likes`)
      } else {
        console.warn('⚠️ No children found for entity:', entityEid)
      }
    } else {
      console.warn('⚠️ Tried to like a non-existing entity:', entityEid)
    }
  } catch (error) {
    console.error('🚨 Error updating like count:', error)
  }
}

const createInfoButton = () => {
  const button = document.createElement('button')
  button.innerHTML = 'ℹ️'
  button.style.position = 'absolute'
  button.style.bottom = '20px'
  button.style.right = '10%'
  button.style.width = '50px'
  button.style.height = '50px'
  button.style.border = 'none'
  button.style.backgroundColor = 'white'
  button.style.borderRadius = '50%'
  button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'
  button.style.fontSize = '24px'
  button.style.cursor = 'pointer'
  button.style.zIndex = '10'
  button.style.transition = 'background-color 0.3s ease, transform 0.2s ease-in-out'
  button.style.display = 'flex'
  button.style.alignItems = 'center'
  button.style.justifyContent = 'center'

  button.addEventListener('click', () => {
    screen(html)
  })
  document.body.appendChild(button)
}

const StickyNoteTapDelete = ecs.registerComponent({
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

const findEntityByPosition = (world, targetPosition, currentLikes, tolerance = 0.01) => {
  // Define a query for all entities that have a Position component
  const positionQuery = ecs.defineQuery([ecs.Position])

  for (const eid of positionQuery(world)) {
    const pos = ecs.Position.get(world, eid)

    // Compare positions with a small tolerance to avoid floating-point issues
    if (
      Math.abs(pos.x - targetPosition.x) < tolerance &&
      Math.abs(pos.y - targetPosition.y) < tolerance &&
      Math.abs(pos.z - targetPosition.z) < tolerance
    ) {
      console.log(`✅ Found entity at position (${pos.x}, ${pos.y}, ${pos.z}) with eid: ${eid}`)
      lockedNotes.push(eid)
      StickyNoteTapDelete.set(world, eid, {})
      LikeCounter.set(world, eid, {likes: currentLikes})
      return eid  // Return the entity ID if found
    }
  }

  console.warn('⚠️ No entity found at the given position.')
  return null  // Return null if no matching entity is found
}

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
