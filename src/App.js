import { useEffect, useState } from 'react';
import axios from 'axios'
import './App.css';
import { timeAgo } from './timeAgo';
const url = "https://todolist-backend-nbou.vercel.app/";
function App() {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [updateTaskId, setUpdateTaskId] = useState("");
  useEffect(()=>{
    fetch();
  },[])
  const fetch = async() => {
    await axios.get(url).then((res)=>{
      setList(res.data.myLists)
      console.log(res.data.myLists)
    }).catch(err=>{
      console.log(err);
    })
  }
  const addTask = async() => {
    if(task==='') {
      alert('write something');
      return;
    }
    await axios.post(url,{task:task})
    .then((res)=>{
      console.log(res.data);
      setTask("")
      fetch();
    }).catch(err=>{
      console.log(err);
    })
  }
  const editTask = (id,task) => {
    setToggle(true);
    setTask(task);
    setUpdateTaskId(id);
  }
  const updateTask = async() => {
     await axios.put(url,{task:task,updateTaskId:updateTaskId}).then(res=>{
      console.log(res);
      setTask("")
      setToggle(false);
      fetch();
     }).catch(err=>{
      console.log(err);
     })
  }
  const deleteTask = async(userid) => {
    await axios.delete(url,{userid:userid}).
    then(res=>{
      console.log(res);
      fetch();
    }).catch(err=>{
      console.log(err);
    })
  }
  const cancelUpdateTask = ()=> {
    setToggle(false);
    setTask("")
  }
  return (
    <div className="App">
      <div className='add-container'>
        <input type='text' placeholder='Add todo task...' value={task} onChange={(e)=>setTask(e.target.value)}/>
        {!toggle?
          <button onClick={addTask}>Add Task</button>:
          <>
            <button onClick={updateTask}>Update Task</button>
            <button onClick={cancelUpdateTask}>Cancel</button>
          </>}
      </div>
      <ul className='list-container'>
        {
          list.map(value=>(
            <li key={value._id}>
              <div>
                <p>{value.task}</p><br/>
                <div style={{display:'flex'}}>
                <pre>created at: {timeAgo(value.createdDate)} - </pre>
                <pre>Edited at: {value.createdDate===value.editedDate?"not edited":timeAgo(value.createdDate)} </pre>
                </div>
              </div>
              <div>
                <button onClick={()=>editTask(value._id,value.task)}>Edit Task</button>
                <button onClick={()=>deleteTask(value._id)}>Delete Task</button>
              </div>
            </li>
          ))
        }
        
      </ul>
    </div>
  );
}

export default App;
