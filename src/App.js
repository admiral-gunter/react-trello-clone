import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

  const [dataTasks, setdataTasks] = useState({
    "TODO": [{
      "id": 1,
      "title": "doing",
      "ket": "something something"
    }],
    "IN_PROGRESS": [],
    "DONE": [],
    "BACKLOG": []
  });

  const [draggedElement, setDraggedElement] = useState(null);

  const [oldStsTask, setOldStsTaskt] = useState(null)
  const [oldIdxTask, setOldIdxTask] = useState(null)

  const handleDragStart = (e, element, stsTask, idxTask) => {

    setOldStsTaskt(stsTask)

    setOldIdxTask(idxTask)

    setDraggedElement(element);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStsTask) => {
    e.preventDefault();
    if (draggedElement) {



      if (oldStsTask && oldIdxTask) {
        const newdataTasks = { ...dataTasks };

        // Make sure to copy the array before modifying it
        newdataTasks[oldStsTask] = [...newdataTasks[oldStsTask]];


        // Update the state
        setdataTasks(newdataTasks);
      }

      const newdataTasks = { ...dataTasks };

      // Remove the element from the original array
      newdataTasks[oldStsTask].splice(oldIdxTask, 1);
      newdataTasks[newStsTask].push(draggedElement);

      setdataTasks(newdataTasks)

      // alert(`Dropped element: ${draggedElement}`);
      setDraggedElement(null);

    }
  };


  const TaskStyle = { background: 'white', padding: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', margin: '15px' }
  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          style={{ background: 'white', width: '20%', height: '100vh', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "TODO")}
          id="TODO"
        >
          {dataTasks.TODO.map((item, index) => (
            // Each child in a list should have a unique "key" prop
            // <li key={index}>{item}</li>
            <div
              key={index}
              style={TaskStyle}
              draggable
              onDragStart={(e) => handleDragStart(e, item, "TODO", index)}
            >
              <input value={item.title} />
            </div>
          ))}


          <button>+</button>
        </div>

        <div
          style={{ background: 'lightblue', width: '20%', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "IN_PROGRESS")}
          id="IN-PROGRESS"
        >
          {dataTasks.IN_PROGRESS.map((item, index) => (
            // Each child in a list should have a unique "key" prop
            // <li key={index}>{item}</li>
            <div
              key={index}
              style={TaskStyle}
              draggable
              onDragStart={(e) => handleDragStart(e, item, "IN_PROGRESS", index)}
            >
              <input value={item.title} />
            </div>
          ))}
          <button>+</button>
        </div>

        <div
          style={{ background: 'palegreen', width: '20%', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "DONE")}
          id="DONE"
        >
          {dataTasks.DONE.map((item, index) => (
            // Each child in a list should have a unique "key" prop
            // <li key={index}>{item}</li>
            <div
              key={index}
              style={TaskStyle}
              draggable
              onDragStart={(e) => handleDragStart(e, item, "DONE", index)}
            >
              <input value={item.title} />
            </div>
          ))}
        </div>

        <div
          style={{ background: 'pink', width: '20%' }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "BACKLOG")}
        >
          {dataTasks.BACKLOG.map((item, index) => (
            // Each child in a list should have a unique "key" prop
            // <li key={index}>{item}</li>
            <div
              key={index}
              style={TaskStyle}
              draggable
              onDragStart={(e) => handleDragStart(e, item, "BACKLOG", index)}
            >
              <input value={item.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
