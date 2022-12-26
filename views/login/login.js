const form = document.getElementById("signup-form");

form.addEventListener("submit", login);

async function login(e) {
  e.preventDefault();
  const loginDetails = {
    email: e.target.email.value,
    password: e.target.password.value,
  };

  console.log(loginDetails);

  //   try {
  //     const response = await axios.post(
  //       "http:localhost:3000/user/login",
  //       loginDetails
  //     );
  //   } catch (error) {}
}
