import axios from 'axios'
import Logo from "./logo.png"
import Swal from 'sweetalert2'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import SearchTask from './SearchTask'
import TabledTasks from './TabledTasks'
import React, { Component } from 'react'
import withReactContent from 'sweetalert2-react-content'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'

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

        this.move = this.move.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.broadcast = this.broadcast.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.addNewTask = this.addNewTask.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.toggleInputField = this.toggleInputField.bind(this);
        
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

    deleteTask(e){
        console.log(e.target.value);
        e.preventDefault();
        const MySwal = withReactContent(Swal);
        const id = e.target.value;

        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
            }).then((result) => {
            if (result.value) {
                axios.post(`/api/removetask/${id}`).then(response => {
                    MySwal.fire({
                        title: 'Deleted!',
                        text: 'Task has been removed successfully.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                    })
                    this.fetchData();
                    socket.emit('update');

                }).then(error => {
                    console.log(error);
                })
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                MySwal.fire({
                title: 'Cancelled',
                text: '',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
                })
            }
        })
    }

    changePosition(){
        axios.post(`/api/changeposition/${id}/${status}`).then(response => {
            console.log('success!');
        })
    }

    onDragEnd(result){
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
            status = 'pending';
            if(destination.droppableId === "droppableCurrent"){
                status = 'current';
            }
            if(destination.droppableId === "droppableFinished"){
                status = 'finished';
            }

            this.changeStatus(draggableId, status);
        }
    }

    toggleInputField(){
        const toggle = this.state.clicked;
        if(!toggle){
            document.getElementById("pendingdiv").className = "w-full relative overflow-x-hidden max-h-76% w-381 overflow-y-auto min-h-58";
        } else {
            document.getElementById("pendingdiv").className = "w-full relative overflow-x-hidden w-381 overflow-y-auto h-91%";
        }
        
        this.setState({
            clicked: !toggle
        });
        console.log(this.state.clicked);
    }

    componentDidMount(){
        this._isMounted = true;
        this.fetchData()
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

    componentWillUnmount(){
        this._isMounted = false;
    }

    changeStatus(id,status){
        axios.post(`/api/changestatus/${id}/${status}`).then(response => {
            console.log('success!');
        })
    }

    addNewTask(newTask, description){
        let taskObject = {
            tasks: newTask,
            description: description
        }
        axios.post('/api/addtask', taskObject).then(response => {
            if(response.data == '1'){
                Swal.fire({
                    icon: 'success',
                    title: 'Task has been added',
                    showConfirmButton: false,
                    timer: 1500
                });
                
                this.toggleInputField();
                this.fetchData();
                socket.emit('update');
            }else{
                Swal.fire({
                    title: 'Task already exist',
                    icon: 'warning',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
            // ('update');
        }).catch(errors => {
            console.log(errors);
        })
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

    broadcast(object, sourceDroppable, destinationDroppable){
        socket.emit('event', object, sourceDroppable, destinationDroppable);
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

    render() {
        if(!socket){
            socket = io(':8001');
            socket.on('event', (data, sDropppable, dDroppaple) => {
                console.log("data recieved");
                this.updateData(data, sDropppable, dDroppaple);
            });
            socket.on('update',() => {
                this.fetchData();
            })
        }
        return (
            <Router>
                <div className="h-screen flex bg-primary font-comic">
                    <div className = "animated fadeInLeft bg-secondary border-r-2 w-auto border-plum">
                        <div>
                        <a href='#'><img className = "h-16 object-scale-down pl-5 pr-5" src={Logo} alt="Logo" /></a>
                        </div>
                        <div className="font-semibold mt-24 text-center text-xl w-full">
                            <Link className="text-white hover:underline" to="/Tasks">Tasks</Link>
                            <br/>
                            <br/>
                            <Link className="text-white hover:underline" to="/Search">Search Task</Link>
                        </div>
                    </div>
                    
                    <div className="container mx-auto flex h-full">
                        <Route path="/Search" render={() => <SearchTask fetchData={this.fetchData} 
                                                                        socket={socket}
                                                                        />}/>
                        <Route path="/Tasks" render={() => <TabledTasks deleteTask={this.deleteTask} 
                                                                        pending={this.state.pending} 
                                                                        current={this.state.current} 
                                                                        finished={this.state.finished}
                                                                        clicked={this.state.clicked}
                                                                        addNewTask={this.addNewTask}
                                                                        toggleInputField={this.toggleInputField}
                                                                        onDragEnd={this.onDragEnd}
                                                                         />}/>
                    </div> 
                </div>
            </Router>
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'));
}