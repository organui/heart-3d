import { describe, expect, test } from 'bun:test'
import {
  anatomyTree,
  assertAnatomyMapping,
  groupIds,
  hiddenFromVisibility,
  normalizeVisibility,
  sceneIdsForNode,
  visibilityFromHidden,
} from './anatomy-adapter'
import { structures } from './anatomy'

describe('anatomy tree adapter', () => {
  test('groups every structure exactly once under interface group rows', () => {
    expect(groupIds).toEqual([
      'group-heart-walls',
      'group-ventricular-cavities',
      'group-great-vessels',
      'group-coronary-arteries',
    ])
    expect(anatomyTree.flatMap((group) => group.children!.map(({ id }) => id)).sort()).toEqual(
      structures.map(({ id }) => id).sort(),
    )
  })

  test('maps group rows to their scene leaves and leaves to themselves', () => {
    expect(sceneIdsForNode('group-ventricular-cavities')).toEqual([
      'right-ventricle',
      'left-ventricle',
    ])
    expect(sceneIdsForNode('aortic-arch')).toEqual(['aortic-arch'])
    expect(sceneIdsForNode('unknown')).toEqual([])
    expect(sceneIdsForNode(null)).toEqual([])
  })

  test('treats missing visibility entries as visible', () => {
    const visibility = normalizeVisibility({ 'left-atrium': false })
    expect(visibility['left-atrium']).toBe(false)
    expect(visibility['right-atrium']).toBe(true)
    expect(Object.keys(visibility)).toHaveLength(structures.length)
  })

  test('round-trips the hidden set through the tree visibility map', () => {
    const hidden = new Set(['ventricular-wall', 'left-coronary'])
    const visibility = visibilityFromHidden(hidden)
    expect(visibility).toEqual({ 'ventricular-wall': false, 'left-coronary': false })
    expect(hiddenFromVisibility(visibility)).toEqual(hidden)
    expect(hiddenFromVisibility({ 'right-atrium': true })).toEqual(new Set())
  })

  test('rejects missing, unknown, and duplicate leaves', () => {
    expect(() => assertAnatomyMapping()).not.toThrow()
    const [first, ...rest] = anatomyTree
    expect(() => assertAnatomyMapping(rest)).toThrow(/missing=right-atrium/)
    expect(() =>
      assertAnatomyMapping([...anatomyTree, { id: 'mitral-valve', label: 'Mitral valve' }]),
    ).toThrow(/unknown=mitral-valve/)
    expect(() =>
      assertAnatomyMapping([...anatomyTree, { id: 'g', label: 'Again', children: [first] }]),
    ).toThrow(/duplicates=right-atrium/)
  })
})
