////////////////////////////////////////////////////////////////////////////////
// Carbon-FSM - A generic, lightweight and powerful Finite State Machine
// Author: HydroCarbons@outlook.com
////////////////////////////////////////////////////////////////////////////////

var { FiniteStateMachine } = require('../src/index.js')
var { PromiseWrapper } = require('../src/PromiseWrapper.js')

////////////////////////////////////////////////////////////////////////////////
function DataPipelineApp() {

  var dataPipeline = "11 3 2323 545 45 435 5 435 453 0 32 4 5 57 7 6 9238 9 1 4 -1 3 2301 2 93 239"

  var fsm_data = {
    _data: {
      max: -1,
      min: 999999,
      current: -1
    },
    _initialState: "init",

    init: {
      on: async function(data) {
        console.log("Initialized")
      },
      start: "process" },

    process: {
      on: async function(data) {

        function asyncProcessing(resolve, reject) {
          setTimeout(
              function() {
                console.log(">", data.current, "\t\t\t", "Max : " + data.max, "\t", "Min : " + data.min)
                if(data.max < data.current) data.max = data.current
                if(data.min > data.current) data.min = data.current
                resolve()
              }, 100)
        }
        await PromiseWrapper(asyncProcessing)
      },
      done: "done",
      next: "process",
      error: "error" },

    done: {
      on: async function(data) {
          console.log("Max : " + data.max, "\t", "Min : " + data.min)
      },
      type: "final" },

    error: {
        on: async function(data) {
        },
        type: "timer", timer_over: "$last_state", timer_duration: 500 }
    }

    var FSM = new FiniteStateMachine(fsm_data)
    var next

    async function run() {

      await FSM.send("start")

      let i = 0
      let dataArray = dataPipeline.split(' ').filter(x=>x)
      do {
        let num = parseInt(dataArray[i++])
        if(isNaN(num)) {
          next = await FSM.send("done")
        } else {
          fsm_data._data.current = num
          next = await FSM.send("next")
        }
      } while (next !== "FINAL")

      console.log( "Final State :", FSM.currentState() )
      console.log( "Data" )
      console.log( JSON.stringify( FSM.Data(), null, 2) )
      FSM.displayHistory()
      // FSM.displayStateTransitionDiagram()
    }
    run()
}

DataPipelineApp()
