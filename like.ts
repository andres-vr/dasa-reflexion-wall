import * as ecs from '@8thwall/ecs'

export const LikeCounter = ecs.registerComponent({
  name: 'LikeCounter',
  schema: {
    likes: ecs.i32,
  },
  schemaDefaults: {
    likes: 0,
  },
})

export const likeEntity = (entityEid, world) => {
  try {
    if (ecs.Position.has(world, entityEid)) {
      const children = Array.from(world.getChildren(entityEid))
      if (children.length > 1) {
        if (!LikeCounter.has(world, entityEid)) {
          LikeCounter.set(world, entityEid, { likes: 0 })
        }
        const currentLikes = LikeCounter.get(world, entityEid).likes + 1
        LikeCounter.set(world, entityEid, { likes: currentLikes })
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