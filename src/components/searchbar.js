import React, { useState } from 'react';

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Pagination from 'react-bootstrap/Pagination'
import axios from 'axios';
import {SearchTable} from './searchtable'

export const SearchBar = (props) => {

    const [user, setUser] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState('');
    const [error, setError] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [userPerPage, setUserPerPage] = useState(10);

    //handle search onchange query
    function handleOnChange(user) {
        setUser(user);
    }

    //get initial result from github api search/users 
    function searchUser(event,user) {
        event.preventDefault();
        setError('')
        setLoading(true);
        setCurrentPage(1);
        setQuery(user);
        axios.get('https://api.github.com/search/users', {
          params: {
            q: user,
            order: 'desc',
            per_page: userPerPage,
            page: 1
          }
        })
        .then(function (response) {
            setTotalCount(response.data.total_count);
      
            const allGetPageUsers = response.data.items.map(item => axios.get(item.url).then(function (response){
                if(response) return response;
            }).catch(function (err){
                setError(err.message + ". Cannot display result. Unauthenticated clients can make 60 requests per hour.");
                return;
            }))
            
            let usersToDisplay;
            
            axios.all(allGetPageUsers).then(
                axios.spread((...data) => {
                        
                        usersToDisplay = data.filter(e => e).map(e => e.data)
                        setResult(usersToDisplay);
                        setLoading(false)
                })
            )
           
        })
        .catch(function (error) {
            console.log(error);
            setLoading(false)
        })
    }
    
    //onclick function for paginated results
    function searchPaginateUser(event, index){
        event.preventDefault();
        setLoading(true);
        if(index === 'next'){
            index = currentPage + 1;
            setCurrentPage(currentPage + 1);
        }else if(index === "prev"){
            index = currentPage - 1;
            setCurrentPage(currentPage - 1);
        }else setCurrentPage(index);

        axios.get('https://api.github.com/search/users', {
          params: {
            q: query,
            order: 'desc',
            per_page: userPerPage,
            page: index
          }
        })
        .then(function (response) {
            // setTotalCount(response.data.total_count);
            
            const allGetPageUsers = response.data.items.map(item => axios.get(item.url).then(function (response){
                return response;
            }).catch(function (err){

            }))
            let usersToDisplay;
            
            axios.all(allGetPageUsers).then(
                axios.spread((...data) => {
                    usersToDisplay = data.map(e => e.data)
                    setResult(usersToDisplay);
                    setLoading(false)
                })
            )
           
        })
        .catch(function (error) {
            setLoading(false)
        })        
    }


    //render pagination indexes
    let items = [];
    let totalPages = Math.ceil(totalCount / userPerPage);
    let startPage, endPage;

    if(totalPages <= 20){
        startPage = 1;
        endPage = totalPages
    }else{
        if (currentPage <= 12) {
            startPage = 1;
            endPage = 20;
        } else if (currentPage + 8 >= totalPages) {
            startPage = totalPages - 18;
            endPage = totalPages;
        } else {
            startPage = currentPage - 10;
            endPage = currentPage + 8;
        }
    }
    var startIndex = (currentPage - 1) * userPerPage;
    var endIndex = Math.min(startIndex + userPerPage - 1, totalCount - 1);
  
    var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

    
    pages.forEach(i => {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={(e) => searchPaginateUser(e,i) }>
              {i}
            </Pagination.Item>,
        );
    });


    
    //render pagination boostrap 
    const paginationBasic = (
      <div className="row">
          <div className="col">
            <Pagination className="justify-content-center mt-3">
                <Pagination.First onClick={(e) => searchPaginateUser(e,1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={(e) => searchPaginateUser(e,'prev')} disabled={currentPage <= 1}/>
                {items}
                <Pagination.Next onClick={(e) => searchPaginateUser(e,'next')} disabled={currentPage >= Math.ceil(totalCount / userPerPage) }  />
                <Pagination.Last onClick={(e) => searchPaginateUser(e,endIndex)} disabled={currentPage >= Math.ceil(totalCount / userPerPage)} />
            </Pagination>

          </div>

      </div>
    );

    function showResult(){
        if(loading){
            return(
                <div className="row justify-content-center text-center">
                    <div className="col">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                </div>  
            )
        }else if(!loading && query && result.length > 0){
            return (
                <div>
                    <SearchTable data={result}/>
                    {paginationBasic}
                </div>
            )

        }
    }

    return (
        <div>       
            <div className="row justify-content-center mt-3">
                <div className="col-12 col-md-3">

                    <form onSubmit={(event) => searchUser(event,user)}>
                        <div className="text-center mt-3 mb-3">
                            <h1 className="display-4">Welcome.</h1>
                            <p className="lead">Search GitHub users now!</p>

                        </div>
                        <InputGroup className="mb-3">
                            <FormControl
                            placeholder="Enter Github Username..."
                            aria-label="Enter Github username"
                            aria-describedby="search-bar"
                            onChange={(e) => handleOnChange(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" disabled={!user} type='submit'>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </form>
                    {query && <p className="lead text-center">Results: {totalCount}</p>}
                    <span className="text-danger">{error}</span>
                </div>
            </div>
            {showResult()}
            
        </div>
    );
}


