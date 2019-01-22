////////////////////////////////////////////////////////////////////////////////
// Carbon-FSM - A generic, lightweight and powerful Finite State Machine
// Author: HydroCarbons@outlook.com
////////////////////////////////////////////////////////////////////////////////
var assert = require('assert')

var { FiniteStateMachine } = require('../src/index.js')
var { PromiseWrapper } = require('../src/PromiseWrapper.js')

////////////////////////////////////////////////////////////////////////////////
function DataPipelineApp() {

  var dataPipeline = "11 3 2323 545 45 435 5 435 453 0 32 4 5 57 7 6 9238 9 1 4 -1 3 2301 2 93 239"

  var fsm_data = {
    _data: {
      count: 0,
      current: "",
      error: ""
    },
    _initialState: "init",

    init: {
      on: async function(data) {
        //console.log("State Init")
      },
      done: "done",
      start: "process",
      error: "error" },

    process: {
      on: async function(data) {
        //console.log("State Process :: Count :", data.count)
        function asyncProcessing(resolve, reject) {
          setTimeout(
              function() {
                data.count++;
                resolve()
              }, 100)
        }
        await PromiseWrapper(asyncProcessing)
      },
      done: "done",
      next: "process",
      timer_state_go_back_to_initial: "timer_state_go_back_to_initial",
      timer_state_go_back_to_last: "timer_state_go_back_to_last",
      error: "error" },

    timer_state_go_back_to_initial: {
        type: "timer", timer_over: "$initial_state", timer_duration: 1000
      },

    timer_state_go_back_to_last: {
        type: "timer", timer_over: "$last_state", timer_duration: 1000
      },

    done: {
      on: async function(data) {
          console.log("State Done :: Count :", data.count)
      },
      type: "final",
      error: "error" },

    error: {
        on: async function(data) {
          //console.log("State Error");
        },
        type: "timer", timer_over: "$last_state", timer_duration: 500 }
    }

    var FSM = new FiniteStateMachine(fsm_data)
    var next
    var res

    async function run() {

      console.log("TEST: Sending an invalid event to FSM")
      res = await FSM.send("SENDING_INVALID_STATE").catch( e => {
          console.log(e)
        })
        assert(res === 'ERROR_NOOP_EVENT')
        console.log("\t", res, "[Passed]")
        assert("init" === FSM.currentState() )

      console.log("TEST: Sending an undefined event to FSM")
      res = await FSM.send().catch( e => {
          console.log(e)
        })
        assert(res === 'ERROR_NOOP_EVENT')
        console.log("\t", res, "[Passed]")
        assert("init" === FSM.currentState() )

      console.log("TEST: Sending init event to FSM")
      res = await FSM.send("init").catch( e => {
          console.log(e)
        })
        assert(res === 'ERROR_NOOP_EVENT')
        console.log("\t", res, "[Passed]")
        assert("init" === FSM.currentState() )

      console.log("TEST: Sending start event to FSM")
      res = await FSM.send("start").catch( e => {
          console.log(e)
        })
        assert(res === 'OK_STATE_TRANSITIONED_TO_process')
        console.log("\t", res, "[Passed]")
        assert("process" === FSM.currentState() )

      console.log("TEST: Sending timer event to FSM with 1 sec delay and to revert back to init")
      res = await FSM.send("timer_state_go_back_to_initial").catch( e => {
          console.log(e)
        })
        assert(res === 'OK_STATE_TRANSITIONED_TO_timer_state_go_back_to_initial')
        console.log("\t", res, "[Passed]")
        assert("init" === FSM.currentState() )

      console.log("TEST: Sending error event to FSM")
      res = await FSM.send("error").catch( e => {
          console.log(e)
        })
        assert(res === 'OK_STATE_TRANSITIONED_TO_error')
        console.log("\t", res, "[Passed]")
        assert("init" === FSM.currentState() )

      console.log("TEST: Sending start event to FSM")
      res = await FSM.send("start").catch( e => {
          console.log(e)
        })
        assert(res === 'OK_STATE_TRANSITIONED_TO_process')
        console.log("\t", res, "[Passed]")
        assert("process" === FSM.currentState() )

      console.log("TEST: Sending timer event to FSM with 1 sec delay and to revert back to last state")
      res = await FSM.send("timer_state_go_back_to_last").catch( e => {
          console.log(e)
        })
        assert(res === 'OK_STATE_TRANSITIONED_TO_timer_state_go_back_to_last')
        console.log("\t", res, "[Passed]")
        assert("process" === FSM.currentState() )

      console.log("TEST: Sending done event to FSM")
      res = await FSM.send("done").catch( e => {
          console.log(e)
        })
        assert(res === 'OK_STATE_TRANSITIONED_TO_done')
        console.log("\t", res, "[Passed]")
        assert("done" === FSM.currentState() )

      console.log("TEST: Sending init again to FSM. It must not transition to init as it is final state.")
      res = await FSM.send("init").catch( e => {
          console.log(e)
        })
        assert(res === 'OK_STATE_FINAL')
        console.log("\t", res, "[Passed]")
        assert("done" === FSM.currentState() )

        console.log("\nAll test passed.")
    }
    run()
}

DataPipelineApp()
