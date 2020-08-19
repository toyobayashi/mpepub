/**
 * @template T
 * @param {(options: { success?: (res: T) => any; fail?: (err: any) => any; complete?: () => any; [option: string]: any }) => any} fun - function
 * @returns {(options: { [option: string]: any }) => Promise<T>}
 */
function promisify (fun, ctx) {
  return function (obj) {
    const success = obj.success
    const fail = obj.fail
    const complete = obj.complete
    let promise = new Promise((resolve, reject) => {
      obj.success = resolve
      obj.fail = reject
      fun.call(ctx || this, obj)
    })

    if (typeof success === 'function') {
      promise = promise.then(success)
    }

    if (typeof fail === 'function') {
      promise = promise.catch(fail)
    }

    if (typeof complete === 'function') {
      promise = promise.then(complete)
    }

    return promise
  }
}

module.exports = {
  promisify
}
