import SpatialHash from 'spatial-hash'

export class SpatialTable {
  hash = new SpatialHash(
    {
      x: 0,
      y: 0,
      width: 4096,
      height: 4096,
    },
    16
  )
  constructor() {}
}
