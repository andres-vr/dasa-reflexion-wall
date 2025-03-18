import * as ecs from '@8thwall/ecs'

// List of components to clone
const componentsForClone = [
  ecs.Position, ecs.Quaternion, ecs.Scale, ecs.Shadow, ecs.BoxGeometry, ecs.Material,
  ecs.ScaleAnimation, ecs.PositionAnimation, ecs.RotateAnimation, ecs.CustomPropertyAnimation,
  ecs.CustomVec3Animation, ecs.FollowAnimation, ecs.LookAtAnimation, ecs.GltfModel, ecs.Collider,
  ecs.ParticleEmitter, ecs.Ui, ecs.Audio, ecs.Text, ecs.Font, ecs.Layout,
]

// Function to update the text of the child entity
const updateChildText = (parentEntityEid, world, newText) => {
  const children = Array.from(world.getChildren(parentEntityEid))
  if (children.length > 0) {
    ecs.Ui.set(world, children[0], {
      type: '3d',
      text: newText,
    })
  }
}

// Function to clone an entity and its children
const cloneEntityWithChildren = (sourceEid, world) => {
  const targetEid = world.createEntity()

  // Clone components
  componentsForClone.forEach((component) => {
    if (component?.has(world, sourceEid)) {
      const properties = component.get(world, sourceEid)
      component.set(world, targetEid, {...properties})
    }
  })

  // Enable the cloned entity if it was disabled
  ecs.Disabled.remove(world, targetEid)

  // Recursively clone child entities
  const children = Array.from(world.getChildren(sourceEid))
  children.forEach((childEid) => {
    const newChildEid = cloneEntityWithChildren(childEid, world)
    world.setParent(newChildEid, targetEid)
  })
  return targetEid
}

// Register the 'Tap Place' component (for spawning Notes with text)
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
          ecs.Disabled.set(world, entityToSpawn, {})  // Disable original entity
        }
      })
      .listen(eid, ecs.input.SCREEN_TOUCH_START, (e) => {
        const {entityToSpawn, minScale, maxScale} = schemaAttribute.get(eid)
        const currentTime = Date.now()

        // Prevent rapid consecutive interactions
        if (currentTime - dataAttribute.get(eid).lastInteractionTime <= 500) {
          return
        }

        dataAttribute.set(eid, {
          lastInteractionTime: currentTime,
        })

        if (entityToSpawn) {
          const newEntity = cloneEntityWithChildren(entityToSpawn, world)

          // Set position and animation
          ecs.Position.set(world, newEntity, e.data.worldPosition)
          const randomScale = Math.random() * (maxScale - minScale) + minScale
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

          // Update the text of the first child entity
          updateChildText(newEntity, world, 'Hello!')
        }
      })
  },
})
