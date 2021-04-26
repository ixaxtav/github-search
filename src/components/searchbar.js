import React, { useState } from 'react';

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import axios from 'axios';


export const SearchBar = (props) => {

    const [user, setUser] = useState(0);
    const [totalCount, setTotalCount] = useState([]);
    const [result, setResult] = useState([]);
    const [page, setPage] = useState(0);
    
    function handleOnChange(user) {
        setUser(user);
    }

    function searchUser(event,user) {
        event.preventDefault();
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
                })
            )
           
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    console.log(result);
    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-6">
                <form onSubmit={(event) => searchUser(event,user)}>
                    <InputGroup style={{marginTop: '100px'}} className="mb-3">
                        <FormControl
                        placeholder="Enter Github Username..."
                        aria-label="Enter Github username"
                        aria-describedby="search-bar"
                        onChange={(e) => handleOnChange(e.target.value)}
                        />
                        <InputGroup.Append>
                            <Button variant="outline-secondary" type='submit'>Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </form>
        </div>
    </div>
    );
}


