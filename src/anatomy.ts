export type Structure = {
  id: string
  fma: string
  name: string
  sourceName: string
  group: 'Heart walls' | 'Ventricular cavities' | 'Great vessels' | 'Coronary arteries'
  mapping?: 'isa'
  color: string
  description: string
  note: string
}

export const anatomySource = 'https://www.nhlbi.nih.gov/health/heart/blood-flow'
export const wallSource = 'https://www.nhlbi.nih.gov/health/heart/anatomy'
export const structures: Structure[] = [
  {
    id: 'right-atrium',
    fma: 'FMA9457',
    name: 'Right atrium',
    sourceName: 'wall of right atrium',
    group: 'Heart walls',
    color: '#a96d70',
    description: 'Receives blood returning from the body and passes it to the right ventricle.',
    note: 'The atrial wall is shown; the chamber cavity is omitted.',
  },
  {
    id: 'left-atrium',
    fma: 'FMA9531',
    name: 'Left atrium',
    sourceName: 'wall of left atrium',
    group: 'Heart walls',
    color: '#b77c76',
    description: 'Receives oxygen-rich blood from the lungs and passes it to the left ventricle.',
    note: 'Best seen from the posterior view. The chamber cavity is omitted.',
  },
  {
    id: 'ventricular-wall',
    fma: 'FMA13884',
    name: 'Ventricular wall',
    sourceName: 'wall of ventricle',
    group: 'Heart walls',
    mapping: 'isa',
    color: '#ab6159',
    description: 'Muscular tissue surrounding the two lower pumping chambers of the heart.',
    note: 'The source combines both ventricular walls in a single mesh. They cannot be selected separately. Hide this wall to reveal the cavity surfaces.',
  },
  {
    id: 'right-ventricle',
    fma: 'FMA9291',
    name: 'Right ventricular cavity',
    sourceName: 'cavity of right ventricle',
    group: 'Ventricular cavities',
    color: '#b86661',
    description: 'The space inside the right ventricle, which pumps blood toward the lungs.',
    note: 'Shown as a solid surface representing the chamber space, not its wall. Isolate it or hide the ventricular wall to see it.',
  },
  {
    id: 'left-ventricle',
    fma: 'FMA9466',
    name: 'Left ventricular cavity',
    sourceName: 'cavity of left ventricle',
    group: 'Ventricular cavities',
    color: '#d28b72',
    description: 'The space inside the left ventricle, which pumps blood into the aorta.',
    note: 'Shown as a solid surface representing the chamber space, not its wall. Isolate it or hide the ventricular wall to see it.',
  },
  {
    id: 'ascending-aorta',
    fma: 'FMA3736',
    name: 'Ascending aorta',
    sourceName: 'ascending aorta',
    group: 'Great vessels',
    color: '#c37f6a',
    description: 'The aorta carries blood away from the heart to the body.',
    note: 'Only the ascending segment is included in this group.',
  },
  {
    id: 'aortic-arch',
    fma: 'FMA3768',
    name: 'Aortic arch',
    sourceName: 'arch of aorta',
    group: 'Great vessels',
    color: '#ca8d78',
    description: 'Part of the aorta, the main artery carrying blood from the heart.',
    note: 'This is the arch segment. Its branch vessels and the descending aorta are omitted.',
  },
  {
    id: 'pulmonary-trunk',
    fma: 'FMA8612',
    name: 'Pulmonary trunk',
    sourceName: 'pulmonary trunk',
    group: 'Great vessels',
    color: '#789aab',
    description: 'Carries blood from the right ventricle toward the lungs.',
    note: 'The pulmonary trunk is included; the left and right pulmonary artery trees are omitted.',
  },
  {
    id: 'superior-vena-cava',
    fma: 'FMA4720',
    name: 'Superior vena cava',
    sourceName: 'superior vena cava',
    group: 'Great vessels',
    color: '#8c9fab',
    description: 'One of the large veins returning blood from the body to the right atrium.',
    note: 'The inferior vena cava and pulmonary veins are not included in this selection.',
  },
  {
    id: 'left-coronary',
    fma: 'FMA50040',
    name: 'Left coronary artery',
    sourceName: 'left coronary artery',
    group: 'Coronary arteries',
    color: '#dfb58a',
    description:
      'Supplies the heart muscle, including parts of the left heart and ventricular septum.',
    note: 'Includes the source-mapped branches as one selectable tree. Small vessels are simplified.',
  },
  {
    id: 'right-coronary',
    fma: 'FMA50039',
    name: 'Right coronary artery',
    sourceName: 'right coronary artery',
    group: 'Coronary arteries',
    color: '#d4a777',
    description: 'Supplies the right atrium and parts of both ventricles.',
    note: 'Includes the source-mapped branches as one selectable tree. Small vessels are simplified.',
  },
]
export const groups = [
  'Heart walls',
  'Ventricular cavities',
  'Great vessels',
  'Coronary arteries',
] as const
export const byId = Object.fromEntries(structures.map((s) => [s.id, s]))
export type View = 'Anterior' | 'Posterior' | 'Left lateral'
export const tour: { id: string; title: string; text: string; view: View; isolate?: boolean }[] = [
  {
    id: 'right-atrium',
    title: 'Where blood arrives',
    text: 'Begin at the right atrial wall. Rotate the model to see how this chamber sits beside the right ventricle.',
    view: 'Anterior',
  },
  {
    id: 'pulmonary-trunk',
    title: 'Toward the lungs',
    text: 'Find the pulmonary trunk above the ventricles. Its blue color is an illustrative aid, not the color of the tissue.',
    view: 'Anterior',
  },
  {
    id: 'left-atrium',
    title: 'A different perspective',
    text: 'Turn to the back of the heart to find the left atrial wall. The pulmonary veins are not included in this model selection.',
    view: 'Posterior',
  },
  {
    id: 'left-ventricle',
    title: 'Look a little closer',
    text: 'The left ventricular cavity is isolated here. This surface represents the space inside the chamber. Restore all to see its surrounding wall.',
    view: 'Anterior',
    isolate: true,
  },
  {
    id: 'left-coronary',
    title: 'The heart’s own supply',
    text: 'Follow the coronary branches across the surface. These vessels supply the heart muscle itself.',
    view: 'Anterior',
  },
]
