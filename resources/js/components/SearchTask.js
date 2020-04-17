import Swal from 'sweetalert2'
import React, { Component } from 'react'
import algoliasearch from 'algoliasearch/lite';
import withReactContent from 'sweetalert2-react-content'
import {InstantSearch, connectSearchBox, InfiniteHits , connectRefinementList, Highlight, Stats, SortBy } from 'react-instantsearch-dom';

const searchClient = algoliasearch(
    'AJILZUF45K',
    '872ad755317c6bbd260fe55df0108176'
  );

export class SearchTask extends Component{
    
    constructor(props)
    {
        super(props);
        this.state = {
            refresh: false,
        };
        
        this.Hit = this.Hit.bind(this);
        this.SearchBox = this.SearchBox.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.RefinementList = this.RefinementList.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    SearchBox({ currentRefinement, refine }){
        return(
            <form noValidate action="" role="search" className="text-center">
            <input
                className="bg-white rounded-lg px-2 text-center text-xl py-1 mt-4 mb-2 border-b-2 border-black text-black"
                type="search"
                style={{caretColor:"black"}}
                value={currentRefinement}
                onChange={event => refine(event.currentTarget.value)}
                placeholder='Search Tasks'
            />
            </form>
        )
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
                    this.setState({ refresh: !this.state.refresh})
                    MySwal.fire({
                        title: 'Deleted!',
                        text: 'Task has been removed successfully.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                    })
                    this.setState({ refresh: !this.state.refresh})
                    // this.setState({ refresh: true }, () => {
                    //     this.setState({ refresh: false });
                    //   })
                    this.props.fetchData();
                    this.props.socket.emit('update');
                    
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

    Hit({hit}){
        // console.log(hit.tasks);
        return(
            <div>
                {/* <p>{hit.tasks}</p> */}
                <div onClick={this.handleOnClick} className='md:w-83% xl:w-94% lg:w-93% bg-secondary hover:bg-dimgray relative rounded-lg pt-3 pb-3 flex pl-6 mx-2 my-2'>
                    <div className="w-1/4">
                        <p>{hit.tasks}</p>
                    </div>
                    <hr style={{border:"none", borderLeft: "1px solid hsla(200, 10%, 50%,100)", height: "24px", width: "1px"}}/>
                    <div className="text-center w-7/12">
                        {hit.description === null ? <p>No Description</p> : <p>{hit.description}</p> }
                    </div>
                    <hr style={{border:"none", borderLeft: "1px solid hsla(200, 10%, 50%,100)", height: "24px", width: "1px"}}/>
                    <div className="w-32 text-right">
                        <p>{hit.status}</p>
                    </div>
                    
                    
                    
                    
                    {/* <button value={hit.id} onClick={this.deleteTask} type="submit" className="hover:bg-red-500 font-bold px-4 rounded-full mr-2">
                        X
                    </button> */}
                </div>
            </div>
        )
    }

    handleOnClick(){
        console.log("awww")
    }

    refresh(){
        const MySwal = withReactContent(Swal);

        this.setState({ refresh: true }, () => {
            MySwal.fire({
                title: 'Refreshing Data',
                // text: 'Task has been removed successfully.',
                icon: 'info',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
            })
            this.setState({ refresh: false });
        })
    }

    RefinementList({items,isFromSearch,refine,searchForItems,createURL,}){
        return(
            <ul>
                {/* <li>
                    <input
                        type="search"
                        onChange={event => searchForItems(event.currentTarget.value)}
                    />
                </li> */}
                {items.map(item => (
                <li key={item.label} className="ml-3 mb-1" >
                    <a
                    href={createURL(item.value)}
                    style={{ fontWeight: item.isRefined ? 'bold' : '', textDecoration: item.isRefined ? 'underline' : '' }}
                    onClick={event => {
                        event.preventDefault();
                        refine(item.value);
                    }}
                    >
                    {isFromSearch ? (
                        <Highlight attribute="label" hit={item} />
                    ) : (
                        item.label
                    )}{'    '}
                    ({item.count})
                    </a>
                </li>
                ))}
            </ul>
        );
    }

    render(){
        const CustomSearchBox = connectSearchBox(this.SearchBox);
        const CustomRefinementList = connectRefinementList(this.RefinementList);
        return(
            <div className="animated fadeInDown point7 container text-white my-1 mx-1 h-auto rounded-lg">
                <InstantSearch 
                 indexName="tasks"
                 searchClient={searchClient}
                 refresh={this.state.refresh}
                 >

                    <div className="">
                        <CustomSearchBox/>
                        <div className="flex justify-between">
                            <Stats className="ml-40" />
                            <div className="flex">
                                <p className="mr-2">SortBy:</p>
                                <SortBy
                                    className="mr-20 text-gray-900" 
                                    defaultRefinement = "tasks"
                                    items={[
                                        {value: 'tasks', label: "Most Relevant"},
                                        // {value: 'tasks_id_desc', label: "creation(DESC)"},
                                        {value: 'tasks_id_asc', label: "creation"}
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex h-83% w-auto mr-2 ml-2">
                        <div className="mt-4 w-32 mr-4">
                            <div onClick={this.refresh} className="hover:bg-blue-500 text-white  font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md bg-blue-500 mb-2">
                                <button>Refresh</button>
                            </div>
                            <hr className="mb-2" style={{border:"none", border: "1px solid hsla(200, 10%, 50%,100)"}}/>
                            <h4 className="mb-1">Status:</h4>
                            {/* <RefinementList
                                attribute="status"
                            /> */}
                            <CustomRefinementList attribute="status" searchhable/>
                        </div>
                        <hr className="h-auto mr-2" style={{border:"none", borderLeft: "1px solid hsla(200, 10%, 50%,100)", width: "1px"}}/>

                        <div className='animated zoomIn point7 w-full relative overflow-x-hidden w-381 overflow-y-auto h-auto'>
                            <InfiniteHits  hitComponent={this.Hit}/>
                            {/* <CustomHits /> */}
                        </div>
                    </div>

                </InstantSearch>
            </div>
        );
    }
}

export default SearchTask;