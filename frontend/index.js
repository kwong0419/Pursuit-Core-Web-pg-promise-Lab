document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  const form = document.querySelector("#addUserForm");
  form.addEventListener("submit", addUserFormSubmitted);

  const displayPostSelect = document.querySelector("#displayPostSelect");
  const createPostForm = document.querySelector("#createPostForm");

  displayPostSelect.addEventListener("change", async () => {
    let res = await axios.get(
      "http://localhost:3002/posts/" + displayPostSelect.value
    );
    debugger;
    showUserPosts(res.data);
  });

  createPostForm.addEventListener("submit", async e => {
    e.preventDefault();
    const createPostSelect = document.querySelector("#createPostSelect");
    let postInput = document.querySelector("#postInput");
    let createResponse = document.querySelector("#createResponse");
    createResponse.innerHTML = "";

    if (createPostSelect.value === "disabled") {
      let error = document.createElement("p");
      error.innerText = "Please select a user";
      createResponse.appendChild(error);
    } else if (!postInput.value) {
      let error = document.createElement("p");
      error.innerText = "Please fill in a post!";
      createResponse.appendChild(error);
    } else {
      let poster_id = createPostSelect.value;
      let body = postInput.value;
      let res = await axios.post("http://localhost:3002/posts/register", {
        poster_id,
        body
      });
      appendPostResponse(res.data);
    }
  });
});

const loadUsers = async () => {
  const usersList = document.querySelector("#usersList");
  const userSelect = document.querySelectorAll(".users");
  usersList.innerHTML = "";
  const response = await axios.get(`http://localhost:3002/users/all`);
  response.data.users.forEach(user => {
    let listItem = document.createElement("li");
    listItem.innerText = `${user.firstname} ${user.lastname}, age ${user.age}`;
    for (let i = 0; i < userSelect.length; i++) {
      let option = document.createElement("option");
      option.value = user.id;
      option.innerText = `${user.firstname} ${user.lastname}`;
      userSelect[i].appendChild(option);
    }
    usersList.appendChild(listItem);
  });
}; // end loadUsers

const addUserFormSubmitted = async e => {
  e.preventDefault();
  const firstname = document.querySelector("#firstNameInput").value;
  const lastname = document.querySelector("#lastNameInput").value;
  const age = document.querySelector("#ageInput").value;
  let response = await axios.post(`http://localhost:3002/users/register`, {
    firstname,
    lastname,
    age
  });
  loadUsers();
}; // end addUserFormSubmitted

const showUserPosts = async data => {
  let allPosts = document.querySelector("#allPosts");
  allPosts.innerHTML = "";
  let posts = data.posts;
  posts.forEach(post => {
    let postInfo = document.createElement("p");
    postInfo.innerHTML = `<b>User:</b> ${post.firstname} ${post.lastname} <b>Post:</b> ${post.body}`;
    allPosts.appendChild(postInfo);
  });
};

const appendPostResponse = async data => {
  let createResponse = document.querySelector("#createResponse");
  createResponse.innerHTML = "";
  let post = document.createElement("p");
  post.innerText = `Post added: ${data.post.body}`;
  createResponse.appendChild(post);
};
