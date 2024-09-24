import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

function App() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const datepickerRef = useRef(null);

  // Format date as "MONTH NAME DATE"
  const formattedDate = format(selectedDate, "MMMM dd");

  const [dataTasks, setdataTasks] = useState({
    "TODO": [{
      "id": 1,
      "title": "doing",
      "ket": "something something",
      "duedt": new Date()
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


  function generateUniqueID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 12; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  // const uniqueID = generateUniqueID();
  // console.log(uniqueID); // Example output: "A1bC2dE3fG4"


  const createNewTask = (e, stsTask) => {
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const now = new Date();
    console.log(formatDate(now));


    const newdataTasks = { ...dataTasks };

    newdataTasks[stsTask].push({
      "id": generateUniqueID(),
      "title": "",
      "ket": "",
      "duedt": null,
      "created_dt": formatDate(now),
      "changed_dt": formatDate(now),
    });

    setdataTasks(newdataTasks)
  }


  const chgTitle = (e, stsTask, index) => {

    const newdataTasks = { ...dataTasks };

    // Remove the element from the original array
    newdataTasks[stsTask][index]['title'] = e;


    setdataTasks(newdataTasks)

  }

  const AddTaskBtnStyle = { fontWeight: 'bold', fontSize: '24px', cursor: 'pointer' }

  const statusTasks = [{ 'bg': 'white', 'sts': 'TODO' }, { 'bg': 'lightblue', 'sts': 'IN_PROGRESS' }, { 'bg': 'palegreen', 'sts': 'DONE' }, { 'bg': 'pink', 'sts': 'BACKLOG' }]

  const TaskStyle = { background: 'white', padding: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', margin: '15px' }
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>


        {
          statusTasks.map((itemSts, idxSts) => {
            return (<div
              style={{ background: itemSts.bg, width: '20%', height: '100vh', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, itemSts.sts)}
              id={itemSts.sts}
              key={idxSts}
              onMouseEnter={() => setHoveredIndex(idxSts)}
              onMouseLeave={() => setHoveredIndex(null)}

            >
              {dataTasks[itemSts.sts].map((item, index) => (

                <div
                  key={index}
                  style={TaskStyle}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, itemSts.sts, index)}
                >
                  <input onChange={(e) => chgTitle(e.target.value, itemSts.sts, index)} value={item.title} />

                  <div>
                    <span
                      onClick={() => datepickerRef.current.setOpen(true)}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      {formattedDate}
                    </span>

                    <DatePicker
                      selected={item.duedt}
                      onChange={(date) => {
                        const updatedTasks = dataTasks[itemSts.sts].map((task, i) =>
                          i === index ? { ...task, duedt: new Date(date) } : task
                        );

                        setdataTasks({
                          ...dataTasks,
                          [itemSts.sts]: updatedTasks
                        });
                      }}
                      dateFormat="MMMM dd"
                      ref={datepickerRef} // Use ref instead of document.getElementById
                      customInput={<></>} // Hide native input field
                    />
                  </div>
                </div>
              ))}


              {hoveredIndex === idxSts && (
                <span style={AddTaskBtnStyle} onClick={(e) => createNewTask(e, itemSts.sts)}>+ <span style={{ fontSize: 'small' }}>add task</span> </span>
              )}
            </div>);
          })
        }
      </div>
    </div>
  );
}

export default App;
