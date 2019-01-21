# carbon-fsm

## Travis CI
[![Build Status](https://travis-ci.com/HydroCarbons/carbon-fsm.svg?branch=master)](https://travis-ci.com/HydroCarbons/carbon-fsm)
[![Downloads](https://img.shields.io/npm/dm/carbon-fsm.svg)](https://www.npmjs.org/package/carbon-fsm)

## Carbon FSM is a lightweight but powerful finite state machine for JavaScript/nodejs

## Installation
` npm install carbon-fsm --save `

## Usage
```javascript
    const { FiniteStateMachine } = require("carbon-fsm");
```
### Create an instance of Carbon-FSM and pass your finite state machine config as argument
```javascript
    var FSM = new FiniteStateMachine(myAppConfig)
```

### Dispatch your application event to transition to next state as per the your application engine
```javascript
    await FSM.send("EVENT_NAME")
```

### Display Current State of the FSM
```javascript
    FSM.currentState()
```

### Display your application data's state in the FSM
```javascript
    FSM.Data()
```

### Display state transition history in the FSM
```javascript
    FSM.displayHistory()
```

### Display state transition diagram in the FSM
```javascript
    FSM.displayStateTransitionDiagram()
```

### Display current of the FSM repeatedly
```javascript
    FSM.displayCurrentState( frequencyInMillseconds )
```

## Application Engine Configuration

```javascript

    var myAppEngineConfiguration = {
      // App Specific Data
      _data: {},

      _initialState: "STATE_A",
      // State and Event table
      // format
      //   STATE_NAME : { STATE_DATA }
      //      STATE_DATA = on is main function to execute on entering the state
      //                 = TRANSITIONS = { EVENT_NAME : STATE_NAME }
      STATE_A: {
          // State processing function
          on: async function(data) {
            console.log("Processing A")
            // do something with your data
          },
          // Event to State Transition Map
          EVENT_B: "STATE_B",
          EVENT_C: "STATE_C",
          ...
          EVENT_F: "STATE_F",
          EVENT_FINAL: "STATE_FINAL",
          EVENT_ERROR: "STATE_ERROR" },

      STATE_ERROR: {
          on: async function(data) {
            /* do something with the error scenario */
          },
          // Special type of state marked with "timer" type
          // special type of the state which will auto transition after timer is over
          type: "timer", timer_duration: 1000, timer_over: "$last_state" },

      STATE_E: {
          on: async function(data) {
            /* */
          },
          type: "timer", timer_duration: 1000, timer_over: "$initial_state"},

      STATE_FINAL: {
          on: async function(data) {
            /* */
          },
          // Special type of state marked with "final" type
          type: "final" }
    }

```

# Examples
Check out data pipeline processing and a generic FSM app in the examples folder.

# Contributing
You can contribute to this project with issues or pull requests.

# Contact
If you have any ideas, feedback, requests or bug reports, you can reach me at hydrocarbons@outlook.com.
