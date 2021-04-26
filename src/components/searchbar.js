import React, { useState } from 'react';

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import axios from 'axios';
import {SearchTable} from './searchtable'

export const SearchBar = (props) => {

    const [user, setUser] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [result, setResult] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    function handleOnChange(user) {
        setUser(user);
    }

    function searchUser(event,user) {
        event.preventDefault();
        setLoading(true)
        axios.get('https://api.github.com/search/users', {
          params: {
            q: user,
            order: 'desc',
            per_page: 10,
            page: 1
          }
        })
        .then(function (response) {
            setTotalCount(response.data.total_count);
            
            const allGetPageUsers = response.data.items.map(item => axios.get(item.url))
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
            console.log(error);
            setLoading(false)
        })
    }
    
    function displayTable(){
        if(loading){
            
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
                    <p className="lead text-center">Results: {totalCount}</p>
                </div>
            </div>
            {loading ? (
                <div className="row justify-content-center text-center">
                    <div className="col">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                
                </div>
            ): <SearchTable data={result}/>}
            
        </div>
    );
}


