class SparseArray<T> {

  __sparseArray = new Map<number, Array<T>>()

  get length(): number {
    return this.__size()
  }

  get(index: number): T | null {
    for (const key of this.__sparseArray.keys()) {
      const array: Array<T> | undefined = this.__sparseArray.get(key)
      if (index >= key && array && index < (key + array.length)) {
        return array[index - key]
      }
    }
    return null
  }

  findIndex(predicate: (value: T, index: number, obj: T[]) => unknown): number {
    for (const key of this.__sparseArray.keys()) {
      const array: Array<T> | undefined = this.__sparseArray.get(key)
      if (array && array.length > 0) {
        for (let i = 0; i < array.length; i++) {
          const v = array[i]
          const ret = predicate(v, key + i, array)
          if (ret) {
            return key + i
          }
        }
      }
    }
    return -1
  }

  splice(index: number, deleteCount: number, data: Array<T>): T[] {
    if (this.__sparseArray.size <= 0) {
      if (data instanceof Array) {
        this.__sparseArray.set(index, data)
      } else {
        this.__sparseArray.set(index, [data])
      }
      return data
    }
    for (const key of this.__sparseArray.keys()) {
      const array: Array<T> | undefined = this.__sparseArray.get(key)
      if (index >= key && array && index <= (key + array.length)) {
        return array.splice(index - key, deleteCount, ...data);
      }
    }
    this.__sparseArray.set(index, data)
    return data
  }

  push(data: Array<T>): number {
    let maxKey = -1;
    for (const key of this.__sparseArray.keys()) {
      if (key > maxKey) {
        maxKey = key
      }
    }
    if (maxKey != -1) {
      const array: Array<T> | undefined = this.__sparseArray.get(maxKey)
      if (array) {
        array.push(...data)
        return data.length
      }
    } else {
      this.__sparseArray.set(0, data)
      return data.length
    }
    return -1
  }

  __size(): number {
    let maxKey = -1;
    for (const key of this.__sparseArray.keys()) {
      if (key > maxKey) {
        maxKey = key
      }
    }
    if (maxKey != -1) {
      const array: Array<T> | undefined = this.__sparseArray.get(maxKey)
      if (array) {
        return maxKey + array.length
      }
    }
    return -1
  }

  clear(): void {
    this.__sparseArray.clear()
  }

  dump() {
    console.log("=================START======================>>>>>")
    for (const key of this.__sparseArray.keys()) {
      const array: Array<T> | undefined = this.__sparseArray.get(key)
      console.log("key: ", key, " value: ", JSON.stringify(array))
    }
    console.log("==================END=====================>>>>>")
  }
}

export default SparseArray
