import { createContext, useContext, useMemo, useReducer } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";

const MyContext = createContext()
MyContext.displayName = "vbdvabv"
//Định nghĩa Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return {...state, userLogin: action.value}
    case "LOGOUT":
      return {...state, userLogin: null}
    default:
      throw new Error("Action not found")
      break;
  }
}
//Định nghĩa MyContextControllerProvider
const MyContextControllerProvider = ({ children }) => {
  //Khởi store
  const initialState = {
    userLogin: null,
    services: [],
  }
  const [controller, dispatch] = useReducer(reducer, initialState)
  //phân biệt useMemo useEffect
  const value = useMemo(() => [controller, dispatch], [controller, dispatch])
  
  return(
    <MyContext.Provider value={value}>
      { children }
    </MyContext.Provider>
  )
}
//Định nghĩa useMyContextController
const useMyContextController = () => {
    const context = useContext(MyContext)
    if(context ==null) {
      throw new Error("useMyContextController must inside in MyContextControllerProvider")
    }
    return context
  }
  
  //Định nghĩa các action
  const USERS = firestore().collection("USERS")
  
  const login = (dispatch, email, password) => {
    auth().signInWithEmailAndPassword(email, password)
      .then(response => {
        USERS.doc(email)
          .onSnapshot(
            u => dispatch({type:"USER_LOGIN", value: u.data()})
          )
      })
      .catch(e => Alert.alert("Sai email và password"))
  }
  
  const logout = (dispatch) => {
    auth().signOut()
      .then(() => dispatch({type:"LOGOUT"}))
  }
  
  export {
    MyContextControllerProvider,
    useMyContextController,
    login,
    logout
  }