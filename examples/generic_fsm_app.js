////////////////////////////////////////////////////////////////////////////////
// Carbon-FSM - A generic, lightweight and powerful Finite State Machine
// Author: HydroCarbons@outlook.com
////////////////////////////////////////////////////////////////////////////////

var { FiniteStateMachine } = require('../src/index.js')
var { PromiseWrapper } = require('../src/PromiseWrapper.js')

////////////////////////////////////////////////////////////////////////////////
function GenericFSMApp() {
  var myApp = {
    // App Specific Data
    _data: { counter: 0 },
    _initialState: "STATE_A",
    // State and Event table
    // format
    //   STATE_NAME : { STATE_DATA }
    //      STATE_DATA = on is main function to execute on entering the state
    //                 = TRANSITIONS = { EVENT_NAME : STATE_NAME }
    STATE_A: {
      //
      on: async function(data) {
        console.log("Processing A")

        function asyncProcessing(resolve, reject) {
          setTimeout(
            function(){
              console.log(".")
              resolve()
            },3000)
        }
        await PromiseWrapper(asyncProcessing)
        data.counter++
        console.log('A done')
      },
      //
      EVENT_B: "STATE_B",
      EVENT_C: "STATE_C",
      EVENT_D: "STATE_D",
      EVENT_E: "STATE_E",
      EVENT_F: "STATE_F",
      EVENT_FINAL: "STATE_FINAL",
      EVENT_ERROR: "STATE_ERROR" },

    STATE_B: {
      on: async function(data) {
        console.log("Processing B")
        data.counter++
      },
      EVENT_C: "STATE_C",
      EVENT_A: "STATE_A",
      EVENT_E: "STATE_E",
      EVENT_ERROR: "STATE_ERROR" },

    STATE_C: {
      on: async function(data) {
        console.log("Processing C")
        data.counter++
      },
      EVENT_A: "STATE_A",
      EVENT_B: "STATE_B",
      EVENT_F: "STATE_F",
      EVENT_FINAL: "STATE_FINAL",
      EVENT_ERROR: "STATE_ERROR" },

    STATE_D: {
      EVENT_A: "STATE_A",
      EVENT_B: "STATE_B",
      EVENT_C: "STATE_C",
      EVENT_FINAL: "STATE_FINAL",
      EVENT_ERROR: "STATE_ERROR" },

    STATE_ERROR: {
      on: async function(data) {
        console.log("Processing Error")
        //data.counter++
      },
      type: "timer", timer_duration: 1000, timer_over: "$last_state" },

    STATE_E: {
      on: async function(data) {
        console.log("Processing E")
        data.counter++
      },
      type: "timer", timer_duration: 1000, timer_over: "$initial_state"},

    STATE_F: {
      on: async function(data) {
        console.log("Processing F")
        data.counter++
      },
      type: "timer", timer_duration: 1000, timer_over: "STATE_C"},

    STATE_FINAL: {
      on: async function(data) {
        console.log("Processing completed. Data : ", data.counter)
      },
      type: "final"}
  }

  ////////////////////////////////////////////////////////////////////////////////

  var FSM = new FiniteStateMachine(myApp)

    //FSM.displayCurrentState(10)
    async function run() {
      var res
      /*res = await FSM.send("EVENT_C")
      res = await FSM.send("EVENT_F")
      res = await FSM.send("EVENT_ERROR")
      res = await FSM.send("EVENT_E")
      res = await FSM.send("EVENT_F")*/

      function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }

      function generateRandomEvent() {
        var events = ['A','B','C','D','E','F','ERROR', 'FINAL']
        return 'EVENT_' + events[getRandomInt(events.length)]
      }

      for(var i=0; i<10; i++) {
        res = await FSM.send( generateRandomEvent() )
      }

      console.log( "Final State :", FSM.currentState() )
      console.log( "Data : \n", JSON.stringify( FSM.Data(), null, 4) )
      FSM.displayHistory()
      FSM.displayStateTransitionDiagram()
    }

    run()
}
GenericFSMApp()
////////////////////////////////////////////////////////////////////////////////
