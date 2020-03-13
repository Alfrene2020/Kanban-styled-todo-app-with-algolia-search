import Inputfield from './Inputfield'
import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export class TabledTasks extends Component{

    render() {
        return (
            <div className="animated zoomIn ml-3 container mx-auto flex h-full">
                <DragDropContext onDragEnd={this.props.onDragEnd}>
                    <div className="text-white grid-cols-1 w-33% border-plum bg-secondary border-2 rounded-b-lg rounded-t-lg mt-3 mb-3 flex-auto mr-3 shadow-xl">
                        <div className="relative ml-2 pt-1 font-semibold">
                            <h4 className="mb-2 mt-3">PENDING TASK</h4>
                            <div className = "absolute inset-y-0 right-0 pr-4 pt-3">
                                <button onClick={this.props.toggleInputField} type="submit" className="border-green-200 teaxt-2x1 hover:bg-green-400 border pb-1 font-bold px-4 rounded-full">
                                    +
                                </button>
                            </div>
                            {this.props.clicked && <Inputfield addNewTask={this.props.addNewTask.bind(this)} toggleInputField={this.props.toggleInputField}/>}
                        </div>
                        <Droppable droppableId="droppablePending">
                            {provided => (
                                <div id="pendingdiv" className = "w-full relative overflow-x-hidden h-91% w-381 overflow-y-auto" ref={provided.innerRef} {...provided.droppableProps}>
                                    {this.props.pending.map((pending, index) =>
                                        <Draggable draggableId = {`${pending.id}`} key={pending.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div 
                                                    key={index}
                                                    className="bg-secondary md:w-83% xl:w-94% lg:w-93% hover:bg-dimgray border border-b-2 border-r-2 border-primary relative rounded-lg pt-3 pb-3 flex pl-6 mx-2 my-2"
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <div className = "absolute inset-y-0 right-0 pr-4 pt-3">
                                                        <button value={pending.id} onClick={this.props.deleteTask} type="submit" className="hover:bg-red-500 font-bold px-4 rounded-full">
                                                            X
                                                        </button>
                                                    </div>
                                                    <div className="w-83%">
                                                        <p className="pb-2">{pending.tasks}</p>
                                                        <hr/>
                                                        {pending.description === null ? <p className="pb-1 text-sm pt-2">No Description</p>: <p className="pb-1 text-sm pt-2">{pending.description}</p>}
                                                        <p className="text-10px">{pending.created_at}</p>
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

                    <div className="text-white grid-cols-1 w-33% border-plum bg-secondary border-2 rounded-b-lg rounded-t-lg mt-3 mb-3 flex-auto shadow-xl">
                        <div className = "ml-2 pt-1 font-semibold">
                            <h4 className="mb-2 mt-3">CURRENT TASK</h4>
                        </div>
                        <Droppable droppableId="droppableCurrent">
                            {provided => (
                                <div className = "w-full relative overflow-x-hidden h-91% w-381 overflow-y-auto" ref={provided.innerRef} {...provided.droppableProps}>
                                    {this.props.current.map((current, index) =>
                                        <Draggable draggableId = {`${current.id}`} key={current.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div 
                                                    key={index} 
                                                    className="border border-b-2 border-r-2 border-primary bg-secondary md:w-83% xl:w-94% lg:w-93% hover:bg-lightdimgray relative rounded-lg pt-3 pb-3 flex pr-6 pl-6 mx-2 my-2"
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <div className="w-full">
                                                        <p className="pb-2">{current.tasks}</p>
                                                        <hr/>
                                                        {current.description === null ? <p className="pb-1 text-sm pt-2">No Description</p>: <p className="pb-1 text-sm pt-2">{current.description}</p>}
                                                        <p className="text-10px">{current.created_at}</p>
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

                    <div className="grid-cols-1 w-33% border-plum text-white bg-secondary border-2 rounded-b-lg rounded-t-lg mt-3 mb-3 flex-auto ml-3 shadow-xl mr-2">
                        <div className="ml-2 pt-1 font-semibold">
                            <h4 className="mb-2 mt-3">FINISHED TASK</h4>
                        </div>
                        <Droppable droppableId="droppableFinished">
                            {provided => (
                                <div className = "w-full relative overflow-x-hidden h-91% w-381 overflow-y-auto" ref={provided.innerRef} {...provided.droppableProps}>
                                    {this.props.finished.map((finished, index) =>
                                        <Draggable draggableId = {`${finished.id}`} key={finished.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div 
                                                    key={index} 
                                                    className="border border-b-2 border-r-2 border-primary bg-secondary md:w-83% xl:w-94% lg:w-93% hover:bg-dimgray relative rounded-lg pt-3 pb-3 flex pl-6 mx-2 my-2" 
                                                    {...provided.draggableProps} 
                                                    {...provided.dragHandleProps} 
                                                    ref={provided.innerRef}
                                                >
                                                    <div className = "absolute inset-y-0 right-0 pr-4 pt-3">
                                                        <button value={finished.id} onClick={this.props.deleteTask} type="submit" className="hover:bg-red-500 font-bold px-4 rounded-full">
                                                            X
                                                        </button>
                                                    </div>
                                                    <div className="w-83%">
                                                        <p style={{textDecoration: "line-through"}} className="pb-2">{finished.tasks}</p>
                                                        <hr/>
                                                        {finished.description === null ? <p className="pb-1 text-sm pt-2">No Description</p>: <p className="pb-1 text-sm pt-2">{finished.description}</p>}
                                                        <p className="text-10px">{finished.created_at}</p>
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
        );
    }
}

export default TabledTasks;