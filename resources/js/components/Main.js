import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default class Main extends Component {
    
    constructor()
    {
        super();
        this.state = {
            pending: [],
            current: [],
            finished: [],
        }

        this. onDragEnd = this. onDragEnd.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.move = this.move.bind(this);
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
            const pending = Array.from(this.droppableIdLists(source.droppableId));
            const [removed] = pending.splice(source.index, 1);
            pending.splice(destination.index, 0, removed);

            let state = {pending};
            if(source.droppableId === "droppableCurrent"){
                state = { current: pending };
            }if(source.droppableId === "droppableFinished"){
                state = { finished: pending };
            }

            this.setState(state);
        } else {
            const result = this.move(
                this.droppableIdLists(source.droppableId),
                this.droppableIdLists(destination.droppableId),
                source,
                destination
            );

            if(destination.droppableId === "droppableCurrent" && source.droppableId === "droppablePending" 
            || destination.droppableId === "droppablePending" && source.droppableId === "droppableCurrent"){
                this.setState({
                    pending: result.droppablePending,
                    current: result.droppableCurrent
                });
            }
            if(destination.droppableId === "droppableFinished" && source.droppableId === "droppablePending" 
            || destination.droppableId === "droppablePending" && source.droppableId === "droppableFinished"){
                this.setState({
                    pending: result.droppablePending,
                    finished: result.droppableFinished
                });
            }
            if(destination.droppableId === "droppableFinished" && source.droppableId === "droppableCurrent" 
            || destination.droppableId === "droppableCurrent" && source.droppableId === "droppableFinished"){
                this.setState({
                    current: result.droppableCurrent,
                    finished: result.droppableFinished
                });
            }

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
    
    render() {
        return (
            <div className="container mx-auto flex">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="border-4 border-dashed mt-10 flex-auto">
                        <div>
                            <h4 className="text-center">PENDING TASK</h4>
                        </div>
                        <Droppable droppableId="droppablePending">
                            {provided => (
                                <div className="border-4 mt-5" ref={provided.innerRef} {...provided.droppableProps}>
                                    {this.state.pending.map((pending, index) =>
                                        <Draggable draggableId = {`${pending.id}`} key={pending.id} index={index}>
                                             {(provided, snapshot) => (
                                                <div 
                                                    key={index} 
                                                    className="flex border-2 border-gray-500 mx-2 my-2 items-center"
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <input className= "mx-2" type="checkbox" id={pending.id} value={pending.id} onChange = {this.markComplete}/>
                                                    <p>{pending.tasks}</p>
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

                    <div className="border-4 border-dashed mt-10 flex-auto">
                        <div>
                            <h4 className="text-center">CURRENT TASK</h4>
                        </div>
                        <Droppable droppableId="droppableCurrent">
                            {provided => (
                                <div className="border-4 mt-5" ref={provided.innerRef} {...provided.droppableProps}>
                                    {this.state.current.map((current, index) =>
                                        <Draggable draggableId = {`${current.id}`} key={current.id} index={index}>
                                             {(provided, snapshot) => (
                                                <div 
                                                    key={index} 
                                                    className="flex border-2 border-gray-500 mx-2 my-2 items-center"
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <input className= "mx-2" type="checkbox" id={current.id} value={current.id} onChange = {this.markComplete}/>
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

                    <div className="border-4 border-dashed mt-10 flex-auto">
                        <div>
                            <h4 className="text-center">FINISHED TASK</h4>
                        </div>
                        <Droppable droppableId="droppableFinished">
                            {provided => (
                                <div className="border-4 mt-5" ref={provided.innerRef} {...provided.droppableProps}>
                                    {this.state.finished.map((finished, index) =>
                                        <Draggable draggableId = {`${finished.id}`} key={finished.id} index={index}>
                                             {(provided, snapshot) => (
                                                <div 
                                                    key={index} 
                                                    className="flex border-2 border-gray-500 mx-2 my-2 items-center"
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <input className= "mx-2" type="checkbox" id={finished.id} value={finished.id} onChange = {this.markComplete}/>
                                                    <p>{finished.tasks}</p>
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
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'));
}