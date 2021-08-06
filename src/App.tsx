import React from "react";
import List from './list'
import AddTask from './addTask'
import DiffTest from './diffTest'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const App = () => {
 
  return (
   
      <div className='main-content'>
        <Router>
          <Switch>
            <Route exact path="/">
              <AddTask />
              <List />
            </Route>
            <Route exact path="/diff-test">
              <DiffTest/>
            </Route>
          </Switch>
        </Router>
      </div>
    
  );
};

export default App;
