////////////////////////////////////////////////////////////////////////////////
// Carbon-FSM - A generic, lightweight and powerful Finite State Machine
// Author: HydroCarbons@outlook.com
////////////////////////////////////////////////////////////////////////////////

module.exports.PromiseWrapper = async function(fnToWrap) {
  return new Promise( (resolve, reject) => {
    return fnToWrap(resolve, reject)
  })
}
