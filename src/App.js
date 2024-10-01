import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef, createRef } from 'react';
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

function App() {

  document.addEventListener("dragstart", function (event) {
    event.dataTransfer.setDragImage(event.target, window.outerWidth, window.outerHeight);
  }, false);

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

  const [oldStsTask, setOldStsTaskt] = useState(null);
  const [oldIdxTask, setOldIdxTask] = useState(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const [widthDrag, setWidthDrag] = useState();



  const handleDragStart = (e, element, stsTask, idxTask) => {
    // e.currentTarget.offsetWidth;
    setWidthDrag(e.currentTarget.offsetWidth);
    setOldStsTaskt(stsTask);
    setOldIdxTask(idxTask);
    setDraggedElement(element);
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setMousePosition({ x: e.clientX, y: e.clientY });
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

      setdataTasks(newdataTasks);
      setDraggedElement(null);
      setIsDragging(false); // Stop dragging after dropping
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
    const uiqid = generateUniqueID();

    newdataTasks[stsTask].push({
      "id": uiqid,
      "title": "",
      "ket": "",
      "duedt": new Date(),
      "created_dt": formatDate(now),
      "changed_dt": formatDate(now),
    });

    setdataTasks(newdataTasks);
  };

  const chgTitle = (e, stsTask, index) => {
    const newdataTasks = { ...dataTasks };
    newdataTasks[stsTask][index]['title'] = e;
    setdataTasks(newdataTasks);
  };

  const AddTaskBtnStyle = { fontWeight: 'bold', fontSize: '24px', cursor: 'pointer' };

  const statusTasks = [{ 'bg': 'white', 'sts': 'TODO' }, { 'bg': 'lightblue', 'sts': 'IN_PROGRESS' }, { 'bg': 'palegreen', 'sts': 'DONE' }, { 'bg': 'pink', 'sts': 'BACKLOG' }];

  const TaskStyle = { background: 'white', padding: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', margin: '15px', position: 'relative' };

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [taskHoveredIndex, setTaskHoveredIndex] = useState(null);
  const [delTaskIdx, setDelTaskIdx] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const inputDtRef = useRef({
    "TODO": dataTasks.TODO.map(() => createRef()),
    "IN_PROGRESS": dataTasks.IN_PROGRESS.map(() => createRef()),
    "DONE": dataTasks.DONE.map(() => createRef()),
    "BACKLOG": dataTasks.BACKLOG.map(() => createRef()),
  });

  const [isOpen, setIsOpen] = useState({ 'sts': '', 'id': '' });

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}
        onDragOver={handleDragOver}
      >
        {statusTasks.map((itemSts, idxSts) => (
          <div
            style={{ background: itemSts.bg, width: '20%', height: '100vh', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
            onDrop={(e) => handleDrop(e, itemSts.sts)}
            id={itemSts.sts}
            key={idxSts}
            onMouseEnter={() => setHoveredIndex(idxSts)}
            onMouseLeave={() => setHoveredIndex(null)}
          >

            <div
              style={{ fontWeight: 'bold', background: 'white', padding: '1% 0 1% 0', color: 'gray' }}
            >
              {itemSts.sts.replace('_', ' ')}
            </div>
            {dataTasks[itemSts.sts].map((item, index) => (
              <div
                className={deletingTask === item.id ? 'fade-out' : 'fade-in'}
                key={index}
                style={{ ...TaskStyle, display: isDragging == item.id ? 'none' : 'block' }}
                draggable
                onDragStart={(e) => handleDragStart(e, item, itemSts.sts, index)}
                onDragEnd={(e) => {
                  setIsDragging(null);
                  setDraggedElement(null)
                }}
                onMouseEnter={() => setTaskHoveredIndex(item.id)}
                onMouseLeave={() => setTaskHoveredIndex(null)}
              >
                {taskHoveredIndex === item.id && (
                  <span
                    onMouseEnter={() => setDelTaskIdx(index)}
                    onMouseLeave={() => setDelTaskIdx(null)} style={{ zIndex: '2', position: 'absolute', right: 5, top: 0 }}
                    onClick={(e) => {
                      setDeletingTask(item.id);
                      setTimeout(() => {
                        const newdataTasks = { ...dataTasks };
                        newdataTasks[itemSts.sts].splice(index, 1);
                        setdataTasks(newdataTasks);
                        setDeletingTask(null);
                      }, 500);
                    }}
                  >
                    <span style={{ fontSize: 'small', fontWeight: 'bold', color: 'red', cursor: 'pointer', fontSize: delTaskIdx === index ? 'medium' : 'small' }}>Delete</span>
                  </span>
                )}
                <div style={{ marginTop: '5%' }}></div>
                <input className='form-control' onChange={(e) => chgTitle(e.target.value, itemSts.sts, index)} value={item.title} />
                <div>
                  <span style={{ color: 'gray' }}>Due  </span>

                  <span
                    onClick={() => setIsOpen({ 'sts': itemSts.sts, 'id': index })}
                    style={{ cursor: "pointer", fontSize: 'medium', fontWeight: '600', color: 'blue' }}
                  >
                    {format(item.duedt, "MMMM dd")}
                  </span>
                  <DatePicker
                    selected={item.duedt}
                    onChange={(date) => {
                      const newdataTasks = { ...dataTasks };
                      newdataTasks[itemSts.sts][index]['duedt'] = new Date(date);
                      setdataTasks(newdataTasks);
                      setIsOpen({});
                    }}
                    dateFormat="MMMM dd"
                    open={isOpen.sts === itemSts.sts && isOpen.id === index ? true : false}
                    onClickOutside={() => setIsOpen({})}
                    customInput={<></>}
                  />
                </div>
              </div>
            ))}
            {hoveredIndex === idxSts && (
              <span style={AddTaskBtnStyle} onClick={(e) => createNewTask(e, itemSts.sts)}>+ <span style={{ fontSize: 'small' }}>add task</span> </span>
            )}
          </div>
        ))}

        {(isDragging != null && draggedElement != null) && (
          <div
            id="draggingDiv"
            style={{
              width: widthDrag,
              position: 'absolute',
              top: mousePosition.y - 50,
              left: mousePosition.x - 150,
              pointerEvents: 'none',
              zIndex: 1000,
              background: 'white',
              padding: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              margin: '15px',
            }}
          >
            {draggedElement ? <>  <div style={{ marginTop: '5%' }}></div> <input className='form-control' value={draggedElement.title} /> <span

              style={{ cursor: "pointer", fontSize: 'medium', fontWeight: '600', color: 'blue' }}
            >
              {format(draggedElement.duedt, "MMMM dd")}
            </span> </> : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
