import React, { Component} from 'react';

export class Inputfield extends Component
{

  handleChange(){
    var txtbx = document.getElementById('newTask');
    // console.log(txtbx.value);
    this.props.addNewTask(txtbx.value);
  }

  render()
  {
      return(
        <div className="bg-secondary hover:bg-blue-900 text-white border-indigo-700 relative border shadow rounded-full pt-3 pb-3 flex pl-6 mr-2">
          <input 
            className = "appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none" 
            type="text" 
            id="newTask" 
            name="newTask" 
            placeholder="Enter you new Task"
          />
          <div className = "absolute inset-y-0 right-0 pr-4 pt-3">
              <button onClick={this.handleChange.bind(this)} type="submit" className="mr-12 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm text-white py-1 px-2 rounded">
                  Save
              </button>
          </div>
        <div className = "absolute inset-y-0 right-0 pr-4 pt-3">
            <button onClick={this.props.toggleInputField} type="submit" className="hover:text-red-500 text-white text-sm mt-1 rounded-full">
                Cancel
            </button>
        </div>
    </div>
      )
  }
}
export default Inputfield;
