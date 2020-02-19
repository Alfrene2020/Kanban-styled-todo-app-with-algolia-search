import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import io from 'socket.io-client';
import Inputfield from './Inputfield';

let socket;

export default class Main extends Component {
    
    constructor()
    {
        super();
        this.state = {
            pending: [],
            current: [],
            finished: [],
            clicked: false,
        }

        this.onDragEnd = this.onDragEnd.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.move = this.move.bind(this);
        this.broadcast = this.broadcast.bind(this);
        this.toggleInputField = this.toggleInputField.bind(this);
    }

    broadcast(object, sourceDroppable, destinationDroppable){
        socket.emit('event', object, sourceDroppable, destinationDroppable);
    }

    componentDidMount()
    {
        this._isMounted = true;
        this.fetchData()
    }
    componentWillUnmount()
    {
        this._isMounted = false;
    }

    droppableIdLists(id){
        if(id === "droppablePending"){
            return this.state.pending
        }
        if(id === "droppableCurrent"){
            return this.state.current
        }
        if(id === "droppableFinished"){
            return this.state.finished
        }
    }

    fetchData()
    {
        axios.get('/api/pending').then(response => {
            if(this._isMounted){
                const pending = response.data; 
                this.setState({
                    pending
                });
            }
        }).catch(errors => {
            console.log(errors);
        })

        axios.get('/api/current').then(response => {
            if(this._isMounted){
                const current = response.data; 
                this.setState({
                    current
                });
            }
        }).catch(errors => {
            console.log(errors);
        })

        axios.get('/api/finished').then(response => {
            if(this._isMounted){
                const finished = response.data; 
                this.setState({
                    finished
                });
            }
        }).catch(errors => {
            console.log(errors);
        })
    }

    changeStatus(id,status){
        axios.post(`/api/changestatus/${id}/${status}`).then(response => {
            console.log('success!');
        })
    }

    changePosition(){
        axios.post(`/api/changeposition/${id}/${status}`).then(response => {
            console.log('success!');
        })
    }

    move(source, destination, droppableSource, droppableDestination){
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
    
        destClone.splice(droppableDestination.index, 0, removed);
    
        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return(result);
    }

    onDragEnd(result)
    {
        const { destination, source, draggableId } = result;

        if(!destination){
            return;
        }

        if(destination.droppableId === source.droppableId){
            const result = Array.from(this.droppableIdLists(source.droppableId));
            const [removed] = result.splice(source.index, 1);
            result.splice(destination.index, 0, removed);

            this.updateData(result, source.droppableId, destination.droppableId);
            this.broadcast(result, source.droppableId, destination.droppableId);

        } else {
            const result = this.move(
                this.droppableIdLists(source.droppableId),
                this.droppableIdLists(destination.droppableId),
                source,
                destination
            );
            
            this.updateData(result, source.droppableId, destination.droppableId);
            this.broadcast(result, source.droppableId, destination.droppableId);
            status = 0;
            if(destination.droppableId === "droppableCurrent"){
                status = 1;
            }
            if(destination.droppableId === "droppableFinished"){
                status = 2;
            }

            this.changeStatus(draggableId, status);
        }
    }

    updateData(data, sourceDroppable, destinationDroppable){
        if(sourceDroppable === destinationDroppable){
            let state;
            if(sourceDroppable === "droppablePending"){
                state = { pending: data };
            }if(sourceDroppable === "droppableCurrent"){
                state = { current: data };
            }if(sourceDroppable === "droppableFinished"){
                state = { finished: data };
            }
            this.setState(state);
        } else {
            if(destinationDroppable === "droppableCurrent" && sourceDroppable === "droppablePending" 
            || destinationDroppable === "droppablePending" && sourceDroppable === "droppableCurrent"){
                this.setState({
                    pending: data.droppablePending,
                    current: data.droppableCurrent
                });
            }
            if(destinationDroppable === "droppableFinished" && sourceDroppable === "droppablePending" 
            || destinationDroppable === "droppablePending" && sourceDroppable === "droppableFinished"){
                this.setState({
                    pending: data.droppablePending,
                    finished: data.droppableFinished
                });
            }
            if(destinationDroppable === "droppableFinished" && sourceDroppable === "droppableCurrent" 
            || destinationDroppable === "droppableCurrent" && sourceDroppable === "droppableFinished"){
                this.setState({
                    current: data.droppableCurrent,
                    finished: data.droppableFinished
                });
            }
        }
    }

    deleteTask(e){
        console.log(e.target.value);
    }

    toggleInputField(){
        const toggle = this.state.clicked;
        this.setState({
            clicked: !toggle
        });
        console.log(this.state.clicked);
    }

    addNewTask(newTask){
        let taskObject = {
            tasks: newTask
        }
        axios.post('/api/addtask', taskObject).then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Task has been added',
                showConfirmButton: false,
                timer: 1500
              });
            
            this.toggleInputField();
        }).catch(errors => {
            console.log(errors);
        })
    }
    
    render() {
        if(!socket){
            socket = io(':8001');
            socket.on('event', (data, sDropppable, dDroppaple) => {
                console.log("data recieved");
                this.updateData(data, sDropppable, dDroppaple);
            });
        }
        return (
            <div className="bg-primary h-screen">
                <div className="container mx-auto flex" style={{height: '70%'}}>
                    <DragDropContext onDragEnd={this.onDragEnd}>

                        <div className="w-32 bg-secondary border-indigo-700 border-2 rounded-b-lg rounded-t-lg mt-10 flex-auto mr-16 shadow-xl">
                            <div className="relative ml-2 pt-1 font-semibold">
                                <h4 className="text-gray-100 mb-2 mt-3">PENDING TASK</h4>
                                <div className = "absolute inset-y-0 right-0 pr-4 pt-3">
                                    <button onClick={this.toggleInputField} type="submit" className="teaxt-2x1 hover:bg-green-400 border pb-1 text-white font-bold px-4 rounded-full">
                                        +
                                    </button>
                                </div>
                                {this.state.clicked && <Inputfield addNewTask={this.addNewTask.bind(this)} toggleInputField={this.toggleInputField}/>}
                            </div>
                            <Droppable droppableId="droppablePending">
                                {provided => (
                                    <div className = "overflow-x-hidden h-0 overflow-y-auto absolute min-h-58" style = {{width: '28%'}} ref={provided.innerRef} {...provided.droppableProps}>
                                        {this.state.pending.map((pending, index) =>
                                            <Draggable draggableId = {`${pending.id}`} key={pending.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        key={index}
                                                        className="bg-secondary hover:bg-blue-900 text-white border-indigo-700 relative border shadow rounded-full pt-3 pb-3 flex pl-6 mx-2 my-2"
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        <p>{pending.tasks}</p>
                                                        <div className = "absolute inset-y-0 right-0 pr-4 pt-3">
                                                            <button value={pending.id} onClick={this.deleteTask} type="submit" className="hover:bg-red-500 text-white font-bold px-4 rounded-full">
                                                                X
                                                            </button>
                                                        </div>
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Draggable>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        <div className="bg-secondary border-indigo-700 border-2 rounded-b-lg rounded-t-lg mt-10 flex-auto shadow-xl">
                            <div className = "ml-2 pt-1 font-semibold">
                                <h4 className="text-gray-100 mb-2 mt-3">CURRENT TASK</h4>
                            </div>
                            <Droppable droppableId="droppableCurrent">
                                {provided => (
                                    <div className = "overflow-x-hidden h-0 overflow-y-auto absolute min-h-58" style = {{width: '28%'}} ref={provided.innerRef} {...provided.droppableProps}>
                                        {this.state.current.map((current, index) =>
                                            <Draggable draggableId = {`${current.id}`} key={current.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        key={index} 
                                                        className="bg-secondary hover:bg-blue-900 text-white border-indigo-700 relative border shadow rounded-full pt-3 pb-3 flex pl-6 mx-2 my-2"
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        <p>{current.tasks}</p>
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Draggable>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        <div className="bg-secondary border-indigo-700 border-2 rounded-b-lg rounded-t-lg mt-10 flex-auto ml-16 shadow-xl">
                            <div className="ml-2 pt-1 font-semibold">
                                <h4 className="text-gray-100 mb-2 mt-3">FINISHED TASK</h4>
                            </div>
                            <Droppable droppableId="droppableFinished">
                                {provided => (
                                    <div className = "overflow-x-hidden h-0 overflow-y-auto absolute min-h-58" style = {{width: '28%'}} ref={provided.innerRef} {...provided.droppableProps}>
                                        {this.state.finished.map((finished, index) =>
                                            <Draggable draggableId = {`${finished.id}`} key={finished.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        key={index} 
                                                        className="bg-secondary hover:bg-blue-900 text-white border-indigo-700 relative border shadow rounded-full pt-3 pb-3 flex pl-6 mx-2 my-2" 
                                                        {...provided.draggableProps} 
                                                        {...provided.dragHandleProps} 
                                                        ref={provided.innerRef}
                                                    >
                                                        <p>{finished.tasks}</p>
                                                        <div className = "absolute inset-y-0 right-0 pr-4 pt-3">
                                                            <button value={finished.id} onClick={this.deleteTask} type="submit" className="hover:bg-red-500 text-white font-bold px-4 rounded-full">
                                                                X
                                                            </button>
                                                        </div>
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Draggable>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </DragDropContext>
                </div> 
            </div>
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'));
}