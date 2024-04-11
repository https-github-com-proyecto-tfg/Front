import { GoogleLogin } from 'react-google-login';

const clientId = process.env.REACT_APP_CLIENT_ID;

function Login () {

    const onSuccess = (res) => {
        console.log("Login correcto. Usuario: ", res.profileObj);
    }

    const onFailure = (res) => {
        console.log("Login incorrecto. Usuario ", res);
    }

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText={"Login"}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    );
}

export default Login;
