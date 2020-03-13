import axios from "axios";

import {USER_LOGIN} from "./types";

const loginUser = (payload) => ({
    type: USER_LOGIN,
    payload
});

export {loginUser};