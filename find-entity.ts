import * as ecs from '@8thwall/ecs'
import {StickyNoteTapDelete} from './remove'
import {LikeCounter} from './like'

export const lockedNotes: number[] = []

export const findEntityByPosition = (world, targetPosition, currentLikes, tolerance = 0.01) => {
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