import * as ecs from '@8thwall/ecs'
import {LikeCounter} from './like'
 
export const componentsForClone = [
  ecs.Position, ecs.Quaternion, ecs.Scale, ecs.Shadow, ecs.BoxGeometry, ecs.Material,
  ecs.ScaleAnimation, ecs.PositionAnimation, ecs.RotateAnimation, ecs.CustomPropertyAnimation,
  ecs.CustomVec3Animation, ecs.FollowAnimation, ecs.LookAtAnimation, ecs.GltfModel, ecs.Collider,
  ecs.ParticleEmitter, ecs.Ui, ecs.Audio, ecs.Text, ecs.Font, ecs.Layout, ecs.World, ecs.forEach,
]

export const cloneEntityWithChildren = (sourceEid, world) => {
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