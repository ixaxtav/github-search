import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';

export const SearchTable = (props) => {
    const data = props.data;
    return (
        <div className="row justify-content-center mt-3">
            <div className="col">
                {data.length != 0 ? (
                    <Table striped bordered hover className="text-center">
                        <thead>
                            <tr>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Bio</th>
                            <th>Location</th>
                            <th># Repos</th>
                            <th># Followers</th>
                            <th># Following</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(e => {
                                return(
                                    <tr>
                                    <td style={{verticalAlign:"middle"}}><Image src={e.avatar_url} style={{height: '40px', width: '40px'}} roundedCircle /></td>
                                    <td style={{verticalAlign:"middle"}} ><a href={e.html_url} target="_blank" rel="noreferrer">{e.name || '-'}</a></td>
                                    <td style={{verticalAlign:"middle"}}>{e.bio || '-'}</td>
                                    <td style={{verticalAlign:"middle"}}>{e.location || '-'}</td>
                                    <td style={{verticalAlign:"middle"}}>{e.public_repos}</td>
                                    <td style={{verticalAlign:"middle"}}>{e.followers}</td>
                                    <td style={{verticalAlign:"middle"}}>{e.following}</td>
                                    </tr>

                                )
                            })}
                
                        </tbody>
                    </Table>
                ): <p className="lead text-center">No result found. Please retry using a different username.</p>}
            </div>
        </div>
    );
}


