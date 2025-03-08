import Model from "../../Model"

interface Level {
  value: number
  label: string
}

const mockLevels : Level[] = [
  { value: 0, label: 'Level 1' },
  { value: 3, label: 'Level 2' },
  { value: 6, label: 'Level 3' },
]

class Levels {
  items : Level[] = mockLevels
  constructor(private model: Model) {
    this.model = model
  }

  addLevel(level: Level) {
    this.items.push(level)
  }

  getLevels() {
    return this.items
  }

  getLevel(value: number) {
    return this.items.find(level => level.value === value)
  }  
}

export default Levels
