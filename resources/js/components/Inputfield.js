import React, { Component} from 'react';

export class Inputfield extends Component{

  constructor()
  {
    super();

    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(){
    var txtbx = document.getElementById('newTask');
    var description = document.getElementById('description');
    // console.log(txtbx.value);
    this.props.addNewTask(txtbx.value, description.value);
  }

  render()
  {
      return(
        <div className="animated fadeInDown border-primary bg-secondary text-white relative border border-r-2 border-b-2 shadow rounded-lg pt-3 pb-3 flex pl-6 mr-2 my-2">
          <div className="w-8/12">
            <input 
              className = "text-white appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none" 
              type="text" 
              id="newTask" 
              name="newTask" 
              placeholder="Enter you new Task"
            />
            <hr/>
            <input 
              className = "text-white appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none" 
              type="text" 
              id="description" 
              name="description" 
              placeholder="Brief Description"
            />
          </div>
          <div className = "absolute inset-y-0 right-0 pr-4 pt-3">
              <button onClick={this.handleChange} type="submit" className="mt-3 mr-12 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm text-white py-1 px-2 rounded">
                  Save
              </button>
          </div>
        <div className = "absolute inset-y-0 right-0 pr-4 pt-3">
            <button onClick={this.props.toggleInputField.bind(this)} type="submit" className="mt-4 hover:underline text-red-500 text-sm mt-1 rounded-full">
                Cancel
            </button>
        </div>
    </div>
      )
  }
}
export default Inputfield;
