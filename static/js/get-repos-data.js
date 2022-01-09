const result = fetch("http://localhost:8080/api/repos")
  .then((response) => response.json())
  .then((data) => {
    return data;
  });

const getResult = async () => {
  const a = await result;
  console.log(a);
  console.log("Array dimension: " + a.length);
  document.getElementById("project-1").innerHTML = a[1].name;
  document.getElementById("language-1").innerHTML = a[1].language;
  document.getElementById("stars-1").innerHTML = a[1].stargazers_count;
  document.getElementById("watchers-1").innerHTML = a[1].watchers_count;
  document.getElementById("description-1").innerHTML = a[1].description;
};

getResult();