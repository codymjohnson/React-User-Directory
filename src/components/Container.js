import React from 'react';
import API from "../utils/API";
import "./style.css";

class Container extends React.Component {
    // initial state to use
    state = {
        users: [],
        search: "",
        directionOfSort: "",
        col: ""
    };

    // send get request to grab users after component ,ount, then push into array from state via map method
    componentDidMount() {
        API.userList()
            .then(res => {
                const userArray = res.data.results.map(user => {
                    return {
                        first: user.name.first,
                        last: user.name.last,
                        email: user.email,
                        dob: user.dob.date,
                        image: user.picture.medium
                    };
                });
                this.setState({ users: userArray });
            })
            .catch(err => console.log(err));
    }

    // updating state via letter input
    searchChangeHandler = e => {
        this.setState({ search: e.target.value });
    };

    // filter users to show up by letter typed in search
    usersFiltered() {
        const search = this.state.search.toLowerCase();
        return this.state.users.filter(user => {
            return (
                user.first.toLowerCase().includes(search) || user.last.toLowerCase().includes(search)
            );
        });
    }

    // render users in table form
    renderUsers = () => {
        return this.usersFiltered()
            .sort(this.sortUsers)
            .map((user, index) => {
                return (
                    <tr key={index}>
                        <td><img src={user.image} alt="user"></img></td>
                        <td>{user.first}</td>
                        <td>{user.last}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.dob).toDateString()}</td>
                    </tr>
                );
            });
    };

    // add or remove arrow via column
    grabHeaderClassName = col => {
        return this.state.col === col
            ? `clickable ${this.state.directionOfSort}`
            : `clickable`;
    };

    // changing to opposite sorting direction via column and state
    handleSortDirectionChange = col => {
        this.state.col === col && this.state.directionOfSort === "ascending"
            ? this.setState({ directionOfSort: "descending", col: col })
            : this.setState({ directionOfSort: "ascending", col: col });
    };

    // return 1 or -1 depending on direction of sorting handler
    sortUsers = (a, b) => {
        if (a[this.state.col] < b[this.state.col]) {
            return this.state.directionOfSort === "ascending" ? -1 : 1;
        } else if (a[this.state.col] > b[this.state.col]) {
            return this.state.directionOfSort === "ascending" ? 1 : -1;
        }
        return 0;
    };

    //rendering container with users along with searchbar
    render() {
        return (
            <>
                <div className="input-group justify-content-center">
                    <div className="input-group-prepend"></div>
                    <input onChange={this.searchChangeHandler}
                        type="search"
                        className="form-control m-3"
                        placeholder="Search Users"
                        aria-label="SearchBox"
                        aria-describedby="basic-addon1"
                    />
                </div>
                <div className="table m-3">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Image</th>
                                <th scope="col">
                                    <span
                                        className={this.grabHeaderClassName("first")}
                                        onClick={() => {
                                            this.handleSortDirectionChange("first");
                                        }}>First</span>
                                </th>
                                <th scope="col">
                                    <span
                                        className={this.grabHeaderClassName("last")}
                                        onClick={() => this.handleSortDirectionChange("last")}>Last
                                    </span>
                                </th>
                                <th scope="col">
                                    <span
                                        className={this.grabHeaderClassName("email")}
                                        onClick={() => this.handleSortDirectionChange("email")}>Email
                                    </span>
                                </th>
                                <th scope="col">
                                    <span
                                        className={this.grabHeaderClassName("dob")}
                                        onClick={() => this.handleSortDirectionChange("dob")}>DOB
                                    </span>
                                </th>

                            </tr>
                        </thead>
                        <tbody>{this.renderUsers()}</tbody>
                    </table>
                </div>
            </>
        );
    }

}

export default Container;