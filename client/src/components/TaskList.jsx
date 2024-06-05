import React from 'react';

function TaskList() {
  // Assuming tasks are passed as props
  const tasks = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
    { id: 3, title: 'Task 3', completed: false },
  ];

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} className="bg-white rounded p-4 mb-4">
          <h3 className={task.completed ? 'line-through' : ''}>{task.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
