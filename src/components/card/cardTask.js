import React from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';

const TaskItem = ({
    item,
    itemSts,
    index,
    deletingTask,
    setDeletingTask,
    draggedElement,
    handleDragStart,
    setIsDragging,
    setDraggedElement,
    setTaskHoveredIndex,
    taskHoveredIndex,
    setDelTaskIdx,
    delTaskIdx,
    chgTitle,
    dataTasks,
    setdataTasks,
    isOpen,
    setIsOpen,
    TaskStyle,
}) => {
    const handleDeleteClick = (e) => {
        setDeletingTask(item.id);
        setTimeout(() => {
            const newdataTasks = { ...dataTasks };
            newdataTasks[itemSts.sts].splice(index, 1);
            setdataTasks(newdataTasks);
            setDeletingTask(null);
        }, 500);
    };

    const handleDateChange = (date) => {
        const newdataTasks = { ...dataTasks };
        newdataTasks[itemSts.sts][index]['duedt'] = new Date(date);
        setdataTasks(newdataTasks);
        setIsOpen({});
    };

    return (
        <div
            className={deletingTask === item.id ? 'fade-out' : 'fade-in'}
            key={index}
            style={{
                ...TaskStyle,
                display: draggedElement?.id === item.id ? 'none' : 'block',
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, item, itemSts.sts, index)}
            onDragEnd={() => {
                setIsDragging(null);
                setDraggedElement(null);
            }}
            onMouseEnter={() => setTaskHoveredIndex(item.id)}
            onMouseLeave={() => setTaskHoveredIndex(null)}
        >
            {taskHoveredIndex === item.id && (
                <span
                    onMouseEnter={() => setDelTaskIdx(index)}
                    onMouseLeave={() => setDelTaskIdx(null)}
                    style={{
                        zIndex: '2',
                        position: 'absolute',
                        right: 5,
                        top: 0,
                    }}
                    onClick={handleDeleteClick}
                >
                    <span
                        style={{
                            fontSize: delTaskIdx === index ? 'medium' : 'small',
                            fontWeight: delTaskIdx === index ? '600' : 'normal',
                            color: 'red',
                            cursor: 'pointer',
                        }}
                    >
                        Delete
                    </span>
                </span>
            )}
            <div style={{ marginTop: '5%' }}></div>
            <input
                className='form-control'
                onChange={(e) => chgTitle(e.target.value, itemSts.sts, index)}
                value={item.title}
            />
            <div>
                <span style={{ color: 'gray' }}>Due date : </span>
                <span
                    onClick={() => setIsOpen({ sts: itemSts.sts, id: index })}
                    style={{
                        cursor: 'pointer',
                        fontSize: 'medium',
                        fontWeight: '500',
                        color: 'blue',
                    }}
                >
                    {format(item.duedt, 'MMMM dd')}
                </span>
                <DatePicker
                    selected={item.duedt}
                    onChange={handleDateChange}
                    dateFormat='MMMM dd'
                    open={isOpen.sts === itemSts.sts && isOpen.id === index}
                    onClickOutside={() => setIsOpen({})}
                    customInput={<></>}
                />
            </div>
        </div>
    );
};

export default TaskItem;
