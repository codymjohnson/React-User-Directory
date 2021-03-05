import axios from "axios";

function userList() {
    return axios.get("https://randomuser.me/api/?results=200&nat=US");
}

export default { userList };