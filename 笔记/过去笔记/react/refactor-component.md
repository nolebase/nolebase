# 重构组件

```js
import React from 'react';
import './style.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastClickedButton: '',
    };
  }

  render() {
    return (
      <div>
        <hl>I am {this.state.lastClickedButton}ing</hl>
        <ul>
          <li>
            <button
              onClick={() => {
                this.setState({ lastClickedButton: 'Create' });
                // this.props.createSomething();
              }}
              className="my-button"
            >
              Create
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                this.setState({ lastClickedButton: 'Read' });
                //  this.props.readSomething();
              }}
              className="my-button"
            >
              Read
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                this.setState({ lastClickedButton: 'Update' });
                //  this.props.updateSomething();
              }}
              className="my-button"
            >
              Update
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                this.setState({ lastClickedButton: 'Destroy' });
                //  this.props.destroySomething();
              }}
              className="my-button"
            >
              Destroy
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default App;
```

```js
import React, { useState } from 'react';
import './style.css';

const App = (props) => {
  const [lastClickedButton, setLastClickedButton] = useState('');

  return (
    <div>
      <hl>I am {lastClickedButton}ing</hl>
      <ul>
        <li>
          <button
            onClick={() => {
              setLastClickedButton('Create');
              // createSomething();
            }}
            className="my-button"
          >
            Create
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setLastClickedButton('Read');
              //  readSomething();
            }}
            className="my-button"
          >
            Read
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setLastClickedButton('Update');
              //  updateSomething();
            }}
            className="my-button"
          >
            Update
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setLastClickedButton('Destroy');
              //  this.props.destroySomething();
            }}
            className="my-button"
          >
            Destroy
          </button>
        </li>
      </ul>
    </div>
  );
};

export default App;

```
