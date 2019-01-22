////////////////////////////////////////////////////////////////////////////////
// Carbon-FSM - A generic, lightweight and powerful Finite State Machine
// Author: HydroCarbons@outlook.com
////////////////////////////////////////////////////////////////////////////////
/// Finite State Machine
///   Send the details of the states, processing logic and transitions while creating the instance of this fsm
///
////////////////////////////////////////////////////////////////////////////////
class FiniteStateMachine {
  constructor(fsm) {
    if(typeof fsm !== 'undefined') {
      this.fsm = fsm
      this.initial = this.fsm._initialState
      this.current = this.fsm._initialState
      this.last = this.fsm._initialState
      this.data = this.fsm._data
      this.history = []
      this.history.push({ timestamp: Date.now(), current: " ", event: "(fsm-init)", next: this.current })
    }
    else {
      throw new Error( "Application Engine Configuration missing" )
    }
  }

  currentState() {
    return this.current
  }

  Data() {
    return this.data
  }

  async send(event) {
    return new Promise(function(resolve, reject) {
        if(typeof this.fsm === 'undefined') {
          reject( new Error( "Application Engine Configuration missing" ) )
          return
        }
        var current_state = this.fsm[this.current]

        async function stateProcessor(_this_) {
          //console.log("\n", current_state )
            if(typeof current_state === 'undefined') {
              resolve('ERROR_STATE_NONEXISTING')
              return
            }

            if(typeof current_state.on === 'function')  {
              await current_state.on( _this_.data )
            }

            if(current_state.type !== 'final')
              postStateProcessing.bind( _this_ )()
            else
              resolve('OK_STATE_FINAL')
        }
        stateProcessor(this)

        function postStateProcessing() {
          if(typeof current_state === 'undefined') {
              resolve("ERROR_STATE_INVALID")
              return
          }

          if(typeof current_state[event] === 'undefined') {
              //var errorMsg = `Warning: invalid event [${event}] on [${this.current}] state so ignoring it....`
              //console.log(errorMsg)
              resolve("ERROR_NOOP_EVENT")
              return
          }

          if(current_state.type !== "timer") {
              //console.log("\tXing to",  current_state[event])
              async function asyncTransitionToState(_this_) {
                  await transitionToState(current_state[event], event, _this_)
                  resolve("OK_STATE_TRANSITIONED_TO_" + current_state[event] )
              }
              asyncTransitionToState(this)
              return
          }

          function transitionToState(next, _event, _this_) {
              return new Promise(function(resolveX2S, rejectX2S) {
                  _this_.history.push({ timestamp: Date.now(), current: _this_.current, event: _event, next: next })
                  _this_.last = _this_.current
                  _this_.current = next

                  var current_state = _this_.fsm[_this_.current]
                  if(typeof current_state === 'undefined') {
                    resolveX2S('ERROR_STATE_INVALID')
                    return
                  }
                  if(current_state.type === "timer") {
                      setTimeout(async function(){
                        let current_state = _this_.fsm[_this_.current]
                        if(current_state.timer_over==='$last_state') {
                          transitionToState(_this_.last, "timer_over", _this_)
                          resolveX2S("OK_STATE_TIMER_OVER")
                        } else if(current_state.timer_over==='$initial_state') {
                          transitionToState(_this_.initial, "timer_over", _this_)
                          resolveX2S("OK_STATE_TIMER_OVER")
                        }
                        else {
                          transitionToState(current_state.timer_over, "timer_over", _this_)
                          resolveX2S("OK_STATE_TIMER_OVER")
                        }
                      }.bind(_this_), current_state.timer_duration)
                  } else {
                    resolveX2S('OK_STATE_TRANSITIONED')
                  }
              }.bind(_this_))
          }
        }
    }.bind(this))
  }

  displayHistory() {
    console.log("\n[History]")
    console.log(".".repeat(80))
    var st
    this.history.sort().forEach( (item) => {
      if( item.event === "(fsm-init)") {
        st = item.timestamp
        console.log(" ".repeat(4) + "0.00 sec " + "\t\t" + " ".repeat(10) + item.event + " => [ " + item.next + " ] ")
      } else {
        var diff = Math.round( (item.timestamp - st)/10 )/100
        console.log(" ".repeat(4) + diff + " sec \t\t" + " ".repeat(10) + item.event + " @ " + item.current + " => [ " + item.next + " ] ")
      }
    })
    console.log(".".repeat(80))
  }

  displayStateTransitionDiagram() {
    console.log("\n[State Transition Diagram]")
    var state_diagram = ""
    this.history.sort().forEach( (item) => {
      if( item.event === "(fsm-init)") {
        state_diagram += " (" + item.event + ") => " + item.next + " "
      } else {
        state_diagram += " (" + item.event + ") => " + item.next + " "
      }
    })
    console.log(state_diagram)
    return state_diagram
  }

  displayCurrentState(interval) {
    var last_state
    var st = Date.now()
    setInterval(function() {
      var current_state = this.currentState()
      if(last_state != current_state) {
        var et = Date.now()
        console.log("\n// Current state status : " + (et-st)/1000 + " secs [State : " + current_state + "] //\n")
        last_state = current_state
      }
    }.bind(this), interval)
  }

}
////////////////////////////////////////////////////////////////////////////////

module.exports = {FiniteStateMachine}

////////////////////////////////////////////////////////////////////////////////
