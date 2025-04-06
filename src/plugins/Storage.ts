class MyStorage {
  getValue = (key: string, defValue: string) => {
    const value = localStorage.getItem(key)
    if (value !== null) {
      console.log('localStorage getValue ' + key + ' ' + value)
      return value
    }
    console.log('localStorage getDefValue ' + key + ' ' + defValue)
    return defValue
  }

  getNumber = (key: string, defValue: number) => {
    return Number(this.getValue(key, String(defValue)))
  }

  getBool = (key: string, defValue: boolean) => {
    return Number(this.getValue(key, defValue ? '1' : '0')) !== 0
  }

  setValue = (key: string, value: string) => {
    console.log('localStorage setValue ' + key + ' ' + value)
    localStorage.setItem(key, value)
  }

  setNumber = (key: string, value: number) => {
    this.setValue(key, String(value))
  }

  setBool = (key: string, value: boolean) => {
    this.setValue(key, value ? '1' : '0')
  }
}

export default MyStorage
