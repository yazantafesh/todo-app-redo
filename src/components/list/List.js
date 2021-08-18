import React,{useState,useContext,useEffect} from 'react'
import {settingContext} from '../../context/settings.js';

function List(props) {
    const settingsContext = useContext(settingContext);
    const [activeList, setActiveList] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [numOfPages, setNumOfPages] = useState(Math.ceil(props.list.length/settingsContext.itemPerPage));

    useEffect(()=>{
        let start = (activePage - 1)*settingsContext.itemPerPage;
        let end = start + settingsContext.itemPerPage;
        setNumOfPages(Math.ceil(props.list.length/settingsContext.itemPerPage)); 
        setActiveList(props.list.slice(start,end)); 
    },[props.list.length]);

    useEffect(()=>{
        if(settingsContext.showCompleted){
            let start = (activePage - 1)*settingsContext.itemPerPage;
            let end = start + settingsContext.itemPerPage;
            setActiveList(props.list.slice(start,end));
            setNumOfPages(Math.ceil(props.list.length/settingsContext.itemPerPage));
        }else{
           let temp = props.list.filter((item)=>{
                return item.complete===false
            })
            let start = (activePage - 1)*settingsContext.itemPerPage;
            let end = start + settingsContext.itemPerPage;
            setActiveList(temp.slice(start,end));
            setNumOfPages(Math.ceil(temp.length/settingsContext.itemPerPage))
        }
    },[activePage,settingsContext.showCompleted]);

    function changeActivePage(num){
        setActivePage(num);
    }

    function toggleView(){
        settingsContext.setShowCompleted( !settingsContext.showCompleted );
    }

    const pages=()=>{
        let page =[];
        for(let i=1;i<=numOfPages;i++){
           page.push(<button onClick={()=>{changeActivePage(i)}} key={i}>{i}</button>)
        }
        return page;
    }

    return (
        <div>
            <button onClick={toggleView} >View Completed: {settingsContext.showCompleted.toString()}</button>
            {activeList.map(item => (
        <div key={item.id}>
          <p>{item.text}</p>
          <p><small>Assigned to: {item.assignee}</small></p>
          <p><small>Difficulty: {item.difficulty}</small></p>
          <div onClick={() => props.toggleComplete(item.id)}>Complete: {item.complete.toString()}</div>
          <hr />
        </div>
      ))}
     {activePage>1 && <button onClick={()=>{setActivePage(activePage-1)}}>Previous</button>}
        {pages()}
      {activePage<numOfPages && <button onClick={()=>{setActivePage(activePage+1)}} >Next</button>}

        </div>
    )
}

export default List