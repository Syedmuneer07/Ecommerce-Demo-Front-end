import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
 
const GoogleLoginButton = () => {
    const handleSuccess = (credentialResponse) => {
        console.log("Google Login Successful",credentialResponse);
        axios.post(`${import.meta.env.REACT_APP_BACKEND_API_URL}/api/auth/google-login`,{ token: credentialResponse.credential}).then((res) => {
            alert("User logged in successfully");
            localStorage.setItem("token", res.data.token);
            window.location.href = "/";
        }).catch((err) => {
            console.log("There was an error", err);
            alert("There was an error, please try again");
        });
    }
    const handleError = (error) => {
        console.log("Google Login Failed",error);
        alert("There was an error, please try again");
    }
  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};
export default GoogleLoginButton;