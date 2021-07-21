import React, { Component } from 'react'
//mport { getMovies } from './getMovies'
import axios from 'axios'
export default class Movies extends Component {
    constructor(props){
        super(props)
        this.state={
            movies:[], //permanent data , only for delete or adding 
            currsearchtext:'', 
            currPage:1, 
            limit:4,
            genres:[{_id:'abcd', name:"All Genres"}],
            cGenre: 'All Genres'
            //filterMovies:getMovies() //for temporary operation we made this state but we have a flaw in it ::::=> 
        }
    }
    async componentDidMount(){
        console.log('Component DID Mount');
        let promise = axios.get('https://backend-react-movie.herokuapp.com/movies');
        let promise2 = axios.get('https://backend-react-movie.herokuapp.com/genres');
        let data = await promise;
        let data2 = await promise2;
        console.log(data2.data.genres);
        this.setState({
            movies: data.data.movies,
            genres: [...this.state.genres, ...data2.data.genres]
        })
    }
    ondelete=(id)=>{
        let filtermovie = this.state.movies.filter(movieObj=>{
            return movieObj._id!==id
        })
        this.setState({
            movies:filtermovie
        })
    }
    handleChange=(e)=>{
        let val = e.target.value;
         //We have applied the same click event on both the arrows of the stock column
        // so we have to identify whether we have to sort in descending or ascending order.
        //  for this we have used the class Names as a condition
        // if (val == ''){
        //     this.setState({filterMovies:this.state.movies,
        //     currsearchtext:''
        //     })
        //     return;
        // }
        // let filtermo = this.state.movies.filter(movieObj=>{

        //     let title = movieObj.title.trim().toLowerCase();
        //     return title.includes(val.toLowerCase()); //if a string is included in that movie, it will be retured

        // })
        this.setState({
           // filterMovies:filtermo,
            currsearchtext:val
        });
    }

    handleLimit = (e) => {
        let num = Number(e.target.value)
        this.setState({ limit: num })
    }
    handlePageChange = (pageNumber) => {
        this.setState({ currPage: pageNumber });
    }
    handleGenreChange=(genre)=>{
        this.setState({
            cGenre:genre
        })

    }

    sortByRatings=(e)=>{
        let classname = e.target.className;
        let sortedArr = [];
        if (classname=='fas fa-sort-up'){
            //ascending sorting
            sortedArr = this.state.movies.sort((moviesA, moviesB)=>{
                return moviesA.dailyRentalRate-moviesB.dailyRentalRate //a-b

            })
        }else{
            sortedArr = this.state.movies.sort((moviesA, moviesB)=>{
                return moviesB.dailyRentalRate-moviesA.dailyRentalRate //b-a

            })
        }
        this.setState({movies:sortedArr})
    }
    sortByStock = (e) => {
        let className = e.target.className;
        let sortedArr = [];
        //We have applied the same click event on both the arrows of the stock column
        // so we have to identify whether we have to sort in descending or ascending order.
        //  for this we have used the class Names as a condition
        if (className == 'fas fa-sort-up') {
            // We need to provide JS with how to compare the two elements when we are trying to sort an array of derived data-types
            // such as objects.
            // a-b is used for sorting in ascending order
            sortedArr = this.state.movies.sort((movieA, movieB) => {
                return movieA.numberInStock - movieB.numberInStock;
            })
        }
        else {
            sortedArr = this.state.movies.sort((movieA, movieB) => {
                // b-a is used for sorting in descending order.
                return movieB.numberInStock - movieA.numberInStock;
            })
        }
        this.setState({
            movies: sortedArr
        })
    }
    render() {
        console.log('render');
        let { movies, currsearchtext, limit, currPage,cGenre,genres } = this.state;
        let filterMovies = [];

        
        if(currsearchtext!=''){
            filterMovies = movies.filter(movieObj=>{

                    let title = movieObj.title.trim().toLowerCase();
                    return title.includes(currsearchtext.toLowerCase()); //if a string is included in that movie, it will be retured
        
            })

        }else{
            filterMovies=movies;
        }
        
        if(cGenre!='All Genres')
        {
            filterMovies =filterMovies.filter(function(movieObj){
                return movieObj.genre.name == cGenre;
            })
        }
        
        
        
        
        ////////////////////////
        //Pagination & limit
        let noofpages = Math.ceil(filterMovies.length/limit);
        let pagenoarr = []; ///as mapping can be done on arrays only
       for(let i = 0; i<noofpages; i++){
           pagenoarr.push(i+1);

       } 
        //items per page calculation and starting index and ending index calculation per page 
//limit = 4, items = 22, index:0-21
//page1:0-3, page2:4-7, page3 : 8-11, page4: 12-15, page5: 16-19, page6: 20-21
//startingIndex=(pageno-1)*limit;
//endingIndex=(startingIndex+limit)-1;

        let si = (currPage-1)*limit;
        let ei = si+limit;
        filterMovies = filterMovies.slice(si,ei);
        if(filterMovies.length==0 && movies.length!=0){ // if we delete all items of any page , it will naturally jump to page 1
            this.setState({currPage:1})
        }
        return (
            <>
            {
               this.state.movies.length == 0 ?
               <div className="spinner-border text-primary" role="status">
                   <span className="sr-only">Loading...</span>
               </div>
                :

<div className="container">
   
<div className="p-4 mb-4 bg-danger text-danger text-center fs-1 text-uppercase bg-dark border rounded border-2  border-warning">
<i className="fab fa-maxcdn"></i>
ovies -
<i className="fab fa-vimeo-v"></i>
illa</div>
  <div className="row">
    <div className="col-3"> 
    <ul className="list-group">
        {
        genres.map((genreObj)=>(
            <li onClick={()=>this.handleGenreChange(genreObj.name)} key={genreObj._id} className='list-group-item'>
            {genreObj.name}
            </li>
         ))
        }
    </ul>
    <p class="fw-bolder">Current Genre:</p>
    <h6>{cGenre}</h6>
    </div>
    <div className="col-9">
      <input onChange={this.handleChange} type="text"></input>
    <input value = {this.state.limit>filterMovies.length? filterMovies.length: this.state.limit} onChange={this.handleLimit} min='1' max={movies.length} type='number'></input>
        
      <table className="table">
  <thead>
    <tr>
      <th scope="col">Title</th>
      <th scope="col">Genre</th>
      <th scope="col">
        <i className="fas fa-sort-up" onClick={this.sortByStock}></i>
            Stock
        <i className="fa fa-sort-down" onClick={this.sortByStock} ></i>
        </th>
        <th scope="col">
        <i className="fas fa-sort-up" onClick={this.sortByRatings} ></i>
            Rate
        <i className="fa fa-sort-down" onClick={this.sortByRatings} ></i>
        </th>      
        <th scope="col"></th>
    </tr>
  </thead>
  <tbody>
    {
        filterMovies.map(movieObj=>(
            <tr scope = 'row' key = {movieObj._id}>
                <td>{movieObj.title}</td>
                <td>{movieObj.genre.name}</td>
                <td>{movieObj.numberInStock}</td>
                <td>{movieObj.dailyRentalRate}</td>
                <td><button type="button" onClick={()=>this.ondelete(movieObj._id)} className="btn btn-danger">Delete</button></td>
            </tr>
        ))
    }
  </tbody>
</table>
<nav aria-label="Page navigation example">
  <ul className="pagination justify-content-start">
    
    {/* <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
     */}
     {
         pagenoarr.map(pageNumber=>{
            let classStyleName = pageNumber == currPage ? 'page-item active' : 'page-item'
            // the above let variable is used to define the class too be put on the li element.
            //  As this decides the blue backgroound.
            return (
                <li onClick={() => this.handlePageChange(pageNumber)} className={classStyleName} key={pageNumber} >
                    <span className="page-link">{pageNumber}</span>
                </li>
            )
         })
     }

  </ul>
</nav>
    </div>
    
  </div>
</div> 
}

</>
       )
    }




}






